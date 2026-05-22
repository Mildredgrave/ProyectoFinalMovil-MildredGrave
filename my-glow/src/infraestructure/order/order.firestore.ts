import { collection, doc, onSnapshot, orderBy, query, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore'
import type { Order } from '../../domain/order/order.type'
import { db } from '../firebase/firebase.config'
import { decryptText, encryptText } from '../crypto/encryption.util'

const ORDERS_COLLECTION = 'orders'

export async function saveOrderFirestore(order: Order): Promise<void> {
  const orderRef = doc(db, ORDERS_COLLECTION, order.id)
  await setDoc(orderRef, {
    ...order,
    payment: {
      method: order.payment.method,
      cardHolder: await encryptText(order.payment.cardHolder),
      cardNumberMasked: await encryptText(order.payment.cardNumberMasked),
      expiry: await encryptText(order.payment.expiry)
    },
    date: order.date,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  })
}

export function subscribeOrdersRealtime(onChange: (orders: Order[]) => void): () => void {
  const ordersRef = collection(db, ORDERS_COLLECTION)
  const q = query(ordersRef, orderBy('date', 'desc'))

  const unsubscribe = onSnapshot(q, async (snapshot) => {
    const orders: Order[] = await Promise.all(snapshot.docs.map(async (docSnapshot) => {
      const data = docSnapshot.data()
      let decryptedPayment = data.payment as Order['payment']

      try {
        decryptedPayment = {
          method: data.payment.method as Order['payment']['method'],
          cardHolder: await decryptText(data.payment.cardHolder as string),
          cardNumberMasked: await decryptText(data.payment.cardNumberMasked as string),
          expiry: await decryptText(data.payment.expiry as string)
        }
      } catch (error) {
        console.error('Error al descifrar datos de pago:', error)
      }

      return {
        id: docSnapshot.id,
        user: data.user as Order['user'],
        items: data.items as Order['items'],
        total: data.total as number,
        date: data.date?.toDate ? data.date.toDate() : (data.date as unknown as Date),
        status: data.status as Order['status'],
        delivery: data.delivery as Order['delivery'],
        payment: decryptedPayment
      }
    }))
    onChange(orders)
  })

  return unsubscribe
}

export async function updateOrderStatusFirestore(orderId: string, status: Order['status']): Promise<void> {
  const orderRef = doc(db, ORDERS_COLLECTION, orderId)
  await updateDoc(orderRef, {
    status,
    updatedAt: serverTimestamp()
  })
}
