import { base } from "../dep.ts";


type TrackingResult = {
    //TODO
}

export type TrackingImagePair = {
    /** The chronologically older image */
    image0:  File;
    /** The chronologically newer image */
    image1:  File;

    result:  TrackingResult;
}




export async function load_list_of_files(files: FileList|File[]): Promise<base.files.InputResultPair[]> {
    const {inputfiles} 
        = base.file_input.categorize_files(files, base.file_input.MIMETYPES)
    
    //TODO: files to pairs
    return inputfiles.map(
        (f:File) => ({
            input:  new base.files.InputFile(f),
            result: new base.Result(),
        })
    )
}

