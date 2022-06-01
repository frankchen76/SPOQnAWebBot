import { BaseComponentContext } from "@microsoft/sp-component-base";
import { IWebBotService } from "../services/WebBotService";

export interface IWebBotProps {
    description: string;
    isDarkTheme: boolean;
    environmentMessage: string;
    hasTeamsContext: boolean;
    userDisplayName: string;
    webBotService: IWebBotService;
    botId: string;
}
