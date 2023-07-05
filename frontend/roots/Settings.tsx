import { JSX, preact, Signal }      from "../dep.ts"
import { base }                     from "../dep.ts";
import { RootsSettings }            from "./settings.ts";
import { AvailableModelsSignal }    from "./state.ts";


export class RootsTopMenu extends base.TopMenu {
    /** @override */
    SettingsModal = RootsSettingsModal;
}


type RootsSettingsModalProps = base.SettingsModalProps<RootsSettings> & {
    $available_models: AvailableModelsSignal;
}


export class RootsSettingsModal 
extends base.SettingsModal<RootsSettings, RootsSettingsModalProps> {
    exclusionmask_checkbox:  preact.RefObject<CheckboxedField>     = preact.createRef()
    exclusionmask_selection: preact.RefObject<base.ModelSelection> = preact.createRef()
    tracking_selection:      preact.RefObject<base.ModelSelection> = preact.createRef()

    /** @override */
    form_content(): JSX.Element[] {
        const settings: RootsSettings|undefined = this.props.$settings.value;
        if(settings == undefined)
            return []
        
        const avmodels_exclusionmask: base.settings.ModelInfo[] | undefined
            = this.props.$available_models.value?.exclusion_mask
        const activemodel_exclusionmask: string = settings.active_models.exclusion_mask

        const avmodels_tracking: base.settings.ModelInfo[] | undefined
            = this.props.$available_models.value?.tracking
        const activemodel_tracking: string = settings.active_models.tracking

        
        return super.form_content().concat([
            <div class="ui divider"></div>,

            <CheckboxedField
                checkbox_title = "Exclusion mask"
                checkbox_label = "Enable detection of foreign objects (e.g. tape)"

                checkbox_value = {settings.exclusionmask_enabled}
                ref            = {this.exclusionmask_checkbox}
            >
                <base.ModelSelection 
                    active_model     = {activemodel_exclusionmask}
                    available_models = {avmodels_exclusionmask}
                    ref              = {this.exclusionmask_selection}
                    label            = {"Exclusion mask model"}
                />
            </CheckboxedField>,

            <div class="ui divider"></div>,
            <base.ModelSelection 
                active_model     = {activemodel_tracking}
                available_models = {avmodels_tracking}
                label            = {"Root tracking model"}
                ref              = {this.tracking_selection}
            />
        ])
    }

    /** @override @see {@link base.SettingsModal.collect_settings_from_widgets} */
    collect_settings_from_widgets(): RootsSettings| null {
        const settings: base.settings.Settings | null = super.collect_settings_from_widgets()
        if(settings == null)
            return null;

        if(this.exclusionmask_checkbox.current  == null
        || this.exclusionmask_selection.current == null
        || this.tracking_selection.current      == null)
            return null;
        
        const exmask_enabled:boolean = this.exclusionmask_checkbox.current.get_value()
        const exmask_model:string|undefined
            = this.exclusionmask_selection.current.get_selected()?.name
        const tracking_model:string|undefined
            = this.tracking_selection.current.get_selected()?.name
        
        const rootssettings: RootsSettings = {
            active_models : {
                detection:      settings.active_models.detection,
                exclusion_mask: exmask_model ?? 'TODO',
                tracking:       tracking_model ?? 'TODO',
            },
            exclusionmask_enabled: exmask_enabled,
            too_many_roots:       9999999,                                                    //TODO
            use_gpu:              false,                                                      //TODO
        }
        return rootssettings;
    }
}


type CheckboxedFieldProps = {
    children:       preact.ComponentChildren;

    /** Short text above the checkbox */
    checkbox_title: string;
    /** Text beside the checkbox */
    checkbox_label: string;
    /** State of the checkbox */
    checkbox_value: boolean
}

/** Checkbox that controls if its children are displayed */
class CheckboxedField extends preact.Component<CheckboxedFieldProps> {
    $checkbox_value: Signal<boolean> = new Signal<boolean>(this.props.checkbox_value)
    
    render(props:CheckboxedFieldProps): JSX.Element {
        const $val = this.$checkbox_value;
        //update the internal signal with new extern value
        //$val.value = props.checkbox_value;

        return <>
            <div class="field">
                <label>{ props.checkbox_title }</label>
                <div class="ui toggle checkbox">
                    <input 
                        type     = "checkbox" 
                        checked  = {$val} 
                        onChange = {() => $val.value = !$val.value} 
                    />
                    <label>{ props.checkbox_label }</label>
                </div>
            </div>

            <div style={{display:base.ui_util.boolean_to_display_css($val.value)}}>
                { props.children }
            </div>
        </>
    }

    get_value(): boolean {
        return this.$checkbox_value.value;
    }

}
