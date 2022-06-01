using BotBiz;
using BotBiz.Models;
using Microsoft.Azure.Functions.Extensions.DependencyInjection;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using System;

[assembly: FunctionsStartup(typeof(BotTokenRenewFunction.Startup))]
namespace BotTokenRenewFunction
{
    internal class Startup : FunctionsStartup
    {
        public override void Configure(IFunctionsHostBuilder builder)
        {
            // Inject the DBContext
            builder.Services.AddDbContext<WebBotDBContext>(opt =>
            {
                string SqlConnection = Environment.GetEnvironmentVariable("CouponDB");
                opt.UseSqlServer(SqlConnection);
            });

            // Inject the WebBotSettings
            //builder.Services.AddOptions<WebBotSetting>()
            //.Configure<IConfiguration>((settings, configuration) =>
            //{
            //    configuration.GetSection("WebBot").Bind(settings);
            //});
            //builder.Services.AddOptions<WebBotSetting>().Configure<IConfiguration>()

            WebBotSetting settings = new WebBotSetting()
            {
                GetTokenEndpoint = Environment.GetEnvironmentVariable("WebBot:GetTokenEndpoint"),
                RenewTokenEndpoint = Environment.GetEnvironmentVariable("WebBot:RenewTokenEndpoint"),
                SBQueueName = Environment.GetEnvironmentVariable("WebBot:SBQueueName"),
                SBConnection = Environment.GetEnvironmentVariable("WebBot:SBConnection"),
                TokenRenewInterval = Convert.ToInt32(Environment.GetEnvironmentVariable("WebBot:TokenRenewInterval"))
            };
            builder.Services.AddSingleton<WebBotSetting>(settings);

            // inject the WebBotService
            builder.Services.AddScoped<IWebBotService, WebBotService>();
        }
    }
}
