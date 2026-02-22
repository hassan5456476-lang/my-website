// app.js (type="module")

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail
} from "https://www.gstatic.com/firebasejs/12.9.0/firebase-auth.js";
import {
  getFirestore,
  doc,
  setDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.9.0/firebase-firestore.js";

// ✅ 1) YAHAN apna firebaseConfig paste karo (Firebase console > Web app config)
const firebaseConfig = {
  apiKey: "PASTE_HERE",
  authDomain: "PASTE_HERE",
  projectId: "PASTE_HERE",
  storageBucket: "PASTE_HERE",
  messagingSenderId: "PASTE_HERE",
  appId: "PASTE_HERE"
  // measurementId optional
};

// ✅ 2) Init
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// helper
const $ = (id) => document.getElementById(id);
const setMsg = (id, text) => { const el = $(id); if(el) el.textContent = text; };

// ===========================
// SIGNUP PAGE
// ===========================
if ($("signupBtn")) {
  $("signupBtn").addEventListener("click", async () => {
    const username = $("suUsername").value.trim();
    const email = $("suEmail").value.trim();
    const pass = $("suPass").value.trim();

    setMsg("suMsg", "");

    if (!username || !email || !pass) {
      setMsg("suMsg", "Please fill all fields.");
      return;
    }
    if (pass.length < 6) {
      setMsg("suMsg", "Password minimum 6 characters hona chahiye.");
      return;
    }

    try {
      const cred = await createUserWithEmailAndPassword(auth, email, pass);

      // users/{uid}
      await setDoc(doc(db, "users", cred.user.uid), {
        username,
        email,
        balance: 0,
        createdAt: serverTimestamp()
      });

      setMsg("suMsg", "✅ Account created. Ab login karo.");
      setTimeout(() => window.location.href = "index.html", 900);
    } catch (e) {
      setMsg("suMsg", "❌ " + (e?.message || "Signup failed"));
      console.error(e);
    }
  });
}

// ===========================
// LOGIN PAGE
// ===========================
if ($("loginBtn")) {
  $("loginBtn").addEventListener("click", async () => {
    const email = $("loginEmail").value.trim();
    const pass = $("loginPass").value.trim();
    setMsg("msg", "");

    if (!email || !pass) {
      setMsg("msg", "Please enter email and password.");
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, pass);
      setMsg("msg", "✅ Login success. Redirecting...");
      setTimeout(() => window.location.href = "dashboard.html", 700);
    } catch (e) {
      setMsg("msg", "❌ " + (e?.message || "Login failed"));
      console.error(e);
    }
  });

  // Forgot password modal open/close
  const overlay = $("overlay");
  $("forgotBtn")?.addEventListener("click", () => {
    overlay.style.display = "grid";
    setMsg("resetMsg", "");
    $("resetEmail").value = $("loginEmail").value || "";
  });
  $("closeModal")?.addEventListener("click", () => overlay.style.display = "none");
  overlay?.addEventListener("click", (e) => {
    if (e.target === overlay) overlay.style.display = "none";
  });

  // Send reset link
  $("sendResetBtn")?.addEventListener("click", async () => {
    const email = $("resetEmail").value.trim();
    setMsg("resetMsg", "");
    if (!email) { setMsg("resetMsg", "Email required."); return; }

    try {
      await sendPasswordResetEmail(auth, email);
      setMsg("resetMsg", "✅ Reset link sent. Email inbox check karo.");
    } catch (e) {
      setMsg("resetMsg", "❌ " + (e?.message || "Reset failed"));
      console.error(e);
    }
  });
}
