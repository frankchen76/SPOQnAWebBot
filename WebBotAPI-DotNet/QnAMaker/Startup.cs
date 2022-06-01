// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Bot.Builder;
using Microsoft.Bot.Builder.Integration.AspNet.Core;
using Microsoft.Bot.Connector.Authentication;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.ApplicationInsights.Extensibility;
using Microsoft.Bot.Builder.ApplicationInsights;
using Microsoft.Bot.Builder.Integration.ApplicationInsights.Core;

namespace Microsoft.BotBuilderSamples
{
    public class Startup
    {
        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddHttpClient().AddControllers().AddNewtonsoftJson();

            // Add the HttpClientFactory to be used for the QnAMaker calls.
            services.AddHttpClient();

            // Add HttpContext
            services.AddHttpContextAccessor();

            // Create the Bot Framework Authentication to be used with the Bot Adapter.
            services.AddSingleton<BotFrameworkAuthentication, ConfigurationBotFrameworkAuthentication>();

            // Create the Bot Adapter with error handling enabled.
            services.AddSingleton<IBotFrameworkHttpAdapter, AdapterWithErrorHandler>();

            // Add Application Insights services into service collection
            services.AddApplicationInsightsTelemetry();

            // Add the standard telemetry client
            services.AddSingleton<IBotTelemetryClient, BotTelemetryClient>();

            // Create the telemetry middleware to track conversation events
            //services.AddSingleton<TelemetryLoggerMiddleware>();
            services.AddSingleton<TelemetryLoggerMiddleware>(sp => 
            {
                var telmetryClient = sp.GetService<IBotTelemetryClient>();
                return new TelemetryLoggerMiddleware(telmetryClient, true);
            });

            // Add the telemetry initializer middleware
            services.AddSingleton<IMiddleware, TelemetryInitializerMiddleware>();

            // Add telemetry initializer that will set the correlation context for all telemetry items
            services.AddSingleton<ITelemetryInitializer, OperationCorrelationTelemetryInitializer>();

            // Add telemetry initializer that sets the user ID and session ID (in addition to other bot-specific properties, such as activity ID)
            services.AddSingleton<ITelemetryInitializer, TelemetryBotIdInitializer>();

            // Create the bot as a transient. In this case the ASP Controller is expecting an IBot.
            services.AddTransient<IBot, QnABot>();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            app.UseDefaultFiles()
                .UseStaticFiles()
                .UseRouting()
                .UseAuthorization()
                .UseEndpoints(endpoints =>
                {
                    endpoints.MapControllers();
                });

            // app.UseHttpsRedirection();
        }
    }
}
