export function drawIncidentStackedBarChart(structuredData, containerId) {
    const margin = { top: 40, right: 150, bottom: 50, left: 60 };
    const width = 650 - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;

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
        "Brain and Other Nervous System": "#1f77b4",
        "Breast": "#ff7f0e",
        "Cervix Uteri": "#2ca02c",
        "Colon and Rectum": "#d62728",
        "Leukemias": "#9467bd",
        "Liver": "#8c564b",
        "Lung and Bronchus": "#e377c2",
        "Melanoma of the Skin": "#7f7f7f",
        "Non-Hodgkin Lymphoma": "#bcbd22",
        "Pancreas": "#17becf"
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

    // X-axis scale (Age Groups)
    const x = d3.scaleBand()
        .domain(ageGroups)
        .range([0, width])
        .padding(0.1); // Add padding between bars

    // Y-axis scale (Counts)
    const y = d3.scaleLinear()
        .domain([0, d3.max(layers, layer => d3.max(layer, d => d[1]))])
        .nice()
        .range([height, 0]);

    // Draw the bars
    svg.selectAll(".layer")
        .data(layers)
        .enter()
        .append("g")
        .attr("class", "layer")
        .style("fill", d => colorPalette[d.key]) // Assign color based on cancer type
        .selectAll("rect")
        .data(d => d)
        .enter()
        .append("rect")
        .attr("x", d => x(d.data.ageGroup))
        .attr("y", d => y(d[1]))
        .attr("height", d => y(d[0]) - y(d[1]))
        .attr("width", x.bandwidth());

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
        .style("font-weight", "bold")
        .text("Cancer Incidence by Age Group");

    // Add legend
    const legend = svg.append("g")
        .attr("transform", `translate(${width + 20}, 0)`);

    selectedCancerSites.forEach((site, i) => {
        const legendRow = legend.append("g")
            .attr("transform", `translate(0, ${i * 20})`);

        legendRow.append("rect")
            .attr("width", 15)
            .attr("height", 15)
            .attr("fill", colorPalette[site]);

        legendRow.append("text")
            .attr("x", 20)
            .attr("y", 12)
            .style("font-size", "12px")
            .text(site);
    });
}