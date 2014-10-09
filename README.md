# Leap of faith

## What is LOF?

This is a web app which try to using *leap motion* take the place of mouse and keyboard to control web browsing.

## What compoent it contains?

- Gesture Recognition Engine: For recognising leap motion gesture.
- Chrome Extension: Inject script to the page you browsing. To communicate with the leap server.

## TODO

### 百度图片

1. 单只手通过swipe手势控制向前翻动向后翻动图片（识别不够精准，容易误触发，引出下面双手）
2. 双手控制dock升起，下降（两手同时举高）
3. 双手控制，移除侧边栏
4. 手手势（左手手心朝向自己，右手手心朝向外；左手固定不动，通过活动右手（的推送和握力大小）来控制）
5. 单手画圆圈恢复原装


### 百度音乐

1. 新增虚拟控制面板
2. 精确到关节控制（三个手指），控制音乐音量

### 二期

1. 手势组合生成器，支持自定义手势识别


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

## Hand data structor:

```
- arm
- confidence
- *direction
- fingers[]
- *grabStrength
- id
- thumb // finger
- ringFinger // finger
- indexFinger // finger
- middleFinger // finger
- pinky // finger
- *palmNormal
- *palmPosition
- *palmVelocity
- palmWidth
- pinchStrength
- pointables[]
- *sphereCenter
- *sphereRadius
- stabilizedPalmPosition
- timeVisible
- tools[]
- valid

// Method:

- finger(id)
- pitch()
- roll()
- rotationAngle(sinceFrame[, axis])
- rotationAxis(sinceFrame)
- rotationMatrix(sinceFrame)
- scaleFactor(sinceFrame)
- translation(sinceFrame)
- yaw()

```


## 对require.js修改

因为要在百度图片做应用，但是他们已经定义了`require`和`define`，所以要对原始的require.js做修改。修改有两处

1. 在开始前对`define = null`, `require = null`, `requirejs = null`置空
2. 在requirejs中对当前环境是否存在`require`和`define`有判断。移除了这些判断，直接覆盖原方法。同时可能存在覆盖不完全的情况。所以开始还要全部置空



## How to use:

### How to use in browser

1. Open Chrome extension manage page
2. Enable developer mode
3. Drop extension folder into the page  

### Using grunt to build

(Debug verion build path: "extension/content.js")

1. First instll grunt: `npm install -g grunt-cli`
2. Install `requirejs`, `uglify`, `concat`: 
    - `npm install grunt-contrib-requirejs`
    - `npm install grunt-contrib-uglify`
    - `npm install grunt-contrib-concat`
    - `npm install grunt-contrib-watch`
3. Start watch(when file changed, it will auto run `debug` task)
4. If you want to build a debug version run `grunt -v debug`
5. (DO NOT USE!)If you want to build a deploy version run `grunt -v  deploy`

### Using requrejs to build

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


