#!./deno.sh run --no-prompt --allow-read --allow-write=./static --allow-env --cached-only
import * as esbuild         from "../../base/backend/ts/esbuild.ts";
import * as preact          from "../../base/backend/ts/preact.ts";
import * as paths           from "./paths.ts";
import { path }             from "./dep.ts";

if(import.meta.main){
    await esbuild.initialize_esbuild()
    
    //compile base but override output folder //TODO: should be bundled
    preact.compile_default({static: paths.static_()})

    const dep_ts = path.join(paths.frontend(), 'dep.ts')
    esbuild.compile_esbuild(dep_ts, './static/dep.ts')
    esbuild.compile_esbuild(
        './frontend/index.tsx', 
        './static/index.tsx',
        {[dep_ts]: './dep.ts'}
    )
    preact.compile_index({
        static:         paths.static_(),
        frontend:       paths.frontend(),
        frontend_glob:  '**/*.ts{x,}',
        index_tsx:      'index.tsx',
    })
}
