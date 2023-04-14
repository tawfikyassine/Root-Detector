import { base, JSX }        from "./dep.ts";
import { MainContainer }    from "./roots/MainContainer.tsx";
import * as state           from "./roots/state.ts"

class Body extends base.Body {
    /** @override */
    id = 'roots'

    /** Global application state @override */
    appstate: state.RootsAppState = new state.RootsAppState();

    /** @override */
    main_container(): JSX.Element {
        return <MainContainer appstate={this.appstate}/>
    }
}


export function Index(): JSX.Element {
    return <html>
        <base.Head title={"DigIT Root-Detector"} import_src={"index.tsx"} />
        <Body />
    </html>
}

if(!globalThis.Deno){
    base.hydrate_body(<Body />, 'roots')
}

