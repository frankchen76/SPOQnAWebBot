using BotBiz;

namespace BotAPI
{
    public static class WebBotServiceExtension
    {
        public static IServiceCollection AddWebBotService(this IServiceCollection services, IConfigurationSection configSection)
        {
            WebBotSetting setting = configSection.Get<WebBotSetting>();
            services.AddSingleton<WebBotSetting>(setting);

            //init WebBotService
            services.AddScoped<IWebBotService, WebBotService>();

            return services;
        }
    }
}
