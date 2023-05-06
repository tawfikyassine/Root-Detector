import { base, JSX }        from "./dep.ts";
import { MainContainer }    from "./roots/MainContainer.tsx";
import { RootsTopMenu }     from "./roots/Settings.tsx";
import * as state           from "./roots/state.ts"
import { load_roots_settings } from "./roots/settings.ts";

import * as tracking        from "./lib/tracking.ts";


class RootsApp extends base.create_App({
    id:             'roots', 
    AppState:       state.RootsAppState, 
    load_settings:  load_roots_settings,  
    MainContainer:  MainContainer, 
    TopMenu:        RootsTopMenu
}){
    /** @override */
    async on_drop(event: JSX.TargetedDragEvent<HTMLElement>): Promise<FileList|undefined> {
        const files:FileList|undefined = await super.on_drop(event)
        
        this.appstate.file_pairs.set_from_pairs( 
            await tracking.load_list_of_files(files ?? [])
        )
        return files;
    }
}



export function Index(): JSX.Element {
    return <html>
        <base.Head title={"DigIT Root-Detector"} import_src={"index.tsx"} />
        <RootsApp />
    </html>
}

if(!globalThis.Deno){
    base.hydrate_body(<RootsApp />, 'roots')
}

