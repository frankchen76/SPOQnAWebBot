import * as ReactDOM from 'react-dom';
import * as React from 'react';
import { BasePanel, IBasePanelOption, PanelResultEnum } from './BasePanel';
import { IWebBotService } from '../../services/WebBotService';
import { WebChatView } from '../WebChatView';
import { WebBotPanelComponent } from '../WebBotPanelComponent';

export interface IWebBotPanelOption extends IBasePanelOption {
    webBotService: IWebBotService;
    botId: string;
    enabled: boolean
}
export class WebBotPanel extends BasePanel {
    public pageTemplate: string;

    constructor(private _configOption: IWebBotPanelOption) {
        super(_configOption);
    }
    public render(): JSX.Element {
        const closeHandler = this._close.bind(this);
        return (
            <WebBotPanelComponent
                webBotService={this._configOption.webBotService}
                botId={this._configOption.botId}
                enabled={this._configOption.enabled} />
            //   <CopyPageComponent
            //     iPageService={this._configOption.iPageService}
            //     selectedPages={this._configOption.selectedPages}
            //     onClose={closeHandler} />
        );
    }
}
