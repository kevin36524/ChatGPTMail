import 'github-markdown-css'
import { render } from 'preact'
import { getUserConfig } from '../config'
import ChatGPTCard from './ChatGPTCard'
import { config } from './search-engine-configs.mjs'
import './styles.scss'
import { getPossibleElementByQuerySelector } from './utils.mjs'

async function mount(question, siteConfig) {
  const container = document.createElement('div')
  container.className = 'chat-gpt-container'

  const siderbarContainer = document.querySelector('.sidebar-free')
  if (siderbarContainer) {
    siderbarContainer.parentElement.removeChild(siderbarContainer)
  }

  container.classList.add('sidebar-free')
  const appendContainer = getPossibleElementByQuerySelector(siteConfig.appendContainerQuery)
  if (appendContainer) {
    appendContainer.appendChild(container)
  }

  const userConfig = await getUserConfig()
  render(
    <ChatGPTCard
      question={question}
      triggerMode={userConfig.triggerMode || 'always'}
      closeCallback={() => {
        const siderbarContainer = document.querySelector('.sidebar-free')
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
