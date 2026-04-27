const express = require("express");
const cron = require("node-cron");
const dotenv = require("dotenv");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const { spawn } = require("node:child_process");
const localtunnel = require("localtunnel");
const { getDailyHoroscope, SIGNS } = require("./services/horoscope");
const { buildProductLink } = require("./services/amazon");
const { sendNtfyMessage, getNotifyTargetInfo } = require("./services/notify");
const { resolveColor } = require("./services/color");
const { readMetrics, trackClick, trackImpression, updateDailyOptimization, readDailyOptimization } = require("./services/metrics");
const { buildDailyOptimizationMap } = require("./services/optimizer");

dotenv.config();

const app = express();
const port = Number(process.env.PORT || 3000);
const notifyCron = process.env.NOTIFY_CRON || "0 7 * * *";
const timezone = process.env.NOTIFY_TIMEZONE || "Asia/Tokyo";
const defaultSign = process.env.DEFAULT_SIGN || "";
const appVersion = process.env.npm_package_version || "0.0.0";
const enablePublicTunnel = process.env.ENABLE_PUBLIC_TUNNEL === "true";
const publicTunnelProvider = process.env.PUBLIC_TUNNEL_PROVIDER || "cloudflared";
const publicSubdomain = process.env.PUBLIC_SUBDOMAIN || "";
const publicTunnelPort = Number(process.env.PUBLIC_TUNNEL_PORT || port);
const cloudflaredPath =
  process.env.CLOUDFLARED_PATH ||
  "C:\\Users\\cz7\\AppData\\Local\\Microsoft\\WinGet\\Packages\\Cloudflare.cloudflared_Microsoft.Winget.Source_8wekyb3d8bbwe\\cloudflared.exe";
let publicTunnelUrl = "";
let tunnelProcess = null;

app.disable("x-powered-by");
app.use(express.json());
app.use(
  helmet({
    contentSecurityPolicy: false,
  })
);
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 300,
    standardHeaders: true,
    legacyHeaders: false,
  })
);
app.use(express.static("public"));

function enrichEntry(entry, options = {}) {
  const link = buildProductLink(entry.item, options);
  const color = resolveColor(entry.color);
  return {
    ...entry,
    color: color.colorName,
    colorHex: color.colorHex,
    ...link,
  };
}

