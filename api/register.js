export default async function handler(req, res) {

    // Only allow POST
    if (req.method !== "POST") {
        return res.status(405).json({
            success: false,
            message: "Method not allowed"
        });
    }

    try {

        // -----------------------------------------
        // 1. Read data coming from HTML
        // -----------------------------------------

        const data = req.body;

        console.log(
            "Registration payload received:",
            data
        );


        // -----------------------------------------
        // 2. Basic validation
        // -----------------------------------------

        if (
            !data ||
            !data.name ||
            !data.email ||
            !data.event
        ) {

            return res.status(400).json({
                success: false,
                message:
                    "Name, email and event are required fields."
            });

        }


        // -----------------------------------------
        // 3. Get environment variables
        // -----------------------------------------

        const appsScriptUrl =
            process.env.APPS_SCRIPT_URL;

        const registrationSecret =
            process.env.REGISTRATION_SECRET;


        if (
            !appsScriptUrl ||
            !registrationSecret
        ) {

            console.error(
                "Missing Vercel environment variables: Ensure APPS_SCRIPT_URL and REGISTRATION_SECRET are set in Vercel settings."
            );

            return res.status(500).json({
                success: false,
                message:
                    "Server configuration error: Missing environment variables on Vercel."
            });

        }


        // -----------------------------------------
        // 4. Send request to Google Apps Script Web App
        // -----------------------------------------

        const appsScriptResponse =
            await fetch(
                appsScriptUrl,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({

                        ...data,

                        secret:
                            registrationSecret

                    }),

                    redirect: "follow"
                }
            );


        // -----------------------------------------
        // 5. Read Apps Script response text safely
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
                message:
                    "Google Apps Script Web App returned an invalid response. Ensure Web App is deployed with 'Execute as: Me' and 'Who has access: Anyone'."
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

            message:
                "Unable to process registration: " + (error.message || "Unknown error")

        });

    }

}
