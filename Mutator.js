class Mutator {
    static next_id = 0;
    static mutators = [];

    // Constructor, inputs ordered in how important they are
    constructor(name, weight, description, imagePath = null) {
        this.name = name;
        this.id = this.getNextID();
        this.weight = weight;
        this.description = description;
        this.imagePath = imagePath || "Mutator Images/Image_" + this.name.replace(/ /g, "_") + ".png";
        Mutator.mutators.push(this);

        console.log("Mutator " + this.name + " created with ID " + this.id);
    }

    // Getters
    getMutatorName() { return this.name; }
    getMutatorID() { return this.id; }
    getMutatorWeight() { return this.weight; }
    getMutatorDescription() { return this.description; }
    getMutatorImagePath() { return this.imagePath; }

    // Setters
    setMutatorName(name) { this.name = name; }
    setMutatorWeight(weight) { this.weight = weight; }
    setMutatorDescription(description) { this.description = description; }
    setMutatorImagePath(imagePath) { this.imagePath = imagePath; }

    // Get ID and increment next_id
    getNextID() {
        const id = Mutator.next_id;
        Mutator.next_id++;
        return id;
    }
}