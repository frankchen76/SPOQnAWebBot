using System;
using System.Collections.Generic;

namespace BotAPI.Models
{
    public partial class WebBotUserToken
    {
        public int Id { get; set; }
        public Guid? BotId { get; set; }
        public string? Upn { get; set; }
        public string? UserId { get; set; }
        public string? Token { get; set; }
        public DateTime? TokenExpired { get; set; }
        public string? ConversationId { get; set; }

        public virtual WebBot? Bot { get; set; }
    }
}
