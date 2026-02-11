---
title: Webhooks API | fal.ai Reference
source_url: https://docs.fal.ai/model-apis/model-endpoints/webhooks
fetched_at: 2025-10-27 03:52:30
---

[Skip to main content](#content-area)

[fal home page![light logo](https://mintcdn.com/fal-d8505a2e/_1QeqsRe91WUAOCJ/logo/light.svg?fit=max&auto=format&n=_1QeqsRe91WUAOCJ&q=85&s=04c374284984bf56c89974379f02b7a2)![dark logo](https://mintcdn.com/fal-d8505a2e/_1QeqsRe91WUAOCJ/logo/dark.svg?fit=max&auto=format&n=_1QeqsRe91WUAOCJ&q=85&s=b136c77964ac416a72cb0bcba775d7c7)](https://fal.ai/)

Search...

⌘K

Search...

Navigation

Models Endpoints

Webhooks API | fal.ai Reference

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

- [Successful result](#successful-result)
- [Response errors](#response-errors)
- [Payload errors](#payload-errors)
- [Retry policy](#retry-policy)
- [Verifying Your Webhook](#verifying-your-webhook)
- [Verification Process](#verification-process)
- [Example Implementations](#example-implementations)
- [Usage Notes](#usage-notes)

Here is how this works in practice, it is very similar to submitting something to the queue but we require you to pass an extra `fal_webhook` query parameter.
To utilize webhooks, your requests should be directed to the `queue.fal.run` endpoint, instead of the standard `fal.run`. This distinction is crucial for enabling webhook functionality, as it ensures your request is handled by the queue system designed to support asynchronous operations and notifications.

Report incorrect code

Copy

Ask AI

```
curl --request POST \
  --url 'https://queue.fal.run/fal-ai/flux/dev?fal_webhook=https://url.to.your.app/api/fal/webhook' \
  --header "Authorization: Key $FAL_KEY" \
  --header 'Content-Type: application/json' \
  --data '{
  "prompt": "Photo of a cute dog"
}'
```

The request will be queued and you will get a response with the `request_id` and `gateway_request_id`:

Report incorrect code

Copy

Ask AI

```
{
  "request_id": "024ca5b1-45d3-4afd-883e-ad3abe2a1c4d",
  "gateway_request_id": "024ca5b1-45d3-4afd-883e-ad3abe2a1c4d"
}
```

These two will be mostly the same, but if the request failed and was retried, `gateway_request_id` will have the value of the last tried request, while
`request_id` will be the value used in the queue API.
Once the request is done processing in the queue, a `POST` request is made to the webhook URL, passing the request info and the resulting `payload`. The `status` indicates whether the request was successful or not.

**When to use it?**Webhooks are particularly useful for requests that can take a while to process and/or the result is not needed immediately. For example, if you are training a model, which is a process than can take several minutes or even hours, webhooks could be the perfect tool for the job.

### [​](#successful-result) Successful result

The following is an example of a successful request:

Report incorrect code

Copy

Ask AI

```
{
  "request_id": "123e4567-e89b-12d3-a456-426614174000",
  "gateway_request_id": "123e4567-e89b-12d3-a456-426614174000",
  "status": "OK",
  "payload": {
    "images": [
      {
        "url": "https://url.to/image.png",
        "content_type": "image/png",
        "file_name": "image.png",
        "file_size": 1824075,
        "width": 1024,
        "height": 1024
      }
    ],
    "seed": 196619188014358660
  }
}
```

### [​](#response-errors) Response errors

When an error happens, the `status` will be `ERROR`. The `error` property will contain a message and the `payload` will provide the error details. For example, if you forget to pass the required `model_name` parameter, you will get the following response:

Report incorrect code

Copy

Ask AI

```
{
  "request_id": "123e4567-e89b-12d3-a456-426614174000",
  "gateway_request_id": "123e4567-e89b-12d3-a456-426614174000",
  "status": "ERROR",
  "error": "Invalid status code: 422",
  "payload": {
    "detail": [
      {
        "loc": ["body", "prompt"],
        "msg": "field required",
        "type": "value_error.missing"
      }
    ]
  }
}
```

### [​](#payload-errors) Payload errors

For the webhook to include the payload, it must be valid JSON. So if there is an error serializing it, `payload` is set to `null` and a `payload_error` will include details about the error.

Report incorrect code

Copy

Ask AI

```
{
  "request_id": "123e4567-e89b-12d3-a456-426614174000",
  "gateway_request_id": "123e4567-e89b-12d3-a456-426614174000",
  "status": "OK",
  "payload": null,
  "payload_error": "Response payload is not JSON serializable. Either return a JSON serializable object or use the queue endpoint to retrieve the response."
}
```

### [​](#retry-policy) Retry policy

If the webhook fails to deliver the payload, it will retry 10 times in the span of 2 hours.

### [​](#verifying-your-webhook) Verifying Your Webhook

To ensure the security and integrity of incoming webhook requests, you must verify that they originate from the expected source. This involves validating a cryptographic signature included in the request using a set of public keys. Below is a step-by-step guide to the verification process, followed by example implementations in Python and JavaScript.

#### [​](#verification-process) Verification Process

1

Fetch the JSON Web Key Set (JWKS)

- Retrieve the public keys from the JWKS endpoint: `https://rest.alpha.fal.ai/.well-known/jwks.json`.
- The JWKS contains a list of public keys in JSON format, each with an `x` field holding a base64url-encoded ED25519 public key.
- **Note**: The JWKS is cacheable to reduce network requests. Ensure your implementation caches the keys and refreshes them after the cache duration expires. Do not cache longer than 24 hours since they can change.

2

Extract Required Headers

- Obtain the following headers from the incoming webhook request:
  - `X-Fal-Webhook-Request-Id`: The unique request ID.
  - `X-Fal-Webhook-User-Id`: Your user ID.
  - `X-Fal-Webhook-Timestamp`: The timestamp when the request was generated (in Unix epoch seconds).
  - `X-Fal-Webhook-Signature`: The cryptographic signature in hexadecimal format.
- If any header is missing, the request is invalid.

3

Verify the Timestamp

- Compare the `X-Fal-Webhook-Timestamp` with the current Unix timestamp.
- Allow a leeway of ±5 minutes (300 seconds) to account for clock skew and network delays.
- If the timestamp differs by more than 300 seconds, reject the request to prevent replay attacks.

4

Construct the Message

- Compute the SHA-256 hash of the request body (raw bytes, not JSON-parsed).
- Concatenate the following in strict order, separated by newline characters (`\n`):
  - `X-Fal-Webhook-Request-Id`
  - `X-Fal-Webhook-User-Id`
  - `X-Fal-Webhook-Timestamp`
  - Hex-encoded SHA-256 hash of the request body
- Encode the resulting string as UTF-8 bytes to form the message to verify.

5

Verify the Signature

- Decode the `X-Fal-Webhook-Signature` from hexadecimal to bytes.
- For each public key in the JWKS:
  - Decode the `x` field from base64url to bytes.
  - Use an ED25519 verification function (e.g., from PyNaCl in Python or libsodium in JavaScript) to verify the signature against the constructed message.
- If any key successfully verifies the signature, the request is valid.
- If no key verifies the signature, the request is invalid.

#### [​](#example-implementations) Example Implementations

Below are simplified functions to verify webhook signatures by passing the header values and request body directly. These examples handle the verification process as described above and include JWKS caching.

- python
- javascript

**Install dependencies**:

Report incorrect code

Copy

Ask AI

```
pip install pynacl requests
```

**Verification function**:

Report incorrect code

Copy

Ask AI

```
import base64
import hashlib
import time
from typing import Optional
import requests
from nacl.signing import VerifyKey
from nacl.exceptions import BadSignatureError
from nacl.encoding import HexEncoder

JWKS_URL = "https://rest.alpha.fal.ai/.well-known/jwks.json"
JWKS_CACHE_DURATION = 24 * 60 * 60  # 24 hours in seconds
_jwks_cache = None
_jwks_cache_time = 0

def fetch_jwks() -> list:
    """Fetch and cache JWKS, refreshing after 24 hours."""
    global _jwks_cache, _jwks_cache_time
    current_time = time.time()
    if _jwks_cache is None or (current_time - _jwks_cache_time) > JWKS_CACHE_DURATION:
        response = requests.get(JWKS_URL, timeout=10)
        response.raise_for_status()
        _jwks_cache = response.json().get("keys", [])
        _jwks_cache_time = current_time
    return _jwks_cache

def verify_webhook_signature(
    request_id: str,
    user_id: str,
    timestamp: str,
    signature_hex: str,
    body: bytes
) -> bool:
    """
    Verify a webhook signature using provided headers and body.

    Args:
        request_id: Value of X-Fal-Webhook-Request-Id header.
        user_id: Value of X-Fal-Webhook-User-Id header.
        timestamp: Value of X-Fal-Webhook-Timestamp header.
        signature_hex: Value of X-Fal-Webhook-Signature header (hex-encoded).
        body: Raw request body as bytes.

    Returns:
        bool: True if the signature is valid, False otherwise.
    """
    # Validate timestamp (within ±5 minutes)
    try:
        timestamp_int = int(timestamp)
        current_time = int(time.time())
        if abs(current_time - timestamp_int) > 300:
            print("Timestamp is too old or in the future.")
            return False
    except ValueError:
        print("Invalid timestamp format.")
        return False

    # Construct the message to verify
    try:
        message_parts = [
            request_id,
            user_id,
            timestamp,
            hashlib.sha256(body).hexdigest()
        ]
        if any(part is None for part in message_parts):
            print("Missing required header value.")
            return False
        message_to_verify = "\n".join(message_parts).encode("utf-8")
    except Exception as e:
        print(f"Error constructing message: {e}")
        return False

    # Decode signature
    try:
        signature_bytes = bytes.fromhex(signature_hex)
    except ValueError:
        print("Invalid signature format (not hexadecimal).")
        return False

    # Fetch public keys
    try:
        public_keys_info = fetch_jwks()
        if not public_keys_info:
            print("No public keys found in JWKS.")
            return False
    except Exception as e:
        print(f"Error fetching JWKS: {e}")
        return False

    # Verify signature with each public key
    for key_info in public_keys_info:
        try:
            public_key_b64url = key_info.get("x")
            if not isinstance(public_key_b64url, str):
                continue
            public_key_bytes = base64.urlsafe_b64decode(public_key_b64url)
            verify_key = VerifyKey(public_key_bytes.hex(), encoder=HexEncoder)
            verify_key.verify(message_to_verify, signature_bytes)
            return True
        except (BadSignatureError, Exception) as e:
            print(f"Verification failed with a key: {e}")
            continue

    print("Signature verification failed with all keys.")
    return False
```

#### [​](#usage-notes) Usage Notes

- **Caching the JWKS**: The JWKS can be cached for 24 hours to minimize network requests. The example implementations include basic in-memory caching.
- **Timestamp Validation**: The ±5-minute leeway ensures robustness against minor clock differences. Adjust this value if your use case requires stricter or looser validation.
- **Error Handling**: The examples include comprehensive error handling for missing headers, invalid signatures, and network issues. Log errors appropriately for debugging.
- **Framework Integration**: For frameworks like FastAPI (Python) or Express (JavaScript), ensure the raw request body is accessible. For Express, use `express.raw({ type: 'application/json' })` middleware before JSON parsing.

Was this page helpful?

YesNo

[Queue API | fal.ai Reference

Previous](/model-apis/model-endpoints/queue)[Synchronous Requests API | fal.ai Reference

Next](/model-apis/model-endpoints/synchronous-requests)

⌘I