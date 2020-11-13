import {log} from "./debug";
import MODEL from "./model";
import Knob from "svg-knob";
import {KNOB_THEME_DEFAULT} from "./ui_schemes";
import {handleUserAction, updateLinkedSelects} from "./ui";
import {control_id} from "./model/cc";
import {updateSelects} from "./ui_controls_selects";

export const knobs = {};         // collection of svg-knob

function knobCallback(control_type, control_number, value) {
    log("knobCallback", control_number, value);
    if (control_number === control_id.key || control_number === control_id.scale) {
        const prev_key = MODEL.getControlValue(MODEL.control[control_id.key]);
        const prev_scale = MODEL.getControlValue(MODEL.control[control_id.scale]);
        updateSelects(prev_key, prev_scale, control_number === control_id.key ? value : null, control_number === control_id.scale ? value : null);
    }
    handleUserAction(control_type, control_number, value);
    updateLinkedSelects(control_type, control_number, value);
}

/**
 *
 */
export function setupKnobs(userActionCallback) {

    log("setupKnobs()");

    for (let i=0; i < MODEL.control.length; i++) {

        const c = MODEL.control[i];
        if (typeof c === "undefined") {
            // log("device undefined", i);
            continue;
        }

        const id = `${c.cc_type}-${c.cc_number}`;
        const v = MODEL.getControlValue(MODEL.control[i]);

        let elem = document.getElementById(id);
        if (elem === null) {
            continue;
        }
        if (!elem.classList.contains("knob")) continue;

        log(`setupKnobs: configure #${id}: range=${c.cc_range}, init-value=${v}`);

        knobs[id] = new Knob(elem, KNOB_THEME_DEFAULT);
        knobs[id].config = {
            // zero_at: 270.0,
            // angle_min: 70.0,
            // angle_max: 290.0,
            value_min: Math.min(...c.cc_range),
            value_max: Math.max(...c.cc_range),
            default_value: v,
            center_zero: Math.min(...c.range) < 0,
            center_value: c.hasOwnProperty("cc_center") ? c.cc_center : c.init_value,
            format: v => c.human(v)
        };
        knobs[id].disableDebug();

        elem.addEventListener("change", function(event) {
            // userActionCallback(c.cc_type, c.cc_number, event.detail);
            knobCallback(c.cc_type, c.cc_number, event.detail);
        });
    }

} // setupKnobs

/**
 *
 */
export function switchKnobsDisplay(display_raw_value = false) {

    log("switchKnobsDisplay()");

    for (const id in knobs) {
        if (knobs.hasOwnProperty(id)) {
            knobs[id].setConfigValue("display_raw", display_raw_value);
        }
    }

} // setupKnobs
