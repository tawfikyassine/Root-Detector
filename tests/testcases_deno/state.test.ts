import * as state           from "../../frontend/roots/state.ts";
import { util, asserts }    from "./dep.ts"


Deno.test('AppState.override', async () => {
    const appstate = new state.RootsAppState()

    const mock_files: File[] = [
        new File([], 'banana.jpg'),
        new File([], 'potato.jpg'),
    ]

    appstate.files.set_from_files(mock_files)
    await util.wait(1) //needed?
    
    asserts.assert(appstate.files.value[0]?.input instanceof state.RootsInputFileState)
    asserts.assert(appstate.files.value[0]?.$result.value instanceof state.RootsResult)
})
