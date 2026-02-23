// app.js (module) ✅
// Works on BOTH pages: index.html + signup.html
// Null checks included so no page crashes.

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  sendPasswordResetEmail,
} from "https://www.gstatic.com/firebasejs/12.9.0/firebase-auth.js";
import {
  getFirestore,
  doc,
  setDoc,
  serverTimestamp,
} from "https://www.gstatic.com/firebasejs/12.9.0/firebase-firestore.js";

// ✅ Your Firebase config (paste EXACT from Firebase settings)
const firebaseConfig = {
  apiKey: "AIzaSyApp1ry0m7jEbBYXFOUBh2nt29EhKm-En8",
  authDomain: "next-wealth.firebaseapp.com",
  projectId: "next-wealth",
  storageBucket: "next-wealth.firebasestorage.app",
  messagingSenderId: "566046327509",
  appId: "1:566046327509:web:3f28fc9f91812531c5185c",
  measurementId: "G-2NL786R6KR",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const $ = (id) => document.getElementById(id);

// Run after HTML loads
window.addEventListener("DOMContentLoaded", () => {
  // -------------------------
  // ✅ LOGIN (index.html)
  // -------------------------
  const loginBtn = $("loginBtn");
  if (loginBtn) {
    loginBtn.addEventListener("click", async () => {
      const email = ($("loginEmail")?.value || "").trim();
      const pass = ($("loginPassword")?.value || "").trim();

      if (!email || !pass) return alert("Email aur password dono likho!");

      try {
        await signInWithEmailAndPassword(auth, email, pass);
        window.location.href = "dashboard.html";
      } catch (e) {
        alert(e.message);
        console.error(e);
      }
    });
  }

  // -------------------------
  // ✅ FORGOT PASSWORD MODAL (index.html)
  // -------------------------
  const overlay = $("overlay");
  const openReset = $("openReset");
  const closeReset = $("closeReset");
  const sendResetBtn = $("sendResetBtn");

  if (openReset && overlay) {
    openReset.style.cursor = "pointer";
    openReset.addEventListener("click", () => {
      overlay.style.display = "grid";
      // auto-fill from login email if available
      if ($("loginEmail") && $("resetEmail")) {
        $("resetEmail").value = $("loginEmail").value || "";
      }
    });
  }

  if (closeReset && overlay) {
    closeReset.addEventListener("click", () => {
      overlay.style.display = "none";
    });
  }

  if (overlay) {
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) overlay.style.display = "none";
    });
  }

  if (sendResetBtn) {
    sendResetBtn.addEventListener("click", async () => {
      const email = ($("resetEmail")?.value || "").trim();
      if (!email) return alert("Reset ke liye email likho!");

      try {
        await sendPasswordResetEmail(auth, email);
        alert("✅ Reset link send hogaya. Inbox/Spam check karo.");
        if (overlay) overlay.style.display = "none";
      } catch (e) {
        alert(e.message);
        console.error(e);
      }
    });
  }

  // -------------------------
  // ✅ SIGNUP (signup.html)
  // -------------------------
  const signupBtn = $("signupBtn");
  if (signupBtn) {
    signupBtn.addEventListener("click", async () => {
      const username = ($("signupUsername")?.value || "").trim();
      const email = ($("signupEmail")?.value || "").trim();
      const pass = ($("signupPassword")?.value || "").trim();

      if (!username || !email || !pass) return alert("Username, email, password sab likho!");
      if (pass.length < 6) return alert("Password minimum 6 characters hona chahiye!");

      try {
        const cred = await createUserWithEmailAndPassword(auth, email, pass);

        // Set display name
        await updateProfile(cred.user, { displayName: username });

        // Save user in Firestore
        await setDoc(doc(db, "users", cred.user.uid), {
          uid: cred.user.uid,
          username,
          email,
          balance: 0,
          createdAt: serverTimestamp(),
        });

        alert("✅ Account create hogaya. Ab login karo.");
        window.location.href = "index.html";
      } catch (e) {
        alert(e.message);
        console.error(e);
      }
    });
  }
});
