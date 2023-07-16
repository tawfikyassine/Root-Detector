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




export type ParsedFilename = {
    date:          Date;
    experiment_id: string;
}


//TODO: also consider exif data

/** Try to extract a date and the experiment name from a filename. 
 *  Several date formats supported: YYYY.MM.DD, DD.MM.YY, DD.MM.YY, YYYY-MM-DD */
export function parse_filename(filename:string): ParsedFilename | null {
    const date_candidates: string[] = filename.split('_')
    let date                        = new Date(NaN)
    let datestring          = '';

    for(datestring of date_candidates) {
        for(const separator of ['.', '-']) {
            const splits: string[] = datestring.split(separator)
            if(splits.map(Number).filter(Boolean).length == 3){
                const [a,b,c] = splits;
                let y:number, m:number, d:number;
                if(a!.length > 2)
                    //interpreting as format YYYYMMDD
                    [y,m,d] = [a,b,c].map(Number) as [number, number, number]
                else if(c!.length > 2)
                    //interpreting as format DDMMYYYY
                    [y,m,d] = [c,b,a].map(Number) as [number, number, number]
                else {
                    //interpreting as format DDMMYY
                    [y,m,d] = [c,b,a].map(Number) as [number, number, number]
                    y           = y<70? (y+2000) : (y+1900);    //1970-2069
                }
                date = new Date(y, m-1, d);
                break;
            }
        }
        if(!isNaN(date.getTime()))
            break;
    }
    
    if(isNaN(date.getTime()))
        return null;
    
    let experiment_id:string = filename.split(datestring)[0]!
    if(experiment_id.endsWith('_'))
        experiment_id = experiment_id.slice(0, experiment_id.length-1)
    return {experiment_id, date}
}

//convenience type
type FileWithParsedName = File & ParsedFilename;


export function load_list_of_files(files: FileList|File[]): TrackingInputResultPair[] {
    const {inputfiles}
        = base.file_input.categorize_files(files, base.file_input.MIMETYPES)

    //group files together by their experiment name and sort by date
    const grouped_files: Map<string, FileWithParsedName[]> = new Map()
    for(const inputfile of inputfiles) {
        const parsed:ParsedFilename|null = parse_filename(inputfile.name)
        if(parsed == null)
            continue;
        
        const group:FileWithParsedName[] = grouped_files.get(parsed.experiment_id) ?? []
        group.push(Object.assign(inputfile, parsed))
        grouped_files.set(parsed.experiment_id, group)
    }

    const pairs:TrackingInputResultPair[] = []
    const groupnames:string[] = [...grouped_files.keys()].sort()
    for(const groupname of groupnames) {
        const group:FileWithParsedName[] = grouped_files.get(groupname) ?? []
        if(group.length < 2)
            continue;
        
        group.sort( 
            (a:ParsedFilename, b:ParsedFilename) => (a.date.getTime() - b.date.getTime())
        )

        //files to pairs
        for(const k in group) {
            // deno-lint-ignore no-inferrable-types
            const i:number = Number(k)
            if(i == 0)
                continue;
            
            pairs.push({
                input:  new TrackingInput(group[i-1]!, group[i]!),
                result: new TrackingResult(),
            })
        }
    }
    return pairs;
}


export class TrackingProcessingModule 
extends base.files.ProcessingModule<TrackingInput, TrackingResult> {
    async process(
        input:        TrackingInput, 
        on_progress?: (x:TrackingInputResultPair) => void
    ): Promise<TrackingResult> {
        on_progress?.({input, result:new TrackingResult("processing")})

        const ok0: Response|Error = await base.util.upload_file_no_throw(input.image0)
        const ok1: Response|Error = await base.util.upload_file_no_throw(input.image1)
        if(ok0 instanceof Error || ok1 instanceof Error)
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
