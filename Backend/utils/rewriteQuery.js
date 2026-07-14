import groq from "./groq.js";

const rewriteQuery = async (question) => {

    return await groq([

        {
            role: "system",
            content: `
Rewrite the user's question into the best possible Google search query.

Only return the search query.
`
        },

        {
            role: "user",
            content: question
        }

    ], "llama-3.1-8b-instant");

};

export default rewriteQuery;