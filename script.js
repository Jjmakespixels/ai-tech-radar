document.addEventListener("DOMContentLoaded", () => {
    // 💡 All your data now lives here!
    // To add, edit, or remove items, modify this array.
    const radarData = [
        {
            name: "Midjourney",
            quadrant: 1,
            zone: "A",
            description: "Advanced image generation from text prompts."
        },
        {
            name: "Copy.ai",
            quadrant: 2,
            zone: "B",
            description: "AI-powered copywriter for marketing content."
        },
        {
            name: "Descript",
            quadrant: 3,
            zone: "A",
            description: "All-in-one audio and video editing with AI."
        },
        {
            name: "Jasper",
            quadrant: 2,
            zone: "C",
            description: "AI content platform for enterprise marketing."
        }
        // To add a new tool, copy one of the blocks above and paste it here.
        // For example:
        // {
        //     name: "New AI Tool",
        //     quadrant: 4,
        //     zone: "D",
        //     description: "A description of this new tool."
        // },
    ];

    // This immediately creates the radar with the data above.
    createRadar(radarData);
});

function createRadar(data) {
    const radarContainer = d3.select("#radar-container");

    const zoneScales = {
        'A': 0.25,
        'B': 0.50,
        'C': 0.75,
        'D': 1.00
    };

    data.forEach(item => {
        if (!item.name || !item.quadrant || !item.zone) {
            console.warn("Skipping invalid item:", item);
            return;
        }

        const quadrant = parseInt(item.quadrant, 10);
        const zone = item.zone.toUpperCase();

        if (isNaN(quadrant) || !zoneScales[zone]) {
            console.warn("Skipping item with invalid quadrant or zone:", item);
            return;
        }

        const angleJitter = (Math.random() - 0.5) * 80;
        const radiusJitter = (Math.random() - 0.5) * 0.15;

        let baseAngle = 0;
        switch(quadrant) {
            case 1: baseAngle = 45; break;
            case 2: baseAngle = 135; break;
            case 3: baseAngle = 225; break;
            case 4: baseAngle = 315; break;
        }

        const angle = baseAngle + angleJitter;
        const radius = (zoneScales[zone] - radiusJitter) / 2;

        const x = 50 + (radius * 100 * Math.cos((angle - 90) * Math.PI / 180));
        const y = 50 + (radius * 100 * Math.sin((angle - 90) * Math.PI / 180));

        const blip = radarContainer.append("div")
            .attr("class", "blip")
            .style("left", `${x}%`)
            .style("top", `${y}%`)
            .style("transform", "translate(-50%, -50%)");

        blip.append("div")
            .attr("class", "tooltip")
            .html(`<strong>${item.name}</strong><br>${item.description}`);
    });
}