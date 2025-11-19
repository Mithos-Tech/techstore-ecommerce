
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, doc, getDoc, deleteDoc, addDoc, Timestamp, writeBatch, increment, updateDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import type { Product, Order } from './types';

// Helper to safely get env variables in Vite or other environments
const getEnv = (key: string) => {
  // @ts-ignore
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    // @ts-ignore
    return import.meta.env[key];
  }
  // @ts-ignore
  if (typeof process !== 'undefined' && process.env) {
    return process.env[key];
  }
  return '';
};

const apiKey = getEnv('VITE_FIREBASE_API_KEY');

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: apiKey,
  authDomain: getEnv('VITE_FIREBASE_AUTH_DOMAIN'),
  projectId: getEnv('VITE_FIREBASE_PROJECT_ID'),
  storageBucket: getEnv('VITE_FIREBASE_STORAGE_BUCKET'),
  messagingSenderId: getEnv('VITE_FIREBASE_MESSAGING_SENDER_ID'),
  appId: getEnv('VITE_FIREBASE_APP_ID')
};

// Initialize Firebase only if config is present
let app;
let db: any;
let auth: any;
let storage: any;

if (apiKey && apiKey.length > 0 && apiKey !== 'undefined') {
    try {
        app = initializeApp(firebaseConfig);
        db = getFirestore(app);
        auth = getAuth(app);
        storage = getStorage(app);
    } catch (error) {
        console.error("Error initializing Firebase instance:", error);
    }
} else {
    console.warn("⚠️ Firebase API Key missing or invalid. The app will run in 'Offline/Demo' mode. Backend features will not work.");
}

export { db, auth, storage };

// Helper functions to interact with Firestore

export async function getCollection<T>(collectionName: string): Promise<T[]> {
  if (!db) return [];
  try {
    const querySnapshot = await getDocs(collection(db, collectionName));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as T));
  } catch (error) {
    console.error(`Error getting collection ${collectionName}:`, error);
    return [];
  }
}

export async function getProductById(id: string): Promise<Product | null> {
  if (!db) return null;
  try {
    const docRef = doc(db, 'products', id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Product;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error getting product by ID:", error);
    return null;
  }
}

export async function deleteProduct(id: string): Promise<void> {
    if (!db) return;
    try {
        await deleteDoc(doc(db, 'products', id));
    } catch (error) {
        console.error("Error deleting product:", error);
    }
}

// ADVANCED: Save order and update stock atomically using Batch
export async function saveOrder(orderData: Omit<Order, 'id' | 'date'>): Promise<string> {
    if (!db) throw new Error("Database not initialized");
    
    try {
        const batch = writeBatch(db);
        
        // 1. Create reference for new order
        const orderRef = doc(collection(db, "ordenes"));
        
        batch.set(orderRef, {
            ...orderData,
            date: Timestamp.fromDate(new Date())
        });

        // 2. Decrement stock for each product in the order
        for (const item of orderData.products) {
            // Note: Ideally we should check if stock >= quantity inside a Transaction for strict safety,
            // but for this scope, atomic increment(-qty) is sufficient to ensure data consistency.
            const productRef = doc(db, "productos", item.id);
            batch.update(productRef, {
                stock: increment(-item.quantity)
            });
        }

        // 3. Commit all changes efficiently
        await batch.commit();
        
        return orderRef.id;
    } catch (error) {
        console.error("Error saving order and updating stock:", error);
        throw new Error("Could not save the order.");
    }
}

export async function getOrderById(id: string): Promise<Order | null> {
    if (!db) return null;
    try {
        const docRef = doc(db, 'ordenes', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            const data = docSnap.data();
            const dateStr = data.date && typeof data.date.toDate === 'function' 
                ? data.date.toDate().toISOString() 
                : new Date().toISOString();

            const order: Order = { 
                id: docSnap.id, 
                ...data,
                date: dateStr
            } as Order;
            return order;
        } else {
            return null;
        }
    } catch (error) {
        console.error("Error getting order by ID:", error);
        return null;
    }
}

export async function getOrders(): Promise<Order[]> {
    if (!db) return [];
    try {
      // In a real app, consider orderBy('date', 'desc') and limit()
      const querySnapshot = await getDocs(collection(db, 'ordenes'));
      return querySnapshot.docs.map(doc => {
        const data = doc.data();
        const dateStr = data.date && typeof data.date.toDate === 'function' 
            ? data.date.toDate().toISOString() 
            : new Date().toISOString();
        return {
          id: doc.id,
          ...data,
          date: dateStr,
        } as Order;
      }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()); // Sort DESC in client
    } catch (error) {
      console.error("Error getting orders:", error);
      return [];
    }
}

export async function updateOrderStatus(orderId: string, status: string): Promise<void> {
    if (!db) return;
    try {
        const orderRef = doc(db, 'ordenes', orderId);
        await updateDoc(orderRef, { status });
    } catch (error) {
        console.error("Error updating order status:", error);
        throw error;
    }
}

export async function deleteOrder(orderId: string): Promise<void> {
    if (!db) return;
    try {
        await deleteDoc(doc(db, 'ordenes', orderId));
    } catch (error) {
        console.error("Error deleting order:", error);
        throw error;
    }
}
