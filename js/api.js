async function checkBackend() {
    try {
        const response = await fetch(CONFIG.API_URL);

        if (!response.ok) {
            throw new Error(
                `Backend returned HTTP ${response.status}`
            );
        }

        const data = await response.json();

        console.log("Backend response:", data);

        return data;

    } catch (error) {
        console.error("Backend connection failed:", error);
        throw error;
    }
}