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
import firebaseConfig from '../../firebase-applet-config.json';

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
