export default async function handler(req, res) {

    // Only allow POST
    if (req.method !== "POST") {
        return res.status(405).json({
            success: false,
            code: "METHOD_NOT_ALLOWED",
            message: "Method not allowed"
        });
    }

    try {

        // -----------------------------------------
        // 1. Read data coming from Frontend
        // -----------------------------------------

        const data = req.body;

        console.log(
            "Registration payload received:",
            JSON.stringify(data)
        );


        // -----------------------------------------
        // 2. Validation
        // -----------------------------------------

        if (!data) {
            return res.status(400).json({
                success: false,
                code: "INVALID_REQUEST",
                message: "Registration payload is missing."
            });
        }

        // Support structured multi-event format
        if (data.participant && data.events) {
            const p = data.participant;
            if (!p.name || !p.email || !p.phone || !p.college) {
                return res.status(400).json({
                    success: false,
                    code: "MISSING_PARTICIPANT",
                    message: "Participant name, email, phone, and college are required."
                });
            }

            if (!Array.isArray(data.events) || data.events.length < 2 || data.events.length > 3) {
                return res.status(400).json({
                    success: false,
                    code: "INVALID_EVENT_COUNT",
                    message: "Registration requires a minimum of 2 and a maximum of 3 events."
                });
            }
        } else if (!data.name || !data.email) {
            return res.status(400).json({
                success: false,
                code: "MISSING_FIELDS",
                message: "Name and email are required fields."
            });
        }


        // -----------------------------------------
        // 3. Get environment variables
        // -----------------------------------------

        const appsScriptUrl = process.env.APPS_SCRIPT_URL;
        const registrationSecret = process.env.REGISTRATION_SECRET || "sensonics_2026_secure_secret_key";

        if (!appsScriptUrl) {
            console.error(
                "Missing Vercel environment variables: Ensure APPS_SCRIPT_URL is configured in Vercel settings."
            );

            return res.status(500).json({
                success: false,
                code: "SERVER_CONFIG_ERROR",
                message: "Server configuration error: Missing APPS_SCRIPT_URL on Vercel."
            });
        }


        // -----------------------------------------
        // 4. Relay request to Google Apps Script
        // -----------------------------------------

        const appsScriptResponse = await fetch(appsScriptUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                ...data,
                secret: registrationSecret
            }),
            redirect: "follow"
        });


        // -----------------------------------------
        // 5. Read Apps Script response safely
        // -----------------------------------------

        const rawText = await appsScriptResponse.text();

        console.log(
            "Apps Script raw response status:",
            appsScriptResponse.status,
            "body:",
            rawText
        );

        let result;

        try {
            result = JSON.parse(rawText);
        } catch (jsonErr) {
            console.error(
                "Apps Script returned non-JSON response (likely an authorization error, wrong deployment settings, or Google Login redirect):",
                rawText
            );

            return res.status(502).json({
                success: false,
                code: "INVALID_BACKEND_RESPONSE",
                message: "Google Apps Script Web App returned an invalid response. Ensure Web App is deployed with 'Execute as: Me' and 'Who has access: Anyone'."
            });
        }


        // -----------------------------------------
        // 6. Return response to Frontend
        // -----------------------------------------

        return res.status(
            result.success ? 200 : 400
        ).json(result);


    } catch (error) {

        console.error(
            "Registration API error:",
            error
        );

        return res.status(500).json({
            success: false,
            code: "SERVER_ERROR",
            message: "Unable to process registration: " + (error.message || "Unknown error")
        });

    }

}