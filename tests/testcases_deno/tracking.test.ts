import * as tracking        from "../../frontend/lib/tracking.ts";
import { asserts, util, mock }    from "./dep.ts";



Deno.test('TrackingProcessingModule', async (t:Deno.TestContext) => {
    const module = new tracking.TrackingProcessingModule()

    const mockinput:tracking.TrackingInput = {
        name:   'mock',
        image0: new File([], 'mock0.jpg'),
        image1: new File([], 'mock1.jpg'),
    };

    await t.step('too-many-roots', async () => {
        util.mock_fetch(async () => {
            return await new Response('TOO_MANY_ROOTS', {status:500})
        })
        const result:tracking.TrackingResult = await module.process(mockinput)
        asserts.assertEquals(result.status, 'failed')
        //TODO: assert contains something with 'too many roots'
    })
    mock.restore()


    await t.step('success', async () => {
        const spy: mock.Spy = util.mock_fetch(async () => {
            return await new Response(JSON.stringify({
                points0: [ [10,10], [50,50], [100,100] ],
                points1: [ [20,20], [70,70], [120,120] ],
            }))
        })
        const result:tracking.TrackingResult = await module.process(mockinput)
        
        const used_url:string = spy.calls[2]?.args[0]
        asserts.assertFalse(used_url.startsWith('/'))
        const used_params = new URLSearchParams(used_url.slice(used_url.search(/\?/)))
        asserts.assertEquals(used_params.get('filename0'), mockinput.image0.name)
        asserts.assertEquals(used_params.get('filename1'), mockinput.image1.name)

        asserts.assertEquals(result.status, 'processed')
        asserts.assertEquals(result.points0.length, 3)
    })
    mock.restore()

    //TODO: invalid response
})

