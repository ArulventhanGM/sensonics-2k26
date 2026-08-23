/* ============================================================
 * SENSONICS '26 — Frontend Configuration
 * ============================================================
 * This file is the single source of truth for all
 * environment-specific values.  Update here only.
 * ============================================================ */

const CONFIG = {

    /* Google Apps Script Web App deployment URL */
    API_URL:
        "https://script.google.com/macros/s/AKfycbz-nHFT5eTDk7GHoqs714Owm_LNDYec6V6dAcHTEDU-MPdvIpwzmmMX6bkxUtH9IswO/exec",

    /* Path to payment QR image (relative to index.html) */
    PAYMENT_QR_URL:
        "payment-qr/unnamed.jpg",

    /* UPI ID shown on the payment screen */
    UPI_ID:
        "",

    /* Symposium metadata */
    SYMPOSIUM_NAME:  "Sensonics '26",
    COLLEGE_NAME:    "Kongu Engineering College",
    DEPARTMENT_NAME: "Department of Electronics and Instrumentation Engineering",

    /* Maximum events a single registration may contain */
    MAX_EVENTS: 3
};