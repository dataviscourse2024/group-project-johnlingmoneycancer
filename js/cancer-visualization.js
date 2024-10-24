function scrollToBottom() {
    window.scrollTo({
        top: document.body.scrollHeight,
        behavior: 'smooth'
    });
}

function showDescription(title, content) {
    var description = document.getElementById('description');
    
    // Set the title and content dynamically with separate styling
    description.innerHTML = `<h2 class="title">${title}</h2><p class="content">${content}</p>`;
    
    // Show the description with a fade-in effect
    if (description.style.display === 'none' || description.style.display === '') {
        description.style.display = 'block'; // Make it visible
        setTimeout(function() {
            description.style.opacity = '1'; // Gradually increase opacity
        }, 10); // Small delay to trigger transition
    } else {
        description.style.opacity = '0'; // Gradually fade out
        setTimeout(function() {
            description.style.display = 'none'; // Fully hide after fade-out
        }, 1000); // Match delay to CSS transition (1 second)
    }
}


function doAll(title, content) {
    scrollToBottom();
    
    // Pass title and content to showDescription after scroll
    setTimeout(function() {
        showDescription(title, content);
    }, 500); // Wait for scroll action to nearly complete
}
