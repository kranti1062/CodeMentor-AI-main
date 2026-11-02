const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:8081";

export async function explainError(error, language, targetLanguage) {
    const response = await fetch(
        `${API_BASE_URL}/api/errors/explain`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                error,
                language,
                targetLanguage,
            }),
        }
    );

    if (!response.ok) {
        const errorText = await response.text();

        console.error(
            "Backend Error:",
            response.status,
            errorText
        );

        throw new Error(
            `Backend returned ${response.status}`
        );
    }

    return await response.json();
}