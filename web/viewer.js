let subjects = [];

const select = document.getElementById("subjectSelect");

// ======================
// LOAD SUBJECT LIST
// ======================
async function loadSubjectList() {

    const res = await fetch("../data/statref/index.json");
    subjects = await res.json();

    subjects.forEach(s => {
        const opt = document.createElement("option");
        opt.value = s;
        opt.text = s;
        select.appendChild(opt);
    });

    // load first automatically
    loadData(subjects[0]);
}

// ======================
// LOAD CSV + PLOT
// ======================
async function loadData(subject) {

    const file = `../data/statref/STATREF_points_${subject}.csv`;

    const res = await fetch(file);
    const text = await res.text();

    const lines = text.split("\n").slice(1);

    let MOD = {x:[],y:[],z:[],name:[]};
    let REF = {x:[],y:[],z:[],name:[]};

    for (let l of lines) {

        let s = l.split(",");
        if (s.length < 5) continue;

        let x = +s[0];
        let y = +s[1];
        let z = +s[2];
        let c = +s[3];
        let n = s[4];

        if (c == 0) {
            MOD.x.push(x); MOD.y.push(y); MOD.z.push(z); MOD.name.push(n);
        } else {
            REF.x.push(x); REF.y.push(y); REF.z.push(z); REF.name.push(n);
        }
    }

    const traceMOD = {
        x: MOD.x,
        y: MOD.y,
        z: MOD.z,
        mode: 'markers+text',
        type: 'scatter3d',
        name: 'Model',
        text: MOD.name,
        textposition: 'top center',
        marker: { size: 4, color: 'blue' }
    };

    const traceREF = {
        x: REF.x,
        y: REF.y,
        z: REF.z,
        mode: 'markers+text',
        type: 'scatter3d',
        name: 'Reference',
        text: REF.name,
        textposition: 'top center',
        marker: { size: 4, color: 'red' }
    };

    Plotly.newPlot("plot", [traceMOD, traceREF], {
        margin: {l:0, r:0, t:0, b:0},
        legend: {orientation: "h"}
    });
}

// ======================
// EVENT LISTENER
// ======================
select.addEventListener("change", (e) => {
    loadData(e.target.value);
});

// init
loadSubjectList();