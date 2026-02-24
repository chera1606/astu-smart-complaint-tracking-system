import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

export async function chunkText(text) {
    const splitter = new RecursiveCharacterTextSplitter({
        chunkSize: 700,
        chunkOverlap: 60,
    });

    return splitter.splitText(text);
}
