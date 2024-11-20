import { visualizeCancerDots } from './dot-visualization.js';
import { loadAllFiles } from './data-loader.js';
import { synchronizeCharts } from './chart-maker.js';

const cancerTypeMapping = {                             // checks if cancer has appropriate image and description
    "Brain Cancer": "Brain and Other Nervous System",   // check
    "Breast Cancer": "Breast",                          // check
    "Colon Cancer": "Colon and Rectum",                 // check
    "Leukemia": "Leukemias",
    "Liver Cancer": "Liver",                            // check
    "Lung Cancer": "Lung and Bronchus",                 // check
    "Non-Hodgkin Lymphoma": "Non-Hodgkin Lymphoma",
    "Pancreatic Cancer": "Pancreas",                    // check
    "Skin Cancer": "Melanoma of the Skin",              // check
    "Uterine Cancer": "Cervix Uteri"
};


const svgMain = d3.select("#visualization") // Top-level SVG declaration
    .append("svg")
    .attr("width", 1000)
    .attr("height", 600);

function scrollToBottom() {
    window.scrollTo({
        top: document.body.scrollHeight,
        behavior: 'smooth'
    });
}


// Function to display a description
function showDescription(title, content) {
    const description = document.getElementById('description');
    if (!description) {
        console.error("#description element not found.");
        return;
    }
    description.innerHTML = `
        <div class="title">${title}</div>
        <div class="content">${content}</div>
    `;
    description.style.display = 'block';
    setTimeout(() => (description.style.opacity = 1), 10);
}

export { showDescription };


function loadAndVisualize(displayName) {
    const cancerType = cancerTypeMapping[displayName];

    if (!cancerType) {
        console.error(`Cancer type "${displayName}" not found in the mapping.`);
        return;
    }

    // Filters
    const genderFilter = document.getElementById("gender-filter").value;
    const ageFilter = document.getElementById("age-filter").value;
    const raceFilter = document.getElementById("race-filter").value;

    // Load datasets and filter by cancer type and filters
    loadAllFiles(datasets => {
        let incidenceData = datasets.incidence.year.filter(d => d["Leading Cancer Sites"] === cancerType);
        let mortalityData = datasets.mortality.year.filter(d => d["Leading Cancer Sites"] === cancerType);

        // Apply gender filter
        if (genderFilter) {
            incidenceData = incidenceData.filter(d => d.Sex === genderFilter);
            mortalityData = mortalityData.filter(d => d.Sex === genderFilter);
        }

        // Apply age filter
        if (ageFilter) {
            incidenceData = incidenceData.filter(d => d["Age Groups"] === ageFilter);
            mortalityData = mortalityData.filter(d => d["Age Groups"] === ageFilter);
        }

        // Apply race filter
        if (raceFilter) {
            incidenceData = incidenceData.filter(d => d.Race === raceFilter);
            mortalityData = mortalityData.filter(d => d.Race === raceFilter);
        }

        if (incidenceData.length === 0 && mortalityData.length === 0) {
            console.warn(`No data found for cancer type: ${cancerType} with the selected filters.`);
            return;
        }

        // Draw trends in the visualization container
        // drawCancerTrends(cancerType, incidenceData, mortalityData, "#visualization");
    });
}

function handleVisualizations(cancerType, displayName, description) {
    document.querySelectorAll(".active-cancer").forEach(el => el.classList.remove("active-cancer"));

    // Add "active-cancer" to the clicked link
    const linkElement = document.getElementById(`${cancerType.toLowerCase().replace(/ /g, '-')}-link`);
    if (linkElement) {
        linkElement.classList.add("active-cancer");
        linkElement.dataset.cancerType = cancerType;
    }

    // Show filters and load visualizations
    document.getElementById("filters").classList.remove("hidden");

    // Show description
    showDescription(displayName, description);

    // Load and visualize the graphs
    setTimeout(() => {
        loadAllFiles(datasets => {
            visualizeCancerDots(cancerType, datasets.incidence.all);
        });

        setTimeout(() => {
            loadAndVisualize(displayName);
        }, 2000); // delay for grphs
    }, 500); // delay for dots
}


// Example dataset
let fullLineData = [];
let fullBarData = [];

// Function to filter data based on selected filters
function applyFilters(lineData, barData) {
    const genderFilter = document.getElementById("gender-filter").value;
    const ageFilter = document.getElementById("age-filter").value;
    const raceFilter = document.getElementById("race-filter").value;

    const filteredLineData = lineData.filter(d => {
        return (!genderFilter || d.gender === genderFilter) &&
            (!ageFilter || d.ageGroup === ageFilter) &&
            (!raceFilter || d.race === raceFilter);
    });

    const filteredBarData = barData.filter(d => {
        return (!genderFilter || d.gender === genderFilter) &&
            (!ageFilter || d.ageGroup === ageFilter) &&
            (!raceFilter || d.race === raceFilter);
    });

    return { filteredLineData, filteredBarData };
}

