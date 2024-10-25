// Function to create an SVG container
function createSvg(containerId, width, height, margin) {
    return d3.select(containerId)
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);
}

// Function to draw x and y axes
function drawAxes(svg, xScale, yScale, height, width) {
    svg.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(xScale));

    svg.append("g")
        .call(d3.axisLeft(yScale));
}

// Function to create a bar chart
function createBarChart(data, containerId) {
    const margin = { top: 20, right: 30, bottom: 40, left: 60 };
    const width = 800 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    // Create SVG container
    const svg = createSvg(containerId, width, height, margin);

    // Set up x and y scales
    const x = d3.scaleBand()
        .domain(data.map(d => d["Leading Cancer Sites"]))
        .range([0, width])
        .padding(0.2);

    const y = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.Count)])
        .nice()
        .range([height, 0]);

    // Draw axes
    drawAxes(svg, x, y, height, width);

    // Draw bars
    svg.selectAll(".bar")
        .data(data)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", d => x(d["Leading Cancer Sites"]))
        .attr("y", d => y(d.Count))
        .attr("width", x.bandwidth())
        .attr("height", d => height - y(d.Count))
        .attr("fill", "steelblue");

    // Add axis labels or tooltips as needed
}

// Function to create a line chart
function createLineChart(data, containerId) {
    const margin = { top: 20, right: 30, bottom: 40, left: 60 };
    const width = 800 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    // Create SVG container
    const svg = createSvg(containerId, width, height, margin);

    // Set up x and y scales
    const x = d3.scaleLinear()
        .domain(d3.extent(data, d => d.Year))
        .range([0, width]);

    const y = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.Count)])
        .nice()
        .range([height, 0]);

    // Draw axes
    drawAxes(svg, x, y, height, width);

    // Draw line
    const line = d3.line()
        .x(d => x(d.Year))
        .y(d => y(d.Count));

    svg.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 1.5)
        .attr("d", line);
}