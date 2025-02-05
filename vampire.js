class Vampire {
  constructor(name, yearConverted) {
    this.name = name;
    this.yearConverted = yearConverted;
    this.offspring = [];
    this.creator = null;
  }

  /** Simple tree methods **/

  // Adds the vampire as an offspring of this vampire
  addOffspring(vampire) {
    this.offspring.push(vampire);
    vampire.creator = this;
  }

  // Returns the total number of vampires created by that vampire
  get numberOfOffspring() {
    return this.offspring.length;
  }

  // Returns the number of vampires away from the original vampire this vampire is
  get numberOfVampiresFromOriginal() {
    let numOfVamprs = 0;
    let currentVampr = this;

    // climb "up" the tree using iterations, counting nodes, until the original vampire
    while (currentVampr.creator) {
      currentVampr = currentVampr.creator;
      numOfVamprs++;
    }

    return numOfVamprs;
  }

  // Returns true if this vampire is more senior than the other vampire. (Who is closer to the original vampire)
  isMoreSeniorThan(vampire) {
    // numberOfVampiresFromOriginal will be SMALLER if the vampire is older (the closer to 0 [creator] the older)
    return this.numberOfVampiresFromOriginal < vampire.numberOfVampiresFromOriginal;
  }

  /** Stretch **/

  // Helper function for closestCommonAncestor that returns array of lineage from creator
  getLineage() {
    let lineageArr = [];
    let currentVampr = this;

    // climb "up" the tree using iterations, adding each node into an array, until the original vampire (creator)
    while (currentVampr) {
      lineageArr.push(currentVampr);
      currentVampr = currentVampr.creator;
    }

    return lineageArr.reverse(); // [3, 2, 1, creator] => [creator, 1, 2, 3]
  }

  // Returns the closest common ancestor of two vampires.
  // The closest common anscestor should be the more senior vampire if a direct ancestor is used.
  // For example:
  // * when comparing Ansel and Sarah, Ansel is the closest common anscestor.
  // * when comparing Ansel and Andrew, Ansel is the closest common anscestor.
  closestCommonAncestor(vampire) {
    // Create two arrays, one for 'this' and another for 'vampire', that contains top-down lineage from 'creator' to 'specific node'
    const thisLineageArr = this.getLineage();
    const vampireLineageArr = vampire.getLineage();
    let shortestLineageLength = thisLineageArr.length;

    // If one of the vampires is the creator, they are the common ancestor
    if (thisLineageArr.length === 1) {
      return thisLineageArr[0];
    }
    if (vampireLineageArr.length === 1) {
      return vampireLineageArr[0];
    }

    if (shortestLineageLength > vampireLineageArr.length) {
      shortestLineageLength = vampireLineageArr.length;
    }

    let commonAncestor;
    for (let i = 0; i < shortestLineageLength; i++) {
      if (thisLineageArr[i] === vampireLineageArr[i]) {
        commonAncestor = thisLineageArr[i];
      } else { // Lineage starts diverging
        break;
      }
    }

    return commonAncestor;
  }

  /** Tree traversal methods **/

  // Returns the vampire object with that name, or null if no vampire exists with that name
  vampireWithName(name) {
    if (this.name === name) {
      return this; // Found the vampire with matching name
    }

    // Recursively searches through the offsprings of the current vampire
    for (const eachOffspring of this.offspring) {
      const result = eachOffspring.vampireWithName(name);
      if (result) {
        return result; // Returns the resulting object with matching name
      }
    }

    return null; // Name not found in this tree/subtree
  }

  // Returns the total number of vampires that exist
  get totalDescendents() {
    let numVampires = 0;

    // Recursively counts the number of offsprings of 'this' vampire
    for (const eachOffspring of this.offspring) {
      numVampires += eachOffspring.totalDescendents;
      numVampires++;
    }

    return numVampires;
  }

  // Returns an array of all the vampires that were converted after 1980
  get allMillennialVampires() {
    const millennialVampires = [];

    // Creates an array to keep track of vampires to visit and an index to keep track of the next vampire to visit
    const vampiresToVisit = [this];
    let vampireIndex = 0;

    while (vampireIndex < vampiresToVisit.length) {
      const currentVampire = vampiresToVisit[vampireIndex]; // Get the next vampire

      if (currentVampire.yearConverted > 1980) {
        millennialVampires.push(currentVampire);
      }

      // Adds each and every offspring to the list of vampires to visit
      for (const eachOffspring of currentVampire.offspring) {
        vampiresToVisit.push(eachOffspring);
      }

      vampireIndex++; // Moves to the next vampire in the array
    }

    return millennialVampires;
  }

}

module.exports = Vampire;