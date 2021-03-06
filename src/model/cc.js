import {log} from "../debug";
import {preferences} from "../preferences";

// 20 settings:

// CC# 04         | expression pedal
// CC# 09         | half speed enable
// CC# 14         | bypass
// CC# 15         | tempo (10 msec intervals)
// CC# 16         | key
// CC# 17         | micro tune
// CC# 18         | mix
// CC# 19         | pitch 1
// CC# 20         | pitch 2
// CC# 21         | pitch 3
// CC# 22         | scale type
// CC# 23         | pitch correction + glide
// CC# 24         | feedback
// CC# 25         | time division 1
// CC# 26         | time division 2
// CC# 27         | time division 3
// CC# 28         | tap
// CC# 29         | delay mode
// CC# 30         | pitch Control smoothing
// CC# 31         | volume swell enable

export const control_id = {
    exp_pedal: 4,
    half_speed_enable: 9,       // ALT / 2nd layer
    bypass: 14,
    tempo: 15,
    key: 16,
    micro_tune: 17,
    mix: 18,
    pitch_1: 19,
    pitch_2: 20,
    pitch_3: 21,
    scale: 22,         // ALT / 2nd layer
    pitch_correction: 23,   // ALT / 2nd layer
    feedback: 24,           // ALT / 2nd layer
    time_division_1: 25,    // ALT / 2nd layer
    time_division_2: 26,    // ALT / 2nd layer
    time_division_3: 27,     // ALT / 2nd layer
    tap: 28,
    delay_mode: 29,
    pitch_smoothing: 30,
    swell_enable: 31
};

export const control = new Array(127);

const _0_100 = function (v) {
    return Math.floor(v / 127 * 100 + 0.5);
};

const _percent = function (v) {
    return Math.floor(v / 127 * 100 + 0.5) + '%';
};

/*
const _off_when_zero = function (v) {
    return v === 0 ? 'OFF' : v;
};
*/

const _off_when_zero_percent = function (v) {
    return v === 0 ? 'OFF' : _percent(v);
};

const _2_steps = function (v) {
    return v < 64 ? 0 : 127;
};

const _4_steps = function (v) {
    if (v < 32) {
        return 0;
    } else if (v < 64) {
        return 63;
    } else if (v < 96) {
        return 95;
    } else {
        return 127;
    }
};

const KEY_VALUES = [2, 11, 25, 37, 47, 58, 66, 77, 87, 97, 108, 119, 127];  // each value must the UPPER limit of the range
const KEY_LABELS = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B', 'chrom'];

const _normalizeKey = function(value) {
    return KEY_VALUES.find(v => v >= value);
}

export function _key(value) {
    return KEY_LABELS[KEY_VALUES.findIndex(v => v >= value)];
}

const MODE_VALUES = [11, 37, 58, 78, 97, 119, 127];  // each value must the UPPER limit of the range
const MODE_LABELS = ['Maj', 'Min', 'Melo ', 'Harm', '2Harm', 'East', 'Penta'];

const _normalizeMode = function(value) {
    return MODE_VALUES.find(v => v >= value);
}

export function _mode(value) {
    return MODE_LABELS[MODE_VALUES.findIndex(v => v >= value)];
}

export function isChromatic(key = null) {
    // log("isChromatic()", key, (key || control[control_id.key].raw_value) === 127);
    return (key || control[control_id.key].raw_value) === 127;
}

export function isDiatonic(scale = null) {
    // log("isDiatonic()", scale, control[control_id.scale].raw_value, (scale || control[control_id.scale].raw_value) < 98);
    return (scale || control[control_id.scale].raw_value) < 98;
}

export function isPentatonic(scale = null) {
    // log("isPentatonic()", scale, (scale || control[control_id.scale].raw_value) >= 98);
    return (scale || control[control_id.scale].raw_value) >= 98;
}

export const PITCH_VALUES_CHROMATIC = [0, 2, 11, 15, 19, 23, 27, 31, 35, 39, 43, 47, 51, 55, 71, 75, 79, 83, 87, 91, 95, 99, 103, 107, 111, 115, 123, 125, 127];  // each value must the UPPER limit of the range
export const PITCH_LABELS_CHROMATIC = ['off',
    '-2 oct', '-1 oct', '-11', '-10', '-9', '-8', '-7', '-6', '-5', '-4', '-3', '-2', '-1', '0',
    '+1', '+2', '+3', '+4', '+5', '+6', '+7', '+8', '+9', '+10', '+11', '+12', '+19', '+2 oct'];

