require("dotenv").config();
const { Client } = require("@notionhq/client");
const notion = new Client({ auth: process.env.NOTION_API_KEY });
const conditions_dbId = process.env.CONDITIONS_DB;
const symptoms_dbID = process.env.SYMPTOMS_DB;
const test_results_dbID = process.env.TEST_RESULTS_DB;
const tests_dbID = process.env.TESTS_DB;
const PEfindings_dbID = process.env.PE_FINDINGS_DB;
const treatments_dbID = process.env.TREATMENTS_DB;


function Case(id, name, primarySymptoms, secondarySymptoms, PEfindings, treatments){
    this.id = id;
    this.name = name;
    this.primarySymptoms = primarySymptoms;
    this.secondarySymptoms = secondarySymptoms;
    this.PEfindings = PEfindings;
    this.treatments = treatments;
};

function TestResult(results, test, condition){
    this.results = results; // path to image
    this.testID = test;
    this.conditionID = condition;
};

function Symptom(name, primaryConditions, secondaryConditions){
    this.name = name;
    this.primaryConditions = primaryConditions;
    this.secondaryConditions = secondaryConditions;
};

function PE_Finding(name, conditions){
    this.name = name;
    this.conditions = conditions;
    // this.visual = visual;
};

function Test(id, normal_results){
    this.id = id;
    this.normal_results = normal_results;
};

exports.getSymptomsDB = async function() {
    const response = await notion.databases.query({ database_id: symptoms_dbID,
        "sorts": [
            {
                "property": "Name",
                "direction": "ascending"
            }
        ] 
    });

    const symptomsDict = new Object();
    
    // console.log(response.results.length());
    for (const value of response.results) {
        symptomsDict[value.id] = new Symptom(
            value.properties.Name.title[0]?.plain_text,
            value.properties.Conditions_Primary.relation.map((obj) => obj.id),
            value.properties.Conditions_Secondary.relation.map((obj) => obj.id)
        );
    };
    const resp2 = await notion.databases.query({ database_id: symptoms_dbID,
        page_size: 40,
        "sorts": [
            {
                "property": "Name",
                "direction": "descending"
            }
        ] 
    });

    for (const value of resp2.results) {
        symptomsDict[value.id] = new Symptom(
            value.properties.Name.title[0]?.plain_text,
            value.properties.Conditions_Primary.relation.map((obj) => obj.id),
            value.properties.Conditions_Secondary.relation.map((obj) => obj.id)
        );
    };
    return symptomsDict;
};

exports.getPE_DB = async function() {
    const response = await notion.databases.query({ database_id: PEfindings_dbID });

    const PE_Dict = new Object();
    
    for (const value of response.results) {
        PE_Dict[value.id] = new PE_Finding(
            value.properties.Name.title[0]?.plain_text,
            value.properties.conditions.relation.map((obj) => obj.id),
            // value.properties.visual.relation.map((obj) => obj.id)
        );
    };
    return PE_Dict;
};

exports.getTreatmentsDB = async function() {
    const response = await notion.databases.query({ database_id: treatments_dbID });

    const treatmentsDict = new Object();
    
    for (const value of response.results) {
        treatmentsDict[value.id] = value.properties.Name.title[0]?.plain_text;
    };
    return treatmentsDict;
};

exports.getTestsDB = async function() {
    console.log("getting tests from backend");
    const response = await notion.databases.query({database_id: tests_dbID});

    const testsDict = new Object();

    for (const value of response.results) {
        if (value.id !== undefined){
            let normal_results = "normal";
            if (value.properties.normal_results.rich_text[0]?.plain_text !== undefined){
                normal_results = value.properties.normal_results.rich_text[0]?.plain_text;
            };
            value.properties.Name.title[0]?.plain_text.split(",").forEach((testName) => 
            // remove all spaces from test names
                testsDict[testName.toLowerCase().replace(" ", "")] = new Test(
                value.id,
                normal_results
            ));
        };
    };
    return testsDict;
};

exports.getTestResultsDB = async function() {
    // console.log("getting test results");
    const response = await notion.databases.query({ database_id: test_results_dbID});

    const testResultsDict = new Object();
    
    for (const value of response.results) {
        // console.log(value.properties.condition.relation[0])
        if (value.properties.condition.relation[0] !== undefined){
            const cond = value.properties.condition.relation[0].id;
            const test = value.properties.test.relation[0].id;
            // console.log(value.properties.result);
            testResultsDict[test + cond] = new TestResult(
                value.properties.result.rich_text[0]?.plain_text,
                test,
                cond
            );
        };
    };
    return testResultsDict;  
};


exports.getCase = async function() {
    const response = await notion.databases.query({ database_id: conditions_dbId,
            "filter": {
                "and":[
                    {
                        "property": "categories",
                        "multi_select": {
                            "contains": "GI"
                        }
                    },
                    {
                        "property": "categories",
                        "multi_select": {
                            "does_not_contain": "hidden"
                        }
                    }
                ]       
            },
        "sorts": [
            {
                "property": "weight",
                "direction": "ascending"
            }
        ]
    });

    const index = 0;
    const chosen = response.results[index];
    console.log(chosen.properties.treatments.relation);
    const chosenCase = new Case(
        chosen.id, 
        chosen.properties.Name.title[0]?.plain_text, 
        chosen.properties.symptoms_primary.relation.map((obj) => obj.id), 
        chosen.properties.symptoms_secondary.relation.map((obj) => obj.id),
        chosen.properties.pe_findings.relation.map((obj) => obj.id ),
        chosen.properties.treatments.relation.map((obj) => obj.id )
        // chosen.properties.treatments.relation.map((obj) => obj.properties.Name.title[0]?.plain_text)
        );
    // window.sessionStorage.setItem("currentCase", JSON.stringify(chosenCase));
    // return
    return chosenCase;
  };

//   parse tests string into array of test names
exports.getUserTests = async function(tests_str){
    return tests_str.split(',');
};

exports.updateDifficulty = async function(num, page_id){
    console.log("in updateDiff");
    const response = await notion.pages.update({ 
        page_id: page_id,
        properties: {
            'difficulty': {
              number: num,
            },
          },
    
    });
    console.log("done updating");
    return;
};
  
//   getSymptomsDB();
//   getCase();