import { collection, query, where, getDocs, addDoc, serverTimestamp } from "firebase/firestore";
import type { User } from "../../domain/user/user.type";
import { db } from "../firebase/firebase.config";
import { encryptText } from "../crypto/encryption.util";

const USERS_COLLECTION = "users";

export async function findUserByEmailFirestore(email: string): Promise<User | null> {
  try {
    const usersRef = collection(db, USERS_COLLECTION);
    const q = query(usersRef, where("email", "==", email.toLowerCase()));
    const snapshot = await getDocs(q);
    
    if (snapshot.empty) {
      return null;
    }
    
    const doc = snapshot.docs[0];
    return {
      id: doc.id,
      name: doc.data().name as string,
      email: doc.data().email as string,
      role: doc.data().role as User["role"],
    };
  } catch (error) {
    console.error("Error al buscar usuario en Firestore:", error);
    return null;
  }
}

export async function saveUserFirestore(user: User, password: string): Promise<string> {
  try {
    const usersRef = collection(db, USERS_COLLECTION);
    const encryptedPassword = await encryptText(password);
    const docRef = await addDoc(usersRef, {
      name: user.name,
      email: user.email.toLowerCase(),
      password: encryptedPassword,
      role: user.role,
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    console.error("Error al guardar usuario en Firestore:", error);
    throw error;
  }
}

export async function createAdminIfNotExists(): Promise<void> {
  try {
    const adminEmail = "admin@myglow.com";
    const existingAdmin = await findUserByEmailFirestore(adminEmail);
    
    if (!existingAdmin) {
      await saveUserFirestore(
        {
          id: "admin-001",
          name: "Administrador",
          email: adminEmail,
          role: "admin"
        },
        "33582525"
      );
    }
  } catch (error) {
    console.error("Error al crear admin:", error);
  }
}
