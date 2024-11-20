import { visualizeCancerDots } from './dot-visualization.js';
 
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

function showDescription(title, content, totalDots, affectedDots) {
    var description = document.getElementById('description');
    
    // Set the title and content dynamically with separate styling
    description.innerHTML = `<h2 class="title">${title}</h2><p class="content">${content}</p>`;
    
    // Ensure the description always shows with the updated content
    description.style.display = 'block'; // Ensure it is visible
    setTimeout(function() {
        description.style.opacity = '1'; // Gradually increase opacity if needed
    }, 10); // Small delay to trigger transition

    // Call the createDotPopulation function to show the dot visualization
    createDotPopulation(totalDots, affectedDots);
}

function doAll(title, content, totalDots, affectedDots) {
    scrollToBottom();  // Optional: If you want to scroll to the bottom
    setTimeout(function() {
        showDescription(title, content, totalDots, affectedDots);
    }, 500);  // Slight delay for scroll (if needed)
}

function drawCancerTrends(cancerType, incidenceData, mortalityData, containerId) {
    const margin = { top: 20, right: 30, bottom: 40, left: 60 };
    const width = 800 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const svg = createSvg(containerId, width, height, margin);

    const incidenceFiltered = incidenceData.filter(d => d["Leading Cancer Sites"] === cancerType);
    const mortalityFiltered = mortalityData.filter(d => d["Leading Cancer Sites"] === cancerType);

    const x = d3.scaleLinear()
        .domain(d3.extent(incidenceFiltered, d => +d.Year))
        .range([0, width]);

    const y = d3.scaleLinear()
        .domain([0, d3.max([...incidenceFiltered, ...mortalityFiltered], d => +d.Count)])
        .nice()
        .range([height, 0]);

    drawAxes(svg, x, y, height, width);

    const lineIncidence = d3.line()
        .x(d => x(+d.Year))
        .y(d => y(+d.Count));

    const lineMortality = d3.line()
        .x(d => x(+d.Year))
        .y(d => y(+d.Count));

    svg.append("path")
        .datum(incidenceFiltered)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 1.5)
        .attr("d", lineIncidence);

    svg.append("path")
        .datum(mortalityFiltered)
        .attr("fill", "none")
        .attr("stroke", "red")
        .attr("stroke-width", 1.5)
        .attr("d", lineMortality);
}

function loadAndVisualize(displayName) {
    // Map UI-friendly cancer names to dataset names
    const cancerTypeMapping = {
        "Brain Cancer": "Brain and Other Nervous System",
        "Breast Cancer": "Breast",
        "Colon Cancer": "Colon and Rectum",
        "Leukemia": "Leukemias",
        "Liver Cancer": "Liver and Intrahepatic Bile Duct",
        "Lung Cancer": "Lung and Bronchus",
        "Non-Hodgkin Lymphoma": "Non-Hodgkin Lymphoma",
        "Pancrease Cancer": "Pancreas",
        "Skin Cancer": "Melanoma of the Skin",
        "Uterine Cancer": "Cervix Uteri"
    };

    // Translate display name to dataset name
    const cancerType = cancerTypeMapping[displayName];

    if (!cancerType) {
        console.error(`Cancer type "${displayName}" not found in the mapping.`);
        return;
    }

    // Load datasets and filter by the selected cancer type
    loadAllFiles(datasets => {
        const incidenceData = datasets.incidence.year.filter(d => d["Leading Cancer Sites"] === cancerType);
        const mortalityData = datasets.mortality.year.filter(d => d["Leading Cancer Sites"] === cancerType);

        if (incidenceData.length === 0 && mortalityData.length === 0) {
            console.warn(`No data found for cancer type: ${cancerType}`);
            return;
        }

        // Draw the trends in the visualization container
        drawCancerTrends(cancerType, incidenceData, mortalityData, "#visualization");
    });
}

function handleVisualizations(cancerType, description) {
    visualizeCancerDots(cancerType); // Use the dot visualization
    setTimeout(() => {
        loadAndVisualize(cancerType);
        showDescription(cancerType, description); // Optional description update
    }, 2000);
}

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
