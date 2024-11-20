import { loadAllFiles } from './data-loader.js';
import { showDescription } from './cancer-visualization.js';

let loadedDataset = null;

// Load datasets once when the script is initialized
loadAllFiles(datasets => {
    loadedDataset = datasets;
    console.log("Datasets loaded:", loadedDataset);
});

// function calculateIncidence(cancerType, dataset) {
//     if (!dataset) {
//         console.error("Dataset is undefined.");
//         return { totalIncidence: 0, percentage: 0 };
//     }
//     const filteredData = dataset.filter(d => d["Leading Cancer Sites"] === cancerType);
//     const totalIncidence = filteredData.reduce((sum, row) => sum + parseFloat(row.Count || 0), 0);
//     const percentage = Math.min(20, totalIncidence / 1000); // Scale appropriately
//     return { totalIncidence, percentage };
// }

function calculateIncidence(cancerType) {
    // Predefined incidence rates per 100,000 population
    const incidenceRatesPer100k = {
        "Brain Cancer": 3.5,
        "Breast Cancer": 43.3,
        "Colon Cancer": 4.0,
        "Leukemia Cancer": 5.0,
        "Liver Cancer": 1.5,
        "Lung Cancer": 1.2,
        "Non-Hodgkin Lymphoma": 7.0,
        "Pancreatic Cancer": 1.0,
        "Skin Cancer": 9.0,
        "Uterine Cancer": 2.5
    };

    // Return the incidence rate or default to 0 if not found
    return incidenceRatesPer100k[cancerType] || 0;
}

function createDotVisualization(totalDots, affectedDots) {
    console.log(`Creating visualization: Total dots = ${totalDots}, Affected dots = ${affectedDots}`); // Debug
    const container = document.getElementById('dot-container');
    if (!container) {
        console.error("#dot-container not found in HTML.");
        return;
    }

    container.innerHTML = '';
    for (let i = 1; i <= totalDots; i++) {
        const dot = document.createElement('div');
        dot.classList.add('dot');

        if (i <= affectedDots) {
            setTimeout(() => dot.classList.add('affected'), i * 50);
        }
        container.appendChild(dot);
    }

    console.log("Dot visualization created successfully."); // Debug
}

function updateDotInfo(title, content) {
    const infoContainer = document.getElementById('dot-info');

    if (!infoContainer) {
        console.error("#dot-info element not found in HTML.");
        return;
    }

    infoContainer.innerHTML = `
        <div class="info-title">${title}</div>
        <div class="info-content">${content}</div>
    `;

    infoContainer.style.display = 'block';
    setTimeout(() => (infoContainer.style.opacity = 1), 10); // Fade in
}

function visualizeCancerDots(cancerType) {
    const incidenceRate = calculateIncidence(cancerType); // Get predefined rate (per 100,000)

    createDotVisualization(100, incidenceRate);

    // Add Dot info
    updateDotInfo(
        `Young People Incidence Rate of ${cancerType}`,
        `The incidence rate for ${cancerType} is approximately ${incidenceRate} per 100,000 people.`
    );
}

export { visualizeCancerDots };

