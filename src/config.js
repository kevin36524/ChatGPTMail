import Browser from 'webextension-polyfill'

export const keys = {
  MESSAGE_PREPEND_QUERY: 'messageReadPrependQuery',
}

const defaultValues = {
  messageReadPrependQuery: `Can you provide me with a json payload(in markdown) for the below 
  email with following information likelyhood_of_reading(scale of 0 to 10), 
  type_of_message(personal, receipt, deal, flight, spam), summary, phonenumbers, bill_receipt, package_tracking_number, 
  reply, flight_number, airline, deals. Also if any of the asked information is not available please return null \n`,
}

export async function getUserConfig(key) {
  const config = await Browser.storage.local.get([key])
  return config[key] || defaultValues[key]
}

export async function updateUserConfig(updates) {
  return Browser.storage.local.set(updates)
}

export async function deleteKey(key) {
  return Browser.storage.local.remove([key])
}
