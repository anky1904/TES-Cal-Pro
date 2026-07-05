// ======================================================
// TES PRO
// Transformer Engineer Suite
// Engineering Calculation Engine
// Part 1
// Replace the TOP portion of calculator.js with this code
// ======================================================

const SQRT3 = Math.sqrt(3);

const calculateBtn = document.getElementById("calculateBtn");

function round(value, digits = 2) {
    return Number(value).toFixed(digits);
}

// ======================================
// Read Inputs
// ======================================

function getInputs() {

    return {

        hv: parseFloat(document.getElementById("hvVoltage").value),

        lv: parseFloat(document.getElementById("lvVoltage").value),

        vector: document.getElementById("vectorGroup").value,

        lvTurns: parseFloat(document.getElementById("lvTurns").value),

        hvCoils: parseInt(document.getElementById("hvCoils").value),

        taps: document
            .getElementById("tapValues")
            .value
            .split(",")
            .map(x => parseFloat(x.trim()))
            .filter(x => !isNaN(x))

    };

}

// ======================================
// Validation
// ======================================

function validate(data){

    if(isNaN(data.hv)){

        alert("Enter HV Voltage");
        return false;

    }

    if(isNaN(data.lv)){

        alert("Enter LV Voltage");
        return false;

    }

    if(isNaN(data.lvTurns)){

        alert("Enter LV Turns");
        return false;

    }

    if(isNaN(data.hvCoils)){

        alert("Enter HV Coils");
        return false;

    }

    return true;

}

// ======================================
// Phase Voltage
// ======================================

function phaseVoltage(voltage,connection){

    if(connection==="STAR")
        return voltage/SQRT3;

    return voltage;

}

// ======================================
// Decode Vector Group
// ======================================

function getConnection(vector){

    vector=vector.toUpperCase();

    let hv="DELTA";
    let lv="DELTA";

    if(vector.startsWith("Y"))
        hv="STAR";

    if(vector.startsWith("YN"))
        hv="STAR";

    if(vector.includes("D"))
        lv="DELTA";

    if(vector.includes("Y") && !vector.endsWith("11") && !vector.endsWith("1"))
        lv="STAR";

    if(vector.includes("YN"))
        lv="STAR";

    return{

        hv,
        lv

    };

}

// ======================================
// Engineering Turns Ratio
// ======================================

function calculateTurnsRatio(data){

    const connection=getConnection(data.vector);

    const hvPhase=phaseVoltage(
        data.hv*1000,
        connection.hv
    );

    const lvPhase=phaseVoltage(
        data.lv,
        connection.lv
    );

    return{

        hvConnection:connection.hv,

        lvConnection:connection.lv,

        lineRatio:(data.hv*1000)/data.lv,

        phaseRatio:hvPhase/lvPhase,

        hvPhase,

        lvPhase

    };

}

// ======================================
// HV Turns
// ======================================

function calculateHVTurns(data,ratio){

    const totalHVTurns=
        data.lvTurns*
        ratio.phaseRatio;

    const turnsPerCoil=
        totalHVTurns/
        data.hvCoils;

    return{

        totalHVTurns,

        turnsPerCoil

    };

}

// ======================================
// Tap Calculations
// ======================================

function calculateTapTurns(totalTurns,taps){

    return taps.map(t=>{

        return{

            tap:t,

            turns:
                totalTurns*
                (1+t/100)

        };

    });

}

// ======================================
// Single Tapping Coil
// ======================================

function calculateTapCoil(turnsPerCoil,totalTurns,taps){

    return taps.map(t=>{

        const extraTurns=
            totalTurns*
            (Math.abs(t)/100);

        return{

            tap:t,

            extraTurns,

            tapPosition:

                t>=0
                ?turnsPerCoil+extraTurns
                :turnsPerCoil-extraTurns

        };

    });

}
// ======================================================
// TES PRO
// Engineering Engine
// Part 2
// Paste BELOW Part 1
// ======================================================

// ======================================
// Dashboard Update
// ======================================

function updateDashboard(data,ratio,hv){

    document.getElementById("hvDisplay").textContent=
        data.hv+" kV";

    document.getElementById("lvDisplay").textContent=
        data.lv+" V";

    document.getElementById("ratioDisplay").textContent=
        round(ratio.phaseRatio,3);

    document.getElementById("turnDisplay").textContent=
        round(hv.totalHVTurns);

}

// ======================================
// Result Cards
// ======================================

function updateSummary(data,ratio,hv){

    document.getElementById("resultRatio").textContent=
        round(ratio.phaseRatio,4);

    document.getElementById("resultTurns").textContent=
        round(hv.totalHVTurns);

    document.getElementById("resultPerCoil").textContent=
        round(hv.turnsPerCoil);

    document.getElementById("resultTap").textContent=
        data.taps.join("% , ")+"%";

}

// ======================================
// Tap Table
// ======================================

