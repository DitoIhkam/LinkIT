const token = localStorage.getItem("token");
async function loadProfile() {

    const response = await fetch(

        `${BASE_URL}/profile`,

        {
            headers:{
                Authorization:`Bearer ${token}`
            }
        }

    );

    const user = await response.json();

    document.getElementById("username").innerHTML =
        `${user.username} (${user.role})`;

}
if (!token) {
    window.location.href = "login.html";
}

loadProfile();
loadCoffee();
loadTransactions();

async function loadCoffee() {

    const search = document.getElementById("search").value;

    const response = await fetch(
        `${BASE_URL}/coffees?search=${search}`,
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );

    const result = await response.json();

    let html = "";

    result.data.forEach(coffee => {

        html += `
            <div style="border:1px solid #ddd;padding:15px;margin-bottom:15px">

                <img
                    src="${coffee.image}"
                    width="120"
                >

                <h3>${coffee.title}</h3>

                <p>${coffee.description}</p>

                <button onclick="createTransaction(${coffee.id})">
                    Buy
                </button>

            </div>
        `;

    });

    document.getElementById("coffee-list").innerHTML = html;

}

async function importCoffee() {

    const btn = document.getElementById("importBtn");

    btn.disabled = true;
    btn.innerText = "Importing...";

    await fetch(

        `${BASE_URL}/coffees/import`,

        {

            method:"POST",

            headers:{
                Authorization:`Bearer ${token}`
            }

        }

    );

    btn.disabled = false;
    btn.innerText = "Import Coffee";

    loadCoffee();

    alert("Import Success");

    loadCoffee();

}

async function createTransaction(coffeeId) {

    const qty = prompt("Quantity?");
    const notes = prompt("Notes (optional)");
    if (!confirm(`Buy ${qty} coffee?`)) {
    return;
}

    await fetch(
        `${BASE_URL}/transactions`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({

                coffeeId,
                qty:Number(qty),
                notes

})
        }
    );

    alert("Transaction Success");

    loadTransactions();

}

async function loadTransactions() {

    document.getElementById("coffee-list").innerHTML =
    "Loading...";
    const response = await fetch(
        `${BASE_URL}/transactions`,
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );

    const transactions = await response.json();

    let html = `
    <table border="1" cellpadding="8" cellspacing="0" width="100%">
        <tr>
            <th>ID</th>
            <th>Coffee</th>
            <th>Qty</th>
            <th>Notes</th>
            <th>Date</th>
            <th>Action</th>
        </tr>
    `;

    transactions.forEach(trx => {

        html += `
        <tr>
            <td>${trx.id}</td>
            <td>${trx.coffee.title}</td>
            <td>${trx.qty}</td>
            <td>${trx.notes || "-"}</td>
            <td>${new Date(trx.createdAt).toLocaleString()}</td>
            <td>
                <button onclick="editTransaction(${trx.id}, ${trx.qty})">
                    Edit
                </button>

                <button onclick="deleteTransaction(${trx.id})">
                    Delete
                </button>
            </td>
        </tr>
        `;

    });

    html += "</table>";

    document.getElementById("transaction-list").innerHTML = html;

}

async function editTransaction(id, currentQty) {

    const qty = prompt("New Quantity:", currentQty);

    if (!qty) return;

    const notes = prompt("Notes (optional):", "");

    await fetch(
        `${BASE_URL}/transactions/${id}`,
        {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
                qty: Number(qty),
                notes
            })
        }
    );

    alert("Transaction Updated");

    loadTransactions();

}

async function deleteTransaction(id) {

    const confirmDelete = confirm("Delete this transaction?");

    if (!confirmDelete) return;

    await fetch(
        `${BASE_URL}/transactions/${id}`,
        {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );

    alert("Transaction Deleted");

    loadTransactions();

}

function logout() {

    localStorage.removeItem("token");

    window.location.href = "login.html";

}