export function loadAllFiles(callback) {
    const fileMappings = {
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
    ]).then(results => {
        datasets.incidence = results[0];
        datasets.mortality = results[1];
        callback(datasets);
    }).catch(error => {
        console.error("Error loading files:", error);
    });
}

export function loadGroup(groupName, fileMappings) {
    const promises = Object.keys(fileMappings).map(key => {
        return fetch(fileMappings[key])
            .then(response => response.text())
            .then(data => {
                const parsedData = d3.csvParse(data);
                return { key, data: parsedData };
            });
    });

    return Promise.all(promises)
        .then(results => {
            const groupData = {};
            results.forEach(result => {
                groupData[result.key] = result.data;
            });
            return groupData;
        });
}