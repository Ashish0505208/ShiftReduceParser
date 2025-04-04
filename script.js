// // Dynamically add production fields based on user input
// document.getElementById('numProductions').addEventListener('input', function () {
//     const container = document.getElementById('productionsContainer');
//     container.innerHTML = '';  // Clear existing fields

//     const numProductions = parseInt(this.value);

//     if (isNaN(numProductions) || numProductions <= 0) return;

//     for (let i = 0; i < numProductions; i++) {
//         const label = document.createElement('label');
//         label.textContent = `Production ${i + 1} (e.g., E->E+T):`;

//         const input = document.createElement('input');
//         input.type = 'text';
//         input.placeholder = 'Enter production rule';
//         input.id = `prod${i}`;

//         container.appendChild(label);
//         container.appendChild(input);
//     }
// });

// // Function to check if the given grammar is CFG
// function isCFG(grammar) {
//     for (const rule of grammar) {
//         const parts = rule.split('->');

//         if (parts.length !== 2) {
//             return false;  // Invalid format
//         }

//         const lhs = parts[0].trim();
//         const rhs = parts[1].trim();

//         // Validate LHS: Ensure it is a single uppercase letter
//         if (lhs.length !== 1 || lhs < 'A' || lhs > 'Z') {
//             return false;
//         }

//         // Validate RHS: Ensure it is not empty
//         if (rhs.length === 0) {
//             return false;
//         }
//     }

//     return true;  // Passed all CFG checks
// }

// // Shift-Reduce Parser Logic
// function parse() {
//     const inputString = document.getElementById('inputString').value.trim();

//     const numProductions = parseInt(document.getElementById('numProductions').value);

//     if (!numProductions || !inputString) {
//         alert("Please enter valid productions and input string.");
//         return;
//     }

//     // Read productions
//     const grammar = [];
//     const productions = [];

//     for (let i = 0; i < numProductions; i++) {
//         const production = document.getElementById(`prod${i}`).value.trim();

//         if (!production.includes('->')) {
//             alert(`Invalid production format: ${production}`);
//             return;
//         }

//         const [lhs, rhs] = production.split('->').map(s => s.trim());
//         grammar.push({ lhs, rhs });
//         productions.push(production);
//     }

//     // Validate CFG
//     if (!isCFG(productions)) {
//         alert("The given grammar is NOT a Context-Free Grammar (CFG). Please provide a valid CFG.");
//         return;
//     }

//     const tableBody = document.querySelector('#outputTable tbody');
//     tableBody.innerHTML = '';

//     let stack = ['$'];  // Add $ to stack initially
//     let inputBuffer = (inputString + '$').split('');  // Add $ to input buffer
//     let i = 0;

//     function addRow(stack, input, action, isLastRow = false) {
//         const row = tableBody.insertRow();
//         row.insertCell(0).textContent = stack.join('') || 'ε';
//         row.insertCell(1).textContent = isLastRow ? '$' : input || 'ε';
//         row.insertCell(2).textContent = action;
//     }

//     // Initialize with the first character
//     stack.push(inputBuffer[i]);
//     addRow(stack, inputBuffer.slice(i + 1).join(''), `Shifted ${inputBuffer[i]}`);
//     i++;

//     const startSymbol = grammar[0].lhs;

//     while (i <= inputBuffer.length) {
//         let reduced = false;

//         // **Try reducing as long as possible**
//         while (true) {
//             let didReduce = false;

//             for (let k = 0; k < stack.length; k++) {
//                 let ts = stack.slice(k).join('');

//                 for (const { lhs, rhs } of grammar) {
//                     if (ts === rhs) {
//                         // Match found, reduce
//                         stack.splice(k);  // Remove the matched portion
//                         stack.push(lhs);  // Push the LHS
//                         addRow(stack, inputBuffer.slice(i).join(''), `Reduced ${rhs} -> ${lhs}`);

//                         // ✅ Immediate acceptance check
//                         if (stack.length === 2 && stack[1] === startSymbol && inputBuffer[i] === '$') {
//                             addRow(stack, '$', "String Accepted ✅", true);
//                             return;  // Stop further parsing
//                         }

//                         didReduce = true;
//                         break;
//                     }
//                 }

//                 if (didReduce) {
//                     reduced = true;
//                     break;  // Restart reduction process
//                 }
//             }

//             if (!didReduce) {
//                 break;  // No more reductions possible
//             }
//         }

//         // **Shift next character if any**
//         if (i < inputBuffer.length) {
//             stack.push(inputBuffer[i]);
//             addRow(stack, inputBuffer.slice(i + 1).join(''), `Shifted ${inputBuffer[i]}`);
//             i++;
//         } else {
//             break;  // Stop shifting when input string is exhausted
//         }
//     }

