using Microsoft.Bot.Builder.AI.QnA;
using System.Net.Http;
using Microsoft.Bot.Builder;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;

namespace QnABot
{
    public class CustomQnAMaker : QnAMaker
    {
        private readonly HttpContext _httpContext;
        public CustomQnAMaker(
            QnAMakerEndpoint endpoint,
            HttpContext httpContext,
            QnAMakerOptions options = null,
            HttpClient httpClient = null,
            IBotTelemetryClient telemetryClient = null,
            bool logPersonalInformation = false)
            : base(endpoint, options, httpClient, telemetryClient, logPersonalInformation)
        {
            _httpContext = httpContext;
        }
        protected override async Task OnQnaResultsAsync(
                                    QueryResult[] queryResults,
                                    Microsoft.Bot.Builder.ITurnContext turnContext,
                                    Dictionary<string, string> telemetryProperties = null,
                                    Dictionary<string, double> telemetryMetrics = null,
                                    CancellationToken cancellationToken = default(CancellationToken))
        {
            var eventData = await FillQnAEventAsync(
                                    queryResults,
                                    turnContext,
                                    telemetryProperties,
                                    telemetryMetrics,
                                    cancellationToken)
                                .ConfigureAwait(false);

            // Add new property
            string loginName = "Cannot get name";
            if(_httpContext.User!=null && _httpContext.User.Identity !=null)
            {
                loginName= $"name: {_httpContext.User.Identity.Name}";
            }
            eventData.Properties.Add("LoginUser", loginName);

            // Log QnAMessage event
            TelemetryClient.TrackEvent(
                            QnATelemetryConstants.QnaMsgEvent,
                            eventData.Properties,
                            eventData.Metrics
                            );
        }
    }
}
