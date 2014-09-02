# Leap of faith

## How to run test

- Run gesture engine with server: http://127.0.0.1:8000/test/
- Run basic gesture: http://127.0.0.1:8000/test/ges.html

## What is LOF?

This is a web app which try to using *leap motion* take the place of mouse and keyboard to control web browsing.

## What compoent it contains?

- Gesture Recognition Engine: For recognising leap motion gesture.
- Chrome Extension: Inject script to the page you browsing. To communicate with the leap server.


## How to compress:

- Install `requirejs`: `npm install requirejs`
- Run command `node node_modules/requirejs/bin/r.js -o build.js`
