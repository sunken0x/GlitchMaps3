// inputData.js - Simulates platform injecting traits based on hash and traits.js

// Check if traits object exists (should be loaded by traits.js script)
if (typeof traits === 'undefined') {
    console.error("traits.js was not loaded before inputData.js");
    // Define a dummy traits object to prevent further errors
    var traits = { Error: [{ trait_description: "Traits Missing", trait_value: "error", weight: 1 }] };
}

// Generate a random hash if not provided (e.g., via URL parameter)
let hash = '0x';
for (let i = 0; i < 64; i++) {
    hash += Math.floor(Math.random() * 16).toString(16);
}
console.log("Using simulated hash:", hash);

// --- Simple Trait Selection Logic (based on hash) ---
// This is a basic simulation, the platform's logic might be different
function selectTrait(traitCategory) {
    if (!traitCategory || traitCategory.length === 0) {
        return { trait_description: "N/A", trait_value: "na", weight: 1 }; // Fallback
    }

    // Use hash characters to roughly pick an option based on weight
    // This is NOT cryptographically secure or perfectly distributed like on-chain
    let totalWeight = traitCategory.reduce((sum, option) => sum + (option.weight || 1), 0);
    let hashSegment = parseInt(hash.substr(Math.floor(Math.random()*58) + 2, 8), 16); // Use a random segment
    let choicePoint = (hashSegment / 0xFFFFFFFF) * totalWeight;

    let currentWeight = 0;
    for (let option of traitCategory) {
        currentWeight += (option.weight || 1);
        if (choicePoint <= currentWeight) {
            return option;
        }
    }
    return traitCategory[traitCategory.length - 1]; // Fallback to last option
}

// --- Build the inputData object ---
var inputData = {
    hash: hash,
    tokenId: 'Simulated #' + Math.floor(Math.random()*1000),
    blockNumber: Math.floor(Math.random() * 15000000).toString(),
    blockTimestamp: Math.floor(Date.now() / 1000),
    ownerOfPiece: '0x' + Array(40).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join(''),
    // Add selected traits to inputData
};

for (const traitName in traits) {
    if (Object.hasOwnProperty.call(traits, traitName)) {
        const selectedOption = selectTrait(traits[traitName]);
        // The platform provides the selected option's description as the 'value'
        inputData[traitName] = {
            value: selectedOption.trait_description, // This is what artwork.js reads
            // Optionally include other details if needed for debugging
            // _trait_value: selectedOption.trait_value,
            // _weight: selectedOption.weight
        };
    }
}

console.log("Simulated inputData generated:", inputData);
