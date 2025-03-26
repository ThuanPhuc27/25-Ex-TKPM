import { ALLOWED_EMAIL_DOMAIN } from '../const/index'
import { getCountryCodeFromCountryName } from 'country-codes-flags-phone-codes'
import { parsePhoneNumberFromString } from 'libphonenumber-js'

export const isValidEmail = (email) => {
  const emailRegex = /^[\w.-]+@[\w.-]+\.[a-zA-Z]{2,}$/
  return emailRegex.test(email) && email.endsWith(ALLOWED_EMAIL_DOMAIN)
}

export const isValidPhoneNumber = (country, phoneNumber) => {
  const countrycode = getCountryCodeFromCountryName(country)
  const phone = parsePhoneNumberFromString(phoneNumber, countrycode)
  return phone ? phone.isValid() : false
}

export const isValidStudentStatus = (currentStatus, newStatus) => {
  const validTransitions = {
    'Đang học': ['Bảo lưu', 'Tốt nghiệp', 'Đình chỉ'],
    'Bảo lưu': ['Đang học', 'Đình chỉ'],
    'Đình chỉ': ['Đang học'],
    'Tốt nghiệp': [], // Không thể thay đổi lại
  }

  return validTransitions[currentStatus]?.includes(newStatus) || false
}
