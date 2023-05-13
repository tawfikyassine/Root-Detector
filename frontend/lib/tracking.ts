import { base } from "../dep.ts";


//TODO: remove `extends inputfile`
export class TrackingInput extends base.files.InputFile {
    /** The chronologically older image */
    image0: File;
    /** The chronologically newer image */
    image1: File;

    constructor(image0:File|TrackingInput, image1:File) {  //TODO: this gets called with only one argument from base/state.ts!
        super(image0)
        this.image0 = image0;
        //XXX: i have no idea what I am doing
        if('image1' in image0)
            this.image1 = image0.image1;
        else
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

