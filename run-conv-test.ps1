$FileName = "cov-profile"

if (Test-Path $FileName) {
  Remove-Item -Recurse -Force $FileName
}

deno fmt
deno test --coverage=$FileName
deno coverage $FileName
