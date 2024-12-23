# Nuxt Minimal Starter

Look at the [Nuxt documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## Setup

Make sure to install dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm dev

# yarn
yarn dev

# bun
bun run dev
```

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm preview

# yarn
yarn preview

# bun
bun run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.

## Kubernetes Deployment

### Setting up Secrets

Before deploying the application, you need to set up the required secrets:

1. Copy the secrets template to create your secrets file:
   ```bash
   cp k8s/capitalis-ai-test-secrets.template.yaml k8s/capitalis-ai-test-secrets.yaml
   ```

2. Edit `k8s/capitalis-ai-test-secrets.yaml` and replace the placeholder values with your actual secrets:
   - `NUXT_PUBLIC_HANKO_API_URL`: Your Hanko API URL

3. Apply the secrets to your cluster:
   ```bash
   kubectl apply -f k8s/capitalis-ai-test-secrets.yaml
   ```

Note: The secrets file (`k8s/capitalis-ai-test-secrets.yaml`) is gitignored to prevent committing sensitive information.

### Deploying the Application

Deploy the application components:

```bash
# Deploy the application
kubectl apply -f k8s/capitalis-ai-test-deployment.yaml

# Deploy the service
kubectl apply -f k8s/capitalis-ai-test-service.yaml

# Deploy the ingress (if using)
kubectl apply -f k8s/capitalis-ai-test-ingress.yaml
