param(
  [string]$TaskName = "DailyLuckyApp",
  [string]$ProjectPath = "C:\Users\cz7\daily-lucky",
  [string]$NodePath = "C:\Program Files\nodejs\node.exe",
  [int]$Port = 3000
)

$action = New-ScheduledTaskAction `
  -Execute "powershell.exe" `
  -Argument "-NoProfile -WindowStyle Hidden -Command `"cd '$ProjectPath'; `$env:PORT='$Port'; & '$NodePath' src/server.js`""

$trigger = New-ScheduledTaskTrigger -AtLogOn
$principal = New-ScheduledTaskPrincipal -UserId $env:USERNAME -LogonType Interactive -RunLevel Limited

try {
  Register-ScheduledTask `
    -TaskName $TaskName `
    -Action $action `
    -Trigger $trigger `
    -Principal $principal `
    -Description "Start Daily Lucky app at user logon" `
    -Force `
    -ErrorAction Stop

  Write-Host "Scheduled task '$TaskName' registered."
} catch {
  Write-Error "Failed to register scheduled task '$TaskName': $($_.Exception.Message)"
  exit 1
}
