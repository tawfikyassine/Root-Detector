import * as base        from "../base.ts";
import { JSX }          from "../dep.ts";


export class MainContainer extends base.MainContainer {
    /** @override */
    tab_names: string[] = ['Detection', 'Tracking', 'Training']

    /** @override */
    tab_contents(): JSX.Element[] {
        return [
            this.detection_tab_content(this.tab_names[0]!),
            this.tracking_tab_content(this.tab_names[1]!),
            this.training_tab_content(this.tab_names[2]!),
        ]
    }

    tracking_tab_content(name:string): JSX.Element {
        return <div class="ui bottom attached tab" data-tab={name}>
            Tracking Not Implemented.
        </div>
    }
}
