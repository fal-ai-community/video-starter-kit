---
title: Using fal within an n8n workflow
source_url: https://docs.fal.ai/model-apis/guides/n8n
fetched_at: 2025-10-27 03:52:23
---

[Skip to main content](#content-area)

[fal home page![light logo](https://mintcdn.com/fal-d8505a2e/_1QeqsRe91WUAOCJ/logo/light.svg?fit=max&auto=format&n=_1QeqsRe91WUAOCJ&q=85&s=04c374284984bf56c89974379f02b7a2)![dark logo](https://mintcdn.com/fal-d8505a2e/_1QeqsRe91WUAOCJ/logo/dark.svg?fit=max&auto=format&n=_1QeqsRe91WUAOCJ&q=85&s=b136c77964ac416a72cb0bcba775d7c7)](https://fal.ai/)

Search...

⌘K

Search...

Navigation

Guides

Using fal within an n8n workflow

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

- [Prerequisites](#prerequisites)
- [Workflow Overview](#workflow-overview)
- [Step 1: Create Your Workflow](#step-1%3A-create-your-workflow)
- [Step 2: Submit Request (POST)](#step-2%3A-submit-request-post)
- [Add HTTP Request Node](#add-http-request-node)
- [Configure the URL](#configure-the-url)
- [Set Up Authentication](#set-up-authentication)
- [Configure Request Body](#configure-request-body)
- [Execute the Node](#execute-the-node)
- [Step 3: Check Status (GET)](#step-3%3A-check-status-get)
- [Add Second HTTP Request Node](#add-second-http-request-node)
- [Configure Status Check URL](#configure-status-check-url)
- [Set Authentication](#set-authentication)
- [Execute the Node](#execute-the-node-2)
- [Step 4: Retrieve Result (GET)](#step-4%3A-retrieve-result-get)
- [Add Third HTTP Request Node](#add-third-http-request-node)
- [Configure Result URL](#configure-result-url)
- [Set Authentication](#set-authentication-2)
- [Execute the Node](#execute-the-node-3)
- [Testing Your Workflow](#testing-your-workflow)
- [Best Practices](#best-practices)
- [Troubleshooting](#troubleshooting)
- [Next Steps](#next-steps)

## [​](#prerequisites) Prerequisites

- An n8n account (<https://n8n.io/>)
- A fal account (<https://fal.ai/dashboard>)
- A fal API key (generated from your account dashboard)

## [​](#workflow-overview) Workflow Overview

This n8n workflow consists of three main HTTP requests:

1

Submit Request

Send a POST request to initiate content generation

2

Check Status

Poll the status of your request using GET

3

Retrieve Result

Fetch the final generated content

## [​](#step-1%3A-create-your-workflow) Step 1: Create Your Workflow

1

In n8n, create a new workflow

2

Start with a **Manual Trigger** node to initiate the workflow manually

![](https://mintcdn.com/fal-d8505a2e/_1QeqsRe91WUAOCJ/images/n8n/01.webp?fit=max&auto=format&n=_1QeqsRe91WUAOCJ&q=85&s=86505fc90245b94c09161f2a1762d388)

## [​](#step-2%3A-submit-request-post) Step 2: Submit Request (POST)

### [​](#add-http-request-node) Add HTTP Request Node

1

Add an **HTTP Request** node after your trigger

2

Set the **Method** to `POST`

![](https://mintcdn.com/fal-d8505a2e/_1QeqsRe91WUAOCJ/images/n8n/02.webp?fit=max&auto=format&n=_1QeqsRe91WUAOCJ&q=85&s=cd7de677bed6fd24446726e7fdfd5999)

### [​](#configure-the-url) Configure the URL

1

Navigate to [fal.ai](https://fal.ai/dashboard) and select your desired model (e.g., `fal-ai/veo3/fast`)

![](https://mintcdn.com/fal-d8505a2e/_1QeqsRe91WUAOCJ/images/n8n/03.png?fit=max&auto=format&n=_1QeqsRe91WUAOCJ&q=85&s=3f36e5adf0e0359186dc049e83546101)

2

Click on the **API** tab, select “HTTP (cURL)” and “Submit a request”. Copy and save the URL and data JSON as those will be needed for later.

![](https://mintcdn.com/fal-d8505a2e/_1QeqsRe91WUAOCJ/images/n8n/04.png?fit=max&auto=format&n=_1QeqsRe91WUAOCJ&q=85&s=c9b0c680a03dd7291a1457743c8ebb62)

3

Copy the URL (e.g., `https://queue.fal.run/fal-ai/veo3/fast`) and paste it into the URL field in n8n

![](https://mintcdn.com/fal-d8505a2e/_1QeqsRe91WUAOCJ/images/n8n/05.png?fit=max&auto=format&n=_1QeqsRe91WUAOCJ&q=85&s=c1d3192e62f6b9d6868d2ae32e4004dd)

### [​](#set-up-authentication) Set Up Authentication

1

Navigate to [fal.ai API Keys](https://fal.ai/dashboard/keys), create a new key and copy its value.

![](https://mintcdn.com/fal-d8505a2e/_1QeqsRe91WUAOCJ/images/n8n/06.png?fit=max&auto=format&n=_1QeqsRe91WUAOCJ&q=85&s=d2104fe703ca052d8123a24e5f2a85df)

2

Back in n8n, in the **Authentication** section, select **Generic Credential Type**

3

Choose **Header Auth** from the dropdown

4

Click **+ Create new credential**

5

Set:

- **Name**: `Authorization`
- **Value**: `Key YOUR_FAL_KEY`

6

Save the credential and close

![](https://mintcdn.com/fal-d8505a2e/_1QeqsRe91WUAOCJ/images/n8n/07.webp?fit=max&auto=format&n=_1QeqsRe91WUAOCJ&q=85&s=7dc459c9cb98b714d5faa0e7950ae1dc)

### [​](#configure-request-body) Configure Request Body

1

Toggle **Send Body** to `ON`

2

Set **Body Content Type** to `JSON`

3

Choose **Specify Body** as `USING JSON`

![](https://mintcdn.com/fal-d8505a2e/_1QeqsRe91WUAOCJ/images/n8n/08.webp?fit=max&auto=format&n=_1QeqsRe91WUAOCJ&q=85&s=5fc79b5a0908e101aafa7fd35b5d476f)

4

In fal, go again to the model page, select **JSON** from dropdown and copy the payload

![](https://mintcdn.com/fal-d8505a2e/_1QeqsRe91WUAOCJ/images/n8n/09.png?fit=max&auto=format&n=_1QeqsRe91WUAOCJ&q=85&s=6e0c82d5d7c580e9aa49ec9e8ea66ada)

5

Copy the JSON payload and paste it into n8n’s JSON text box

![](https://mintcdn.com/fal-d8505a2e/_1QeqsRe91WUAOCJ/images/n8n/10.png?fit=max&auto=format&n=_1QeqsRe91WUAOCJ&q=85&s=ad419e143400976fa0a08921b391c968)

### [​](#execute-the-node) Execute the Node

1

Click **Execute Node** to test the request. You should receive a response with a request ID.

![](https://mintcdn.com/fal-d8505a2e/_1QeqsRe91WUAOCJ/images/n8n/11.png?fit=max&auto=format&n=_1QeqsRe91WUAOCJ&q=85&s=c8cdd5bb3f4083774e498441e820dbd9)

## [​](#step-3%3A-check-status-get) Step 3: Check Status (GET)

### [​](#add-second-http-request-node) Add Second HTTP Request Node

1

Click on the first HTTP Request node and add another **HTTP Request** node

2

Set the **Method** to `GET`

### [​](#configure-status-check-url) Configure Status Check URL

1

In fal, go to your model’s **API** section and find the **GET** URL for status checking

![](https://mintcdn.com/fal-d8505a2e/_1QeqsRe91WUAOCJ/images/n8n/12.png?fit=max&auto=format&n=_1QeqsRe91WUAOCJ&q=85&s=d8963881f4ac744d8e40644115f0aeaa)

2

Copy this URL and paste it into the URL field

3

You’ll need to replace the request ID from the previous step on this URL, with `{{ $json.request_id }}`

![](https://mintcdn.com/fal-d8505a2e/_1QeqsRe91WUAOCJ/images/n8n/13.webp?fit=max&auto=format&n=_1QeqsRe91WUAOCJ&q=85&s=ded90911ad1c72b9f3dd21e580dfdf63)

### [​](#set-authentication) Set Authentication

1

Use the same **Header Auth** credential created earlier

2

Select your existing **Authorization** credential

### [​](#execute-the-node-2) Execute the Node

1. This will check the status of your generation request.

![](https://mintcdn.com/fal-d8505a2e/_1QeqsRe91WUAOCJ/images/n8n/14.webp?fit=max&auto=format&n=_1QeqsRe91WUAOCJ&q=85&s=80f6186759e48b38a2512042c4fa2c79)

## [​](#step-4%3A-retrieve-result-get) Step 4: Retrieve Result (GET)

### [​](#add-third-http-request-node) Add Third HTTP Request Node

1. Add a final **HTTP Request** node
2. Set the **Method** to `GET`

### [​](#configure-result-url) Configure Result URL

1. Use the result URL provided in the status response by setting the URL to `{{ $json.request_url }}`

### [​](#set-authentication-2) Set Authentication

1. Use the same **Header Auth** credential

### [​](#execute-the-node-3) Execute the Node

This will retrieve your final generated content.

## [​](#testing-your-workflow) Testing Your Workflow

1

Save your workflow

2

Click **Execute Workflow** to run the complete process

3

Monitor each node to ensure successful execution

4

Check the final node output for your generated content

## [​](#best-practices) Best Practices

- **Error Handling**: Add error handling nodes to manage failed requests
- **Delays**: Consider adding **Wait** nodes between status checks to avoid overwhelming the API
- **Conditional Logic**: Use **IF** nodes to check status before proceeding to result retrieval
- **Data Transformation**: Use **Set** nodes to extract and format specific data from responses

## [​](#troubleshooting) Troubleshooting

- **401 Unauthorized**: Check that your API key is correctly set in the authentication header
- **Request ID Missing**: Ensure the first POST request completed successfully and returned a request ID
- **Status Still Processing**: Add appropriate delays between status checks
- **Invalid JSON**: Verify your JSON payload matches the model’s expected format

## [​](#next-steps) Next Steps

Once you have a working workflow, you can:

- Connect it to external triggers (webhooks, schedules, etc.)
- Integrate with other services in your n8n workflow
- Add data processing and transformation steps
- Set up notifications for completed generations

Was this page helpful?

YesNo

[Use LLMs Tutorial

Previous](/model-apis/guides/use-llms)[Fastest FLUX Endpoint

Next](/model-apis/fast-flux)

⌘I