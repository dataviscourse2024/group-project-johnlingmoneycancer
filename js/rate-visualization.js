import { loadAllFiles } from './data-loader.js';

let loadedDataset = null;

// Load datasets once when the script is initialized
loadAllFiles(datasets => {
    loadedDataset = datasets;
    console.log("Datasets loaded:", loadedDataset);
});

function calculateIncidence(cancerType) {
    const incidenceRatesPer100k = {
        "Brain Cancer": 3.5,
        "Breast Cancer": 43.3,
        "Colon Cancer": 4.0,
        "Leukemia": 5.0,
        "Liver Cancer": 1.5,
        "Lung Cancer": 1.2,
        "Non-Hodgkin Lymphoma": 7.0,
        "Pancreatic Cancer": 1.0,
        "Skin Cancer": 9.0,
        "Uterine Cancer": 2.5
    };

    return incidenceRatesPer100k[cancerType] || 0;
}

function calculateMortality(cancerType) {
    const mortalityRatesPer100k = {
        "Brain Cancer": 2.0,
        "Breast Cancer": 5.5,
        "Colon Cancer": 1.5,
        "Leukemia": 2.7,
        "Liver Cancer": 1.3,
        "Lung Cancer": 0.9,
        "Non-Hodgkin Lymphoma": 1.2,
        "Pancreatic Cancer": 0.8,
        "Skin Cancer": 0.5,
        "Uterine Cancer": 0.7
    };

    return mortalityRatesPer100k[cancerType] || 0;
}

// Helper function to create rate visualizations
function createRateVisualization(rate, containerId, iconPath) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`Container with ID "${containerId}" not found.`);
        return;
    }

    // Clear any previous content
    container.innerHTML = "";

    // Title for the rate visualization
    const rateTitle = document.createElement("div");
    rateTitle.className = "rate-title";
    rateTitle.innerHTML = `${containerId.includes("incidence") ? "Incidence" : "Mortality"} Rate: ${rate} per 100,000<br>`;
    container.appendChild(rateTitle);

    // Number of icons to display
    const numIcons = Math.floor(rate); // !currently rounds down!

    // Icon container for layout
    const iconContainer = document.createElement("div");
    iconContainer.className = "icon-container";
    container.appendChild(iconContainer);

    // Append the appropriate number of icons
    for (let i = 0; i < numIcons; i++) {
        const icon = document.createElement("img");
        icon.src = iconPath;
        icon.alt = "Rate Icon";
        icon.className = "rate-icon";
        iconContainer.appendChild(icon);
    }
}

// Main function to visualize cancer rates
export function visualizeCancerRates(cancerType) {
    const parentContainer = document.getElementById("rate-visualization-container");
    if (!parentContainer) {
        console.error("Parent container for rate visualization not found.");
        return;
    }

    // Ensure incidence and mortality containers exist
    let incidenceContainer = document.getElementById("rate-visualization-incidence");
    let mortalityContainer = document.getElementById("rate-visualization-mortality");

    // Create the containers if they don't exist
    if (!incidenceContainer) {
        incidenceContainer = document.createElement("div");
        incidenceContainer.id = "rate-visualization-incidence";
        parentContainer.appendChild(incidenceContainer);
        console.log("Incidence container created.");
    }

    if (!mortalityContainer) {
        mortalityContainer = document.createElement("div");
        mortalityContainer.id = "rate-visualization-mortality";
        parentContainer.appendChild(mortalityContainer);
        console.log("Mortality container created.");
    }

    const incidenceRate = calculateIncidence(cancerType); // Predefined or calculated rates
    const mortalityRate = calculateMortality(cancerType);

    // Create visualizations for incidence and mortality rates
    createRateVisualization(incidenceRate, "rate-visualization-incidence", "photos/orange-person-symbol.png");
    createRateVisualization(mortalityRate, "rate-visualization-mortality", "photos/red-person-symbol.png");
}
