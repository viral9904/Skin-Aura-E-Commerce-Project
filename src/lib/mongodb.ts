
import { MongoClient, ServerApiVersion, Db, Collection } from 'mongodb';

// Replace with your actual MongoDB URI
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/skinauradb";

// Create a MongoClient with connection pooling
let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === 'development') {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  let globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>;
  };

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(MONGODB_URI, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      }
    });
    globalWithMongo._mongoClientPromise = client.connect();
  }
  clientPromise = globalWithMongo._mongoClientPromise;
} else {
  // In production mode, it's best to use a connection pool
  client = new MongoClient(MONGODB_URI, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
  });
  clientPromise = client.connect();
}

export default clientPromise;

// Helper function to get database
export async function getDatabase(dbName?: string): Promise<Db> {
  const client = await clientPromise;
  return client.db(dbName || 'skinauradb');
}

// Helper function to get collection
export async function getCollection<T = any>(collectionName: string, dbName?: string): Promise<Collection<T>> {
  const db = await getDatabase(dbName);
  return db.collection<T>(collectionName);
}

// Example models for the application
// Products collection
export async function getProductsCollection() {
  return getCollection('products');
}

// Orders collection
export async function getOrdersCollection() {
  return getCollection('orders');
}

// Users collection
export async function getUsersCollection() {
  return getCollection('users');
}

// Categories collection
export async function getCategoriesCollection() {
  return getCollection('categories');
}

// Transactions collection
export async function getTransactionsCollection() {
  return getCollection('transactions');
}

// Create a new document in a collection
export async function createDocument<T>(collectionName: string, document: T) {
  const collection = await getCollection(collectionName);
  return collection.insertOne(document);
}

// Create multiple documents in a collection
export async function createDocuments<T>(collectionName: string, documents: T[]) {
  const collection = await getCollection(collectionName);
  return collection.insertMany(documents);
}

// Find a document by ID
export async function findDocumentById<T>(collectionName: string, id: string) {
  const collection = await getCollection(collectionName);
  return collection.findOne({ _id: id } as any);
}

// Find documents by query
export async function findDocuments<T>(collectionName: string, query: any) {
  const collection = await getCollection(collectionName);
  return collection.find(query).toArray();
}

// Update a document by ID
export async function updateDocumentById<T>(collectionName: string, id: string, update: any) {
  const collection = await getCollection(collectionName);
  return collection.updateOne({ _id: id } as any, { $set: update });
}

// Delete a document by ID
export async function deleteDocumentById(collectionName: string, id: string) {
  const collection = await getCollection(collectionName);
  return collection.deleteOne({ _id: id } as any);
}
