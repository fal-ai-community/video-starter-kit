# Development Guide

This guide explains how to set up and work with the VideoSOS development environment.

## Prerequisites

- Docker and Docker Compose installed
- Git

## Quick Start with Docker

1. Clone the repository:
```bash
git clone https://github.com/timoncool/videosos
cd videosos
```

2. Start the development environment:
```bash
make up
```

3. Open [http://localhost:3000](http://localhost:3000)

## Available Commands

### Docker Commands

```bash
make up          # Start development environment
make down        # Stop development environment
make restart     # Restart development environment
make logs        # Show container logs
make shell       # Open shell in container
```

### Code Quality Commands

All these commands run inside the Docker container:

```bash
make lint        # Run linters (Biome + ESLint)
make format      # Format code with Biome
make type-check  # Run TypeScript type checking
make check       # Run all checks (lint + type-check)
```

### Build Commands

```bash
make build       # Build Next.js application
make clean       # Remove build artifacts
```

## Development Workflow

### 1. Start Development Server

```bash
make up
```

The Next.js development server will start with hot-reload enabled.

### 2. Make Changes

Edit files in your IDE. Changes will be reflected immediately thanks to hot-reload.

### 3. Check Code Quality

Before committing, run:

```bash
make check
```

This will:
- Run Biome linter and formatter
- Run ESLint
- Run TypeScript type checking

### 4. Format Code

To auto-format your code:

```bash
make format
```

### 5. Access Container Shell

If you need to run commands inside the container:

```bash
make shell
```

## Code Quality Tools

### Biome

Biome is our primary linter and formatter. It's fast and configured in `biome.json`.

Configuration:
- Format style: 2 spaces, double quotes
- Linting: recommended rules enabled
- Auto-fix on save (when using `make lint`)

### ESLint

ESLint with Next.js config for additional React-specific checks.

### TypeScript

Strict type checking is enabled. Run `make type-check` to verify types.

## Pre-commit Hooks

Husky is configured to run formatting before each commit:
- `.husky/pre-commit` - runs `npm run format`

## Troubleshooting

### Port 3000 already in use

```bash
make down
# Kill any process using port 3000
make up
```

### Container not starting

```bash
make logs  # Check logs for errors
```

### Hot reload not working

Try restarting:
```bash
make restart
```

### Clear caches

```bash
make clean
```

## Manual Development (without Docker)

If you prefer to run without Docker:

1. Install dependencies:
```bash
npm install
```

2. Start dev server:
```bash
npm run dev
```

3. Run checks:
```bash
npm run check
```

## Environment Variables

API keys are stored in browser's localStorage. No `.env` file needed for development.

Configure your API keys in the app settings (gear icon).

## Contributing

Before submitting a PR:

1. Run `make check` to ensure code quality
2. Test your changes locally
3. Follow [CONTRIBUTING.md](CONTRIBUTING.md) guidelines
4. Write atomic commits with clear messages

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Biome Documentation](https://biomejs.dev)
- [Remotion Documentation](https://remotion.dev)

