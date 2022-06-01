namespace BotBiz
{
    public class WebBotSetting
    {
        public string GetTokenEndpoint { get; set; }
        public string RenewTokenEndpoint { get; set; }
        public string SBQueueName { get; set; }
        public string SBConnection { get;set; }
        public int TokenRenewInterval { get; set; }
    }
}
