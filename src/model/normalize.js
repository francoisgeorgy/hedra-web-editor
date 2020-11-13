
/*
export function normalizeKey(v) {
    if (v < 3) {
        return 0;
    } else if (v < 12) {
        return 3;
    } else if (v < 26) {
        return 12;
    } else if (v < 38) {
        return 26;
    } else if (v < 48) {
        return 38;
    } else if (v < 59) {
        return 48;
    } else if (v < 67) {
        return 59;
    } else if (v < 78) {
        return 67;
    } else if (v < 88) {
        return 78;
    } else if (v < 98) {
        return 88;
    } else if (v < 109) {
        return 98;
    } else if (v < 120) {
        return 109;
    } else  {
        return 120;
    }
}
*/

function normalizePitch(v) {
    if (v === 0) {
        return 0;
    } else if (v < 3) {
        return "-2 oct";
    } else if (v < 12) {
        return "-1 oct";
    } else if (v < 16) {
        return "-11";
    } else if (v < 20) {
        return "-10";
    } else if (v < 24) {
        return "-9";
    } else if (v < 28) {
        return "-8";
    } else if (v < 32) {
        return "-7";
    } else if (v < 36) {
        return "-6";
    } else if (v < 40) {
        return "-5";
    } else if (v < 44) {
        return "-4";
    } else if (v < 48) {
        return "-3";
    } else if (v < 52) {
        return "-2";
    } else if (v < 56) {
        return "-1";
    } else if (v < 72) {
        return "0";
    } else if (v < 76) {
        return "1";
    } else if (v < 80) {
        return "2";
    } else if (v < 84) {
        return "3";
    } else if (v < 88) {
        return "4";
    } else if (v < 92) {
        return "5";
    } else if (v < 96) {
        return "6";
    } else if (v < 100) {
        return "7";
    } else if (v < 104) {
        return "8";
    } else if (v < 108) {
        return "9";
    } else if (v < 112) {
        return "10";
    } else if (v < 116) {
        return "11";
    } else if (v < 124) {
        return "12";
    } else if (v < 126) {
        return "+19 Octave + Fifth";
    } else {
        return "24 Two octaves up";
    }
};