function renderTapTable(tapTurns){

    const table=
        document.getElementById("tapTable");

    table.innerHTML="";

    tapTurns.forEach(item=>{

        const div=
            document.createElement("div");

        div.className="result-item";

        div.innerHTML=`

        <span>
        ${item.tap>0?"+":""}${item.tap}%
        </span>

        <strong>
        ${round(item.turns)}
        </strong>

        `;

        table.appendChild(div);

    });

}

// ======================================
// Tap Coil Table
// ======================================

function renderTapCoilTable(tapCoils){

    const table=
        document.getElementById("tapTable");

    table.innerHTML="";

    const heading=
        document.createElement("h3");

    heading.innerHTML="Tap Coil Positions";

    table.appendChild(heading);

    tapCoils.forEach(item=>{

        const div=
            document.createElement("div");

        div.className="result-item";

        div.innerHTML=`

        <span>

        ${item.tap>0?"+":""}${item.tap}%

        </span>

        <strong>

        Tap Position :
        ${round(item.tapPosition)}

        </strong>

        <br>

        Extra Turns :
        ${round(item.extraTurns)}

        `;

        table.appendChild(div);

    });

}

// ======================================
// Engineering Report
// ======================================

function engineeringReport(data,ratio,hv){

    console.clear();

    console.table({

        "HV Connection":ratio.hvConnection,

        "LV Connection":ratio.lvConnection,

        "HV Phase Voltage":round(ratio.hvPhase),

        "LV Phase Voltage":round(ratio.lvPhase),

        "Line Ratio":round(ratio.lineRatio,4),

        "Turns Ratio":round(ratio.phaseRatio,4),

        "Total HV Turns":round(hv.totalHVTurns),

        "Turns / Coil":round(hv.turnsPerCoil)

    });

}

// ======================================
// Main Calculation Engine
// ======================================

function calculateTransformer(){

    const data=getInputs();

    if(!validate(data))
        return;

    const ratio=
        calculateTurnsRatio(data);

    const hv=
        calculateHVTurns(data,ratio);

    const tapTurns=
        calculateTapTurns(
            hv.totalHVTurns,
            data.taps
        );

    const tapCoils=
        calculateTapCoil(
            hv.turnsPerCoil,
            hv.totalHVTurns,
            data.taps
        );

    updateDashboard(
        data,
        ratio,
        hv
    );

    updateSummary(
        data,
        ratio,
        hv
    );

    renderTapCoilTable(
        tapCoils
    );

    engineeringReport(
        data,
        ratio,
        hv
    );

}
// ======================================================
// TES PRO
// Engineering Engine
// Part 3
// Paste BELOW Part 2
// ======================================================

// ======================================
// Button Event
// ======================================

if(calculateBtn){

    calculateBtn.addEventListener(
        "click",
        calculateTransformer
    );

}

// ======================================
// Reset Form
// ======================================

const form=
document.getElementById(
    "calculatorForm"
);

if(form){

form.addEventListener("reset",()=>{

setTimeout(()=>{

document.getElementById("resultRatio").textContent="--";

document.getElementById("resultTurns").textContent="--";

document.getElementById("resultPerCoil").textContent="--";

document.getElementById("resultTap").textContent="--";

document.getElementById("tapTable").innerHTML="";

document.getElementById("hvDisplay").textContent="--";

document.getElementById("lvDisplay").textContent="--";

document.getElementById("ratioDisplay").textContent="--";

document.getElementById("turnDisplay").textContent="--";

},100);

});

}

// ======================================
// Auto Calculate
// ======================================

[
"hvVoltage",
"lvVoltage",
"vectorGroup",
"lvTurns",
"hvCoils",
"tapValues"
].forEach(id=>{

const el=document.getElementById(id);

if(!el) return;

el.addEventListener("change",()=>{

const hv=document.getElementById("hvVoltage").value;
const lv=document.getElementById("lvVoltage").value;
const turns=document.getElementById("lvTurns").value;
const coils=document.getElementById("hvCoils").value;

if(
hv!=="" &&
lv!=="" &&
turns!=="" &&
coils!==""
){

calculateTransformer();

}

});

});

// ======================================
// Future Expansion Hooks
// ======================================

/*

Upcoming TES Pro Modules

✓ Star-Star
✓ Star-Delta
✓ Delta-Star
✓ Delta-Delta
✓ Zig-Zag
✓ Auto Transformer
✓ Multi Secondary

✓ Tap Changer
✓ OLTC
✓ OCTC

✓ Main Coil Calculation
✓ Tapping Coil Calculation

✓ Disc Winding
✓ Helical Winding
✓ Crossover Winding

✓ Conductor Selection

✓ Current Density

✓ Window Space Factor

✓ Copper Weight

✓ Aluminium Weight

✓ Core Area

✓ Core Diameter

✓ Flux Density

✓ EMF Equation

✓ Turns Per Volt

✓ Stacking Factor

✓ Lamination Selection

✓ Cost Estimation

✓ PDF Report

*/

// ======================================================
// TES PRO
// Calculator Engine Complete
// ======================================================
