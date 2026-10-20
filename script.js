const inventory = [];

const form = document.querySelector("form");
const inventorySection = document.querySelector("#inventory");

const dashboardCards = document.querySelectorAll(".card p");

const productNameInput = document.querySelector(
    'input[type="text"]'
);

const quantityInput = document.querySelector(
    'input[type="number"]'
);

const dateInputs = document.querySelectorAll(
    'input[type="date"]'
);

function getStatus(expiryDate) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const expiry = new Date(expiryDate + "T00:00:00");
    const difference = Math.round(
        (expiry - today) / (1000 * 60 * 60 * 24)
    );

    if (difference < 0) {
        return { text: "Past expiry date", days: difference };
    }

    if (difference <= 2) {
        return { text: "Urgent", days: difference };
    }

    if (difference <= 7) {
        return { text: "Expiring soon", days: difference };
    }

    return { text: "Good", days: difference };
}

function updateDashboard() {
    dashboardCards[0].textContent = inventory.length;

    dashboardCards[1].textContent = inventory.filter(item => {
        const status = getStatus(item.expiry);
        return status.days >= 0 && status.days <= 7;
    }).length;

    dashboardCards[2].textContent = inventory.filter(item => {
        return getStatus(item.expiry).days < 0;
    }).length;
}

function renderInventory() {
    inventorySection.innerHTML = `
        <h2>Current Inventory</h2>
        <div id="inventory-list"></div>
    `;

    const list = document.querySelector("#inventory-list");

    if (inventory.length === 0) {
        list.textContent = "No products added yet.";
        return;
    }

    inventory.forEach((item, index) => {
        const status = getStatus(item.expiry);

        const product = document.createElement("article");
        product.className = "card";

        const name = document.createElement("h3");
        name.textContent = item.name;

        const details = document.createElement("p");
        details.style.fontSize = "15px";
        details.textContent =
            `${item.quantity} ${item.unit} | ${item.category}`;

        const dates = document.createElement("p");
        dates.style.fontSize = "14px";
        dates.textContent =
            `Received: ${item.received} | Expiry: ${item.expiry}`;

        const statusText = document.createElement("p");
        statusText.style.fontSize = "16px";
        statusText.textContent = `Status: ${status.text}`;

        const removeButton = document.createElement("button");
        removeButton.textContent = "Remove";
        removeButton.type = "button";

        removeButton.addEventListener("click", () => {
            inventory.splice(index, 1);
            renderInventory();
            updateDashboard();
        });

        product.append(name, details, dates, statusText, removeButton);
        list.appendChild(product);
    });
}

form.addEventListener("submit", event => {
    event.preventDefault();

    const name = productNameInput.value.trim();
    const category = form.querySelector("select").value;
    const quantity = Number(quantityInput.value);
    const unit = form.querySelectorAll("select")[1].value;
    const received = dateInputs[0].value;
    const expiry = dateInputs[1].value;

    if (!name || !category || quantity <= 0 || !received || !expiry) {
        alert("Please complete all fields correctly.");
        return;
    }

    if (expiry < received) {
        alert("The expiry date cannot be earlier than the received date.");
        return;
    }

    inventory.push({
        name,
        category,
        quantity,
        unit,
        received,
        expiry
    });

    form.reset();
    renderInventory();
    updateDashboard();
});

renderInventory();
updateDashboard();
