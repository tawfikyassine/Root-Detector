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
        util.mock_fetch(async () => {
            return await new Response(JSON.stringify({

            }))
        })
        const result:tracking.TrackingResult = await module.process(mockinput)
        asserts.assertEquals(result.status, 'processed')
    })
    mock.restore()
})

