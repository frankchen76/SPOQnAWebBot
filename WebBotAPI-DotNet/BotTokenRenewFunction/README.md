# Bot Token renew Azure Functions

This is an Azure Function to renew the bot token for a user

## Prerequisites

This samples **requires** prerequisites in order to run.

## To try this sample

- Create local.settings.json with the following content
    - CouponDB: the code sample is using the managed Id to access the Sql DB. 

    ```json
    {
      "IsEncrypted": false,
      "Values": {
        "AzureWebJobsStorage": "UseDevelopmentStorage=true",
        "FUNCTIONS_WORKER_RUNTIME": "dotnet",
        "CouponDB": "Data Source=m365x725618-contosodb01.database.windows.net;Authentication=Active Directory Default; Initial Catalog=CouponDB;",
        "WebBot:GetTokenEndpoint": "https://directline.botframework.com/v3/directline/tokens/generate",
        "WebBot:RenewTokenEndpoint": "https://directline.botframework.com/v3/directline/tokens/refresh",
        "WebBot:SBQueueName": "tokenrenewrequest",
        "WebBot:SBConnection": "[servicebus-queue-connectionstring]",
        "WebBot:TokenRenewInterval": 3000
      }
    }
    ```

