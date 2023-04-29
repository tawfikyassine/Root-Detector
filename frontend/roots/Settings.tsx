import { JSX, preact, Signal }      from "../dep.ts"
import { base }                     from "../dep.ts";
import { RootsSettings } from "./settings.ts";


export class RootsTopMenu extends base.TopMenu {
    /** @override */
    SettingsModal = RootsSettingsModal;
}


type RootsSettingsModalProps = {
    $settings:          Signal<RootsSettings|undefined>;
    $available_models:  Signal<base.settings.AvailableModels|undefined>;
}


export class RootsSettingsModal extends base.SettingsModal<RootsSettingsModalProps> {
    exclusionmask_checkbox: preact.RefObject<CheckboxedField> = preact.createRef()
    exclusionmask_selection: preact.RefObject<base.ModelSelection> = preact.createRef()


    /** @override */
    form_content(): JSX.Element[] {
        const avmodels
            = this.props.$available_models.value?.detection
        const settings: RootsSettings|undefined = this.props.$settings.value;
        const activemodel: string|undefined 
            = settings?.active_models?.exclusionmask
        
        return super.form_content().concat([
            <div class="ui divider"></div>,

            <CheckboxedField
                checkbox_title = "Exclusion mask"
                checkbox_label = "Enable detection of foreign objects (e.g. tape)"

                checkbox_value = {this.props.$settings.value?.exclusionmask_active ?? false}
                ref            = {this.exclusionmask_checkbox}
            >
                <base.ModelSelection 
                    active_model     = {activemodel}
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
        const exmask_model:base.settings.ModelInfo|undefined 
            = this.exclusionmask_selection.current.get_selected()
        if(exmask_model == undefined)
            return null;

        const rootssettings: RootsSettings = {
            active_models : {
                detection:      settings?.active_models.detection,
                exclusionmask:  exmask_model.name,
            },
            exclusionmask_active: exmask_enabled,
            too_many_roots:       1250000,                                                    //TODO
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
    $checkbox_value: Signal<boolean> = new Signal<boolean>(false)

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
            { $val.value? props.children : null }
        </>
    }

    get_value(): boolean {
        return this.$checkbox_value.value;
    }
}
