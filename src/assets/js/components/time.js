function createTimePicker(selector) {
    const target = document.querySelector(selector);
    const timepicker = { target, selected: [] };
    renderTimeSlots(timepicker);

    target.addEventListener("click", function(e) {
        const elm = e.target;
        if (elm.classList.contains("slot")) {
            if (elm.classList.contains("selected")) {
                elm.classList.remove("selected");
                timepicker.selected = timepicker.selected.filter(x => x !== +elm.innerHTML);
            } else {
                elm.classList.add("selected");
                timepicker.selected.push(+elm.innerHTML);
                console.log(timepicker.selected);
            }
        }
    });

    return timepicker;
}

function renderTimeSlots(timepicker) {
    const $content = timepicker.target.querySelector(".content");
    $content.innerHTML = "";
    for (let i = 0; i < 24; i++) {
        const strI = i < 10 ? "0"+i : ""+i;
        $content.innerHTML += `<li class='slot'>${strI}</li>`;
    }
}

export { createTimePicker };
