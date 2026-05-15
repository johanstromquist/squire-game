(function () {
  const form = document.querySelector("#signup-form");
  const status = document.querySelector("#form-status");
  const endpoint =
    window.SQUIRE_SIGNUP_ENDPOINT ||
    "https://squire-signup.vercel.app/api/subscribe";

  if (!form || !status) {
    return;
  }

  function setStatus(message, isError) {
    status.textContent = message;
    status.style.color = isError ? "#ffb4a8" : "#b8f2b0";
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const email = String(data.get("email") || "").trim();
    const consent = data.get("consent") === "on";
    const company = String(data.get("company") || "");

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setStatus("Enter a valid email address.", true);
      return;
    }
    if (!consent) {
      setStatus("Confirm that you want release emails.", true);
      return;
    }

    setStatus("Sending...", false);
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          consent,
          company,
          source: window.location.href,
        }),
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(payload.error || "Signup failed.");
      }
      form.reset();
      setStatus("Done. You'll get Squire release updates.", false);
    } catch (error) {
      setStatus(error.message || "Signup failed.", true);
    }
  });
})();
