using Azure.Messaging.ServiceBus;
using BotBiz.Models;
using Newtonsoft.Json;
using System.Net;
using System.Net.Http.Headers;
using System.Text;

namespace BotBiz
{
    public interface IWebBotService
    {
        public Task<BotTokenItem> GetToken(string botId, string upn);
        public Task RenewToken(SBMessage message);
    }
    public class WebBotService : IWebBotService
    {
        private readonly WebBotDBContext _context;
        private readonly WebBotSetting _settings;

        public WebBotService(WebBotDBContext context, WebBotSetting settings)
        {
            _context = context;
            _settings = settings;
        }
        public async Task<BotTokenItem> GetToken(string botId, string upn)
        {
            BotTokenItem ret = null;
            var webBotData = await _context.WebBots.FindAsync(new Guid(botId));

            if (webBotData != null)
            {
                var query = from t in _context.WebBotUserTokens
                            where t.BotId == new Guid(botId) && t.Upn == upn && t.TokenExpired > DateTime.UtcNow
                            select t;

                var result = query.FirstOrDefault();
                if (result == null)
                {
                    ret = await RequestToken(botId, webBotData.BotSecret, upn);
                    if (ret != null)
                    {
                        // Save to DB
                        await SaveToDb(ret, botId, upn);

                        // If TokenRenewInterval is more than 0, automatically renew token
                        if (_settings.TokenRenewInterval > 0)
                        {
                            //Send to Service Bus queue. 
                            await SendSBMessage(ret, botId, upn);
                        }
                    }
                }
                else
                {
                    ret = new BotTokenItem()
                    {
                        Token = result.Token,
                        UserId = result.UserId,
                        ConversationId = result.ConversationId,
                        ExpiredIn = result.TokenExpired.GetValueOrDefault()
                    };
                }
            }
            return ret;                        
        }
        public async Task RenewToken(SBMessage message)
        {
            var webBotData = await _context.WebBots.FindAsync(new Guid(message.BotId));

            if (webBotData != null)
            {
                BotTokenItem token = await RefreshToken(message);
                if (token != null)
                {
                    // Save to DB
                    await SaveToDb(token, message.BotId, message.Upn);

                    //Send to Service Bus queue. 
                    await SendSBMessage(token, message.BotId, message.Upn);
                }
            }
        }
        private async Task<BotTokenItem> RequestToken(string botId, string botSecret, string upn)
        {
            BotTokenItem ret = null;
            // Call the Graph API and retrieve the user's profile.
            string userId = $"dl_{Guid.NewGuid()}";
            HttpClient client = new HttpClient();

            HttpRequestMessage request = new HttpRequestMessage(HttpMethod.Post, _settings.GetTokenEndpoint);
            request.Headers.Authorization = new AuthenticationHeaderValue("Bearer",botSecret);
            request.Content = new StringContent(
                JsonConvert.SerializeObject(
                    new { User = new { Id = userId } }),
                    Encoding.UTF8,
                    "application/json");

            var response = await client.SendAsync(request);

            DirectLineToken directlineToken = null;
            if (response.IsSuccessStatusCode)
            {
                var body = await response.Content.ReadAsStringAsync();
                directlineToken = JsonConvert.DeserializeObject<DirectLineToken>(body);
                ret = new BotTokenItem
                {
                    Token = directlineToken.token,
                    UserId = userId,
                    ConversationId = directlineToken.conversationId,
                    ExpiredIn = DateTime.UtcNow.AddSeconds(directlineToken.expires_in)
                };

            }
            return ret;

        }
        private async Task<BotTokenItem> RefreshToken(SBMessage message)
        {
            BotTokenItem ret = null;
            HttpClient client = new HttpClient();

            HttpRequestMessage request = new HttpRequestMessage(HttpMethod.Post, _settings.RenewTokenEndpoint);
            request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", message.Token);

            var response = await client.SendAsync(request);

            DirectLineToken directlineToken = null;
            if (response.IsSuccessStatusCode)
            {
                var body = await response.Content.ReadAsStringAsync();
                directlineToken = JsonConvert.DeserializeObject<DirectLineToken>(body);
                ret = new BotTokenItem
                {
                    Token = directlineToken.token,
                    UserId = message.UserId,
                    ConversationId = directlineToken.conversationId,
                    ExpiredIn = DateTime.UtcNow.AddSeconds(directlineToken.expires_in)
                };

            }
            return ret;

        }
        private async Task SaveToDb(BotTokenItem token, string botId, string upn)
        {
            //update database
            var newItem = new WebBotUserToken()
            {
                BotId = new Guid(botId),
                Upn = upn,
                Token = token.Token,
                TokenExpired = token.ExpiredIn,
                ConversationId = token.ConversationId,
                UserId = token.UserId
            };
            await _context.WebBotUserTokens.AddAsync(newItem);
            await _context.SaveChangesAsync();

        }
        private async Task SendSBMessage(BotTokenItem token, string botId, string upn)
        {
            ServiceBusClient client = new ServiceBusClient(_settings.SBConnection);
            ServiceBusSender sender = client.CreateSender(_settings.SBQueueName);

            try
            {
                ServiceBusMessage message = new ServiceBusMessage(new SBMessage(botId, upn,token.Token, token.UserId).ToJson());
                //await sender.ScheduleMessageAsync(message, DateTimeOffset.Now.AddMinutes(50));
                await sender.ScheduleMessageAsync(message, DateTimeOffset.Now.AddSeconds(_settings.TokenRenewInterval));

            }
            finally
            {
                // Calling DisposeAsync on client types is required to ensure that network
                // resources and other unmanaged objects are properly cleaned up.
                await sender.DisposeAsync();
                await client.DisposeAsync();

            }

        }
    }

}
