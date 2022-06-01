using System;
using System.Collections.Generic;

namespace BotAPI.Models
{
    public partial class WebBot
    {
        public WebBot()
        {
            WebBotUserTokens = new HashSet<WebBotUserToken>();
        }

        public Guid Id { get; set; }
        public string? BotName { get; set; }
        public string? BotSecret { get; set; }

        public virtual ICollection<WebBotUserToken> WebBotUserTokens { get; set; }
    }
}
