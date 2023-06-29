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
    //TODO
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
    async process(input: TrackingInput): Promise<TrackingResult> {
        return await new TrackingResult('failed')
    }
}
