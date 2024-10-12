 // Select the visualization div and append an SVG element
const svg = d3.select("#visualization")  // This targets the <div id="visualization"> in your HTML
.append("svg")
.attr("width", 1000)
.attr("height", 600);