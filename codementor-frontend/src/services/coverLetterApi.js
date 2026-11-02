const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:8081";

export async function generateCoverLetter(data) {
    const response = await fetch(
        `${API_BASE_URL}/api/cover-letter/generate`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        }
    );

    if (!response.ok) {
        const errorText = await response.text();

        console.error(
            "Cover Letter Backend Error:",
            response.status,
            errorText
        );

        throw new Error(
            `Cover Letter API returned ${response.status}`
        );
    }

    return await response.json();
}