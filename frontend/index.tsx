import { preact, JSX }  from "./dep.ts";
import * as base        from "./base.ts";

import { MainContainer }    from "./roots/MainContainer.tsx";

class Body extends base.Body {
    /** @override */
    id = 'roots'

    /** @override */
    main_container(): JSX.Element {
        return <MainContainer />
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

