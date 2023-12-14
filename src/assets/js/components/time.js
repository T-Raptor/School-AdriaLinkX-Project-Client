function createTimePicker(selector, blockedSlots) {
    const target = document.querySelector(selector);
    const timepicker = { target, selected: [] };
    renderTimeSlots(timepicker, blockedSlots);

    target.addEventListener("click", function (e) {
        const elm = e.target;
        if (elm.classList.contains("slot") && !elm.classList.contains("blocked")) {
            const hour = +elm.innerHTML;
            if (timepicker.selected.includes(hour)
                && (!timepicker.selected.includes(hour - 1)
                    || !timepicker.selected.includes(hour + 1))
            ) {
                elm.classList.remove("selected");
                timepicker.selected = timepicker.selected.filter(x => x !== hour);
            } else if (timepicker.selected.length === 0
                || timepicker.selected.includes(hour - 1)
                || timepicker.selected.includes(hour + 1)
            ) {
                elm.classList.add("selected");
                timepicker.selected.push(hour);
            }
        }
    });

    return timepicker;
}

function renderTimeSlots(timepicker, blockedSlots) {
    const $content = timepicker.target.querySelector(".content");
    $content.innerHTML = "";
    for (let i = 0; i < 24; i++) {
        const strI = i < 10 ? "0" + i : "" + i;
        if (blockedSlots.includes(i)) {
            $content.innerHTML += `<li class='slot blocked'>${strI}</li>`;
        } else {
            $content.innerHTML += `<li class='slot'>${strI}</li>`;
        }
    }
}


function exportTimeSelection(timepicker) {
    return {
        start: Math.min(...timepicker.selected),
        stop: Math.max(...timepicker.selected) + 1
    };
}


export { createTimePicker, exportTimeSelection };
