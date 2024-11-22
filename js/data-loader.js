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

// Specifically loads the ALLGROUPS (main) dataset
export function loadAllGroups(callback) {
    const allGroupsFiles = {
        incidence: "data/cancer-incidence-csvs/LeadingCancerIncidence-ALLGROUPS.csv",
        mortality: "data/cancer-mortality-csvs/LeadingCancerMortality-ALLGROUPS.csv"
    };

    const allGroupsData = {};
    const promises = [];

    for (const [key, filePath] of Object.entries(allGroupsFiles)) {
        const promise = d3.csv(filePath)
            .then(data => {
                allGroupsData[key] = data; // Store loaded data
            })
            .catch(error => {
                console.error(`Error loading ${filePath}:`, error);
            });

        promises.push(promise);
    }

    // Wait for all files to load, then invoke the callback
    Promise.all(promises)
        .then(() => {
            console.log("ALLGROUPS files loaded:", allGroupsData);
            callback(allGroupsData); // Pass the loaded ALLGROUPS data to the callback
        })
        .catch(error => {
            console.error("Error loading ALLGROUPS files:", error);
        });
}

// Specifically loads the COMBINEDGROUPS (main) dataset - all age groups combined
export function loadCombinedAges(callback) {
    const combinedAgesFiles = {
        incidence: "data/cancer-incidence-csvs/LeadingCancerIncidence-COMBINEDAGES.csv",
        mortality: "data/cancer-mortality-csvs/LeadingCancerMortality-COMBINEDAGES.csv"
    };

    const combinedAgesData = {};
    const promises = [];

    for (const [key, filePath] of Object.entries(combinedAgesFiles)) {
        const promise = d3.csv(filePath)
            .then(data => {
                combinedAgesData[key] = data; // Store loaded data
            })
            .catch(error => {
                console.error(`Error loading ${filePath}:`, error);
            });

        promises.push(promise);
    }

    // Wait for all files to load, then invoke the callback
    Promise.all(promises)
        .then(() => {
            console.log("COMBINEDAGES files loaded:", combinedAgesData);
            callback(combinedAgesData); // Pass the loaded COMBINEDAGES data to the callback
        })
        .catch(error => {
            console.error("Error loading COMBINEDAGES files:", error);
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