/* ============================================================
 * SENSONICS '26 — Registration Module
 *
 * Converts the wizard's in-memory `state` object into the
 * exact payload shape that the Apps Script backend expects,
 * then calls the API and drives the UI response.
 *
 * Dependencies (must be loaded before this file):
 *   js/config.js   →  CONFIG
 *   js/api.js      →  submitRegistration()
 * ============================================================ */


/* ----------------------------------------------------------
 * buildPayload(state)
 *
 * Maps the frontend wizard state → backend payload schema.
 *
 * Critical field mappings:
 *  state.proofFile.name  → payload.paymentProof.fileName
 *    (backend uses fileData.fileName, not fileData.name)
 *
 *  member college/department/year are carried through so the
 *  backend can populate every event sheet row correctly.
 * ---------------------------------------------------------- */
function buildPayload(state) {

    /* ----- payment proof ----- */
    const proof = state.proofFile;

    const paymentProof = {
        fileName: proof.name,       // Apps Script uses fileData.fileName
        mimeType: proof.mimeType,
        base64:   proof.base64,
    };

    /* ----- per-event data ----- */
    const eventData = {};

    state.selectedEvents.forEach(function (eventName) {

        const ev   = EVENT_RULES[eventName];
        const data = state.eventData[eventName];

        /* members: ensure every field the backend needs is present */
        const members = (data.members || []).map(function (m) {
            return {
                name:       (m.name       || "").trim(),
                email:      (m.email      || "").trim(),
                phone:      (m.phone      || "").trim(),
                /* fall back to leader values if the member row is
                   sparse (workshop / solo event convenience) */
                college:    (m.college    || state.leader.college    || "").trim(),
                department: (m.department || state.leader.department || "").trim(),
                year:       (m.year       || state.leader.year       || "").trim(),
            };
        });

        const hasAbstract = data.abstractFile && data.abstractFile.name;

        eventData[eventName] = {
            teamName:       (data.teamName     || eventName + " Team").trim(),
            projectTitle:   (data.projectTitle || "").trim(),
            abstractFileId: hasAbstract ? data.abstractFile.name : (data.projectTitle ? "TITLE_PROVIDED" : "OPTIONAL_SKIPPED"),
            abstractUrl:    hasAbstract ? ("data:" + data.abstractFile.mimeType + ";base64," + data.abstractFile.base64) : "NONE",
            whatsappJoined: data.whatsappJoined === true,
            members:        members,
        };
    });

    return {
        leaderName:    state.leader.name.trim(),
        leaderEmail:   state.leader.email.trim(),
        leaderPhone:   state.leader.phone.trim(),
        college:       state.leader.college.trim(),
        department:    state.leader.department.trim(),
        year:          state.leader.year.trim(),
        referralId:    (state.leader.referralId || "").trim(),   // unrestricted
        transactionId: state.transactionId.trim(),
        paymentProof:  paymentProof,
        events:        state.selectedEvents.slice(),
        eventData:     eventData,
    };
}


/* ----------------------------------------------------------
 * handleSubmitRegistration(state, uiCallbacks)
 *
 * Orchestrates the full submission flow:
 *   1. Build payload
 *   2. Show loading overlay
 *   3. POST to backend
 *   4. Show success or error
 *
 * uiCallbacks = {
 *   onStart()             — called before the request
 *   onSuccess(regId)      — called when backend returns success:true
 *   onError(message)      — called on validation or network error
 *   onFinally()           — always called after request settles
 * }
 * ---------------------------------------------------------- */
async function handleSubmitRegistration(state, uiCallbacks) {

    uiCallbacks.onStart();

    let payload;
    try {
        payload = buildPayload(state);
    } catch (buildError) {
        console.error("[Registration] Payload build error:", buildError);
        uiCallbacks.onError(
            "Could not prepare registration data: " + buildError.message
        );
        uiCallbacks.onFinally();
        return;
    }

    console.log("[Registration] Payload ready:", payload);

    try {
        const result = await submitRegistration(payload);

        if (result.success) {
            uiCallbacks.onSuccess(result.registrationId, result);
        } else {
            uiCallbacks.onError(
                result.message || "Registration was rejected by the server."
            );
        }

    } catch (networkError) {
        console.error("[Registration] Network error:", networkError);
        uiCallbacks.onError(
            "Unable to reach the registration server. " +
            "Please check your internet connection and try again."
        );
    } finally {
        uiCallbacks.onFinally();
    }
}
