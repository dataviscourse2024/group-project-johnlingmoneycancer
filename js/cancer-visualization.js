// Select the visualization div and append an SVG element
const svg = d3.select("#visualization")
    .append("svg")
    .attr("width", 1000)
    .attr("height", 600);

function scrollToBottom() {
    window.scrollTo({
        top: document.body.scrollHeight,
        behavior: 'smooth'
    });
}

function showDescription(title, content, totalDots, affectedDots) {
    const description = document.getElementById('description');
    description.innerHTML = `<h2 class="title">${title}</h2><p class="content">${content}</p>`;
    description.style.display = 'block';
    setTimeout(() => {
        description.style.opacity = '1';
    }, 10);
    createDotPopulation(totalDots, affectedDots);
}

function createDotPopulation(totalDots, affectedDots) {
    const container = document.getElementById('dot-container');
    container.innerHTML = '';
    for (let i = 1; i <= totalDots; i++) {
        const dot = document.createElement('div');
        dot.classList.add('dot');
        if (i <= affectedDots) {
            dot.classList.add('affected');
        }
        container.appendChild(dot);
    }
}

function doAll(title, content, totalDots, affectedDots) {
    scrollToBottom();
    setTimeout(() => {
        showDescription(title, content, totalDots, affectedDots);
    }, 500);
}

function drawCancerTrends(cancerType, incidenceData, mortalityData, containerId) {
    // Same implementation as before
}

function loadAndVisualize(displayName) {
    const cancerTypeMapping = {
        "Brain Cancer": "Brain and Other Nervous System",
        "Breast Cancer": "Breast",
        "Colon Cancer": "Colon and Rectum",
        "Leukemia": "Leukemias",
        "Liver Cancer": "Liver and Intrahepatic Bile Duct",
        "Lung Cancer": "Lung and Bronchus",
        "Non-Hodgkin Lymphoma": "Non-Hodgkin Lymphoma",
        "Pancreatic Cancer": "Pancreas",
        "Skin Cancer": "Melanoma of the Skin",
        "Uterine Cancer": "Cervix Uteri"
    };
    const cancerType = cancerTypeMapping[displayName];
    if (!cancerType) {
        console.error(`Cancer type "${displayName}" not found.`);
        return;
    }
    loadAllFiles(datasets => {
        const incidenceData = datasets.incidence.year.filter(d => d["Leading Cancer Sites"] === cancerType);
        const mortalityData = datasets.mortality.year.filter(d => d["Leading Cancer Sites"] === cancerType);
        if (incidenceData.length === 0 && mortalityData.length === 0) {
            console.warn(`No data for cancer type: ${cancerType}`);
            return;
        }
        drawCancerTrends(cancerType, incidenceData, mortalityData, "#visualization");
    });
}
