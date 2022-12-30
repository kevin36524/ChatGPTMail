import 'github-markdown-css'
import { render } from 'preact'
import { unmountComponentAtNode } from 'preact/compat'
import { getUserConfig, keys } from '../config'
import ChatGPTCard from './ChatGPTCard'
import { config } from './email-site-configs.mjs'
import './styles.scss'
import { getPossibleElementByQuerySelector } from './utils.mjs'

const renderOrUpdateCard = (question, container) => {
  render(
    <ChatGPTCard
      question={question}
      triggerMode={'always'}
      closeCallback={() => {
        const siderbarContainer = document.querySelector('.sidebar-free')
        unmountComponentAtNode(siderbarContainer)
        siderbarContainer.parentElement.removeChild(siderbarContainer)
      }}
    />,
    container,
  )
}

const siteRegex = new RegExp(Object.keys(config).join('|'))
const siteName = location.hostname.match(siteRegex)[0]
const siteConfig = config[siteName]

function run() {
  const searchInput = getPossibleElementByQuerySelector(siteConfig.inputQuery)

  if (searchInput) {
    searchInput.addEventListener('keydown', function (event) {
      // Check if the key that was pressed was the enter key
      if (event.key === 'Enter') {
        // The enter key was pressed
        mountChatGPT(searchInput.value)
      }
    })
  }
}

run()

async function mountChatGPT(question) {
  let container = document.createElement('div')
  container.className = 'chat-gpt-container'

  const chatGPTContainer = document.querySelector('.chat-gpt-container')
  if (chatGPTContainer) {
    renderOrUpdateCard(question, chatGPTContainer)
    return
  }

  container.classList.add('sidebar-free')
  const appendContainer = document.querySelector('div[data-test-id="content-below-tabs"]')
  if (appendContainer) {
    appendContainer.appendChild(container)
  }

  renderOrUpdateCard(question, container)
}

async function addMessageReadChatGPTContainer() {
  let question = await getUserConfig(keys.MESSAGE_PREPEND_QUERY)

  question += document.querySelector('div[data-test-id="message-view-body"]').innerText
  mountChatGPT(question)
}

function addButtonOnMessageReadToolbar() {
  const toolbarContainer = document.querySelector('div[data-test-id="message-toolbar"] ul')
  const messageReadView = document.querySelector("div[data-test-id='message-group-view']")
  if (!messageReadView) {
    return
  }
  const button = document.createElement('button')
  button.innerText = 'ChatGPTfy'
  button.onclick = addMessageReadChatGPTContainer
  toolbarContainer.appendChild(button)
}

function waitForMessageReadOrCompose() {
  const targetNode = document.querySelector("div[data-test-id='mail-app-component'] div")
  const observer = new MutationObserver(function (records) {
    for (const record of records) {
      if (record.type === 'childList') {
        for (const node of record.addedNodes) {
          if (node.getAttribute('data-test-id') === 'message-group-view') {
            addButtonOnMessageReadToolbar()
            return
          }
          if (node.getAttribute('data-test-id') === 'compose-styler') {
            run()
            return
          }
        }
      }
    }
  })
  observer.observe(targetNode, { childList: true })
}

addButtonOnMessageReadToolbar()
waitForMessageReadOrCompose()
