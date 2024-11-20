// Function to create an SVG container dynamically
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

// Synchronization function between line and bar charts
export function synchronizeCharts(lineData, barData) {
    if (!lineData || !barData) {
        console.error("Line or bar data missing.");  // debug error
        return;
    }

    console.log("Synchronizing charts with filtered data:"); // Debugging
    console.log("Line Data:", filteredLineData); // Debugging
    console.log("Bar Data:", filteredBarData);  // Debugging

    drawLineChart(lineData, '#line-chart-container', clickedPoint => {
        const clickedYear = clickedPoint.year;
        const filteredBarData = barData.filter(d => d.year === clickedYear);
        d3.select('#bar-chart-container').select('svg').remove();
        drawBarChart(filteredBarData, '#bar-chart-container');
    });

    drawBarChart(barData, '#bar-chart-container', clickedBar => {
        const clickedCategory = clickedBar.category;
        const filteredLineData = lineData.filter(d => d.category === clickedCategory);
        d3.select('#line-chart-container').select('svg').remove();
        drawLineChart(filteredLineData, '#line-chart-container');
    });
}

// Function to draw a line chart
function drawLineChart(data, containerId, onPointClick = null) {
    const margin = { top: 20, right: 30, bottom: 40, left: 60 };
    const width = 400 - margin.left - margin.right;
    const height = 300 - margin.top - margin.bottom;

    const svg = createSvg(containerId, width, height, margin);

    const xScale = d3.scaleLinear()
        .domain(d3.extent(data, d => +d.year))
        .range([0, width]);

    const yScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => +d.value)])
        .nice()
        .range([height, 0]);

    drawAxes(svg, xScale, yScale, height, width);

    const line = d3.line()
        .x(d => xScale(+d.year))
        .y(d => yScale(+d.value));

    svg.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 1.5)
        .attr("d", line);

    // if (onPointClick) {
    //     svg.selectAll(".point")
    //         .data(data)
    //         .enter()
    //         .append("circle")
    //         .attr("class", "point")
    //         .attr("cx", d => xScale(+d.year))
    //         .attr("cy", d => yScale(+d.value))
    //         .attr("r", 4)
    //         .attr("fill", "red")
    //         .on("click", onPointClick);
    // }
}

// Function to draw a bar chart
function drawBarChart(data, containerId, onBarClick = null) {
    const margin = { top: 20, right: 30, bottom: 40, left: 60 };
    const width = 400 - margin.left - margin.right;
    const height = 300 - margin.top - margin.bottom;

    const svg = createSvg(containerId, width, height, margin);

    const xScale = d3.scaleBand()
        .domain(data.map(d => d.category))
        .range([0, width])
        .padding(0.2);

    const yScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => +d.value)])
        .nice()
        .range([height, 0]);

    drawAxes(svg, xScale, yScale, height, width);

    svg.selectAll(".bar")
        .data(data)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", d => xScale(d.category))
        .attr("y", d => yScale(+d.value))
        .attr("width", xScale.bandwidth())
        .attr("height", d => height - yScale(+d.value))
        .attr("fill", "orange")
        .on("click", onBarClick);
}

