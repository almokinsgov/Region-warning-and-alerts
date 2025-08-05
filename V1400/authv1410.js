// === CONFIGURATION ===
const AUTH_KEY = window?.RWAS_AUTH_KEY || ""; // 🔐 Replace with your actual key
const WEBHOOK_URL = "https://script.google.com/macros/s/AKfycbylqAPV9yXdbavamOrCyjVPQNuUKS6lgAbsWuUMecVhWxB8b13cdCXPWjdm_EbZGmyxNQ/exec"; // 🔗 Replace with your Apps Script Web App URL
const RWAS_CORE_SCRIPT_URL = "https://cdn.jsdelivr.net/gh/almokinsgov/Region-warning-and-alerts@main/V1400/RWASJSV1410.js";

const AUTH_STORAGE_KEY = "rwas_auth_verified_until";
const CACHE_DURATION_HOURS = 24;

// === MAIN FUNCTION ===
async function verifyAuthKey() {
  const storedUntil = localStorage.getItem(AUTH_STORAGE_KEY);
  const now = Date.now();

  if (storedUntil && now < parseInt(storedUntil)) {
    return true;
  }

  try {
    const res = await fetch(`${WEBHOOK_URL}?key=${AUTH_KEY}`);
    const result = await res.text();

    if (result.trim() === "verified") {
      const expiry = now + CACHE_DURATION_HOURS * 60 * 60 * 1000;
      localStorage.setItem(AUTH_STORAGE_KEY, expiry.toString());
      return true;
    } else {
      return false;
    }
  } catch (e) {
    console.error("⚠️ Auth verification failed:", e);
    return false;
  }
}

// === FLOW ===
verifyAuthKey().then(verified => {
  if (verified) {
    const script = document.createElement("script");
    script.src = RWAS_CORE_SCRIPT_URL;
    script.defer = true;
    script.onload = () => {
      if (typeof initRWAS === "function") {
        initRWAS();
      } else {
        console.error("❌ RWAS init function not found.");
      }
    };
    document.head.appendChild(script);
  } else {
    console.warn("❌ Auth failed. Tool not loaded.");
    document.getElementById("floating-alerts-container").innerHTML = `
      <div class="alert-card">
        <b>Access Denied</b><br>
        This tool is not authorised for use. Please contact support.
      </div>
    `;
  }
});