//     // **Final Acceptance Check**
//     if (stack.length === 2 && stack[1] === startSymbol && inputBuffer[i - 1] === '$') {
//         addRow(stack, '$', "String Accepted ✅", true);
//     } else {
//         addRow(stack, '$', "String Rejected ❌", true);
//     }
// }







//Updated
// Dynamically add production fields based on user input
document.getElementById('numProductions').addEventListener('input', function () {
    const container = document.getElementById('productionsContainer');
    container.innerHTML = '';  // Clear existing fields

    const numProductions = parseInt(this.value);
    if (isNaN(numProductions) || numProductions <= 0) return;

    for (let i = 0; i < numProductions; i++) {
        const label = document.createElement('label');
        label.textContent = `Production ${i + 1} (e.g., E->E+T):`;

        const input = document.createElement('input');
        input.type = 'text';
        input.placeholder = 'Enter production rule';
        input.id = `prod${i}`;

        container.appendChild(label);
        container.appendChild(input);
    }
});

// Tokenization: 'id' should be one token, everything else separately
function tokenize(input) {
    return input.match(/id|[^id]/g); // Treat 'id' as one token, others as single characters
}

// Function to check if the given grammar is CFG
function isCFG(grammar) {
    for (const rule of grammar) {
        const parts = rule.split('->');
        if (parts.length !== 2) return false; // Invalid format

        const lhs = parts[0].trim();
        const rhs = parts[1].trim();

        // LHS must be a single uppercase letter (e.g., 'E')
        if (lhs.length !== 1 || lhs < 'A' || lhs > 'Z') return false;

        // RHS must not be empty
        if (rhs.length === 0) return false;
    }
    return true;  // Passed all CFG checks
}

// Shift-Reduce Parser Logic
function parse() {
    const inputString = document.getElementById('inputString').value.trim();
    const numProductions = parseInt(document.getElementById('numProductions').value);

    if (!numProductions || !inputString) {
        alert("Please enter valid productions and input string.");
        return;
    }

    // Read productions
    const grammar = [];
    const productions = [];

    for (let i = 0; i < numProductions; i++) {
        const production = document.getElementById(`prod${i}`).value.trim();
        if (!production.includes('->')) {
            alert(`Invalid production format: ${production}`);
            return;
        }

        const [lhs, rhs] = production.split('->').map(s => s.trim());
        grammar.push({ lhs, rhs });
        productions.push(production);
    }

    // Validate CFG
    if (!isCFG(productions)) {
        alert("The given grammar is NOT a Context-Free Grammar (CFG). Please provide a valid CFG.");
        return;
    }

    const tableBody = document.querySelector('#outputTable tbody');
    tableBody.innerHTML = '';

    let stack = ['$'];  // Start with $
    let inputBuffer = tokenize(inputString);  // Properly tokenize input
    inputBuffer.push('$'); // Append end marker '$'
    let i = 0;

    function addRow(stack, input, action, isLastRow = false) {
        const row = tableBody.insertRow();
        row.insertCell(0).textContent = stack.join('') || 'ε';
        row.insertCell(1).textContent = isLastRow ? '$' : input || 'ε';
        row.insertCell(2).textContent = action;
    }

    // Initial Shift
    stack.push(inputBuffer[i]);
    addRow(stack, inputBuffer.slice(i + 1).join(''), `Shifted ${inputBuffer[i]}`);
    i++;

    const startSymbol = grammar[0].lhs;

    while (i < inputBuffer.length) {
        let reduced = false;

        // **Try reducing as long as possible**
        while (true) {
            let didReduce = false;

            for (let k = 0; k < stack.length; k++) {
                let topPortion = stack.slice(k).join('');

                for (const { lhs, rhs } of grammar) {
                    if (topPortion === rhs) {
                        // Match found, reduce
                        stack.splice(k);  // Remove the matched portion
                        stack.push(lhs);  // Push the LHS
                        addRow(stack, inputBuffer.slice(i).join(''), `Reduced ${rhs} -> ${lhs}`);

                        // ✅ Immediate acceptance check
                        if (stack.length === 2 && stack[1] === startSymbol && inputBuffer[i] === '$') {
                            addRow(stack, '$', "String Accepted ✅", true);
                            return;
                        }

                        didReduce = true;
                        break;
                    }
                }

                if (didReduce) {
                    reduced = true;
                    break;  // Restart reduction process
                }
            }

            if (!didReduce) break;  // No more reductions possible
        }

        // **Shift next token if any**
        if (i < inputBuffer.length) {
            stack.push(inputBuffer[i]);
            addRow(stack, inputBuffer.slice(i + 1).join(''), `Shifted ${inputBuffer[i]}`);
            i++;
        } else {
            break;
        }
    }

    // **Final Acceptance Check**
    if (stack.length === 2 && stack[1] === startSymbol && inputBuffer[i - 1] === '$') {
        addRow(stack, '$', "String Accepted ✅", true);
    } else {
        addRow(stack, '$', "String Rejected ❌", true);
    }
}
