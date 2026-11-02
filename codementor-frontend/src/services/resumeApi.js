const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL ||
    "http://localhost:8081";

/**
 * Improve resume content using AI
 */
export async function improveResumeContent(
    section,
    content,
    role,
    jobDescription = ""
) {
    const response = await fetch(
        `${API_BASE_URL}/api/resume/improve`,
        {
            method: "POST",

            headers: {
                "Content-Type": "application/json",
            },

            body: JSON.stringify({
                section,
                content,
                role,
                jobDescription,
            }),
        }
    );

    if (!response.ok) {
        const errorText =
            await response.text();

        console.error(
            "Resume AI Error:",
            response.status,
            errorText
        );

        throw new Error(
            `Resume AI request failed: ${response.status}`
        );
    }

    const data = await response.json();

    return data.improvedContent;
}