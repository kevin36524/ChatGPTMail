# ChatGPT Yahoo Mail Chrome extension 

A browser extension to help compose and consume Mails with ChatGPT.

Check out the video [here](https://www.youtube.com/watch?v=poT70lHWJDg)

## Features
- Compose emails based on a subject: Simply type in a subject and the extension will generate a draft email for you based on that subject.

- Analyze emails and generate insights: The extension can analyze your emails and provide insights such as key phrases and sentiment analysis.

- Answer follow-up questions: Have a question about an email you received? The extension can help you find the answer by searching through your emails and providing relevant information.


## Screenshots

<img width="1728" alt="image" src="https://user-images.githubusercontent.com/349873/210038070-bb779513-533b-40f5-9e60-7dc91b9e1dc4.png">
<img width="1716" alt="image" src="https://user-images.githubusercontent.com/349873/210038278-389293c4-e330-4301-8248-e6c00e3080ae.png">
<img width="1724" alt="image" src="https://user-images.githubusercontent.com/349873/210038326-ec1b4f26-c325-4b08-a569-20df193d3c76.png">

## Installation

#### Install from Chrome Store (Preffered)

https://chrome.google.com/webstore/detail/chatgpt-for-yahoo-mail/kmgiileoaajaicaolhcopgjgmbajkpee


#### Local Install

1. Download `chromium.zip` from [Releases](https://github.com/kevin36524/ChatGPTMail/releases).
2. Unzip the file.
3. In Chrome/Edge go to the extensions page (`chrome://extensions` or `edge://extensions`).
4. Enable Developer Mode.
5. Drag the unzipped folder anywhere on the page to import it (do not delete the folder afterwards).


#### Build from source

1. Clone the repo
2. Install dependencies with `npm`
3. `npm run build`
4. Load `build/chromium/` or `build/firefox/` directory to your browser



## Usage

#### Compose

1. Open https://chat.openai.com/ and ensure you are properly logged in.
2. Go to https://mail.yahoo.com and open Compose.
3. Now type your command in the subject area eg: "Write an email wishing merry Christmas to my boss"
4. Hit enter while being focused on the subject. Watch the ChatGPT window pop up and provide you with the response.
5. You can ask for followup questions for the same email by typing in the text-area of the ChatGPT pop-up. eg: "Make it more verbose".

#### Message Read synopsis

1. Open https://chat.openai.com/ and ensure you are properly logged in.
2. Go to https://mail.yahoo.com and open any email you are interested in.
3. You should see a `ChatGPTfy` button on the toolbar.
4. Click on the button. This should pop-up a ChatGPT window on the right side of the screen and provide you with extraction from the email.
5. You can also ask for follow-up question for the same email by asking stuff like "Generate a reply to this email thanking for the information"

#### Update the default query for `ChatGPTfy` button for MessageRead.

- The way ChatGPTfy works is that we construct a query asking ChatGPT to extract meaningful info from the text of the email body.
- So if you wish you can change the default query to ChatGPT by doing the following

1. Tap on the extensions button next to the address bar in Chrome.
2. Now tap on the ChatGPT for Yahoo Mail 
3. This will bring up a text area where you can enter your own default query eg: "Generate a reply to this email"
4. And then click on `Update` button.
5. If at anytime you wish to revert back to default, you can click the `Restore to Default` button 


#### Important info.
- Every instance of a ChatGPT window is in its own context/ conversation. So the follow-up questions will work as long as you are in the same window.
- The window can span multiple messages/ compose too. So you can visit a messageRead page, click on `ChatGPTfy` button and then if you visit compose without closing the window then the context will be retained. So if you can write a follow-up query like ` Generate a response to the email` and it will provide you with the response. Or you can say provide the "ticket number" / " tracking number"
- We delete the previous response once you ask another follow up question. However if you need you can also go to https://chat.openai.com/ and see the most recent conversation and all its history.
- Please note that in order to keep your chat history clean on OpenAI, we delete the conversation once you close the "ChatGPT window"
- Some times you might face issues where there will be no response from ChatGPT. To fix it just go to https://chat.openai.com/ and log out and login again.
- The extension is solely using client side solution and hence is more secure.



## Credit

This project is derived from [wong2/chat-gpt-google-extension](https://github.com/wong2/chat-gpt-google-extension)
