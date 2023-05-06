import { JSX, preact, Signal }      from "../dep.ts"
import { base }                     from "../dep.ts";
import { RootsSettings } from "./settings.ts";


export class RootsTopMenu extends base.TopMenu {
    /** @override */
    SettingsModal = RootsSettingsModal;
}


export class RootsSettingsModal 
extends base.SettingsModal<RootsSettings> {
    exclusionmask_checkbox: preact.RefObject<CheckboxedField> = preact.createRef()
    exclusionmask_selection: preact.RefObject<base.ModelSelection> = preact.createRef()


    /** @override */
    form_content(): JSX.Element[] {
        const settings: RootsSettings|undefined = this.props.$settings.value;
        if(settings == undefined)
            return []
        
        const avmodels
            = this.props.$available_models.value?.detection
        const activemodel_exclusionmask: string = settings.active_models.exclusionmask
        
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
                    available_models = {avmodels}
                    ref              = {this.exclusionmask_selection}
                    label            = {"Exclusion mask model"}
                />
            </CheckboxedField>
        ])
    }

    /** @override @see {@link base.SettingsModal.collect_settings_from_widgets} */
    collect_settings_from_widgets(): RootsSettings| null {
        const settings: base.settings.Settings | null = super.collect_settings_from_widgets()
        if(settings == null)
            return null;

        if(this.exclusionmask_checkbox.current == null
        || this.exclusionmask_selection.current == null)
            return null;
        
        const exmask_enabled:boolean = this.exclusionmask_checkbox.current.get_value()
        const exmask_model:string|undefined
            = this.exclusionmask_selection.current.get_selected()?.name
            /*?? this.props.$settings.value?.active_models.exclusionmask
        if(exmask_model == undefined)
            return null;*/

        const rootssettings: RootsSettings = {
            active_models : {
                detection:      settings?.active_models.detection,
                exclusionmask:  exmask_model ?? 'TODO',
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
