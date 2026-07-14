import "dotenv/config";
import { tavily } from "@tavily/core";

const tvly = tavily({
    apiKey: process.env.TAVILY_API_KEY
});

const searchWeb = async (query) => {

    const result = await tvly.search(query, {
        topic: "general",
        searchDepth: "advanced",
        maxResults: 6,
        includeAnswer: true
    });

    return result;

};

export default searchWeb;