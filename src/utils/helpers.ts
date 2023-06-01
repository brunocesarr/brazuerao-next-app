import CryptoJS from 'crypto-js'

const keyCrypto: string = 'sw'

function encryptStringValue(value: string): string {
  if (!value) return ''

  const encryptedValue = CryptoJS.AES.encrypt(value, keyCrypto, {
    mode: CryptoJS.mode.CFB,
    padding: CryptoJS.pad.AnsiX923,
  })
  return encryptedValue.toString()
}

function decryptStringValue(value: string): string {
  if (!value) return ''

  const bytes = CryptoJS.AES.decrypt(value, keyCrypto, {
    mode: CryptoJS.mode.CFB,
    padding: CryptoJS.pad.AnsiX923,
  })
  const decryptedValue = bytes.toString(CryptoJS.enc.Utf8)

  return decryptedValue
}

export { encryptStringValue, decryptStringValue }
