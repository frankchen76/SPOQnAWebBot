# Web Bot Application Insight demo

This is a sample to demonstrate how to log user information to application insights in QnA bot. 

## Structure
There are couple versions here. 
* src/index.js: this one will be bundled by webpack. 
* public/webbot.html: this is vanilla html version

## Building the code
* Provide the bot secret in index.js
```javascript
const user = {
    "User": {
        "Id": "dl_A8A8A3C7-798B-4ECF-AEF7-A0ACF9CE6487",
        "name": "frank@m365x725618.onmicrosoft.com"
    }
};
const botSecret = "[bot-secret]";
```
* Run `npm install` to install npm packages. 
* Run the following command to compile the code and start a local webpack-dev-server: 
```command
npm run start
```
* you can open up a default browser to access  http://localhost:8080/
* you can also check out webbot.html from http://localhost:8080/webot.html
* if you want to start a browser after compile, replace `"start": "webpack-dev-server --https --hot --inline"` to `"start": "webpack-dev-server --https --hot --inline --open"`
