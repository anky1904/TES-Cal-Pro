const calculateBtn = document.getElementById("calculateBtn");

function round(value, digits = 2) {
    return Number(value).toFixed(digits);
}

function updateDashboard(hv, lv, ratio, turns) {
    document.getElementById("hvDisplay").textContent = hv;
    document.getElementById("lvDisplay").textContent = lv;
    document.getElementById("ratioDisplay").textContent = round(ratio, 3);
    document.getElementById("turnDisplay").textContent = round(turns, 2);
}

function calculateTransformer() {

    const hvVoltage = parseFloat(document.getElementById("hvVoltage").value);
    const lvVoltage = parseFloat(document.getElementById("lvVoltage").value);
    const lvTurns = parseFloat(document.getElementById("lvTurns").value);
    const hvCoils = parseFloat(document.getElementById("hvCoils").value);

    const tapString = document
        .getElementById("tapValues")
        .value
        .split(",")
        .map(v => parseFloat(v.trim()))
        .filter(v => !isNaN(v));

    if (
        isNaN(hvVoltage) ||
        isNaN(lvVoltage) ||
        isNaN(lvTurns) ||
        isNaN(hvCoils)
    ) {
        alert("Please enter all required values.");
        return;
    }

    const ratio = hvVoltage * 1000 / lvVoltage;

    const totalHVTurns = ratio * lvTurns;

    const turnsPerCoil = totalHVTurns / hvCoils;

    document.getElementById("resultRatio").textContent =
        round(ratio, 4);

    document.getElementById("resultTurns").textContent =
        round(totalHVTurns, 2);

    document.getElementById("resultPerCoil").textContent =
        round(turnsPerCoil, 2);

    document.getElementById("resultTap").textContent =
        tapString.join("% , ") + "%";

    updateDashboard(
        hvVoltage + " kV",
        lvVoltage + " V",
        ratio,
        totalHVTurns
    );

    const tapTable = document.getElementById("tapTable");
    tapTable.innerHTML = "";

    tapString.forEach(tap => {

        const tapTurns =
            totalHVTurns * (1 + tap / 100);

        const div = document.createElement("div");

        div.className = "result-item";

        div.innerHTML = `
            <strong>${tap > 0 ? "+" : ""}${tap}%</strong>
            <br>
            HV Turns : ${round(tapTurns,2)}
            <br>
            Turns / Coil : ${round(tapTurns / hvCoils,2)}
        `;

        tapTable.appendChild(div);

    });

}

if (calculateBtn) {
    calculateBtn.addEventListener("click", calculateTransformer);
}

const form = document.getElementById("calculatorForm");

if (form) {

    form.addEventListener("reset", () => {

        setTimeout(() => {

            document.getElementById("resultRatio").textContent = "--";
            document.getElementById("resultTurns").textContent = "--";
            document.getElementById("resultPerCoil").textContent = "--";
            document.getElementById("resultTap").textContent = "--";
            document.getElementById("tapTable").innerHTML = "";

            document.getElementById("hvDisplay").textContent = "--";
            document.getElementById("lvDisplay").textContent = "--";
            document.getElementById("ratioDisplay").textContent = "--";
            document.getElementById("turnDisplay").textContent = "--";

        }, 50);

    });

}
