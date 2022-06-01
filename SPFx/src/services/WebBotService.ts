import { AadHttpClientFactory, AadHttpClient } from "@microsoft/sp-http";
import { IDropdownOption } from "office-ui-fabric-react";
import { SPFI, spfi, SPFx } from "@pnp/sp";
import { IWebAddResult } from "@pnp/sp/webs"; import "@pnp/sp/webs";
import "@pnp/sp/clientside-pages/web";
import "@pnp/sp/webs";
import { Web } from "@pnp/sp/webs";
import "@pnp/sp/webs";
import "@pnp/sp/site-users/web";
import "@pnp/sp/user-custom-actions";
import { IUserCustomActionUpdateResult } from '@pnp/sp/user-custom-actions';
import { getSP } from './pnpjsconfig';


export interface TypedHash<T> {
    [key: string]: T;
}
export interface IBotTokenItem {
    token: string;
    userId: string;
    conversationId: string;
    expiredIn: Date;
}
export interface IBotItem {
    id: string;
    botName: string;
}
export interface IWebBotService {
    getBotToken(botId: string): Promise<IBotTokenItem>;
    getBots(): Promise<IDropdownOption[]>;
    getBotNameById(botId: string): Promise<string>;
    isCurrentUserAdmin(): Promise<boolean>;
    updateCurrentUserCustomAction(botId: string, botEnabled: boolean): Promise<void>;
}
export class WebBotService implements IWebBotService {
    private _serviceUrlBase = "https://m365x725618-webbotapi.azurewebsites.net";
    private _resourceEndpoint = "api://f8c93908-51a2-47bd-b283-a49d656c5205";

    constructor(private _aadHttpClientFactory: AadHttpClientFactory) {

    }
    public async getBotNameById(botId: string): Promise<string> {
        const options = await this.getBots();
        const botOption = options.find(o => o.key.toString() == botId);
        return botOption ? botOption.text : "";
    }
    public async getBots(): Promise<IDropdownOption[]> {
        let ret: IDropdownOption[] = null;
        const url = `${this._serviceUrlBase}/api/WebBots`;
        const aadclient = await this._aadHttpClientFactory.getClient(this._resourceEndpoint);
        const response = await aadclient.get(url, AadHttpClient.configurations.v1);
        if (!response.ok) {
            const err = await response.text();
            throw err;
        }

        const result = await response.json() as IBotItem[];
        if (result) {
            ret = result.map(item => {
                return {
                    key: item.id,
                    title: item.botName,
                    text: item.botName
                };
            });
        }
        return ret;

    }
    public async getBotToken(botId: string): Promise<IBotTokenItem> {
        let ret: IBotTokenItem = null;
        // const url = "https://localhost:7046/api/Token/57650015-0CDF-4311-BBA5-A4EB57732546";
        const url = `${this._serviceUrlBase}/api/Token/${botId}`;
        const aadclient = await this._aadHttpClientFactory.getClient(this._resourceEndpoint);
        const response = await aadclient.get(url, AadHttpClient.configurations.v1);
        if (!response.ok) {
            const err = await response.text();
            throw err;
        }

        ret = await response.json() as IBotTokenItem;
        return ret;

    }
    public async updateCurrentUserCustomAction(botId: string, botEnabled: boolean): Promise<void> {
        let sp: SPFI = getSP();
        const uca = sp.web.userCustomActions.getById("fc2fe0b6-fdb9-400a-960f-ff1f20ebe786");

        const newValues: TypedHash<string> = {
            "testMessage": "test",
            "botId": botId,
            "enabled": botEnabled.toString()
        };

        const response: IUserCustomActionUpdateResult = await uca.update(newValues);
        console.log(response);
    }
    public async isCurrentUserAdmin(): Promise<boolean> {
        let sp: SPFI = getSP();
        const currentUser = await sp.web.currentUser();
        return currentUser.IsSiteAdmin;

    }
    public async getWeb(): Promise<any> {
        let sp: SPFI = getSP();
        const result = await sp.web();
        console.log(result);
    }
}