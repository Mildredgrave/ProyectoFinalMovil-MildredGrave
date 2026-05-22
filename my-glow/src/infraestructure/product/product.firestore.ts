import { collection, onSnapshot, orderBy, query, addDoc, deleteDoc, doc, serverTimestamp, updateDoc } from "firebase/firestore";
import type { Product } from "../../domain/product/product.type";
import { db } from "../firebase/firebase.config";

const PRODUCTS_COLLECTION = "products";

export function subscribeProductsRealtime(
  onChange: (products: Product[]) => void
): () => void {
  const productsRef = collection(db, PRODUCTS_COLLECTION);
  const q = query(productsRef, orderBy("name", "asc"));

  return onSnapshot(q, (snapshot) => {
    const products: Product[] = snapshot.docs.map((document) => {
      const data = document.data();
      return {
        id: document.id,
        name: data.name as string,
        brand: data.brand as string,
        category: data.category as string,
        price: data.price as number,
        image: data.image as string,
        stock: data.stock as number,
        skinType: data.skinType as Product["skinType"],
      };
    });

    onChange(products);
  });
}

export async function addProduct(
  productData: Omit<Product, 'id'>
): Promise<string> {
  const productsRef = collection(db, PRODUCTS_COLLECTION);
  const docData: Partial<Omit<Product, 'id'>> & { createdAt: any; updatedAt: any } = {
    name: productData.name,
    brand: productData.brand,
    category: productData.category,
    price: productData.price,
    image: productData.image,
    stock: productData.stock,
    skinType: productData.skinType,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  }

  if (productData.step) {
    docData.step = productData.step
  }

  if (productData.ingredients) {
    docData.ingredients = productData.ingredients
  }

  const docRef = await addDoc(productsRef, docData);
  return docRef.id;
}

export async function deleteProduct(productId: string): Promise<void> {
  const productRef = doc(db, PRODUCTS_COLLECTION, productId);
  await deleteDoc(productRef);
}

export async function updateProduct(
  productId: string,
  productData: Partial<Omit<Product, 'id'>>
): Promise<void> {
  const productRef = doc(db, PRODUCTS_COLLECTION, productId);
  await updateDoc(productRef, {
    ...productData,
    updatedAt: serverTimestamp(),
  });
}

export async function updateProductStock(productId: string, newStock: number): Promise<void> {
  const productRef = doc(db, PRODUCTS_COLLECTION, productId);
  await updateDoc(productRef, {
    stock: newStock,
    updatedAt: serverTimestamp()
  });
}
