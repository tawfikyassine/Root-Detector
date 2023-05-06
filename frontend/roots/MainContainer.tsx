import { JSX, base }    from "../dep.ts";
import { RootsAppState } from "./state.ts";

import { DetectionTab } from "./DetectionTab.tsx";
import { TrackingTab }  from "./TrackingTab.tsx";


export class MainContainer extends base.MainContainer<RootsAppState> {
    /** @override */
    tab_names: string[] = ['Detection', 'Tracking', 'Training']

    /** @override */
    tab_contents(): JSX.Element[] {
        return [
            <DetectionTab     name={this.tab_names[0]!} appstate={this.props.appstate}/>,
            <TrackingTab      name={this.tab_names[1]!} appstate={this.props.appstate}/>,
            <base.TrainingTab name={this.tab_names[2]!}/>,
        ]
    }
}

