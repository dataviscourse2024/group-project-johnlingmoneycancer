function drawAgeGroupPyramid(data, containerId) {
    const margin = { top: 20, right: 40, bottom: 30, left: 40 };
    const width = 800 - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;

    // Create the SVG container
    const svg = d3.select(containerId)
        .html("") // Clear existing content
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // Group data by gender
    const groupedData = d3.group(data, d => d.Gender);

    const maleData = groupedData.get('Male') || [];
    const femaleData = groupedData.get('Female') || [];

    // Scales
    const yScale = d3.scaleBand()
        .domain(data.map(d => d['Age Group']))
        .range([height, 0])
        .padding(0.1);

    const xScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.Count)])
        .range([0, width / 2])
        .nice();

    // Add Y-axis
    svg.append("g")
        .attr("transform", `translate(${width / 2}, 0)`)
        .call(d3.axisLeft(yScale).tickSize(0))
        .selectAll("text")
        .style("text-anchor", "middle");

    // Male bars
    svg.append("g")
        .selectAll("rect")
        .data(maleData)
        .enter()
        .append("rect")
        .attr("x", d => width / 2 - xScale(d.Count))
        .attr("y", d => yScale(d['Age Group']))
        .attr("width", d => xScale(d.Count))
        .attr("height", yScale.bandwidth())
        .attr("fill", "steelblue");

    // Female bars
    svg.append("g")
        .selectAll("rect")
        .data(femaleData)
        .enter()
        .append("rect")
        .attr("x", width / 2)
        .attr("y", d => yScale(d['Age Group']))
        .attr("width", d => xScale(d.Count))
        .attr("height", yScale.bandwidth())
        .attr("fill", "pink");

    // Labels for gender
    svg.append("text")
        .attr("x", width / 4)
        .attr("y", -10)
        .attr("text-anchor", "middle")
        .style("font-size", "14px")
        .text("Male");

    svg.append("text")
        .attr("x", (3 * width) / 4)
        .attr("y", -10)
        .attr("text-anchor", "middle")
        .style("font-size", "14px")
        .text("Female");
}
