// Visual demonstration only. No wallet providers, RPC requests, signatures or transactions.
const dialog = document.querySelector("#wallet-dialog");
const connectButton = document.querySelector("#connect-wallet");
const operationInputs = [
  ...document.querySelectorAll('input[name="operation"]'),
];
const confirmation = document.querySelector("#confirm-demo");
const reviewButton = document.querySelector("#review-operation");
const simulateButton = document.querySelector("#simulate-cancel");
const status = document.querySelector("#flow-status");
const views = [...document.querySelectorAll(".view")];
const steps = [...document.querySelectorAll(".step")];
const demoOperations = {
  transfer: { name: "Envío de activos", id: "DEMO-001", amount: "0,05 ETH" },
  contract: {
    name: "Interacción con contrato",
    id: "DEMO-002",
    amount: "0 ETH",
  },
};
let activeView = "connect";
let selectedOperation = null;

function showView(name, step, message) {
  activeView = name;
  views.forEach((view) => {
    view.hidden = view.id !== `${name}-view`;
  });
  steps.forEach((element, index) => {
    const position = index + 1;
    const done = position < step || name === "success";
    element.classList.toggle("active", position === step && !done);
    element.classList.toggle("done", done);
    if (position === step && !done)
      element.setAttribute("aria-current", "step");
    else element.removeAttribute("aria-current");
    const number = element.querySelector(".step-number");
    if (done)
      number.innerHTML =
        '<svg class="icon" aria-hidden="true"><use href="#i-check"/></svg><span class="sr-only">Completado</span>';
    else number.textContent = position;
  });
  status.textContent = message;
  document.querySelector(`#${name}-title`).focus();
}

function resetDemo() {
  selectedOperation = null;
  operationInputs.forEach((input) => {
    input.checked = false;
  });
  confirmation.checked = false;
  reviewButton.disabled = true;
  simulateButton.disabled = true;
  if (dialog.open) dialog.close();
  showView(
    "connect",
    1,
    "Demostración reiniciada. Puedes elegir una billetera de ejemplo.",
  );
  connectButton.focus();
}

connectButton.addEventListener("click", () => dialog.showModal());
document
  .querySelector("#close-dialog")
  .addEventListener("click", () => dialog.close());
dialog.addEventListener("click", (event) => {
  if (event.target !== dialog) return;
  const bounds = dialog.getBoundingClientRect();
  if (
    event.clientX < bounds.left ||
    event.clientX > bounds.right ||
    event.clientY < bounds.top ||
    event.clientY > bounds.bottom
  )
    dialog.close();
});
dialog.querySelectorAll("[data-demo-wallet]").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelector("#demo-wallet-type").textContent =
      `${button.dataset.demoWallet} · simulación`;
    dialog.close();
    showView(
      "operation",
      2,
      "Billetera de ejemplo seleccionada. Elige una operación ficticia.",
    );
  });
});
operationInputs.forEach((input) => {
  input.addEventListener("change", () => {
    selectedOperation = demoOperations[input.value] || null;
    reviewButton.disabled = !selectedOperation;
  });
});
reviewButton.addEventListener("click", () => {
  if (activeView !== "operation" || !selectedOperation) return;
  document.querySelector("#review-name").textContent = selectedOperation.name;
  document.querySelector("#review-id").textContent = selectedOperation.id;
  document.querySelector("#review-amount").textContent =
    selectedOperation.amount;
  confirmation.checked = false;
  simulateButton.disabled = true;
  showView(
    "review",
    3,
    `Revisa los datos de ejemplo de ${selectedOperation.id}.`,
  );
});
confirmation.addEventListener("change", () => {
  simulateButton.disabled = !confirmation.checked;
});
document.querySelector("#back-operations").addEventListener("click", () => {
  confirmation.checked = false;
  simulateButton.disabled = true;
  showView("operation", 2, "Puedes seleccionar otra operación de ejemplo.");
});
simulateButton.addEventListener("click", () => {
  if (activeView !== "review" || !selectedOperation || !confirmation.checked)
    return;
  document.querySelector("#completed-operation").textContent =
    `${selectedOperation.id} · ${selectedOperation.name}`;
  showView(
    "success",
    3,
    "Recorrido de demostración completado. No se ha realizado ninguna operación real.",
  );
});
document
  .querySelectorAll(".reset-demo")
  .forEach((button) => button.addEventListener("click", resetDemo));
