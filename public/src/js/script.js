// Your API endpoint
const apiUrl = "http://localhost:3000/Users";

/**
 * Sets up a show/hide password toggle for a specific input and toggle icon.
 * @param {string} inputId - The ID of the password input field
 * @param {string} toggleId - The ID of the toggle icon
 */
function setupPasswordToggle(inputId, toggleId) {
  const passwordInput = document.getElementById(inputId);
  const toggleIcon = document.getElementById(toggleId);

  if (!passwordInput || !toggleIcon) return; // Safety check

  toggleIcon.addEventListener("click", () => {
    const isPassword = passwordInput.type === "password";
    passwordInput.type = isPassword ? "text" : "password";
    toggleIcon.textContent = isPassword ? "🙈" : "👁️";
  });
}

document.addEventListener("DOMContentLoaded", () => {
  setupPasswordToggle("password", "togglePassword");

  const signupForm = document.getElementById("signupForm");
  const loginForm = document.getElementById("loginForm");

  // ======== SIGNUP FORM HANDLER ========
  if (signupForm) {
    signupForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const userData = {
        name: document.getElementById("name").value.trim(),
        email: document.getElementById("email").value.trim(),
        password: document.getElementById("password").value.trim(),
        role: "user"
      };

      if (!userData.name || !userData.email || !userData.password) {
        alert("Please fill in all required fields.");
        return;
      }

      try {
        const response = await fetch(apiUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(userData)
        });

        if (response.ok) {
          alert("User registered successfully!");
          signupForm.reset();
          window.location.href = "login.html";
        } else {
          throw new Error("Failed to register user.");
        }
      } catch (error) {
        console.error("Error:", error);
        alert("Unexpected error occurred while registering.");
      }
    });
  }

  // ======== LOGIN FORM HANDLER ========
  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const email = loginForm.email.value.trim();
      const password = loginForm.password.value.trim();

      if (!email || !password) {
        alert("Please enter both email and password.");
        return;
      }

      try {
        const response = await fetch(`${apiUrl}?email=${email}`);
        const users = await response.json();

        if (users.length === 0) {
          alert("User not found. Please sign up first.");
          return;
        }

        const user = users[0];

        if (user.password === password) {
          alert("Login successful!");
          localStorage.setItem("loggedInUser", JSON.stringify(user));
          window.location.href = "index.html"; // redirect to dashboard
        } else {
          alert("Incorrect password!");
        }
      } catch (error) {
        console.error("Error:", error);
        alert("Unexpected error occurred while logging in.");
      }
    });
  }

  // Optional panel toggle (if used in a single-page form layout)
  const container = document.querySelector(".container");
  const signUpBtn = document.querySelector("#signUpBtn");
  const signInBtn = document.querySelector("#signInBtn");

  if (signUpBtn && signInBtn && container) {
    signUpBtn.addEventListener("click", () => {
      container.classList.add("right-panel-active");
    });

    signInBtn.addEventListener("click", () => {
      container.classList.remove("right-panel-active");
    });
  }
});
