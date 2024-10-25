 // Select the visualization div and append an SVG element
const svg = d3.select("#visualization")  // This targets the <div id="visualization"> in your HTML
.append("svg")
.attr("width", 1000)
.attr("height", 600);

function scrollToBottom() {
    window.scrollTo({
        top: document.body.scrollHeight,
        behavior: 'smooth'
    });
}

function showDescription(title, content, totalDots, affectedDots) {
    var description = document.getElementById('description');
    
    // Set the title and content dynamically with separate styling
    description.innerHTML = `<h2 class="title">${title}</h2><p class="content">${content}</p>`;
    
    // Ensure the description always shows with the updated content
    description.style.display = 'block'; // Ensure it is visible
    setTimeout(function() {
        description.style.opacity = '1'; // Gradually increase opacity if needed
    }, 10); // Small delay to trigger transition

    // Call the createDotPopulation function to show the dot visualization
    createDotPopulation(totalDots, affectedDots);
}

function createDotPopulation(totalDots, affectedDots) {
    var container = document.getElementById('dot-container');
    container.innerHTML = ''; // Clear the container

    // Create the dots¸
    for (var i = 1; i <= totalDots; i++) {
        var dot = document.createElement('div');
        dot.classList.add('dot');

        // Mark the first "affectedDots" as red
        if (i <= affectedDots) {
            dot.classList.add('affected');
        }

        container.appendChild(dot);
    }
}

function doAll(title, content, totalDots, affectedDots) {
    scrollToBottom();  // Optional: If you want to scroll to the bottom
    setTimeout(function() {
        showDescription(title, content, totalDots, affectedDots);
    }, 500);  // Slight delay for scroll (if needed)
}

