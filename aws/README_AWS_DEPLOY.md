## AWS deployment guide (S3 + CloudFront)

This app is a Vite React single-page application. The simplest, fast, and low-cost way to host it on AWS is S3 (static hosting) fronted by CloudFront (global CDN). The provided CloudFormation template creates both, wired with OAC (private S3), and configures SPA-friendly 403/404 fallbacks to `index.html`.

### Prerequisites
- AWS account with permissions for CloudFormation, S3, and CloudFront
- AWS CLI v2 installed and configured: `aws configure`
- Node.js + npm installed
- A globally unique S3 bucket name for your site (e.g. `my-ai-skin-<random>`)
- Optional: a domain in Route 53 and an ACM certificate in `us-east-1` if you want a custom domain

### One-time: Create the infrastructure
The template is in `aws/cloudformation/static-site.yaml`.

Parameters:
- BucketName: required, globally unique S3 bucket name
- PriceClass: CloudFront price class (default `PriceClass_100`)
- Aliases: optional comma-separated custom domains (e.g. `example.com,www.example.com`)
- AcmCertificateArn: optional ACM cert ARN in `us-east-1` for those aliases

You can create the stack via CLI or the included script. Example CLI:

```bash
aws cloudformation deploy \
  --template-file aws/cloudformation/static-site.yaml \
  --stack-name ai-skincare-spa \
  --parameter-overrides BucketName=my-ai-skin-12345 PriceClass=PriceClass_100 \
  --region us-east-1
```

Outputs include the CloudFront domain. You can deploy first without a custom domain, then later update the stack with `Aliases` and `AcmCertificateArn`.

### Build and deploy the app
From the project root:
```powershell
# Windows PowerShell
aws\deploy.ps1 -StackName ai-skincare-spa -BucketName my-ai-skin-12345 -Region us-east-1 -Invalidate
```

The script does:
- `npm run deploy-prep` (env check → build → verify)
- Ensures/updates the CloudFormation stack
- Syncs `dist/` to S3 with long cache for assets and no-cache for `index.html`
- Optionally creates a CloudFront invalidation of `/*`

### Environment variables
This project uses Vite. Supply `GEMINI_API_KEY` at build time via a `.env` file in the project root:

```
GEMINI_API_KEY=your_key_here
```

Never commit real keys. For CI/CD, prefer secure environment variables.

### Custom domain (optional)
1) Request or import an ACM certificate in `us-east-1` for `example.com` and `www.example.com`.
2) Update the stack with aliases and certificate:

```powershell
aws\deploy.ps1 -StackName ai-skincare-spa -BucketName my-ai-skin-12345 -Aliases "example.com,www.example.com" -AcmCertificateArn arn:aws:acm:us-east-1:123456789012:certificate/abc-... -Invalidate
```

3) In Route 53, create an A/AAAA alias record pointing to the CloudFront distribution domain from the stack output.

### CI/CD (optional)
- A ready-to-use GitHub Actions workflow is included at `.github/workflows/deploy-aws.yml`.
- Configure these in your GitHub repo:
  - Secrets:
    - `GEMINI_API_KEY`: your Gemini key
    - Either provide long-lived keys `AWS_ACCESS_KEY_ID` + `AWS_SECRET_ACCESS_KEY`, or configure `AWS_ROLE_TO_ASSUME` with an OIDC trust (recommended)
  - Variables (Repository → Settings → Variables → Actions):
    - `AWS_REGION` (e.g., `us-east-1`)
    - `AWS_STACK_NAME` (e.g., `ai-skincare-spa`)
    - `AWS_BUCKET_NAME` (your globally-unique bucket)
    - Optional: `AWS_PRICE_CLASS` (`PriceClass_100`/`200`/`All`)
    - Optional: `AWS_ALIASES` (e.g., `example.com,www.example.com`)
    - Optional: `AWS_ACM_CERT_ARN` (in `us-east-1`)
    - Optional: `AWS_INVALIDATE` (`true` to invalidate on each deploy)
- The workflow runs on pushes to `main` and on manual triggers (workflow_dispatch).

### Troubleshooting
- 403/404 on deep links: Ensure CloudFront CustomErrorResponses map 403/404 → 200 `/index.html` (already in template).
- AccessDenied from S3: Ensure you are accessing via CloudFront domain, not the bucket website endpoint.
- Stale assets: Pass `-Invalidate` on deployments or version your assets.
- Stack fails on bucket name: Choose a globally unique name and re-run.


