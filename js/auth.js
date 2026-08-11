import { loginUser, registerUser } from "../firebase/auth.js";

document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('login-form');
  const signupForm = document.getElementById('signup-form');

  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('login-email').value;
      const pass = document.getElementById('login-password').value;

      try {
        await loginUser(email, pass);
        window.showToast("Login successful!");
        setTimeout(() => window.location.href = "index.html", 1000);
      } catch (err) {
        window.showToast(err.message.replace("Firebase: ", ""), "error");
      }
    });
  }

  if (signupForm) {
    signupForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = document.getElementById('signup-name').value;
      const email = document.getElementById('signup-email').value;
      const pass = document.getElementById('signup-password').value;

      try {
        await registerUser(name, email, pass);
        window.showToast("Account created successfully!");
        setTimeout(() => window.location.href = "index.html", 1000);
      } catch (err) {
        window.showToast(err.message.replace("Firebase: ", ""), "error");
      }
    });
  }
});
