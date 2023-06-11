import { JSX, base, preact }    from "../dep.ts"; 
import { signals, Signal }      from "../dep.ts"; 

import { RootsResult, DetectionProcessingModule } from "../lib/detection.ts";


/** @override Adding option to show skeletonized class map */
class RootsDetectionContent extends base.SegmentationContent<RootsResult> {

    /** Flag indicating whether to show the normal or the skeletonized class map*/
    $show_skeleton: signals.Signal<boolean> = new signals.Signal(false)

    /** @override */
    view_menu_extras(): JSX.Element[] {
        return [
            <ShowSkeletonCheckbox 
                $result={this.props.$result} 
                $skeleton_on={this.$show_skeleton}
            />
        ]
    }

    /** @override */
    result_overlays(): JSX.Element {
        const $v0 = signals.computed(
            () => this.$result_visible.value && !this.$show_skeleton.value
        )
        const $v1 = signals.computed(
            () => this.$result_visible.value && this.$show_skeleton.value
        )
        return <>
            <base.ImageOverlay 
                imagename   =   {this.props.$result.value.classmap}
                $visible    =   {$v0}
            />
            <base.ImageOverlay 
                imagename   =   {this.props.$result.value.skeleton}
                $visible    =   {$v1}
            />
        </>
    }
}


export class DetectionTab extends base.DetectionTab {
    /** @override */
    file_table(): JSX.Element {
        const appstate:base.AppState = this.props.appstate
        return <base.FileTable 
            sortable        =   {false} 
            $files          =   {appstate.$files}
            $processing     =   {appstate.$processing}
            processingmodule =  {new DetectionProcessingModule()}
            FileTableContent =  {RootsDetectionContent}
        />; 
    }
}



type ShowSkeletonCheckboxProps = {
    $result:        Readonly<Signal<RootsResult>>
    $skeleton_on:   Signal<boolean>
}

function ShowSkeletonCheckbox(props:ShowSkeletonCheckboxProps): JSX.Element {
    const $active: Readonly<Signal<boolean>> = signals.computed(
        () => props.$result.value.status == 'processed'
    )
    return <base.Checkbox 
        $active =   {$active}
        $value  =   {props.$skeleton_on}
        label   =   "Show Skeleton"
    />
}
