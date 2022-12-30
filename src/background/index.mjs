import ExpiryMap from 'expiry-map'
import { v4 as uuidv4 } from 'uuid'
import Browser from 'webextension-polyfill'
import { sendMessageFeedback, setConversationProperty } from './chatgpt.mjs'
import { fetchSSE } from './fetch-sse.mjs'

const KEY_ACCESS_TOKEN = 'accessToken'

const cache = new ExpiryMap(10 * 1000)

async function getAccessToken() {
  if (cache.get(KEY_ACCESS_TOKEN)) {
    return cache.get(KEY_ACCESS_TOKEN)
  }
  const resp = await fetch('https://chat.openai.com/api/auth/session')
  if (resp.status === 403) {
    throw new Error('CLOUDFLARE')
  }
  const data = await resp.json().catch(() => ({}))
  if (!data.accessToken) {
    throw new Error('UNAUTHORIZED')
  }
  cache.set(KEY_ACCESS_TOKEN, data.accessToken)
  return data.accessToken
}

const deleteConversation = async (conversationId) => {
  const accessToken = await getAccessToken()
  await setConversationProperty(accessToken, conversationId, { is_visible: false })
}

async function generateAnswers(port, question, conversationId, parentMessageId) {
  if (!question) {
    throw new Error('Question not found')
  }
  const accessToken = await getAccessToken()
  const controller = new AbortController()
  port.onDisconnect.addListener(() => {
    controller.abort()
    // if (conversationId) {
    //   deleteConversation(conversationId)
    // }
  })

  const payload = {
    action: 'next',
    messages: [
      {
        id: uuidv4(),
        role: 'user',
        content: {
          content_type: 'text',
          parts: [question],
        },
      },
    ],
    model: 'text-davinci-002-render',
    parent_message_id: parentMessageId ?? uuidv4(),
  }

  if (conversationId) {
    payload.conversation_id = conversationId
  }

  await fetchSSE('https://chat.openai.com/backend-api/conversation', {
    method: 'POST',
    signal: controller.signal,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(payload),
    onMessage(message) {
      console.debug('sse message', message)
      if (message === '[DONE]') {
        port.postMessage({ event: 'DONE' })
        return
      }
      const data = JSON.parse(message)
      const text = data.message?.content?.parts?.[0]
      conversationId = data.conversation_id
      if (text) {
        port.postMessage({
          text,
          messageId: data.message.id,
          conversationId: data.conversation_id,
        })
      }
    },
  })
}

Browser.runtime.onConnect.addListener((port) => {
  port.onMessage.addListener(async (msg) => {
    try {
      if (msg.command == 'deleteConversation') {
        await deleteConversation(msg.conversationId)
      } else {
        await generateAnswers(port, msg.question, msg.conversationId, msg.parentMessageId)
      }
    } catch (err) {
      console.error(err)
      port.postMessage({ error: err.message })
      cache.delete(KEY_ACCESS_TOKEN)
    }
  })
})

Browser.runtime.onMessage.addListener(async (message) => {
  if (message.type === 'FEEDBACK') {
    const token = await getAccessToken()
    await sendMessageFeedback(token, message.data)
  }
})
