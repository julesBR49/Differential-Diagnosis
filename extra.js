
const getSymptomsFromBackend = async () => {
    console.log("extra.js Sx");
    const rest = await fetch("http://localhost:8000/symptoms");
    const data = await rest.json();
    return data;
};

const getTreatmentsFromBackend = async () => {
    const rest = await fetch("http://localhost:8000/treatments");
    const data = await rest.json();
    return data;
};

// const getPEFromBackend = async () => {
//     const rest = await fetch("http://localhost:8000/pe_findings");
//     const data = await rest.json();
//     return data;
// };

const getTestResultsFromBackend = async () => {
    const rest = await fetch("http://localhost:8000/test_results");
    const data = await rest.json();
    return data;
};

const getTestsFromBackend = async () => {
    const rest = await fetch("http://localhost:8000/tests");
    const data = await rest.json();
    return data;
};

const getTestData = async () => {
    const rest = await fetch("http://localhost:8000/submit_tests");
    const data = await rest.json();
    return data;
};

const parseTestData = function(test_array, case_id, testsDict, testResultsDict){
    const parsedTests = test_array.map((elem) => {
        const el = elem.toLowerCase();
        let results = "test not recognized";
        let test_id = "";
        let result_id = "";
        if (testsDict[el] !== undefined){
            results = testsDict[el].normal_results;
            test_id = testsDict[el].id;
        }
        if (testResultsDict[test_id + case_id] !== undefined){
            result_id = test_id + case_id;
            results = testResultsDict[result_id].results;
        };
        return {
            "test": el,
            "results": results,
            "id": result_id
    };
    });
    return parsedTests;
};

const getNewCase = async (symptomsDict, testsDict, testResultsDict, treatmentsDict) => {
    console.log("new Case in extra");
    // const resp = await fetch("http://localhost:8000/case");
    const caseInfo = await resp.json();
    // const symptomsDict = await symptomsDict_input;
    // console.log(symptomsDict);
    // const testsDict = await testsDict_input;
    // const testResultsDict = await testResultsDict_input;
    // const PE_Dict = await PE_Dict_input;
    const case_div = document.createElement('div');
    case_div.classList.add('caseContainer');
    // console.log(caseInfo.primarySymptoms);
    // console.log(symptomsDict);
    const symp = caseInfo.symptoms.map((obj) => symptomsDict[obj].name);
    // console.log("prim");
    // const secSymp = caseInfo.secondarySymptoms.map((obj) => symptomsDict[obj].name);
    // console.log("sec");
    // const PEfindings = caseInfo.PEfindings.map((obj) => PE_Dict[obj].name);
    // console.log("pe");
    case_div.innerHTML = `
        <h3>Case</h3>
        <p>Symptoms: ${symp}</p>
        <p>PE findings: none </p>
        <p>what tests would you like to order? </p>
        <form id="testsInput">
            <input type="text" id="tests" name="tests" placeholder="comma separated list" class="inputField" required />
            <input type="submit" id = "submitTests" />
        </form>
        <p>what is your diagnosis? </p>
            <form id="diagnosisInput">
            <input type="text" id="diagnosis" name="diagnosis" placeholder="enter your top diagnosis" class="inputField" required />
            <input type="submit" id = "submitDiagnosis" />
        </form>
    `;
    // console.log("html");
    container.append(case_div)
    const diag_div = document.createElement('div');
    container.append(diag_div);

    const diag_form  = document.getElementById('diagnosisInput');
    diag_form.addEventListener('submit', (event) => {
        console.log("event listener called");
        event.preventDefault();
        new FormData(diag_form);
    });
    diag_form.addEventListener('formdata', async (event) => {
        const diagnosis = event.formData.get("diagnosis");
        let num = 0; // incorrect
        // console.log(diagnosis)
        // const div = document.createElement('div');
        const treatments = caseInfo.treatments.map((obj) => treatmentsDict[obj]);
        const diag_names = diagnosis.split(",");
        diag_names.forEach((el) => {
            if (el.toLowerCase() == caseInfo.name.toLowerCase()){
                num = 1;
            }
        });
        if (num == 1){
            console.log("correct");
            diag_div.innerHTML = `
            <p> Correct!!!!! </p>
            <p> Treatments: ${treatments}</p>
            `
        }
        else {
            console.log('incorrect - ',caseInfo.name);
            diag_div.innerHTML = `
            <p> Incorrect :( </p>
            <p> Diagnosis is in fact ${caseInfo.name}</p>
            <p> Treatments: ${treatments}</p>
            `
        };
        console.log(JSON.stringify({
            number: num,
            id: caseInfo.id
        }));
        // container.append(diag_div);
        const updated = await fetch("http://localhost:8000/update_difficulty", {
            method: "POST",
            headers: {
                'Content-Type':'application/json',
                'Accept':'application/json'
            },
            body: JSON.stringify({
                number: num,
                id: caseInfo.id
            })
        });
        console.log("adding div");
        // container.append(div);
    });


    // const submitButton = document.getElementById("submitTests");
    const test_form  = document.getElementById('testsInput');
    test_form.addEventListener('submit', (event) => {
        console.log("event listener called");
        event.preventDefault();
        new FormData(test_form);
    });
    test_form.addEventListener('formdata', (event) => {
        const data = event.formData;
        const test_data = data.get("tests").split(",");
        const test_info = parseTestData(test_data, caseInfo.id, testsDict, testResultsDict) ;
        test_info.forEach((value) => {
                const div = document.createElement("div");
                // div.classList.add("userContainer");
                if (value.results.endsWith(".png") || value.results.endsWith(".jpeg") || value.results.endsWith(".jpg")){
                    const imgPath = "images/" + value.results;
                    div.innerHTML = `
                    <h3>${value.test}</h3>
                    <p><img src=${imgPath} class="img"></p>
                `;
                }
                else {
                    div.innerHTML = `
                    <h3>${value.test}</h3>
                    <p>${value.results}</p>
                `;
                };
                container.append(div);
        });
    });
};


const container = document.getElementById("container");
const openCaseButton = document.getElementById("newCaseButton");
// const addCaseContainer = document.getElementById("addCaseContainer");
// const closeCaseButton = document.getElementById("closeCaseButton");

const symptomsDict_Glob = await getSymptomsFromBackend();
window.sessionStorage.setItem('symptomsDict', JSON.stringify(symptomsDict_Glob));

// const PE_Dict_Glob = await getPEFromBackend();
// window.sessionStorage.setItem('PE_Dict', JSON.stringify(PE_Dict_Glob));

const testsDict_Glob = await getTestsFromBackend();
window.sessionStorage.setItem('testsDict', JSON.stringify(testsDict_Glob));

const testResultsDict_Glob = await getTestResultsFromBackend();
window.sessionStorage.setItem('testResultsDict', JSON.stringify(testResultsDict_Glob));

const treatmentsDict_Glob = await getTreatmentsFromBackend();
window.sessionStorage.setItem('treatmentsDict', JSON.stringify(treatmentsDict_Glob));

// console.log(symptomsDict_Glob);
// console.log(testsDict_Glob);
// console.log(testResultsDict_Glob);
// console.log(PE_Dict_Glob);
console.log(treatmentsDict_Glob);



openCaseButton.addEventListener("click", function() {
    console.log("calling");
    getNewCase(symptomsDict_Glob, testsDict_Glob, testResultsDict_Glob, treatmentsDict_Glob)});

  
  // Note that top-level await is only available in modern browsers
  // https://caniuse.com/mdn-javascript_operators_await_top_level

//   console.log(res);

