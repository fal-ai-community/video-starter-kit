# AI Video Starting Kit

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![fal.ai](https://img.shields.io/badge/fal.ai-latest-purple)](https://fal.ai)
[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org)
[![Remotion](https://img.shields.io/badge/Remotion-latest-blue)](https://remotion.dev)

A powerful starting kit for building AI-powered video applications. Built with Next.js, Remotion, and fal.ai, this toolkit simplifies the complexities of working with AI video models in the browser.

![AI Video Starting Kit](https://github.com/fal-ai-community/video-starter-kit/blob/main/src/app/opengraph-image.png?raw=true)

## Features

- 🎬 **Browser-Native Video Processing**: Seamless video handling and composition in the browser
- 🤖 **AI Model Integration**: Direct access to state-of-the-art video models through fal.ai
  - Minimax for video generation
  - Hunyuan for visual synthesis
  - LTX for video manipulation
- 🎵 **Advanced Media Capabilities**:
  - Multi-clip video composition
  - Audio track integration
  - Voiceover support
  - Extended video duration handling
- 🛠️ **Developer Utilities**:
  - Metadata encoding
  - Video processing pipeline
  - Ready-to-use UI components
  - TypeScript support

## Tech Stack

- [fal.ai](https://fal.ai) - AI model infrastructure
- [Next.js](https://nextjs.org) - React framework
- [Remotion](https://remotion.dev) - Video processing
- [IndexedDB](https://developer.mozilla.org/docs/Web/API/IndexedDB_API) - Browser-based storage (no cloud database required)
- [Vercel](https://vercel.com) - Deployment platform
- [UploadThing](https://uploadthing.com) - File upload

## Quick Start

1. Clone the repository:

```bash
git clone https://github.com/fal-ai-community/video-starter-kit
cd video-starter-kit
```

2. Install dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Set up your environment variables:

```bash
cp .env.example .env.local
```

4. Start the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## Contributing

We welcome contributions! See our [Contributing Guide](CONTRIBUTING.md) for more information.

## Community

- [Discord](https://discord.gg/fal-ai) - Join our community
- [GitHub Discussions](https://github.com/fal-ai-community/video-starter-kit/discussions) - For questions and discussions
- [Twitter](https://twitter.com/fal) - Follow us for updates

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Deployment

The easiest way to deploy your application is through [Vercel](https://vercel.com/new?utm_source=fal-ai&utm_medium=default-template&utm_campaign=video-starter-kit).
