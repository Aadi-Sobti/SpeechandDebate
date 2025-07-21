const baseURL = "https://script.google.com/macros/s/AKfycbwhzMEw97HBYQfmJg7LmcBikzpinSCdTDBRJxFWX7r3OSaBLAvFHHZdqlZz67LB5iHNXg/exec";

// This splash screen logic is already effectively handled in index.html's inline script.
// Keeping it here for context of this file's purpose, but it's not strictly necessary.
window.addEventListener("load", () => {
    // const splash = document.getElementById("splash-screen");
    // if (splash) {
    //     splash.classList.add('hide');
    // }
});

// Function to format date from ISO string to MM/DD/YYYY
function formatDate(isoString) {
    try {
        const date = new Date(isoString);
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

// Smooth scroll for "Information" button
document.addEventListener('DOMContentLoaded', () => {
    const scrollLinks = document.querySelectorAll('.scroll-link');

    scrollLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault(); // Prevent default anchor jump
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
});

// New Parallax Scroll Effect for Carousel Images
document.addEventListener('scroll', function() {
    const slides = document.querySelectorAll('.slide img'); // Select all image elements

    const scrollY = window.pageYOffset;

    slides.forEach(img => {
        // We only want the active slide's image to move
        if (img.closest('.slide').classList.contains('active')) {
            // Adjust the multiplier (e.g., -0.05) for desired speed and direction
            // Negative value makes it move up as you scroll down
            img.style.transform = `translateY(${scrollY * -0.05}px)`;
        } else {
            // Reset non-active slides when they are not visible
            img.style.transform = `translateY(0px)`;
        }
    });
});
