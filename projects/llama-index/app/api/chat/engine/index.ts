import {
  ContextChatEngine,
  VectorStoreIndex,
  Document,
  Settings,
  Ollama,
  SimpleDirectoryReader,
  TextQaPrompt,
  CompactAndRefine,
  ResponseSynthesizer, RouterQueryEngine, SummaryIndex,
} from "llamaindex";

// import { MongoClient } from "mongodb";
import { checkRequiredEnvVars, CHUNK_OVERLAP, CHUNK_SIZE } from "./shared.mjs";
import fs from "fs/promises";

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
Settings.embedModel = new Ollama({
  model: 'nomic-embed-text',
  modelMetadata: {
    maxTokens: 256
  }
});

export const createQueryEngine = async () => {
  const documents = await new SimpleDirectoryReader().loadData({
    directoryPath: "data",
  });

// Create indices
  const vectorIndex = await VectorStoreIndex.fromDocuments(documents);
  return vectorIndex.asQueryEngine();
}