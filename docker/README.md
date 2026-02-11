# Docker Setup

This directory contains Docker configuration for VideoSOS development environment.

## Structure

```
docker/
└── node/
    └── Dockerfile    # Node.js development container
```

## Quick Start

From the project root:

```bash
# Start development environment
make up

# View logs
make logs

# Stop environment
make down
```

## Configuration

### Dockerfile (`node/Dockerfile`)

- **Base Image**: `node:20-alpine` - Lightweight Node.js 20 image
- **Working Directory**: `/app`
- **Dependencies**: Installs git and npm packages
- **Command**: Runs `npm run dev` for hot-reload development

### docker-compose.yml

Main services configuration:

- **Service Name**: `app`
- **Port**: 3000 (host) → 3000 (container)
- **Volumes**:
  - Project directory mounted to `/app` for hot-reload
  - `node_modules` excluded to prevent conflicts
- **Environment**:
  - `NODE_ENV=development`
  - `WATCHPACK_POLLING=true` - Enables file watching in Docker

## Development Workflow

### Starting the Environment

```bash
make up
```

This will:
1. Build the Docker image (first time only)
2. Start the container in detached mode
3. Mount your local code for hot-reload
4. Expose port 3000

### Running Commands in Container

Use `make` commands to run inside the container:

```bash
make shell       # Open interactive shell
make lint        # Run linters
make format      # Format code
make type-check  # Check TypeScript types
make check       # Run all checks
make build       # Build production bundle
```

Or run custom commands:

```bash
docker compose exec app npm install <package>
docker compose exec app npm run <script>
```

### Viewing Logs

```bash
make logs
```

### Stopping the Environment

```bash
make down
```

## Troubleshooting

### Container won't start

Check logs:
```bash
docker compose logs app
```

Rebuild image:
```bash
docker compose build --no-cache
docker compose up -d
```

### Hot reload not working

Restart container:
```bash
make restart
```

### Port already in use

Stop container and check for processes using port 3000:
```bash
make down
lsof -i :3000  # macOS/Linux
```

### Permission issues

The container runs as user `nextjs` (UID 1001) for security. If you have permission issues with mounted volumes, adjust your local file permissions.

## Production Build

For production, you would typically:

1. Create separate `Dockerfile.prod` with multi-stage build
2. Use `docker compose -f docker-compose.prod.yml`
3. Run optimized Next.js build

Example production Dockerfile structure:
```dockerfile
FROM node:20-alpine AS builder
# ... build steps ...

FROM node:20-alpine AS runner
# ... runtime only ...
```

## Environment Variables

Development doesn't require `.env` files as API keys are stored in browser localStorage.

For production, you would add:
```yaml
environment:
  - NEXT_PUBLIC_API_URL=${API_URL}
  - DATABASE_URL=${DATABASE_URL}
```

## Security Notes

- Container runs as non-root user (`nextjs`)
- Only necessary ports exposed
- `.dockerignore` prevents sensitive files from being copied

## See Also

- [DEVELOPMENT.md](../DEVELOPMENT.md) - Full development guide
- [Makefile](../Makefile) - Available commands
- [docker-compose.yml](../docker-compose.yml) - Service configuration

