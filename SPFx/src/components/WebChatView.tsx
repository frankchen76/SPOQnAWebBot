import * as React from "react";
import { DirectLine } from 'botframework-directlinejs';
import ReactWebChat, { createDirectLine } from 'botframework-webchat';
import { PrimaryButton, Spinner } from "office-ui-fabric-react";
import { useContext, useEffect, useState } from "react";
import { WebBotService, IBotTokenItem, IWebBotService } from "../services/WebBotService";
import { BaseComponentContext } from "@microsoft/sp-component-base";

export interface IWebChatViewProps {
    webBotService: IWebBotService;
    botId: string;
}

export const WebChatView = (props: IWebChatViewProps) => {
    const [loading, setLoading] = useState<boolean>(false);
    const [botName, setBotName] = useState<string>();
    const [directLine, setDirectLine] = useState<DirectLine>();
    const [botToken, setBotToken] = useState<string>();
    const [userId, setUserId] = useState<string>();

    console.log(directLine);

    useEffect(() => {
        const loadBotToken = async () => {
            setLoading(true);
            try {
                const botName = await props.webBotService.getBotNameById(props.botId);
                const bToken = await props.webBotService.getBotToken(props.botId);

                setBotName(botName);
                setBotToken(bToken.token);
                setDirectLine(new DirectLine({
                    token: bToken.token
                }));
                setUserId(bToken.userId);
            } catch (error) {
                console.log(error);
            }
            setLoading(false);
        };

        if (props.botId) {
            loadBotToken();
        }

        // setBotToken("ew0KICAiYWxnIjogIlJTMjU2IiwNCiAgImtpZCI6ICJ2cG4yYXhuRjFSU3NHUXg5aXd0WGEwZTNjRWciLA0KICAieDV0IjogInZwbjJheG5GMVJTc0dReDlpd3RYYTBlM2NFZyIsDQogICJ0eXAiOiAiSldUIg0KfQ.ew0KICAiYm90IjogIkJvdC1RbkFUZXN0MDEiLA0KICAic2l0ZSI6ICJJUmlmVGg5Zi1MTSIsDQogICJjb252IjogIkJEZHVhWVc4SVB6M2pad1VzM3phY3YtdXMiLA0KICAidXNlciI6ICJkbF9BN0UyQTNDNy03OThCLTRFQ0YtQUVGNy1BMEFDRjlDRTY0ODciLA0KICAibmJmIjogMTY1MTEyOTIyOSwNCiAgImV4cCI6IDE2NTExMzI4MjksDQogICJpc3MiOiAiaHR0cHM6Ly9kaXJlY3RsaW5lLmJvdGZyYW1ld29yay5jb20vIiwNCiAgImF1ZCI6ICJodHRwczovL2RpcmVjdGxpbmUuYm90ZnJhbWV3b3JrLmNvbS8iDQp9.DFFhaiLO4RQwG2ldZm2ZmhQeUlk5Db8KHOpfeOea76c44Z-KdZB5d2DD8jOt8SW_RJ9UTxFHW5yeu3qHDqgC7hlg1eVKRAsh-_qqZLiwtP179cWvLhvgFlr06vAacuShDqCPYiykexFw1v9JgvvuHfJjRY46AkUAKnO8BM3dDZSqK3v_eHSPKut8oIzhwrWBSwnb6HGo9QVQmyrJFIJ9DIBB2dq7nvFHGItvu_Q1nCBoG5iSfzU0LrP52RM5Zz8dUPnfZo9sVDL2UOa4V-QQm5ytNBHsOHWDza1t_u4EeJ4sH_BdBlWDbtKW4IUin0iGNhJAXLiEpSboo5xehNbxsA");
        // setDirectLine(new DirectLine({
        //     token: "ew0KICAiYWxnIjogIlJTMjU2IiwNCiAgImtpZCI6ICJ2cG4yYXhuRjFSU3NHUXg5aXd0WGEwZTNjRWciLA0KICAieDV0IjogInZwbjJheG5GMVJTc0dReDlpd3RYYTBlM2NFZyIsDQogICJ0eXAiOiAiSldUIg0KfQ.ew0KICAiYm90IjogIkJvdC1RbkFUZXN0MDEiLA0KICAic2l0ZSI6ICJJUmlmVGg5Zi1MTSIsDQogICJjb252IjogIkJEZHVhWVc4SVB6M2pad1VzM3phY3YtdXMiLA0KICAidXNlciI6ICJkbF9BN0UyQTNDNy03OThCLTRFQ0YtQUVGNy1BMEFDRjlDRTY0ODciLA0KICAibmJmIjogMTY1MTEyOTIyOSwNCiAgImV4cCI6IDE2NTExMzI4MjksDQogICJpc3MiOiAiaHR0cHM6Ly9kaXJlY3RsaW5lLmJvdGZyYW1ld29yay5jb20vIiwNCiAgImF1ZCI6ICJodHRwczovL2RpcmVjdGxpbmUuYm90ZnJhbWV3b3JrLmNvbS8iDQp9.DFFhaiLO4RQwG2ldZm2ZmhQeUlk5Db8KHOpfeOea76c44Z-KdZB5d2DD8jOt8SW_RJ9UTxFHW5yeu3qHDqgC7hlg1eVKRAsh-_qqZLiwtP179cWvLhvgFlr06vAacuShDqCPYiykexFw1v9JgvvuHfJjRY46AkUAKnO8BM3dDZSqK3v_eHSPKut8oIzhwrWBSwnb6HGo9QVQmyrJFIJ9DIBB2dq7nvFHGItvu_Q1nCBoG5iSfzU0LrP52RM5Zz8dUPnfZo9sVDL2UOa4V-QQm5ytNBHsOHWDza1t_u4EeJ4sH_BdBlWDbtKW4IUin0iGNhJAXLiEpSboo5xehNbxsA"
        // }));
        // setUserId("dl_A7E2A3C7-798B-4ECF-AEF7-A0ACF9CE6487");

        setInterval(() => {
            const intervalFn = async () => {
                const botToken = await props.webBotService.getBotToken(props.botId);
                setBotToken(botToken.token);
                console.log("retrieve token: ", botToken.token);
            };
            intervalFn();
        }, 1800000);
    }, [props.botId]);
    return (
        <div className="ms-Grid">
            <div className="ms-Grid-row">
                <div className="ms-Grid-col ms-sm12 ms-md12 ms-lg12" >
                    <h2>Web Chat - {botName}</h2>
                </div>
            </div>
            <div className="ms-Grid-row">
                <div className="ms-Grid-col ms-sm12 ms-md12 ms-lg12" >
                    {/* {directLine ? <ReactWebChat directLine={directLine} userID={userId} /> : <Spinner />} */}
                    {loading ? <Spinner /> : directLine ? <ReactWebChat directLine={createDirectLine({ token: botToken })} userID={userId} /> : <div>Cannot load web bot</div>}
                </div>
            </div>

        </div>
    );
};