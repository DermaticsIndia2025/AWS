param(
  [string]$StackName = "ai-skincare-spa",
  [string]$BucketName = "",
  [string]$Region = "us-east-1",
  [string]$PriceClass = "PriceClass_100",
  [string]$Aliases = "",
  [string]$AcmCertificateArn = "",
  [string]$Profile = "",
  [switch]$Invalidate
)

function ThrowIfError($msg) {
  if ($LASTEXITCODE -ne 0) { throw $msg }
}

Write-Host "Building project..." -ForegroundColor Cyan
npm run deploy-prep
if ($LASTEXITCODE -ne 0) { throw "Build failed" }

Write-Host "Packaging site..." -ForegroundColor Cyan
$dist = Join-Path $PSScriptRoot "..\dist"
if (!(Test-Path $dist)) { throw "dist not found. Did build succeed?" }

Write-Host "Ensuring stack $StackName in $Region..." -ForegroundColor Cyan
$template = Join-Path $PSScriptRoot "cloudformation\static-site.yaml"

$paramList = @("ParameterKey=BucketName,ParameterValue=$BucketName","ParameterKey=PriceClass,ParameterValue=$PriceClass")
if ($Aliases -and $Aliases.Trim() -ne "") { $paramList += "ParameterKey=Aliases,ParameterValue=$Aliases" }
if ($AcmCertificateArn -and $AcmCertificateArn.Trim() -ne "") { $paramList += "ParameterKey=AcmCertificateArn,ParameterValue=$AcmCertificateArn" }

${null} = $paramList # avoid printing array
$profileArgs = @()
if ($Profile -and $Profile.Trim() -ne "") { $profileArgs = @("--profile", $Profile) }

aws cloudformation deploy `
  --template-file $template `
  --stack-name $StackName `
  --parameter-overrides $paramList `
  --region $Region `
  @profileArgs
ThrowIfError "Stack deploy failed"

Write-Host "Fetching outputs..." -ForegroundColor Cyan
$stack = aws cloudformation describe-stacks --stack-name $StackName --region $Region @profileArgs | ConvertFrom-Json
$outputs = @{}
foreach ($o in $stack.Stacks[0].Outputs) { $outputs[$o.OutputKey] = $o.OutputValue }
$DistributionId = $outputs.DistributionIdOut
$Bucket = $outputs.BucketNameOut
$Domain = $outputs.DistributionDomainNameOut
Write-Host "Bucket: $Bucket`nDistribution: $DistributionId`nDomain: https://$Domain" -ForegroundColor Green

Write-Host "Syncing files to s3://$Bucket ..." -ForegroundColor Cyan
aws s3 sync $dist "s3://$Bucket" --delete --cache-control max-age=31536000,public --exclude index.html @profileArgs
ThrowIfError "S3 sync (assets) failed"
aws s3 cp (Join-Path $dist "index.html") "s3://$Bucket/index.html" --cache-control no-cache,private @profileArgs
ThrowIfError "S3 upload index.html failed"

if ($Invalidate) {
  Write-Host "Creating CloudFront invalidation for /* ..." -ForegroundColor Cyan
  aws cloudfront create-invalidation --distribution-id $DistributionId --paths "/*" @profileArgs
}

Write-Host "Done. Visit https://$Domain" -ForegroundColor Green


