import { base }         from "../dep.ts";
import { Signal }       from "../dep.ts";


/** `ResultState` with additional attributes for roots.
 *  @override */
export class RootResultState extends base.ResultState {
    /** Flag indicating whether to show normal root segmentation or skeletonized */
    $show_skeleton: Signal<boolean> = new Signal(false);
}


/** @override @see {@link base.AppFileState} */
export class RootAppFileState extends base.AppFileState<RootResultState> {
    /** @override setting a different ResultState class */
    constructor(f:File) {
        super(f, RootResultState)
    }
}

/** @override @see {@link base.AppFileList} */
export class RootAppFileList extends base.AppFileList {
    /** @override */
    AppFileClass = RootAppFileState;
}

/** @override @see {@link base.AppState} */
export class RootAppState extends base.AppState {
    /** Currently loaded files */
    files: RootAppFileList = new RootAppFileList([]);
}


// re-assign STATE
base.set_global_app_state(new RootAppState())

