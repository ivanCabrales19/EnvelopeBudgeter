const budgetForm = document.getElementById("budget-form");
const incomeInput = document.getElementById("income");
const rentInput = document.getElementById("rent-amount");
const entryDropdown = document.getElementById("entry-dropdown");
const addEntryButton = document.getElementById("add-entry");
const clearButton = document.getElementById("clear");
const output = document.getElementById("output");
let isError = false;

function cleanInputString(str) {
  const regex = /[+-\s]/g;
  return str.replace(regex, "");
}

function isInvalidInput(str) {
  const regex = /\d+e\d+/i;
  return str.match(regex);
}

function addEntry() {
  const category = entryDropdown.value;
  const targetInputContainer = document.querySelector(`#${category} .input-container`);
  const entryNumber = targetInputContainer.querySelectorAll('input[type="text"]').length + 1;

  const HTMLString = `
    <div class="entry-item">
      <label for="${category}-${entryNumber}-name">Gasto ${entryNumber} Nombre</label>
      <input type="text" id="${category}-${entryNumber}-name" placeholder="Nombre" />
      <label for="${category}-${entryNumber}-amount">Gasto ${entryNumber} Cantidad</label>
      <input 
        type="number" 
        min="0" 
        id="${category}-${entryNumber}-amount" placeholder="Cantidad" 
      />
      <button type="button" class="remove-entry">Eliminar</button>
    </div>`;

  targetInputContainer.insertAdjacentHTML("beforeend", HTMLString);
}

function calculateBudget(e) {
  e.preventDefault();
  isError = false;

  const foodInputs = document.querySelectorAll("#food input[type='number']");
  const utilitiesInputs = document.querySelectorAll("#utilities input[type='number']");
  const entertainmentInputs = document.querySelectorAll("#entertainment input[type='number']");

  const rent = getTotalFromInputs([rentInput]);
  const food = getTotalFromInputs(foodInputs);
  const utilities = getTotalFromInputs(utilitiesInputs);
  const entertainment = getTotalFromInputs(entertainmentInputs);
  const income = getTotalFromInputs([incomeInput]);

  if (isError) {
    return;
  }

  const expenses = rent + food + utilities + entertainment;
  const netRemaining = income - expenses;

  let statusText = "";
  let statusClass = "";

  if (netRemaining < 0) {
    statusText = `Over Budget by $${Math.abs(netRemaining)}`;
    statusClass = "deficit";
  } else {
    statusText = `$${netRemaining} Restante`;
    statusClass = "surplus";
  }

  output.innerHTML = `
    <span class="${statusClass}">${statusText}</span>
    <hr>
    <p>$${income} Total Ingreso</p>
    <p>$${expenses} Total Gastos</p>
  `;

  output.classList.remove("hide");
}

function getTotalFromInputs(list) {
  let total = 0;

  for (const item of list) {
    const currVal = cleanInputString(item.value);
    const invalidInputMatch = isInvalidInput(currVal);

    if (invalidInputMatch) {
      alert(`Invalid Input: ${invalidInputMatch[0]}`);
      isError = true;
      return null;
    }
    total += Number(currVal);
  }
  return total;
}

function clearForm() {
  const inputContainers = Array.from(document.querySelectorAll(".input-container"));

  for (const container of inputContainers) {
    container.innerHTML = "";
  }

  incomeInput.value = "";
  rentInput.value = "";
  output.innerText = "";
  output.classList.add("hide");
}

addEntryButton.addEventListener("click", addEntry);
document.addEventListener("click", (event) => {
  if (event.target.classList.contains("remove-entry")) {
    const entryItem = event.target.closest(".entry-item");
    if (entryItem) {
      entryItem.remove();
    }
  }
});
budgetForm.addEventListener("submit", calculateBudget);
clearButton.addEventListener('click', clearForm)