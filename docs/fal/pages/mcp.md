---
title: Connect fal to Cursor
source_url: https://docs.fal.ai/model-apis/mcp
fetched_at: 2025-10-27 03:52:26
---

[Skip to main content](#content-area)

[fal home page![light logo](https://mintcdn.com/fal-d8505a2e/_1QeqsRe91WUAOCJ/logo/light.svg?fit=max&auto=format&n=_1QeqsRe91WUAOCJ&q=85&s=04c374284984bf56c89974379f02b7a2)![dark logo](https://mintcdn.com/fal-d8505a2e/_1QeqsRe91WUAOCJ/logo/dark.svg?fit=max&auto=format&n=_1QeqsRe91WUAOCJ&q=85&s=b136c77964ac416a72cb0bcba775d7c7)](https://fal.ai/)

Search...

⌘K

Search...

Navigation

Connect fal to Cursor

[![https://mintlify-assets.b-cdn.net/fal-home.svg](https://mintlify-assets.b-cdn.net/fal-home.svg)Home](/)[![https://mintlify-assets.b-cdn.net/model-fal-logo.svg](https://mintlify-assets.b-cdn.net/model-fal-logo.svg)Model APIs](/model-apis)[![https://mintlify-assets.b-cdn.net/server-logo.svg](https://mintlify-assets.b-cdn.net/server-logo.svg)Serverless](/serverless)[![https://mintlify-assets.b-cdn.net/compute-logo.svg](https://mintlify-assets.b-cdn.net/compute-logo.svg)Compute](/compute)

- [Status](https://status.fal.ai/)
- [Community](https://discord.gg/fal-ai)
- [Blog](https://blog.fal.ai/)

- [Introduction](/model-apis)

- [Connect to Cursor](/model-apis/mcp)

- [Quickstart](/model-apis/quickstart)

##### Guides

- [Generate Images from Text Tutorial](/model-apis/guides/generate-images-from-text)
- [Generate Videos from Image Tutorial](/model-apis/guides/generate-videos-from-image)
- [Convert Speech to Text](/model-apis/guides/convert-speech-to-text)
- [Custom Workflow UI](/model-apis/guides/custom-workflow-ui)
- [Use LLMs](/model-apis/guides/use-llms)
- [Using fal within an n8n workflow](/model-apis/guides/n8n)
- [Fastest FLUX in the Planet](/model-apis/fast-flux)
- [Fastest SDXL in the Planet](/model-apis/fast-sdxl)

##### Models Endpoints

- [Introduction](/model-apis/model-endpoints)
- [Queue](/model-apis/model-endpoints/queue)
- [Webhooks](/model-apis/model-endpoints/webhooks)
- [Synchronous Requests](/model-apis/model-endpoints/synchronous-requests)
- [HTTP over WebSockets](/model-apis/model-endpoints/websockets)
- [Server-side integration](/model-apis/model-endpoints/server-side)
- [Workflows](/model-apis/model-endpoints/workflows)

- [Client Libraries](/model-apis/client)

##### Authentication

- [Authentication](/model-apis/authentication)
- [Key-based](/model-apis/authentication/key-based)
- [GitHub](/model-apis/authentication/github)

##### Integrations

- [Next.js](/model-apis/integrations/nextjs)
- [Vercel](/model-apis/integrations/vercel)

##### Real-Time

- [Introduction](/model-apis/real-time)
- [Quickstart](/model-apis/real-time/quickstart)
- [Keeping fal API Secrets Safe](/model-apis/real-time/secrets)

##### Reference

- [Errors](/model-apis/errors)

##### Help & Support

- [FAQ](/model-apis/faq)
- [Support | fal.ai Model APIs Docs](/model-apis/support)

On this page

- [Connect fal to Cursor with MCP](#connect-fal-to-cursor-with-mcp)
- [Step 1: Open Command Palette](#step-1%3A-open-command-palette)
- [Step 2: Search for MCP Settings](#step-2%3A-search-for-mcp-settings)
- [Step 3: Add Custom MCP](#step-3%3A-add-custom-mcp)
- [Step 4: Configure fal Server](#step-4%3A-configure-fal-server)
- [What You Can Do With MCP](#what-you-can-do-with-mcp)
- [What is MCP?](#what-is-mcp%3F)
- [Need Help?](#need-help%3F)

## [​](#connect-fal-to-cursor-with-mcp) Connect fal to Cursor with MCP

The Model Context Protocol (MCP) enables Cursor to access the entire fal documentation and fal.ai website directly within your IDE. This supercharges your development workflow and makes migration seamless by giving you instant access to:

- **Complete documentation** - Browse all fal docs without leaving your IDE
- **API references** - Get real-time information about models, endpoints, and parameters
- **Code examples** - Access working code snippets and best practices instantly
- **Contextual assistance** - AI-powered suggestions based on fal’s complete knowledge base

Follow these simple steps to get started:

### [​](#step-1%3A-open-command-palette) Step 1: Open Command Palette

On Cursor, use `Cmd+Shift+P` (`Ctrl+Shift+P` on Windows) to open up the command palette.

### [​](#step-2%3A-search-for-mcp-settings) Step 2: Search for MCP Settings

Search for “Open MCP settings”.

### [​](#step-3%3A-add-custom-mcp) Step 3: Add Custom MCP

Select **Add custom MCP**. This will open the `mcp.json` file.

### [​](#step-4%3A-configure-fal-server) Step 4: Configure fal Server

In `mcp.json`, add the following configuration:

Report incorrect code

Copy

Ask AI

```
{
  "mcpServers": {
    "fal": {
      "url": "https://docs.fal.ai/mcp"
    }
  }
}
```

That’s it! Save the file and restart Cursor. You now have the complete fal ecosystem at your fingertips.

## [​](#what-you-can-do-with-mcp) What You Can Do With MCP

Once connected, Cursor can:

- **Answer questions** about any fal model, API, or feature using the complete documentation
- **Generate code** with context from fal’s entire knowledge base
- **Debug faster** with instant access to error explanations and solutions
- **Migrate seamlessly** from other platforms with contextual guidance
- **Discover features** you didn’t know existed through intelligent suggestions

## [​](#what-is-mcp%3F) What is MCP?

Model Context Protocol (MCP) is an open protocol that standardizes how applications provide context to LLMs. By connecting Cursor to fal via MCP, you’re giving your AI assistant complete access to fal’s documentation and resources, making it an expert in all things fal.

## [​](#need-help%3F) Need Help?

If you encounter any issues or have questions, please visit our [support page](/model-apis/support) or join our [Discord community](https://discord.gg/fal-ai).

Was this page helpful?

YesNo

[Introduction to Model APIs

Previous](/model-apis)[Quickstart

Next](/model-apis/quickstart)

⌘I