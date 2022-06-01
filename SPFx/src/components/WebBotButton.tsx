import * as React from 'react';
import { useState } from "react";
import * as ReactDom from 'react-dom';
import { Callout, DefaultButton, IconButton, Label, Stack, TextField } from "office-ui-fabric-react";
import { Dialog } from '@microsoft/sp-dialog';
import { ApplicationCustomizerContext } from '@microsoft/sp-application-base';
import styles from './WebBotButton.module.scss';
import { IWebBotService } from '../services/WebBotService';
import { WebBotPanel } from './Panel/WebBotPanel';

export interface WebBotButtonProps {
    webBotService: IWebBotService;
    botId: string;
    enabled: boolean;
}
export const WebBotButton = (props: WebBotButtonProps) => {
    const [isCalloutVisible, setIsCalloutVisible] = useState<Boolean>(false);
    const _onBtnHandler = async (): Promise<void> => {
        let panel = new WebBotPanel({
            webBotService: props.webBotService,
            botId: props.botId,
            enabled: props.enabled,
            headerText: 'Bot',
            closeButtonAriaLabel: 'Close',
            isFooterAtBottom: false,
            hideFooter: true
        });
        let result = await panel.show();

    };
    return (
        <div className={styles.webbotdiv}>
            <DefaultButton
                className={`${styles.webbotBtn} ${styles.hidetab}`}
                text="WebBot"
                iconProps={{ iconName: 'ChatBot' }}
                onClick={_onBtnHandler}
                allowDisabledFocus />
        </div>
    );
};

