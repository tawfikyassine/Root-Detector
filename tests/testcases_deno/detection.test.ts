import { RootsResult }      from "../../frontend/lib/detection.ts";
import { asserts }          from "./dep.ts";



Deno.test('RootsResult', () => {
    const raw = {
        'segmentation': 'classmap.png',
        'classmap'    : 'classmap.png',
        'skeleton'    : 'skeleton.png',
        'statistics'  : {'rootpixels':1001},
    }

    const result:RootsResult|null = RootsResult.validate(raw)
    asserts.assertExists(result)
    asserts.assert( result instanceof RootsResult )    
    asserts.assertExists(result.skeleton)
})