// Function to render charts with applied filters
function renderCharts() {
    const { filteredLineData, filteredBarData } = applyFilters(fullLineData, fullBarData);

    // Clear existing charts
    const lineChartContainer = d3.select('#line-chart-container').select('svg');
    if (!lineChartContainer.empty()) lineChartContainer.remove();

    const barChartContainer = d3.select('#bar-chart-container').select('svg');
    if (!barChartContainer.empty()) barChartContainer.remove();

    // Synchronize charts with filtered data
    synchronizeCharts(filteredLineData, filteredBarData);
}

// Event listeners for cancer links
document.addEventListener('DOMContentLoaded', () => {
    const cancerLinks = [
        {
            id: 'brain-cancer-link',
            cancerType: 'Brain Cancer',
            displayName: 'Brain Cancer',
            description: 'Brain cancer occurs when cells in the brain grow uncontrollably, disrupting brain function and causing neurological symptoms.'
        },
        {
            id: 'breast-cancer-link',
            cancerType: 'Breast Cancer',
            displayName: 'Breast Cancer',
            description: 'Breast cancer occurs when cells in the breast tissue grow uncontrollably, often forming lumps or masses that can spread to other areas of the body.'
        },
        {
            id: 'colon-cancer-link',
            cancerType: 'Colon Cancer',
            displayName: 'Colon Cancer',
            description: 'Colon cancer occurs when cells in the colon grow uncontrollably, often starting as polyps and potentially leading to symptoms like changes in bowel habits and abdominal discomfort.'
        },
        {
            id: 'leukemia-cancer-link',
            cancerType: 'Leukemia',
            displayName: 'Leukemia',
            description: 'Leukemia cancer occurs when blood-forming tissues produce abnormal blood cells, impacting overall health.'
        },
        {
            id: 'lung-cancer-link',
            cancerType: 'Lung Cancer',
            displayName: 'Lung Cancer',
            description: 'A disease where abnormal cells in the lungs grow uncontrollably, often caused by smoking, but it can affect non-smokers too.'
        },
        {
            id: 'liver-cancer-link',
            cancerType: 'Liver Cancer',
            displayName: 'Liver Cancer',
            description: 'Liver cancer starts in the liver cells and can cause symptoms like jaundice and abdominal pain as it progresses.'
        },
        {
            id: 'lymphoma-cancer-link',
            cancerType: 'Non-Hodgkin Lymphoma',
            displayName: 'Non-Hodgkin Lymphoma',
            description: 'Non-Hodgkin Lymphoma occurs when the body produces abnormal lymphocytes, leading to swollen lymph nodes and other symptoms.'
        },
        {
            id: 'pancreatic-cancer-link',
            cancerType: 'Pancreatic Cancer',
            displayName: 'Pancreatic Cancer',
            description: 'Pancreatic cancer occurs when cells in the pancreas grow uncontrollably, often without early symptoms, making it one of the deadliest cancers.'
        },
        {
            id: 'skin-cancer-link',
            cancerType: 'Skin Cancer',
            displayName: 'Skin Cancer',
            description: 'Skin cancer occurs when skin cells grow uncontrollably, typically due to UV exposure, and can spread if not treated early.'
        },
        {
            id: 'uterine-cancer-link',
            cancerType: 'Uterine Cancer',
            displayName: 'Uterine Cancer',
            description: 'Uterine cancer occurs when the cells in the lining of the uterus grow uncontrollably, commonly leading to abnormal bleeding and other symptoms.'
        }
    ];

    // Loop through each link and attach the event listener
    cancerLinks.forEach(link => {
        const element = document.getElementById(link.id);
        if (element) {
            element.addEventListener('click', () => {
                handleVisualizations(link.cancerType, link.displayName, link.description);
            });
        }
    });
});

document.addEventListener('DOMContentLoaded', () => {
    // Add unified event listeners for filters
    ["gender-filter", "age-filter", "race-filter"].forEach(filterId => {
        document.getElementById(filterId).addEventListener("change", () => {
            const currentCancerType = document.querySelector(".active-cancer")?.dataset?.cancerType;

            // If a cancer type is active, update visualizations
            if (currentCancerType) {
                loadAndVisualize(currentCancerType); // Update graphs and dots
            }

            renderCharts(); // Update line and bar charts
        });
    });

    // Replace the following with your actual data loading logic
    fullLineData = [
        { year: 2000, value: 100, gender: "Male", ageGroup: "20-24 years", race: "White" },
        { year: 2005, value: 150, gender: "Female", ageGroup: "25-29 years", race: "Black or African American" },
        // Add more data points
    ];

    fullBarData = [
        { category: "Lung Cancer", value: 120, gender: "Male", ageGroup: "20-24 years", race: "White" },
        { category: "Skin Cancer", value: 90, gender: "Female", ageGroup: "25-29 years", race: "Asian or Pacific Islander" },
        // Add more data points
    ];

    renderCharts(); // Initial rendering
});


