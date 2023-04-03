import { preact, JSX }  from "./dep.ts";
import { base }         from "./dep.ts";

function Body(): JSX.Element {
    return <base.Body id={"roots"} />
}


export function Index(): JSX.Element {
    return <html>
        <base.Head title={"DigIT Root-Detector"} import_src={"index.tsx"} />
        <Body />
    </html>
}

if(!globalThis.Deno){
    base.hydrate_body('roots')
    //body onload callback doesnt work for some reason
    //await load_settings()
}

