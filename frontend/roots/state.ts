import { base }         from "../dep.ts";
import { Signal }       from "../dep.ts";
import { RootsSettings, MODELTYPES }    from "./settings.ts";
import { TrackingInputFileList}         from "./TrackingTab.tsx";

import { RootsInputFile, RootsResult } from "../lib/detection.ts";



export class RootsInputFileList extends base.InputFileList<RootsInputFile, RootsResult> {}

export type  AvailableModels = base.settings.AvailableModels<MODELTYPES>
export class AvailableModelsSignal extends Signal<AvailableModels|undefined> {}

/** @override @see {@link base.AppState} */
export class RootsAppState extends base.AppState<RootsSettings> {
    /** Currently loaded files 
     *  @override */
    $files: RootsInputFileList = new Signal([]);

    /** Currently loaded file pairs for tracking */
    $file_pairs: TrackingInputFileList = new TrackingInputFileList([])

    //TODO:
    /** Which models can be selected in the settings 
     *  @override */
    available_models: AvailableModelsSignal = new AvailableModelsSignal(undefined)
}

