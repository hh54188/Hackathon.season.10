# Leap of faith

## What is LOF?

This is a web app which try to using *leap motion* take the place of mouse and keyboard to control web browsing.

## What compoent it contains?

- Gesture Recognition Engine: For recognising leap motion gesture.
- Chrome Extension: Inject script to the page you browsing. To communicate with the leap server.


## How to compress:

- Install `requirejs`: `npm install requirejs`
- Run command `r.js -o build.js`


## How to run test

- Run gesture engine with server: http://127.0.0.1:8000/test/
- Run basic gesture: http://127.0.0.1:8000/test/ges.html


## Folder Structor

```

--Project
--src
    |--gesture_engine
        |--gestures
        |--validate_flow
    |--apis
        |--image.js
    |--lib
    |--main.js
    |--config.js
--test
    |--framwork_design
        |--index.html
        |--main.js // 不涉及打包，所以可以放在另一个目录，并且自函requirejs.config
--build.js
--r.js
--index.html

```
