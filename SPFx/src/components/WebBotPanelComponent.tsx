import * as React from 'react';
import { useState } from "react";
import * as ReactDom from 'react-dom';
import { IWebBotService } from '../services/WebBotService';
import { WebBotPanel } from './Panel/WebBotPanel';
import { Dropdown, IDropdownOption, PrimaryButton, Stack, Toggle } from 'office-ui-fabric-react';
import { WebChatView } from './WebChatView';

export interface WebBotPanelComponentProps {
    webBotService: IWebBotService;
    botId: string;
    enabled: boolean;
}
export const WebBotPanelComponent = (props: WebBotPanelComponentProps) => {
    const [botOptions, setBotOptions] = useState<IDropdownOption[]>([]);
    const [botEnabled, setBotEnabled] = useState<boolean>(props.enabled);
    const [botId, setBotId] = useState<string>(props.botId);
    const [isAdmin, setIsAdmin] = useState<boolean>(false);

    React.useEffect(() => {
        const loadOption = async () => {

            // Get list of avail bots
            const options = await props.webBotService.getBots();
            // check if the current user is SC admin
            const isAdmin = await props.webBotService.isCurrentUserAdmin();
            setIsAdmin(isAdmin);
            setBotOptions(options);

        };
        loadOption();
    }, []);

    // const _isCurrentUserAdmin = async (): Promise<boolean> => {
    //     let sp: SPFI = getSP();
    //     const currentUser = await sp.web.currentUser();
    //     return currentUser.IsSiteAdmin;
    // };

    const _onBotEnabledChange = (ev, checked) => {
        setBotEnabled(checked);
    };
    const _onBotOptionsChange = (event, option?: IDropdownOption, index?: number) => {
        setBotId(option.key.toString());
    };
    const _onApplyClick = () => {
        props.webBotService.updateCurrentUserCustomAction(botId, botEnabled);
        alert("Updated");
    };

    return (
        <Stack tokens={{ childrenGap: 5 }}>
            {isAdmin && <Toggle
                label="Enabled Web Bot for extension"
                checked={botEnabled}
                onText="On"
                offText="Off" onChange={_onBotEnabledChange} />}
            {isAdmin && <Dropdown
                placeholder="Select an Bot"
                label="Select a web bot"
                options={botOptions}
                defaultSelectedKey={botId}
                selectedKey={botId}
                onChange={_onBotOptionsChange}
            />}
            {isAdmin && <PrimaryButton text='Apply' onClick={_onApplyClick} />}
            {botId && <WebChatView webBotService={props.webBotService} botId={botId} />}
        </Stack>
    );
};