app.get("/api/today", async (req, res) => {
  try {
    const sign = (req.query.sign || "").toString();
    const list = await getDailyHoroscope(sign);
    const dateKey = new Date().toISOString().slice(0, 10);
    const metrics = readMetrics();
    const dailyMap = readDailyOptimization(dateKey);
    const sourcesUsed = [...new Set(list.flatMap((v) => v.sourcesUsed || [v.source]).filter(Boolean))];
    res.json({
      date: dateKey,
      count: list.length,
      source: list[0]?.source || "unknown",
      sourcesUsed,
      data: list.map((entry) =>
        enrichEntry(entry, {
          dateKey,
          metrics,
          preferredProductId: dailyMap[buildProductLink(entry.item).keywordKey] || "",
        })
      ),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

async function notifyDailyLuck() {
  const list = await getDailyHoroscope(defaultSign);
  const ranked = list.slice(0, 3);
  const dateKey = new Date().toISOString().slice(0, 10);
  const metrics = readMetrics();
  const dailyMap = readDailyOptimization(dateKey);
  const lines = ranked.map((item, idx) => {
    const color = resolveColor(item.color);
    const base = buildProductLink(item.item);
    const link = buildProductLink(item.item, {
      dateKey,
      metrics,
      preferredProductId: dailyMap[base.keywordKey] || "",
    });
    return `${idx + 1}. ${item.sign} | 色: ${color.colorName} | アイテム: ${item.item}\n購入候補: ${link.name} (${link.provider})\n${link.productUrl}`;
  });

  const title = "今日のラッキーアイテム";
  const target = getNotifyTargetInfo();
  const body = `${new Date().toLocaleDateString("ja-JP")} の運勢\n通知先: ${target.endpoint}\n\n${lines.join("\n\n")}`;
  await sendNtfyMessage(title, body);
}

if (process.env.NTFY_TOPIC) {
  cron.schedule(
    notifyCron,
    async () => {
      try {
        await notifyDailyLuck();
        console.log("[cron] notification sent");
      } catch (error) {
        console.error("[cron] notification failed:", error.message);
      }
    },
    { timezone }
  );
  console.log(`[cron] scheduled at "${notifyCron}" (${timezone})`);
} else {
  console.log("[cron] skipped: NTFY_TOPIC is empty");
}

cron.schedule(
  "10 0 * * *",
  () => {
    const dateKey = new Date().toISOString().slice(0, 10);
    const optimization = buildDailyOptimizationMap(readMetrics(), dateKey);
    updateDailyOptimization(dateKey, optimization.map);
    console.log(`[optimizer] daily map updated for ${dateKey}`);
  },
  { timezone }
);

app.get("/api/signs", (req, res) => {
  res.json(SIGNS);
});

app.get("/api/health", async (req, res) => {
  try {
    const list = await getDailyHoroscope(defaultSign);
    res.json({
      ok: true,
      version: appVersion,
      cronEnabled: Boolean(process.env.NTFY_TOPIC),
      notifyCron,
      timezone,
      dataSource: list[0]?.source || "unknown",
      notifyTarget: getNotifyTargetInfo(),
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      version: appVersion,
      error: error.message,
    });
  }
});

app.get("/api/notify-target", (req, res) => {
  const target = getNotifyTargetInfo();
  res.json({
    configured: Boolean(target.topic),
    ...target,
  });
});

app.get("/api/public-url", (req, res) => {
  res.json({
    enabled: enablePublicTunnel,
    url: publicTunnelUrl,
    ready: Boolean(publicTunnelUrl),
  });
});

app.get("/api/metrics", (req, res) => {
  res.json(readMetrics());
});

app.post("/api/click", (req, res) => {
  const productName = (req.body?.productName || "").toString().trim();
  const productId = (req.body?.productId || "").toString().trim();
  const keywordKey = (req.body?.keywordKey || "").toString().trim();
  if (!productName && !productId) {
    res.status(400).json({ ok: false, error: "productName or productId is required" });
    return;
  }
  const count = trackClick({ productName, productId, keywordKey });
  res.json({ ok: true, productName, productId, keywordKey, count });
});

app.post("/api/impression", (req, res) => {
  const productId = (req.body?.productId || "").toString().trim();
  const keywordKey = (req.body?.keywordKey || "").toString().trim();
  if (!productId && !keywordKey) {
    res.status(400).json({ ok: false, error: "productId or keywordKey is required" });
    return;
  }
  const count = trackImpression({ productId, keywordKey });
  res.json({ ok: true, productId, keywordKey, count });
});

app.post("/api/notify-now", async (req, res) => {
  try {
    await notifyDailyLuck();
    res.json({ ok: true });
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
});

app.listen(port, async () => {
  console.log(`daily-lucky running at http://localhost:${port}`);
  const dateKey = new Date().toISOString().slice(0, 10);
  const optimization = buildDailyOptimizationMap(readMetrics(), dateKey);
  updateDailyOptimization(dateKey, optimization.map);

  if (!enablePublicTunnel) {
    console.log("[public] tunnel disabled (ENABLE_PUBLIC_TUNNEL=false)");
    return;
  }

  if (publicTunnelProvider === "cloudflared") {
    try {
      const args = ["tunnel", "--url", `http://localhost:${publicTunnelPort}`];
      tunnelProcess = spawn(cloudflaredPath, args, { stdio: ["ignore", "pipe", "pipe"] });

      const onData = (buf) => {
        const text = buf.toString();
        const matched = text.match(/https:\/\/[-a-z0-9]+\.trycloudflare\.com/i);
        if (matched) {
          publicTunnelUrl = matched[0];
          console.log(`[public] url: ${publicTunnelUrl}`);
        }
      };

      tunnelProcess.stdout.on("data", onData);
      tunnelProcess.stderr.on("data", onData);
      tunnelProcess.on("exit", () => {
        publicTunnelUrl = "";
        tunnelProcess = null;
        console.warn("[public] cloudflared tunnel exited");
      });
      return;
    } catch (error) {
      console.error(`[public] cloudflared start failed: ${error.message}`);
    }
  }

  try {
    const tunnel = await localtunnel({
      port: publicTunnelPort,
      subdomain: publicSubdomain || undefined,
    });
    publicTunnelUrl = tunnel.url;
    console.log(`[public] url: ${publicTunnelUrl}`);

    tunnel.on("close", () => {
      publicTunnelUrl = "";
      console.warn("[public] tunnel closed");
    });
  } catch (error) {
    console.error(`[public] tunnel start failed: ${error.message}`);
  }
});

process.on("SIGINT", () => {
  if (tunnelProcess) {
    tunnelProcess.kill();
  }
  process.exit(0);
});
