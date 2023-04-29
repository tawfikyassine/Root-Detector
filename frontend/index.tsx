import { base, JSX }        from "./dep.ts";
import { MainContainer }    from "./roots/MainContainer.tsx";
import { RootsTopMenu }     from "./roots/Settings.tsx";
import * as state           from "./roots/state.ts"

class Body extends base.Body {
    /** @override */
    id = 'roots'

    /** Global application state @override */
    appstate = new state.RootsAppState();

    /** @override */
    MainContainer = MainContainer

    /** @override */
    TopMenu = RootsTopMenu;
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

