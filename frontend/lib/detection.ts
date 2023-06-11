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
    // async export(): Promise< Record<string,File> | null> {
    //     console.trace('Not Implemented')
    //     return null;
    // }

    static validate(raw: unknown): RootsResult | null {
        const baseresult: segmentation.SegmentationResult|null = super.validate(raw)
        if(baseresult
        && util.is_object(raw)
        && util.has_string_property(raw, 'skeleton')){
            const result: RootsResult = baseresult as RootsResult;
            result.skeleton = raw.skeleton;
            return result;
        }
        else return null;
    }
}


export class DetectionProcessingModule extends flask.FlaskProcessing<RootsResult> {
    ResultClass: util.ClassWithValidate<RootsResult> = RootsResult;
}
