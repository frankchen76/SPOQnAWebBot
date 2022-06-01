import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
    IPropertyPaneConfiguration,
    PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { IReadonlyTheme } from '@microsoft/sp-component-base';

import * as strings from 'WebBotWebPartStrings';
import WebBot from '../../components/WebBot';
import { IWebBotProps } from '../../components/IWebBotProps';
import { PropertyPaneAsyncDropdown } from '../../controls/PropertyPaneAsyncDropdown/PropertyPaneAsyncDropdown';
import { IDropdownOption } from 'office-ui-fabric-react';
import { update, get } from '@microsoft/sp-lodash-subset';
import { IWebBotService, WebBotService } from '../../services/WebBotService';

export interface IWebBotWebPartProps {
    description: string;
    botId: string;
}

export default class WebBotWebPart extends BaseClientSideWebPart<IWebBotWebPartProps> {

    private _isDarkTheme: boolean = false;
    private _environmentMessage: string = '';
    private _webBotService: IWebBotService;

    protected onInit(): Promise<void> {
        this._environmentMessage = this._getEnvironmentMessage();
        this._webBotService = new WebBotService(this.context.aadHttpClientFactory);
        return super.onInit();
    }

    public render(): void {
        const element: React.ReactElement<IWebBotProps> = React.createElement(
            WebBot,
            {
                description: this.properties.description,
                isDarkTheme: this._isDarkTheme,
                environmentMessage: this._environmentMessage,
                hasTeamsContext: !!this.context.sdks.microsoftTeams,
                userDisplayName: this.context.pageContext.user.displayName,
                webBotService: this._webBotService,
                botId: this.properties.botId
            }
        );

        ReactDom.render(element, this.domElement);
    }

    private _getEnvironmentMessage(): string {
        if (!!this.context.sdks.microsoftTeams) { // running in Teams
            return this.context.isServedFromLocalhost ? strings.AppLocalEnvironmentTeams : strings.AppTeamsTabEnvironment;
        }

        return this.context.isServedFromLocalhost ? strings.AppLocalEnvironmentSharePoint : strings.AppSharePointEnvironment;
    }

    protected onThemeChanged(currentTheme: IReadonlyTheme | undefined): void {
        if (!currentTheme) {
            return;
        }

        this._isDarkTheme = !!currentTheme.isInverted;
        const {
            semanticColors
        } = currentTheme;
        this.domElement.style.setProperty('--bodyText', semanticColors.bodyText);
        this.domElement.style.setProperty('--link', semanticColors.link);
        this.domElement.style.setProperty('--linkHovered', semanticColors.linkHovered);

    }

    protected onDispose(): void {
        ReactDom.unmountComponentAtNode(this.domElement);
    }

    protected get dataVersion(): Version {
        return Version.parse('1.0');
    }
    private loadLists(): Promise<IDropdownOption[]> {
        return this._webBotService.getBots();
    }

    private onListChange(propertyPath: string, newValue: any): void {
        const oldValue: any = get(this.properties, propertyPath);
        // store new value in web part properties
        update(this.properties, propertyPath, (): any => { return newValue; });
        // refresh web part
        this.render();
    }

    protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
        return {
            pages: [
                {
                    header: {
                        description: strings.PropertyPaneDescription
                    },
                    groups: [
                        {
                            groupName: strings.BasicGroupName,
                            groupFields: [
                                PropertyPaneTextField('description', {
                                    label: strings.DescriptionFieldLabel
                                }),
                                new PropertyPaneAsyncDropdown('botId', {
                                    label: 'Select Web Bot',
                                    loadOptions: this.loadLists.bind(this),
                                    onPropertyChange: this.onListChange.bind(this),
                                    selectedKey: this.properties.botId
                                })
                            ]
                        }
                    ]
                }
            ]
        };
    }
}

