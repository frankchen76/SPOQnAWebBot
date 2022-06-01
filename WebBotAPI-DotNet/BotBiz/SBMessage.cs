using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Dynamic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BotBiz
{
    public class SBMessage
    {
        public string BotId { get; set; }
        public string Upn { get; set; }
        public string Token { get; set; }
        public string UserId { get; set; }
        public SBMessage(string botId, string upn, string token, string userId)
        {
            BotId = botId;
            Upn = upn;
            Token = token;
            UserId = userId;
         }
        public string ToJson()
        {
            return JsonConvert.SerializeObject(this, Formatting.Indented);
        }
        public static SBMessage CreateInstance(string json)
        {
            return JsonConvert.DeserializeObject<SBMessage>(json);
        }
    }
}
