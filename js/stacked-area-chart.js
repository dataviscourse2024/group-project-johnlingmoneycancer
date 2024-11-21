export function drawStackedAreaChart(structuredData, containerId) {
    const margin = { top: 40, right: 30, bottom: 50, left: 60 };
    const width = 700 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    // Define the list of cancer sites to keep
    const selectedCancerSites = [
        "Brain and Other Nervous System",
        "Breast",
        "Cervix Uteri",
        "Colon and Rectum",
        "Leukemias",
        "Liver",
        "Lung and Bronchus",
        "Melanoma of the Skin",
        "Non-Hodgkin Lymphoma",
        "Pancreas"
    ];

    // Define a custom color palette for each cancer site
    const colorPalette = {
        "Brain and Other Nervous System": "#1f77b4", // Blue
        "Breast": "#ff7f0e", // Orange
        "Cervix Uteri": "#2ca02c", // Green
        "Colon and Rectum": "#d62728", // Red
        "Leukemias": "#9467bd", // Purple
        "Liver": "#8c564b", // Brown
        "Lung and Bronchus": "#e377c2", // Pink
        "Melanoma of the Skin": "#7f7f7f", // Gray
        "Non-Hodgkin Lymphoma": "#bcbd22", // Olive
        "Pancreas": "#17becf" // Cyan
    };

    // Filter structuredData to include only the selected cancer sites
    const filteredData = structuredData.filter(d => selectedCancerSites.includes(d.cancerSite));

    // Extract unique age groups
    const ageGroups = Array.from(
        new Set(filteredData.flatMap(d => Object.keys(d.ageGroups)))
    );

    // Process filteredData into a format usable by D3
    const chartData = ageGroups.map(ageGroup => {
        const row = { ageGroup }; // Start with the age group
        filteredData.forEach(d => {
            row[d.cancerSite] = d.ageGroups[ageGroup] || 0; // Default to 0 if no data for that age group
        });
        return row;
    });

    console.log("Filtered Chart Data:", chartData);

    // Extract cancer sites
    const cancerSites = selectedCancerSites;

    // Stack the data
    const stack = d3.stack()
        .keys(cancerSites)
        .value((d, key) => d[key]);

    const layers = stack(chartData);

    // Create SVG container
    const svg = d3.select(containerId)
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

    const x = d3.scalePoint()
        .domain(ageGroups) // Age groups as categories
        .range([0, width]) // Use full width of the chart
        .padding(0);

    // Y-axis scale (Counts)
    const y = d3.scaleLinear()
        .domain([0, d3.max(layers, layer => d3.max(layer, d => d[1]))])
        .nice()
        .range([height, 0]);

    // Draw the areas
    const area = d3.area()
        .x(d => x(d.data.ageGroup))
        .y0(d => y(d[0]))
        .y1(d => y(d[1]));

    svg.selectAll(".layer")
        .data(layers)
        .enter()
        .append("path")
        .attr("class", "layer")
        .attr("d", area)
        .style("fill", d => colorPalette[d.key]) // Assign color based on cancer type
        .style("opacity", 0.8);

    // Add X-axis
    svg.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(x));

    // Add Y-axis
    svg.append("g")
        .call(d3.axisLeft(y));

    // Chart title
    svg.append("text")
        .attr("x", width / 2)
        .attr("y", -10)
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .style("font-weight", "bold") // Make the text bold
        .text("Cancer Incidence by Age Group");

    // Add annotations for each cancer type
    const annotationGroup = svg.append("g")
        .attr("class", "annotations");

    layers.forEach(layer => {
        const cancerType = layer.key;

        // Calculate the midpoint of the layer for annotation
        const lastPoint = layer[layer.length - 1];
        const midY = (lastPoint[0] + lastPoint[1]) / 2; // Midpoint between stack layers

        // Add a line pointing to the area
        annotationGroup.append("line")
            .attr("x1", width) // Start at the right edge of the chart
            .attr("y1", y(midY)) // Align with the middle of the layer
            .attr("x2", width + 50) // Offset to the right for the label
            .attr("y2", y(midY)) // Keep the y-coordinate aligned
            .style("stroke", "black");

        // Add a label for the cancer type
        annotationGroup.append("text")
            .attr("x", width + 55) 
            .attr("y", y(midY))
            .style("font-size", "12px")
            .style("font-weight", "bold")
            .style("fill", "black") 
            .text(cancerType);
    });
}
