# Tytutbka
Youtube videos downloading web app using Express, Vue 2 and ytdl-core (https://github.com/fent/node-ytdl-core)

![Imgur](https://i.imgur.com/aq1Gc6km.png)
![Imgur](https://i.imgur.com/wvTIdKDm.png)
![Imgur](https://i.imgur.com/x7R3pbsm.png)


You can download directly without signing in, but to store on server for future retrival you need an account

## Problem / Requirements
I would like to...
- find a video if youtube link is entered
- choose format and quality from the available for a given video
- download directly a video file to my device even if I'm not logged in
- be able to log into my account using my Google account
- store the video on the server on my account and retrieve later (when on wifi)
- delete stored videos from my account
## Tech stack used to solve
- Vue.js frontend
- Youtube API
- Google Authorisation mechanism
- Express.js
## Learning Outcomes
- Vue.js framework
- Working with complex API like Youtube and using libraries to help with that
- Using Google Authorisation both on the frontend but also verifying it and using it to manage users account
- Effectively working with filesystem with node.js

## Install

### Server 
```bash
npm install 
npm start
```
This webapp uses Google OAth so need modification to use on your domain.
To test it is setup to accept connection from http://localhost:5500


### Client
```bash
cd client
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report

# run unit tests
npm run unit

# run e2e tests
npm run e2e

# run all tests
npm test
```
For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).



