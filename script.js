const baseURL = "https://script.google.com/macros/s/AKfycbwhzMEw97HBYQfmJg7LmcBikzpinSCdTDBRJxFWX7r3OSaBLAvFHHZdqlZz67LB5iHNXg/exec";

window.addEventListener("load", () => {
    // Splash screen logic (kept for context, but handled inline in index.html)
});

// Function to format date and time from ISO string or direct time string
function formatDateTime(dateIsoString, timeString) {
    let formattedDate = "Invalid Date";
    let formattedTime = "Invalid Time";

    // Format the date part
    try {
        const date = new Date(dateIsoString);
        if (!isNaN(date.getTime())) {
            const month = date.getMonth() + 1; // getMonth() is 0-indexed
            const day = date.getDate();
            const year = date.getFullYear();
            formattedDate = `${month}/${day}/${year}`;
        }
    } catch (e) {
        console.error("Error formatting date:", e);
    }

    // Format the time part (assuming it comes as "HH:MM:SS.sssZ" or similar)
    // If your Google Sheet 'time' column directly contains "3:00 PM",
    // then no special parsing is needed for the timeString.
    // However, if it's part of an ISO string like "1899-12-30T22:00:00.000Z",
    // we need to parse that.
    try {
        // Option 1: If timeString is already "3:00 PM" from your sheet
        if (timeString && timeString.match(/^(1[0-2]|0?[1-9]):([0-5][0-9]) (AM|PM)$/i)) {
            formattedTime = timeString;
        } else if (timeString) {
            // Option 2: If timeString is an ISO format like "1899-12-30T22:00:00.000Z"
            const timeDate = new Date(timeString);
            if (!isNaN(timeDate.getTime())) {
                let hours = timeDate.getHours();
                const minutes = timeDate.getMinutes();
                const ampm = hours >= 12 ? 'PM' : 'AM';
                hours = hours % 12;
                hours = hours ? hours : 12; // the hour '0' should be '12'
                const minString = minutes < 10 ? '0' + minutes : minutes;
                formattedTime = `${hours}:${minString} ${ampm}`;
            } else {
                // Fallback for unexpected formats
                formattedTime = timeString; // Use original string if parsing fails
            }
        } else {
            formattedTime = "No Time";
        }
    } catch (e) {
        console.error("Error formatting time:", e);
        formattedTime = "Time Error";
    }

    return { formattedDate, formattedTime };
}


// Fetch links (no change)
fetch(`${baseURL}?sheet=links`)
    .then(res => {
        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
    })
    .then(data => {
        const linksDiv = document.getElementById("links");
        linksDiv.innerHTML = "";
        if (data && data.length > 0) {
            data.forEach(link => {
                const linkName = link.name || 'Unnamed Link';
                const linkUrl = link.link || '#';

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

// Fetch updates (UPDATED how date and time are used)
fetch(`${baseURL}?sheet=updates`)
    .then(res => {
        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
    })
    .then(data => {
        const updatesDiv = document.getElementById("updates");
        updatesDiv.innerHTML = "";
        if (data && data.length > 0) {
            data.forEach(update => {
                // Call the new formatDateTime function
                const { formattedDate, formattedTime } = formatDateTime(update.date, update.time);
                updatesDiv.innerHTML += `
                    <div class="update-item">
                        <strong>${update.name || 'No Name'}</strong> on <em>${formattedDate} at ${formattedTime}</em><br>
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

// Smooth scroll for "Information" button (no change)
document.addEventListener('DOMContentLoaded', () => {
    const scrollLinks = document.querySelectorAll('.scroll-link');

    scrollLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
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

// Parallax Scroll Effect for Carousel Images (no change)
document.addEventListener('scroll', function() {
    const slides = document.querySelectorAll('.slide img');
    const scrollY = window.pageYOffset;

    slides.forEach(img => {
        if (img.closest('.slide').classList.contains('active')) {
            img.style.transform = `translateY(${scrollY * -0.05}px)`;
        } else {
            img.style.transform = `translateY(0px)`;
        }
    });
});
