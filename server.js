const express = require("express");
// our module
const moduleToFetch = require("./index");
const bp = require('body-parser')
// our function
const getSymptomsDB = moduleToFetch.getSymptomsDB;
const getTestResultsDB = moduleToFetch.getTestResultsDB;
const getTestsDB = moduleToFetch.getTestsDB;
const newCase = moduleToFetch.getCase;
const userTests = moduleToFetch.getUserTests;
const updateDifficulty = moduleToFetch.updateDifficulty;
// const getPE_DB = moduleToFetch.getPE_DB;
const getTreatmentsDB = moduleToFetch.getTreatmentsDB;



const port = 8000;
const app = express();

app.use(express.static("public"));
app.use(express.json());
app.use(bp.json())
app.use(bp.urlencoded({ extended: true }))

app.get("/test_results", async (req, res) => {
    const testResultsDict = await getTestResultsDB();
    res.json(testResultsDict);
});

app.get("/tests", async (req, res) => {
    const testsDict = await getTestsDB();
    res.json(testsDict);
});


app.get("/symptoms", async (req, res) => {
    console.log("getting Sx app.get");
    const symptomsDict = await getSymptomsDB();
    res.json(symptomsDict);
  });

app.get("/treatments", async (req, res) => {
const treatmentsDict = await getTreatmentsDB();
res.json(treatmentsDict);
});

// app.get("/pe_findings", async (req, res) => {
//     const PE_Dict = await getPE_DB();
//     res.json(PE_Dict);
// });

app.get("/case", async (req, res) => {
    const caseInfo = await newCase();
    console.log("getting a new case");
    // console.log(caseInfo);
    res.json(caseInfo)
});

app.post("/submit_tests", async (req, res) => {
    const tests_str = "Ultrasound, MRI";
    // const tests_str = req.body.tests;
    tests_results = await userTests(tests_str);
    res.json(tests_results);
});

app.post("/update_difficulty", async (req, res) => {
    console.log("trying...");
    // console.log(req.body.id);
    // const tests_str = req.body;
    // console.log(tests_str)
    const data = await updateDifficulty(req.body.number, req.body.id);
    console.log("gotcha");
    res.send("a");
});

app.listen(port, console.log(`Server started on ${port}`));