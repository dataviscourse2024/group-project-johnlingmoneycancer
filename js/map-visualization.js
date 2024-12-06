// FIPS-to-State mapping
const fipsToState = {
    "01": "Alabama",
    "02": "Alaska",
    "04": "Arizona",
    "05": "Arkansas",
    "06": "California",
    "08": "Colorado",
    "09": "Connecticut",
    "10": "Delaware",
    "11": "District of Columbia",
    "12": "Florida",
    "13": "Georgia",
    "15": "Hawaii",
    "16": "Idaho",
    "17": "Illinois",
    "18": "Indiana",
    "19": "Iowa",
    "20": "Kansas",
    "21": "Kentucky",
    "22": "Louisiana",
    "23": "Maine",
    "24": "Maryland",
    "25": "Massachusetts",
    "26": "Michigan",
    "27": "Minnesota",
    "28": "Mississippi",
    "29": "Missouri",
    "30": "Montana",
    "31": "Nebraska",
    "32": "Nevada",
    "33": "New Hampshire",
    "34": "New Jersey",
    "35": "New Mexico",
    "36": "New York",
    "37": "North Carolina",
    "38": "North Dakota",
    "39": "Ohio",
    "40": "Oklahoma",
    "41": "Oregon",
    "42": "Pennsylvania",
    "44": "Rhode Island",
    "45": "South Carolina",
    "46": "South Dakota",
    "47": "Tennessee",
    "48": "Texas",
    "49": "Utah",
    "50": "Vermont",
    "51": "Virginia",
    "53": "Washington",
    "54": "West Virginia",
    "55": "Wisconsin",
    "56": "Wyoming"
};

