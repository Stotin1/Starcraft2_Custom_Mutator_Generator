// TO-DO:
// Add a hide-portrait button to lower card size on small screens

// Turns a string into an HTML element
function createElementFromString(htmlString) {
    const template = document.createElement('template');
    template.innerHTML = htmlString.trim();
    return template.content.firstChild;
};

// Mutators, must be declared before commanders
new Mutator(
    "Afraid of the Dark",
    1,
    "Vision provided by all sources is extremely limited except when in view of your camera."
),
new Mutator(
    "Aggressive Deployment",
    1,
    "Additional enemy units are periodically deployed onto the battlefield."
),
new Mutator(
    "Alien Incubation",
    1,
    "All enemy units spawn Broodlings upon death."
)

// Commanders, must be declared after mutators
new Commander(
    "Raynor",
    "#001eff",
    [
        new Prestige(
            "Renegade Commander",
            {
                mutator_blacklist: [0],
                mutator_weight_multipliers: {
                    1: 1.5,
                },
            }
        ),
        new Prestige("Backwater Marshal"),
        new Prestige("Rough Rider"),
        new Prestige("Rebel Raider"),
    ],
)