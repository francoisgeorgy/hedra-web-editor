import {log, TRACE} from "./debug";
import {handleUserAction, updateModelAndUI} from "./ui";
import {
    control_id,
    isChromatic,
    isDiatonic,
    isPentatonic,
    PITCH_LABELS_CHROMATIC, PITCH_LABELS_DIATONIC,
    PITCH_LABELS_PENTATONIC,
    PITCH_VALUES_CHROMATIC, PITCH_VALUES_DIATONIC, PITCH_VALUES_PENTATONIC
} from "./model/cc";
import MODEL from "./model";

function buildSelect(control_number, values, labels) {
    log("buildSelect()", control_number);
    if (values.length !== labels.length) {
        log.error("number of values and number of labels not equal", values, labels);
    }
    const prefix = `cc-${control_number}`;
    const select = $(`#${prefix}-values`);
    // log("buildSelect 1", prefix, select);
    select.empty();
    // log("buildSelect 2", prefix, select);
    for (let i=0; i < values.length; i++) {
        select.append(`<option value="${prefix}-${values[i]}">${labels[i]}</option>`);
    }
    // log("buildSelect 3", prefix, select);
}

export function updateSelects(prev_key, prev_scale, new_key, new_scale, force = false) {

    log("updateSelects()", prev_key, prev_scale, new_key, new_scale, force);

    if (isChromatic(new_key)) {
        if (force || !isChromatic(prev_key)) {
            buildSelect(19, PITCH_VALUES_CHROMATIC, PITCH_LABELS_CHROMATIC);
            buildSelect(20, PITCH_VALUES_CHROMATIC, PITCH_LABELS_CHROMATIC);
            buildSelect(21, PITCH_VALUES_CHROMATIC, PITCH_LABELS_CHROMATIC);
        }
    } else if (isDiatonic(new_scale)) {
        // log("updateSelects(): isDiatonic");
        if (force || !isDiatonic(prev_scale)) {
            log("updateSelects(): was not diatonic, DO update");
            buildSelect(19, PITCH_VALUES_DIATONIC, PITCH_LABELS_DIATONIC);
            buildSelect(20, PITCH_VALUES_DIATONIC, PITCH_LABELS_DIATONIC);
            buildSelect(21, PITCH_VALUES_DIATONIC, PITCH_LABELS_DIATONIC);
        }
    } else if (isPentatonic(new_scale)) {
        // log("updateSelects(): isPentatonic");
        if (force || !isPentatonic(prev_scale)) {
            log("updateSelects(): was not pentatonic, DO update");
            buildSelect(19, PITCH_VALUES_PENTATONIC, PITCH_LABELS_PENTATONIC);
            buildSelect(20, PITCH_VALUES_PENTATONIC, PITCH_LABELS_PENTATONIC);
            buildSelect(21, PITCH_VALUES_PENTATONIC, PITCH_LABELS_PENTATONIC);
        }
    }
}

export function setupControlsSelects() {
    if (TRACE) console.group("setupControlsSelects()");

    //         .change((event) => channelSelectionCallback(event.target.value))

    updateSelects(null, null, MODEL.getControlValue(MODEL.control[control_id.key]), MODEL.getControlValue(MODEL.control[control_id.scale]), true);

    $("select.cc-values").change(function(event) {
        log(`select change: ${this.id}`, event.target.value.split("-"));

        updateModelAndUI(...event.target.value.split("-"));
        handleUserAction(...event.target.value.split("-"));

        // if (!this.classList.contains("on")) {   // if not already on...
        //     $(this).siblings(".bt").removeClass("on");
        //     this.classList.add("on");
        //     userActionCallback(...this.id.split("-"));
        // }
    });

    // // toggle stompswitches:
    // $(".sw").click(function() {
    //     this.classList.add("sw-off");
    //     $(this).siblings(".sw").removeClass("sw-off");
    //     userActionCallback(...this.id.split("-"));
    // });
    if (TRACE) console.groupEnd();
}
