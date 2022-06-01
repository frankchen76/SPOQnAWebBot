using BotBiz.Models;

namespace BotBiz
{
    public class BotTokenItem
    {
        public string Token { get; set; }
        public string UserId { get; set; }
        public string ConversationId { get; set; }
        public DateTime ExpiredIn { get; set; }

        //public WebBotUserToken ToWebBotUserToken(string botId, string upn)
        //{
        //    return new WebBotUserToken()
        //    {
        //        BotId = new Guid(botId),
        //        Token = Token,
        //        UserId = UserId,
                
        //    }
        //}
    }
}
