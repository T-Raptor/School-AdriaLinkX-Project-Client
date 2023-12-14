import { createCalendar } from "../components/date.js";

document.addEventListener("DOMContentLoaded", function() {
    const calendar = createCalendar("#demo-calender");
    console.log(calendar);
});
