import {
  VectorStoreIndex,
  Document,
  Settings,
  Ollama,
  SimpleDirectoryReader,
  TextQaPrompt,
  CompactAndRefine,
  ResponseSynthesizer,
} from "llamaindex";

// import { MongoClient } from "mongodb";
import {scrapeMain} from "@/middleware/firecrawl/scrapeWeb";

// async function getDataSource(llm: LLM) {
//   checkRequiredEnvVars();
//   const client = new MongoClient(process.env.MONGO_URI!);
//   const serviceContext = serviceContextFromDefaults({
//     llm,
//     chunkSize: CHUNK_SIZE,
//     chunkOverlap: CHUNK_OVERLAP,
//   });
//   const store = new MongoDBAtlasVectorSearch({
//     mongodbClient: client,
//     dbName: process.env.MONGODB_DATABASE,
//     collectionName: process.env.MONGODB_VECTORS,
//     indexName: process.env.MONGODB_VECTOR_INDEX,
//   });
//
//   return await VectorStoreIndex.fromVectorStore(store, serviceContext);
// }

const model = new Ollama({ model: "qwen:0.5b", temperature: 0.75 });
Settings.llm = model
Settings.embedModel = model;

// Define a custom prompt
const newTextQaPrompt: TextQaPrompt = ({ context, query }) => {
  return `Context information is below.
---------------------
${context}
---------------------
// Given the context information and not prior knowledge, answer the query.
// Answer the query in the style of a Sherlock Holmes detective novel.
// If can not find information in context information, please answer: please provide enough info.
Always answer the query in Chinese.
Query: ${query}
Answer:`;
};

const responseSynthesizer = new ResponseSynthesizer({
  responseBuilder: new CompactAndRefine(undefined, newTextQaPrompt),
});

export const createQueryEngine = async (referLink?: string) => {
  const documents = await new SimpleDirectoryReader().loadData({
    directoryPath: "data",
  });

  if (referLink) {
    const crawlResult = await scrapeMain(referLink)

    const document = new Document()
    document.metadata = crawlResult.metadata
    document.setContent(crawlResult.markdown)
    documents.push(document)
  }

  // Create indices
  const vectorIndex = await VectorStoreIndex.fromDocuments(documents);
  // const engine = vectorIndex.asQueryEngine({ responseSynthesizer })
  // engine.updatePrompts({
  //   'responseSynthesizer:textQATemplate': newTextQaPrompt,
  //   'responseSynthesizer:refineTemplate': newTextQaPrompt,
  // });
  return vectorIndex.asQueryEngine({ responseSynthesizer });
}