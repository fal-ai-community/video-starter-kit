.PHONY: help up down restart logs shell install lint format type-check check build clean

# Docker Compose service name
SERVICE = app

# Help command
help:
	@echo "VideoSOS Development Commands"
	@echo ""
	@echo "Docker Commands:"
	@echo "  make up          - Start development environment"
	@echo "  make down        - Stop development environment"
	@echo "  make restart     - Restart development environment"
	@echo "  make logs        - Show container logs"
	@echo "  make shell       - Open shell in container"
	@echo ""
	@echo "Development Commands:"
	@echo "  make install     - Install dependencies"
	@echo "  make lint        - Run linters (biome + eslint)"
	@echo "  make format      - Format code with biome"
	@echo "  make type-check  - Run TypeScript type checking"
	@echo "  make check       - Run all checks (lint + type-check)"
	@echo "  make build       - Build Next.js application"
	@echo ""
	@echo "Utility Commands:"
	@echo "  make clean       - Remove build artifacts and caches"

# Docker commands
up:
	docker compose up -d

down:
	docker compose down

restart:
	docker compose restart

logs:
	docker compose logs -f $(SERVICE)

shell:
	docker compose exec $(SERVICE) sh

# Development commands (run inside Docker)
install:
	docker compose exec $(SERVICE) npm ci

lint:
	@echo "Running Biome linter..."
	docker compose exec $(SERVICE) npx biome check --write .
	@echo "Running ESLint..."
	docker compose exec $(SERVICE) npm run lint

format:
	@echo "Formatting code with Biome..."
	docker compose exec $(SERVICE) npm run format

type-check:
	@echo "Running TypeScript type check..."
	docker compose exec $(SERVICE) npx tsc --noEmit

check: lint type-check
	@echo "All checks passed!"

build:
	@echo "Building Next.js application..."
	docker compose exec $(SERVICE) npm run build

# Utility commands
clean:
	@echo "Cleaning build artifacts..."
	docker compose exec $(SERVICE) rm -rf .next
	docker compose exec $(SERVICE) rm -rf node_modules/.cache
	@echo "Clean complete!"

