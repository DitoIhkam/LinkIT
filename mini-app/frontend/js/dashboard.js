const token = localStorage.getItem("token");

if (!token) {
    window.location.href = "login.html";
}

loadProfile();
loadCoffee();
loadTransactions();

async function loadProfile() {
    try {
        const response = await fetch(
            `${BASE_URL}/profile`,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        if (!response.ok) {
            throw new Error("Failed to load profile");
        }

        const user = await response.json();

        document.getElementById("username").innerText =
            `${user.username} (${user.role})`;

    } catch (error) {
        console.error(error);
    }
}

async function loadCoffee() {
    const coffeeList = document.getElementById("coffee-list");
    const search = document.getElementById("search").value;

    coffeeList.innerHTML = "Loading...";

    try {
        const response = await fetch(
            `${BASE_URL}/coffees?search=${encodeURIComponent(search)}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        if (response.status === 401) {
            logout();
            return;
        }

        if (!response.ok) {
            throw new Error("Failed to load coffee");
        }

        const result = await response.json();

        if (!result.data || result.data.length === 0) {
            coffeeList.innerHTML = "<p>No coffee found.</p>";
            return;
        }

        let html = "";

        result.data.forEach((coffee) => {
            html += `
                <div style="border:1px solid #ddd;padding:15px;margin-bottom:15px">
                    <img
                        src="${coffee.image}"
                        alt="${coffee.title}"
                        width="120"
                    >

                    <h3>${coffee.title}</h3>

                    <p>${coffee.description}</p>

                    <button onclick="selectCoffee(${coffee.id}, '${escapeText(coffee.title)}')">
                        Buy
                    </button>
                </div>
            `;
        });

        coffeeList.innerHTML = html;

    } catch (error) {
        console.error(error);
        coffeeList.innerHTML = "<p>Failed to load coffee.</p>";
    }
}

async function importCoffee() {
    const btn = document.getElementById("importBtn");

    btn.disabled = true;
    btn.innerText = "Importing...";

    try {
        const response = await fetch(
            `${BASE_URL}/coffees/import`,
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || "Import failed");
        }

        alert(`Import Success. Total: ${result.total}`);

        await loadCoffee();

    } catch (error) {
        console.error(error);
        alert(error.message);

    } finally {
        btn.disabled = false;
        btn.innerText = "Import Coffee";
    }
}

function selectCoffee(coffeeId, coffeeTitle) {
    document.getElementById("coffeeId").value = coffeeId;
    document.getElementById("selectedCoffee").innerText = coffeeTitle;
    document.getElementById("qty").value = 1;
    document.getElementById("notes").value = "";

    document.getElementById("transaction-form").scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
}

async function submitTransaction() {
    const coffeeId = Number(
        document.getElementById("coffeeId").value
    );

    const qty = Number(
        document.getElementById("qty").value
    );

    const notes = document.getElementById("notes").value.trim();

    if (!coffeeId) {
        alert("Please choose a coffee first.");
        return;
    }

    if (!Number.isInteger(qty) || qty < 1) {
        alert("Quantity must be at least 1.");
        return;
    }

    try {
        const response = await fetch(
            `${BASE_URL}/transactions`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    coffeeId,
                    qty,
                    notes
                })
            }
        );

        const result = await response.json();

        if (!response.ok) {
            throw new Error(
                result.message || "Failed to create transaction"
            );
        }

        alert("Transaction Success");

        resetTransactionForm();
        await loadTransactions();

    } catch (error) {
        console.error(error);
        alert(error.message);
    }
}

function resetTransactionForm() {
    document.getElementById("coffeeId").value = "";
    document.getElementById("selectedCoffee").innerText =
        "No coffee selected";
    document.getElementById("qty").value = "";
    document.getElementById("notes").value = "";
}

async function loadTransactions() {
    const transactionList =
        document.getElementById("transaction-list");

    transactionList.innerHTML = "Loading transactions...";

    try {
        const response = await fetch(
            `${BASE_URL}/transactions`,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        if (response.status === 401) {
            logout();
            return;
        }

        if (!response.ok) {
            throw new Error("Failed to load transactions");
        }

        const transactions = await response.json();

        if (transactions.length === 0) {
            transactionList.innerHTML =
                "<p>No transactions available.</p>";
            return;
        }

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

        transactions.forEach((trx) => {
            html += `
                <tr>
                    <td>${trx.id}</td>
                    <td>${trx.coffee.title}</td>
                    <td>${trx.qty}</td>
                    <td>${trx.notes || "-"}</td>
                    <td>${new Date(trx.createdAt).toLocaleString()}</td>
                    <td>
                        <button onclick="editTransaction(${trx.id}, ${trx.qty}, '${escapeText(trx.notes || "")}')">
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

        transactionList.innerHTML = html;

    } catch (error) {
        console.error(error);
        transactionList.innerHTML =
            "<p>Failed to load transactions.</p>";
    }
}

async function editTransaction(
    id,
    currentQty,
    currentNotes
) {
    const qtyInput = prompt(
        "New Quantity:",
        currentQty
    );

    if (qtyInput === null) {
        return;
    }

    const qty = Number(qtyInput);

    if (!Number.isInteger(qty) || qty < 1) {
        alert("Quantity must be at least 1.");
        return;
    }

    const notes = prompt(
        "Notes:",
        currentNotes
    );

    if (notes === null) {
        return;
    }

    try {
        const response = await fetch(
            `${BASE_URL}/transactions/${id}`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    qty,
                    notes
                })
            }
        );

        const result = await response.json();

        if (!response.ok) {
            throw new Error(
                result.message || "Failed to update transaction"
            );
        }

        alert("Transaction Updated");
        await loadTransactions();

    } catch (error) {
        console.error(error);
        alert(error.message);
    }
}

async function deleteTransaction(id) {
    const confirmDelete = confirm(
        "Delete this transaction?"
    );

    if (!confirmDelete) {
        return;
    }

    try {
        const response = await fetch(
            `${BASE_URL}/transactions/${id}`,
            {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        const result = await response.json();

        if (!response.ok) {
            throw new Error(
                result.message || "Failed to delete transaction"
            );
        }

        alert("Transaction Deleted");
        await loadTransactions();

    } catch (error) {
        console.error(error);
        alert(error.message);
    }
}

function escapeText(value) {
    return String(value)
        .replaceAll("\\", "\\\\")
        .replaceAll("'", "\\'")
        .replaceAll("\n", " ");
}

function logout() {
    localStorage.removeItem("token");
    window.location.href = "login.html";
}