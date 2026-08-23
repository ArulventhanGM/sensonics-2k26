/* ============================================================
 * SENSONICS '26 — API Module
 *
 * All communication with the Google Apps Script backend
 * lives here.  Nothing else in the UI layer talks directly
 * to the network.
 * ============================================================ */


/* ----------------------------------------------------------
 * checkBackend()
 *
 * Pings the Apps Script doGet() endpoint.
 * Returns { success: true, service: "...", status: "online" }
 * on a healthy deployment, or throws on network failure.
 * ---------------------------------------------------------- */
async function checkBackend() {

    /*
     * GET requests are simple CORS requests — no preflight.
     * Apps Script doGet() handles these correctly.
     */
    const response = await fetch(CONFIG.API_URL, {
        method: "GET",
    });

    if (!response.ok) {
        throw new Error(
            "Backend returned HTTP " + response.status
        );
    }

    const data = await response.json();

    console.log("[API] checkBackend response:", data);

    return data;
}


/* ----------------------------------------------------------
 * submitRegistration(payload)
 *
 * POSTs registration data to the Apps Script doPost() endpoint.
 *
 * WHY text/plain instead of application/json:
 *
 *   Sending Content-Type: application/json triggers a CORS
 *   "preflight" OPTIONS request.  Google Apps Script has no
 *   doOptions() handler, so the browser blocks the request
 *   entirely before it reaches the server — causing the
 *   "Unable to reach the registration server" network error.
 *
 *   Sending Content-Type: text/plain is a CORS "simple
 *   request" — no preflight is triggered.  The body is still
 *   JSON-stringified, and Apps Script reads it via
 *   e.postData.contents then JSON.parse() — zero backend
 *   changes required.
 * ---------------------------------------------------------- */
async function submitRegistration(payload) {

    console.log("[API] Submitting registration ...");

    const response = await fetch(CONFIG.API_URL, {
        method:  "POST",
        /*
         * text/plain avoids the CORS preflight that
         * application/json would trigger.
         * Apps Script doPost() reads e.postData.contents
         * regardless of content-type.
         */
        headers: { "Content-Type": "text/plain;charset=UTF-8" },
        body:    JSON.stringify(payload),
    });

    if (!response.ok) {
        throw new Error(
            "Server returned HTTP " + response.status
        );
    }

    const data = await response.json();

    console.log("[API] submitRegistration response:", data);

    return data;
}