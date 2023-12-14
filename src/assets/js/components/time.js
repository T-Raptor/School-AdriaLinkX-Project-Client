function createTimePicker(selector) {
    const target = document.querySelector(selector);
    const timepicker = { target };
    renderTimeSlots(timepicker);
    return timepicker;
}

function renderTimeSlots(timepicker) {
    const $content = timepicker.target.querySelector(".content");
    $content.innerHTML = "";
    for (let i = 0; i < 24; i++) {
        const strI = i < 10 ? "0"+i : ""+i;
        $content.innerHTML += `<li>${strI}</li>`;
    }
}

export { createTimePicker };
