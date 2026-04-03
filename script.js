// Prednastavljeni termini (za test)
const schedule = {
    "2024-02-10": ["10:00", "11:00", "12:00", "14:00"],
    "2024-02-11": ["09:00", "10:00", "13:00"]
};

const calendarDiv = document.getElementById("calendar");
const timeSlotsDiv = document.getElementById("time-slots");
const form = document.getElementById("booking-form");

function renderCalendar() {
    calendarDiv.innerHTML = "<h2>Izberi datum</h2>";

    Object.keys(schedule).forEach(date => {
        const btn = document.createElement("button");
        btn.textContent = date;
        btn.onclick = () => renderTimeSlots(date);
        calendarDiv.appendChild(btn);
    });
}

function renderTimeSlots(date) {
    timeSlotsDiv.innerHTML = `<h2>Prosti termini za ${date}</h2>`;

    schedule[date].forEach(time => {
        const div = document.createElement("div");
        div.className = "time-slot";
        div.textContent = time;
        div.onclick = () => selectTime(date, time);
        timeSlotsDiv.appendChild(div);
    });
}

let selectedDate = null;
let selectedTime = null;

function selectTime(date, time) {
    selectedDate = date;
    selectedTime = time;
    form.style.display = "block";
}

form.addEventListener("submit", (e) => {
    e.preventDefault();
    alert(`Rezervacija: ${selectedDate} ob ${selectedTime}`);
});
renderCalendar();