export function drawUSMap(containerID) {
    const width = 960;
    const height = 600;

    const svg = d3.select(`${containerID}`)
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    // projection and path generator
    const projection = d3.geoAlbersUsa().translate([width / 2, height / 2]).scale(1000);
    const path = d3.geoPath().projection(projection);

    // Load GeoJSON data and CSV data
    Promise.all([
        d3.json("data/us-states.json"),
        d3.csv("data/states-csvs/States-Mortality-AgeAdjustedRates-ALLCANCERS.csv"),
        d3.csv("data/states-csvs/States-Incidence-AgeAdjustedRates-ALLCANCERS.csv")
    ]).then(([geoData, mortalityCSV, incidenceCSV]) => {
        const states = geoData.features;

        const mortalityRates = {};
        const incidenceRates = {};

        mortalityCSV.forEach(row => {
            mortalityRates[row.States] = parseFloat(row["Age-Adjusted-Rate"]) || 0;
        });

        incidenceCSV.forEach(row => {
            incidenceRates[row.States] = parseFloat(row["Age-Adjusted-Rate"]) || 0;
        });

        console.log("Mortality Rates:", mortalityRates);
        console.log("Incidence Rates:", incidenceRates);

        const mortalityColorScale = d3.scaleSequential()
            .domain([d3.min(Object.values(mortalityRates)), d3.max(Object.values(mortalityRates))])
            .interpolator(d3.interpolateReds);

        // Tooltip setup
        const tooltip = d3.select("body").append("div")
            .attr("id", "map-tooltip")
            .style("position", "absolute")
            .style("background-color", "rgba(255, 255, 255, 0.8)")
            .style("border", "1px solid #ccc")
            .style("padding", "10px")
            .style("border-radius", "5px")
            .style("pointer-events", "none")
            .style("opacity", 0);

        // Add states to the map
        svg.selectAll(".state")
            .data(states)
            .enter()
            .append("path")
            .attr("class", "state")
            .attr("d", path)
            .attr("stroke", "#000")
            .attr("stroke-width", 0.5)
            .attr("fill", d => mortalityColorScale(mortalityRates[d.properties.NAME] || 0))
            .on("mouseover", function (event, d) {
                const stateName = d.properties.NAME;
                const mortalityRate = mortalityRates[stateName] || "N/A";
                const incidenceRate = incidenceRates[stateName] || "N/A";

                tooltip.style("opacity", 1)
                    .html(`
                        <strong>${stateName}</strong><br>
                        <span style="color: orange;">Incidence Rate:</span> ${incidenceRate}<br>
                        <span style="color: red;">Mortality Rate:</span> ${mortalityRate}
                    `)
                    .style("left", `${event.pageX + 10}px`)
                    .style("top", `${event.pageY + 10}px`);
                d3.select(this).attr("stroke", "#000").attr("stroke-width", 2.5);
            })
            .on("mouseout", function () {
                tooltip.style("opacity", 0);
                d3.select(this).attr("stroke", "#000").attr("stroke-width", 0.5);;
            });

        // legend for mortality rates
        const legendWidth = 200;
        const legendHeight = 20;

        // legend title
        svg.append("text")
            .attr("x", width - 220 + 100)
            .attr("y", 15)
            .attr("fill", "black")
            .style("font-size", "14px")
            .style("font-weight", "bold")
            .style("text-anchor", "middle")
            .text("Mortality Rate");

        // legend gradient and box
        const gradient = svg.append("defs")
            .append("linearGradient")
            .attr("id", "legend-gradient")
            .attr("x1", "0%").attr("y1", "0%")
            .attr("x2", "100%").attr("y2", "0%");

        gradient.append("stop").attr("offset", "0%").attr("stop-color", d3.interpolateReds(0));
        gradient.append("stop").attr("offset", "100%").attr("stop-color", d3.interpolateReds(1));

        svg.append("rect")
            .attr("x", width - legendWidth - 20)
            .attr("y", 20)
            .attr("width", legendWidth)
            .attr("height", legendHeight)
            .style("fill", "url(#legend-gradient)");

        // legend end points
        const minValue = d3.min(Object.values(mortalityRates));
        const maxValue = d3.max(Object.values(mortalityRates));

        svg.append("text")
            .attr("x", width - 220)
            .attr("y", 55)
            .attr("fill", "black")
            .style("font-size", "12px")
            .style("text-anchor", "start")
            .text(minValue.toFixed(1));

        svg.append("text")
            .attr("x", width - 20)
            .attr("y", 55)
            .attr("fill", "black")
            .style("font-size", "12px")
            .style("text-anchor", "end")
            .text(maxValue.toFixed(1));
    }).catch(error => {
        console.error("Error loading data:", error);
    });
}

