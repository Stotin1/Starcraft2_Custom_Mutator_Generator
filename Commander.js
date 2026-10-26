class Commander {
    static next_id = 0;
    // Constructor, inputs ordered in how important they are
    constructor(name, name_color, prestiges, mutator_settings = { mutator_blacklist: [], mutator_settings: {} }, imagePath = null, selected_prestige = null) {
        this.name = name;
        this.id = this.getNextID();
        this.name_color = name_color;
        this.prestiges = prestiges;

        this.mutator_settings = mutator_settings;
        // Ensure that the mutator_settings object has both properties so users can set only one.
        if (!this.mutator_settings.blacklist) {
            this.mutator_settings.blacklist = [];
        }
        if (!this.mutator_settings.mutator_weight_multipliers) {
            this.mutator_settings.mutator_weight_multipliers = {};
        }

        const default_image_path = "Commander Portraits/Portrait_" + this.name.replace(/ /g, "_") + ".webp";
        this.image_path = imagePath || default_image_path;

        // Ensure that the selected prestige exists otherwise default to p0
        this.selected_prestige = selected_prestige;
        if (!this.selected_prestige) {
            this.selected_prestige = this.prestiges[0];
        }

        this.card = this.generateCard();
        this.setCardHtml();

        console.log("Commander " + this.name + " created with ID " + this.id);
    }

    // Getters
    getCommanders() { return this.commanders; }
    getCommanderName() { return this.name; }
    getCommanderID() { return this.id; }
    getCommanderNameColor() { return this.name_color; }
    getCommanderPrestiges() { return this.prestiges; }
    getMutatorSettings() { return this.mutator_settings; }
    getCommanderImagePath() { return this.image_path; }
    getSelectedPrestige() { return this.selected_prestige; }
    getCommanderCard() { return this.card; }

    // Setters
    setCommanderName(name) { this.name = name; }
    setCommanderNameColor(name_color) { this.name_color = name_color; }
    setCommanderPrestiges(prestiges) { this.prestiges = prestiges; }
    setMutatorSettings(mutator_settings) { this.mutator_settings = mutator_settings; }
    setCommanderImagePath(image_path) { this.image_path = image_path; }
    setSelectedPrestige(prestige) { this.selected_prestige = prestige; }
    setCommanderCard(card) { this.card = card; }

    // Get ID and increment next_id
    getNextID() {
        const id = Commander.next_id;
        Commander.next_id++;
        return id;
    }

    // Swap prestige
    swapPrestige(prestige) {
        this.selected_prestige = prestige;
        const displayedPrestigeElement = document.getElementById(this.id + "-prestige");
        displayedPrestigeElement.textContent = prestige.name;

        const mutators = Mutator.mutators;
        let mutator_id_list = [];
        for (let i = 0; i < mutators.length; i++) {
            const mutator = mutators[i];
            mutator_id_list.push(mutator.id);
        }

        // Update the mutator buttons
        const mutator_settings = prestige.getMutatorSettings();
        const mutator_blacklist = mutator_settings.mutator_blacklist;
        const buttons = document.getElementsByClassName(this.id + "_mutator_button");
        for (let i = 0; i < buttons.length; i++) {
            const button = buttons[i];
            const mutator_id = button.id.split("_")[1];
            if (mutator_id in mutator_blacklist) {
                button.classList.add("inactive");
                button.classList.remove("active");
            }
            else {
                button.classList.add("active");
                button.classList.remove("inactive");
            }
        }

        // Update the mutator weight inputs
        const mutator_weight_multipliers = mutator_settings.mutator_weight_multipliers;
        const weight_inputs = document.getElementsByClassName(this.id + "_mutator_weight_input");
        for (let i = 0; i < weight_inputs.length; i++) {
            const weight_input = weight_inputs[i];
            const mutator_id = weight_input.id.split("_")[1];
            if (mutator_id in mutator_weight_multipliers) {
                weight_input.value = mutator_weight_multipliers[mutator_id];
            }
            else {
                weight_input.value = 1;
            }
        }

        console.log("Prestige swapped for " + this.name + " to " + prestige.name);
    };

    // Toggle whether a mutator is blacklisted or not
    toggleMutator(button, mutator) {
        // First determine whether we are setting a specific prestige or the default settings
        let mutator_settings;
        let mutator_blacklist;
        if (this.selected_prestige) {
            mutator_settings = this.selected_prestige.getMutatorSettings();
            mutator_blacklist = mutator_settings.mutator_blacklist;
        }
        else {
            mutator_settings = this.getMutatorSettings();
            mutator_blacklist = mutator_settings.mutator_blacklist;
        }

        // Update the mutator blacklist and button class
        if (mutator_blacklist.includes(mutator.id)) {
            button.classList.add("active");
            button.classList.remove("inactive");
            mutator_blacklist.splice(mutator_blacklist.indexOf(mutator.id), 1);
        }
        else {
            button.classList.add("inactive");
            button.classList.remove("active");
            mutator_blacklist.push(mutator.id);
        }

        console.log("Mutator " + mutator.name + " toggled for " + this.name + " to " + (mutator_blacklist.includes(mutator.id) ? "blacklisted" : "active"));
    };

    // Update the mutator weight for a specific mutator
    mutatorWeightChanged(input, mutator) {
        // First determine whether we are setting a specific prestige or the default settings
        let mutator_settings;
        let mutator_weight_multipliers;
        if (this.selected_prestige) {
            mutator_settings = this.selected_prestige.getMutatorSettings();
            mutator_weight_multipliers = mutator_settings.mutator_weight_multipliers;
        }
        else {
            mutator_settings = this.getMutatorSettings();
            mutator_weight_multipliers = mutator_settings.mutator_weight_multipliers;
        }

        // Update the mutator weight multipliers
        const weight_multiplier = input.value;
        if (mutator.id in mutator_weight_multipliers && weight_multiplier == 1) {
            delete mutator_weight_multipliers[mutator.id];
        }
        else if (weight_multiplier != 1) {
            mutator_weight_multipliers[mutator.id] = weight_multiplier;
        }

        console.log("Mutator weight changed for " + mutator.name + " to " + input.value);
    }

    // Set html for the commander card
    setCardHtml() {
        document.getElementById("commander-cards").appendChild(this.card);
        console.log("Commander card for " + this.name + " added to the page.");
    }

    // Card generator
    generateCard() {
        // Get the commander-card-template and clone it
        const template = document.getElementById("commander-card-template");
        const templateClone = template.content.cloneNode(true);

        // Grab the commander-card element
        const card = templateClone.querySelector(".commander-card");

        // Set the portrait of the commander card
        const imageElement = card.querySelector(".commander-portrait");
        if (this.image_path) {
            this.image_path = "Commander Portraits/Portrait_" + this.name + ".webp";
        }
        imageElement.src = this.image_path;
        imageElement.alt = this.name + " Portrait";

        // Set commander name and prestige name in the card
        card.querySelector(".commander-name").textContent = this.name;
        // Try to set the name color, ignore if it doesn't exist
        if (this.name_color) {
            card.querySelector(".commander-name").style.color = this.name_color;
        }

        // Set the prestige name in the card
        card.querySelector(".prestige").textContent = this.selected_prestige.name;

        // Set the id of the element for later use
        card.querySelector(".prestige").id = this.id + "-prestige";

        // Set the id of the dropdown button for communication with their items
        card.querySelector(".btn").id = "dropdown-" + this.id;

        // Set the aria-labelledby of the dropdown button class
        card.querySelector(".prestige-select-button").setAttribute("aria-labelledby", "dropdown-" + this.id);

        // Set up the prestige-select-buttons
        // First generate buttons for each prestige
        // Second button is for style purposes
        const prestigeItemButton = createElementFromString(`<button class="dropdown-item mb-3 py-2 prestige-select-item" type="button"></button>`);
        const prestigeItemButtonEnd = createElementFromString(`<button class="dropdown-item py-2 prestige-select-item" type="button"></button>`);

        // Set up buttons for each prestige
        for (let i = 0; i < this.prestiges.length; i++) {
            // Clone the prestige-select-item template for each prestige
            let button;
            if (i < this.prestiges.length - 1) {
                button = prestigeItemButton.cloneNode(true);
            }
            else {
                button = prestigeItemButtonEnd.cloneNode(true);
            }

            // Append to the prestige-select-button div
            card.querySelector(".prestige-select-button").appendChild(button);

            // Add an event listener to each prestige item that will swap the prestige when clicked
            const commander = this;
            const prestige = this.prestiges[i];
            button.addEventListener("click", function () {
                // This is where we use the Mutator button list to update their colors.
                commander.swapPrestige(prestige);
            });

            // Set the text content of the prestige item to the name of the prestige
            button.textContent = this.prestiges[i].name;
        }

        // Set up the mutator-select-buttons
        const mutatorItemButton = createElementFromString(`<button class="dropdown-item mb-2 py-2 mutator-select-item" type="button"></button>`);
        const mutatorItemButtonEnd = createElementFromString(`<button class="dropdown-item py-2 mutator-select-item" type="button"></button>`);
        const mutatorItemWeight = createElementFromString(`<input type="number" class="mutator_weight_input">`);

        // List containing each mutator button
        // Will be used to update the mutator buttons when the prestige is swapped
        // Without creating a new button for each prestige
        const commander_blacklist = this.mutator_settings.mutator_blacklist;
        const mutators = Mutator.mutators;
        for (let i = 0; i < mutators.length; i++) {
            // Grab mutator variables
            const mutator = mutators[i];
            const mutator_id = mutator.id;
            const mutator_name = mutator.name;
            const mutatorDescription = mutator.description;

            // Create the buttons
            let button;
            if (i < mutators.length - 1) {
                button = mutatorItemButton.cloneNode(true);
            }
            else {
                button = mutatorItemButtonEnd.cloneNode(true);
            }

            // Add the mutatorID and the commanderID to make the buttons unique ID
            button.id = this.id + "_" + mutator_id + "_mutator_button";

            // Add commander.id_mutator_button to classlist
            button.classList.add(this.id + "_mutator_button");

            // Check if the mutator is blacklisted by the commanders prestige, then by the commanders default
            const prestige_blacklist = this.selected_prestige.getMutatorSettings().mutator_blacklist;
            if (commander_blacklist.includes(mutator_id) || prestige_blacklist.includes(mutator_id)) {
                button.classList.add("inactive");
            }
            else {
                button.classList.add("active");
            }

            button.textContent = mutator_name;

            // Add an event listener to each mutator item that will toggle the mutator when clicked
            const commander = this;
            button.addEventListener("click", function () {
                // Toggle the mutator setting for the commander
                commander.toggleMutator(button, mutator);
            });


            // Setup weightInput
            const weightInput = mutatorItemWeight.cloneNode(true);
            weightInput.id = this.id + "_" + mutator_id + "_mutator_weight_input";
            weightInput.classList.add(this.id + "_mutator_weight_input");

            const prestige_mutator_weights = this.selected_prestige.getMutatorSettings().mutator_weight_multipliers;
            let mutator_weight
            if (mutator_id in prestige_mutator_weights) {
                mutator_weight = prestige_mutator_weights[mutator_id];
            }
            else if (mutator_id in commander.mutator_settings.mutator_weight_multipliers) {
                mutator_weight = commander.mutator_settings.mutator_weight_multipliers[mutator_id];
            }
            else {
                mutator_weight = 1;
            }

            weightInput.value = mutator_weight;

            weightInput.addEventListener('change', () => {
                commander.mutatorWeightChanged(weightInput, mutator);
            })

            // Setup the mutator Image
            const mutatorImage = createElementFromString(`<img class="mutator-image" src="${mutator.imagePath}" alt="${mutator.name} Image">`);

            const mutatorDiv = createElementFromString(`<div class="mutator-div"></div>`);
            mutatorDiv.appendChild(mutatorImage);
            mutatorDiv.appendChild(button);
            mutatorDiv.appendChild(weightInput);

            // Append the mutatorDiv to the mutator-select-button div
            card.querySelector(".mutator-select-button").appendChild(mutatorDiv);
        }

        console.log("Commander card for " + this.name + " generated.");
        return card;
    }
};