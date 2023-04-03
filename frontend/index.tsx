import { preact, JSX } from "./dep.ts";


function Body(): JSX.Element {
    return <body>
        <button>
            Banana
        </button>
    </body>
}


export function Index(): JSX.Element {
    return <html>
        <head>
            <title>Base UI</title>
            <link rel="stylesheet" href="thirdparty/semantic.min.css" />
            <script src="thirdparty/jquery-3.4.1.min.js"></script>
            <script src="thirdparty/semantic.min.js"></script>
            <script type="module" src="ts/index.tsx"></script>
            <link rel="stylesheet" href="css/box_styles.css" />
            {/* <ExtraStyles /> */}
        </head>
        <Body />
    </html>
}

if(!globalThis.Deno){
    preact.hydrate(<Body />, document.body.parentElement!)
    //body onload callback doesnt work for some reason
    //await load_settings()
}

