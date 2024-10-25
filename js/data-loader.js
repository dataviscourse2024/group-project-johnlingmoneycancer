function loadAllFiles(callback) {
    // Load all files and return a promise that resolves when all files are loaded
    const fileMapping = {
        incidence: { 
            "allGroups": "data/cancer-incidence-csvs/LeadingCancerIncidence-ALLGROUPS.csv",
            "combinedAges": "data/cancer-incidence-csvs/LeadingCancerIncidence-COMBINEDAGES.csv",
            "race": "data/cancer-incidence-csvs/LeadingCancerIncidence-RACE.csv",
            "sex": "data/cancer-incidence-csvs/LeadingCancerIncidence-SEX.csv",
            "year": "data/cancer-incidence-csvs/LeadingCancerIncidence-YEAR.csv"
        },
        mortality: {
            "allGroups": "data/cancer-mortality-csvs/LeadingCancerMortality-ALLGROUPS.csv",
            "combinedAges": "data/cancer-mortality-csvs/LeadingCancerMortality-COMBINEDAGES.csv",
            "race": "data/cancer-mortality-csvs/LeadingCancerMortality-RACE.csv",
            "sex": "data/cancer-mortality-csvs/LeadingCancerMortality-SEX.csv",
            "year": "data/cancer-mortality-csvs/LeadingCancerMortality-YEAR.csv"       
        }
    };

    let datasets = { incidence: {}, mortality: {} };

    Promise.all([
        loadGroup('incidence', fileMappings.incidence),
        loadGroup('mortality', fileMappings.mortality)
    ]).then(() => {
        callback(datasets);
    });
}