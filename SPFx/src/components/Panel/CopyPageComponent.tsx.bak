import * as ReactDOM from 'react-dom';
import * as React from 'react';
import { Label, Stack, PrimaryButton, DefaultButton, Spinner, SpinnerSize, Checkbox, IStackStyles, ProgressIndicator } from 'office-ui-fabric-react';
import { cloneDeep, find } from '@microsoft/sp-lodash-subset';
import { IDropdownOption } from "office-ui-fabric-react/lib/Dropdown";
import { IPageServices } from '../../services/IPageServices';
import { IPage } from '../../services/IPage';
import { IPageCopyProgress } from '../../services/IPageCopyProgress';
import { PanelResultEnum } from './BasePanel';

export interface ICopyPageComponentProps {
  selectedPages: IPage[];
  iPageService: IPageServices;
  onClose: (result: PanelResultEnum) => void;
}
export interface ICopyPageComponentState {
  sites: IDropdownOption[];
  loading: boolean;
  message: string;
  sitesProgress: IPageCopyProgress[];
  copying: boolean;
}
export class CopyPageComponent extends React.Component<ICopyPageComponentProps, ICopyPageComponentState> {

  constructor(props: ICopyPageComponentProps) {
    super(props);
    this.state = {
      sites: undefined,
      loading: false,
      copying: false,
      message: undefined,
      sitesProgress: undefined
    };
  }

  public async componentDidMount() {
    this.setState({ loading: true });

    try {
      const sites = await this.props.iPageService.getSites();
      this.setState({
        sites: sites,
        loading: false
      });
    } catch (error) {
      this.setState({
        loading: false,
        message: error
      });
    }
  }

  private _onChange(option: IDropdownOption, ev: React.FormEvent<HTMLElement>, isChecked: boolean): void {
    let newState = cloneDeep(this.state);
    let selectedSite = find(newState.sites, site => site.key == option.key);
    if (selectedSite != null) {
      selectedSite.selected = isChecked;
      this.setState(newState);
    }
  }
  private _copyHandler = async (): Promise<void> => {
    try {
      const selectedSites = this.state.sites.filter(site => site.selected).map(s => s.key.toString());
      this.setState({
        copying: true,
        sitesProgress: this.state.sites.filter(site => site.selected).map(s => { return { title: s.text, site: s.key.toString(), progress: 0 }; })
      });

      await this.props.iPageService.copyPages(this.props.selectedPages, selectedSites, this._onCopyProgress);

      this.setState({ copying: false, message: "Files were copied." });

    } catch (error) {
      console.log(error);
      this.setState({ copying: false, message: error });
    }
  }
  private _onCopyProgress = (progress: IPageCopyProgress) => {
    this.setState((prevState, prevProps) => {
      let newState = cloneDeep(prevState);
      let existSiteProgress = newState.sitesProgress.filter(p => p.site == progress.site);
      if (existSiteProgress && existSiteProgress.length > 0) {
        existSiteProgress[0].progress = progress.progress;
        existSiteProgress[0].message = progress.message;
      }
      return newState;
    });
  }

  public render(): JSX.Element {
    const stackTokens = { childrenGap: 10 };
    const stackStyles: IStackStyles = {
      root: [
        {
          height: 300
        },
        {
          overflow: 'scroll' as 'scroll',
        }
      ],
    };
    let renderCheckbox: JSX.Element[] = this.state.sites ? this.state.sites.map(site => {
      return (<Checkbox label={site.text} title={site.key.toString()} checked={site.selected} onChange={this._onChange.bind(this, site)} />);
    }) : null;

    let renderPages: JSX.Element[] = this.props.selectedPages.map(p => {
      return (<li>{p.FileRef.split("/")[p.FileRef.split("/").length - 1]}</li>);
    });

    let renderProgress: JSX.Element[] = this.state.sitesProgress ? this.state.sitesProgress.map(p => {
      return (<li><a href={p.site} target="_blank"><ProgressIndicator label={p.title} description={p.message} percentComplete={p.progress} /></a></li>);
    }) : null;

    return (
      <Stack tokens={stackTokens}>
        <Label>Source Pages</Label>
        <ul>{renderPages}</ul>
        <Label>Target site collection</Label>
        {this.state.loading ? <Spinner size={SpinnerSize.medium} /> :
          <Stack tokens={stackTokens} styles={stackStyles}>
            {this.state.sites && renderCheckbox}
          </Stack>
        }
        <ul>{renderProgress}</ul>
        <Label>{this.state.message}</Label>
        <Stack horizontal horizontalAlign="space-around">
          <PrimaryButton text="Copy" disabled={this.state.copying} onClick={this._copyHandler} />
          <DefaultButton text="Close" disabled={this.state.copying} onClick={() => { this.props.onClose(PanelResultEnum.Cancel); }} />
        </Stack>
      </Stack>
    );
  }
}
