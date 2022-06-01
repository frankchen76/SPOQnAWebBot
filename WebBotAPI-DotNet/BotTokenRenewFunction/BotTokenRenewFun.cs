using System;
using BotBiz;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Host;
using Microsoft.Extensions.Logging;

namespace BotTokenRenewFunction
{
    public class BotTokenRenewFun
    {
        private IWebBotService _webBotService;
        public BotTokenRenewFun(IWebBotService webBotService)
        {
            _webBotService = webBotService;
        }
        [FunctionName("BotTokenRenew")]
        public void Run([ServiceBusTrigger("%WebBot:SBQueueName%", Connection = "WebBot:SBConnection")]string myQueueItem, ILogger log)
        {
            log.LogInformation($"C# ServiceBus queue trigger function processed message: {myQueueItem}");
            try
            {
                SBMessage sbMessage = SBMessage.CreateInstance(myQueueItem);
                _webBotService.RenewToken(sbMessage).Wait();
            }
            catch (Exception error)
            {
                log.LogError($"BotTokenRenew function failed: {error}");
            }
        }
    }
}
