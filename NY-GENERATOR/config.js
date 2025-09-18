

const API_CONFIG = {

    // OpenAI-nøkler (for GPT-4o og DALL-E 3)
    // Den første brukes, den andre er fallback.
    openai: [
        "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",
        "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"
    ],

    // Anthropic-nøkkel (for Claude)
    anthropic: [
        "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"
    ],

    // Google-nøkkel (for Gemini)
    google: [
        "AIzaSyB-CDqyxhvszIPfHmKXUR3fd_-sDILXRA8"
    ]

};

window.API_CONFIG = API_CONFIG;