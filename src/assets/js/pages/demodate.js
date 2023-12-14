import { createCalendar, exportDateSelection } from "../components/date.js";

document.addEventListener("DOMContentLoaded", function() {
    const calendar = createCalendar("#demo-calender");

    document.querySelector("#btnselect").addEventListener("click", function() {
        const date = exportDateSelection(calendar);
        console.log(date);
    });
});
