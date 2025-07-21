const baseURL = "https://script.google.com/macros/s/AKfycbwhzMEw97HBYQfmJg7LmcBikzpinSCdTDBRJxFWX7r3OSaBLAvFHHZdqlZz67LB5iHNXg/exec";

// Hide splash screen after page loads (this part is in your index.html now, but keeping it here for reference if you move it back)
window.addEventListener("load", () => {
    const splash = document.getElementById("splash-screen"); // Corrected ID to match index.html
    // The splash screen hiding logic is already in index.html, this is redundant if using index.html's script block
    // If you want to control it from here, ensure splash-screen has initial display: block; and this JS executes.
    if (splash) {
        // splash.style.opacity = 0; // Handled by CSS transition with 'hide' class
        // setTimeout(() => splash.style.display = "none", 1000); // Handled by CSS visibility
    }
});

// Function to format date
function formatDate(isoString) {
    const date = new Date(isoString);
    const month = date.getMonth() + 1; // getMonth() is 0-indexed
    const day = date.getDate();
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
}

// Fetch links
fetch(`${baseURL}?sheet=links`)
    .then(res => {
        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
    })
    .then(data => {
        const linksDiv = document.getElementById("links");
        linksDiv.innerHTML = ""; // Clear "Loading links..."
        if (data && data.length > 0) {
            data.forEach(link => {
                // Ensure 'name' and 'link' properties exist
                const linkName = link.name || 'Unnamed Link';
                const linkUrl = link.link || '#'; // Fallback to '#' if no link provided

                linksDiv.innerHTML += `
                    <div class="info-link-item">
                        <a href="${linkUrl}" target="_blank">
                            <span class="link-name">${linkName}</span>
                        </a>
                        <hr class="link-separator"/>
                    </div>`;
            });
        } else {
            linksDiv.innerText = "No links available at this time.";
        }
    })
    .catch(error => {
        console.error("Error fetching links:", error);
        document.getElementById("links").innerText = "Failed to load links. Please try again later.";
    });

// Fetch updates
fetch(`${baseURL}?sheet=updates`)
    .then(res => {
        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
    })
    .then(data => {
        const updatesDiv = document.getElementById("updates");
        updatesDiv.innerHTML = ""; // Clear "Loading updates..."
        if (data && data.length > 0) {
            data.forEach(update => {
                const formattedDate = formatDate(update.date); // Format the date
                updatesDiv.innerHTML += `
                    <div class="update-item">
                        <strong>${update.name}</strong> ---- <em>${formattedDate}</em><br>
                        <p>${update.description}</p>
                        <hr class="update-separator"/>
                    </div>`;
            });
        } else {
            updatesDiv.innerText = "No updates available at this time.";
        }
    })
    .catch(error => {
        console.error("Error fetching updates:", error);
        document.getElementById("updates").innerText = "Failed to load updates. Please try again later.";
    });
