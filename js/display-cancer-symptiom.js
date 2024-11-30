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