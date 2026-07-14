import groq from "./groq.js";
import searchWeb from "./tavily.js";
import shouldSearch from "./classifier.js";
import rewriteQuery from "./rewriteQuery.js";

const getAIResponse = async (message) => {

    try {

        const searchNeeded = await shouldSearch(message);

        console.log("Search Needed:", searchNeeded);

        // ---------------------------
        // General Knowledge
        // ---------------------------

        if (!searchNeeded) {

            return await groq([
                {
                    role: "system",
                    content: `
You are AlphaGPT.

You are a helpful AI assistant.

Answer naturally.

If the user asks about programming,
give code examples.

If the user asks about a person,
give a short biography.

Use markdown whenever appropriate.
`
                },
                {
                    role: "user",
                    content: message
                }
            ]);

        }

        // ---------------------------
        // Rewrite Query
        // ---------------------------

        const query = await rewriteQuery(message);

        console.log("Search Query:", query);

        // ---------------------------
        // Tavily Search
        // ---------------------------

        const search = await searchWeb(query);

        const context = search.results
            .map((item, index) => {

                return `
Source ${index + 1}

Title:
${item.title}

Content:
${item.content}

URL:
${item.url}
`;

            })
            .join("\n---------------------------------\n");

        // ---------------------------
        // Final Prompt
        // ---------------------------

        const finalPrompt = `
You are AlphaGPT.

The following information comes from live web search.

Web Summary

${search.answer}

Search Results

${context}

Instructions

- Answer using the search results.
- Prefer the newest information.
- If multiple sources disagree,
use the newest reliable one.
- If search results are insufficient,
say so.
- Never invent facts.

User Question

${message}
`;

        return await groq([
            {
                role: "system",
                content: "You are AlphaGPT."
            },
            {
                role: "user",
                content: finalPrompt
            }
        ]);

    }
    catch (error) {

        console.log(error);

        return "Sorry, something went wrong while processing your request.";

    }

};

export default getAIResponse;