import { getCountryCodeFromCountryName } from 'country-codes-flags-phone-codes'
import { parsePhoneNumberFromString } from 'libphonenumber-js'
const LOCAL_STORAGE_KEY = 'ALLOWED_EMAIL_DOMAINS'

export const isValidEmail = (email) => {
  const emailRegex = /^[\w.-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

  if (!emailRegex.test(email)) return false

  // Lấy danh sách domain từ localStorage
  const storedDomains = localStorage.getItem(LOCAL_STORAGE_KEY)
  const allowedDomains = storedDomains ? JSON.parse(storedDomains) : []

  return allowedDomains.some((domain) =>
    email.toLowerCase().endsWith(domain.toLowerCase()),
  )
}

export const isValidPhoneNumber = (country, phoneNumber) => {
  const countrycode = getCountryCodeFromCountryName(country)
  const phone = parsePhoneNumberFromString(phoneNumber, countrycode)
  return phone ? phone.isValid() : false
}
