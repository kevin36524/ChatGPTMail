export function getPossibleElementByQuerySelector(queryArray) {
  for (const query of queryArray) {
    const element = document.querySelector(query)
    if (element) {
      return element
    }
  }
}

export function endsWithQuestionMark(question) {
  return (
    question.endsWith('?') || // ASCII
    question.endsWith('？') || // Chinese/Japanese
    question.endsWith('؟') || // Arabic
    question.endsWith('⸮') // Arabic
  )
}

export function isBraveBrowser() {
  return navigator.brave?.isBrave()
}

export async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text)
  } catch (error) {
    console.error('Failed to copy to clipboard: ', error)
  }
}
