import { JSX, base, preact }    from "../dep.ts"; 
import { Signal }               from "../dep.ts"; 
import { STATE }                from "../dep.ts"     //FIXME: hard-coded

import * as state               from "./state.ts"
import "./state.ts" //needed for now to ensure that new STATE is set


/** @override */
class DetectionContent extends base.FileTableContent {
    /** @override */
    $box_drawing_mode = undefined;
    
    /** @override */
    view_menu_extras(): JSX.Element[] {
        const result: state.RootResultState | null
            = validate_RootResultState(this.props.file.$result.value)
        
        if(result){
            return [
                <ShowSkeletonCheckbox result={result} />
            ]
        }
        else throw Error('RootDetectionContent did not receive a valid Result object')
    }
}


export class DetectionTab extends base.DetectionTab {
    /** @override */
    file_table(): JSX.Element {
        return <base.FileTable 
            sortable        =   {false} 
            files           =   {STATE.files}        //FIXME: hard-coded
            processing      =   {STATE.processing}   //FIXME: hard-coded
            labels_column   =   {false}
            FileTableContent =  {DetectionContent}
        />; 
    }
}


type ShowSkeletonCheckboxProps = {
    result: state.RootResultState
}

class ShowSkeletonCheckbox extends preact.Component<ShowSkeletonCheckboxProps> {
    ref: preact.RefObject<HTMLDivElement> = preact.createRef()

    render(props:ShowSkeletonCheckboxProps): JSX.Element {
        const processed:boolean = ( props.result.status == 'processed')
        const disabled:string   = processed?  '' : 'disabled'
        return <div class={"ui item checkbox show-results-checkbox "+disabled} ref={this.ref}>
            <input 
                type        = "checkbox" 
                checked     = {props.result.$show_skeleton} 
            />
            <label style="padding-top:2px;">Show skeleton</label>
        </div>
    }

    on_click() {
        const $show_skeleton: Signal<boolean> | undefined 
            = this.props.result.$show_skeleton
        
        if($show_skeleton)
            $show_skeleton.value = !$show_skeleton.value
    }

    componentDidMount(): void {
        //need to initialize although docs say works without javascript
        if(this.ref.current)
            $(this.ref.current).checkbox()
    }
}






function validate_RootResultState(x:base.ResultState): state.RootResultState|null {
    if(base.util.has_property_of_type(x, '$show_skeleton', validate_signal)){
        return x;
    }
    else return null;
}

function validate_signal(x:unknown): Signal<boolean>|null {
    if(base.util.is_object(x) 
    && base.util.has_property(x, 'subscribe')
    && base.util.has_property(x, 'value')
    && base.util.has_property(x, 'peek')){
        //TODO: not typesafe!
        return x as Signal<boolean>;
    }
    else return null;
}
