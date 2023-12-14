import { createTimePicker, exportTimeSelection } from "../components/time.js";

document.addEventListener("DOMContentLoaded", function() {
    const timepicker = createTimePicker(".timepicker", [7, 8, 9]);

    document.querySelector("#btnselect").addEventListener("click", function() {
        console.log(exportTimeSelection(timepicker));
    });
});