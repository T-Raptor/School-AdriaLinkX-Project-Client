function createTimePicker(selector, blockedSlots) {
    const target = document.querySelector(selector);
    const timepicker = { target, selected: [], start: null, stop: null };
    renderTimeSlots(timepicker, blockedSlots);

    registerTimePickerHandlers(timepicker, target);

    return timepicker;
}

function registerTimePickerHandlers(timepicker, target) {
    target.addEventListener("click", function (e) {
        const elm = e.target;
        if (elm.classList.contains("slot") && !elm.classList.contains("blocked")) {
            const hour = +elm.innerHTML;
            if (timepicker.start === null) {
                elm.classList.add("selected");
                timepicker.start = hour;
            } else if (timepicker.stop === null) {
                timepicker.stop = hour;
                for (let i = timepicker.start; i <= timepicker.stop; i++) {
                    timepicker.target.querySelector(`[data-id='${i}']`).classList.add("selected");
                }
            } else {
                timepicker.start = null;
                timepicker.stop = null;
                for (let i = 0; i <= 23; i++) {
                    timepicker.target.querySelector(`[data-id='${i}']`).classList.remove("selected");
                }
            }
        }
    });
}

function renderTimeSlots(timepicker, blockedSlots) {
    const $content = timepicker.target.querySelector(".content");
    $content.innerHTML = "";
    for (let i = 0; i < 24; i++) {
        const strI = i < 10 ? "0" + i : "" + i;
        if (blockedSlots.includes(i)) {
            $content.innerHTML += `<li data-id='${i}' class='slot blocked'>${strI}</li>`;
        } else {
            $content.innerHTML += `<li data-id='${i}' class='slot'>${strI}</li>`;
        }
    }
}


function exportTimeSelection(timepicker) {
    return {
        start: timepicker.start,
        stop: timepicker.stop + 1
    };
}


export { createTimePicker, exportTimeSelection };
