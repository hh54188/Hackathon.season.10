# Leap of faith

## What is LOF?

This is a web app which try to using *leap motion* take the place of mouse and keyboard to control web browsing.

## What compoent it contains?

- Gesture Recognition Engine: For recognising leap motion gesture.
- Chrome Extension: Inject script to the page you browsing. To communicate with the leap server.

## Frame data structor

```

// Attributes:

- currentFrameRate
- fingers []  //array of Pointable() objects representing fingers 那还不如直接使用pointables?
- gestures []
- *hands [] // list of Hand objects detected in this frame
- id
- interactionBox
- pointables [] // 更高级的finger？ The list of Pointable objects (fingers) detected in this frame that are associated with this hand,
- tools []
- timestamp
- *valid

// Methods:

- dump
- finger
- hand
- pointable
- *rotationAngle
- *rotationAxis
- *rotationMatrix
- *scaleFactor
- tool
- toString
- *translation

```


## 对require.js修改

因为要在百度图片做应用，但是他们已经定义了`require`和`define`，所以要对原始的require.js做修改。修改有两处

1. 在开始前对`define = null`, `require = null`, `requirejs = null`置空
2. 在requirejs中对当前环境是否存在`require`和`define`有判断。移除了这些判断，直接覆盖原方法。同时可能存在覆盖不完全的情况。所以开始还要全部置空



## How to build:

### Using grunt

1. First instll grunt: `npm install -g grunt-cli`
2. Install `requirejs`, `uglify`, `concat`: 
    - `npm install grunt-contrib-requirejs`
    - `npm install grunt-contrib-uglify`
    - `npm install grunt-contrib-concat`
3. If you want to build a debug version run `grunt -v debug`
4. If you want to build a deploy version run `grunt -v  deploy`

### Using requrejs

1. Install `requirejs`: `npm install requirejs`
2. Copy `./node_modules/requirejs/bin/r.js` to root `./r.js`
3. Run `r.js build.js`




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


