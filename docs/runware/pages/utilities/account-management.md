---
title: Account Management
source_url: https://runware.ai/docs/en/utilities/account-management
fetched_at: 2025-10-27 03:51:47
---

## [Introduction](#introduction)

The `accountManagement` task provides **programmatic access to your organization's account information**, including team members, API keys, balance, and usage statistics. This enables you to build dashboards, monitoring tools, and administrative interfaces that integrate with your Runware account.

Currently, the `getDetails` operation retrieves comprehensive information about your organization. Additional management operations for editing settings, managing team members, and administering API keys will be available in future updates.

## [Request](#request)

Our API always accepts an array of objects as input, where each object represents a **specific task to be performed**. The structure of the object varies depending on the type of the task. For this section, we will focus on the parameters related to the **account management task**.

The following JSON snippet shows the basic structure of a request object. **All properties are explained in detail in the next section**.

```
[
  {
    "taskType": "accountManagement",
    "taskUUID": "f4dd3dfe-955f-49d5-a785-7e3b633d6e7a",
    "operation": "getDetails"
  }
]
```

---

### [taskType](https://runware.ai/docs/en/utilities/account-management#request-tasktype) string required
:   The type of task to be performed. For this task, the value should be `accountManagement`.

### [taskUUID](https://runware.ai/docs/en/utilities/account-management#request-taskuuid) string required UUID v4
:   When a task is sent to the API you must include a random UUID v4 string using the `taskUUID` parameter. This string is used to match the async responses to their corresponding tasks.

    If you send multiple tasks at the same time, the `taskUUID` will help you match the responses to the correct tasks.

    The `taskUUID` must be unique for each task you send to the API.

### [operation](https://runware.ai/docs/en/utilities/account-management#request-operation) "getDetails" required
:   Specifies the account management operation to perform. Currently supports `"getDetails"` which retrieves comprehensive information about your organization, including team members, API keys, balance, and usage statistics.

## [Response](#response)

Results will be delivered in the format below.

```
{
  "data": [
    {
      "taskType": "accountManagement",
      "taskUUID": "f4dd3dfe-955f-49d5-a785-7e3b633d6e7a",
      "operation": "getDetails",
      "organizationUUID": "a6379343-9ff2-46a0-996b-e4a7b3057c88",
      "organizationName": "Acme Corporation",
      "AIRSource": "acme",
      "balance": 2450.75,
      "team": [
        {
          "name": "John Smith",
          "email": "[email protected]",
          "roles": [
            "Owner"
          ],
          "joinedAt": "2024-01-15T10:30:00Z"
        },
        {
          "name": "Emily Johnson",
          "email": "[email protected]",
          "roles": [
            "Admin"
          ],
          "joinedAt": "2024-03-22T14:20:00Z"
        },
        {
          "name": "Michael Chen",
          "email": "[email protected]",
          "roles": [
            "Developer"
          ],
          "joinedAt": "2024-05-10T09:15:00Z"
        }
      ],
      "apiKeys": [
        {
          "name": "Production API Key",
          "apiKey": "YHluz4gk5KU4ZZWr****************",
          "description": "Main production environment key",
          "createdAt": "2024-01-20T11:00:00Z",
          "enabled": true,
          "requests": 15420,
          "lastUsedAt": "2025-10-12T08:45:30Z"
        },
        {
          "name": "Development API Key",
          "apiKey": "fhVbIFjuDlSwZJgY****************",
          "description": "Testing and development",
          "createdAt": "2024-02-05T16:30:00Z",
          "enabled": true,
          "requests": 3287,
          "lastUsedAt": "2025-10-11T15:22:18Z"
        }
      ],
      "usage": {
        "total": {
          "credits": 48920.50,
          "requests": 2540318
        },
        "today": {
          "credits": 35.80,
          "requests": 1850
        },
        "last7Days": {
          "credits": 412.25,
          "requests": 21400
        },
        "last30Days": {
          "credits": 1685.90,
          "requests": 87560
        }
      }
    }
  ]
}
```

---

### [taskType](https://runware.ai/docs/en/utilities/account-management#response-tasktype) string
:   The API will return the `taskType` you sent in the request. In this case, it will be `accountManagement`. This helps match the responses to the correct task type.

### [taskUUID](https://runware.ai/docs/en/utilities/account-management#response-taskuuid) string UUID v4
:   The API will return the `taskUUID` you sent in the request. This way you can match the responses to the correct request tasks.

### [organizationUUID](https://runware.ai/docs/en/utilities/account-management#response-organizationuuid) string
:   The unique identifier for your organization.

### [organizationName](https://runware.ai/docs/en/utilities/account-management#response-organizationname) string
:   The name of your organization.

