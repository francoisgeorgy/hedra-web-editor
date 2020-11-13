import {log} from "./debug";
import {handleUserAction, updateModelAndUI} from "./ui";

export function setupControlsSelects() {
    log("setupControlsSelects()");

    //         .change((event) => channelSelectionCallback(event.target.value))

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

}
