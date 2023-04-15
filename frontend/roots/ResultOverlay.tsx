import { base}                              from "../dep.ts";
import { JSX, Signal, signals }             from "../dep.ts";
import * as state                           from "./state.ts";


type RootsResultOverlaysProps = {
    $result:   state.RootsResultSignal;
} & base.ResultOverlaysProps;


/** @override Overlays  */
export class RootsResultOverlays extends base.ResultOverlays<RootsResultOverlaysProps> {
    /** @override Create a RootsImageOverlay */
    maybe_create_image_overlay(): JSX.Element|null {
        const $result:state.RootsResultSignal = this.props.$result;
        const result:state.RootsResult = this.props.$result.value;
        const $v0 = signals.computed(
            () => $result.$visible.value && !$result.$show_skeleton.value
        )
        const $v1 = signals.computed(
            () => $result.$visible.value && $result.$show_skeleton.value
        )

        const components:JSX.Element[] = []
        if(result.classmap)
            components.push(
                <base.ImageOverlay
                    imagename   = {result.classmap}
                    $visible    = {$v0}
                />
            )
        if(result.skeleton)
            components.push(
                <base.ImageOverlay
                    imagename   = {result.skeleton}
                    $visible    = {$v1}
                />
            )
        
        //if(components.length == 0)  //TODO: some kind of error message
        return <>
            { components }
        </>
    }

    /** @override Return null, no boxes for roots */
    maybe_create_boxoverlay(): null {
        return null;
    }
}
