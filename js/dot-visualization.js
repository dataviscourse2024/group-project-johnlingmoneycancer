// Function to calculate the total incidence and percentage
function calculateIncidence(cancerType, data) {
    const filteredData = data.filter(d => d["Leading Cancer Sites"] === cancerType);
    const totalIncidence = filteredData.reduce((sum, row) => sum + parseFloat(row.Count || 0), 0);

    // Scale to a percentage (example: divide by 1000)
    const percentage = Math.min(100, (totalIncidence / 1000)); // Adjust scaling factor as needed

    return { totalIncidence, percentage };
}

// Function to create and animate a dot visualization
function createDotVisualization(totalDots, affectedDots) {
    const container = document.getElementById('dot-container');
    container.innerHTML = ''; // Clear any existing dots

    for (let i = 1; i <= totalDots; i++) {
        const dot = document.createElement('div');
        dot.classList.add('dot');

        // Animate affected dots
        if (i <= affectedDots) {
            dot.classList.add('affected');
            setTimeout(() => {
                dot.classList.add('fill'); // Trigger animation
            }, i * 50); // Stagger animation by index
        }

        container.appendChild(dot);
    }
}

// Function to load data, calculate incidence, and visualize
function visualizeCancerDots(cancerType, dataset) {
    const { totalIncidence, percentage } = calculateIncidence(cancerType, dataset);

    // Update description
    showDescription(
        `Incidence of ${cancerType}`,
        `Total reported cases: ${totalIncidence}`,
        100,
        Math.round(percentage)
    );

    // Create dot visualization
    createDotVisualization(100, Math.round(percentage));
}

// Exported functions for other scripts
export { visualizeCancerDots };
