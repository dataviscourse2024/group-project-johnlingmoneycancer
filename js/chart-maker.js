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
    // Draw x-axis
    let xAxis = svg.select(".x-axis");
    if (xAxis.empty()) {
        xAxis = svg.append("g").attr("class", "x-axis");
    }
    xAxis.attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(xScale).tickFormat(d => d));

    // Draw y-axis
    let yAxis = svg.select(".y-axis");
    if (yAxis.empty()) {
        yAxis = svg.append("g").attr("class", "y-axis");
    }
    yAxis.call(d3.axisLeft(yScale));

    // X-axis title
    let xAxisTitle = svg.select(".x-axis-title");
    if (xAxisTitle.empty()) {
        xAxisTitle = svg.append("text").attr("class", "x-axis-title");
    }
    xAxisTitle.attr("x", width / 2)
        .attr("y", height + margin.bottom - 10)
        .attr("text-anchor", "middle")
        .style("font-size", "14px")
        .text("Year");

    // Y-axis title
    let yAxisTitleElement = svg.select(".y-axis-title");
    if (yAxisTitleElement.empty()) {
        yAxisTitleElement = svg.append("text").attr("class", "y-axis-title");
    }
    yAxisTitleElement.attr("x", -(height / 2))
        .attr("y", -margin.left + 20)
        .attr("text-anchor", "middle")
        .attr("transform", "rotate(-90)")
        .style("font-size", "14px")
        .text(yAxisTitle);
}

export function drawLineChart(data, containerId, chartTitle, yAxisTitle, lineColor, yLabel) {
    const margin = { top: 40, right: 30, bottom: 50, left: 60 };
    const width = 800 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    console.log("Appending SVG to container:", containerId);

    // Check if an SVG already exists
    let svg = d3.select(containerId).select("svg");

    if (svg.empty()) {
        // If no SVG exists, create one
        svg = d3.select(containerId)
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", `translate(${margin.left}, ${margin.top})`)
            .style("opacity", 0);

        // Fade in the chart container
        svg.transition()
            .duration(700) // Duration of the transition
            .style("opacity", 1);
    }

    // Scales
    const x = d3.scaleLinear()
        .domain(d3.extent(data, d => d.year))
        .range([0, width]);

    const y = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.value)])
        .nice()
        .range([height, 0]);

    // Update Y-Axis with animation
    svg.selectAll(".y-axis")
        .data([null]) // Use a single dummy datum to maintain consistency
        .join(
            enter => enter.append("g")
                .attr("class", "y-axis")
                .call(d3.axisLeft(y))
                .call(g => g.selectAll(".tick").attr("opacity", 0)) // Initial hidden ticks
                .call(g => g.transition().duration(1000).call(d3.axisLeft(y))), // Animate ticks
            update => update
                .transition()
                .duration(1000)
                .call(d3.axisLeft(y)), // Animate updated ticks
        );

    // Draw x-axis (no animation needed)
    let xAxis = svg.select(".x-axis");
    if (xAxis.empty()) {
        xAxis = svg.append("g")
            .attr("class", "x-axis")
            .attr("transform", `translate(0, ${height})`)
            .call(d3.axisBottom(x).tickFormat(d3.format("d")));
    }

    // Line generator
    const lineGenerator = d3.line()
        .x(d => x(d.year))
        .y(d => y(d.value));

    // Bind data to the trendline
    let path = svg.selectAll(".line").data([data]);

    path.enter()
        .append("path")
        .attr("class", "line")
        .attr("fill", "none")
        .attr("stroke", lineColor)
        .attr("stroke-width", 1.5)
        .attr("d", lineGenerator) // Initial line position
        .attr("stroke-dasharray", function () {
            return this.getTotalLength(); // Compute line length
        })
        .attr("stroke-dashoffset", function () {
            return this.getTotalLength(); // Start hidden
        })
        .merge(path) // Enter + Update
        .transition() // Animate
        .duration(1000)
        .ease(d3.easeLinear)
        .attr("d", lineGenerator) // Update line
        .attr("stroke-dashoffset", 0); // Reveal line progressively

    // Chart title
    let title = svg.selectAll(".chart-title").data([chartTitle]);
    title.enter()
        .append("text")
        .attr("class", "chart-title")
        .attr("x", width / 2)
        .attr("y", -10)
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .merge(title)
        .text(chartTitle);

    // Add the hover line and tooltip functionality here
    if (svg.select(".hover-line").empty()) {
        // Vertical hover line
        svg.append("line")
            .attr("class", "hover-line")
            .attr("stroke", "gray")
            .attr("stroke-width", 1)
            .attr("y1", 0)
            .attr("y2", height)
            .style("opacity", 0); // Initially hidden

        // Tooltip container
        svg.append("text")
            .attr("class", "tooltip")
            .attr("text-anchor", "middle")
            .attr("dy", "-0.5em")
            .style("opacity", 0); // Initially hidden
    }

    // Create an overlay for mouse events
    if (svg.select(".overlay").empty()) {
        svg.append("rect")
            .attr("class", "overlay")
            .attr("width", width)
            .attr("height", height)
            .attr("fill", "none")
            .attr("pointer-events", "all")
            .on("mousemove", onMouseMove)
            .on("mouseout", onMouseOut);
    }

    // Mousemove and mouseout functions
    function onMouseMove(event) {
        const [mouseX] = d3.pointer(event, svg.node());
        const xValue = x.invert(mouseX);

        const closestPoint = data.reduce((prev, curr) => (
            Math.abs(curr.year - xValue) < Math.abs(prev.year - xValue) ? curr : prev
        ));

        svg.select(".hover-line")
            .attr("x1", x(closestPoint.year))
            .attr("x2", x(closestPoint.year))
            .style("opacity", 1);

        svg.select(".tooltip")
            .attr("x", x(closestPoint.year))
            .attr("y", y(closestPoint.value))
            .text(`Year: ${closestPoint.year}, ${yLabel}: ${closestPoint.value}`)
            .style("opacity", 1)
            .style("font-size", "12px")
            .style("text-anchor", "end");
    }

    function onMouseOut() {
        svg.select(".hover-line").style("opacity", 0);
        svg.select(".tooltip").style("opacity", 0);
    }
}