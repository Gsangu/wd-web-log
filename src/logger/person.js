/*
 * FileName: person.js
 * Project: wd-web-log
 * Author: Gsan
 * File Created: Monday, 1st March 2021 4:45:10 pm
 * Last Modified: Monday, 1st March 2021 4:45:11 pm
 * Modified By: Gsan
 */
const WebLogger = async ({ debug = false, config = {} }) => {
  if (debug) {
    console.log('init person', config)
  }
  return {
    send() {
      return
    },
  }
}
export default WebLogger
