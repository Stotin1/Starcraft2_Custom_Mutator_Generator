class Prestige {
    constructor(name, mutator_settings = { mutator_blacklist: [], mutator_weight_multipliers: {} }) {
        this.name = name;
        this.mutator_settings = mutator_settings;

        console.log("Prestige " + this.name + " created");
    }

    // Getters
    getPrestiges() { return this.prestiges; }
    getPrestigeName() { return this.name; }
    getMutatorSettings() { return this.mutator_settings; }

    // Setters
    setMutatorSettings(settings) { this.mutator_settings = settings; }
};