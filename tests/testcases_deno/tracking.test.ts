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


Deno.test('load_list_of_files', async () => {
    const mockfiles = [
        new File([], 'banana.tiff', {type:'image/tiff'}),
        new File([], 'mesocosms_T001_L001_29.05.19_082607_007_GBW.tiff', {type:'image/tiff'}),
        new File([], 'mesocosms_T001_L001_25.04.19_082607_007_GBW.tiff', {type:'image/tiff'}),
        new File([], 'mesocosms_T001_L001_20.03.20_082607_007_GBW.tiff', {type:'image/tiff'}),
        new File([], 'mesocosms_T001_L001_21.03.20_082607_007_GBW.tiff.zip', {type:'application/x-zip'}),
        new File([], 'mesocosms_T001_L002_02.05.20_082607_007_GBW.tiff', {type:'image/tiff'}),
    ]

    const pairs0 = await tracking.load_list_of_files(mockfiles)
    asserts.assertEquals(pairs0.length, 2)
    asserts.assertEquals(pairs0[0]?.input.image0.name, mockfiles[2]?.name )
})



Deno.test('parse_filename', () => {
    const filenames_and_dates = {
        'DE_T027_L003_09.07.20_111637_001_JS.tiff':         {date:new Date(2020, 7-1, 9)},
        'DE_T027_L003_09.07.2015_111637_001_JS.tiff':       {date:new Date(2015, 7-1, 9)},
        'XXX Scanns_T009_L001_03.07.18_082024_003_SB.tiff': {date:new Date(2018, 7-1, 3)},
        'XXX_Scanns_T009_L001_03.07.18_082024_003_SB.tiff': {date:new Date(2018, 7-1, 3)},
        'XXXN_T6_L0_2021.07.18_154333_54_cm-A.tiff':        {date:new Date(2021, 7-1, 18)},
        'xxx_yyy_2018-10-02_06_40.jpg':                     {date:new Date(2018, 10-1, 2)},
        '105_100_2022-03-04_19.jpg':                        {date:new Date(2022,  3-1, 4)},
        //mesocosm19_T101_D19-08-02_H18_033.jpg
        'invalid_filename.tiff':                            {date:new Date(NaN)},
    }

    for(const [filename, expected] of Object.entries(filenames_and_dates)){
        const parsed  =   tracking.parse_filename(filename)

        //console.log(filename, parsed.date, expected.date)
        if( isFinite(expected.date.getTime()) )
            //asserts.assertEquals( parsed.date.getTime(), expected.date.getTime() )
            asserts.assertEquals( parsed?.date, expected.date )
        else
            asserts.assertEquals( parsed, null )
    }

    asserts.assertEquals(
        tracking.parse_filename('DE_T027_L003_09.07.20_111637_001_JS.tiff')?.experiment_id ,
        'DE_T027_L003'
    )
})
