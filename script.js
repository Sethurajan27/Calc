const display = document.getElementById('display');
const historyPanel = document.getElementById('history-panel');
const historyList = document.getElementById('history-list');
let history = [];
let isFraction = false;
let isDegree = true; // Boolean variable for degree/radian mode
const maxInputLength = 50;

const degreeRadianBtn = document.querySelector('.degree-radian-btn');

// Append Functions
function appendValue(value) {
  if (display.value.length < maxInputLength) {
    display.value += value;
  }
  ensureCursorVisible();
}

function appendFunc(func) {
  if (func === 'sqrt') display.value += '√(';
  else if (func === 'log') display.value += 'log(';
  else if (func === 'ln') display.value += 'ln(';
  ensureCursorVisible();
}

function appendConst(constant) {
  if (constant === 'Math.PI') display.value += Math.PI;
  else if (constant === 'Math.E') display.value += Math.E;
  ensureCursorVisible();
}

function appendOperator(op) {
  display.value += op;
  ensureCursorVisible();
}

function appendTrigFunc(func) {
  if (func === 'sin' || func === 'cos' || func === 'tan' || func === 'sin⁻¹' || func === 'cos⁻¹' || func === 'tan⁻¹') {
    display.value += func + '(';
  }
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

function appendFactorial() {
  display.value += '!';
  ensureCursorVisible();
}

function appendPermutation() {
  display.value += 'P';
  ensureCursorVisible();
}

function appendCombination() {
  display.value += 'C';
  ensureCursorVisible();
}

function calculate() {
  try {
    let expression = display.value;
    
    // Handle log and ln as Math.log10 and Math.log respectively
    expression = expression.replace(/log/g, 'Math.log10');
    expression = expression.replace(/ln/g, 'Math.log');
    expression = expression.replace(/√/g, 'Math.sqrt');
    
    // Handle trigonometric functions (degree/radian adjustment)
    if (isDegree) {
      if (expression.includes('sin(')) {
        expression = expression.replace(/sin([^)]+)/g, 'Math.sin(degToRad$1)');
        display.value = expression;
      }
      if (expression.includes('cos(')) {
        expression = expression.replace(/cos([^)]+)/g, 'Math.cos(degToRad$1)');
      }
      if (expression.includes('tan(')) {
        expression = expression.replace(/tan([^)]+)/g, 'Math.tan(degToRad$1)');
      }
      if (expression.includes('sin⁻¹(')) {
        expression = expression.replace(/sin⁻¹([^)]+)/g, 'radToDeg(Math.asin$1)');
      }
      if (expression.includes('cos⁻¹(')) {
        expression = expression.replace(/cos⁻¹([^)]+)/g, 'radToDeg(Math.acos$1)');
      }
      if (expression.includes('tan⁻¹(')) {
        expression = expression.replace(/tan⁻¹([^)]+)/g, 'radToDeg(Math.atan$1)');
      }
    } else {
      if (expression.includes('sin')) {
        expression = expression.replace(/sin/g, 'Math.sin');
        display.value = expression;
      }
      if (expression.includes('cos')) {
        expression = expression.replace(/cos/g, 'Math.cos');
      }
      if (expression.includes('tan')) {
        expression = expression.replace(/tan/g, 'Math.tan');
      }
      if (expression.includes('sin⁻¹')) {
        expression = expression.replace(/sin⁻¹/g, 'asin');
      }
      if (expression.includes('cos⁻¹')) {
        expression = expression.replace(/cos⁻¹/g, 'acos');
      }
      if (expression.includes('tan⁻¹')) {
        expression = expression.replace(/tan⁻¹/g, 'atan');
      }
    }
    // Handle factorial, permutation, and combination
    if (expression.includes('!')) {
      expression = expression.replace(/(\d+)!/g, (_, n) => factorial(Number(n)));
    }
    if (expression.includes('P')) {
      expression = expression.replace(/(\d+)P(\d+)/g, (_, n, r) => calculatePermutation(Number(n), Number(r)));
    }
    if (expression.includes('C')) {
      expression = expression.replace(/(\d+)C(\d+)/g, (_, n, r) => calculateCombination(Number(n), Number(r)));
    }
    {
      let result = evaluateExpression(expression);
      result = Math.round(result * 1e6) / 1e6;
      display.value = result;
    }
    
    history.push(`${expression} = ${display.value}`);
    updateHistory();
  } catch (err) {
    display.value = err.name;
  }
}

function evaluateExpression(expression) {
  expression = expression.replace(/\^/g, '**'); // Handle power operator
  return eval(expression);
}

function factorial(n) {
  return n <= 1 ? 1 : n * factorial(n - 1);
}

function calculatePermutation(n, r) {
  return factorial(n) / factorial(n - r);
}

function calculateCombination(n, r) {
  return factorial(n) / (factorial(r) * factorial(n - r));
}

function updateHistory() {
  historyList.innerHTML = '';
  history.slice().reverse().forEach(item => {
    const li = document.createElement('li');
    li.textContent = item;
    historyList.appendChild(li);
  });
}

function toggleHistory() {
  historyPanel.classList.toggle('hidden');
}

function toggleFraction() {
  let value = display.value;
  
  if (isFraction) {
    if (value.includes('/')) {
      let [numerator, denominator] = value.split('/');
      display.value = (parseFloat(numerator) / parseFloat(denominator)).toString();
    }
  } else {
    if (!value.includes('/')) {
      let decimalValue = parseFloat(value);
      if (isNaN(decimalValue)) return;
      
      let fraction = decimalToFraction(decimalValue);
      display.value = `${fraction.numerator}/${fraction.denominator}`;
    }
  }
  
  isFraction = !isFraction;
  ensureCursorVisible();
}

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

function greatestCommonDivisor(a, b) {
  return b === 0 ? a : greatestCommonDivisor(b, a % b);
}

function ensureCursorVisible() {
  display.scrollLeft = display.scrollWidth;
}

function degToRad(degrees) {
  return degrees * (Math.PI / 180);
}

function radToDeg(radian) {
  return radian * (180 / Math.PI);
}
// Toggle dropdown for trigonometric functions
function toggleDropdown() {
  document.querySelector('.dropdown').classList.toggle('show');
}

function toggleMode() {
  isDegree = !isDegree; // Toggle between degree and radian
  degreeRadianBtn.textContent = isDegree ? 'Degree' : 'Radian'; // Update button text
  degreeRadianBtn.classList.toggle('active', isDegree); // Toggle active class
}