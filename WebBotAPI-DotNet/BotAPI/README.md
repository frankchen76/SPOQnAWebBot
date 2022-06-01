# BotAPI

This sample demonstrated the custom API built by .NET Core

## Instruction: 
* run below command to install dotnet core tools
  * dotnet-aspnet-codegenerator ASP.NET Code Generator Cli
  * dotnet-ef: Entity Framework Core Cli
```
dotnet tool install -g dotnet-aspnet-codegenerator
dotnet tool install -g dotnet-ef
```
* run below steps to install the dependencies. installing "Microsoft.Data.SqlClient" allows you to use various "Authentication" method for Azure SQL DB. If you have class project to contain those model and context file, you just need "Microsoft.VisualStudio.Web.CodeGeneration.Design" and "Microsoft.EntityFrameworkCore.Design" assemblies
```
dotnet add package Microsoft.VisualStudio.Web.CodeGeneration.Design
dotnet add package Microsoft.EntityFrameworkCore.Design
dotnet add package Microsoft.EntityFrameworkCore.SqlServer
dotnet add package Microsoft.Data.SqlClient
```
### For code first approach
* create model and dbcontext
* run the following cmd to generate controller class
```
dotnet aspnet-codegenerator controller -name CouponController -async -api -m Coupon -dc CouponContext -outDir Controllers -f
dotnet aspnet-codegenerator controller -name CouponCodeController -async -api -m CouponCode -dc CouponContext -outDir Controllers -f
```
* Run the following cmd to generate the table to Sql database
```
# create a inital migration
dotnet ef migrations add initial
# create another migration
dotnet ef migrations add 20220330

# run the migration
dotnet ef database update

# check the migration status
dotnet ef migrations list
```
### For database first approach
 * run the following command to generate context and model class. You need to use SQL authentication to run the below command. Alternative approach for hiding password is to leverage secret.json approach from VS

```
dotnet ef dbcontext scaffold "Data Source=m365x725618-contosodb01.database.windows.net;Authentication=Active Directory Default;Database=CouponDB;" Microsoft.EntityFrameworkCore.SqlServer -o Models --table WebBots --table WebBotUserTokens --context WebBotDBContext --force

```
 * If you have ConnectStrings configured in appsettings.json, you can use the below syntax
 ```
 dotnet ef dbcontext scaffold Name=ConnectionStrings:CouponDB Microsoft.EntityFrameworkCore.SqlServer -o Models --table WebBots --table WebBotUserTokens --context WebBotDBContext --force
 ```
 * If you run from a class project, you need to use `--startup-project` switch to point to API project. 
 ```
 dotnet ef dbcontext scaffold Name=ConnectionStrings:CouponDB Microsoft.EntityFrameworkCore.SqlServer -o Models --table WebBots --table WebBotUserTokens --context WebBotDBContext --force --startup-project ..\BotAPI\BotAPI.csproj
 ```

### Authentication
* Add the following package for authentication
```
dotnet add package Microsoft.Identity.Web
```
* Create appsettings.json
    * Column Encryption Setting=enabled: enable the Always Encryption option. 
    * Authentication=Active Directory Default: use default authentication which will read from Managed Id
```JSON
{
    "Logging": {
        "LogLevel": {
            "Default": "Information",
            "Microsoft": "Warning",
            "Microsoft.Hosting.Lifetime": "Information"
        }
    },
    "ConnectionStrings": {
        "CouponDB": "Data Source=m365x725618-contosodb01.database.windows.net; Column Encryption Setting=enabled; Authentication=Active Directory Default; Initial Catalog=CouponDB;"
    },
    "AzureAd": {
        "Instance": "https://login.microsoftonline.com/",
        "Domain": "[tenantname]", //m365x000000.onmicrosoft.com
        "ClientId": "[aad-app-id]",
        "TenantId": "common" //use common for multi-tenant, or tenant id for single tenant
    },
    "AllowedHosts": "*"
}```