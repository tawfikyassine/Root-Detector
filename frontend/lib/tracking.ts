import { base } from "../dep.ts";


//TODO: remove `extends inputfile`
export class TrackingInput extends base.files.Input {
    /** The chronologically older image */
    image0: File;
    /** The chronologically newer image */
    image1: File;

    constructor(image0:File, image1:File) {
        super(`${image0.name}.${image1.name}`)

        this.image0 = image0;
        this.image1 = image1
    }
}


export class TrackingResult extends base.files.Result {
    points0: base.util.Point[] = [];
    points1: base.util.Point[] = [];

    /** @override */
    static validate(raw: unknown): TrackingResult | null {
        return ( new this('processed', raw) ).apply(raw)
    }

    /** @override */
    apply(raw:unknown): TrackingResult | null {
        if(super.apply(raw) == null)
            return null
        
        if(base.util.is_object(raw)
        && base.util.has_property_of_type(raw, 'points0', validate_2_number_arrays)
        && base.util.has_property_of_type(raw, 'points1', validate_2_number_arrays)) {
            this.points0 = raw.points0.map( (p) => ({x:p[1], y:p[0]}) )
            this.points1 = raw.points1.map( (p) => ({x:p[1], y:p[0]}) );
            return this;
        }
        else return null;
    }
}

type TwoNumbers = [number, number];

/** Validate if `x` is an array of 2 numbers (e.g. [0,0]) */
export function validate_2_number_array(x: unknown): TwoNumbers|null {
    if(base.util.is_number_array(x)
    && x.length == 2){
        return x as TwoNumbers
    }
    else return null;
}

/** Validate if `x` is an array of 2-number array (e.g. `[[0,0], [1,1]]`) */
export function validate_2_number_arrays(x: unknown): TwoNumbers[]|null {
    if(base.util.is_array_of_type(x, validate_2_number_array)) {
        return x
    }
    else return null;
}

export type TrackingInputResultPair = {
    input:   TrackingInput;
    result:  TrackingResult;
}



export async function load_list_of_files(files: FileList|File[]): Promise<TrackingInputResultPair[]> {
    const {inputfiles} 
        = base.file_input.categorize_files(files, base.file_input.MIMETYPES)
    
    //TODO: files to pairs
    return inputfiles.map(
        (f:File) => ({
            input:  new TrackingInput(inputfiles[0]!, f),
            result: new TrackingResult(),
        })
    )
}


export class TrackingProcessingModule 
extends base.files.ProcessingModule<TrackingInput, TrackingResult> {
    async process(
        input:        TrackingInput, 
        on_progress?: (x:TrackingInputResultPair) => void
    ): Promise<TrackingResult> {
        on_progress?.({input, result:new TrackingResult("processing")})

        const ok0 = base.util.upload_file_no_throw(input.image0)
        const ok1 = base.util.upload_file_no_throw(input.image1)
        if((await ok0) instanceof Error || (await ok1) instanceof Error)
            return new TrackingResult('failed')
        
        const request_data = {filename0:input.image0.name, filename1:input.image1.name}
        //TODO: Object.assign(request_data, extra_data)

        const get_params:string = (new URLSearchParams(request_data)).toString()
        const response: Response|Error 
            = await base.util.fetch_no_throw(`process_root_tracking?${get_params}`)
        if(response instanceof Error)
            return new TrackingResult('failed')
        
        const raw:unknown = await base.util.parse_json_response(response)
        return TrackingResult.validate(raw) ?? new TrackingResult('failed')
    }
}
