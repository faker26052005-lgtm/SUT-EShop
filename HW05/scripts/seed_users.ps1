param([int]$Count = 100, [string]$Base = "http://localhost:3000")
$out = Join-Path $PSScriptRoot "..\data\users.csv"
"email,password" | Out-File $out -Encoding ascii
1..$Count | ForEach-Object {
  $email = "perf{0:D3}@eshop.com" -f $_
  $body = @{ name = "Perf User $_"; email = $email; password = "Perf1234!" } | ConvertTo-Json
  Invoke-RestMethod -Method Post -Uri "$Base/api/register" -ContentType "application/json" -Body $body | Out-Null
  "$email,Perf1234!" | Out-File $out -Append -Encoding ascii
}