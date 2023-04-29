import { base }             from "../dep.ts";


export type RootsSettings = base.settings.Settings & {
    /** Currently set models by type 
     * @override */
    active_models:          base.settings.ActiveModels<'detection'|'exclusionmask'>;

    /** Process input files with the exclusion mask model */
    exclusionmask_active:   boolean;
    /** Skip root tracking if too many roots were detectied */
    too_many_roots:         number;
    /** Process on the GPU if it is available */
    use_gpu:                boolean;
}

