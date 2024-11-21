export function drawStackedAreaChart(structuredData, containerId) {
    const margin = { top: 40, right: 30, bottom: 50, left: 60 };
    const width = 1200 - margin.left - margin.right;
    const height = 600 - margin.top - margin.bottom;

    // Extract unique age groups
    const ageGroups = Array.from(
        new Set(structuredData.flatMap(d => Object.keys(d.ageGroups)))
    );

    // Process structuredData into a format usable by D3
    const chartData = ageGroups.map(ageGroup => {
        const row = { ageGroup }; // Start with the age group
        structuredData.forEach(d => {
            row[d.cancerSite] = d.ageGroups[ageGroup] || 0; // Default to 0 if no data for that age group
        });
        return row;
    });

    console.log("Processed Data for Chart:", chartData);

    // Extract cancer sites
    const cancerSites = structuredData.map(d => d.cancerSite);

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
        .padding(0.1);

    // Y-axis scale (Counts)
    const y = d3.scaleLinear()
        .domain([0, d3.max(layers, layer => d3.max(layer, d => d[1]))])
        .nice()
        .range([height, 0]);

    // Color scale
    const color = d3.scaleOrdinal()
        .domain(cancerSites)
        .range(d3.schemeCategory10);

    // Draw the areas
    const area = d3.area()
        .x(d => x(d.data.ageGroup) + x.bandwidth() / 2)
        .y0(d => y(d[0]))
        .y1(d => y(d[1]));

    svg.selectAll(".layer")
        .data(layers)
        .enter()
        .append("path")
        .attr("class", "layer")
        .attr("d", area)
        .style("fill", d => color(d.key))
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
        .text("Cancer Incidence by Age Group");
}
