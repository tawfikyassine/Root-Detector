import { JSX, base, Signal, preact, signals }  from "../dep.ts";
import * as state                              from "./state.ts";
import { 
    TrackingInput, 
    TrackingResult,
    TrackingProcessingModule,
}       from "../lib/tracking.ts";




export class TrackingInputFileList 
    extends base.InputFileList<TrackingInput, TrackingResult>{}


    
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
            $files          =   {appstate.$file_pairs}
            $processing     =   {appstate.$processing}
            columns         =   {[
                {label: 'Image 1', width_css_class:'eight'},
                {label: 'Image 2', width_css_class:'eight'},
            ]}
            FileTableContent =  {RootsTrackingContent}
            FileTableRow     =  {RootsTrackingRow}
            processingmodule =  {new TrackingProcessingModule()}
        />
        </>; 
    }
}


class RootsTrackingRow extends base.FileTableRow<TrackingInput, TrackingResult> {
    render(): JSX.Element {
        return <>
        <tr class="ui title table-row" ref={this.tr_ref}>
            <td>
                <i class="dropdown icon"></i>
                {/* <base.FileTableStatusIcons $result={this.props.$result}/> */}
                <label>
                    {this.props.input.image0.name}
                </label>
            </td>
            <td>
                <label>
                    {this.props.input.image1.name}
                </label>
            </td>
        </tr>
        </>
    }
}


class RootsTrackingContent extends base.FileTableContent<TrackingInput, TrackingResult> {
    /** Size of the first displayed image or null if image not yet loaded. 
     *  Forwarded from InputImage. */
    $size0: Signal<base.util.ImageSize|null> = new Signal(null)

    /** Size of the second displayed image or null if image not yet loaded. 
     *  Forwarded from InputImage. */
    $size1: Signal<base.util.ImageSize|null> = new Signal(null)

    image_ref0: preact.RefObject<base.InputImage> = preact.createRef()
    image_ref1: preact.RefObject<base.InputImage> = preact.createRef()

    contentview(): JSX.Element {
        return <>
        <base.ImageContainer>
            <base.ImageControls $imagesize={this.$size0}>
                <base.InputImage 
                    inputfile       = {this.props.input.image0} 
                    $active_file    = {this.props.$active_file}
                    $size           = {this.$size0}
                    $loaded         = {this.props.$loaded}   //TODO: should have a $loaded for each image
                    ref             = {this.image_ref0}
                /> 
            </base.ImageControls>
            
            <base.ImageControls $imagesize={this.$size1}>
                <base.InputImage 
                    inputfile       = {this.props.input.image1} 
                    $active_file    = {this.props.$active_file} 
                    $size           = {this.$size1}
                    $loaded         = {this.props.$loaded}   //TODO: should have a $loaded for each image
                    ref             = {this.image_ref1}
                /> 
            </base.ImageControls>
        </base.ImageContainer>
        </>
    }

    componentDidMount(): void {
        super.componentDidMount?.()

        //workaround for loading images as $active_file is a combination of image names
        //TODO: fix this
        signals.effect( () => {
            if(this.props.input.name == this.props.$active_file.value) {
                this.image_ref0.current?.load_image()
                this.image_ref1.current?.load_image()
            }}
        )
    }
}
