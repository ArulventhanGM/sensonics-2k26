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

    const response = await fetch(CONFIG.API_URL, {
        method: "GET",
        /* No-CORS is NOT used here intentionally:
         * The Apps Script endpoint responds with the correct
         * Access-Control-Allow-Origin header.
         * If you switch to no-cors you lose the response body. */
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
 * POSTs a fully-formed registration payload to the Apps Script
 * doPost() endpoint.
 *
 * Returns the parsed JSON response from the server.
 * Throws on network failure or non-OK HTTP status.
 *
 * payload shape — matches Apps Script validateRegistration():
 * {
 *   leaderName:     string,
 *   leaderEmail:    string,
 *   leaderPhone:    string,
 *   college:        string,
 *   department:     string,
 *   year:           string,
 *   referralId:     string,       // unrestricted, may be ""
 *   transactionId:  string,
 *   paymentProof: {
 *     fileName:  string,
 *     mimeType:  string,
 *     base64:    string,
 *   },
 *   events:     string[],         // e.g. ["Paper Mania", "Jumble"]
 *   eventData: {
 *     [eventName]: {
 *       teamName:       string,
 *       projectTitle:   string,   // only for Paper Mania / Project Inventa
 *       abstractFileId: string,   // ""  — abstract goes via proof upload
 *       abstractUrl:    string,   // ""
 *       whatsappJoined: boolean,
 *       members: [{
 *         name:       string,
 *         email:      string,
 *         phone:      string,
 *         college:    string,
 *         department: string,
 *         year:       string,
 *       }],
 *     },
 *   },
 * }
 * ---------------------------------------------------------- */
async function submitRegistration(payload) {

    console.log("[API] Submitting registration …");

    const response = await fetch(CONFIG.API_URL, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
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