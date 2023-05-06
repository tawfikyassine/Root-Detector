import { JSX, base, preact }                   from "../dep.ts";
import * as state                              from "./state.ts";



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
            labels_column   =   {false}
            FileTableContent =  {RootsTrackingContent}
        />
        </>; 
    }
}


class RootsTrackingContent extends base.FileTableContent {
    render() {
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
