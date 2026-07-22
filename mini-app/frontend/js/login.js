async function login() {

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    try {

        const response = await fetch(`${BASE_URL}/login`, {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                username,
                password
            })

        });

        const result = await response.json();

        if (!response.ok) {

            document.getElementById("message").innerText =
                result.message;

            return;
        }

        localStorage.setItem(
            "token",
            result.token
        );

        window.location.href = "dashboard.html";

    } catch (err) {

        document.getElementById("message").innerText =
            "Cannot connect to backend.";

    }

}
