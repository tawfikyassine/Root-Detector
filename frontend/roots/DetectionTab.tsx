import { JSX, base, preact }    from "../dep.ts"; 
import { Signal }               from "../dep.ts"; 

import * as state               from "./state.ts"
import { RootsResultOverlays }  from "./ResultOverlay.tsx";


type RootsDetectionContentProps = {
    $result:   state.RootsResultSignal;
} & base.FileTableItemProps;


/** @override */
class RootsDetectionContent extends base.FileTableContent<RootsDetectionContentProps> {
    /** @override No boxes */
    $box_drawing_mode = undefined;
    
    /** @override */
    view_menu_extras(): JSX.Element[] {
        const $result = this.props.$result;
        
        if($result){
            return [
                <ShowSkeletonCheckbox $result={$result} />
            ]
        }
        else throw Error('RootDetectionContent did not receive a valid Result object')
    }

    /** @override */
    result_overlays(): JSX.Element {
        return <RootsResultOverlays 
            $result             =   { this.props.$result } 
        />
    }
}


export class DetectionTab extends base.DetectionTab {
    /** @override */
    file_table(): JSX.Element {
        const appstate:base.AppState = this.props.appstate
        return <base.FileTable 
            sortable        =   {false} 
            files           =   {appstate.files}
            processing      =   {appstate.$processing}
            labels_column   =   {false}
            FileTableContent =  {RootsDetectionContent}
        />; 
    }
}


type ShowSkeletonCheckboxProps = {
    $result: state.RootsResultSignal
}

//TODO: code re-use
class ShowSkeletonCheckbox extends preact.Component<ShowSkeletonCheckboxProps> {
    ref: preact.RefObject<HTMLDivElement> = preact.createRef()

    render(props:ShowSkeletonCheckboxProps): JSX.Element {
        const processed:boolean = ( props.$result.value.status == 'processed')
        //TODO should be also disabled if results are not shown
        const disabled:string   = processed?  '' : 'disabled'
        return <div class={"ui item checkbox show-results-checkbox "+disabled} ref={this.ref}>
            <input 
                type        = "checkbox" 
                checked     = {props.$result.$show_skeleton} 
                onChange    = {this.on_click.bind(this)}
            />
            <label style="padding-top:2px;">Show skeleton</label>
        </div>
    }

    on_click() {
        const $show_skeleton: Signal<boolean> | undefined 
            = this.props.$result.$show_skeleton
        
        if($show_skeleton)
            $show_skeleton.value = !$show_skeleton.value
    }

    componentDidMount(): void {
        //need to initialize although docs say works without javascript
        if(this.ref.current)
            $(this.ref.current).checkbox()
    }
}





