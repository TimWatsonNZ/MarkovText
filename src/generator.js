"use strict"; 

// generator
let chain = new MarkovTextChain();

// Grab input
let input = {};
let output = {};

let order = {};
let outputLengthField = {};

let debugging = true;

// Analyze input and create new Chain
function analyze(){
    let output = chain.analyze(input.value, order.value);
    debugging ? console.log(output) : null;
}

function generate(length){
    output.value = chain.generate(outputLengthField.value);
}

// Setup controls.
window.onload = () => {
    document.getElementById("analyze").addEventListener("click", analyze);
    document.getElementById("generate").addEventListener("click", generate);

    input = document.getElementById("input");
    output = document.getElementById("output");
    order = document.getElementById("orderField");
    outputLengthField = document.getElementById("outputLengthField");

    order.value = 1;
    outputLengthField.value = 200;
};
