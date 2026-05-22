const SECRET_PASSPHRASE = 'my-glow-firestore-secret-2026'
const SALT = 'my-glow-firestore-salt'
const IV_LENGTH = 12
const ENCRYPTION_ALGORITHM = 'AES-GCM'
const PBKDF2_ITERATIONS = 250000

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  let binary = ''
  const bytes = new Uint8Array(buffer)
  const chunkSize = 0x8000
  for (let i = 0; i < bytes.length; i += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize))
  }
  return btoa(binary)
}

function base64ToArrayBuffer(base64: string): ArrayBuffer {
  const binary = atob(base64)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i)
  }
  return bytes.buffer
}

async function getEncryptionKey(): Promise<CryptoKey> {
  const encoder = new TextEncoder()
  const passphraseKey = await crypto.subtle.importKey(
    'raw',
    encoder.encode(SECRET_PASSPHRASE),
    'PBKDF2',
    false,
    ['deriveKey']
  )

  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: encoder.encode(SALT),
      iterations: PBKDF2_ITERATIONS,
      hash: 'SHA-256'
    },
    passphraseKey,
    {
      name: ENCRYPTION_ALGORITHM,
      length: 256
    },
    false,
    ['encrypt', 'decrypt']
  )
}

export async function encryptText(value: string): Promise<string> {
  const encoder = new TextEncoder()
  const iv = crypto.getRandomValues(new Uint8Array(IV_LENGTH))
  const key = await getEncryptionKey()
  const encrypted = await crypto.subtle.encrypt(
    {
      name: ENCRYPTION_ALGORITHM,
      iv
    },
    key,
    encoder.encode(value)
  )

  return `${arrayBufferToBase64(iv.buffer)}:${arrayBufferToBase64(encrypted)}`
}

export async function decryptText(value: string): Promise<string> {
  const [ivBase64, dataBase64] = value.split(':')
  if (!ivBase64 || !dataBase64) {
    throw new Error('Formato de texto cifrado inválido')
  }

  const iv = new Uint8Array(base64ToArrayBuffer(ivBase64))
  const data = base64ToArrayBuffer(dataBase64)
  const key = await getEncryptionKey()
  const decrypted = await crypto.subtle.decrypt(
    {
      name: ENCRYPTION_ALGORITHM,
      iv
    },
    key,
    data
  )

  return new TextDecoder().decode(decrypted)
}
