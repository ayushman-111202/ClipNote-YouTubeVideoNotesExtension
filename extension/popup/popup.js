document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("login-form");
    const authMessage = document.getElementById("auth-message");
    const authSection = document.getElementById("auth-section");
    const userInfoSection = document.getElementById("user-info");
    const usernameSpan = document.getElementById("username");
    const logoutBtn = document.getElementById("logout-btn");

    // Configurable API base URL - use environment variable or default to localhost
    const API_BASE = "http://localhost:5000"; 
    console.log(`Using API base: ${API_BASE}`);

    // Check authentication status on load
    checkAuthStatus();

    // Login form submission handler
    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        authMessage.textContent = "Authenticating...";
        authMessage.style.color = "white";

        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value;
        const role = document.getElementById("role").value;

        if (!email || !password || !role) {
            authMessage.textContent = "Please fill all fields";
            authMessage.style.color = "red";
            return;
        }

        try {
            console.log("Attempting login...");
            const response = await fetch(`${API_BASE}/users/authenticate`, {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify({ email, password, role }),
            });

            console.log(`Response status: ${response.status}`);
            
            if (!response.ok) {
                const errorData = await response.json();
                console.error("Login failed:", errorData);
                throw new Error(errorData.message || "Login failed");
            }

            const result = await response.json();
            console.log("Login successful, token received");

            // Store token and update UI
            chrome.storage.local.set({ token: result.token }, () => {
                authMessage.textContent = "Login successful! Redirecting...";
                authMessage.style.color = "limegreen";
                loginForm.reset();

                // Refresh to show user info
                setTimeout(() => {
                    checkAuthStatus(true);
                }, 800);
            });
        } catch (error) {
            console.error("Login error:", error);
            authMessage.textContent = error.message || "Error connecting to server";
            authMessage.style.color = "red";
            
            // Additional debug info
            fetch(`${API_BASE}/health`)
                .then(res => res.json())
                .then(data => console.log("Server health:", data))
                .catch(err => console.error("Server health check failed:", err));
        }
    });

    // Logout button handler
    logoutBtn.addEventListener("click", () => {
        chrome.storage.local.remove(["token", "user"], () => {
            authSection.style.display = "block";
            userInfoSection.style.display = "none";
            authMessage.textContent = "Logged out successfully";
            authMessage.style.color = "limegreen";
            setTimeout(() => {
                authMessage.textContent = "";
            }, 2000);
        });
    });

    // Check authentication status
    async function checkAuthStatus(forceReload = false) {
        chrome.storage.local.get(["token", "user"], async (result) => {
            if (!result.token) {
                if (forceReload) window.location.reload();
                return;
            }

            try {
                console.log("Verifying token...");
                const response = await fetch(`${API_BASE}/users/verify-token`, {
                    method: "GET",
                    headers: { 
                        "Authorization": `Bearer ${result.token}`,
                        "Accept": "application/json"
                    }
                });

                if (!response.ok) {
                    throw new Error("Token verification failed");
                }

                const data = await response.json();
                console.log("Token verification result:", data);

                if (data.valid) {
                    // Store user data for future use
                    chrome.storage.local.set({ user: data.user }, () => {
                        authSection.style.display = "none";
                        userInfoSection.style.display = "block";
                        usernameSpan.textContent = data.user.name || data.user.email.split('@')[0];
                        
                        if (forceReload) {
                            window.location.reload();
                        }
                    });
                } else {
                    chrome.storage.local.remove(["token", "user"]);
                }
            } catch (error) {
                console.error("Token verification error:", error);
                chrome.storage.local.remove(["token", "user"]);
                if (forceReload) {
                    window.location.reload();
                }
            }
        });
    }
});