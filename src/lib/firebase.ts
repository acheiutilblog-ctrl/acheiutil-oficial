import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  getDoc,
  setDoc,
  deleteDoc,
  onSnapshot,
  getDocFromServer,
  Firestore,
} from 'firebase/firestore';
import type { Product, SiteSettings } from '../types';
const firebaseConfig = {
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'gen-lang-client-0908329024',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:223732690666:web:234f752d2868ff8bca3193',
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyCmnlQrAYS5Ii20KG_dZ-2iL4iv6BsETUQ',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'gen-lang-client-0908329024.firebaseapp.com',
  firestoreDatabaseId: import.meta.env.VITE_FIREBASE_DATABASE_ID || 'ai-studio-acheiutilcom-a2f4d3a2-58a5-4ae7-900b-fa040ce3c56a',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'gen-lang-client-0908329024.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '223732690666'
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const db: Firestore = getFirestore(app, firebaseConfig.firestoreDatabaseId);

// Test connection as instructed in Firebase guidelines
export async function testConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firebase client is offline or configuration check needed.');
    }
    return false;
  }
}

// Fetch all products from Firestore
export async function fetchProductsFromFirestore(): Promise<Product[]> {
  try {
    const querySnapshot = await getDocs(collection(db, 'products'));
    const list: Product[] = [];
    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data() as Product;
      list.push(data);
    });

    // Sort descending by createdAt or updatedAt
    list.sort((a, b) => {
      const dateA = new Date(b.createdAt || b.updatedAt || 0).getTime();
      const dateB = new Date(a.createdAt || a.updatedAt || 0).getTime();
      return dateA - dateB;
    });

    return list;
  } catch (error) {
    console.error('Failed to fetch products from Firestore:', error);
    throw error;
  }
}

// Real-time listener for products
export function subscribeToProducts(
  onUpdate: (products: Product[]) => void,
  onError?: (error: Error) => void
) {
  return onSnapshot(
    collection(db, 'products'),
    (snapshot) => {
      const list: Product[] = [];
      snapshot.forEach((docSnap) => {
        list.push(docSnap.data() as Product);
      });
      list.sort((a, b) => {
        const dateA = new Date(b.createdAt || b.updatedAt || 0).getTime();
        const dateB = new Date(a.createdAt || a.updatedAt || 0).getTime();
        return dateA - dateB;
      });
      onUpdate(list);
    },
    (err) => {
      console.error('Firestore products real-time error:', err);
      if (onError) onError(err);
    }
  );
}

// Save or update a product in Firestore
export async function saveProductToFirestore(product: Product): Promise<void> {
  if (!product.id) {
    throw new Error('Product ID is required');
  }

  // Sanitize object to remove undefined values which Firestore rejects
  const clean = JSON.parse(JSON.stringify(product));
  clean.updatedAt = new Date().toISOString();
  if (!clean.createdAt) {
    clean.createdAt = clean.updatedAt;
  }

  await setDoc(doc(db, 'products', clean.id), clean);
}

// Delete product from Firestore
export async function deleteProductFromFirestore(id: string): Promise<void> {
  await deleteDoc(doc(db, 'products', id));
}

// Fetch global site settings
export async function fetchSettingsFromFirestore(): Promise<SiteSettings | null> {
  try {
    const docSnap = await getDoc(doc(db, 'settings', 'global'));
    if (docSnap.exists()) {
      return docSnap.data() as SiteSettings;
    }
    return null;
  } catch (error) {
    console.warn('Could not fetch settings from Firestore:', error);
    return null;
  }
}

// Save global site settings
export async function saveSettingsToFirestore(settings: SiteSettings): Promise<void> {
  const clean = JSON.parse(JSON.stringify(settings));
  await setDoc(doc(db, 'settings', 'global'), clean);
}
