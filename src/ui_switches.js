import {log} from "./debug";
import {handleUserAction, updateControl} from "./ui";
import {appendMessage} from "./ui_messages";
import {updateDevice} from "./midi_out";
import MODEL from "./model";

export function updateBypassSwitch(value) {
    log("updateBypassSwitch", value);
    if (value === 0) {
        $("#cc-14-0").addClass("sw-off");
        $("#cc-14-127").removeClass("sw-off");
    } else {
        $("#cc-14-127").addClass("sw-off");
        $("#cc-14-0").removeClass("sw-off");
    }
}

export function updateOptionSwitch(id, value) {
    // "radio button"-like behavior
    log(`updateOptionSwitch(${id}, ${value})`);
    let e = $("#" + id);
    if (!e.is(".on")) {   // if not already on...
        e.siblings(".bt").removeClass("on");
        e.addClass("on");
    }
}

export function updateMomentaryStompswitch(id, value) {
    log(`updateMomentaryStompswitch(${id}, ${value})`);
    if (value === 0) {
        $(`#${id}-off`).removeClass("sw-off");
        $(`#${id}-on`).addClass("sw-off");
    } else {
        $(`#${id}-off`).addClass("sw-off");
        $(`#${id}-on`).removeClass("sw-off");
    }
}

let tap_timestamp = 0;

//TODO: compute tempo on an average of at least 3 values

export function tapDown(id) {
    log(`tapDown(${id})`);
    updateMomentaryStompswitch(id, 127);
    const t = Date.now();
    handleUserAction(...id.split("-"));
    const dt = t - tap_timestamp;
    tap_timestamp = t;
    if (dt < 5000) {    // if more than 5 sec, reset
        const bpm = Math.round(60000 / dt);
        appendMessage(`TAP ${dt}ms ${bpm}bpm`);
        const cc_value = Math.min(dt / 10, 127);
        updateDevice("cc", MODEL.control_id.tempo, cc_value);
        updateControl("cc", MODEL.control_id.tempo, cc_value);
    } else {
        appendMessage("TAP");
    }
}

export function tapRelease(id) {
    log(`tapRelease(${id})`);
    updateMomentaryStompswitch(id, 0);
}

/**
 *
 */
export function setupSwitches(userActionCallback) {
    log("setupSwitches()");
    // "radio button"-like behavior:
    $("div.bt").click(function() {
        // log(`click on ${this.id}`);
        if (!this.classList.contains("on")) {   // if not already on...
            $(this).siblings(".bt").removeClass("on");
            this.classList.add("on");
            userActionCallback(...this.id.split("-"));
        }
    });
    // toggle stompswitches:
    $(".sw").click(function() {
        this.classList.add("sw-off");
        $(this).siblings(".sw").removeClass("sw-off");
        userActionCallback(...this.id.split("-"));
    });
}

export function setupMomentarySwitches(tapDownCallback, releaseCallback) {
    // momentary stompswitches:
    $(".swm")
        .mousedown(function() {
            tapDownCallback(this.id)
        })
        .mouseup(function() {
            releaseCallback(this.id)
        });
}
