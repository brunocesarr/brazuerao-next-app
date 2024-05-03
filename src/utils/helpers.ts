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

function groupBy<T>(arr: T[], fn: (item: T) => any) {
  return arr.reduce<Record<string, T[]>>((prev, curr) => {
    const groupKey = fn(curr)
    const group = prev[groupKey] || []
    group.push(curr)
    return { ...prev, [groupKey]: group }
  }, {})
}

function titleCaseWord(word: string) {
  if (!word) return word
  return word[0].toUpperCase() + word.substr(1).toLowerCase()
}

export { encryptStringValue, decryptStringValue, groupBy, titleCaseWord }