### [AIRSource](https://runware.ai/docs/en/utilities/account-management#response-airsource) string
:   Your organization's AIR (Artificial Intelligence Resource) source identifier, used as a prefix when uploading custom models. This identifier follows the format `source:id@version` where `source` is your unique organization identifier.

    For example, if your AIR source is `mycompany`, your custom models would be referenced as `mycompany:100@1`, `mycompany:101@1`, etc.

    You can configure your AIR source in your [organization settings](https://my.runware.ai/organization). Once set, this identifier allows you to upload and reference your own models within the Runware platform using the standardized [AIR system](/docs/en/image-inference/models#air-system).

### [balance](https://runware.ai/docs/en/utilities/account-management#response-balance) number
:   The current credit balance available in your organization's account.

### [team](https://runware.ai/docs/en/utilities/account-management#response-team) array
:   An array containing information about all team members in your organization.

      Properties
    ⁨4⁩ properties 

    `team` » `name` #### [name](https://runware.ai/docs/en/utilities/account-management#response-team-name) string
    :   The full name of the team member.

    `team` » `email` #### [email](https://runware.ai/docs/en/utilities/account-management#response-team-email) string
    :   The email address of the team member.

    `team` » `roles` #### [roles](https://runware.ai/docs/en/utilities/account-management#response-team-roles) "Owner" | "Admin" | "Developer"
    :   An array of roles assigned to the team member. Possible values are `Owner` (full organization control), `Admin` (manage team and settings), or `Developer` (API access and usage).

    `team` » `joinedAt` #### [joinedAt](https://runware.ai/docs/en/utilities/account-management#response-team-joinedat) string
    :   ISO 8601 timestamp indicating when the team member joined the organization.

### [apiKeys](https://runware.ai/docs/en/utilities/account-management#response-apikeys) array
:   An array containing all API keys associated with your organization.

      Properties
    ⁨7⁩ properties 

    `apiKeys` » `name` #### [name](https://runware.ai/docs/en/utilities/account-management#response-apikeys-name) string
    :   The name assigned to this API key for identification purposes.

    `apiKeys` » `apiKey` #### [apiKey](https://runware.ai/docs/en/utilities/account-management#response-apikeys-apikey) string
    :   The API key value, partially masked for security. Only the first characters are visible.

    `apiKeys` » `description` #### [description](https://runware.ai/docs/en/utilities/account-management#response-apikeys-description) string
    :   Optional description providing additional context about the API key's purpose or usage.

    `apiKeys` » `createdAt` #### [createdAt](https://runware.ai/docs/en/utilities/account-management#response-apikeys-createdat) string
    :   ISO 8601 timestamp indicating when the API key was created.

    `apiKeys` » `enabled` #### [enabled](https://runware.ai/docs/en/utilities/account-management#response-apikeys-enabled) boolean
    :   Indicates whether the API key is currently active and can be used for authentication.

    `apiKeys` » `requests` #### [requests](https://runware.ai/docs/en/utilities/account-management#response-apikeys-requests) number
    :   The total number of API requests made using this API key.

    `apiKeys` » `lastUsedAt` #### [lastUsedAt](https://runware.ai/docs/en/utilities/account-management#response-apikeys-lastusedat) string
    :   ISO 8601 timestamp indicating the last time this API key was used for an API request.

### [usage](https://runware.ai/docs/en/utilities/account-management#response-usage) object
:   Detailed usage statistics for your organization across different time periods, including total historical usage, current day, last 7 days, and last 30 days. Each period contains `credits` (total credits consumed) and `requests` (total number of API requests made).

      Properties
    ⁨4⁩ properties 

    `usage` » `total` #### [total](https://runware.ai/docs/en/utilities/account-management#response-usage-total) object
    :   Historical usage statistics for your organization since account creation. Contains `credits` (total credits consumed) and `requests` (total number of API requests made).

    `usage` » `today` #### [today](https://runware.ai/docs/en/utilities/account-management#response-usage-today) object
    :   Usage statistics for the current day. Contains `credits` (credits consumed today) and `requests` (API requests made today).

    `usage` » `last7Days` #### [last7Days](https://runware.ai/docs/en/utilities/account-management#response-usage-last7days) object
    :   Usage statistics for the last 7 days. Contains `credits` (credits consumed) and `requests` (API requests made) during this period.

    `usage` » `last30Days` #### [last30Days](https://runware.ai/docs/en/utilities/account-management#response-usage-last30days) object
    :   Usage statistics for the last 30 days. Contains `credits` (credits consumed) and `requests` (API requests made) during this period.

Ask AI

×

Context: Full page

Include URL of the page

Copy context

AI Provider

Claude

ChatGPT

Mistral

Bing

What would you like to ask?

Ask AI

Send feedback

×

Context: Full page

Email address

Your feedback

Send Feedback

On this page

On this page