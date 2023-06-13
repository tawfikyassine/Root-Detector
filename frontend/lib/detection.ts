import {util, segmentation, flask}            from "../base.ts";



export class RootsInputFile extends File {}

/** Result with additional attributes for roots */
export class RootsResult extends segmentation.SegmentationResult {
    /** URL to a skeletonized classmap */
    skeleton: string|null = null;

    // constructor(status?:base.files.ResultStatus, other?:Partial<RootsResult>){
    //     super(status, other)
    //     this.skeleton = other?.skeleton ?? null;
    // }

    /** @override */
    async export(): Promise< Record<string,File> | null> {
        const exports: Record<string, File>|null = await super.export() ?? {}

        if(this.skeleton != null) {
            const classmap: Blob|Error = await util.fetch_image_as_blob(this.skeleton)
            if(!(classmap instanceof Error))
                exports['skeleton.png'] = new File([classmap], 'skeleton.png')
        }

        return exports;
    }

    static validate(raw: unknown): RootsResult | null {
        return ( new this('processed', raw) ).apply(raw)
    }

    /** @overwrite */
    apply(raw: unknown): RootsResult|null {
        if(super.apply(raw) == null)
            return null
        
        if(util.is_object(raw)
        && util.has_string_property(raw, 'skeleton')) {
            this.skeleton = raw.skeleton
            return this;
        }
        else return null;
    } 
}


export class DetectionProcessingModule extends flask.FlaskProcessing<RootsResult> {
    ResultClass: util.ClassWithValidate<RootsResult> = RootsResult;
}
