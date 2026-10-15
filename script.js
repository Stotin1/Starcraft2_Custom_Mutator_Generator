const commanders = [
    raynor = {
        name: "Raynor",
        nameColor: "#001eff",
        id: "raynor",
        imagePath: null,
        prestiges: [
            prestige0 = {
                name: "Renegade Commander",
            },
            prestige0 = {
                name: "Backwater Marshal",
            },
            prestige0 = {
                name: "Rough Rider",
            },
            prestige0 = {
                name: "Rebel Raider",
            },
        ],
        mutatorSettings: {
        },
        card: null
    }
];

const mutators = [
    mutator0 = {
        name: "Mutator 0",
        id: "mutator0",
        description: "description0:",
        imagePath: null,
    },
    mutator1 = {
        name: "Mutator 1",
        id: "mutator1",
        description: "description1:",
        imagePath: null,
    }
]

// Generate commander cards for each commander and append them to the html doc
function generateCommanderCards(commanders) {
    for (let i = 0; i < commanders.length; i++) {
        const commander = commanders[i];
        const card = generateCard(commander);
        commander.card = card;
        document.getElementById("commander-cards").appendChild(card);
    }
}

// Set mutator settings for each commander using a dictionary to check if a commander already has mutator settings
// If no settings are found for that commander, default to all mutators being enabled
function setMutatorSettings(mutators, settings = null) {
    for (let i = 0; i < commanders.length; i++) {
        const commander = commanders[i];
        if (settings && settings[commander.id]) {
            commander.mutatorSettings = settings[commander.id];
        }
        else {
            for (let j = 0; j < mutators.length; j++) {
                const mutator = mutators[j];
                const mutatorID = mutator.id;
                commander.mutatorSettings[mutatorID] = true;
            }
        }
    }
}

function createElementFromString(htmlString) {
    const template = document.createElement('template');
    template.innerHTML = htmlString.trim();
    return template.content.firstChild;
}

function generateCard(commander) {
    // Get the commander-card-template and clone it
    const template = document.getElementById("commander-card-template");
    const templateClone = template.content.cloneNode(true);

    // Grab the commander-card element
    const card = templateClone.querySelector(".commander-card");

    // Set the portrait of the commander card
    const imageElement = card.querySelector(".commander-portrait");
    let imagePath = commander.imagePath;
    if (!imagePath) {
        imagePath = "Commander Portraits/Portrait_" + commander.name + ".webp";
    }
    imageElement.src = imagePath;
    imageElement.alt = commander.name + " Portrait";

    // Set commander name and prestige name in the card
    commanderName = commander.name;
    card.querySelector(".commander-name").textContent = commanderName;
    // Try to set the name color, ignore if it doesn't exist
    nameColor = commander.nameColor;
    if (nameColor) {
        card.querySelector(".commander-name").style.color = nameColor;
    }

    // Grab the prestiges for the commander
    const prestiges = commander.prestiges;
    prestigeName = prestiges[0].name; // Default to the prestige 0, or the basic commander
    card.querySelector(".prestige").textContent = prestigeName;

    // Set the id of the element for later use
    card.querySelector(".prestige").id = commander.id + "-prestige";

    // Set the id of the dropdown button for communication with their items
    card.querySelector(".btn").id = "dropdown-" + commander.id;

    // Set the aria-labelledby of the dropdown button class
    card.querySelector(".prestige-select-button").setAttribute("aria-labelledby", "dropdown-" + commander.id);

    
    // Set up the prestige-select-buttons
    // First generate buttons for each prestige
    // Second button is for style purposes
    const prestigeItemButton = createElementFromString(`<button class="dropdown-item mb-3 py-2 prestige-select-item" type="button"></button>`);
    const prestigeItemButtonEnd = createElementFromString(`<button class="dropdown-item py-2 prestige-select-item" type="button"></button>`);
    
    for (let i = 0; i < prestiges.length; i++) {
        // Clone the prestige-select-item template for each prestige
        let button;
        if (i < prestiges.length - 1) {
            button = prestigeItemButton.cloneNode(true);
        }
        else {
            button = prestigeItemButtonEnd.cloneNode(true);
        }

        // Append to the prestige-select-button div
        card.querySelector(".prestige-select-button").appendChild(button);

        // Add an event listener to each prestige item that will swap the prestige when clicked
        button.addEventListener("click", function() {
            swapPrestige(commander, prestiges[i]);
        });

        // Set the text content of the prestige item to the name of the prestige
        button.textContent = prestiges[i].name;
    }

    // Set up the mutator-select-buttons
    const mutatorItemButton = createElementFromString(`<button class="dropdown-item mb-2 py-2 mutator-select-item" type="button"></button>`);
    const mutatorItemButtonEnd = createElementFromString(`<button class="dropdown-item py-2 mutator-select-item" type="button"></button>`);
    for (let i = 0; i < mutators.length; i++) {
        // Grab mutator variables
        const mutator = mutators[i];
        const mutatorID = mutator.id;
        const mutatorName = mutator.name;
        const mutatorDescription = mutator.description;

        // Create the buttons
        let button;
        if (i < mutators.length - 1) {
            button = mutatorItemButton.cloneNode(true);
        }
        else {
            button = mutatorItemButtonEnd.cloneNode(true);
        }

        // Check if its enabled or disabled for the commander
        if (commander.mutatorSettings[mutatorID]) {
            button.classList.add("active");
        }
        else {
            button.classList.add("inactive");
        }

        // Append to the mutator-select-button div
        card.querySelector(".mutator-select-button").appendChild(button);

        // Add an event listener to each mutator item that will toggle the mutator when clicked
        button.addEventListener("click", function() {
            // Toggle the mutator setting for the commander
            toggleMutator(commander, mutator, button);
        });

        button.textContent = mutatorName;
    }

    return card;
}

function swapPrestige(commander, prestige) {
    commanderID = commander.id;
    displayedPrestigeElement = document.getElementById(commanderID + "-prestige");
    displayedPrestigeElement.textContent = prestige.name;
}

function toggleMutator(commander, mutator, button) {
    commander.mutatorSettings[mutator.id] = !commander.mutatorSettings[mutator.id];
    if (commander.mutatorSettings[mutator.id]) {
        button.classList.add("active");
        button.classList.remove("inactive");
    }
    else {
        button.classList.add("inactive");
        button.classList.remove("active");
    }
}

function generateCommanders() {
    setMutatorSettings(mutators);
    generateCommanderCards(commanders);
}

generateCommanders();