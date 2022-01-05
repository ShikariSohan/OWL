# Instructions
Follow the following steps carefully to run the project **OWL**.

# Pre-requisites
- Install [Node.js](https://nodejs.org/en/) latest version in your system.

# Getting started
Follow the commands in a bash terminal.
- Clone the repository
```
git clone https://github.com/cse-250-2018/G03-Student-Forum.git
```
- Install dependencies
```
cd G03-Student-Forum
npm i
cd AdminPanel
npm i
cd ..
```
# Set the env variables
- create a file .env
 ```
touch .env
 ```
 - add these variable in the files
 First create an account in [Cloudinary](https://cloudinary.com/) 
 ```

CloudinaryKey=[CloudinaryKey]
CloudinaryApiSecret=[CloudinarySecret]
mongoURL=[Add your mongo database URL]
```
Feel free to add your own values in these variables
```
jwtString=SohanAndRiyo
jwtExpiry=12h
cookieString=SohanAndRiyo
cookieName=SohanAndRiyo
cookieUserName=usercookie
cookieExpiry=43200000
PORT=2727
```
Create an google [Oauth2](https://console.cloud.google.com/)  account for gmail api and add those values in these fields.
```
CLIENT_ID=[Client ID]
CLEINT_SECRET=[Client Secret]
REDIRECT_URI=https://developers.google.com/oauthplayground
REFRESH_TOKEN=[Refresh Token]
AdminMail=[Your Admin Mail]
```
# Set the Admin Panel
- Edit the seeds.js file as you like . Then run the command
```
node seeds.js
```
# Build and run the project
- Run the in command in the root for the main project
```
node index.js
```
- Run the command in a new tab of the terminal
```
cd AdminPanel
node index.js
```
These will run the project fully thank u.
