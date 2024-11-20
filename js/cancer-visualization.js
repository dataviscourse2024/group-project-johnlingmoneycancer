import { visualizeCancerDots } from './dot-visualization.js';
import { loadAllFiles } from './data-loader.js';

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

function doAll(title, content, totalDots, affectedDots) {
    scrollToBottom();  // Optional: If you want to scroll to the bottom
    setTimeout(function () {
        showDescription(title, content, totalDots, affectedDots);
    }, 500);  // Slight delay for scroll (if needed)
}

function loadAndVisualize(displayName) {
    const cancerTypeMapping = {                             // checks if cancer has appropriate image and description
        "Brain Cancer": "Brain and Other Nervous System",   // check
        "Breast Cancer": "Breast",                          // check
        "Colon Cancer": "Colon and Rectum",                 // check
        "Leukemia Cancer": "Leukemias",            
        "Liver Cancer": "Liver",                            // check
        "Lung Cancer": "Lung and Bronchus",                 // check
        "Non-Hodgkin Lymphoma": "Non-Hodgkin Lymphoma",
        "Pancreatic Cancer": "Pancreas",                    // check
        "Skin Cancer": "Melanoma of the Skin",              // check
        "Uterine Cancer": "Cervix Uteri"
    };

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


// Event listeners for cancer links
document.addEventListener('DOMContentLoaded', () => {
    const cancerLinks = [
        {
            id: 'brain-cancer-link',
            cancerType: 'Brain and Other Nervous System',
            displayName: 'Brain Cancer',
            description: 'Brain cancer occurs when cells in the brain grow uncontrollably, disrupting brain function and causing neurological symptoms.'
        },
        {
            id: 'breast-cancer-link',
            cancerType: 'Breast',
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
            cancerType: 'Leukemia Cancer',
            displayName: 'Leukemia Cancer',
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

// Event listeners for filters
document.getElementById("gender-filter").addEventListener("change", () => {
    const currentCancerType = document.querySelector(".active-cancer").dataset.cancerType;
    loadAndVisualize(currentCancerType);
});

document.getElementById("age-filter").addEventListener("change", () => {
    const currentCancerType = document.querySelector(".active-cancer").dataset.cancerType;
    loadAndVisualize(currentCancerType);
});

document.getElementById("race-filter").addEventListener("change", () => {
    const currentCancerType = document.querySelector(".active-cancer").dataset.cancerType;
    loadAndVisualize(currentCancerType);
});

