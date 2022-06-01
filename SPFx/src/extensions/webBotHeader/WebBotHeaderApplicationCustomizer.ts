import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Log } from '@microsoft/sp-core-library';
import {
    BaseApplicationCustomizer, PlaceholderContent, PlaceholderName
} from '@microsoft/sp-application-base';
import { Dialog } from '@microsoft/sp-dialog';

import * as strings from 'WebBotHeaderApplicationCustomizerStrings';
import { WebBotButton } from '../../components/WebBotButton';
import { IWebBotService, WebBotService } from '../../services/WebBotService';
import { getSP } from '../../services/pnpjsconfig';

const LOG_SOURCE: string = 'WebBotHeaderApplicationCustomizer';

/**
 * If your command set uses the ClientSideComponentProperties JSON input,
 * it will be deserialized into the BaseExtension.properties object.
 * You can define an interface to describe it.
 */
export interface IWebBotHeaderApplicationCustomizerProperties {
    // This is an example; replace with your own property
    testMessage: string;
    botId: string;
    enabled: boolean;
}

/** A Custom Action which can be run during execution of a Client Side Application */
export default class WebBotHeaderApplicationCustomizer
    extends BaseApplicationCustomizer<IWebBotHeaderApplicationCustomizerProperties> {

    private _topPlaceholder: PlaceholderContent | undefined;
    private _webBotService: IWebBotService;

    public onInit(): Promise<void> {
        Log.info(LOG_SOURCE, `Initialized ${strings.Title}`);

        let message: string = this.properties.testMessage;
        if (!message) {
            message = '(No properties were provided.)';
        }
        console.log("init WebBotHeaderApplicationCustomizer");

        getSP(this.context);

        this._webBotService = new WebBotService(this.context.aadHttpClientFactory);

        //Dialog.alert(`Hello from ${strings.Title}:\n\n${message}`);
        this.context.placeholderProvider.changedEvent.add(this, this._renderPlaceHolders);

        return Promise.resolve();
    }

    private _onDispose(): void {
        console.log('[HelloWorldApplicationCustomizer._onDispose] Disposed custom top and bottom placeholders.');
    }

    private _renderPlaceHolders(): void {
        console.log("HelloWorldApplicationCustomizer._renderPlaceHolders()");
        console.log(
            "Available placeholders: ",
            this.context.placeholderProvider.placeholderNames
                .map(name => PlaceholderName[name])
                .join(", ")
        );

        if (!this._topPlaceholder) {
            this._topPlaceholder = this.context.placeholderProvider.tryCreateContent(
                PlaceholderName.Top,
                { onDispose: this._onDispose }
            );
        }
        if (this._topPlaceholder) {
            const element = React.createElement(
                WebBotButton,
                {
                    webBotService: this._webBotService,
                    botId: this.properties.botId,
                    enabled: this.properties.enabled
                }
            );
            // const element = React.createElement(
            //     SPFxHeader,
            //     {
            //         text: "(Top property was not defined.)"
            //     }
            // );

            ReactDom.render(element, this._topPlaceholder.domElement);// as React.Component<IHeaderProps, React.ComponentState, any>;

        } else {
            console.error("The expected placeholder (Top) was not found.");
        }

    }

}
