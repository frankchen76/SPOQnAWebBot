# QnA Maker

Bot Framework v4 QnA Maker bot sample

This bot has been created using [Bot Framework](https://dev.botframework.com), it shows how to create a bot that uses the [QnA Maker Cognitive AI](https://www.qnamaker.ai) service.

The [QnA Maker Service](https://www.qnamaker.ai) enables you to build, train and publish a simple question and answer bot based on FAQ URLs, structured documents or editorial content in minutes. In this sample, we demonstrate how to use the QnA Maker service to answer questions based on a FAQ text file used as input.

## Prerequisites

This samples **requires** prerequisites in order to run.

### Overview

- This bot uses [QnA Maker Service](https://www.qnamaker.ai), an AI based cognitive service, to implement simple Question and Answer conversational patterns.

- [.NET Core SDK](https://dotnet.microsoft.com/download) version 3.1

  ```bash
  # determine dotnet version
  dotnet --version
  ```

### Create a QnAMaker Application to enable QnA Knowledge Bases

QnA knowledge base setup and application configuration steps can be found [here](https://aka.ms/qna-instructions).

## To try this sample

- Create appsetings.json with the following content

    ```json
    {
      "MicrosoftAppType": "",
      "MicrosoftAppId": "[bot-aad-appid]",
      "MicrosoftAppPassword": "[bot-aad-appsecret]",
      "MicrosoftAppTenantId": "[tenant-id]",
      "QnAKnowledgebaseId": "[qna-knowledgebase-id]",
      "QnAEndpointKey": "[qna-endpoint-key]",
      "QnAEndpointHostName": "[QnA-endpoint-host-name]",
      "ApplicationInsights": {
        "InstrumentationKey": "[applicaiton-insights-key]"
      }
    }

    ```

## Testing the bot using Bot Framework Emulator

[Bot Framework Emulator](https://github.com/microsoft/botframework-emulator) is a desktop application that allows bot developers to test and debug their bots on localhost or running remotely through a tunnel.

- Install the latest Bot Framework Emulator from [here](https://github.com/Microsoft/BotFramework-Emulator/releases)

### Connect to the bot using Bot Framework Emulator

- Launch Bot Framework Emulator
- File -> Open Bot
- Enter a Bot URL of `http://localhost:3978/api/messages`

