export function displayCancerImages(imageFolderPath) {
    const imageContainer = document.getElementById("cancer-image-container");

    // Ensure the container exists
    if (!imageContainer) {
        console.error("Image container not found in the HTML.");
        return;
    }

    // Clear any existing content
    imageContainer.innerHTML = "";

    // Check if there are images to display
    if (imageFolderPath && imageFolderPath.length > 0) {
        imageFolderPath.forEach(imagePath => {
            const img = document.createElement("img");
            img.src = imagePath;
            img.alt = "Cancer Prevention Image";
            imageContainer.appendChild(img);
        });
        imageContainer.style.display = "flex"; // Show the container
    } else {
        console.warn("No images available for this cancer type.");
        imageContainer.style.display = "none"; // Hide the container if no images
    }
}

export function addPreventionDescription(preventionDescriptions) {
    // Check if the description container already exists
    let descriptionDiv = document.getElementById("prevention-description");

    // Update the content of the description
    descriptionDiv.textContent = preventionDescriptions;

    // Make the description visible
    descriptionDiv.style.display = "block"; // Show the block
    setTimeout(() => {
        descriptionDiv.style.opacity = 1; // Fade-in effect
    }, 10); // Small delay to ensure the transition applies
}