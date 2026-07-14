import groq from "./groq.js";

const shouldSearch = async (question) => {

    const result = await groq([

        {
            role: "system",
            content: `
Reply using only one word.

SEARCH

or

NO_SEARCH

Use SEARCH if the user asks about:

Current
Latest
News
Weather
Sports
Movies
Upcoming
Stock Market
Prices
CEO
Prime Minister
Chief Minister
Technology Updates

Otherwise reply NO_SEARCH.
`
        },

        {
            role: "user",
            content: question
        }

    ], "llama-3.1-8b-instant");

    return result === "SEARCH";

};

export default shouldSearch;