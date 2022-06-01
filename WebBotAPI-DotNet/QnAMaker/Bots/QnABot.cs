// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.Bot.Builder;
using Microsoft.Bot.Builder.AI.QnA;
using Microsoft.Bot.Schema;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using QnABot;

namespace Microsoft.BotBuilderSamples
{
    public class QnABot : ActivityHandler
    {
        private readonly IConfiguration _configuration;
        private readonly ILogger<QnABot> _logger;
        private readonly IHttpClientFactory _httpClientFactory;
        private readonly IBotTelemetryClient _telemetryClient;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public QnABot(IConfiguration configuration, 
            ILogger<QnABot> logger, 
            IHttpClientFactory httpClientFactory,
            IHttpContextAccessor httpContextAccessor,
            IBotTelemetryClient telemetryClient)
        {
            _configuration = configuration;
            _logger = logger;
            _httpClientFactory = httpClientFactory;
            _telemetryClient = telemetryClient;
            _httpContextAccessor = httpContextAccessor;
        }

        protected override async Task OnMessageActivityAsync(ITurnContext<IMessageActivity> turnContext, CancellationToken cancellationToken)
        {
            var httpClient = _httpClientFactory.CreateClient();

            //var qnaMaker = new QnAMaker(new QnAMakerEndpoint
            //{
            //    KnowledgeBaseId = _configuration["QnAKnowledgebaseId"],
            //    EndpointKey = _configuration["QnAEndpointKey"],
            //    Host = _configuration["QnAEndpointHostName"]
            //},
            //null,
            //httpClient,
            //_telemetryClient);
            var qnaMaker = new CustomQnAMaker(new QnAMakerEndpoint
            {
                KnowledgeBaseId = _configuration["QnAKnowledgebaseId"],
                EndpointKey = _configuration["QnAEndpointKey"],
                Host = _configuration["QnAEndpointHostName"]
            },
            _httpContextAccessor.HttpContext,
            null,
            httpClient,
            _telemetryClient);

            _logger.LogInformation("Calling QnA Maker");

            var options = new QnAMakerOptions { Top = 1 };

            // The actual call to the QnA Maker service.
            var response = await qnaMaker.GetAnswersAsync(turnContext, options);
            if (response != null && response.Length > 0)
            {
                await turnContext.SendActivityAsync(MessageFactory.Text(response[0].Answer), cancellationToken);
            }
            else
            {
                await turnContext.SendActivityAsync(MessageFactory.Text("No QnA Maker answers were found."), cancellationToken);
            }
        }
    }
}
