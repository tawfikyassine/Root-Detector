import { base }             from "../dep.ts";


export type MODELTYPES = 'detection'|'exclusion_mask'|'tracking';

export type RootsSettings = base.settings.Settings & {
    /** Currently set models by type 
     * @override */
    active_models:          base.settings.ActiveModels<MODELTYPES>;

    /** Process input files with the exclusion mask model */
    exclusionmask_enabled:  boolean;
    /** Skip root tracking if too many roots were detectied */
    too_many_roots:         number;
    /** Process on the GPU if it is available */
    use_gpu:                boolean;
}

export type SettingsResponse = base.settings.SettingsResponse<RootsSettings>


export async function load_roots_settings(): Promise<SettingsResponse|null> {
    const response:Response|Error = await base.util.fetch_no_throw('settings')
    if(response instanceof Error)
        return null;
    
    return validate_roots_settings_response( await response.text() )
}


function validate_active_models(x:unknown): RootsSettings['active_models']|null {
    if(base.util.is_object(x)
    && base.util.has_string_property(x, 'detection')
    && base.util.has_string_property(x, 'exclusion_mask')
    && base.util.has_string_property(x, 'tracking') ) {
        return x;
    }
    else return null;
}


function validate_roots_settings(x:unknown): RootsSettings | null {
    if(base.util.is_object(x)
    && base.util.has_boolean_property(x, 'exclusionmask_enabled')
    && base.util.has_number_property(x, 'too_many_roots')
    && base.util.has_boolean_property(x, 'use_gpu')
    && base.util.has_property_of_type(x, 'active_models', validate_active_models)){
        return x;
    }
    else return null;
}

function validate_roots_settings_response(raw:string): SettingsResponse | null {
    let x: unknown;
    try{
        x = JSON.parse(raw)
    } catch {
        return null;
    }

    if(base.util.is_object(x)
    && base.util.has_property_of_type(x, 'settings', validate_roots_settings)
    && base.util.has_property_of_type(x, 'available_models', base.settings.validate_available_models)){
        return x;
    }
    else return null;
}
