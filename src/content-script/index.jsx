import 'github-markdown-css'
import { render } from 'preact'
import { unmountComponentAtNode } from 'preact/compat'
import ChatGPTCard from './ChatGPTCard'
import { config } from './search-engine-configs.mjs'
import './styles.scss'
import { getPossibleElementByQuerySelector } from './utils.mjs'

async function mount(question, siteConfig) {
  let container = document.createElement('div')
  container.className = 'chat-gpt-container'

  const chatGPTContainer = document.querySelector('.chat-gpt-container')
  if (chatGPTContainer) {
    console.log(`KEVINDEBUG container already exists`)
    renderOrUpdateCard(question, chatGPTContainer)
    return
  }

  container.classList.add('sidebar-free')
  const appendContainer = getPossibleElementByQuerySelector(siteConfig.appendContainerQuery)
  if (appendContainer) {
    appendContainer.appendChild(container)
  }

  renderOrUpdateCard(question, container)
}

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
  console.log('KEVINDEBUG Calling run')
  const searchInput = getPossibleElementByQuerySelector(siteConfig.inputQuery)

  if (searchInput) {
    searchInput.addEventListener('keydown', function (event) {
      // Check if the key that was pressed was the enter key
      if (event.key === 'Enter') {
        // The enter key was pressed
        mount(searchInput.value, siteConfig)
      }
    })
    console.log('KEVINDEBUG Mount ChatGPT on', siteName)
  }
}

run()

if (siteConfig.watchRouteChange) {
  siteConfig.watchRouteChange(run)
}

async function mountChatGPT(question) {
  let container = document.createElement('div')
  container.className = 'chat-gpt-container'

  const chatGPTContainer = document.querySelector('.chat-gpt-container')
  if (chatGPTContainer) {
    console.log(`KEVINDEBUG container already exists`)
    renderOrUpdateCard(question, chatGPTContainer)
    return
  }

  console.log(`KEVINDEBUG container doesn't exists`)
  container.classList.add('sidebar-free')
  const appendContainer = document.querySelector('div[data-test-id="content-below-tabs"]')
  if (appendContainer) {
    appendContainer.appendChild(container)
  }

  renderOrUpdateCard(question, container)
}

function addMessageReadChatGPTContainer() {
  let question = `can you provide me with a json payload for the below 
  email with following information likelyhood_of_reading(scale of 0 to 10), 
  type_of_message(personal, receipt, deal, flight, spam), summary, phonenumbers, bill_receipt, package_tracking_number, 
  reply, flight_number, airline, deals. Also if any of the asked information is not available please return null \n`

  question += document.querySelector('div[data-test-id="message-view-body"]').innerText
  mountChatGPT(question)
}

function addButtonOnMessageReadToolbar() {
  const toolbarContainer = document.querySelector('div[data-test-id="message-toolbar"] ul')
  const button = document.createElement('button')
  button.innerText = 'ChatGPTfy'
  button.onclick = addMessageReadChatGPTContainer
  toolbarContainer.appendChild(button)
}

function waitForMessageRead() {
  console.log('KEVINDEBUG add  1 a chatGPT button on the messageRead')
  const targetNode = document.querySelector("div[data-test-id='mail-app-component'] div")
  const observer = new MutationObserver(function (records) {
    for (const record of records) {
      if (record.type === 'childList') {
        for (const node of record.addedNodes) {
          if (node.getAttribute('data-test-id') === 'message-group-view') {
            console.log('KEVINDEBUG add a chatGPT button on the messageRead')
            addButtonOnMessageReadToolbar()
            return
          }
          if (node.getAttribute('data-test-id') === 'compose-styler') {
            console.log('KEVINDEBUG add a chatGPT to the compose')
            run()
            return
          }
        }
      }
    }
  })
  observer.observe(targetNode, { childList: true })
}

waitForMessageRead()
