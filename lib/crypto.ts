import { createCipheriv, createDecipheriv, randomBytes } from "node:crypto"

// Formato almacenado: "enc:v1:<iv>:<authTag>:<ciphertext>" (todo hex)
// El prefijo "enc:v1:" permite detectar si un campo ya fue cifrado o sigue en texto plano
const PREFIX = "enc:v1:"
const ALGORITHM = "aes-256-gcm"

function getKey(): Buffer {
  const hex = process.env.ENCRYPTION_KEY
  if (!hex || hex.length !== 64) {
    throw new Error("[crypto] ENCRYPTION_KEY no está configurada o tiene formato inválido (debe ser 64 chars hex)")
  }
  return Buffer.from(hex, "hex")
}

/**
 * Cifra un texto plano. Retorna string con prefijo enc:v1:
 * Si el valor está vacío o ya está cifrado, lo retorna sin tocar.
 */
export function encrypt(plaintext: string): string {
  if (!plaintext || plaintext.startsWith(PREFIX)) return plaintext

  const key = getKey()
  const iv = randomBytes(12) // 96 bits para GCM
  const cipher = createCipheriv(ALGORITHM, key, iv)

  const encrypted = Buffer.concat([cipher.update(plaintext, "utf8"), cipher.final()])
  const authTag = cipher.getAuthTag()

  return PREFIX + iv.toString("hex") + ":" + authTag.toString("hex") + ":" + encrypted.toString("hex")
}

/**
 * Descifra un string cifrado. Si no tiene el prefijo enc:v1:, lo retorna tal cual
 * (compatibilidad con registros viejos en texto plano durante la migración).
 */
export function decrypt(ciphertext: string): string {
  if (!ciphertext || !ciphertext.startsWith(PREFIX)) return ciphertext

  const key = getKey()
  const parts = ciphertext.slice(PREFIX.length).split(":")

  if (parts.length !== 3) throw new Error("[crypto] Formato de ciphertext inválido")

  const [ivHex, authTagHex, encryptedHex] = parts
  const iv = Buffer.from(ivHex, "hex")
  const authTag = Buffer.from(authTagHex, "hex")
  const encrypted = Buffer.from(encryptedHex, "hex")

  const decipher = createDecipheriv(ALGORITHM, key, iv)
  decipher.setAuthTag(authTag)

  return Buffer.concat([decipher.update(encrypted), decipher.final()]).toString("utf8")
}

/**
 * Descifra un objeto: solo procesa los campos indicados en `fields`.
 * Útil para descifrar un registro de Supabase antes de usarlo.
 */
export function decryptFields<T extends Record<string, any>>(obj: T, fields: (keyof T)[]): T {
  const result = { ...obj }
  for (const field of fields) {
    if (result[field] && typeof result[field] === "string") {
      result[field] = decrypt(result[field] as string) as T[keyof T]
    }
  }
  return result
}

/**
 * Cifra un objeto: solo procesa los campos indicados en `fields`.
 * Útil para cifrar antes de guardar en Supabase.
 */
export function encryptFields<T extends Record<string, any>>(obj: T, fields: (keyof T)[]): T {
  const result = { ...obj }
  for (const field of fields) {
    if (result[field] && typeof result[field] === "string") {
      result[field] = encrypt(result[field] as string) as T[keyof T]
    }
  }
  return result
}