export const PITCH_VALUES_DIATONIC = [0, 7, 11, 19, 27, 35, 43, 51, 59, 67, 75, 83, 91, 99, 107, 115, 119, 127];  // each value must the UPPER limit of the range
export const PITCH_LABELS_DIATONIC = ['off',
    '-2 oct', '-1 oct', '-7', '-6', '-5', '-4', '-3', '-2', '0',
    '+2', '+3', '+4', '+5', '+6', '+7', '+1 oct', '+2 oct'];

export const PITCH_VALUES_PENTATONIC = [0, 19, 27, 35, 43, 51, 59, 67, 75, 83, 91, 99, 107, 127];  // each value must the UPPER limit of the range
export const PITCH_LABELS_PENTATONIC = ['off', '-2 oct', '-1 oct', '-5', '-4', '-3', '-2', '0', '+2', '+3', '+4', '+5', '+1 oct', '+2 oct'];

const _normalizePitch = function(value) {
    return PITCH_VALUES_CHROMATIC.find(v => v >= value);
}

const _pitch = function(value) {
    if (isChromatic()) {    // chromatic
        return PITCH_LABELS_CHROMATIC[PITCH_VALUES_CHROMATIC.findIndex(v => v >= value)];
    }
    if (isDiatonic()) {
        return PITCH_LABELS_DIATONIC[PITCH_VALUES_DIATONIC.findIndex(v => v >= value)];
    }
    if (isPentatonic()) {
        return PITCH_LABELS_PENTATONIC[PITCH_VALUES_PENTATONIC.findIndex(v => v >= value)];
    }

    return PITCH_LABELS_CHROMATIC[PITCH_VALUES_CHROMATIC.findIndex(v => v >= value)];
    // if (v === 0) {
    //     return "off";
    // } else if (v < 3) {
    //     return "-2 oct";
    // } else if (v < 12) {
    //     return "-1 oct";
    // } else if (v < 16) {
    //     return "-11";
    // } else if (v < 20) {
    //     return "-10";
    // } else if (v < 24) {
    //     return "-9";
    // } else if (v < 28) {
    //     return "-8";
    // } else if (v < 32) {
    //     return "-7";
    // } else if (v < 36) {
    //     return "-6";
    // } else if (v < 40) {
    //     return "-5";
    // } else if (v < 44) {
    //     return "-4";
    // } else if (v < 48) {
    //     return "-3";
    // } else if (v < 52) {
    //     return "-2";
    // } else if (v < 56) {
    //     return "-1";
    // } else if (v < 72) {
    //     return "0";
    // } else if (v < 76) {
    //     return "1";
    // } else if (v < 80) {
    //     return "2";
    // } else if (v < 84) {
    //     return "3";
    // } else if (v < 88) {
    //     return "4";
    // } else if (v < 92) {
    //     return "5";
    // } else if (v < 96) {
    //     return "6";
    // } else if (v < 100) {
    //     return "7";
    // } else if (v < 104) {
    //     return "8";
    // } else if (v < 108) {
    //     return "9";
    // } else if (v < 112) {
    //     return "10";
    // } else if (v < 116) {
    //     return "11";
    // } else if (v < 124) {
    //     return "12";
    // } else if (v < 126) {
    //     return "+19 Octave + Fifth";
    // } else {
    //     return "24 Two octaves up";
    // }
};

const _filter_type = function (v) {
    if (v < 4) {
        return "ladder LP";
    } else if (v < 33) {
        return "ladder BP";
    } else if (v < 60) {
        return "ladder HP";
    } else if (v < 88) {
        return "state var. LP";
    } else if (v < 116) {
        return "state var. BP";
    } else {
        return "state var. HP";
    }
};

const _filter_type_values = function (v) {
    if (v < 4) {
        return 0;
    } else if (v < 33) {
        return 32;
    } else if (v < 60) {
        return 59;
    } else if (v < 88) {
        return 87;
    } else if (v < 116) {
        return 115;
    } else {
        return 127;
    }
};

const _filter_env = function (v) {
    if (v===0) return "OFF";
    if (v < 64) {
        return `D ${63-v}`;
    } else {
        return `A ${v-64}`;
    }
};

const _env_type = function (v) {
    if (v < 64) {
        return "triggered";
    } else {
        return "follower";
    }
};

const _synth_mode = function (v) {
    if (v < 32) {
        return "dry";
    } else if (v < 64) {
        return "mono";
    } else if (v < 96) {
        return "arp";
    } else {
        return "poly";
    }
};

const _waveshape = function (v) {
    if (v < 64) {
        return "sawtooth";
    } else {
        return "square";
    }
};

export const _tempo_ms = function (v) {
    return (v * 10);    // + "ms";
};

