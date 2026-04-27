const axios = require("axios");

function getNotifyTargetInfo() {
  const topic = process.env.NTFY_TOPIC || "";
  const baseUrl = process.env.NTFY_BASE_URL || "https://ntfy.sh";
  const endpoint = topic ? `${baseUrl.replace(/\/$/, "")}/${encodeURIComponent(topic)}` : "";
  return { topic, baseUrl, endpoint };
}

async function sendNtfyMessage(title, message) {
  const { topic, endpoint } = getNotifyTargetInfo();
  if (!topic) {
    throw new Error("NTFY_TOPIC が設定されていません");
  }

  await axios.post(endpoint, message, {
    headers: {
      Title: title,
      Priority: "default",
      Tags: "sparkles,calendar",
    },
    timeout: 10000,
  });
}

module.exports = { sendNtfyMessage, getNotifyTargetInfo };
