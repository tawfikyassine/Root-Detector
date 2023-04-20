import * as state           from "./state.ts";
import * as base            from "../base.ts"



export async function export_roots_result(
    input:  base.InputFile,
    result: state.RootsResult,
): Promise< Record<string, File> | null > {
    if(result.status!='processed' || !result.skeleton || !result.classmap)
        return null;
    
    const response0:Response|Error = await base.util.fetch_no_throw(
        base.util.url_for_image(result.classmap, true)
    )
    const response1:Response|Error = await base.util.fetch_no_throw(
        base.util.url_for_image(result.skeleton, true)
    )
    
    if('ok' in response0 && 'ok' in response1){
        const outfilename0 = `${input.name}.classmap.png`
        const outfilename1 = `${input.name}.skeleton.png`
        return {
            [outfilename0]: new File([await response0.blob()], outfilename0),
            [outfilename1]: new File([await response1.blob()], outfilename1)
        }
    } 
    else return null
}
