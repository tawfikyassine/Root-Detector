import { JSX, base, Signal, preact, signals }  from "../dep.ts";
import * as state                              from "./state.ts";
import { 
    TrackingInput, 
    TrackingResult,
    TrackingProcessingModule,
}       from "../lib/tracking.ts";




export class TrackingInputFileList 
    extends base.InputFileList<TrackingInput, TrackingResult>{}


    
export class TrackingTab extends base.DetectionTab<state.RootsAppState> {
    /** @override Tab comes second. */
    // deno-lint-ignore no-inferrable-types
    is_first: boolean = false;

    /** @override */
    file_table(): JSX.Element {
        const appstate:state.RootsAppState = this.props.appstate
        return <>
        <base.FileTable
            sortable        =   {false}
            $files          =   {appstate.$file_pairs}
            $processing     =   {appstate.$processing}
            columns         =   {[
                {label: 'Image 1', width_css_class:'eight'},
                {label: 'Image 2', width_css_class:'eight'},
            ]}
            FileTableContent =  {RootsTrackingContent}
            FileTableRow     =  {RootsTrackingRow}
            processingmodule =  {new TrackingProcessingModule()}
        />

        
        <SVGMarkers />
        </>; 
    }
}


class RootsTrackingRow extends base.FileTableRow<TrackingInput, TrackingResult> {
    render(): JSX.Element {
        return <>
        <tr class="ui title table-row" ref={this.tr_ref}>
            <td>
                <i class="dropdown icon"></i>
                {/* <base.FileTableStatusIcons $result={this.props.$result}/> */}
                <label>
                    {this.props.input.image0.name}
                </label>
            </td>
            <td>
                <label>
                    {this.props.input.image1.name}
                </label>
            </td>
        </tr>
        </>
    }
}


class RootsTrackingContent extends base.FileTableContent<TrackingInput, TrackingResult> {
    /** Size of the first displayed image or null if image not yet loaded. 
     *  Forwarded from InputImage. */
    $size0: Signal<base.util.ImageSize|null> = new Signal(null)

    /** Size of the second displayed image or null if image not yet loaded. 
     *  Forwarded from InputImage. */
    $size1: Signal<base.util.ImageSize|null> = new Signal(null)

    image_ref0: preact.RefObject<base.InputImage> = preact.createRef()
    image_ref1: preact.RefObject<base.InputImage> = preact.createRef()

    svg_ref0:   preact.RefObject<SVGOverlay>      = preact.createRef()
    svg_ref1:   preact.RefObject<SVGOverlay>      = preact.createRef()

    $points0:   Readonly<Signal<base.util.Point[]>> = signals.computed(
        () => this.props.$result.value.points0
    )
    $points1:   Readonly<Signal<base.util.Point[]>> = signals.computed(
        () => this.props.$result.value.points1
    )

    /** @override */
    contentview(): JSX.Element {
        return <>
        <base.ImageContainer>
            <base.ImageControls 
                $imagesize    = {this.$size0} 
                on_mouse_move = {this.svg_ref0.current?.bind_on_mouse_move_cb()}
            >
                <base.InputImage 
                    inputfile       = {this.props.input.image0} 
                    $active_file    = {this.props.$active_file}
                    $size           = {this.$size0}
                    $loaded         = {this.props.$loaded}   //TODO: should have a $loaded for each image
                    ref             = {this.image_ref0}
                />
                <SVGOverlay 
                    $points = {this.$points0} 
                    size    = {this.$size0.value ?? {height:0, width:0}}
                    ref     = {this.svg_ref0}
                />
            </base.ImageControls>
            
            <base.ImageControls 
                $imagesize    = {this.$size1}
                on_mouse_move = {this.svg_ref1.current?.bind_on_mouse_move_cb()}
            >
                <base.InputImage 
                    inputfile       = {this.props.input.image1} 
                    $active_file    = {this.props.$active_file} 
                    $size           = {this.$size1}
                    $loaded         = {this.props.$loaded}   //TODO: should have a $loaded for each image
                    ref             = {this.image_ref1}
                /> 
                <SVGOverlay 
                    $points = {this.$points1} 
                    size    = {this.$size1.value ?? {height:0, width:0}}
                    ref     = {this.svg_ref1}
                />
            </base.ImageControls>
            <base.ProgressDimmer $result={ this.props.$result }/>
        </base.ImageContainer>
        </>
    }

    /** @override */
    help_menu(): JSX.Element | undefined {
        return <base.HelpButton>
            <li>
                <b>CTRL + Click</b> in both images to add a manual correction point
            </li>
            <li>
                <b>CTRL + Drag</b> within the right image from 
                <span class="ui red text"> red </span> to 
                <span class="ui green text"> green </span> to add a manual correction point
            </li>
            <li>
                <b>CTRL + Click</b> on a highlighted 
                <span class="ui teal text"> cyan </span> point to remove it
            </li>
        </base.HelpButton>
    }

    content_menu_extras(): JSX.Element[] {
        return [
            <ApplyCorrectionsButton on_click={() => console.warn('Corrections not implemented')}/>
        ]
    }

    componentDidMount(): void {
        super.componentDidMount?.()

        //workaround for loading images as $active_file is a combination of image names
        //TODO: fix this
        signals.effect( () => {
            if(this.props.input.name == this.props.$active_file.value) {
                this.image_ref0.current?.load_image()
                this.image_ref1.current?.load_image()
            }}
        )
    }
}

//TODO: visibility?
export function ApplyCorrectionsButton(props:{on_click:() => void}): JSX.Element {
    return (
    <a 
        class         = "item" 
        onClick       = {props.on_click}
        data-tooltip  = "Apply manual corrections" 
        data-position = "bottom left">
        <i class="check icon"></i>
    </a>
    )
}


