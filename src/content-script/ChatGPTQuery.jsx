import { useEffect, useState } from 'preact/hooks'
import PropTypes from 'prop-types'
import { memo } from 'react'
import ReactMarkdown from 'react-markdown'
import rehypeHighlight from 'rehype-highlight'
import Browser from 'webextension-polyfill'
import ChatGPTFeedback from './ChatGPTFeedback'
import { copyToClipboard, isBraveBrowser } from './utils.mjs'
import './highlight.scss'

function ChatGPTQuery(props) {
  const [answer, setAnswer] = useState(null)
  const [error, setError] = useState('')
  const [retry, setRetry] = useState(0)
  const [, setDone] = useState(false)

  const copyAnswerToClipboard = () => {
    copyToClipboard(answer.text)
  }

  useEffect(() => {
    const port = Browser.runtime.connect()
    const listener = (msg) => {
      if (msg.text) {
        setAnswer(msg)
      } else if (msg.error) {
        setError(msg.error)
      } else if (msg.event === 'DONE') {
        setDone(true)
      }
    }
    port.onMessage.addListener(listener)
    port.postMessage({ question: props.question })
    return () => {
      port.onMessage.removeListener(listener)
      port.disconnect()
    }
  }, [props.question, retry])

  // retry error on focus
  useEffect(() => {
    const onFocus = () => {
      if (error && (error == 'UNAUTHORIZED' || error === 'CLOUDFLARE')) {
        setError('')
        setRetry((r) => r + 1)
      }
    }
    window.addEventListener('focus', onFocus)
    return () => {
      window.removeEventListener('focus', onFocus)
    }
  }, [error])

  if (answer) {
    return (
      <div id="answer" className="markdown-body gpt-inner" dir="auto">
        <div className="gpt-header">
          <p>ChatGPT</p>
          <ChatGPTFeedback
            messageId={answer.messageId}
            conversationId={answer.conversationId}
            closeCallback={props.closeCallback}
            copyCallback={copyAnswerToClipboard}
          />
        </div>
        <ReactMarkdown rehypePlugins={[[rehypeHighlight, { detect: true }]]}>
          {answer.text}
        </ReactMarkdown>
      </div>
    )
  }

  if (error === 'UNAUTHORIZED' || error === 'CLOUDFLARE') {
    return (
      <p className="gpt-inner">
        Please login and pass Cloudflare check at{' '}
        <a href="https://chat.openai.com" target="_blank" rel="noreferrer">
          chat.openai.com
        </a>
        {isBraveBrowser() && retry > 0 && (
          <span>
            <br />
            Still not working? Follow{' '}
            <a href="https://github.com/wong2/chat-gpt-google-extension#troubleshooting">
              Brave Troubleshooting
            </a>
          </span>
        )}
      </p>
    )
  }
  if (error) {
    return (
      <p className="gpt-inner">
        Failed to load response from ChatGPT:
        <br /> {error}
      </p>
    )
  }

  return <p className="gpt-loading gpt-inner">Waiting for ChatGPT response...</p>
}

ChatGPTQuery.propTypes = {
  question: PropTypes.string.isRequired,
  closeCallback: PropTypes.func.isRequired,
}

export default memo(ChatGPTQuery)
