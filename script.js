document.addEventListener("DOMContentLoaded", () => {
    // !!! PASTE YOUR GOOGLE SHEET URL HERE !!!
    const googleSheetUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSuxvByj9xQfbB8Pfx0CkxSnZdts_gyuzYVQaoebWbD7EtYfjkpJw2QpCjkE3KMNEIN-Gk3bHX8seAb/pub?gid=877712420&single=true&output=csv';

    // Check if the placeholder URL is still there
    if (googleSheetUrl === 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSuxvByj9xQfbB8Pfx0CkxSnZdts_gyuzYVQaoebWbD7EtYfjkpJw2QpCjkE3KMNEIN-Gk3bHX8seAb/pub?gid=877712420&single=true&output=csv' || googleSheetUrl.trim() === '') {
        console.error("ERROR: Please paste your published Google Sheet URL into script.js");
        alert("Configuration needed: Please update the Google Sheet URL in the script.");
        return;
    }

    // Use PapaParse to fetch and parse the CSV data from Google Sheets
    Papa.parse(googleSheetUrl, {
        download: true,
        header: true,
        complete: (results) => {
            console.log("Data loaded successfully:", results.data);
            createRadar(results.data);
        },
        error: (error) => {
            console.error("Error loading or parsing Google Sheet:", error);
            alert("Failed to load data from Google Sheets. Check the URL and that the sheet is published correctly.");
        }
    });
});

function createRadar(data) {
    const radarContainer = d3.select("#radar-container");

    // Zone scales (from inner to outer)
    const zoneScales = {
        'A': 0.25, // Innermost
        'B': 0.50,
        'C': 0.75,
        'D': 1.00  // Outermost
    };

    data.forEach(item => {
        if (!item.name || !item.quadrant || !item.zone) {
            console.warn("Skipping invalid item:", item);
            return; // Skip rows that don't have the required info
        }

        const quadrant = parseInt(item.quadrant, 10);
        const zone = item.zone.toUpperCase();
        
        if (isNaN(quadrant) || !zoneScales[zone]) {
            console.warn("Skipping item with invalid quadrant or zone:", item);
            return;
        }

        // Calculate a random-like but stable position within the segment
        const angleJitter = (Math.random() - 0.5) * 80; // degrees
        const radiusJitter = (Math.random() - 0.5) * 0.15;
        
        let baseAngle = 0;
        switch(quadrant) {
            case 1: baseAngle = 45; break;  // Top-Right
            case 2: baseAngle = 135; break; // Top-Left
            case 3: baseAngle = 225; break; // Bottom-Left
            case 4: baseAngle = 315; break; // Bottom-Right
        }

        const angle = baseAngle + angleJitter;
        const radius = (zoneScales[zone] - radiusJitter) / 2; // scale radius to fit within 0-0.5 range

        // Convert polar coordinates (angle, radius) to Cartesian (x, y)
        const x = 50 + (radius * 100 * Math.cos((angle - 90) * Math.PI / 180));
        const y = 50 + (radius * 100 * Math.sin((angle - 90) * Math.PI / 180));

        // Create the blip element
        const blip = radarContainer.append("div")
            .attr("class", "blip")
            .style("left", `${x}%`)
            .style("top", `${y}%`)
            .style("transform", "translate(-50%, -50%)");

        // Add a tooltip
        blip.append("div")
            .attr("class", "tooltip")
            .html(`<strong>${item.name}</strong><br>${item.description}`);
    });
}