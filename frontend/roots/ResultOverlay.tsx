import { base}                              from "../dep.ts";
import { JSX, Signal, ReadonlySignal }      from "../dep.ts";
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
        if(result.classmap && result.skeleton)
            return <RootsImageOverlay 
                imagename       = {result.classmap}
                skeletonimage   = {result.skeleton}
                $visible        = {$result.$visible}
            />
        else return null; //TODO: some kind of error message
    }

    /** @override Return null, no boxes for roots */
    maybe_create_boxoverlay(): null {
        return null;
    }
}



//TODO: maybe create two ImageOverlays instead of extending?

type RootsImageOverlayProps = {
    skeletonimage:  string;
} & base.ImageOverlayProps;


/** @override Image overlay which alternatively displays a skeletonized image */
export class RootsImageOverlay extends base.ImageOverlay<RootsImageOverlayProps> {
    skeleton_src: Signal<string|undefined> = new Signal();

    /** @override */
    async componentDidMount(): Promise<void> {
        super.componentDidMount()
        this.skeleton_src.value = await base.fetch_image_as_blob(this.props.skeletonimage)
    }
}