export function drawCancerTypeMap(containerID, cancerType) {
    // Load GeoJSON and cancer-specific datasets
    Promise.all([
        d3.csv("data/states-csvs/States-Mortality-AgeAdjustedRates-BYCANCER.csv"),
        d3.csv("data/states-csvs/States-Incidence-AgeAdjustedRates-BYCANCER.csv"),
        d3.json("data/us-states.json")
    ]).then(([mortalityData, incidenceData, geoData]) => {
        // Filter the datasets by the selected cancer type
        const filteredMortality = mortalityData.filter(d => d["Leading Cancer Sites"] === cancerType);
        const filteredIncidence = incidenceData.filter(d => d["Leading Cancer Sites"] === cancerType);

        // Create lookup dictionaries for mortality and incidence rates
        const mortalityRates = {};
        const incidenceRates = {};

        filteredMortality.forEach(row => {
            mortalityRates[row.States] = parseFloat(row["Age-Adjusted-Rate"]) || 0;
        });

        filteredIncidence.forEach(row => {
            incidenceRates[row.States] = parseFloat(row["Age-Adjusted-Rate"]) || 0;
        });

        // Set up SVG dimensions and projection
        const width = 960;
        const height = 600;

        const svg = d3.select(containerID)
            .html("") // Clear the container for fresh rendering
            .append("svg")
            .attr("width", width)
            .attr("height", height);

        const projection = d3.geoAlbersUsa().translate([width / 2, height / 2]).scale(1000);
        const path = d3.geoPath().projection(projection);

        // Define a color scale for mortality rates
        const mortalityColorScale = d3.scaleSequential()
            .domain([d3.min(Object.values(mortalityRates)), d3.max(Object.values(mortalityRates))])
            .interpolator(d3.interpolateBlues);

        // Tooltip setup
        const tooltip = d3.select("body").append("div")
            .attr("id", "map-tooltip")
            .style("position", "absolute")
            .style("background-color", "rgba(255, 255, 255, 0.8)")
            .style("border", "1px solid #ccc")
            .style("padding", "10px")
            .style("border-radius", "5px")
            .style("pointer-events", "none")
            .style("opacity", 0);

        // Add states to the map
        svg.selectAll(".state")
            .data(geoData.features)
            .enter()
            .append("path")
            .attr("class", "state")
            .attr("d", path)
            .attr("stroke", "#000")
            .attr("stroke-width", 0.5)
            .attr("fill", d => mortalityColorScale(mortalityRates[d.properties.NAME] || 0))
            .on("mouseover", function (event, d) {
                const stateName = d.properties.NAME;
                const mortalityRate = mortalityRates[stateName] || "N/A";
                const incidenceRate = incidenceRates[stateName] || "N/A";

                // Show tooltip for mortality and incidence rates
                tooltip.style("opacity", 1)
                    .html(`
                        <strong>${stateName}</strong><br>
                        <span style="color: orange;">Incidence Rate:</span> ${incidenceRate}<br>
                        <span style="color: red;">Mortality Rate:</span> ${mortalityRate}
                    `)
                    .style("left", `${event.pageX + 10}px`)
                    .style("top", `${event.pageY + 10}px`);
                d3.select(this).attr("stroke", "#000").attr("stroke-width", 2);
            })
            .on("mouseout", function () {
                tooltip.style("opacity", 0);
                d3.select(this).attr("stroke", "#000").attr("stroke-width", 0.5);
            });

        // Legend for mortality rates
        const legendWidth = 200;
        const legendHeight = 20;

        // Legend title
        svg.append("text")
            .attr("x", width - 220 + 100)
            .attr("y", 15)
            .attr("fill", "black")
            .style("font-size", "14px")
            .style("font-weight", "bold")
            .style("text-anchor", "middle")
            .text("Mortality Rate");

        // Create a unique legend gradient
        const gradient = svg.append("defs")
            .append("linearGradient")
            .attr("id", "legend-gradient-cancer") // Unique ID
            .attr("x1", "0%").attr("y1", "0%")
            .attr("x2", "100%").attr("y2", "0%");

        gradient.append("stop").attr("offset", "0%").attr("stop-color", d3.interpolateBlues(0));
        gradient.append("stop").attr("offset", "100%").attr("stop-color", d3.interpolateBlues(1));

        // Add legend rectangle
        svg.append("rect")
            .attr("x", width - legendWidth - 20)
            .attr("y", 20)
            .attr("width", legendWidth)
            .attr("height", legendHeight)
            .style("fill", "url(#legend-gradient-cancer)"); // Use unique gradient

        // Legend end points
        const minValue = d3.min(Object.values(mortalityRates));
        const maxValue = d3.max(Object.values(mortalityRates));

        svg.append("text")
            .attr("x", width - legendWidth - 20)
            .attr("y", 55)
            .attr("fill", "black")
            .style("font-size", "12px")
            .style("text-anchor", "start")
            .text(minValue.toFixed(1));

        svg.append("text")
            .attr("x", width - 20)
            .attr("y", 55)
            .attr("fill", "black")
            .style("font-size", "12px")
            .style("text-anchor", "end")
            .text(maxValue.toFixed(1));
    }).catch(error => {
        console.error("Error loading data:", error);
    });
}
