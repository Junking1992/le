# ============================================================
#  fetch-subs.ps1 — 从 tvsubtitles.net 下载整季英文字幕
# ------------------------------------------------------------
#  用法（Windows PowerShell 5.1）：
#    powershell -NoProfile -ExecutionPolicy Bypass -File tools\fetch-subs.ps1 -Show 2 -Season 2 -Out subtitles\pb
#    powershell -NoProfile -ExecutionPolicy Bypass -File tools\fetch-subs.ps1 -Show 2 -Season 2 -Out subtitles\pb -Ep 1
#
#  参数：
#    -Show   tvsubtitles 内部剧集 id（Prison Break = 2，可在 tvshows.html 里搜到）
#    -Season 季号
#    -Ep     只下某一集（可选，0 = 整季）
#    -Out    输出目录，文件名 S02E01.srt
#    -Force  已存在也重新下
# ============================================================

param(
  [Parameter(Mandatory=$true)][int]$Show,
  [Parameter(Mandatory=$true)][int]$Season,
  [string]$Out = "subtitles",
  [int]$Ep = 0,
  [switch]$Force
)

$ErrorActionPreference = "Stop"
$BASE = "https://www.tvsubtitles.net"
$UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36"
$HDR = @{ "User-Agent" = $UA; "Accept-Language" = "en-US,en;q=0.9" }

function Get-Html([string]$url) {
  $r = Invoke-WebRequest -Uri $url -TimeoutSec 30 -UseBasicParsing -Headers $HDR
  return $r.Content
}

# download-XXX.html 页面用 JS 拼出真实文件地址（s1+s2+s3+s4）
function Resolve-DownloadUrl([string]$subId) {
  $dlPage = Get-Html "$BASE/download-$subId.html"
  $parts = [regex]::Matches($dlPage, "var s\d+\s*=\s*'([^']*)'") | ForEach-Object { $_.Groups[1].Value }
  if ($parts.Count -eq 0) { return $null }
  return $BASE + "/" + ($parts -join "")
}

# 取 zip 或裸 srt 的文本
function Read-SubPayload([byte[]]$bytes, [string]$tmpPath) {
  if ($bytes.Length -gt 2 -and $bytes[0] -eq 0x50 -and $bytes[1] -eq 0x4B) {
    Add-Type -AssemblyName System.IO.Compression.FileSystem
    $zip = [System.IO.Compression.ZipFile]::OpenRead($tmpPath)
    $entry = $zip.Entries | Where-Object { $_.Name -match '\.(srt|ass|ssa|txt)$' } | Select-Object -First 1
    $text = $null
    if ($entry) {
      $sr = New-Object System.IO.StreamReader($entry.Open(), [System.Text.Encoding]::UTF8)
      $text = $sr.ReadToEnd()
      $sr.Close()
    }
    $zip.Dispose()
    return $text
  }
  foreach ($enc in @("utf-8","windows-1252","iso-8859-1")) {
    try {
      $t = [System.Text.Encoding]::GetEncoding($enc).GetString($bytes)
      if ($t -match '-->') { return $t }
    } catch {}
  }
  return $null
}

New-Item -ItemType Directory -Force -Path $Out | Out-Null

Write-Host "获取 S$Season 集列表..." -ForegroundColor Cyan
$seasonHtml = Get-Html "$BASE/tvshow-$Show-$Season.html"
$epIds = @([regex]::Matches($seasonHtml, 'episode-(\d+)\.html') | ForEach-Object { $_.Groups[1].Value } | Select-Object -Unique)
[array]::Reverse($epIds)
Write-Host ("找到 " + $epIds.Count + " 集")

$n = 0
$okCount = 0
$failList = @()

foreach ($eid in $epIds) {
  $n++
  $no = $n
  if ($Ep -gt 0 -and $no -ne $Ep) { continue }

  $outFile = Join-Path $Out ("S{0:D2}E{1:D2}.srt" -f $Season, $no)
  if (-not $Force -and (Test-Path $outFile) -and ((Get-Item $outFile).Length -gt 2000)) {
    Write-Host ("  跳过（已存在）S{0:D2}E{1:D2}" -f $Season, $no) -ForegroundColor DarkGray
    $okCount++
    continue
  }

  Write-Host ("  S{0:D2}E{1:D2} (episode-{2}) ... " -f $Season, $no, $eid) -NoNewline
  try {
    $epHtml = Get-Html "$BASE/episode-$eid.html"

    # 按字幕块里的英文国旗图标（flags/en.gif）定位英文条目，比语言标题可靠
    # （站点是多语言界面，标题可能是 English / Anglais / Englisch ...）
    $subIds = @()
    foreach ($m in [regex]::Matches($epHtml, '<a href="/subtitle-(\d+)\.html">[\s\S]{0,1200}?flags/en\.gif')) {
      $sid = $m.Groups[1].Value
      if ($subIds -notcontains $sid) { $subIds += $sid }
    }
    if ($subIds.Count -eq 0) { Write-Host "没有英文字幕链接" -ForegroundColor Yellow; $failList += $no; continue }

    $saved = $false
    foreach ($sid in $subIds) {
      if ($saved) { break }
      try {
        $fileUrl = Resolve-DownloadUrl $sid
        if (-not $fileUrl) { continue }

        $tmp = Join-Path $env:TEMP ("sub_" + $sid + ".bin")
        Invoke-WebRequest -Uri $fileUrl -OutFile $tmp -TimeoutSec 60 -UseBasicParsing -Headers @{
          "User-Agent" = $UA; "Referer" = "$BASE/download-$sid.html"
        }
        $bytes = [System.IO.File]::ReadAllBytes($tmp)
        $text = Read-SubPayload $bytes $tmp
        Remove-Item $tmp -Force -ErrorAction SilentlyContinue

        if ($text -and $text -match '-->') {
          [System.IO.File]::WriteAllText($outFile, $text, (New-Object System.Text.UTF8Encoding($false)))
          $cues = ([regex]::Matches($text, '-->')).Count
          Write-Host ("ok  {0} 条字幕" -f $cues) -ForegroundColor Green
          $saved = $true
          $okCount++
        }
      } catch {
        # 换下一个版本
      }
      Start-Sleep -Milliseconds 300
    }
    if (-not $saved) { Write-Host "全部版本失败" -ForegroundColor Yellow; $failList += $no }
  } catch {
    Write-Host ("失败: " + $_.Exception.Message) -ForegroundColor Red
    $failList += $no
  }
  Start-Sleep -Milliseconds 400
}

Write-Host ""
Write-Host ("成功 " + $okCount + " 集") -ForegroundColor Cyan
if ($failList.Count -gt 0) {
  Write-Host ("失败/缺失: " + ($failList -join ", ")) -ForegroundColor Yellow
}
Write-Host ("输出目录：" + (Resolve-Path $Out).Path)
