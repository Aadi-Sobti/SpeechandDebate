const baseURL = "https://script.google.com/macros/s/AKfycbwhzMEw97HBYQfmJg7LmcBikzpinSCdTDBRJxFWX7r3OSaBLAvFHHZdqlZz67LB5iHNXg/exec";

// Hide splash screen after page loads
window.addEventListener("load", () => {
  const splash = document.getElementById("splash");
  splash.style.opacity = 0;
  setTimeout(() => splash.style.display = "none", 1000);
});

// Fetch links
fetch(`${baseURL}?sheet=links`)
  .then(res => res.json())
  .then(data => {
    const linksDiv = document.getElementById("links");
    linksDiv.innerHTML = "";
    data.forEach(link => {
      linksDiv.innerHTML += `<p><a href="${link.link}" target="_blank">${link.description}</a></p>`;
    });
  })
  .catch(() => {
    document.getElementById("links").innerText = "Failed to load links.";
  });

// Fetch updates
fetch(`${baseURL}?sheet=updates`)
  .then(res => res.json())
  .then(data => {
    const updatesDiv = document.getElementById("updates");
    updatesDiv.innerHTML = "";
    data.forEach(update => {
      updatesDiv.innerHTML += `
        <div class="update">
          <strong>${update.name}</strong> on <em>${update.date} at ${update.time}</em><br>
          <p>${update.description}</p>
          <hr/>
        </div>`;
    });
  })
  .catch(() => {
    document.getElementById("updates").innerText = "Failed to load updates.";
  });
