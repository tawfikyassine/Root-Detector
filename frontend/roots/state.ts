import { base }         from "../dep.ts";
import { Signal }       from "../dep.ts";
import * as detection   from "./detection.ts";
import { export_roots_result }  from "./export.ts";
import { RootsSettings }        from "./settings.ts";
import { TrackingInputFileList} from "./TrackingTab.tsx";


export class RootsInputFile extends base.InputFile {
    /** @override */
    async process(): Promise<RootsResult> {
        return await detection.process_file(this);
    }
}

/** Result with additional attributes for roots */
export class RootsResult extends base.Result {
    /** URL to a skeletonized classmap */
    skeleton: string|null;

    constructor(status?:base.files.ResultStatus, other?:Partial<RootsResult>){
        super(status, other)
        this.skeleton = other?.skeleton ?? null;
    }

    /** @override */
    async export(input: base.InputFile): Promise< Record<string,File> | null> {
        return await export_roots_result(input, this)
    }
}

/** Mixin adding additional attributes for UI*/
function RootsResultSignalMixin<T extends base.Result >(BaseClass: base.util.Constructor<T>){
    const Intermediate = base.ResultSignalMixin(BaseClass)
    return class RootsResultSignal extends Intermediate {
        /** Flag indicating whether to show normal roots segmentation or skeletonized */
        $show_skeleton: Signal<boolean> = new Signal(false);
    }
}

/** Result with additional attributes for UI */
export class RootsResultSignal extends RootsResultSignalMixin(RootsResult){}

/** InputImage with added attributes for UI */
export class RootsInputFileState extends base.InputFileStateMixin(RootsInputFile){}



export class RootsInputFileList 
    extends base.InputFileListMixin(RootsInputFileState, RootsResultSignal) {}



/** @override @see {@link base.AppState} */
export class RootsAppState extends base.AppState<RootsSettings> {
    /** Currently loaded files 
     *  @override */
    files: RootsInputFileList = new RootsInputFileList([]);

    /** Currently loaded file pairs for tracking */
    file_pairs: TrackingInputFileList = new TrackingInputFileList([])

    //TODO:
    /** Which models can be selected in the settings 
     *  @override */
    //available_models: AvailableModelsSignal = new AvailableModelsSignal(undefined)
}

