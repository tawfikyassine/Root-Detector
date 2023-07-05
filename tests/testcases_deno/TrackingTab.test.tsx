import { SVGOverlay }           from "../../frontend/roots/TrackingTab.tsx";
import { parse_css_matrix }     from "../../frontend/roots/TrackingTab.tsx";
import { base }                 from "../../frontend/dep.ts";
import { util, asserts }        from "./dep.ts";
import { preact, JSX, Signal }  from "../../frontend/dep.ts";

Deno.test('SVGOverlay', async (t:Deno.TestContext) => {
    const document:Document = await util.setup_jsdom()
    
    const $points = new Signal<base.util.Point[]>([])
    const overlay = <SVGOverlay $points={$points} size={ {width:500, height:500} }/>
    preact.render(overlay, document.body)
    await util.wait(1)

    const svg:SVGElement|null = document.querySelector('svg')
    asserts.assertExists(svg)
    const viewbox:string|null = svg.getAttribute('viewBox')
    asserts.assertEquals(viewbox, "0 0 500 500")


    $points.value = [
        {x:100, y:200},
        {x:150, y:300},
        {x:200, y:250},
    ]
    await util.wait(1)

    const svg_points:SVGPolylineElement|null = document.querySelector('polyline')
    asserts.assertExists(svg_points)
    const points = svg_points.getAttribute('points')
    asserts.assertExists(points)
    asserts.assertNotEquals(points.length, 0)

    /*asserts.assertExists(
        document.querySelector('marker#dot-marker')
    )*/
})


Deno.test("parse_css_matrix", () => {
    const matrixstring = "matrix(5,0,0,5,65,77)";
    const expected = { x: 65, y: 77, scale: 5 };
  
    let resultmatrix = parse_css_matrix(matrixstring);
    asserts.assertEquals(resultmatrix, expected);

    //invalid because scale values are not the same
    const invalidmatrixstring = "matrix(2,0,0,8,0,0)";
    resultmatrix = parse_css_matrix(invalidmatrixstring);
    asserts.assertEquals(resultmatrix, null);

    //invalid because skewed
    const invalidmatrixstring2 = "matrix(8,1,0,8,0,0)";
    resultmatrix = parse_css_matrix(invalidmatrixstring2);
    asserts.assertEquals(resultmatrix, null);

    resultmatrix = parse_css_matrix("invalid");
    asserts.assertEquals(resultmatrix, null);
});
