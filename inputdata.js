// inputData.js - Simulates platform injecting traits based on hash and traits.js

// Check if traits object exists (should be loaded by traits.js script)
if (typeof traits === 'undefined') {
    console.error("inputData.js ERROR: traits.js was not loaded before inputData.js");
    // Define a dummy traits object to prevent further errors
    var traits = { Error: [{ trait_description: "Traits Missing", trait_value: "error", weight: 1 }] };
} else {
     console.log("inputData.js: Found traits object from traits.js");
}


// Generate a random hash if not provided (e.g., via URL parameter)
let hash = '0x';
for (let i = 0; i < 64; i++) {
    hash += Math.floor(Math.random() * 16).toString(16);
}
console.log("inputData.js: Using simulated hash:", hash);

// --- Simple Trait Selection Logic (based on hash) ---
function selectTrait(traitCategory, categoryName) { // Added categoryName for logging
    if (!traitCategory || traitCategory.length === 0) {
        console.warn(`inputData.js: No options found for trait category: ${categoryName}`);
        return { trait_description: "N/A", trait_value: "na", weight: 1 }; // Fallback
    }

    let totalWeight = traitCategory.reduce((sum, option) => sum + (option.weight || 1), 0);
    // Use a HASH segment for pseudo-determinism (more like platform)
    // Take different segment based on category name length to vary selection
    const hashStartIndex = 2 + (categoryName.length % 56); // Vary start based on name
    let hashSegment = parseInt(hash.substr(hashStartIndex, 8), 16);
    if (isNaN(hashSegment)) { // Fallback if hash segment invalid
        console.warn(`inputData.js: Invalid hash segment for ${categoryName}, using random fallback.`);
        hashSegment = Math.random() * 0xFFFFFFFF;
    }

    let choicePoint = (hashSegment / 0xFFFFFFFF) * totalWeight;

    let currentWeight = 0;
    for (let option of traitCategory) {
        currentWeight += (option.weight || 1);
        if (choicePoint <= currentWeight) {
             console.log(`inputData.js: Selected trait for ${categoryName}: ${option.trait_description}`);
            return option; // Return the selected option object
        }
    }
    // Fallback if loop finishes unexpectedly (shouldn't happen with valid weights)
    console.warn(`inputData.js: Fallback selection for ${categoryName}`);
    return traitCategory[traitCategory.length - 1];
}

// --- Build the inputData object ---
// IMPORTANT: Declare inputData with var BEFORE population for global scope
var inputData = {
    hash: hash,
    tokenId: 'Simulated #' + Math.floor(Math.random()*1000), // Keep some randomness here for ID
    blockNumber: Math.floor(Math.random() * 15000000).toString(),
    blockTimestamp: Math.floor(Date.now() / 1000),
    ownerOfPiece: '0x' + Array(40).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join(''),
};
console.log("inputData.js: Initial inputData object created:", inputData);


// Add selected traits to inputData
console.log("inputData.js: Populating traits...");
for (const traitName in traits) {
    if (Object.hasOwnProperty.call(traits, traitName)) {
        const selectedOption = selectTrait(traits[traitName], traitName); // Pass name for logging
        // The platform provides the selected option's description as the 'value'
        inputData[traitName] = {
            value: selectedOption.trait_description // This is what artwork.js reads
        };
    }
}

// <<< ADDED FINAL LOG >>>
console.log("inputData.js: FINAL SIMULATED inputData object:", JSON.parse(JSON.stringify(inputData))); // Log a deep copy
