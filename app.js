// ===============================
// 🔥 FIREBASE IMPORTS (MODULE)
// ===============================
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
// ===============================
// 🔥 FIREBASE CONFIG (YOUR PROJECT)
// ===============================
const firebaseConfig = {
  apiKey: "AIzaSyApp1ry0m7jEbBYXFOUBh2nt29EhKm-En8",
  authDomain: "next-wealth.firebaseapp.com",
  projectId: "next-wealth",
  storageBucket: "next-wealth.firebasestorage.app",
  messagingSenderId: "566046327509",
  appId: "1:566046327509:web:3f28fc9f91812531c5185c",
  measurementId: "G-2NL786R6KR"
};
// ===============================
// 🔥 INITIALIZE
// ===============================
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
// ===============================
// 🔥 HELPER
// ===============================
const $ = (id) => document.getElementById(id);
// ===============================
// ✅ SIGNUP (signup.html)
// ===============================
const signupBtn = $("signupBtn");

if (signupBtn) {
  signupBtn.addEventListener("click", async () => {
    const username = $("signupUsername")?.value.trim();
    const email = $("signupEmail")?.value.trim();
    const password = $("signupPassword")?.value.trim();

    if (!username || !email || !password) {
      alert("Please fill all fields");
      return;
    }
    try {
      const userCred = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCred.user;

      await setDoc(doc(db, "users", user.uid), {
        username,
        email,
        balance: 0,
        createdAt: serverTimestamp()
      });

      alert("Account created successfully!");
      window.location.href = "index.html";
    } catch (error) {
      alert(error.message);
    }
  });
}
// ===============================
// ✅ LOGIN (index.html)
// ===============================
const loginBtn = $("loginBtn");

if (loginBtn) {
  loginBtn.addEventListener("click", async () => {
    const email = $("loginEmail")?.value.trim();
    const password = $("loginPassword")?.value.trim();

    if (!email || !password) {
      alert("Enter email and password");
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert("Login successful!");
      window.location.href = "dashboard.html";
    } catch (error) {
      alert(error.message);
    }
  });
}
// ===============================
// ✅ FORGOT PASSWORD (modal/index.html)
// ===============================
const sendResetBtn = $("sendResetBtn");

if (sendResetBtn) {
  sendResetBtn.addEventListener("click", async () => {
    const email = $("resetEmail")?.value.trim();

    if (!email) {
      alert("Enter your email");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      alert("Reset link sent! Check your email inbox/spam.");
    } catch (error) {
      alert(error.message);
    }
  });
}
