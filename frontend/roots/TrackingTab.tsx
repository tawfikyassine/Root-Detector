import { JSX, base, preact }                   from "../dep.ts";
import * as state                              from "./state.ts";
import { TrackingInput, TrackingResult }       from "../lib/tracking.ts";


export class TrackingInputState   extends base.InputFileStateMixin(TrackingInput){}
export class TrackingResultSignal extends base.ResultSignalMixin(TrackingResult){}
export class TrackingInputFileList 
extends base.InputFileListMixin(TrackingInputState, TrackingResultSignal){}


export class TrackingTab extends base.DetectionTab<state.RootsAppState> {
    /** @override Tab comes second. */
    // deno-lint-ignore no-inferrable-types
    is_first: boolean = false;

    /** @override */
    file_table(): JSX.Element {
        const appstate:state.RootsAppState = this.props.appstate
        return <>
        <base.FileTable 
            sortable        =   {false} 
            files           =   {appstate.file_pairs}
            processing      =   {appstate.$processing}
            columns         =   {[
                {label: 'Image 1', width_css_class:'eight'},
                {label: 'Image 2', width_css_class:'eight'},
            ]}
            FileTableContent =  {RootsTrackingContent}
            FileTableRow     =  {RootsTrackingRow}
        />
        </>; 
    }
}


class RootsTrackingRow extends base.FileTableRow<base.FileTableRowProps<TrackingInput, TrackingResult>> {
    render(): JSX.Element {
        return <>
        <tr class="ui title table-row" ref={this.tr_ref}>
            <td>
                <i class="dropdown icon"></i>
                {/* <base.FileTableStatusIcons $result={this.props.$result}/> */}
                <label>
                    {this.props.input.image0.name + '?'}
                </label>
            </td>
            <td>
                <label>
                    {this.props.input.image1.name + '!'}
                </label>
            </td>
        </tr>
        </>
    }
}


class RootsTrackingContent extends base.FileTableContent<base.FileTableRowProps<TrackingInput>> {
    render(): JSX.Element {
        return <>
        <base.ImageContainer>
            <base.ImageControls imagesize={this.props.input.$size}>
                <base.InputImage inputfile={this.props.input} active_file={this.props.active_file} /> 
            </base.ImageControls>
            
            <base.ImageControls imagesize={this.props.input.$size}>
                <base.InputImage inputfile={this.props.input} active_file={this.props.active_file} /> 
            </base.ImageControls>
        </base.ImageContainer>
        </>
    }
}