export const _tempo_bpm = function (v) {
    // console.log("tempo bpm", v, Math.round(60000 / (v * 10)));
    const bpm = v > 0 ? Math.round(60000 / (v * 10)) : 0;
    return `${bpm}`;
};

function defineControls() {

    log(`%cdefineControls: setup model`, "color: yellow; font-weight: bold");

    control[control_id.exp_pedal] = { // 4,
        name: "Exp pedal",
        human: _0_100,
        infos: "The expression pedal works by morphing between two complete settings of all of the knob values (even the second layer knob values)."
    };
    control[control_id.half_speed_enable] = { // 9,
        name: "Envelope type",
        human: _env_type,
        map_raw: _2_steps,
        sysex: {
            offset: 22,
            mask: [0x7F]
        },
        infos: "Changes the Filter Envelope from Triggered Envelope to Envelope Follower."
    };
    control[control_id.bypass] = { // 14,
        name: "Bypass",
        no_init: true,
        no_randomize: true,
        map_raw: _2_steps,
        sysex: {
            offset: 21,
            mask: [0x7F]
        },
        infos: "Disables processing and passes the input through to the output."
    };
    control[control_id.tempo] = { // 15,
        name: "Tempo",
        human: _tempo_ms,
        sysex: {
            offset: 25,
            mask: [0x7F]
        },
        infos: "Sets the time for the delay line and arpeggiated Synth."
    };
    control[control_id.key] = { // 16,
        name: "Key",
        init_value: 0,
        // cc_center: [63, 64],
        human: _key,
        normalize: _normalizeKey,
        sysex: {
            offset: 9,
            mask: [0x7F]
        },
        sysex2: {
            offset: 26,
            mask: [0x7F]
        },
        infos: "Select the key"
    };
    control[control_id.micro_tune] = { // 17,
        name: "Filter",
        init_value: 127,
        human: _percent,
        sysex: {
            offset: 10,
            mask: [0x7F]
        },
        sysex2: {
            offset: 27,
            mask: [0x7F]
        },
        infos: "Changes the cutoff frequency of the micro_tune."
    };
    control[control_id.mix] = { // 18,
        name: "Mix",
        init_value: 127,
        human: _percent,
        sysex: {
            offset: 11,
            mask: [0x7F]
        },
        sysex2: {
            offset: 28,
            mask: [0x7F]
        },
        infos: "Adjusts the balance between Dry and Wet signals."
    };
    control[control_id.pitch_1] = { // 19,
        name: "Pitch 1",
        human: _pitch,
        normalize: _normalizePitch,
        sysex: {
            offset: 12,
            mask: [0x7F]
        },
        sysex2: {
            offset: 29,
            mask: [0x7F]
        },
        infos: "Increases the pitch_1 of Synth notes (Compresses the input in Dry Mode)."
    };
    control[control_id.pitch_2] = { // 20,
        name: "Pitch 2",
        human: _pitch,
        normalize: _normalizePitch,
        sysex: {
            offset: 13,
            mask: [0x7F]
        },
        sysex2: {
            offset: 30,
            mask: [0x7F]
        },
        infos: "Sets attack and decay rates for the Triggered Envelope; sets the direction and sensitivity for the Envelope Follower."
    };
    control[control_id.pitch_3] = { // 21,
        name: "Pitch 3",
        human: _pitch,
        normalize: _normalizePitch,
        sysex: {
            offset: 14,
            mask: [0x7F]
        },
        sysex2: {
            offset: 31,
            mask: [0x7F]
        },
        infos: "Detunes the oscillators of each Synth voice<br/>(Sets <span style='font-size: small'>the amount</span> of delay pitch_3 in Dry mode)."
    };
    control[control_id.scale] = { // 22,
        name: "Scale",
        human: _mode,
        normalize: _normalizeMode,
        sysex: {
            offset: 15,
            mask: [0x7F]
        },
        sysex2: {
            offset: 32,
            mask: [0x7F]
        },
        infos: "Smoothly glide from one Synth note to another (Bends the key using the micro_tune envelope as a modifier in Dry Mode)."
    };
    control[control_id.pitch_correction] = { // 23,
        name: "Filter type",
        human: _filter_type,
        map_raw: _filter_type_values,
        sysex: {
            offset: 16,
            mask: [0x7F]
        },
        sysex2: {
            offset: 33,
            mask: [0x7F]
        },
        infos: "Select between 6 micro_tune types (from Min to Max) : 1. Ladder Lowpass 2. Ladder Shelving Bandpass 3. Ladder Highpass 4. State Variable Lowpass 5. State Variable Bandpass 6. State Variable Highpass."
    };
    control[control_id.feedback] = { // 24,
        name: "Delay level",
        human: _percent,
        sysex: {
            offset: 17,
            mask: [0x7F]
        },
        sysex2: {
            offset: 34,
            mask: [0x7F]
        },
        infos: "Sets the level of a single delay tap from Min to Mid. After the Midpoint, this control blends in a second stereo tap."
    };
    control[control_id.time_division_1] = { //  25,
        name: "Ring modulation",
        human: _percent,
        sysex: {
            offset: 18,
            mask: [0x7F]
        },
        sysex2: {
            offset: 35,
            mask: [0x7F]
        },
        infos: "Changes the frequency of a classic ring modulator. The micro_tune envelope as a modifier."
    };
    control[control_id.time_division_2] = { // 26,
        name: "Filter Resonance",
        human: _percent,
        sysex: {
            offset: 19,
            mask: [0x7F]
        },
        sysex2: {
            offset: 36,
            mask: [0x7F]
        },
        infos: "Changes the micro_tune from a wide bandwidth for gentle filtering to a narrow bandwidth for peaky filtering."
    };
    control[control_id.time_division_3] = { // 27,
        name: "Delay feedback",
        human: _percent,
        sysex: {
            offset: 20,
            mask: [0x7F]
        },
        sysex2: {
            offset: 37,
            mask: [0x7F]
        },
        infos: "Sets the repeats for the delay line."
    };
    control[control_id.tap] = { // 28,
        name: "Tap",
        // no_init: true,
        init_value: 0,
        no_randomize: true,
        map_raw: () => 127,
        infos: "Sets the time for the delay line and arpeggiated Synth."
        // sysex: {
        //     offset: 22,
        //     mask: [0x7F]
        // }
    };
    control[control_id.delay_mode] = { // 29,
        name: "Synth mode",
        init_value: 63,
        human: _synth_mode,
        map_raw: _4_steps,
        sysex: {
            offset: 23,
            mask: [0x7F]
        },
        infos: "Poly: Multi-Voice Synthesizer with polyphonic chord tracking Mono: Single Voice Dual Osc Synth w/monophonic tracking Arp: Turns your chords into se-  quenced patterns linked to the tap tempo Dry: Disables the Synth. Allows the micro_tune, delay and key shift to be applied to the input signal."
    };
    control[control_id.pitch_smoothing] = { // 30
        name: "Waveshape",
        init_value: 0,
        human: _waveshape,
        map_raw: _2_steps,
        sysex: {
            offset: 24,
            mask: [0x7F]
        },
        infos: "Changes the Synth waveshape from Sawtooth to Square."
    };

    // add the missing default properties
    control.forEach(function (obj) {

        obj.cc_number = control.indexOf(obj);
        obj.cc_type = "cc";

        let bits = 7;

        if (!obj.hasOwnProperty("human")) {
            obj.human = v => v;
        }

        // if (!obj.hasOwnProperty("human_long")) {
        //     obj.human_long = obj.human;
        // }

        if (!obj.hasOwnProperty("normalize")) {
            obj.normalize = v => v;
        }

        if (!obj.hasOwnProperty("on_off")) {
            obj.on_off = false;
        }

        if (!obj.hasOwnProperty("range")) {
            obj.range = obj.on_off ? [0, 1] : [0, (1 << bits) - 1];
        }

        if (!obj.hasOwnProperty("cc_range")) {
            obj.cc_range = [0, (1 << bits) - 1];
        }

        // pre-computed value that may be useful:
        obj.cc_min = Math.min(...obj.cc_range);
        obj.cc_max = Math.max(...obj.cc_range);
        obj.cc_delta = obj.cc_max - obj.cc_min;

        if (!obj.hasOwnProperty("init_value")) {
            if (obj.hasOwnProperty("cc_center")) {
                obj.init_value = Array.isArray(obj.cc_center) ? obj.cc_center[0] : obj.cc_center;
            } else if ((Math.min(...obj.range) < 0) && (Math.max(...obj.range) > 0)) {
                obj.init_value = (1 << (bits - 1)) - 1; // very simple rule: we take max/2 as default value
            } else {
                obj.init_value = Math.min(...obj.range);
            }
        }

        if (!obj.hasOwnProperty("raw_value")) {
            obj.raw_value = obj.init_value;
        }

        if (obj.hasOwnProperty("sysex2")) {
            obj.two_values = true;    // true for the controls that can have two values, available with the EXP pedal
            obj.init_value2 = obj.init_value;
            obj.raw_value2 = obj.raw_value;
        } else {
            obj.two_values = false;
        }

        obj.changed = function () {
            return obj.raw_value !== obj.init_value;
        }

    });

} // defineControls()

defineControls();
