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

        // Normalize incoming payload structure
        let payload = data;
        if (!data.participant && data.name && data.email) {
            payload = {
                participant: {
                    name: data.name,
                    email: data.email,
                    phone: data.phone || "",
                    college: data.college || "",
                    department: data.department || "",
                    year: data.year || "3rd Year"
                },
                events: Array.isArray(data.events) ? data.events : [
                    {
                        eventId: data.eventId || data.event || "tech-project",
                        teamName: data.teamName || (data.name + "'s Team"),
                        teamMembers: data.teamMembers || []
                    }
                ]
            };
        }

        // -----------------------------------------
        // 2. Validation
        // -----------------------------------------

        if (!payload || !payload.participant) {
            return res.status(400).json({
                success: false,
                code: "MISSING_PARTICIPANT",
                message: "Participant information (name, email, phone, college) is required."
            });
        }

        const p = payload.participant;
        if (!p.name || !p.email || !p.phone || !p.college) {
            return res.status(400).json({
                success: false,
                code: "MISSING_PARTICIPANT_FIELDS",
                message: "Participant name, email, phone, and college are required."
            });
        }

        if (!Array.isArray(payload.events) || payload.events.length === 0) {
            return res.status(400).json({
                success: false,
                code: "MISSING_EVENTS",
                message: "At least one event is required for registration."
            });
        }


        // -----------------------------------------
        // 3. Get environment variables with Fallback
        // -----------------------------------------

        const appsScriptUrl = process.env.APPS_SCRIPT_URL || "https://script.google.com/macros/s/AKfycbxONOtq49ZRx09W0gV23Jw3_nkUKRVtfPKugL-LQ0vzkyIXVZKhjz5NqmEf0ElJiXix/exec";
        const registrationSecret = process.env.REGISTRATION_SECRET || "sensonics_2026_secure_secret_key";


        // -----------------------------------------
        // 4. Relay request to Google Apps Script
        // -----------------------------------------

        const appsScriptResponse = await fetch(appsScriptUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                ...payload,
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