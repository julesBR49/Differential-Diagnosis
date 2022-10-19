# Differential-Diagnosis
practice your differential diagnosis

To Use
---

Duplicate the notion template found here**

https://rainy-poultry-68c.notion.site/Differential-Diagnosis-DBs-574d62ab5b0048d7b1ec35550fd46cc5

You can now add your own information to the template databases

*The instructions for how to complete the following steps can be found here:* https://developers.notion.com/docs/getting-started 

- Create a notion integration 
- share your databases with your integration
- create a .env file with your notion integration secret key and the 5 database IDs

NOTION_API_KEY = [secret key]  
CONDITIONS_DB = [Conditions 🤮 database ID (32 char)]  
SYMPTOMS_DB = [Symptoms 🧩 database ID (32 char)]  
TEST_RESULTS_DB = [Test Results 🧪 database ID (32 char)]  
DIAGNOSTICS_DB = [Diagnostics 🔬 database ID (32 char)]  
TREATMENTS_DB = [Treatments 💉 database ID (32 char)]  

Now you are ready to run the program

To Run
---
in the console type

```console
cd Differential-Diagnosis
npm start
```

open http://localhost:8000/

start testing your diagnosis skills

** Disclaimer: 

- This template is to show the format only; the medical information is not complete
- The "patient profiles" are given to help form connections based on common presentations; they are not comprehensive 
- Likewise, signs and symptoms will be based on common presentations and are not comprehensive

