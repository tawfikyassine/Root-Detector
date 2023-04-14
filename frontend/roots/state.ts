import { base }         from "../dep.ts";
import { Signal }       from "../dep.ts";



/** Result with additional attributes for roots */
export class RootsResult extends base.Result {
    /** URL to a skeletonized classmap */
    skeleton?: string;

    constructor(status?:base.files.ResultStatus, other?:Partial<RootsResult>){
        super(status, other)
        this.skeleton = other?.skeleton
    }
}

/** Mixin adding additional attributes for UI*/
function RootsResultSignalMixin<TBase extends base.Result >(BaseClass: base.Constructor<TBase>){
    const Intermediate = base.ResultSignalMixin(BaseClass)
    return class RootsResultSignal extends Intermediate {
        /** Flag indicating whether to show normal roots segmentation or skeletonized */
        $show_skeleton: Signal<boolean> = new Signal(false);
    }
}

export type  RootsResultSignalConstructor = ReturnType<typeof RootsResultSignalMixin<RootsResult>>
export const RootsResultSignal:RootsResultSignalConstructor = RootsResultSignalMixin(RootsResult)
/** Result with additional attributes for UI */
export type  RootsResultSignal = InstanceType<RootsResultSignalConstructor>



export type RootsInputFileListConstructor = ReturnType<typeof base.InputFileListMixin<base.InputFileState, RootsResultSignal>>
export const RootsInputFileList = base.InputFileListMixin(base.InputFileState, RootsResultSignal)
export type  RootsInputFileList = InstanceType<RootsInputFileListConstructor>



/** @override @see {@link base.AppState} */
export class RootsAppState extends base.AppState {
    /** Currently loaded files */
    files: RootsInputFileList = new RootsInputFileList([]);
}

