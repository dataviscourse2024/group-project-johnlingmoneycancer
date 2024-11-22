import { loadStateCancerDataAllCancers } from './data-loader.js';

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

export function drawUSMap(containerId) {
    const width = 960;
    const height = 600;

    const svg = d3.select(containerId)
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    const projection = d3.geoAlbersUsa().scale(1000).translate([width / 2, height / 2]);
    const path = d3.geoPath().projection(projection);

    // Load GeoJSON data for the US
    d3.json("https://d3js.org/us-10m.v1.json").then(topojsonData => {
        // Extract state features
        const states = topojson.feature(topojsonData, topojsonData.objects.states).features;

        // Render the states on the map
        svg.append("g")
            .selectAll("path")
            .data(states)
            .join("path")
            .attr("fill", "#cccccc") // Default fill color
            .attr("stroke", "#333333") // Border color
            .attr("stroke-width", 1)
            .attr("d", path);

        console.log("Map successfully rendered with state outlines.");
    }).catch(error => {
        console.error("Error loading US map data:", error);
    });
}

// export function drawUSMapAllCancers(containerId) {
//     const width = 960;
//     const height = 600;

//     const svg = d3.select(containerId)
//         .append("svg")
//         .attr("width", width)
//         .attr("height", height);

//     const projection = d3.geoAlbersUsa().scale(1000).translate([width / 2, height / 2]);
//     const path = d3.geoPath().projection(projection);

//     d3.json("https://d3js.org/us-10m.v1.json").then(topojsonData => {
//         const states = topojson.feature(topojsonData, topojsonData.objects.states).features;

//         // Populate properties with state names using FIPS-to-State mapping
//         states.forEach(state => {
//             const fipsCode = String(state.id).padStart(2, "0");
//             const stateName = fipsToState[fipsCode];

//             if (stateName) {
//                 state.properties.name = stateName;
//             } else {
//                 console.warn(`No matching state name for FIPS code: ${fipsCode}`);
//             }
//         });

//         console.log("Updated GeoJSON States:", states.map(state => ({
//             id: state.id,
//             name: state.properties.name
//         })));

//         // Load cancer data
//         loadStateCancerDataAllCancers(data => {
//             const mortalityRates = {};
//             const incidenceRates = {};

//             // Populate data dictionaries
//             data.mortality.forEach(row => {
//                 mortalityRates[row.States] = parseFloat(row["Age-Adjusted-Rate"]) || 0;
//             });

//             data.incidence.forEach(row => {
//                 incidenceRates[row.States] = parseFloat(row["Age-Adjusted-Rate"]) || 0;
//             });

//             console.log("Mortality Rates:", mortalityRates);
//             console.log("Incidence Rates:", incidenceRates);

//             // Define color scales
//             const mortalityColorScale = d3.scaleSequential()
//                 .domain([0, d3.max(Object.values(mortalityRates))])
//                 .interpolator(d3.interpolateBlues);

//             const incidenceColorScale = d3.scaleSequential()
//                 .domain([0, d3.max(Object.values(incidenceRates))])
//                 .interpolator(d3.interpolateOranges);

//             // Draw mortality map
//             svg.append("g")
//                 .selectAll("path")
//                 .data(states)
//                 .join("path")
//                 .attr("fill", d => mortalityColorScale(mortalityRates[d.properties.name] || 0))
//                 .attr("d", path)
//                 .on("mouseover", function (event, d) {
//                     const stateName = d.properties.name;
//                     const mortalityRate = mortalityRates[stateName] || "N/A";
//                     const incidenceRate = incidenceRates[stateName] || "N/A";

//                     d3.select("#map-tooltip")
//                         .style("opacity", 1)
//                         .html(`<strong>${stateName}</strong><br>Mortality Rate: ${mortalityRate}<br>Incidence Rate: ${incidenceRate}`)
//                         .style("left", `${event.pageX + 10}px`)
//                         .style("top", `${event.pageY + 10}px`);
//                 })
//                 .on("mouseout", () => {
//                     d3.select("#map-tooltip").style("opacity", 0);
//                 });

//             // Add legend for mortality rates
//             svg.append("g")
//                 .attr("transform", `translate(${width - 200}, 20)`)
//                 .call(d3.legendColor()
//                     .labelFormat(d3.format(".1f"))
//                     .scale(mortalityColorScale)
//                     .title("Mortality Rates"));

//             // Add legend for incidence rates (optional or separate view)
//             svg.append("g")
//                 .attr("transform", `translate(${width - 200}, 120)`)
//                 .call(d3.legendColor()
//                     .labelFormat(d3.format(".1f"))
//                     .scale(incidenceColorScale)
//                     .title("Incidence Rates"));
//         });
//     }).catch(error => {
//         console.error("Error loading US map data:", error);
//     });
// }

