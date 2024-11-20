// Function to create an SVG container dynamically
function createSvg(containerId, width, height, margin) {
    return d3.select(containerId)
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);
}

// Function to draw x and y axes and axes titles
function drawAxes(svg, xScale, yScale, yAxisTitle, height, width, margin) {
    svg.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(xScale).tickFormat(d => d));

    svg.append("g")
        .call(d3.axisLeft(yScale));

    // X-axis title: Year
    svg.append("text")
        .attr("class", "x-axis-title")
        .attr("x", width / 2) 
        .attr("y", height + margin.bottom - 10) 
        .attr("text-anchor", "middle")
        .style("font-size", "14px")
        .text("Year");

    // Y-axis title: Count
    svg.append("text")
        .attr("class", "y-axis-title")
        .attr("x", -(height / 2)) 
        .attr("y", -margin.left + 20) 
        .attr("text-anchor", "middle")
        .attr("transform", "rotate(-90)") 
        .style("font-size", "14px")
        .text(yAxisTitle);
}

// Synchronization function between line and bar charts
export function synchronizeCharts(lineData, barData) {
    if (!lineData || !barData) {
        console.error("Line or bar data missing."); // Debug error
        return;
    }

    // Remove any existing charts
    d3.select('#line-chart-container').select('svg').remove();

    // Draw line chart
    drawLineChart(lineData, '#line-chart-container', clickedPoint => {
        const clickedYear = clickedPoint.year;
        const filteredBarData = barData.filter(d => d.year === clickedYear);
        d3.select('#bar-chart-container').select('svg').remove();
        drawBarChart(filteredBarData, '#bar-chart-container');
    });
}


// Function to draw a line chart
export function drawLineChart(data, containerId, chartTitle, yAxisTitle, lineColor) {
    const margin = { top: 40, right: 30, bottom: 50, left: 60 };
    const width = 800 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const svg = createSvg(containerId, width, height, margin);

    const x = d3.scaleLinear()
        .domain(d3.extent(data, d => d.year))
        .range([0, width]);

    const y = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.value)])
        .nice()
        .range([height, 0]);

    drawAxes(svg, x, y, yAxisTitle, height, width, margin);

    svg.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", lineColor)
        .attr("stroke-width", 1.5)
        .attr("d", d3.line()
            .x(d => x(d.year))
            .y(d => y(d.value))
        );

    svg.append("text")
        .attr("x", width / 2)
        .attr("y", -10)
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .text(chartTitle);
}