type SVGOverlayProps = {
    /** Matched points to display */
    $points: Signal<base.util.Point[]>;

    size:    base.util.ImageSize;
}

/** SVG-based overlay displaying matched points and receiving corrections from user */
export class SVGOverlay extends preact.Component<SVGOverlayProps> {
    ref:     preact.RefObject<SVGSVGElement> = preact.createRef()
    $cursor: Signal<base.util.Point>      = new Signal({x:0, y:0})

    render(props: SVGOverlayProps): JSX.Element {
        const viewbox = `0 0 ${props.size.width} ${props.size.height}`
        return (
        <>
        <svg 
            class   = "overlay" 
            viewBox = {viewbox} 
            style   = { {...base.styles.overlay_css, pointerEvents:'none'} }
            ref     = {this.ref}
        >
            <circle 
                class   = "cursor" 
                cx      = {this.$cursor.value.x} 
                cy      = {this.$cursor.value.y} 
                r       = "10px"       //TODO: variable radius depending on zoom
                fill    = "red" 
            />
            <MatchedPoints $points={props.$points}/>
        </svg>
        </>
        )
    }

    on_mouse_move(event:MouseEvent): void {
        if(event.target == null || this.ref.current == null)
            return;
        
        this.$cursor.value = page2img_coordinates(
            {x:event.pageX, y:event.pageY},
            this.ref.current,
            this.props.size,
            event.target as HTMLElement,
        ) ?? {x:0,y:0}
    }

    bind_on_mouse_move_cb(): (evnet:MouseEvent) => void {
        return this.on_mouse_move.bind(this)
    }
}


/** Translate page coordinates xy to img coordinates
    (viewport element provides topleft corner and transform) */
export function page2img_coordinates(
    p:          base.util.Point, 
    overlay:    Element,
    ovsize:     base.util.ImageSize,
    viewport:   HTMLElement
): base.util.Point|null {
    let size: base.util.Size;
    if(navigator.userAgent.indexOf('Chrom') != -1){
        //some layout issues with chrome
        size = {height: overlay.clientHeight, width: overlay.clientWidth} //integer
    } else {
        const rect:DOMRect = overlay.getBoundingClientRect()
        size = {height: rect.height, width: rect.width}
        //var H = $(img).height()      //float
        //var W = $(img).width()
    }
    
    const xform:CSSMatrix|null = parse_css_matrix(viewport.style.transform);
    if(xform == null)
        return null;
    
    //absolute coordinates on the html element in pixels
    const html_x_abs   = p.x - get_offset(viewport).left
    const html_y_abs   = p.y - get_offset(viewport).top
    //relative coordinates on the html element, range 0.0..1.0
    const html_x_rel   = html_x_abs / size.width  / xform.scale
    const html_y_rel   = html_y_abs / size.height / xform.scale
    //absolute coordinates on the svg element
    const svg_x_abs    = html_x_rel * ovsize.width
    const svg_y_abs    = html_y_rel * ovsize.height
    
    return {x:svg_x_abs, y:svg_y_abs};
}



/** Not using DOMMatrix because not implemented in deno */
type CSSMatrix = {
    x:      number;
    y:      number;
    scale:  number;
}

/** Parse and validate css transform string like "matrix(1,0,0,1,0,0)" 
 *  Not using DOMMatrix because not implemented in deno */
export function parse_css_matrix(maxtrix:string): CSSMatrix|null {
    const [a,b,c,d,x,y] = maxtrix.split('(')[1]?.split(')')[0]?.split(',').map(Number) ?? []
    
    if([x,y,a].includes(NaN) || [x,y,a].includes(undefined))
        return null;

    if(b!=0 || c!=0)
        return null;
    
    if(a != d)
        return null;
    
    return {x:x!, y:y!, scale:a!};
}

function get_offset(el:HTMLElement) {
    const box = el.getBoundingClientRect();
  
    return {
      top:  box.top + window.pageYOffset - document.documentElement.clientTop,
      left: box.left + window.pageXOffset - document.documentElement.clientLeft
    };
  }



type MatchedPointsProps = {
    $points: Signal<base.util.Point[]>;
}

/** SVG element displaying single points */
export class MatchedPoints extends preact.Component<MatchedPointsProps> {
    render(props:MatchedPointsProps): JSX.Element {
        const p_str:string = props.$points.value.map(
            p => `${p.x},${p.y}`
        ).join(' ')

        return (
        <polyline 
            class        = "matched-points"
            points       = {p_str} 
            fill         = "none" 
            stroke       = "none"
            marker-start = "url(#dot-marker)" 
            marker-mid   = "url(#dot-marker)" 
            marker-end   = "url(#dot-marker)" />
        )
    }
}


export function SVGMarkers(): JSX.Element {
    return <svg style="position:absolute; pointer-events:none;" id="svg-defs">
        <defs>
            <marker 
                id           = "dot-marker" 
                viewBox      = "0 0 4 4" 
                refX         = "2" 
                refY         = "2" 
                markerHeight = "2" 
                markerWidth  = "2"
            >
                <circle r="2" cx="2" cy="2" fill="blue"></circle>
            </marker>

            <marker 
                id           = "dot-marker-red" 
                viewBox      = "0 0 2 2" 
                refX         = "1" 
                refY         = "1" 
                markerHeight = "1" 
                markerWidth  = "1"
            >
                <circle r="1" cx="1" cy="1" fill="red"></circle>
            </marker>
            
            <marker 
                id           = "dot-marker-green" 
                viewBox      = "0 0 2 2" 
                refX         = "1" 
                refY         = "1" 
                markerHeight = "1" 
                markerWidth  = "1"
            >
                <circle r="1" cx="1" cy="1" fill="green"></circle>
            </marker>
        </defs>
    </svg>
}