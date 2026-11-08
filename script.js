const currentOperand = document.querySelector("#current-operand");
const previousOperand = document.querySelector("#previous-operand");

let current = "0";
let previous = null;
let operator = null;
let shouldReset = false;

function render() {
  currentOperand.textContent = current;
  previousOperand.textContent = previous === null ? "" : `${previous} ${operator ?? ""}`;
}

function appendDigit(digit) {
  if (current === "Error" || shouldReset) {
    current = digit;
    shouldReset = false;
  } else if (current === "0") {
    current = digit;
  } else if (current.replace(/[^0-9]/g, "").length < 15) {
    current += digit;
  }
  render();
}

function appendDecimal() {
  if (current === "Error" || shouldReset) {
    current = "0.";
    shouldReset = false;
  } else if (!current.includes(".")) {
    current += ".";
  }
  render();
}

function calculate(left, right, op) {
  const a = Number(left);
  const b = Number(right);
  let result;

  switch (op) {
    case "+": result = a + b; break;
    case "−": result = a - b; break;
    case "×": result = a * b; break;
    case "÷":
      if (b === 0) return null;
      result = a / b;
      break;
    default: return b;
  }

  return Number.isFinite(result) ? Number.parseFloat(result.toPrecision(12)).toString() : null;
}

function chooseOperator(nextOperator) {
  if (current === "Error") return;
  if (operator && !shouldReset) {
    const result = calculate(previous, current, operator);
    if (result === null) {
      current = "Error";
      previous = null;
      operator = null;
      shouldReset = true;
      render();
      return;
    }
    current = result;
  }
  previous = current;
  operator = nextOperator;
  shouldReset = true;
  render();
}

function equals() {
  if (operator === null || previous === null || current === "Error") return;
  const result = calculate(previous, current, operator);
  if (result === null) {
    current = "Error";
  } else {
    current = result;
  }
  previous = null;
  operator = null;
  shouldReset = true;
  render();
}

function clear() {
  current = "0";
  previous = null;
  operator = null;
  shouldReset = false;
  render();
}

function deleteLast() {
  if (current === "Error" || shouldReset) {
    current = "0";
    shouldReset = false;
  } else {
    current = current.length > 1 ? current.slice(0, -1) : "0";
    if (current === "-" || current === "") current = "0";
  }
  render();
}

document.querySelector(".keys").addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;

  if (button.dataset.digit !== undefined) appendDigit(button.dataset.digit);
  else if (button.dataset.operator) chooseOperator(button.dataset.operator);
  else if (button.dataset.action === "decimal") appendDecimal();
  else if (button.dataset.action === "clear") clear();
  else if (button.dataset.action === "delete") deleteLast();
  else if (button.dataset.action === "equals") equals();
});

document.addEventListener("keydown", (event) => {
  if (/^[0-9]$/.test(event.key)) appendDigit(event.key);
  else if (event.key === ".") appendDecimal();
  else if (event.key === "+") chooseOperator("+");
  else if (event.key === "-") chooseOperator("−");
  else if (event.key === "*" || event.key.toLowerCase() === "x") chooseOperator("×");
  else if (event.key === "/") {
    event.preventDefault();
    chooseOperator("÷");
  } else if (event.key === "Enter" || event.key === "=") equals();
  else if (event.key === "Backspace") deleteLast();
  else if (event.key === "Escape") clear();
});

render();
