let display = document.getElementById('display');
let historyPanel = document.getElementById('history-panel');
let historyList = document.getElementById('history-list');
let degBtn = document.getElementById('deg-btn');
let history = [];
let isDegree = true;
let isFraction = false; // Flag to toggle between fraction and decimal
let maxInputLength = 50; // Max number of characters to avoid overflow

// Functions to append values, operators, and constants
function appendValue(value) {
    // Prevent the input from getting too long
    if (display.value.length < maxInputLength) {
        display.value += value;
    }
    ensureCursorVisible();
}

function appendTrig(func) {
    display.value += `${func}(`;
    ensureCursorVisible();
}

function appendFunc(func) {
    if (func === 'sqrt') {
        display.value += `Math.sqrt(`;
    } else if (func === 'log') {
        display.value += `Math.log10(`;
    } else if (func === 'ln') {
        display.value += `Math.log(`;
    }
    ensureCursorVisible();
}

function appendConst(constant) {
    if (constant === 'Math.PI') {
        display.value += Math.PI; // This will insert the value of π
    } else if (constant === 'Math.E') {
        display.value += Math.E; // This will insert the value of e
    }
    ensureCursorVisible();
}

function appendOperator(op) {
    display.value += op;
    ensureCursorVisible();
}

function clearDisplay() {
    display.value = '';
    ensureCursorVisible();
}

function deleteLast() {
    display.value = display.value.slice(0, -1);
    ensureCursorVisible();
}

// Factorial Function
function appendFactorial() {
    display.value += '!';
    ensureCursorVisible();
}

// Permutation Function
function appendPermutation() {
    display.value += 'P';
    ensureCursorVisible();
}

// Combination Function
function appendCombination() {
    display.value += 'C';
    ensureCursorVisible();
}

// Toggle between degree and radian mode
function toggleDegMode() {
    isDegree = !isDegree;
    
    // Change button appearance based on the mode
    degBtn.classList.toggle('active', isDegree);
    degBtn.classList.toggle('inactive', !isDegree);
    
    degBtn.textContent = isDegree ? 'DEG' : 'RAD'; // Update button label
}

// Function to calculate result
function calculate() {
    try {
        let expression = display.value;
        
        // Handling factorial (!)
        if (expression.includes('!')) {
            let num = parseInt(expression.replace('!', ''));
            if (isNaN(num)) {
                throw new Error('Invalid factorial input');
            }
            let result = factorial(num);
            display.value = result;
            
            // Handling Permutation (nPr)
        } else if (expression.includes('P')) {
            let [n, r] = expression.split('P').map(Number);
            let result = calculatePermutation(n, r);
            display.value = result;
            
            // Handling Combination (nCr)
        } else if (expression.includes('C')) {
            let [n, r] = expression.split('C').map(Number);
            let result = calculateCombination(n, r);
            display.value = result;
            
            // Regular calculations
        } else {
            let result = evaluateExpression(expression);
            result = Math.round(result * 1e6) / 1e6; // Round to 6 decimal places
            display.value = result;
        }
        
        history.push(`${expression} = ${display.value}`);
        updateHistory();
    } catch (err) {
        display.value = 'Error';
    }
}

// Evaluate the expression with trigonometric functions
function evaluateExpression(expression) {
    expression = expression
        .replace(/sin([^)]+)/g, (_, angle) => `sin(${angle})`)
        .replace(/cos([^)]+)/g, (_, angle) => `cos(${angle})`)
        .replace(/tan([^)]+)/g, (_, angle) => `tan(${angle})`)
        .replace(/sin⁻¹([^)]+)/g, (_, value) => `asin(${value})`)
        .replace(/cos⁻¹([^)]+)/g, (_, value) => `acos(${value})`)
        .replace(/tan⁻¹([^)]+)/g, (_, value) => `atan(${value})`)
        .replace(/\^/g, '**'); // Replace ^ with ** for power operation
    
    return eval(expression);
}

// Update history display
function updateHistory() {
    historyList.innerHTML = '';
    history.slice().reverse().forEach(item => {
        let li = document.createElement('li');
        li.textContent = item;
        historyList.appendChild(li);
    });
}

// Toggle history panel visibility
function toggleHistory() {
    historyPanel.classList.toggle('hidden');
}

// Toggle dropdown for trigonometric functions
function toggleDropdown() {
    document.querySelector('.dropdown').classList.toggle('show');
}

// Convert decimal to fraction and vice versa
function toggleFraction() {
    let value = display.value;
    
    if (isFraction) {
        // Convert fraction to decimal
        if (value.includes('/')) {
            let [numerator, denominator] = value.split('/');
            display.value = (parseFloat(numerator) / parseFloat(denominator)).toString();
        }
    } else {
        // Convert decimal to fraction
        if (!value.includes('/')) {
            let decimalValue = parseFloat(value);
            if (isNaN(decimalValue)) {
                return; // Only convert if it's a valid number
            }
            
            let fraction = decimalToFraction(decimalValue);
            display.value = `${fraction.numerator}/${fraction.denominator}`;
        }
    }
    
    isFraction = !isFraction; // Toggle the flag
    ensureCursorVisible();
}

// Convert decimal to fraction
function decimalToFraction(decimal) {
    let denominator = 1;
    let numerator = decimal;
    
    while (numerator % 1 !== 0) {
        numerator *= 10;
        denominator *= 10;
    }
    
    let gcd = greatestCommonDivisor(numerator, denominator);
    numerator /= gcd;
    denominator /= gcd;
    
    return { numerator, denominator };
}

// Calculate the greatest common divisor (GCD) of two numbers
function greatestCommonDivisor(a, b) {
    return b === 0 ? a : greatestCommonDivisor(b, a % b);
}

// Ensure cursor is visible while typing large numbers
function ensureCursorVisible() {
    display.scrollLeft = display.scrollWidth; // Scroll input field to the right to keep the cursor visible
}