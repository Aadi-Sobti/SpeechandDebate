const baseURL = "https://script.google.com/macros/s/AKfycbwhzMEw97HBYQfmJg7LmcBikzpinSCdTDBRJxFWX7r3OSaBLAvFHHZdqlZz67LB5iHNXg/exec";

// Hide splash screen after page loads (this part is in your index.html's script block, but keeping this function here for full context of your JS file)
window.addEventListener("load", () => {
    // The splash screen hiding logic is already in index.html's script block,
    // so this specific part is redundant if you keep that inline script.
    // If you remove the inline script, make sure #splash-screen is initially visible in CSS
    // and then use this:
    // const splash = document.getElementById("splash-screen");
    // if (splash) {
    //     splash.classList.add('hide'); // Uses the CSS transition
    // }
});

// Function to format date from ISO string to MM/DD/YYYY
function formatDate(isoString) {
    try {
        const date = new Date(isoString);
        // Check if the date is valid
        if (isNaN(date.getTime())) {
            return "Invalid Date";
        }
        const month = date.getMonth() + 1; // getMonth() is 0-indexed
        const day = date.getDate();
        const year = date.getFullYear();
        return `${month}/${day}/${year}`;
    } catch (e) {
        console.error("Error formatting date:", e);
        return "Date Error";
    }
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
                const linkName = link.name || 'Unnamed Link'; // Assuming a 'name' property from your sheet
                const linkUrl = link.link || '#'; // Assuming a 'link' property from your sheet

                linksDiv.innerHTML += `
                    <div class="info-link-item">
                        <a href="${linkUrl}" target="_blank">
                            <span class="link-name">${linkName}</span>
                        </a>
                        <hr class="link-separator"/>
                    </div>`;
            });
        } else {
            linksDiv.innerText = "No useful links available at this time.";
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
                        <strong>${update.name || 'No Name'}</strong> on <em>${formattedDate} at ${update.time || 'No Time'}</em><br>
                        <p>${update.description || 'No description provided.'}</p>
                        <hr class="update-separator"/>
                    </div>`;
            });
        } else {
            updatesDiv.innerText = "No recent updates available at this time.";
        }
    })
    .catch(error => {
        console.error("Error fetching updates:", error);
        document.getElementById("updates").innerText = "Failed to load updates. Please try again later.";
    });
