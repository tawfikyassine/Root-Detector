import * as base    from "../base.ts";
import * as state   from "./state.ts";


export async function process_file(input:base.InputFile): Promise<state.RootsResult>  {
    const baseresult:base.Result = await base.detection.process_file(input)
    const rootsresult:state.RootsResult|null = validate_RootsResult(baseresult)
    if(rootsresult)
        return rootsresult;
    else
        //TODO: better error handling
        return new state.RootsResult('failed')
}


function validate_RootsResult(x:base.Result): state.RootsResult|null {
    if(base.util.is_object(x.raw)
    && base.util.has_property_of_type(x.raw, 'skeleton', base.util.validate_string)){
        return new state.RootsResult(x.status, x.raw);
    }
    else return null;
}
