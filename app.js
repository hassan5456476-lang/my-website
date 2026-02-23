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
const firebaseConfig = {
  apiKey: "AIzaSyApp1ry0m7jEbBYXFOUBh2nt29EhKm-En8",
  authDomain: "next-wealth.firebaseapp.com",
  projectId: "next-wealth",
  storageBucket: "next-wealth.firebasestorage.app",
  messagingSenderId: "566046327509",
  appId: "1:566046327509:web:3f28fc9f91812531c5185c",
  measurementId: "G-2NL786R6KR"
};
   SIGNUP
========================= */
if ($("signupBtn")) {
  $("signupBtn").addEventListener("click", async () => {
    const username = $("suUsername").value.trim();
    const email = $("suEmail").value.trim();
    const pass = $("suPass").value.trim();

    if (!username || !email || !pass) {
      alert("All fields required");
      return;
    }

    try {
      const cred = await createUserWithEmailAndPassword(auth, email, pass);

      await setDoc(doc(db, "users", cred.user.uid), {
        username,
        email,
        balance: 0,
        createdAt: serverTimestamp()
      });

      alert("Account created successfully");
      window.location.href = "index.html";
    } catch (e) {
      alert(e.message);
    }
  });
}

/* =========================
   LOGIN
========================= */
if ($("loginBtn")) {
  $("loginBtn").addEventListener("click", async () => {
    const email = $("loginEmail").value.trim();
    const pass = $("loginPass").value.trim();

    if (!email || !pass) {
      alert("Enter email & password");
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, pass);
      alert("Login success");
      window.location.href = "dashboard.html";
    } catch (e) {
      alert(e.message);
    }
  });
}

/* =========================
   FORGOT PASSWORD
========================= */
if ($("forgotBtn")) {
  $("forgotBtn").addEventListener("click", () => {
    $("overlay").style.display = "grid";
  });
}

if ($("closeModal")) {
  $("closeModal").addEventListener("click", () => {
    $("overlay").style.display = "none";
  });
}

if ($("sendResetBtn")) {
  $("sendResetBtn").addEventListener("click", async () => {
    const email = $("resetEmail").value.trim();

    if (!email) {
      alert("Enter email");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      alert("Reset link sent. Check your email.");
    } catch (e) {
      alert(e.message);
    }
  });
}
