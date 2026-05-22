import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import type { Product } from "../../domain/product/product.type";
import { db } from "../firebase/firebase.config";

const PRODUCTS_COLLECTION = "products";

type CreateProductInput = Omit<Product, "id">;

export async function createProductInFirestore(
  input: CreateProductInput
): Promise<void> {
  await addDoc(collection(db, PRODUCTS_COLLECTION), {
    name: input.name,
    brand: input.brand,
    category: input.category,
    price: input.price,
    image: input.image,
    stock: input.stock,
    skinType: input.skinType,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function updateProductStockInFirestore(
  productId: string,
  stock: number
): Promise<void> {
  const productRef = doc(db, PRODUCTS_COLLECTION, productId);

  await updateDoc(productRef, {
    stock,
    updatedAt: serverTimestamp(),
  });
}

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
