/**
 * @typedef {object} SiteConfig
 * @property {string[]} inputQuery - for subject box
 * @property {string[]} sidebarContainerQuery - prepend child to
 * @property {string[]} appendContainerQuery - if sidebarContainer not exists, append child to
 */

/**
 * @type {Object.<string,SiteConfig>}
 */
export const config = {
  yahoo: {
    inputQuery: ["input[data-test-id='compose-subject']"],
    sidebarContainerQuery: ['.siderbar-free'],
    appendContainerQuery: ["div[data-test-id='compact-compose-container']"],
  },
}
