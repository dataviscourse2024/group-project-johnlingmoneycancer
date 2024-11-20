import { visualizeCancerDots } from './dot-visualization.js';
import { loadAllFiles } from './data-loader.js';
import { synchronizeCharts } from './chart-maker.js';
import { drawLineChart } from './chart-maker.js';

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
export function showDescription(title, content) {
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


function loadAndVisualize(displayName) {
    const cancerType = cancerTypeMapping[displayName];

    if (!cancerType) {
        console.error(`Cancer type "${displayName}" not found in the mapping.`);
        return;
    }

    // Filters
    const filters = {
        gender: document.getElementById("gender-filter").value,
        age: document.getElementById("age-filter").value,
        race: document.getElementById("race-filter").value
    };

    // Load datasets and filter by cancer type and filters
    loadAllFiles(datasets => {
        // Select dataset based on filter presence
        const selectedKey =
            filters.gender
                ? "sex"
                : filters.age
                    ? "combinedAges"
                    : filters.race
                        ? "race"
                        : "year"; // default

        let incidenceData = datasets.incidence[selectedKey]?.filter(d => d["Leading Cancer Sites"] === cancerType);
        let mortalityData = datasets.mortality[selectedKey]?.filter(d => d["Leading Cancer Sites"] === cancerType);

        // Apply filters to the selected dataset
        incidenceData = applyFiltersToDataset(incidenceData, filters);
        mortalityData = applyFiltersToDataset(mortalityData, filters);

        if (incidenceData.length === 0 && mortalityData.length === 0) {
            console.warn(`No data found for cancer type: ${cancerType} with the selected filters.`);
            return;
        }

        // Prepare data for charts
        const incidenceChartData = incidenceData.map(d => ({
            year: +d.Year,
            value: +d.Count
        }));

        const mortalityChartData = mortalityData.map(d => ({
            year: +d.Year,
            value: +d.Count
        }));

        // Draw separate charts
        drawLineChart(incidenceChartData, "#incidence-chart-container", "Incidence Over Time", "orange");
        drawLineChart(mortalityChartData, "#mortality-chart-container", "Mortality Over Time", "red");
    });
}



function handleVisualizations(cancerType, displayName, description) {
    // Remove "active-cancer" class from all previously active links
    document.querySelectorAll(".active-cancer").forEach(el => el.classList.remove("active-cancer"));

    // Add "active-cancer" to the clicked link
    const linkElement = document.getElementById(`${cancerType.toLowerCase().replace(/ /g, '-')}-link`);
    if (linkElement) {
        linkElement.classList.add("active-cancer");
        linkElement.dataset.cancerType = cancerType;
    }

    // Show filters and charts
    const elementsToShow = ["filters", "incidence-chart-container", "mortality-chart-container", "visualization"];
    const missingElements = elementsToShow.filter(id => !document.getElementById(id));
    if (missingElements.length > 0) {
        console.warn(`Missing elements with IDs: ${missingElements.join(", ")}`);
    }

    elementsToShow.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.classList.add("show"); // Add the show class for smooth transition
        }
    });

    // Show description
    showDescription(displayName, description);

    // Load and visualize the graphs
    setTimeout(() => {
        loadAllFiles(datasets => {
            if (!datasets || !datasets.incidence || !datasets.incidence.all) {
                console.error("Datasets are not loaded or malformed.");
                return;
            }
            visualizeCancerDots(cancerType, datasets.incidence.all); // Dot visualization
        });

        setTimeout(() => {
            loadAndVisualize(displayName); // Load graphs
        }, 1500); // Adjusted delay for graphs
    }, 500); // Delay for dots
}




// Example dataset
let fullLineData = [];
let fullBarData = [];

// Function to apply filters to the dataset
function applyFiltersToDataset(dataset, filters) {
    if (!dataset || dataset.length === 0) return [];

    return dataset.filter(d => {
        const filterConditions = [
            !filters.gender || d.Sex === filters.gender,
            !filters.age || d["Age Groups"] === filters.age,
            !filters.race || d.Race === filters.race
        ];
        return filterConditions.every(Boolean); // Apply all valid filters
    });
}


// Function to render charts with applied filters
function renderCharts() {
    const filters = {
        gender: document.getElementById("gender-filter").value || null,
        age: document.getElementById("age-filter").value || null,
        race: document.getElementById("race-filter").value || null
    };

    const filteredLineData = applyFiltersToDataset(fullLineData, filters);
    const filteredBarData = applyFiltersToDataset(fullBarData, filters);

    // Clear existing charts
    d3.select('#line-chart-container').select('svg').remove();
    d3.select('#bar-chart-container').select('svg').remove();

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
    ["gender-filter", "age-filter", "race-filter"].forEach(filterId => {
        const filterElement = document.getElementById(filterId);
        if (filterElement) {
            filterElement.addEventListener("change", () => {
                const currentCancerType = document.querySelector(".active-cancer")?.dataset?.cancerType;

                // Update graphs and dots
                if (currentCancerType) loadAndVisualize(currentCancerType);
                renderCharts();
            });
        }
    });

    // Initial rendering
    renderCharts();
});


