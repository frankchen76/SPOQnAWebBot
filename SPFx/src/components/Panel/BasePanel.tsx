import * as ReactDOM from 'react-dom';
import { Panel, ChoiceGroup, PanelType, PrimaryButton, DefaultButton } from 'office-ui-fabric-react';
import * as React from 'react';

export enum PanelResultEnum {
    Cancel = 0,
    Ok = 1
}
export interface IBasePanelOption {
    headerText?: string;
    closeButtonAriaLabel?: string;
    isFooterAtBottom?: boolean;
    hideFooter?: boolean;
}
export abstract class BasePanel {
    protected _domElement: HTMLElement;
    protected _isOpen: boolean;
    protected _currentResolve: (result: PanelResultEnum) => void;
    protected _option: IBasePanelOption;

    constructor(option?: IBasePanelOption) {
        this._domElement = document.createElement('div');
        this._option = option == null ?
            {
                headerText: '',
                closeButtonAriaLabel: 'Close',
                isFooterAtBottom: true,
                hideFooter: false
            } :
            option;
    }

    public abstract render(): JSX.Element;

    protected renderFooterContent = (): JSX.Element => {
        const buttonStyles = { root: { marginRight: 8 } };
        return (
            this._option.isFooterAtBottom &&
            <div>
                <PrimaryButton onClick={this._close.bind(this, PanelResultEnum.Ok)} styles={buttonStyles} text="Ok" />
                <DefaultButton onClick={this._close.bind(this, PanelResultEnum.Cancel)} text="Cancel" />
            </div>
        );
    }

    protected _renderPanel = (): void => {
        ReactDOM.render(<Panel
            headerText={this._option.headerText}
            closeButtonAriaLabel={this._option.closeButtonAriaLabel}
            isOpen={this._isOpen}
            onDismiss={this._close.bind(this, PanelResultEnum.Cancel)}
            //   onDismissed={this._close.bind(this, PanelResultEnum.Cancel)}
            onRenderFooterContent={this.renderFooterContent}
            isFooterAtBottom={this._option.isFooterAtBottom}>
            {this.render()}
        </Panel>
            , this._domElement);

    }

    protected onAfterClose(): void {
        ReactDOM.unmountComponentAtNode(this._domElement);
    }

    public show(): Promise<PanelResultEnum> {
        return new Promise<PanelResultEnum>((resolve, reject) => {
            this._isOpen = true;
            this._renderPanel();
            this._currentResolve = resolve;
        });
    }
    protected _close(panelResult: PanelResultEnum): void {
        this._isOpen = false;
        this._renderPanel();
        this.onAfterClose();
        if (this._currentResolve != null) {
            this._currentResolve(panelResult);
        }
    }
}
