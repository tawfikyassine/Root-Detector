import { JSX, base }    from "../dep.ts";

import { DetectionTab } from "./DetectionTab.tsx";


export class MainContainer extends base.MainContainer {
    /** @override */
    tab_names: string[] = ['Detection', 'Tracking', 'Training']

    /** @override */
    tab_contents(): JSX.Element[] {
        return [
            <DetectionTab     name={this.tab_names[0]!} appstate={this.props.appstate}/>,
            <TrackingTab      name={this.tab_names[1]!}/>,
            <base.TrainingTab name={this.tab_names[1]!}/>,
        ]
    }
}

function TrackingTab(props:{name:string}): JSX.Element {
    return <div class="ui bottom attached tab" data-tab={props.name}>
        Tracking Not Implemented.
    </div>
} 
