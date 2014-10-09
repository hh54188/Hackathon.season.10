/*!                                                              
 * LeapJS v0.6.0-beta3                                                  
 * http://github.com/leapmotion/leapjs/                                        
 *                                                                             
 * Copyright 2013 LeapMotion, Inc. and other contributors                      
 * Released under the BSD-2-Clause license                                     
 * http://github.com/leapmotion/leapjs/blob/master/LICENSE.txt                 
 */
!function(a,b,c){function d(c,f){if(!b[c]){if(!a[c]){var g="function"==typeof require&&require;if(!f&&g)return g(c,!0);if(e)return e(c,!0);throw new Error("Cannot find module '"+c+"'")}var h=b[c]={exports:{}};a[c][0].call(h.exports,function(b){var e=a[c][1][b];return d(e?e:b)},h,h.exports)}return b[c].exports}for(var e="function"==typeof require&&require,f=0;f<c.length;f++)d(c[f]);return d}({1:[function(a,b){var c=(a("./pointable"),a("gl-matrix")),d=c.vec3,e=c.mat3,f=c.mat4,g=(a("underscore"),b.exports=function(a,b){this.finger=a,this._center=null,this._matrix=null,this.type=b.type,this.prevJoint=b.prevJoint,this.nextJoint=b.nextJoint,this.width=b.width;var c=new Array(3);d.sub(c,b.nextJoint,b.prevJoint),this.length=d.length(c),this.basis=b.basis});g.prototype.left=function(){return this._left?this._left:(this._left=e.determinant(this.basis[0].concat(this.basis[1]).concat(this.basis[2]))<0,this._left)},g.prototype.matrix=function(){if(this._matrix)return this._matrix;var a=this.basis,b=this._matrix=f.create();return b[0]=a[0][0],b[1]=a[0][1],b[2]=a[0][2],b[4]=a[1][0],b[5]=a[1][1],b[6]=a[1][2],b[8]=a[2][0],b[9]=a[2][1],b[10]=a[2][2],b[3]=this.center()[0],b[7]=this.center()[1],b[11]=this.center()[2],this.left()&&(b[0]*=-1,b[1]*=-1,b[2]*=-1),this._matrix},g.prototype.lerp=function(a,b){d.lerp(a,this.prevJoint,this.nextJoint,b)},g.prototype.center=function(){if(this._center)return this._center;var a=d.create();return this.lerp(a,.5),this._center=a,a},g.prototype.direction=function(){return this.basis[0]}},{"./pointable":13,"gl-matrix":22,underscore:23}],2:[function(a,b){var c=b.exports=function(a){this.pos=0,this._buf=[],this.size=a};c.prototype.get=function(a){return void 0==a&&(a=0),a>=this.size?void 0:a>=this._buf.length?void 0:this._buf[(this.pos-a-1)%this.size]},c.prototype.push=function(a){return this._buf[this.pos%this.size]=a,this.pos++}},{}],3:[function(a,b){var c=a("../protocol").chooseProtocol,d=a("events").EventEmitter,e=a("underscore"),f=b.exports=function(a){this.opts=e.defaults(a||{},{host:"127.0.0.1",enableGestures:!1,port:6437,background:!1,requestProtocolVersion:6}),this.host=this.opts.host,this.port=this.opts.port,this.protocolVersionVerified=!1,this.on("ready",function(){this.enableGestures(this.opts.enableGestures),this.setBackground(this.opts.background)})};f.prototype.getUrl=function(){return"ws://"+this.host+":"+this.port+"/v"+this.opts.requestProtocolVersion+".json"},f.prototype.setBackground=function(a){this.opts.background=a,this.protocol&&this.protocol.sendBackground&&this.background!==this.opts.background&&(this.background=this.opts.background,this.protocol.sendBackground(this,this.opts.background))},f.prototype.handleOpen=function(){this.connected||(this.connected=!0,this.emit("connect"))},f.prototype.enableGestures=function(a){this.gesturesEnabled=a?!0:!1,this.send(this.protocol.encode({enableGestures:this.gesturesEnabled}))},f.prototype.handleClose=function(a){this.connected&&(this.disconnect(),1001===a&&this.opts.requestProtocolVersion>1&&(this.protocolVersionVerified?this.protocolVersionVerified=!1:this.opts.requestProtocolVersion--),this.startReconnection())},f.prototype.startReconnection=function(){var a=this;this.reconnectionTimer||(this.reconnectionTimer=setInterval(function(){a.reconnect()},500))},f.prototype.stopReconnection=function(){this.reconnectionTimer=clearInterval(this.reconnectionTimer)},f.prototype.disconnect=function(a){return a||this.stopReconnection(),this.socket?(this.socket.close(),delete this.socket,delete this.protocol,delete this.background,delete this.focusedState,this.connected&&(this.connected=!1,this.emit("disconnect")),!0):void 0},f.prototype.reconnect=function(){this.connected?this.stopReconnection():(this.disconnect(!0),this.connect())},f.prototype.handleData=function(a){var b,d=JSON.parse(a);void 0===this.protocol?(b=this.protocol=c(d),this.protocolVersionVerified=!0,this.emit("ready")):b=this.protocol(d),this.emit(b.type,b)},f.prototype.connect=function(){return this.socket?void 0:(this.socket=this.setupSocket(),!0)},f.prototype.send=function(a){this.socket.send(a)},f.prototype.reportFocus=function(a){this.connected&&this.focusedState!==a&&(this.focusedState=a,this.emit(this.focusedState?"focus":"blur"),this.protocol&&this.protocol.sendFocused&&this.protocol.sendFocused(this,this.focusedState))},e.extend(f.prototype,d.prototype)},{"../protocol":14,events:20,underscore:23}],4:[function(a,b){var c=b.exports=a("./base"),d=a("underscore"),e=b.exports=function(a){c.call(this,a);var b=this;this.on("ready",function(){b.startFocusLoop()}),this.on("disconnect",function(){b.stopFocusLoop()})};d.extend(e.prototype,c.prototype),e.prototype.setupSocket=function(){var a=this,b=new WebSocket(this.getUrl());return b.onopen=function(){a.handleOpen()},b.onclose=function(b){a.handleClose(b.code,b.reason)},b.onmessage=function(b){a.handleData(b.data)},b},e.prototype.startFocusLoop=function(){if(!this.focusDetectorTimer){var a=this,b=null;b="undefined"!=typeof document.hidden?"hidden":"undefined"!=typeof document.mozHidden?"mozHidden":"undefined"!=typeof document.msHidden?"msHidden":"undefined"!=typeof document.webkitHidden?"webkitHidden":void 0,void 0===a.windowVisible&&(a.windowVisible=void 0===b?!0:document[b]===!1);var c=window.addEventListener("focus",function(){a.windowVisible=!0,e()}),d=window.addEventListener("blur",function(){a.windowVisible=!1,e()});this.on("disconnect",function(){window.removeEventListener("focus",c),window.removeEventListener("blur",d)});var e=function(){var c=void 0===b?!0:document[b]===!1;a.reportFocus(c&&a.windowVisible)};e(),this.focusDetectorTimer=setInterval(e,100)}},e.prototype.stopFocusLoop=function(){this.focusDetectorTimer&&(clearTimeout(this.focusDetectorTimer),delete this.focusDetectorTimer)}},{"./base":3,underscore:23}],5:[function(a,b){var c=a("__browserify_process"),d=a("./frame"),e=a("./hand"),f=a("./pointable"),g=a("./finger"),h=a("./circular_buffer"),i=a("./pipeline"),j=a("events").EventEmitter,k=a("./gesture").gestureListener,l=a("underscore"),m=b.exports=function(b){var e="undefined"!=typeof c&&c.versions&&c.versions.node,f=this;b=l.defaults(b||{},{inNode:e}),this.inNode=b.inNode,b=l.defaults(b||{},{frameEventName:this.useAnimationLoop()?"animationFrame":"deviceFrame",suppressAnimationLoop:!this.useAnimationLoop(),loopWhileDisconnected:!1,useAllPlugins:!1}),this.animationFrameRequested=!1,this.onAnimationFrame=function(){f.emit("animationFrame",f.lastConnectionFrame),f.loopWhileDisconnected&&(f.connection.focusedState||f.connection.opts.background)?window.requestAnimationFrame(f.onAnimationFrame):f.animationFrameRequested=!1},this.suppressAnimationLoop=b.suppressAnimationLoop,this.loopWhileDisconnected=b.loopWhileDisconnected,this.frameEventName=b.frameEventName,this.useAllPlugins=b.useAllPlugins,this.history=new h(200),this.lastFrame=d.Invalid,this.lastValidFrame=d.Invalid,this.lastConnectionFrame=d.Invalid,this.accumulatedGestures=[],this.connectionType=void 0===b.connectionType?a(this.inBrowser()?"./connection/browser":"./connection/node"):b.connectionType,this.connection=new this.connectionType(b),this.streamingCount=0,this.devices={},this.plugins={},this._pluginPipelineSteps={},this._pluginExtendedMethods={},b.useAllPlugins&&this.useRegisteredPlugins(),this.setupFrameEvents(b),this.setupConnectionEvents()};m.prototype.gesture=function(a,b){var c=k(this,a);return void 0!==b&&c.stop(b),c},m.prototype.setBackground=function(a){return this.connection.setBackground(a),this},m.prototype.inBrowser=function(){return!this.inNode},m.prototype.useAnimationLoop=function(){return this.inBrowser()&&!this.inBackgroundPage()},m.prototype.inBackgroundPage=function(){return"undefined"!=typeof chrome&&chrome.extension&&chrome.extension.getBackgroundPage&&chrome.extension.getBackgroundPage()===window},m.prototype.connect=function(){return this.connection.connect(),this},m.prototype.streaming=function(){return this.streamingCount>0},m.prototype.connected=function(){return!!this.connection.connected},m.prototype.runAnimationLoop=function(){this.suppressAnimationLoop||this.animationFrameRequested||(this.animationFrameRequested=!0,window.requestAnimationFrame(this.onAnimationFrame))},m.prototype.disconnect=function(){return this.connection.disconnect(),this},m.prototype.frame=function(a){return this.history.get(a)||d.Invalid},m.prototype.loop=function(a){return a&&("function"==typeof a?this.on(this.frameEventName,a):this.setupFrameEvents(a)),this.connect()},m.prototype.addStep=function(a){this.pipeline||(this.pipeline=new i(this)),this.pipeline.addStep(a)},m.prototype.processFrame=function(a){a.gestures&&(this.accumulatedGestures=this.accumulatedGestures.concat(a.gestures)),this.lastConnectionFrame=a,this.runAnimationLoop(),this.emit("deviceFrame",a)},m.prototype.processFinishedFrame=function(a){if(this.lastFrame=a,a.valid&&(this.lastValidFrame=a),a.controller=this,a.historyIdx=this.history.push(a),a.gestures){a.gestures=this.accumulatedGestures,this.accumulatedGestures=[];for(var b=0;b!=a.gestures.length;b++)this.emit("gesture",a.gestures[b],a)}this.pipeline&&(a=this.pipeline.run(a),a||(a=d.Invalid)),this.emit("frame",a),this.emitHandEvents(a)},m.prototype.emitHandEvents=function(a){for(var b=0;b<a.hands.length;b++)this.emit("hand",a.hands[b])},m.prototype.setupFrameEvents=function(a){a.frame&&this.on("frame",a.frame),a.hand&&this.on("hand",a.hand)},m.prototype.setupConnectionEvents=function(){var a=this;this.connection.on("frame",function(b){a.processFrame(b)}),this.on(this.frameEventName,function(b){a.processFinishedFrame(b)});var b=function(){if(a.connection.opts.requestProtocolVersion<5&&0==a.streamingCount){a.streamingCount=1;var c={attached:!0,streaming:!0,type:"unknown",id:"Lx00000000000"};a.devices[c.id]=c,a.emit("deviceAttached",c),a.emit("deviceStreaming",c),a.emit("streamingStarted",c),a.connection.removeListener("frame",b)}},c=function(){if(a.streamingCount>0){for(var b in a.devices)a.emit("deviceStopped",a.devices[b]),a.emit("deviceRemoved",a.devices[b]);a.emit("streamingStopped",a.devices[b]),a.streamingCount=0;for(var b in a.devices)delete a.devices[b]}};this.connection.on("focus",function(){a.emit("focus"),a.runAnimationLoop()}),this.connection.on("blur",function(){a.emit("blur")}),this.connection.on("protocol",function(b){a.emit("protocol",b)}),this.connection.on("ready",function(){a.emit("ready")}),this.connection.on("connect",function(){a.emit("connect"),a.connection.removeListener("frame",b),a.connection.on("frame",b)}),this.connection.on("disconnect",function(){a.emit("disconnect"),c()}),this.connection.on("deviceConnect",function(d){d.state?(a.emit("deviceConnected"),a.connection.removeListener("frame",b),a.connection.on("frame",b)):(a.emit("deviceDisconnected"),c())}),this.connection.on("deviceEvent",function(b){var c=b.state,d=a.devices[c.id],e={};for(var f in c)d&&d.hasOwnProperty(f)&&d[f]==c[f]||(e[f]=!0);a.devices[c.id]=c,e.attached&&a.emit(c.attached?"deviceAttached":"deviceRemoved",c),e.streaming&&(c.streaming?(a.streamingCount++,a.emit("deviceStreaming",c),1==a.streamingCount&&a.emit("streamingStarted",c),e.attached||a.emit("deviceConnected")):e.attached&&c.attached||(a.streamingCount--,a.emit("deviceStopped",c),0==a.streamingCount&&a.emit("streamingStopped",c),a.emit("deviceDisconnected")))}),this.on("newListener",function(a){("deviceConnected"==a||"deviceDisconnected"==a)&&console.warn(a+" events are depricated.  Consider using 'streamingStarted/streamingStopped' or 'deviceStreaming/deviceStopped' instead")})},m._pluginFactories={},m.plugin=function(a,b){return this._pluginFactories[a]&&console.warn('Plugin "'+a+'" already registered'),this._pluginFactories[a]=b},m.plugins=function(){return l.keys(this._pluginFactories)},m.prototype.use=function(a,b){var c,h,j,k,n;if(h="function"==typeof a?a:m._pluginFactories[a],!h)throw"Leap Plugin "+a+" not found.";if(b||(b={}),this.plugins[a])return l.extend(this.plugins[a],b),this;this.plugins[a]=b,k=h.call(this,b);for(j in k)if(c=k[j],"function"==typeof c)this.pipeline||(this.pipeline=new i(this)),this._pluginPipelineSteps[a]||(this._pluginPipelineSteps[a]=[]),this._pluginPipelineSteps[a].push(this.pipeline.addWrappedStep(j,c));else{switch(this._pluginExtendedMethods[a]||(this._pluginExtendedMethods[a]=[]),j){case"frame":n=d;break;case"hand":n=e;break;case"pointable":n=f,l.extend(g.prototype,c),l.extend(g.Invalid,c);break;case"finger":n=g;break;default:throw a+' specifies invalid object type "'+j+'" for prototypical extension'}l.extend(n.prototype,c),l.extend(n.Invalid,c),this._pluginExtendedMethods[a].push([n,c])}return this},m.prototype.stopUsing=function(a){var b,c,d=this._pluginPipelineSteps[a],e=this._pluginExtendedMethods[a],f=0;if(this.plugins[a]){if(d)for(f=0;f<d.length;f++)this.pipeline.removeStep(d[f]);if(e)for(f=0;f<e.length;f++){b=e[f][0],c=e[f][1];for(var g in c)delete b.prototype[g],delete b.Invalid[g]}return delete this.plugins[a],this}},m.prototype.useRegisteredPlugins=function(){for(var a in m._pluginFactories)this.use(a)},l.extend(m.prototype,j.prototype)},{"./circular_buffer":2,"./connection/browser":4,"./connection/node":19,"./finger":6,"./frame":7,"./gesture":8,"./hand":9,"./pipeline":12,"./pointable":13,__browserify_process:21,events:20,underscore:23}],6:[function(a,b){var c=a("./pointable"),d=a("./bone"),e=a("underscore"),f=b.exports=function(a){c.call(this,a),this.dipPosition=a.dipPosition,this.pipPosition=a.pipPosition,this.mcpPosition=a.mcpPosition,this.carpPosition=a.carpPosition,this.extended=a.extended,this.type=a.type,this.finger=!0,this.positions=[this.carpPosition,this.mcpPosition,this.pipPosition,this.dipPosition,this.tipPosition],a.bases?this.addBones(a):console.warn("You are running an old version of the Leap Service, finger bones are not be available.  Please upgrade as this backwards-compatibility will be removed in future versions of LeapJS.")};e.extend(f.prototype,c.prototype),f.prototype.addBones=function(a){this.metacarpal=new d(this,{type:0,width:this.width,prevJoint:this.carpPosition,nextJoint:this.mcpPosition,basis:a.bases[0]}),this.proximal=new d(this,{type:1,width:this.width,prevJoint:this.mcpPosition,nextJoint:this.pipPosition,basis:a.bases[1]}),this.intermediate=new d(this,{type:2,width:this.width,prevJoint:this.pipPosition,nextJoint:this.dipPosition,basis:a.bases[2]}),this.distal=new d(this,{type:3,width:this.width,prevJoint:this.dipPosition,nextJoint:a.btipPosition,basis:a.bases[3]}),this.bones=[this.metacarpal,this.proximal,this.intermediate,this.distal]},f.prototype.toString=function(){return 1==this.tool?"Finger [ id:"+this.id+" "+this.length+"mmx | width:"+this.width+"mm | direction:"+this.direction+" ]":"Finger [ id:"+this.id+" "+this.length+"mmx | direction: "+this.direction+" ]"},f.Invalid={valid:!1}},{"./bone":1,"./pointable":13,underscore:23}],7:[function(a,b){var c=a("./hand"),d=a("./pointable"),e=a("./gesture").createGesture,f=a("gl-matrix"),g=f.mat3,h=f.vec3,i=a("./interaction_box"),j=a("./finger"),k=a("underscore"),l=b.exports=function(a){if(this.valid=!0,this.id=a.id,this.timestamp=a.timestamp,this.hands=[],this.handsMap={},this.pointables=[],this.tools=[],this.fingers=[],a.interactionBox&&(this.interactionBox=new i(a.interactionBox)),this.gestures=[],this.pointablesMap={},this._translation=a.t,this._rotation=k.flatten(a.r),this._scaleFactor=a.s,this.data=a,this.type="frame",this.currentFrameRate=a.currentFrameRate,a.gestures)for(var b=0,c=a.gestures.length;b!=c;b++)this.gestures.push(e(a.gestures[b]));this.postprocessData(a)};l.prototype.postprocessData=function(a){a||(a=this.data);for(var b=0,e=a.hands.length;b!=e;b++){var f=new c(a.hands[b]);f.frame=this,this.hands.push(f),this.handsMap[f.id]=f}a.pointables=k.sortBy(a.pointables,function(a){return a.id});for(var g=0,h=a.pointables.length;g!=h;g++){var i=a.pointables[g],l=i.dipPosition?new j(i):new d(i);l.frame=this,this.addPointable(l)}},l.prototype.addPointable=function(a){if(this.pointables.push(a),this.pointablesMap[a.id]=a,(a.tool?this.tools:this.fingers).push(a),void 0!==a.handId&&this.handsMap.hasOwnProperty(a.handId)){var b=this.handsMap[a.handId];switch(b.pointables.push(a),(a.tool?b.tools:b.fingers).push(a),a.type){case 0:b.thumb=a;break;case 1:b.indexFinger=a;break;case 2:b.middleFinger=a;break;case 3:b.ringFinger=a;break;case 4:b.pinky=a}}},l.prototype.tool=function(a){var b=this.pointable(a);return b.tool?b:d.Invalid},l.prototype.pointable=function(a){return this.pointablesMap[a]||d.Invalid},l.prototype.finger=function(a){var b=this.pointable(a);return b.tool?d.Invalid:b},l.prototype.hand=function(a){return this.handsMap[a]||c.Invalid},l.prototype.rotationAngle=function(a,b){if(!this.valid||!a.valid)return 0;var c=this.rotationMatrix(a),d=.5*(c[0]+c[4]+c[8]-1),e=Math.acos(d);if(e=isNaN(e)?0:e,void 0!==b){var f=this.rotationAxis(a);e*=h.dot(f,h.normalize(h.create(),b))}return e},l.prototype.rotationAxis=function(a){return this.valid&&a.valid?h.normalize(h.create(),[this._rotation[7]-a._rotation[5],this._rotation[2]-a._rotation[6],this._rotation[3]-a._rotation[1]]):h.create()},l.prototype.rotationMatrix=function(a){if(!this.valid||!a.valid)return g.create();var b=g.transpose(g.create(),this._rotation);return g.multiply(g.create(),a._rotation,b)},l.prototype.scaleFactor=function(a){return this.valid&&a.valid?Math.exp(this._scaleFactor-a._scaleFactor):1},l.prototype.translation=function(a){return this.valid&&a.valid?h.subtract(h.create(),this._translation,a._translation):h.create()},l.prototype.toString=function(){var a="Frame [ id:"+this.id+" | timestamp:"+this.timestamp+" | Hand count:("+this.hands.length+") | Pointable count:("+this.pointables.length+")";return this.gestures&&(a+=" | Gesture count:("+this.gestures.length+")"),a+=" ]"},l.prototype.dump=function(){var a="";a+="Frame Info:<br/>",a+=this.toString(),a+="<br/><br/>Hands:<br/>";for(var b=0,c=this.hands.length;b!=c;b++)a+="  "+this.hands[b].toString()+"<br/>";a+="<br/><br/>Pointables:<br/>";for(var d=0,e=this.pointables.length;d!=e;d++)a+="  "+this.pointables[d].toString()+"<br/>";if(this.gestures){a+="<br/><br/>Gestures:<br/>";for(var f=0,g=this.gestures.length;f!=g;f++)a+="  "+this.gestures[f].toString()+"<br/>"}return a+="<br/><br/>Raw JSON:<br/>",a+=JSON.stringify(this.data)},l.Invalid={valid:!1,hands:[],fingers:[],tools:[],gestures:[],pointables:[],pointable:function(){return d.Invalid},finger:function(){return d.Invalid},hand:function(){return c.Invalid},toString:function(){return"invalid frame"},dump:function(){return this.toString()},rotationAngle:function(){return 0},rotationMatrix:function(){return g.create()},rotationAxis:function(){return h.create()},scaleFactor:function(){return 1},translation:function(){return h.create()}}},{"./finger":6,"./gesture":8,"./hand":9,"./interaction_box":11,"./pointable":13,"gl-matrix":22,underscore:23}],8:[function(a,b,c){var d=a("gl-matrix"),e=d.vec3,f=a("events").EventEmitter,g=a("underscore"),h=(c.createGesture=function(a){var b;switch(a.type){case"circle":b=new i(a);break;case"swipe":b=new j(a);break;case"screenTap":b=new k(a);break;case"keyTap":b=new l(a);break;default:throw"unknown gesture type"}return b.id=a.id,b.handIds=a.handIds.slice(),b.pointableIds=a.pointableIds.slice(),b.duration=a.duration,b.state=a.state,b.type=a.type,b},c.gestureListener=function(a,b){var c={},d={};a.on("gesture",function(a,e){if(a.type==b){if(("start"==a.state||"stop"==a.state)&&void 0===d[a.id]){var f=new h(a,e);d[a.id]=f,g.each(c,function(a,b){f.on(b,a)})}d[a.id].update(a,e),"stop"==a.state&&delete d[a.id]}});var e={start:function(a){return c.start=a,e},stop:function(a){return c.stop=a,e},complete:function(a){return c.stop=a,e},update:function(a){return c.update=a,e}};return e},c.Gesture=function(a,b){this.gestures=[a],this.frames=[b]});h.prototype.update=function(a,b){this.lastGesture=a,this.lastFrame=b,this.gestures.push(a),this.frames.push(b),this.emit(a.state,this)},h.prototype.translation=function(){return e.subtract(e.create(),this.lastGesture.startPosition,this.lastGesture.position)},g.extend(h.prototype,f.prototype);var i=function(a){this.center=a.center,this.normal=a.normal,this.progress=a.progress,this.radius=a.radius};i.prototype.toString=function(){return"CircleGesture ["+JSON.stringify(this)+"]"};var j=function(a){this.startPosition=a.startPosition,this.position=a.position,this.direction=a.direction,this.speed=a.speed};j.prototype.toString=function(){return"SwipeGesture ["+JSON.stringify(this)+"]"};var k=function(a){this.position=a.position,this.direction=a.direction,this.progress=a.progress};k.prototype.toString=function(){return"ScreenTapGesture ["+JSON.stringify(this)+"]"};var l=function(a){this.position=a.position,this.direction=a.direction,this.progress=a.progress};l.prototype.toString=function(){return"KeyTapGesture ["+JSON.stringify(this)+"]"}},{events:20,"gl-matrix":22,underscore:23}],9:[function(a,b){var c=a("./pointable"),d=a("gl-matrix"),e=d.mat3,f=d.vec3,g=a("underscore"),h=b.exports=function(a){this.id=a.id,this.palmPosition=a.palmPosition,this.direction=a.direction,this.palmVelocity=a.palmVelocity,this.palmNormal=a.palmNormal,this.sphereCenter=a.sphereCenter,this.sphereRadius=a.sphereRadius,this.valid=!0,this.pointables=[],this.fingers=[],this.tools=[],this._translation=a.t,this._rotation=g.flatten(a.r),this._scaleFactor=a.s,this.timeVisible=a.timeVisible,this.stabilizedPalmPosition=a.stabilizedPalmPosition,this.type=a.type,this.grabStrength=a.grabStrength,this.pinchStrength=a.pinchStrength,this.confidence=a.confidence};h.prototype.finger=function(a){var b=this.frame.finger(a);return b&&b.handId==this.id?b:c.Invalid},h.prototype.rotationAngle=function(a,b){if(!this.valid||!a.valid)return 0;var c=a.hand(this.id);if(!c.valid)return 0;var d=this.rotationMatrix(a),e=.5*(d[0]+d[4]+d[8]-1),g=Math.acos(e);if(g=isNaN(g)?0:g,void 0!==b){var h=this.rotationAxis(a);g*=f.dot(h,f.normalize(f.create(),b))}return g},h.prototype.rotationAxis=function(a){if(!this.valid||!a.valid)return f.create();var b=a.hand(this.id);return b.valid?f.normalize(f.create(),[this._rotation[7]-b._rotation[5],this._rotation[2]-b._rotation[6],this._rotation[3]-b._rotation[1]]):f.create()},h.prototype.rotationMatrix=function(a){if(!this.valid||!a.valid)return e.create();var b=a.hand(this.id);if(!b.valid)return e.create();var c=e.transpose(e.create(),this._rotation),d=e.multiply(e.create(),b._rotation,c);return d},h.prototype.scaleFactor=function(a){if(!this.valid||!a.valid)return 1;var b=a.hand(this.id);return b.valid?Math.exp(this._scaleFactor-b._scaleFactor):1},h.prototype.translation=function(a){if(!this.valid||!a.valid)return f.create();var b=a.hand(this.id);return b.valid?[this._translation[0]-b._translation[0],this._translation[1]-b._translation[1],this._translation[2]-b._translation[2]]:f.create()},h.prototype.toString=function(){return"Hand ("+this.type+") [ id: "+this.id+" | palm velocity:"+this.palmVelocity+" | sphere center:"+this.sphereCenter+" ] "},h.prototype.pitch=function(){return Math.atan2(this.direction[1],-this.direction[2])},h.prototype.yaw=function(){return Math.atan2(this.direction[0],-this.direction[2])},h.prototype.roll=function(){return Math.atan2(this.palmNormal[0],-this.palmNormal[1])},h.Invalid={valid:!1,fingers:[],tools:[],pointables:[],left:!1,pointable:function(){return c.Invalid},finger:function(){return c.Invalid},toString:function(){return"invalid frame"},dump:function(){return this.toString()},rotationAngle:function(){return 0},rotationMatrix:function(){return e.create()},rotationAxis:function(){return f.create()},scaleFactor:function(){return 1},translation:function(){return f.create()}}},{"./pointable":13,"gl-matrix":22,underscore:23}],10:[function(a,b){b.exports={Controller:a("./controller"),Frame:a("./frame"),Gesture:a("./gesture"),Hand:a("./hand"),Pointable:a("./pointable"),Finger:a("./finger"),InteractionBox:a("./interaction_box"),CircularBuffer:a("./circular_buffer"),UI:a("./ui"),JSONProtocol:a("./protocol").JSONProtocol,glMatrix:a("gl-matrix"),mat3:a("gl-matrix").mat3,vec3:a("gl-matrix").vec3,loopController:void 0,version:a("./version.js"),loop:function(a,b){return void 0!==b||a.frame||a.hand||(b=a,a={}),this.loopController||(this.loopController=new this.Controller(a)),this.loopController.loop(b),this.loopController},plugin:function(a,b){this.Controller.plugin(a,b)}}},{"./circular_buffer":2,"./controller":5,"./finger":6,"./frame":7,"./gesture":8,"./hand":9,"./interaction_box":11,"./pointable":13,"./protocol":14,"./ui":15,"./version.js":18,"gl-matrix":22}],11:[function(a,b){var c=a("gl-matrix"),d=c.vec3,e=b.exports=function(a){this.valid=!0,this.center=a.center,this.size=a.size,this.width=a.size[0],this.height=a.size[1],this.depth=a.size[2]};e.prototype.denormalizePoint=function(a){return d.fromValues((a[0]-.5)*this.size[0]+this.center[0],(a[1]-.5)*this.size[1]+this.center[1],(a[2]-.5)*this.size[2]+this.center[2])},e.prototype.normalizePoint=function(a,b){var c=d.fromValues((a[0]-this.center[0])/this.size[0]+.5,(a[1]-this.center[1])/this.size[1]+.5,(a[2]-this.center[2])/this.size[2]+.5);return b&&(c[0]=Math.min(Math.max(c[0],0),1),c[1]=Math.min(Math.max(c[1],0),1),c[2]=Math.min(Math.max(c[2],0),1)),c},e.prototype.toString=function(){return"InteractionBox [ width:"+this.width+" | height:"+this.height+" | depth:"+this.depth+" ]"},e.Invalid={valid:!1}},{"gl-matrix":22}],12:[function(a,b){var c=b.exports=function(a){this.steps=[],this.controller=a};c.prototype.addStep=function(a){this.steps.push(a)},c.prototype.run=function(a){for(var b=this.steps.length,c=0;c!=b&&a;c++)a=this.steps[c](a);return a},c.prototype.removeStep=function(a){var b=this.steps.indexOf(a);if(-1===b)throw"Step not found in pipeline";this.steps.splice(b,1)},c.prototype.addWrappedStep=function(a,b){var c=this.controller,d=function(d){var e,f,g;for(e="frame"==a?[d]:d[a+"s"]||[],f=0,g=e.length;g>f;f++)b.call(c,e[f]);return d};return this.addStep(d),d}},{}],13:[function(a,b){var c=a("gl-matrix"),d=(c.vec3,b.exports=function(a){this.valid=!0,this.id=a.id,this.handId=a.handId,this.length=a.length,this.tool=a.tool,this.width=a.width,this.direction=a.direction,this.stabilizedTipPosition=a.stabilizedTipPosition,this.tipPosition=a.tipPosition,this.tipVelocity=a.tipVelocity,this.touchZone=a.touchZone,this.touchDistance=a.touchDistance,this.timeVisible=a.timeVisible});d.prototype.toString=function(){return"Pointable [ id:"+this.id+" "+this.length+"mmx | width:"+this.width+"mm | direction:"+this.direction+" ]"},d.prototype.hand=function(){return this.frame.hand(this.handId)},d.Invalid={valid:!1}},{"gl-matrix":22}],14:[function(a,b,c){var d=a("./frame"),e=(a("./hand"),a("./pointable"),a("./finger"),function(a){this.type=a.type,this.state=a.state});c.chooseProtocol=function(a){var b;switch(a.version){case 1:case 2:case 3:case 4:case 5:case 6:b=f(a),b.sendBackground=function(a,c){a.send(b.encode({background:c}))},b.sendFocused=function(a,c){a.send(b.encode({focused:c}))};break;default:throw"unrecognized version"}return b};var f=c.JSONProtocol=function(a){var b=function(a){if(a.event)return new e(a.event);var b=new d(a);return b};return b.encode=function(a){return JSON.stringify(a)},b.version=a.version,b.serviceVersion=a.serviceVersion,b.versionLong="Version "+a.version,b.type="protocol",b}},{"./finger":6,"./frame":7,"./hand":9,"./pointable":13}],15:[function(a,b,c){c.UI={Region:a("./ui/region"),Cursor:a("./ui/cursor")}},{"./ui/cursor":16,"./ui/region":17}],16:[function(a,b){b.exports=function(){return function(a){var b=a.pointables.sort(function(a,b){return a.z-b.z})[0];return b&&b.valid&&(a.cursorPosition=b.tipPosition),a}}},{}],17:[function(a,b){var c=a("events").EventEmitter,d=a("underscore"),e=b.exports=function(a,b){this.start=new Vector(a),this.end=new Vector(b),this.enteredFrame=null};e.prototype.hasPointables=function(a){for(var b=0;b!=a.pointables.length;b++){var c=a.pointables[b].tipPosition;if(c.x>=this.start.x&&c.x<=this.end.x&&c.y>=this.start.y&&c.y<=this.end.y&&c.z>=this.start.z&&c.z<=this.end.z)return!0}return!1},e.prototype.listener=function(a){var b=this;return a&&a.nearThreshold&&this.setupNearRegion(a.nearThreshold),function(a){return b.updatePosition(a)}},e.prototype.clipper=function(){var a=this;return function(b){return a.updatePosition(b),a.enteredFrame?b:null}},e.prototype.setupNearRegion=function(a){var b=this.nearRegion=new e([this.start.x-a,this.start.y-a,this.start.z-a],[this.end.x+a,this.end.y+a,this.end.z+a]),c=this;b.on("enter",function(a){c.emit("near",a)}),b.on("exit",function(a){c.emit("far",a)}),c.on("exit",function(a){c.emit("near",a)})},e.prototype.updatePosition=function(a){return this.nearRegion&&this.nearRegion.updatePosition(a),this.hasPointables(a)&&null==this.enteredFrame?(this.enteredFrame=a,this.emit("enter",this.enteredFrame)):this.hasPointables(a)||null==this.enteredFrame||(this.enteredFrame=null,this.emit("exit",this.enteredFrame)),a},e.prototype.normalize=function(a){return new Vector([(a.x-this.start.x)/(this.end.x-this.start.x),(a.y-this.start.y)/(this.end.y-this.start.y),(a.z-this.start.z)/(this.end.z-this.start.z)])},e.prototype.mapToXY=function(a,b,c){var d=this.normalize(a),e=d.x,f=d.y;return e>1?e=1:-1>e&&(e=-1),f>1?f=1:-1>f&&(f=-1),[(e+1)/2*b,(1-f)/2*c,d.z]},d.extend(e.prototype,c.prototype)},{events:20,underscore:23}],18:[function(a,b){b.exports={full:"0.6.0-beta3",major:0,minor:6,dot:0}},{}],19:[function(){},{}],20:[function(a,b,c){function d(a,b){if(a.indexOf)return a.indexOf(b);for(var c=0;c<a.length;c++)if(b===a[c])return c;return-1}var e=a("__browserify_process");e.EventEmitter||(e.EventEmitter=function(){});var f=c.EventEmitter=e.EventEmitter,g="function"==typeof Array.isArray?Array.isArray:function(a){return"[object Array]"===Object.prototype.toString.call(a)},h=10;f.prototype.setMaxListeners=function(a){this._events||(this._events={}),this._events.maxListeners=a},f.prototype.emit=function(a){if("error"===a&&(!this._events||!this._events.error||g(this._events.error)&&!this._events.error.length))throw arguments[1]instanceof Error?arguments[1]:new Error("Uncaught, unspecified 'error' event.");if(!this._events)return!1;var b=this._events[a];if(!b)return!1;if("function"==typeof b){switch(arguments.length){case 1:b.call(this);break;case 2:b.call(this,arguments[1]);break;case 3:b.call(this,arguments[1],arguments[2]);break;default:var c=Array.prototype.slice.call(arguments,1);b.apply(this,c)}return!0}if(g(b)){for(var c=Array.prototype.slice.call(arguments,1),d=b.slice(),e=0,f=d.length;f>e;e++)d[e].apply(this,c);return!0}return!1},f.prototype.addListener=function(a,b){if("function"!=typeof b)throw new Error("addListener only takes instances of Function");if(this._events||(this._events={}),this.emit("newListener",a,b),this._events[a])if(g(this._events[a])){if(!this._events[a].warned){var c;c=void 0!==this._events.maxListeners?this._events.maxListeners:h,c&&c>0&&this._events[a].length>c&&(this._events[a].warned=!0,console.error("(node) warning: possible EventEmitter memory leak detected. %d listeners added. Use emitter.setMaxListeners() to increase limit.",this._events[a].length),console.trace())}this._events[a].push(b)}else this._events[a]=[this._events[a],b];else this._events[a]=b;return this},f.prototype.on=f.prototype.addListener,f.prototype.once=function(a,b){var c=this;return c.on(a,function d(){c.removeListener(a,d),b.apply(this,arguments)}),this},f.prototype.removeListener=function(a,b){if("function"!=typeof b)throw new Error("removeListener only takes instances of Function");if(!this._events||!this._events[a])return this;var c=this._events[a];if(g(c)){var e=d(c,b);if(0>e)return this;c.splice(e,1),0==c.length&&delete this._events[a]}else this._events[a]===b&&delete this._events[a];return this},f.prototype.removeAllListeners=function(a){return 0===arguments.length?(this._events={},this):(a&&this._events&&this._events[a]&&(this._events[a]=null),this)},f.prototype.listeners=function(a){return this._events||(this._events={}),this._events[a]||(this._events[a]=[]),g(this._events[a])||(this._events[a]=[this._events[a]]),this._events[a]
},f.listenerCount=function(a,b){var c;return c=a._events&&a._events[b]?"function"==typeof a._events[b]?1:a._events[b].length:0}},{__browserify_process:21}],21:[function(a,b){var c=b.exports={};c.nextTick=function(){var a="undefined"!=typeof window&&window.setImmediate,b="undefined"!=typeof window&&window.postMessage&&window.addEventListener;if(a)return function(a){return window.setImmediate(a)};if(b){var c=[];return window.addEventListener("message",function(a){var b=a.source;if((b===window||null===b)&&"process-tick"===a.data&&(a.stopPropagation(),c.length>0)){var d=c.shift();d()}},!0),function(a){c.push(a),window.postMessage("process-tick","*")}}return function(a){setTimeout(a,0)}}(),c.title="browser",c.browser=!0,c.env={},c.argv=[],c.binding=function(){throw new Error("process.binding is not supported")},c.cwd=function(){return"/"},c.chdir=function(){throw new Error("process.chdir is not supported")}},{}],22:[function(a,b,c){!function(a){"use strict";var b={};"undefined"==typeof c?"function"==typeof define&&"object"==typeof define.amd&&define.amd?(b.exports={},define(function(){return b.exports})):b.exports="undefined"!=typeof window?window:a:b.exports=c,function(a){if(!b)var b=1e-6;if(!c)var c="undefined"!=typeof Float32Array?Float32Array:Array;if(!d)var d=Math.random;var e={};e.setMatrixArrayType=function(a){c=a},"undefined"!=typeof a&&(a.glMatrix=e);var f=Math.PI/180;e.toRadian=function(a){return a*f};var g={};g.create=function(){var a=new c(2);return a[0]=0,a[1]=0,a},g.clone=function(a){var b=new c(2);return b[0]=a[0],b[1]=a[1],b},g.fromValues=function(a,b){var d=new c(2);return d[0]=a,d[1]=b,d},g.copy=function(a,b){return a[0]=b[0],a[1]=b[1],a},g.set=function(a,b,c){return a[0]=b,a[1]=c,a},g.add=function(a,b,c){return a[0]=b[0]+c[0],a[1]=b[1]+c[1],a},g.subtract=function(a,b,c){return a[0]=b[0]-c[0],a[1]=b[1]-c[1],a},g.sub=g.subtract,g.multiply=function(a,b,c){return a[0]=b[0]*c[0],a[1]=b[1]*c[1],a},g.mul=g.multiply,g.divide=function(a,b,c){return a[0]=b[0]/c[0],a[1]=b[1]/c[1],a},g.div=g.divide,g.min=function(a,b,c){return a[0]=Math.min(b[0],c[0]),a[1]=Math.min(b[1],c[1]),a},g.max=function(a,b,c){return a[0]=Math.max(b[0],c[0]),a[1]=Math.max(b[1],c[1]),a},g.scale=function(a,b,c){return a[0]=b[0]*c,a[1]=b[1]*c,a},g.scaleAndAdd=function(a,b,c,d){return a[0]=b[0]+c[0]*d,a[1]=b[1]+c[1]*d,a},g.distance=function(a,b){var c=b[0]-a[0],d=b[1]-a[1];return Math.sqrt(c*c+d*d)},g.dist=g.distance,g.squaredDistance=function(a,b){var c=b[0]-a[0],d=b[1]-a[1];return c*c+d*d},g.sqrDist=g.squaredDistance,g.length=function(a){var b=a[0],c=a[1];return Math.sqrt(b*b+c*c)},g.len=g.length,g.squaredLength=function(a){var b=a[0],c=a[1];return b*b+c*c},g.sqrLen=g.squaredLength,g.negate=function(a,b){return a[0]=-b[0],a[1]=-b[1],a},g.normalize=function(a,b){var c=b[0],d=b[1],e=c*c+d*d;return e>0&&(e=1/Math.sqrt(e),a[0]=b[0]*e,a[1]=b[1]*e),a},g.dot=function(a,b){return a[0]*b[0]+a[1]*b[1]},g.cross=function(a,b,c){var d=b[0]*c[1]-b[1]*c[0];return a[0]=a[1]=0,a[2]=d,a},g.lerp=function(a,b,c,d){var e=b[0],f=b[1];return a[0]=e+d*(c[0]-e),a[1]=f+d*(c[1]-f),a},g.random=function(a,b){b=b||1;var c=2*d()*Math.PI;return a[0]=Math.cos(c)*b,a[1]=Math.sin(c)*b,a},g.transformMat2=function(a,b,c){var d=b[0],e=b[1];return a[0]=c[0]*d+c[2]*e,a[1]=c[1]*d+c[3]*e,a},g.transformMat2d=function(a,b,c){var d=b[0],e=b[1];return a[0]=c[0]*d+c[2]*e+c[4],a[1]=c[1]*d+c[3]*e+c[5],a},g.transformMat3=function(a,b,c){var d=b[0],e=b[1];return a[0]=c[0]*d+c[3]*e+c[6],a[1]=c[1]*d+c[4]*e+c[7],a},g.transformMat4=function(a,b,c){var d=b[0],e=b[1];return a[0]=c[0]*d+c[4]*e+c[12],a[1]=c[1]*d+c[5]*e+c[13],a},g.forEach=function(){var a=g.create();return function(b,c,d,e,f,g){var h,i;for(c||(c=2),d||(d=0),i=e?Math.min(e*c+d,b.length):b.length,h=d;i>h;h+=c)a[0]=b[h],a[1]=b[h+1],f(a,a,g),b[h]=a[0],b[h+1]=a[1];return b}}(),g.str=function(a){return"vec2("+a[0]+", "+a[1]+")"},"undefined"!=typeof a&&(a.vec2=g);var h={};h.create=function(){var a=new c(3);return a[0]=0,a[1]=0,a[2]=0,a},h.clone=function(a){var b=new c(3);return b[0]=a[0],b[1]=a[1],b[2]=a[2],b},h.fromValues=function(a,b,d){var e=new c(3);return e[0]=a,e[1]=b,e[2]=d,e},h.copy=function(a,b){return a[0]=b[0],a[1]=b[1],a[2]=b[2],a},h.set=function(a,b,c,d){return a[0]=b,a[1]=c,a[2]=d,a},h.add=function(a,b,c){return a[0]=b[0]+c[0],a[1]=b[1]+c[1],a[2]=b[2]+c[2],a},h.subtract=function(a,b,c){return a[0]=b[0]-c[0],a[1]=b[1]-c[1],a[2]=b[2]-c[2],a},h.sub=h.subtract,h.multiply=function(a,b,c){return a[0]=b[0]*c[0],a[1]=b[1]*c[1],a[2]=b[2]*c[2],a},h.mul=h.multiply,h.divide=function(a,b,c){return a[0]=b[0]/c[0],a[1]=b[1]/c[1],a[2]=b[2]/c[2],a},h.div=h.divide,h.min=function(a,b,c){return a[0]=Math.min(b[0],c[0]),a[1]=Math.min(b[1],c[1]),a[2]=Math.min(b[2],c[2]),a},h.max=function(a,b,c){return a[0]=Math.max(b[0],c[0]),a[1]=Math.max(b[1],c[1]),a[2]=Math.max(b[2],c[2]),a},h.scale=function(a,b,c){return a[0]=b[0]*c,a[1]=b[1]*c,a[2]=b[2]*c,a},h.scaleAndAdd=function(a,b,c,d){return a[0]=b[0]+c[0]*d,a[1]=b[1]+c[1]*d,a[2]=b[2]+c[2]*d,a},h.distance=function(a,b){var c=b[0]-a[0],d=b[1]-a[1],e=b[2]-a[2];return Math.sqrt(c*c+d*d+e*e)},h.dist=h.distance,h.squaredDistance=function(a,b){var c=b[0]-a[0],d=b[1]-a[1],e=b[2]-a[2];return c*c+d*d+e*e},h.sqrDist=h.squaredDistance,h.length=function(a){var b=a[0],c=a[1],d=a[2];return Math.sqrt(b*b+c*c+d*d)},h.len=h.length,h.squaredLength=function(a){var b=a[0],c=a[1],d=a[2];return b*b+c*c+d*d},h.sqrLen=h.squaredLength,h.negate=function(a,b){return a[0]=-b[0],a[1]=-b[1],a[2]=-b[2],a},h.normalize=function(a,b){var c=b[0],d=b[1],e=b[2],f=c*c+d*d+e*e;return f>0&&(f=1/Math.sqrt(f),a[0]=b[0]*f,a[1]=b[1]*f,a[2]=b[2]*f),a},h.dot=function(a,b){return a[0]*b[0]+a[1]*b[1]+a[2]*b[2]},h.cross=function(a,b,c){var d=b[0],e=b[1],f=b[2],g=c[0],h=c[1],i=c[2];return a[0]=e*i-f*h,a[1]=f*g-d*i,a[2]=d*h-e*g,a},h.lerp=function(a,b,c,d){var e=b[0],f=b[1],g=b[2];return a[0]=e+d*(c[0]-e),a[1]=f+d*(c[1]-f),a[2]=g+d*(c[2]-g),a},h.random=function(a,b){b=b||1;var c=2*d()*Math.PI,e=2*d()-1,f=Math.sqrt(1-e*e)*b;return a[0]=Math.cos(c)*f,a[1]=Math.sin(c)*f,a[2]=e*b,a},h.transformMat4=function(a,b,c){var d=b[0],e=b[1],f=b[2];return a[0]=c[0]*d+c[4]*e+c[8]*f+c[12],a[1]=c[1]*d+c[5]*e+c[9]*f+c[13],a[2]=c[2]*d+c[6]*e+c[10]*f+c[14],a},h.transformMat3=function(a,b,c){var d=b[0],e=b[1],f=b[2];return a[0]=d*c[0]+e*c[3]+f*c[6],a[1]=d*c[1]+e*c[4]+f*c[7],a[2]=d*c[2]+e*c[5]+f*c[8],a},h.transformQuat=function(a,b,c){var d=b[0],e=b[1],f=b[2],g=c[0],h=c[1],i=c[2],j=c[3],k=j*d+h*f-i*e,l=j*e+i*d-g*f,m=j*f+g*e-h*d,n=-g*d-h*e-i*f;return a[0]=k*j+n*-g+l*-i-m*-h,a[1]=l*j+n*-h+m*-g-k*-i,a[2]=m*j+n*-i+k*-h-l*-g,a},h.rotateX=function(a,b,c,d){var e=[],f=[];return e[0]=b[0]-c[0],e[1]=b[1]-c[1],e[2]=b[2]-c[2],f[0]=e[0],f[1]=e[1]*Math.cos(d)-e[2]*Math.sin(d),f[2]=e[1]*Math.sin(d)+e[2]*Math.cos(d),a[0]=f[0]+c[0],a[1]=f[1]+c[1],a[2]=f[2]+c[2],a},h.rotateY=function(a,b,c,d){var e=[],f=[];return e[0]=b[0]-c[0],e[1]=b[1]-c[1],e[2]=b[2]-c[2],f[0]=e[2]*Math.sin(d)+e[0]*Math.cos(d),f[1]=e[1],f[2]=e[2]*Math.cos(d)-e[0]*Math.sin(d),a[0]=f[0]+c[0],a[1]=f[1]+c[1],a[2]=f[2]+c[2],a},h.rotateZ=function(a,b,c,d){var e=[],f=[];return e[0]=b[0]-c[0],e[1]=b[1]-c[1],e[2]=b[2]-c[2],f[0]=e[0]*Math.cos(d)-e[1]*Math.sin(d),f[1]=e[0]*Math.sin(d)+e[1]*Math.cos(d),f[2]=e[2],a[0]=f[0]+c[0],a[1]=f[1]+c[1],a[2]=f[2]+c[2],a},h.forEach=function(){var a=h.create();return function(b,c,d,e,f,g){var h,i;for(c||(c=3),d||(d=0),i=e?Math.min(e*c+d,b.length):b.length,h=d;i>h;h+=c)a[0]=b[h],a[1]=b[h+1],a[2]=b[h+2],f(a,a,g),b[h]=a[0],b[h+1]=a[1],b[h+2]=a[2];return b}}(),h.str=function(a){return"vec3("+a[0]+", "+a[1]+", "+a[2]+")"},"undefined"!=typeof a&&(a.vec3=h);var i={};i.create=function(){var a=new c(4);return a[0]=0,a[1]=0,a[2]=0,a[3]=0,a},i.clone=function(a){var b=new c(4);return b[0]=a[0],b[1]=a[1],b[2]=a[2],b[3]=a[3],b},i.fromValues=function(a,b,d,e){var f=new c(4);return f[0]=a,f[1]=b,f[2]=d,f[3]=e,f},i.copy=function(a,b){return a[0]=b[0],a[1]=b[1],a[2]=b[2],a[3]=b[3],a},i.set=function(a,b,c,d,e){return a[0]=b,a[1]=c,a[2]=d,a[3]=e,a},i.add=function(a,b,c){return a[0]=b[0]+c[0],a[1]=b[1]+c[1],a[2]=b[2]+c[2],a[3]=b[3]+c[3],a},i.subtract=function(a,b,c){return a[0]=b[0]-c[0],a[1]=b[1]-c[1],a[2]=b[2]-c[2],a[3]=b[3]-c[3],a},i.sub=i.subtract,i.multiply=function(a,b,c){return a[0]=b[0]*c[0],a[1]=b[1]*c[1],a[2]=b[2]*c[2],a[3]=b[3]*c[3],a},i.mul=i.multiply,i.divide=function(a,b,c){return a[0]=b[0]/c[0],a[1]=b[1]/c[1],a[2]=b[2]/c[2],a[3]=b[3]/c[3],a},i.div=i.divide,i.min=function(a,b,c){return a[0]=Math.min(b[0],c[0]),a[1]=Math.min(b[1],c[1]),a[2]=Math.min(b[2],c[2]),a[3]=Math.min(b[3],c[3]),a},i.max=function(a,b,c){return a[0]=Math.max(b[0],c[0]),a[1]=Math.max(b[1],c[1]),a[2]=Math.max(b[2],c[2]),a[3]=Math.max(b[3],c[3]),a},i.scale=function(a,b,c){return a[0]=b[0]*c,a[1]=b[1]*c,a[2]=b[2]*c,a[3]=b[3]*c,a},i.scaleAndAdd=function(a,b,c,d){return a[0]=b[0]+c[0]*d,a[1]=b[1]+c[1]*d,a[2]=b[2]+c[2]*d,a[3]=b[3]+c[3]*d,a},i.distance=function(a,b){var c=b[0]-a[0],d=b[1]-a[1],e=b[2]-a[2],f=b[3]-a[3];return Math.sqrt(c*c+d*d+e*e+f*f)},i.dist=i.distance,i.squaredDistance=function(a,b){var c=b[0]-a[0],d=b[1]-a[1],e=b[2]-a[2],f=b[3]-a[3];return c*c+d*d+e*e+f*f},i.sqrDist=i.squaredDistance,i.length=function(a){var b=a[0],c=a[1],d=a[2],e=a[3];return Math.sqrt(b*b+c*c+d*d+e*e)},i.len=i.length,i.squaredLength=function(a){var b=a[0],c=a[1],d=a[2],e=a[3];return b*b+c*c+d*d+e*e},i.sqrLen=i.squaredLength,i.negate=function(a,b){return a[0]=-b[0],a[1]=-b[1],a[2]=-b[2],a[3]=-b[3],a},i.normalize=function(a,b){var c=b[0],d=b[1],e=b[2],f=b[3],g=c*c+d*d+e*e+f*f;return g>0&&(g=1/Math.sqrt(g),a[0]=b[0]*g,a[1]=b[1]*g,a[2]=b[2]*g,a[3]=b[3]*g),a},i.dot=function(a,b){return a[0]*b[0]+a[1]*b[1]+a[2]*b[2]+a[3]*b[3]},i.lerp=function(a,b,c,d){var e=b[0],f=b[1],g=b[2],h=b[3];return a[0]=e+d*(c[0]-e),a[1]=f+d*(c[1]-f),a[2]=g+d*(c[2]-g),a[3]=h+d*(c[3]-h),a},i.random=function(a,b){return b=b||1,a[0]=d(),a[1]=d(),a[2]=d(),a[3]=d(),i.normalize(a,a),i.scale(a,a,b),a},i.transformMat4=function(a,b,c){var d=b[0],e=b[1],f=b[2],g=b[3];return a[0]=c[0]*d+c[4]*e+c[8]*f+c[12]*g,a[1]=c[1]*d+c[5]*e+c[9]*f+c[13]*g,a[2]=c[2]*d+c[6]*e+c[10]*f+c[14]*g,a[3]=c[3]*d+c[7]*e+c[11]*f+c[15]*g,a},i.transformQuat=function(a,b,c){var d=b[0],e=b[1],f=b[2],g=c[0],h=c[1],i=c[2],j=c[3],k=j*d+h*f-i*e,l=j*e+i*d-g*f,m=j*f+g*e-h*d,n=-g*d-h*e-i*f;return a[0]=k*j+n*-g+l*-i-m*-h,a[1]=l*j+n*-h+m*-g-k*-i,a[2]=m*j+n*-i+k*-h-l*-g,a},i.forEach=function(){var a=i.create();return function(b,c,d,e,f,g){var h,i;for(c||(c=4),d||(d=0),i=e?Math.min(e*c+d,b.length):b.length,h=d;i>h;h+=c)a[0]=b[h],a[1]=b[h+1],a[2]=b[h+2],a[3]=b[h+3],f(a,a,g),b[h]=a[0],b[h+1]=a[1],b[h+2]=a[2],b[h+3]=a[3];return b}}(),i.str=function(a){return"vec4("+a[0]+", "+a[1]+", "+a[2]+", "+a[3]+")"},"undefined"!=typeof a&&(a.vec4=i);var j={};j.create=function(){var a=new c(4);return a[0]=1,a[1]=0,a[2]=0,a[3]=1,a},j.clone=function(a){var b=new c(4);return b[0]=a[0],b[1]=a[1],b[2]=a[2],b[3]=a[3],b},j.copy=function(a,b){return a[0]=b[0],a[1]=b[1],a[2]=b[2],a[3]=b[3],a},j.identity=function(a){return a[0]=1,a[1]=0,a[2]=0,a[3]=1,a},j.transpose=function(a,b){if(a===b){var c=b[1];a[1]=b[2],a[2]=c}else a[0]=b[0],a[1]=b[2],a[2]=b[1],a[3]=b[3];return a},j.invert=function(a,b){var c=b[0],d=b[1],e=b[2],f=b[3],g=c*f-e*d;return g?(g=1/g,a[0]=f*g,a[1]=-d*g,a[2]=-e*g,a[3]=c*g,a):null},j.adjoint=function(a,b){var c=b[0];return a[0]=b[3],a[1]=-b[1],a[2]=-b[2],a[3]=c,a},j.determinant=function(a){return a[0]*a[3]-a[2]*a[1]},j.multiply=function(a,b,c){var d=b[0],e=b[1],f=b[2],g=b[3],h=c[0],i=c[1],j=c[2],k=c[3];return a[0]=d*h+f*i,a[1]=e*h+g*i,a[2]=d*j+f*k,a[3]=e*j+g*k,a},j.mul=j.multiply,j.rotate=function(a,b,c){var d=b[0],e=b[1],f=b[2],g=b[3],h=Math.sin(c),i=Math.cos(c);return a[0]=d*i+f*h,a[1]=e*i+g*h,a[2]=d*-h+f*i,a[3]=e*-h+g*i,a},j.scale=function(a,b,c){var d=b[0],e=b[1],f=b[2],g=b[3],h=c[0],i=c[1];return a[0]=d*h,a[1]=e*h,a[2]=f*i,a[3]=g*i,a},j.str=function(a){return"mat2("+a[0]+", "+a[1]+", "+a[2]+", "+a[3]+")"},j.frob=function(a){return Math.sqrt(Math.pow(a[0],2)+Math.pow(a[1],2)+Math.pow(a[2],2)+Math.pow(a[3],2))},j.LDU=function(a,b,c,d){return a[2]=d[2]/d[0],c[0]=d[0],c[1]=d[1],c[3]=d[3]-a[2]*c[1],[a,b,c]},"undefined"!=typeof a&&(a.mat2=j);var k={};k.create=function(){var a=new c(6);return a[0]=1,a[1]=0,a[2]=0,a[3]=1,a[4]=0,a[5]=0,a},k.clone=function(a){var b=new c(6);return b[0]=a[0],b[1]=a[1],b[2]=a[2],b[3]=a[3],b[4]=a[4],b[5]=a[5],b},k.copy=function(a,b){return a[0]=b[0],a[1]=b[1],a[2]=b[2],a[3]=b[3],a[4]=b[4],a[5]=b[5],a},k.identity=function(a){return a[0]=1,a[1]=0,a[2]=0,a[3]=1,a[4]=0,a[5]=0,a},k.invert=function(a,b){var c=b[0],d=b[1],e=b[2],f=b[3],g=b[4],h=b[5],i=c*f-d*e;return i?(i=1/i,a[0]=f*i,a[1]=-d*i,a[2]=-e*i,a[3]=c*i,a[4]=(e*h-f*g)*i,a[5]=(d*g-c*h)*i,a):null},k.determinant=function(a){return a[0]*a[3]-a[1]*a[2]},k.multiply=function(a,b,c){var d=b[0],e=b[1],f=b[2],g=b[3],h=b[4],i=b[5],j=c[0],k=c[1],l=c[2],m=c[3],n=c[4],o=c[5];return a[0]=d*j+f*k,a[1]=e*j+g*k,a[2]=d*l+f*m,a[3]=e*l+g*m,a[4]=d*n+f*o+h,a[5]=e*n+g*o+i,a},k.mul=k.multiply,k.rotate=function(a,b,c){var d=b[0],e=b[1],f=b[2],g=b[3],h=b[4],i=b[5],j=Math.sin(c),k=Math.cos(c);return a[0]=d*k+f*j,a[1]=e*k+g*j,a[2]=d*-j+f*k,a[3]=e*-j+g*k,a[4]=h,a[5]=i,a},k.scale=function(a,b,c){var d=b[0],e=b[1],f=b[2],g=b[3],h=b[4],i=b[5],j=c[0],k=c[1];return a[0]=d*j,a[1]=e*j,a[2]=f*k,a[3]=g*k,a[4]=h,a[5]=i,a},k.translate=function(a,b,c){var d=b[0],e=b[1],f=b[2],g=b[3],h=b[4],i=b[5],j=c[0],k=c[1];return a[0]=d,a[1]=e,a[2]=f,a[3]=g,a[4]=d*j+f*k+h,a[5]=e*j+g*k+i,a},k.str=function(a){return"mat2d("+a[0]+", "+a[1]+", "+a[2]+", "+a[3]+", "+a[4]+", "+a[5]+")"},k.frob=function(a){return Math.sqrt(Math.pow(a[0],2)+Math.pow(a[1],2)+Math.pow(a[2],2)+Math.pow(a[3],2)+Math.pow(a[4],2)+Math.pow(a[5],2)+1)},"undefined"!=typeof a&&(a.mat2d=k);var l={};l.create=function(){var a=new c(9);return a[0]=1,a[1]=0,a[2]=0,a[3]=0,a[4]=1,a[5]=0,a[6]=0,a[7]=0,a[8]=1,a},l.fromMat4=function(a,b){return a[0]=b[0],a[1]=b[1],a[2]=b[2],a[3]=b[4],a[4]=b[5],a[5]=b[6],a[6]=b[8],a[7]=b[9],a[8]=b[10],a},l.clone=function(a){var b=new c(9);return b[0]=a[0],b[1]=a[1],b[2]=a[2],b[3]=a[3],b[4]=a[4],b[5]=a[5],b[6]=a[6],b[7]=a[7],b[8]=a[8],b},l.copy=function(a,b){return a[0]=b[0],a[1]=b[1],a[2]=b[2],a[3]=b[3],a[4]=b[4],a[5]=b[5],a[6]=b[6],a[7]=b[7],a[8]=b[8],a},l.identity=function(a){return a[0]=1,a[1]=0,a[2]=0,a[3]=0,a[4]=1,a[5]=0,a[6]=0,a[7]=0,a[8]=1,a},l.transpose=function(a,b){if(a===b){var c=b[1],d=b[2],e=b[5];a[1]=b[3],a[2]=b[6],a[3]=c,a[5]=b[7],a[6]=d,a[7]=e}else a[0]=b[0],a[1]=b[3],a[2]=b[6],a[3]=b[1],a[4]=b[4],a[5]=b[7],a[6]=b[2],a[7]=b[5],a[8]=b[8];return a},l.invert=function(a,b){var c=b[0],d=b[1],e=b[2],f=b[3],g=b[4],h=b[5],i=b[6],j=b[7],k=b[8],l=k*g-h*j,m=-k*f+h*i,n=j*f-g*i,o=c*l+d*m+e*n;return o?(o=1/o,a[0]=l*o,a[1]=(-k*d+e*j)*o,a[2]=(h*d-e*g)*o,a[3]=m*o,a[4]=(k*c-e*i)*o,a[5]=(-h*c+e*f)*o,a[6]=n*o,a[7]=(-j*c+d*i)*o,a[8]=(g*c-d*f)*o,a):null},l.adjoint=function(a,b){var c=b[0],d=b[1],e=b[2],f=b[3],g=b[4],h=b[5],i=b[6],j=b[7],k=b[8];return a[0]=g*k-h*j,a[1]=e*j-d*k,a[2]=d*h-e*g,a[3]=h*i-f*k,a[4]=c*k-e*i,a[5]=e*f-c*h,a[6]=f*j-g*i,a[7]=d*i-c*j,a[8]=c*g-d*f,a},l.determinant=function(a){var b=a[0],c=a[1],d=a[2],e=a[3],f=a[4],g=a[5],h=a[6],i=a[7],j=a[8];return b*(j*f-g*i)+c*(-j*e+g*h)+d*(i*e-f*h)},l.multiply=function(a,b,c){var d=b[0],e=b[1],f=b[2],g=b[3],h=b[4],i=b[5],j=b[6],k=b[7],l=b[8],m=c[0],n=c[1],o=c[2],p=c[3],q=c[4],r=c[5],s=c[6],t=c[7],u=c[8];return a[0]=m*d+n*g+o*j,a[1]=m*e+n*h+o*k,a[2]=m*f+n*i+o*l,a[3]=p*d+q*g+r*j,a[4]=p*e+q*h+r*k,a[5]=p*f+q*i+r*l,a[6]=s*d+t*g+u*j,a[7]=s*e+t*h+u*k,a[8]=s*f+t*i+u*l,a},l.mul=l.multiply,l.translate=function(a,b,c){var d=b[0],e=b[1],f=b[2],g=b[3],h=b[4],i=b[5],j=b[6],k=b[7],l=b[8],m=c[0],n=c[1];return a[0]=d,a[1]=e,a[2]=f,a[3]=g,a[4]=h,a[5]=i,a[6]=m*d+n*g+j,a[7]=m*e+n*h+k,a[8]=m*f+n*i+l,a},l.rotate=function(a,b,c){var d=b[0],e=b[1],f=b[2],g=b[3],h=b[4],i=b[5],j=b[6],k=b[7],l=b[8],m=Math.sin(c),n=Math.cos(c);return a[0]=n*d+m*g,a[1]=n*e+m*h,a[2]=n*f+m*i,a[3]=n*g-m*d,a[4]=n*h-m*e,a[5]=n*i-m*f,a[6]=j,a[7]=k,a[8]=l,a},l.scale=function(a,b,c){var d=c[0],e=c[1];return a[0]=d*b[0],a[1]=d*b[1],a[2]=d*b[2],a[3]=e*b[3],a[4]=e*b[4],a[5]=e*b[5],a[6]=b[6],a[7]=b[7],a[8]=b[8],a},l.fromMat2d=function(a,b){return a[0]=b[0],a[1]=b[1],a[2]=0,a[3]=b[2],a[4]=b[3],a[5]=0,a[6]=b[4],a[7]=b[5],a[8]=1,a},l.fromQuat=function(a,b){var c=b[0],d=b[1],e=b[2],f=b[3],g=c+c,h=d+d,i=e+e,j=c*g,k=d*g,l=d*h,m=e*g,n=e*h,o=e*i,p=f*g,q=f*h,r=f*i;return a[0]=1-l-o,a[3]=k-r,a[6]=m+q,a[1]=k+r,a[4]=1-j-o,a[7]=n-p,a[2]=m-q,a[5]=n+p,a[8]=1-j-l,a},l.normalFromMat4=function(a,b){var c=b[0],d=b[1],e=b[2],f=b[3],g=b[4],h=b[5],i=b[6],j=b[7],k=b[8],l=b[9],m=b[10],n=b[11],o=b[12],p=b[13],q=b[14],r=b[15],s=c*h-d*g,t=c*i-e*g,u=c*j-f*g,v=d*i-e*h,w=d*j-f*h,x=e*j-f*i,y=k*p-l*o,z=k*q-m*o,A=k*r-n*o,B=l*q-m*p,C=l*r-n*p,D=m*r-n*q,E=s*D-t*C+u*B+v*A-w*z+x*y;return E?(E=1/E,a[0]=(h*D-i*C+j*B)*E,a[1]=(i*A-g*D-j*z)*E,a[2]=(g*C-h*A+j*y)*E,a[3]=(e*C-d*D-f*B)*E,a[4]=(c*D-e*A+f*z)*E,a[5]=(d*A-c*C-f*y)*E,a[6]=(p*x-q*w+r*v)*E,a[7]=(q*u-o*x-r*t)*E,a[8]=(o*w-p*u+r*s)*E,a):null},l.str=function(a){return"mat3("+a[0]+", "+a[1]+", "+a[2]+", "+a[3]+", "+a[4]+", "+a[5]+", "+a[6]+", "+a[7]+", "+a[8]+")"},l.frob=function(a){return Math.sqrt(Math.pow(a[0],2)+Math.pow(a[1],2)+Math.pow(a[2],2)+Math.pow(a[3],2)+Math.pow(a[4],2)+Math.pow(a[5],2)+Math.pow(a[6],2)+Math.pow(a[7],2)+Math.pow(a[8],2))},"undefined"!=typeof a&&(a.mat3=l);var m={};m.create=function(){var a=new c(16);return a[0]=1,a[1]=0,a[2]=0,a[3]=0,a[4]=0,a[5]=1,a[6]=0,a[7]=0,a[8]=0,a[9]=0,a[10]=1,a[11]=0,a[12]=0,a[13]=0,a[14]=0,a[15]=1,a},m.clone=function(a){var b=new c(16);return b[0]=a[0],b[1]=a[1],b[2]=a[2],b[3]=a[3],b[4]=a[4],b[5]=a[5],b[6]=a[6],b[7]=a[7],b[8]=a[8],b[9]=a[9],b[10]=a[10],b[11]=a[11],b[12]=a[12],b[13]=a[13],b[14]=a[14],b[15]=a[15],b},m.copy=function(a,b){return a[0]=b[0],a[1]=b[1],a[2]=b[2],a[3]=b[3],a[4]=b[4],a[5]=b[5],a[6]=b[6],a[7]=b[7],a[8]=b[8],a[9]=b[9],a[10]=b[10],a[11]=b[11],a[12]=b[12],a[13]=b[13],a[14]=b[14],a[15]=b[15],a},m.identity=function(a){return a[0]=1,a[1]=0,a[2]=0,a[3]=0,a[4]=0,a[5]=1,a[6]=0,a[7]=0,a[8]=0,a[9]=0,a[10]=1,a[11]=0,a[12]=0,a[13]=0,a[14]=0,a[15]=1,a},m.transpose=function(a,b){if(a===b){var c=b[1],d=b[2],e=b[3],f=b[6],g=b[7],h=b[11];a[1]=b[4],a[2]=b[8],a[3]=b[12],a[4]=c,a[6]=b[9],a[7]=b[13],a[8]=d,a[9]=f,a[11]=b[14],a[12]=e,a[13]=g,a[14]=h}else a[0]=b[0],a[1]=b[4],a[2]=b[8],a[3]=b[12],a[4]=b[1],a[5]=b[5],a[6]=b[9],a[7]=b[13],a[8]=b[2],a[9]=b[6],a[10]=b[10],a[11]=b[14],a[12]=b[3],a[13]=b[7],a[14]=b[11],a[15]=b[15];return a},m.invert=function(a,b){var c=b[0],d=b[1],e=b[2],f=b[3],g=b[4],h=b[5],i=b[6],j=b[7],k=b[8],l=b[9],m=b[10],n=b[11],o=b[12],p=b[13],q=b[14],r=b[15],s=c*h-d*g,t=c*i-e*g,u=c*j-f*g,v=d*i-e*h,w=d*j-f*h,x=e*j-f*i,y=k*p-l*o,z=k*q-m*o,A=k*r-n*o,B=l*q-m*p,C=l*r-n*p,D=m*r-n*q,E=s*D-t*C+u*B+v*A-w*z+x*y;return E?(E=1/E,a[0]=(h*D-i*C+j*B)*E,a[1]=(e*C-d*D-f*B)*E,a[2]=(p*x-q*w+r*v)*E,a[3]=(m*w-l*x-n*v)*E,a[4]=(i*A-g*D-j*z)*E,a[5]=(c*D-e*A+f*z)*E,a[6]=(q*u-o*x-r*t)*E,a[7]=(k*x-m*u+n*t)*E,a[8]=(g*C-h*A+j*y)*E,a[9]=(d*A-c*C-f*y)*E,a[10]=(o*w-p*u+r*s)*E,a[11]=(l*u-k*w-n*s)*E,a[12]=(h*z-g*B-i*y)*E,a[13]=(c*B-d*z+e*y)*E,a[14]=(p*t-o*v-q*s)*E,a[15]=(k*v-l*t+m*s)*E,a):null},m.adjoint=function(a,b){var c=b[0],d=b[1],e=b[2],f=b[3],g=b[4],h=b[5],i=b[6],j=b[7],k=b[8],l=b[9],m=b[10],n=b[11],o=b[12],p=b[13],q=b[14],r=b[15];return a[0]=h*(m*r-n*q)-l*(i*r-j*q)+p*(i*n-j*m),a[1]=-(d*(m*r-n*q)-l*(e*r-f*q)+p*(e*n-f*m)),a[2]=d*(i*r-j*q)-h*(e*r-f*q)+p*(e*j-f*i),a[3]=-(d*(i*n-j*m)-h*(e*n-f*m)+l*(e*j-f*i)),a[4]=-(g*(m*r-n*q)-k*(i*r-j*q)+o*(i*n-j*m)),a[5]=c*(m*r-n*q)-k*(e*r-f*q)+o*(e*n-f*m),a[6]=-(c*(i*r-j*q)-g*(e*r-f*q)+o*(e*j-f*i)),a[7]=c*(i*n-j*m)-g*(e*n-f*m)+k*(e*j-f*i),a[8]=g*(l*r-n*p)-k*(h*r-j*p)+o*(h*n-j*l),a[9]=-(c*(l*r-n*p)-k*(d*r-f*p)+o*(d*n-f*l)),a[10]=c*(h*r-j*p)-g*(d*r-f*p)+o*(d*j-f*h),a[11]=-(c*(h*n-j*l)-g*(d*n-f*l)+k*(d*j-f*h)),a[12]=-(g*(l*q-m*p)-k*(h*q-i*p)+o*(h*m-i*l)),a[13]=c*(l*q-m*p)-k*(d*q-e*p)+o*(d*m-e*l),a[14]=-(c*(h*q-i*p)-g*(d*q-e*p)+o*(d*i-e*h)),a[15]=c*(h*m-i*l)-g*(d*m-e*l)+k*(d*i-e*h),a},m.determinant=function(a){var b=a[0],c=a[1],d=a[2],e=a[3],f=a[4],g=a[5],h=a[6],i=a[7],j=a[8],k=a[9],l=a[10],m=a[11],n=a[12],o=a[13],p=a[14],q=a[15],r=b*g-c*f,s=b*h-d*f,t=b*i-e*f,u=c*h-d*g,v=c*i-e*g,w=d*i-e*h,x=j*o-k*n,y=j*p-l*n,z=j*q-m*n,A=k*p-l*o,B=k*q-m*o,C=l*q-m*p;return r*C-s*B+t*A+u*z-v*y+w*x},m.multiply=function(a,b,c){var d=b[0],e=b[1],f=b[2],g=b[3],h=b[4],i=b[5],j=b[6],k=b[7],l=b[8],m=b[9],n=b[10],o=b[11],p=b[12],q=b[13],r=b[14],s=b[15],t=c[0],u=c[1],v=c[2],w=c[3];return a[0]=t*d+u*h+v*l+w*p,a[1]=t*e+u*i+v*m+w*q,a[2]=t*f+u*j+v*n+w*r,a[3]=t*g+u*k+v*o+w*s,t=c[4],u=c[5],v=c[6],w=c[7],a[4]=t*d+u*h+v*l+w*p,a[5]=t*e+u*i+v*m+w*q,a[6]=t*f+u*j+v*n+w*r,a[7]=t*g+u*k+v*o+w*s,t=c[8],u=c[9],v=c[10],w=c[11],a[8]=t*d+u*h+v*l+w*p,a[9]=t*e+u*i+v*m+w*q,a[10]=t*f+u*j+v*n+w*r,a[11]=t*g+u*k+v*o+w*s,t=c[12],u=c[13],v=c[14],w=c[15],a[12]=t*d+u*h+v*l+w*p,a[13]=t*e+u*i+v*m+w*q,a[14]=t*f+u*j+v*n+w*r,a[15]=t*g+u*k+v*o+w*s,a},m.mul=m.multiply,m.translate=function(a,b,c){var d,e,f,g,h,i,j,k,l,m,n,o,p=c[0],q=c[1],r=c[2];return b===a?(a[12]=b[0]*p+b[4]*q+b[8]*r+b[12],a[13]=b[1]*p+b[5]*q+b[9]*r+b[13],a[14]=b[2]*p+b[6]*q+b[10]*r+b[14],a[15]=b[3]*p+b[7]*q+b[11]*r+b[15]):(d=b[0],e=b[1],f=b[2],g=b[3],h=b[4],i=b[5],j=b[6],k=b[7],l=b[8],m=b[9],n=b[10],o=b[11],a[0]=d,a[1]=e,a[2]=f,a[3]=g,a[4]=h,a[5]=i,a[6]=j,a[7]=k,a[8]=l,a[9]=m,a[10]=n,a[11]=o,a[12]=d*p+h*q+l*r+b[12],a[13]=e*p+i*q+m*r+b[13],a[14]=f*p+j*q+n*r+b[14],a[15]=g*p+k*q+o*r+b[15]),a},m.scale=function(a,b,c){var d=c[0],e=c[1],f=c[2];return a[0]=b[0]*d,a[1]=b[1]*d,a[2]=b[2]*d,a[3]=b[3]*d,a[4]=b[4]*e,a[5]=b[5]*e,a[6]=b[6]*e,a[7]=b[7]*e,a[8]=b[8]*f,a[9]=b[9]*f,a[10]=b[10]*f,a[11]=b[11]*f,a[12]=b[12],a[13]=b[13],a[14]=b[14],a[15]=b[15],a},m.rotate=function(a,c,d,e){var f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z,A,B,C,D=e[0],E=e[1],F=e[2],G=Math.sqrt(D*D+E*E+F*F);return Math.abs(G)<b?null:(G=1/G,D*=G,E*=G,F*=G,f=Math.sin(d),g=Math.cos(d),h=1-g,i=c[0],j=c[1],k=c[2],l=c[3],m=c[4],n=c[5],o=c[6],p=c[7],q=c[8],r=c[9],s=c[10],t=c[11],u=D*D*h+g,v=E*D*h+F*f,w=F*D*h-E*f,x=D*E*h-F*f,y=E*E*h+g,z=F*E*h+D*f,A=D*F*h+E*f,B=E*F*h-D*f,C=F*F*h+g,a[0]=i*u+m*v+q*w,a[1]=j*u+n*v+r*w,a[2]=k*u+o*v+s*w,a[3]=l*u+p*v+t*w,a[4]=i*x+m*y+q*z,a[5]=j*x+n*y+r*z,a[6]=k*x+o*y+s*z,a[7]=l*x+p*y+t*z,a[8]=i*A+m*B+q*C,a[9]=j*A+n*B+r*C,a[10]=k*A+o*B+s*C,a[11]=l*A+p*B+t*C,c!==a&&(a[12]=c[12],a[13]=c[13],a[14]=c[14],a[15]=c[15]),a)},m.rotateX=function(a,b,c){var d=Math.sin(c),e=Math.cos(c),f=b[4],g=b[5],h=b[6],i=b[7],j=b[8],k=b[9],l=b[10],m=b[11];return b!==a&&(a[0]=b[0],a[1]=b[1],a[2]=b[2],a[3]=b[3],a[12]=b[12],a[13]=b[13],a[14]=b[14],a[15]=b[15]),a[4]=f*e+j*d,a[5]=g*e+k*d,a[6]=h*e+l*d,a[7]=i*e+m*d,a[8]=j*e-f*d,a[9]=k*e-g*d,a[10]=l*e-h*d,a[11]=m*e-i*d,a},m.rotateY=function(a,b,c){var d=Math.sin(c),e=Math.cos(c),f=b[0],g=b[1],h=b[2],i=b[3],j=b[8],k=b[9],l=b[10],m=b[11];return b!==a&&(a[4]=b[4],a[5]=b[5],a[6]=b[6],a[7]=b[7],a[12]=b[12],a[13]=b[13],a[14]=b[14],a[15]=b[15]),a[0]=f*e-j*d,a[1]=g*e-k*d,a[2]=h*e-l*d,a[3]=i*e-m*d,a[8]=f*d+j*e,a[9]=g*d+k*e,a[10]=h*d+l*e,a[11]=i*d+m*e,a},m.rotateZ=function(a,b,c){var d=Math.sin(c),e=Math.cos(c),f=b[0],g=b[1],h=b[2],i=b[3],j=b[4],k=b[5],l=b[6],m=b[7];return b!==a&&(a[8]=b[8],a[9]=b[9],a[10]=b[10],a[11]=b[11],a[12]=b[12],a[13]=b[13],a[14]=b[14],a[15]=b[15]),a[0]=f*e+j*d,a[1]=g*e+k*d,a[2]=h*e+l*d,a[3]=i*e+m*d,a[4]=j*e-f*d,a[5]=k*e-g*d,a[6]=l*e-h*d,a[7]=m*e-i*d,a},m.fromRotationTranslation=function(a,b,c){var d=b[0],e=b[1],f=b[2],g=b[3],h=d+d,i=e+e,j=f+f,k=d*h,l=d*i,m=d*j,n=e*i,o=e*j,p=f*j,q=g*h,r=g*i,s=g*j;return a[0]=1-(n+p),a[1]=l+s,a[2]=m-r,a[3]=0,a[4]=l-s,a[5]=1-(k+p),a[6]=o+q,a[7]=0,a[8]=m+r,a[9]=o-q,a[10]=1-(k+n),a[11]=0,a[12]=c[0],a[13]=c[1],a[14]=c[2],a[15]=1,a},m.fromQuat=function(a,b){var c=b[0],d=b[1],e=b[2],f=b[3],g=c+c,h=d+d,i=e+e,j=c*g,k=d*g,l=d*h,m=e*g,n=e*h,o=e*i,p=f*g,q=f*h,r=f*i;return a[0]=1-l-o,a[1]=k+r,a[2]=m-q,a[3]=0,a[4]=k-r,a[5]=1-j-o,a[6]=n+p,a[7]=0,a[8]=m+q,a[9]=n-p,a[10]=1-j-l,a[11]=0,a[12]=0,a[13]=0,a[14]=0,a[15]=1,a},m.frustum=function(a,b,c,d,e,f,g){var h=1/(c-b),i=1/(e-d),j=1/(f-g);return a[0]=2*f*h,a[1]=0,a[2]=0,a[3]=0,a[4]=0,a[5]=2*f*i,a[6]=0,a[7]=0,a[8]=(c+b)*h,a[9]=(e+d)*i,a[10]=(g+f)*j,a[11]=-1,a[12]=0,a[13]=0,a[14]=g*f*2*j,a[15]=0,a},m.perspective=function(a,b,c,d,e){var f=1/Math.tan(b/2),g=1/(d-e);return a[0]=f/c,a[1]=0,a[2]=0,a[3]=0,a[4]=0,a[5]=f,a[6]=0,a[7]=0,a[8]=0,a[9]=0,a[10]=(e+d)*g,a[11]=-1,a[12]=0,a[13]=0,a[14]=2*e*d*g,a[15]=0,a},m.ortho=function(a,b,c,d,e,f,g){var h=1/(b-c),i=1/(d-e),j=1/(f-g);return a[0]=-2*h,a[1]=0,a[2]=0,a[3]=0,a[4]=0,a[5]=-2*i,a[6]=0,a[7]=0,a[8]=0,a[9]=0,a[10]=2*j,a[11]=0,a[12]=(b+c)*h,a[13]=(e+d)*i,a[14]=(g+f)*j,a[15]=1,a},m.lookAt=function(a,c,d,e){var f,g,h,i,j,k,l,n,o,p,q=c[0],r=c[1],s=c[2],t=e[0],u=e[1],v=e[2],w=d[0],x=d[1],y=d[2];return Math.abs(q-w)<b&&Math.abs(r-x)<b&&Math.abs(s-y)<b?m.identity(a):(l=q-w,n=r-x,o=s-y,p=1/Math.sqrt(l*l+n*n+o*o),l*=p,n*=p,o*=p,f=u*o-v*n,g=v*l-t*o,h=t*n-u*l,p=Math.sqrt(f*f+g*g+h*h),p?(p=1/p,f*=p,g*=p,h*=p):(f=0,g=0,h=0),i=n*h-o*g,j=o*f-l*h,k=l*g-n*f,p=Math.sqrt(i*i+j*j+k*k),p?(p=1/p,i*=p,j*=p,k*=p):(i=0,j=0,k=0),a[0]=f,a[1]=i,a[2]=l,a[3]=0,a[4]=g,a[5]=j,a[6]=n,a[7]=0,a[8]=h,a[9]=k,a[10]=o,a[11]=0,a[12]=-(f*q+g*r+h*s),a[13]=-(i*q+j*r+k*s),a[14]=-(l*q+n*r+o*s),a[15]=1,a)},m.str=function(a){return"mat4("+a[0]+", "+a[1]+", "+a[2]+", "+a[3]+", "+a[4]+", "+a[5]+", "+a[6]+", "+a[7]+", "+a[8]+", "+a[9]+", "+a[10]+", "+a[11]+", "+a[12]+", "+a[13]+", "+a[14]+", "+a[15]+")"},m.frob=function(a){return Math.sqrt(Math.pow(a[0],2)+Math.pow(a[1],2)+Math.pow(a[2],2)+Math.pow(a[3],2)+Math.pow(a[4],2)+Math.pow(a[5],2)+Math.pow(a[6],2)+Math.pow(a[6],2)+Math.pow(a[7],2)+Math.pow(a[8],2)+Math.pow(a[9],2)+Math.pow(a[10],2)+Math.pow(a[11],2)+Math.pow(a[12],2)+Math.pow(a[13],2)+Math.pow(a[14],2)+Math.pow(a[15],2))},"undefined"!=typeof a&&(a.mat4=m);var n={};n.create=function(){var a=new c(4);return a[0]=0,a[1]=0,a[2]=0,a[3]=1,a},n.rotationTo=function(){var a=h.create(),b=h.fromValues(1,0,0),c=h.fromValues(0,1,0);return function(d,e,f){var g=h.dot(e,f);return-.999999>g?(h.cross(a,b,e),h.length(a)<1e-6&&h.cross(a,c,e),h.normalize(a,a),n.setAxisAngle(d,a,Math.PI),d):g>.999999?(d[0]=0,d[1]=0,d[2]=0,d[3]=1,d):(h.cross(a,e,f),d[0]=a[0],d[1]=a[1],d[2]=a[2],d[3]=1+g,n.normalize(d,d))}}(),n.setAxes=function(){var a=l.create();return function(b,c,d,e){return a[0]=d[0],a[3]=d[1],a[6]=d[2],a[1]=e[0],a[4]=e[1],a[7]=e[2],a[2]=-c[0],a[5]=-c[1],a[8]=-c[2],n.normalize(b,n.fromMat3(b,a))}}(),n.clone=i.clone,n.fromValues=i.fromValues,n.copy=i.copy,n.set=i.set,n.identity=function(a){return a[0]=0,a[1]=0,a[2]=0,a[3]=1,a},n.setAxisAngle=function(a,b,c){c=.5*c;var d=Math.sin(c);return a[0]=d*b[0],a[1]=d*b[1],a[2]=d*b[2],a[3]=Math.cos(c),a},n.add=i.add,n.multiply=function(a,b,c){var d=b[0],e=b[1],f=b[2],g=b[3],h=c[0],i=c[1],j=c[2],k=c[3];return a[0]=d*k+g*h+e*j-f*i,a[1]=e*k+g*i+f*h-d*j,a[2]=f*k+g*j+d*i-e*h,a[3]=g*k-d*h-e*i-f*j,a},n.mul=n.multiply,n.scale=i.scale,n.rotateX=function(a,b,c){c*=.5;var d=b[0],e=b[1],f=b[2],g=b[3],h=Math.sin(c),i=Math.cos(c);return a[0]=d*i+g*h,a[1]=e*i+f*h,a[2]=f*i-e*h,a[3]=g*i-d*h,a},n.rotateY=function(a,b,c){c*=.5;var d=b[0],e=b[1],f=b[2],g=b[3],h=Math.sin(c),i=Math.cos(c);return a[0]=d*i-f*h,a[1]=e*i+g*h,a[2]=f*i+d*h,a[3]=g*i-e*h,a},n.rotateZ=function(a,b,c){c*=.5;var d=b[0],e=b[1],f=b[2],g=b[3],h=Math.sin(c),i=Math.cos(c);return a[0]=d*i+e*h,a[1]=e*i-d*h,a[2]=f*i+g*h,a[3]=g*i-f*h,a},n.calculateW=function(a,b){var c=b[0],d=b[1],e=b[2];return a[0]=c,a[1]=d,a[2]=e,a[3]=-Math.sqrt(Math.abs(1-c*c-d*d-e*e)),a},n.dot=i.dot,n.lerp=i.lerp,n.slerp=function(a,b,c,d){var e,f,g,h,i,j=b[0],k=b[1],l=b[2],m=b[3],n=c[0],o=c[1],p=c[2],q=c[3];return f=j*n+k*o+l*p+m*q,0>f&&(f=-f,n=-n,o=-o,p=-p,q=-q),1-f>1e-6?(e=Math.acos(f),g=Math.sin(e),h=Math.sin((1-d)*e)/g,i=Math.sin(d*e)/g):(h=1-d,i=d),a[0]=h*j+i*n,a[1]=h*k+i*o,a[2]=h*l+i*p,a[3]=h*m+i*q,a},n.invert=function(a,b){var c=b[0],d=b[1],e=b[2],f=b[3],g=c*c+d*d+e*e+f*f,h=g?1/g:0;return a[0]=-c*h,a[1]=-d*h,a[2]=-e*h,a[3]=f*h,a},n.conjugate=function(a,b){return a[0]=-b[0],a[1]=-b[1],a[2]=-b[2],a[3]=b[3],a},n.length=i.length,n.len=n.length,n.squaredLength=i.squaredLength,n.sqrLen=n.squaredLength,n.normalize=i.normalize,n.fromMat3=function(a,b){var c,d=b[0]+b[4]+b[8];if(d>0)c=Math.sqrt(d+1),a[3]=.5*c,c=.5/c,a[0]=(b[7]-b[5])*c,a[1]=(b[2]-b[6])*c,a[2]=(b[3]-b[1])*c;else{var e=0;b[4]>b[0]&&(e=1),b[8]>b[3*e+e]&&(e=2);var f=(e+1)%3,g=(e+2)%3;c=Math.sqrt(b[3*e+e]-b[3*f+f]-b[3*g+g]+1),a[e]=.5*c,c=.5/c,a[3]=(b[3*g+f]-b[3*f+g])*c,a[f]=(b[3*f+e]+b[3*e+f])*c,a[g]=(b[3*g+e]+b[3*e+g])*c}return a},n.str=function(a){return"quat("+a[0]+", "+a[1]+", "+a[2]+", "+a[3]+")"},"undefined"!=typeof a&&(a.quat=n)}(b.exports)}(this)},{}],23:[function(a,b,c){(function(){var a=this,d=a._,e={},f=Array.prototype,g=Object.prototype,h=Function.prototype,i=f.push,j=f.slice,k=f.concat,l=g.toString,m=g.hasOwnProperty,n=f.forEach,o=f.map,p=f.reduce,q=f.reduceRight,r=f.filter,s=f.every,t=f.some,u=f.indexOf,v=f.lastIndexOf,w=Array.isArray,x=Object.keys,y=h.bind,z=function(a){return a instanceof z?a:this instanceof z?void(this._wrapped=a):new z(a)};"undefined"!=typeof c?("undefined"!=typeof b&&b.exports&&(c=b.exports=z),c._=z):a._=z,z.VERSION="1.4.4";var A=z.each=z.forEach=function(a,b,c){if(null!=a)if(n&&a.forEach===n)a.forEach(b,c);else if(a.length===+a.length){for(var d=0,f=a.length;f>d;d++)if(b.call(c,a[d],d,a)===e)return}else for(var g in a)if(z.has(a,g)&&b.call(c,a[g],g,a)===e)return};z.map=z.collect=function(a,b,c){var d=[];return null==a?d:o&&a.map===o?a.map(b,c):(A(a,function(a,e,f){d[d.length]=b.call(c,a,e,f)}),d)};var B="Reduce of empty array with no initial value";z.reduce=z.foldl=z.inject=function(a,b,c,d){var e=arguments.length>2;if(null==a&&(a=[]),p&&a.reduce===p)return d&&(b=z.bind(b,d)),e?a.reduce(b,c):a.reduce(b);if(A(a,function(a,f,g){e?c=b.call(d,c,a,f,g):(c=a,e=!0)}),!e)throw new TypeError(B);return c},z.reduceRight=z.foldr=function(a,b,c,d){var e=arguments.length>2;if(null==a&&(a=[]),q&&a.reduceRight===q)return d&&(b=z.bind(b,d)),e?a.reduceRight(b,c):a.reduceRight(b);var f=a.length;if(f!==+f){var g=z.keys(a);f=g.length}if(A(a,function(h,i,j){i=g?g[--f]:--f,e?c=b.call(d,c,a[i],i,j):(c=a[i],e=!0)}),!e)throw new TypeError(B);return c},z.find=z.detect=function(a,b,c){var d;return C(a,function(a,e,f){return b.call(c,a,e,f)?(d=a,!0):void 0}),d},z.filter=z.select=function(a,b,c){var d=[];return null==a?d:r&&a.filter===r?a.filter(b,c):(A(a,function(a,e,f){b.call(c,a,e,f)&&(d[d.length]=a)}),d)},z.reject=function(a,b,c){return z.filter(a,function(a,d,e){return!b.call(c,a,d,e)},c)},z.every=z.all=function(a,b,c){b||(b=z.identity);var d=!0;return null==a?d:s&&a.every===s?a.every(b,c):(A(a,function(a,f,g){return(d=d&&b.call(c,a,f,g))?void 0:e}),!!d)};var C=z.some=z.any=function(a,b,c){b||(b=z.identity);var d=!1;return null==a?d:t&&a.some===t?a.some(b,c):(A(a,function(a,f,g){return d||(d=b.call(c,a,f,g))?e:void 0}),!!d)};z.contains=z.include=function(a,b){return null==a?!1:u&&a.indexOf===u?-1!=a.indexOf(b):C(a,function(a){return a===b})},z.invoke=function(a,b){var c=j.call(arguments,2),d=z.isFunction(b);return z.map(a,function(a){return(d?b:a[b]).apply(a,c)})},z.pluck=function(a,b){return z.map(a,function(a){return a[b]})},z.where=function(a,b,c){return z.isEmpty(b)?c?null:[]:z[c?"find":"filter"](a,function(a){for(var c in b)if(b[c]!==a[c])return!1;return!0})},z.findWhere=function(a,b){return z.where(a,b,!0)},z.max=function(a,b,c){if(!b&&z.isArray(a)&&a[0]===+a[0]&&a.length<65535)return Math.max.apply(Math,a);if(!b&&z.isEmpty(a))return-1/0;var d={computed:-1/0,value:-1/0};return A(a,function(a,e,f){var g=b?b.call(c,a,e,f):a;g>=d.computed&&(d={value:a,computed:g})}),d.value},z.min=function(a,b,c){if(!b&&z.isArray(a)&&a[0]===+a[0]&&a.length<65535)return Math.min.apply(Math,a);if(!b&&z.isEmpty(a))return 1/0;var d={computed:1/0,value:1/0};return A(a,function(a,e,f){var g=b?b.call(c,a,e,f):a;g<d.computed&&(d={value:a,computed:g})}),d.value},z.shuffle=function(a){var b,c=0,d=[];return A(a,function(a){b=z.random(c++),d[c-1]=d[b],d[b]=a}),d};var D=function(a){return z.isFunction(a)?a:function(b){return b[a]}};z.sortBy=function(a,b,c){var d=D(b);return z.pluck(z.map(a,function(a,b,e){return{value:a,index:b,criteria:d.call(c,a,b,e)}
}).sort(function(a,b){var c=a.criteria,d=b.criteria;if(c!==d){if(c>d||void 0===c)return 1;if(d>c||void 0===d)return-1}return a.index<b.index?-1:1}),"value")};var E=function(a,b,c,d){var e={},f=D(b||z.identity);return A(a,function(b,g){var h=f.call(c,b,g,a);d(e,h,b)}),e};z.groupBy=function(a,b,c){return E(a,b,c,function(a,b,c){(z.has(a,b)?a[b]:a[b]=[]).push(c)})},z.countBy=function(a,b,c){return E(a,b,c,function(a,b){z.has(a,b)||(a[b]=0),a[b]++})},z.sortedIndex=function(a,b,c,d){c=null==c?z.identity:D(c);for(var e=c.call(d,b),f=0,g=a.length;g>f;){var h=f+g>>>1;c.call(d,a[h])<e?f=h+1:g=h}return f},z.toArray=function(a){return a?z.isArray(a)?j.call(a):a.length===+a.length?z.map(a,z.identity):z.values(a):[]},z.size=function(a){return null==a?0:a.length===+a.length?a.length:z.keys(a).length},z.first=z.head=z.take=function(a,b,c){return null==a?void 0:null==b||c?a[0]:j.call(a,0,b)},z.initial=function(a,b,c){return j.call(a,0,a.length-(null==b||c?1:b))},z.last=function(a,b,c){return null==a?void 0:null==b||c?a[a.length-1]:j.call(a,Math.max(a.length-b,0))},z.rest=z.tail=z.drop=function(a,b,c){return j.call(a,null==b||c?1:b)},z.compact=function(a){return z.filter(a,z.identity)};var F=function(a,b,c){return A(a,function(a){z.isArray(a)?b?i.apply(c,a):F(a,b,c):c.push(a)}),c};z.flatten=function(a,b){return F(a,b,[])},z.without=function(a){return z.difference(a,j.call(arguments,1))},z.uniq=z.unique=function(a,b,c,d){z.isFunction(b)&&(d=c,c=b,b=!1);var e=c?z.map(a,c,d):a,f=[],g=[];return A(e,function(c,d){(b?d&&g[g.length-1]===c:z.contains(g,c))||(g.push(c),f.push(a[d]))}),f},z.union=function(){return z.uniq(k.apply(f,arguments))},z.intersection=function(a){var b=j.call(arguments,1);return z.filter(z.uniq(a),function(a){return z.every(b,function(b){return z.indexOf(b,a)>=0})})},z.difference=function(a){var b=k.apply(f,j.call(arguments,1));return z.filter(a,function(a){return!z.contains(b,a)})},z.zip=function(){for(var a=j.call(arguments),b=z.max(z.pluck(a,"length")),c=new Array(b),d=0;b>d;d++)c[d]=z.pluck(a,""+d);return c},z.object=function(a,b){if(null==a)return{};for(var c={},d=0,e=a.length;e>d;d++)b?c[a[d]]=b[d]:c[a[d][0]]=a[d][1];return c},z.indexOf=function(a,b,c){if(null==a)return-1;var d=0,e=a.length;if(c){if("number"!=typeof c)return d=z.sortedIndex(a,b),a[d]===b?d:-1;d=0>c?Math.max(0,e+c):c}if(u&&a.indexOf===u)return a.indexOf(b,c);for(;e>d;d++)if(a[d]===b)return d;return-1},z.lastIndexOf=function(a,b,c){if(null==a)return-1;var d=null!=c;if(v&&a.lastIndexOf===v)return d?a.lastIndexOf(b,c):a.lastIndexOf(b);for(var e=d?c:a.length;e--;)if(a[e]===b)return e;return-1},z.range=function(a,b,c){arguments.length<=1&&(b=a||0,a=0),c=arguments[2]||1;for(var d=Math.max(Math.ceil((b-a)/c),0),e=0,f=new Array(d);d>e;)f[e++]=a,a+=c;return f},z.bind=function(a,b){if(a.bind===y&&y)return y.apply(a,j.call(arguments,1));var c=j.call(arguments,2);return function(){return a.apply(b,c.concat(j.call(arguments)))}},z.partial=function(a){var b=j.call(arguments,1);return function(){return a.apply(this,b.concat(j.call(arguments)))}},z.bindAll=function(a){var b=j.call(arguments,1);return 0===b.length&&(b=z.functions(a)),A(b,function(b){a[b]=z.bind(a[b],a)}),a},z.memoize=function(a,b){var c={};return b||(b=z.identity),function(){var d=b.apply(this,arguments);return z.has(c,d)?c[d]:c[d]=a.apply(this,arguments)}},z.delay=function(a,b){var c=j.call(arguments,2);return setTimeout(function(){return a.apply(null,c)},b)},z.defer=function(a){return z.delay.apply(z,[a,1].concat(j.call(arguments,1)))},z.throttle=function(a,b){var c,d,e,f,g=0,h=function(){g=new Date,e=null,f=a.apply(c,d)};return function(){var i=new Date,j=b-(i-g);return c=this,d=arguments,0>=j?(clearTimeout(e),e=null,g=i,f=a.apply(c,d)):e||(e=setTimeout(h,j)),f}},z.debounce=function(a,b,c){var d,e;return function(){var f=this,g=arguments,h=function(){d=null,c||(e=a.apply(f,g))},i=c&&!d;return clearTimeout(d),d=setTimeout(h,b),i&&(e=a.apply(f,g)),e}},z.once=function(a){var b,c=!1;return function(){return c?b:(c=!0,b=a.apply(this,arguments),a=null,b)}},z.wrap=function(a,b){return function(){var c=[a];return i.apply(c,arguments),b.apply(this,c)}},z.compose=function(){var a=arguments;return function(){for(var b=arguments,c=a.length-1;c>=0;c--)b=[a[c].apply(this,b)];return b[0]}},z.after=function(a,b){return 0>=a?b():function(){return--a<1?b.apply(this,arguments):void 0}},z.keys=x||function(a){if(a!==Object(a))throw new TypeError("Invalid object");var b=[];for(var c in a)z.has(a,c)&&(b[b.length]=c);return b},z.values=function(a){var b=[];for(var c in a)z.has(a,c)&&b.push(a[c]);return b},z.pairs=function(a){var b=[];for(var c in a)z.has(a,c)&&b.push([c,a[c]]);return b},z.invert=function(a){var b={};for(var c in a)z.has(a,c)&&(b[a[c]]=c);return b},z.functions=z.methods=function(a){var b=[];for(var c in a)z.isFunction(a[c])&&b.push(c);return b.sort()},z.extend=function(a){return A(j.call(arguments,1),function(b){if(b)for(var c in b)a[c]=b[c]}),a},z.pick=function(a){var b={},c=k.apply(f,j.call(arguments,1));return A(c,function(c){c in a&&(b[c]=a[c])}),b},z.omit=function(a){var b={},c=k.apply(f,j.call(arguments,1));for(var d in a)z.contains(c,d)||(b[d]=a[d]);return b},z.defaults=function(a){return A(j.call(arguments,1),function(b){if(b)for(var c in b)null==a[c]&&(a[c]=b[c])}),a},z.clone=function(a){return z.isObject(a)?z.isArray(a)?a.slice():z.extend({},a):a},z.tap=function(a,b){return b(a),a};var G=function(a,b,c,d){if(a===b)return 0!==a||1/a==1/b;if(null==a||null==b)return a===b;a instanceof z&&(a=a._wrapped),b instanceof z&&(b=b._wrapped);var e=l.call(a);if(e!=l.call(b))return!1;switch(e){case"[object String]":return a==String(b);case"[object Number]":return a!=+a?b!=+b:0==a?1/a==1/b:a==+b;case"[object Date]":case"[object Boolean]":return+a==+b;case"[object RegExp]":return a.source==b.source&&a.global==b.global&&a.multiline==b.multiline&&a.ignoreCase==b.ignoreCase}if("object"!=typeof a||"object"!=typeof b)return!1;for(var f=c.length;f--;)if(c[f]==a)return d[f]==b;c.push(a),d.push(b);var g=0,h=!0;if("[object Array]"==e){if(g=a.length,h=g==b.length)for(;g--&&(h=G(a[g],b[g],c,d)););}else{var i=a.constructor,j=b.constructor;if(i!==j&&!(z.isFunction(i)&&i instanceof i&&z.isFunction(j)&&j instanceof j))return!1;for(var k in a)if(z.has(a,k)&&(g++,!(h=z.has(b,k)&&G(a[k],b[k],c,d))))break;if(h){for(k in b)if(z.has(b,k)&&!g--)break;h=!g}}return c.pop(),d.pop(),h};z.isEqual=function(a,b){return G(a,b,[],[])},z.isEmpty=function(a){if(null==a)return!0;if(z.isArray(a)||z.isString(a))return 0===a.length;for(var b in a)if(z.has(a,b))return!1;return!0},z.isElement=function(a){return!(!a||1!==a.nodeType)},z.isArray=w||function(a){return"[object Array]"==l.call(a)},z.isObject=function(a){return a===Object(a)},A(["Arguments","Function","String","Number","Date","RegExp"],function(a){z["is"+a]=function(b){return l.call(b)=="[object "+a+"]"}}),z.isArguments(arguments)||(z.isArguments=function(a){return!(!a||!z.has(a,"callee"))}),"function"!=typeof/./&&(z.isFunction=function(a){return"function"==typeof a}),z.isFinite=function(a){return isFinite(a)&&!isNaN(parseFloat(a))},z.isNaN=function(a){return z.isNumber(a)&&a!=+a},z.isBoolean=function(a){return a===!0||a===!1||"[object Boolean]"==l.call(a)},z.isNull=function(a){return null===a},z.isUndefined=function(a){return void 0===a},z.has=function(a,b){return m.call(a,b)},z.noConflict=function(){return a._=d,this},z.identity=function(a){return a},z.times=function(a,b,c){for(var d=Array(a),e=0;a>e;e++)d[e]=b.call(c,e);return d},z.random=function(a,b){return null==b&&(b=a,a=0),a+Math.floor(Math.random()*(b-a+1))};var H={escape:{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#x27;","/":"&#x2F;"}};H.unescape=z.invert(H.escape);var I={escape:new RegExp("["+z.keys(H.escape).join("")+"]","g"),unescape:new RegExp("("+z.keys(H.unescape).join("|")+")","g")};z.each(["escape","unescape"],function(a){z[a]=function(b){return null==b?"":(""+b).replace(I[a],function(b){return H[a][b]})}}),z.result=function(a,b){if(null==a)return null;var c=a[b];return z.isFunction(c)?c.call(a):c},z.mixin=function(a){A(z.functions(a),function(b){var c=z[b]=a[b];z.prototype[b]=function(){var a=[this._wrapped];return i.apply(a,arguments),N.call(this,c.apply(z,a))}})};var J=0;z.uniqueId=function(a){var b=++J+"";return a?a+b:b},z.templateSettings={evaluate:/<%([\s\S]+?)%>/g,interpolate:/<%=([\s\S]+?)%>/g,escape:/<%-([\s\S]+?)%>/g};var K=/(.)^/,L={"'":"'","\\":"\\","\r":"r","\n":"n","	":"t","\u2028":"u2028","\u2029":"u2029"},M=/\\|'|\r|\n|\t|\u2028|\u2029/g;z.template=function(a,b,c){var d;c=z.defaults({},c,z.templateSettings);var e=new RegExp([(c.escape||K).source,(c.interpolate||K).source,(c.evaluate||K).source].join("|")+"|$","g"),f=0,g="__p+='";a.replace(e,function(b,c,d,e,h){return g+=a.slice(f,h).replace(M,function(a){return"\\"+L[a]}),c&&(g+="'+\n((__t=("+c+"))==null?'':_.escape(__t))+\n'"),d&&(g+="'+\n((__t=("+d+"))==null?'':__t)+\n'"),e&&(g+="';\n"+e+"\n__p+='"),f=h+b.length,b}),g+="';\n",c.variable||(g="with(obj||{}){\n"+g+"}\n"),g="var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};\n"+g+"return __p;\n";try{d=new Function(c.variable||"obj","_",g)}catch(h){throw h.source=g,h}if(b)return d(b,z);var i=function(a){return d.call(this,a,z)};return i.source="function("+(c.variable||"obj")+"){\n"+g+"}",i},z.chain=function(a){return z(a).chain()};var N=function(a){return this._chain?z(a).chain():a};z.mixin(z),A(["pop","push","reverse","shift","sort","splice","unshift"],function(a){var b=f[a];z.prototype[a]=function(){var c=this._wrapped;return b.apply(c,arguments),"shift"!=a&&"splice"!=a||0!==c.length||delete c[0],N.call(this,c)}}),A(["concat","join","slice"],function(a){var b=f[a];z.prototype[a]=function(){return N.call(this,b.apply(this._wrapped,arguments))}}),z.extend(z.prototype,{chain:function(){return this._chain=!0,this},value:function(){return this._wrapped}})}).call(this)},{}],24:[function(a){"undefined"!=typeof window&&"function"!=typeof window.requestAnimationFrame&&(window.requestAnimationFrame=window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame||window.oRequestAnimationFrame||window.msRequestAnimationFrame||function(a){setTimeout(a,1e3/60)}),Leap=a("../lib/index")},{"../lib/index":10}]},{},[24]);
/** vim: et:ts=4:sw=4:sts=4
 * @license RequireJS 2.1.14 Copyright (c) 2010-2014, The Dojo Foundation All Rights Reserved.
 * Available via the MIT or new BSD license.
 * see: http://github.com/jrburke/requirejs for details
 */
//Not using strict: uneven strict support in browsers, #392, and causes
//problems with requirejs.exec()/transpiler plugins that may not be strict.
/*jslint regexp: true, nomen: true, sloppy: true */
/*global window, navigator, document, importScripts, setTimeout, opera */
// 修改版！：
// 强制覆盖当前环境中的requirejs，require，define等全局变量
var requirejs = null, require = null, define = null;
(function (global) {
    var req, s, head, baseElement, dataMain, src,
        interactiveScript, currentlyAddingScript, mainScript, subPath,
        version = '2.1.14',
        commentRegExp = /(\/\*([\s\S]*?)\*\/|([^:]|^)\/\/(.*)$)/mg,
        cjsRequireRegExp = /[^.]\s*require\s*\(\s*["']([^'"\s]+)["']\s*\)/g,
        jsSuffixRegExp = /\.js$/,
        currDirRegExp = /^\.\//,
        op = Object.prototype,
        ostring = op.toString,
        hasOwn = op.hasOwnProperty,
        ap = Array.prototype,
        apsp = ap.splice,
        isBrowser = !!(typeof window !== 'undefined' && typeof navigator !== 'undefined' && window.document),
        isWebWorker = !isBrowser && typeof importScripts !== 'undefined',
        //PS3 indicates loaded and complete, but need to wait for complete
        //specifically. Sequence is 'loading', 'loaded', execution,
        // then 'complete'. The UA check is unfortunate, but not sure how
        //to feature test w/o causing perf issues.
        readyRegExp = isBrowser && navigator.platform === 'PLAYSTATION 3' ?
                      /^complete$/ : /^(complete|loaded)$/,
        defContextName = '_',
        //Oh the tragedy, detecting opera. See the usage of isOpera for reason.
        isOpera = typeof opera !== 'undefined' && opera.toString() === '[object Opera]',
        contexts = {},
        cfg = {},
        globalDefQueue = [],
        useInteractive = false;

    function isFunction(it) {
        return ostring.call(it) === '[object Function]';
    }

    function isArray(it) {
        return ostring.call(it) === '[object Array]';
    }

    /**
     * Helper function for iterating over an array. If the func returns
     * a true value, it will break out of the loop.
     */
    function each(ary, func) {
        if (ary) {
            var i;
            for (i = 0; i < ary.length; i += 1) {
                if (ary[i] && func(ary[i], i, ary)) {
                    break;
                }
            }
        }
    }

    /**
     * Helper function for iterating over an array backwards. If the func
     * returns a true value, it will break out of the loop.
     */
    function eachReverse(ary, func) {
        if (ary) {
            var i;
            for (i = ary.length - 1; i > -1; i -= 1) {
                if (ary[i] && func(ary[i], i, ary)) {
                    break;
                }
            }
        }
    }

    function hasProp(obj, prop) {
        return hasOwn.call(obj, prop);
    }

    function getOwn(obj, prop) {
        return hasProp(obj, prop) && obj[prop];
    }

    /**
     * Cycles over properties in an object and calls a function for each
     * property value. If the function returns a truthy value, then the
     * iteration is stopped.
     */
    function eachProp(obj, func) {
        var prop;
        for (prop in obj) {
            if (hasProp(obj, prop)) {
                if (func(obj[prop], prop)) {
                    break;
                }
            }
        }
    }

    /**
     * Simple function to mix in properties from source into target,
     * but only if target does not already have a property of the same name.
     */
    function mixin(target, source, force, deepStringMixin) {
        if (source) {
            eachProp(source, function (value, prop) {
                if (force || !hasProp(target, prop)) {
                    if (deepStringMixin && typeof value === 'object' && value &&
                        !isArray(value) && !isFunction(value) &&
                        !(value instanceof RegExp)) {

                        if (!target[prop]) {
                            target[prop] = {};
                        }
                        mixin(target[prop], value, force, deepStringMixin);
                    } else {
                        target[prop] = value;
                    }
                }
            });
        }
        return target;
    }

    //Similar to Function.prototype.bind, but the 'this' object is specified
    //first, since it is easier to read/figure out what 'this' will be.
    function bind(obj, fn) {
        return function () {
            return fn.apply(obj, arguments);
        };
    }

    function scripts() {
        return document.getElementsByTagName('script');
    }

    function defaultOnError(err) {
        throw err;
    }

    //Allow getting a global that is expressed in
    //dot notation, like 'a.b.c'.
    function getGlobal(value) {
        if (!value) {
            return value;
        }
        var g = global;
        each(value.split('.'), function (part) {
            g = g[part];
        });
        return g;
    }

    /**
     * Constructs an error with a pointer to an URL with more information.
     * @param {String} id the error ID that maps to an ID on a web page.
     * @param {String} message human readable error.
     * @param {Error} [err] the original error, if there is one.
     *
     * @returns {Error}
     */
    function makeError(id, msg, err, requireModules) {
        var e = new Error(msg + '\nhttp://requirejs.org/docs/errors.html#' + id);
        e.requireType = id;
        e.requireModules = requireModules;
        if (err) {
            e.originalError = err;
        }
        return e;
    }

    // if (typeof define !== 'undefined') {
    //     //If a define is already in play via another AMD loader,
    //     //do not overwrite.
    //     return;
    // }

    // if (typeof requirejs !== 'undefined') {
    //     if (isFunction(requirejs)) {
    //         //Do not overwrite an existing requirejs instance.
    //         return;
    //     }
    //     cfg = requirejs;
    //     requirejs = undefined;
    // }

    // //Allow for a require config object
    // if (typeof require !== 'undefined' && !isFunction(require)) {
    //     //assume it is a config object.
    //     cfg = require;
    //     require = undefined;
    // }

    function newContext(contextName) {
        var inCheckLoaded, Module, context, handlers,
            checkLoadedTimeoutId,
            config = {
                //Defaults. Do not set a default for map
                //config to speed up normalize(), which
                //will run faster if there is no default.
                waitSeconds: 7,
                baseUrl: './',
                paths: {},
                bundles: {},
                pkgs: {},
                shim: {},
                config: {}
            },
            registry = {},
            //registry of just enabled modules, to speed
            //cycle breaking code when lots of modules
            //are registered, but not activated.
            enabledRegistry = {},
            undefEvents = {},
            defQueue = [],
            defined = {},
            urlFetched = {},
            bundlesMap = {},
            requireCounter = 1,
            unnormalizedCounter = 1;

        /**
         * Trims the . and .. from an array of path segments.
         * It will keep a leading path segment if a .. will become
         * the first path segment, to help with module name lookups,
         * which act like paths, but can be remapped. But the end result,
         * all paths that use this function should look normalized.
         * NOTE: this method MODIFIES the input array.
         * @param {Array} ary the array of path segments.
         */
        function trimDots(ary) {
            var i, part;
            for (i = 0; i < ary.length; i++) {
                part = ary[i];
                if (part === '.') {
                    ary.splice(i, 1);
                    i -= 1;
                } else if (part === '..') {
                    // If at the start, or previous value is still ..,
                    // keep them so that when converted to a path it may
                    // still work when converted to a path, even though
                    // as an ID it is less than ideal. In larger point
                    // releases, may be better to just kick out an error.
                    if (i === 0 || (i == 1 && ary[2] === '..') || ary[i - 1] === '..') {
                        continue;
                    } else if (i > 0) {
                        ary.splice(i - 1, 2);
                        i -= 2;
                    }
                }
            }
        }

        /**
         * Given a relative module name, like ./something, normalize it to
         * a real name that can be mapped to a path.
         * @param {String} name the relative name
         * @param {String} baseName a real name that the name arg is relative
         * to.
         * @param {Boolean} applyMap apply the map config to the value. Should
         * only be done if this normalization is for a dependency ID.
         * @returns {String} normalized name
         */
        function normalize(name, baseName, applyMap) {
            var pkgMain, mapValue, nameParts, i, j, nameSegment, lastIndex,
                foundMap, foundI, foundStarMap, starI, normalizedBaseParts,
                baseParts = (baseName && baseName.split('/')),
                map = config.map,
                starMap = map && map['*'];

            //Adjust any relative paths.
            if (name) {
                name = name.split('/');
                lastIndex = name.length - 1;

                // If wanting node ID compatibility, strip .js from end
                // of IDs. Have to do this here, and not in nameToUrl
                // because node allows either .js or non .js to map
                // to same file.
                if (config.nodeIdCompat && jsSuffixRegExp.test(name[lastIndex])) {
                    name[lastIndex] = name[lastIndex].replace(jsSuffixRegExp, '');
                }

                // Starts with a '.' so need the baseName
                if (name[0].charAt(0) === '.' && baseParts) {
                    //Convert baseName to array, and lop off the last part,
                    //so that . matches that 'directory' and not name of the baseName's
                    //module. For instance, baseName of 'one/two/three', maps to
                    //'one/two/three.js', but we want the directory, 'one/two' for
                    //this normalization.
                    normalizedBaseParts = baseParts.slice(0, baseParts.length - 1);
                    name = normalizedBaseParts.concat(name);
                }

                trimDots(name);
                name = name.join('/');
            }

            //Apply map config if available.
            if (applyMap && map && (baseParts || starMap)) {
                nameParts = name.split('/');

                outerLoop: for (i = nameParts.length; i > 0; i -= 1) {
                    nameSegment = nameParts.slice(0, i).join('/');

                    if (baseParts) {
                        //Find the longest baseName segment match in the config.
                        //So, do joins on the biggest to smallest lengths of baseParts.
                        for (j = baseParts.length; j > 0; j -= 1) {
                            mapValue = getOwn(map, baseParts.slice(0, j).join('/'));

                            //baseName segment has config, find if it has one for
                            //this name.
                            if (mapValue) {
                                mapValue = getOwn(mapValue, nameSegment);
                                if (mapValue) {
                                    //Match, update name to the new value.
                                    foundMap = mapValue;
                                    foundI = i;
                                    break outerLoop;
                                }
                            }
                        }
                    }

                    //Check for a star map match, but just hold on to it,
                    //if there is a shorter segment match later in a matching
                    //config, then favor over this star map.
                    if (!foundStarMap && starMap && getOwn(starMap, nameSegment)) {
                        foundStarMap = getOwn(starMap, nameSegment);
                        starI = i;
                    }
                }

                if (!foundMap && foundStarMap) {
                    foundMap = foundStarMap;
                    foundI = starI;
                }

                if (foundMap) {
                    nameParts.splice(0, foundI, foundMap);
                    name = nameParts.join('/');
                }
            }

            // If the name points to a package's name, use
            // the package main instead.
            pkgMain = getOwn(config.pkgs, name);

            return pkgMain ? pkgMain : name;
        }

        function removeScript(name) {
            if (isBrowser) {
                each(scripts(), function (scriptNode) {
                    if (scriptNode.getAttribute('data-requiremodule') === name &&
                            scriptNode.getAttribute('data-requirecontext') === context.contextName) {
                        scriptNode.parentNode.removeChild(scriptNode);
                        return true;
                    }
                });
            }
        }

        function hasPathFallback(id) {
            var pathConfig = getOwn(config.paths, id);
            if (pathConfig && isArray(pathConfig) && pathConfig.length > 1) {
                //Pop off the first array value, since it failed, and
                //retry
                pathConfig.shift();
                context.require.undef(id);

                //Custom require that does not do map translation, since
                //ID is "absolute", already mapped/resolved.
                context.makeRequire(null, {
                    skipMap: true
                })([id]);

                return true;
            }
        }

        //Turns a plugin!resource to [plugin, resource]
        //with the plugin being undefined if the name
        //did not have a plugin prefix.
        function splitPrefix(name) {
            var prefix,
                index = name ? name.indexOf('!') : -1;
            if (index > -1) {
                prefix = name.substring(0, index);
                name = name.substring(index + 1, name.length);
            }
            return [prefix, name];
        }

        /**
         * Creates a module mapping that includes plugin prefix, module
         * name, and path. If parentModuleMap is provided it will
         * also normalize the name via require.normalize()
         *
         * @param {String} name the module name
         * @param {String} [parentModuleMap] parent module map
         * for the module name, used to resolve relative names.
         * @param {Boolean} isNormalized: is the ID already normalized.
         * This is true if this call is done for a define() module ID.
         * @param {Boolean} applyMap: apply the map config to the ID.
         * Should only be true if this map is for a dependency.
         *
         * @returns {Object}
         */
        function makeModuleMap(name, parentModuleMap, isNormalized, applyMap) {
            var url, pluginModule, suffix, nameParts,
                prefix = null,
                parentName = parentModuleMap ? parentModuleMap.name : null,
                originalName = name,
                isDefine = true,
                normalizedName = '';

            //If no name, then it means it is a require call, generate an
            //internal name.
            if (!name) {
                isDefine = false;
                name = '_@r' + (requireCounter += 1);
            }

            nameParts = splitPrefix(name);
            prefix = nameParts[0];
            name = nameParts[1];

            if (prefix) {
                prefix = normalize(prefix, parentName, applyMap);
                pluginModule = getOwn(defined, prefix);
            }

            //Account for relative paths if there is a base name.
            if (name) {
                if (prefix) {
                    if (pluginModule && pluginModule.normalize) {
                        //Plugin is loaded, use its normalize method.
                        normalizedName = pluginModule.normalize(name, function (name) {
                            return normalize(name, parentName, applyMap);
                        });
                    } else {
                        // If nested plugin references, then do not try to
                        // normalize, as it will not normalize correctly. This
                        // places a restriction on resourceIds, and the longer
                        // term solution is not to normalize until plugins are
                        // loaded and all normalizations to allow for async
                        // loading of a loader plugin. But for now, fixes the
                        // common uses. Details in #1131
                        normalizedName = name.indexOf('!') === -1 ?
                                         normalize(name, parentName, applyMap) :
                                         name;
                    }
                } else {
                    //A regular module.
                    normalizedName = normalize(name, parentName, applyMap);

                    //Normalized name may be a plugin ID due to map config
                    //application in normalize. The map config values must
                    //already be normalized, so do not need to redo that part.
                    nameParts = splitPrefix(normalizedName);
                    prefix = nameParts[0];
                    normalizedName = nameParts[1];
                    isNormalized = true;

                    url = context.nameToUrl(normalizedName);
                }
            }

            //If the id is a plugin id that cannot be determined if it needs
            //normalization, stamp it with a unique ID so two matching relative
            //ids that may conflict can be separate.
            suffix = prefix && !pluginModule && !isNormalized ?
                     '_unnormalized' + (unnormalizedCounter += 1) :
                     '';

            return {
                prefix: prefix,
                name: normalizedName,
                parentMap: parentModuleMap,
                unnormalized: !!suffix,
                url: url,
                originalName: originalName,
                isDefine: isDefine,
                id: (prefix ?
                        prefix + '!' + normalizedName :
                        normalizedName) + suffix
            };
        }

        function getModule(depMap) {
            var id = depMap.id,
                mod = getOwn(registry, id);

            if (!mod) {
                mod = registry[id] = new context.Module(depMap);
            }

            return mod;
        }

        function on(depMap, name, fn) {
            var id = depMap.id,
                mod = getOwn(registry, id);

            if (hasProp(defined, id) &&
                    (!mod || mod.defineEmitComplete)) {
                if (name === 'defined') {
                    fn(defined[id]);
                }
            } else {
                mod = getModule(depMap);
                if (mod.error && name === 'error') {
                    fn(mod.error);
                } else {
                    mod.on(name, fn);
                }
            }
        }

        function onError(err, errback) {
            var ids = err.requireModules,
                notified = false;

            if (errback) {
                errback(err);
            } else {
                each(ids, function (id) {
                    var mod = getOwn(registry, id);
                    if (mod) {
                        //Set error on module, so it skips timeout checks.
                        mod.error = err;
                        if (mod.events.error) {
                            notified = true;
                            mod.emit('error', err);
                        }
                    }
                });

                if (!notified) {
                    req.onError(err);
                }
            }
        }

        /**
         * Internal method to transfer globalQueue items to this context's
         * defQueue.
         */
        function takeGlobalQueue() {
            //Push all the globalDefQueue items into the context's defQueue
            if (globalDefQueue.length) {
                //Array splice in the values since the context code has a
                //local var ref to defQueue, so cannot just reassign the one
                //on context.
                apsp.apply(defQueue,
                           [defQueue.length, 0].concat(globalDefQueue));
                globalDefQueue = [];
            }
        }

        handlers = {
            'require': function (mod) {
                if (mod.require) {
                    return mod.require;
                } else {
                    return (mod.require = context.makeRequire(mod.map));
                }
            },
            'exports': function (mod) {
                mod.usingExports = true;
                if (mod.map.isDefine) {
                    if (mod.exports) {
                        return (defined[mod.map.id] = mod.exports);
                    } else {
                        return (mod.exports = defined[mod.map.id] = {});
                    }
                }
            },
            'module': function (mod) {
                if (mod.module) {
                    return mod.module;
                } else {
                    return (mod.module = {
                        id: mod.map.id,
                        uri: mod.map.url,
                        config: function () {
                            return  getOwn(config.config, mod.map.id) || {};
                        },
                        exports: mod.exports || (mod.exports = {})
                    });
                }
            }
        };

        function cleanRegistry(id) {
            //Clean up machinery used for waiting modules.
            delete registry[id];
            delete enabledRegistry[id];
        }

        function breakCycle(mod, traced, processed) {
            var id = mod.map.id;

            if (mod.error) {
                mod.emit('error', mod.error);
            } else {
                traced[id] = true;
                each(mod.depMaps, function (depMap, i) {
                    var depId = depMap.id,
                        dep = getOwn(registry, depId);

                    //Only force things that have not completed
                    //being defined, so still in the registry,
                    //and only if it has not been matched up
                    //in the module already.
                    if (dep && !mod.depMatched[i] && !processed[depId]) {
                        if (getOwn(traced, depId)) {
                            mod.defineDep(i, defined[depId]);
                            mod.check(); //pass false?
                        } else {
                            breakCycle(dep, traced, processed);
                        }
                    }
                });
                processed[id] = true;
            }
        }

        function checkLoaded() {
            var err, usingPathFallback,
                waitInterval = config.waitSeconds * 1000,
                //It is possible to disable the wait interval by using waitSeconds of 0.
                expired = waitInterval && (context.startTime + waitInterval) < new Date().getTime(),
                noLoads = [],
                reqCalls = [],
                stillLoading = false,
                needCycleCheck = true;

            //Do not bother if this call was a result of a cycle break.
            if (inCheckLoaded) {
                return;
            }

            inCheckLoaded = true;

            //Figure out the state of all the modules.
            eachProp(enabledRegistry, function (mod) {
                var map = mod.map,
                    modId = map.id;

                //Skip things that are not enabled or in error state.
                if (!mod.enabled) {
                    return;
                }

                if (!map.isDefine) {
                    reqCalls.push(mod);
                }

                if (!mod.error) {
                    //If the module should be executed, and it has not
                    //been inited and time is up, remember it.
                    if (!mod.inited && expired) {
                        if (hasPathFallback(modId)) {
                            usingPathFallback = true;
                            stillLoading = true;
                        } else {
                            noLoads.push(modId);
                            removeScript(modId);
                        }
                    } else if (!mod.inited && mod.fetched && map.isDefine) {
                        stillLoading = true;
                        if (!map.prefix) {
                            //No reason to keep looking for unfinished
                            //loading. If the only stillLoading is a
                            //plugin resource though, keep going,
                            //because it may be that a plugin resource
                            //is waiting on a non-plugin cycle.
                            return (needCycleCheck = false);
                        }
                    }
                }
            });

            if (expired && noLoads.length) {
                //If wait time expired, throw error of unloaded modules.
                err = makeError('timeout', 'Load timeout for modules: ' + noLoads, null, noLoads);
                err.contextName = context.contextName;
                return onError(err);
            }

            //Not expired, check for a cycle.
            if (needCycleCheck) {
                each(reqCalls, function (mod) {
                    breakCycle(mod, {}, {});
                });
            }

            //If still waiting on loads, and the waiting load is something
            //other than a plugin resource, or there are still outstanding
            //scripts, then just try back later.
            if ((!expired || usingPathFallback) && stillLoading) {
                //Something is still waiting to load. Wait for it, but only
                //if a timeout is not already in effect.
                if ((isBrowser || isWebWorker) && !checkLoadedTimeoutId) {
                    checkLoadedTimeoutId = setTimeout(function () {
                        checkLoadedTimeoutId = 0;
                        checkLoaded();
                    }, 50);
                }
            }

            inCheckLoaded = false;
        }

        Module = function (map) {
            this.events = getOwn(undefEvents, map.id) || {};
            this.map = map;
            this.shim = getOwn(config.shim, map.id);
            this.depExports = [];
            this.depMaps = [];
            this.depMatched = [];
            this.pluginMaps = {};
            this.depCount = 0;

            /* this.exports this.factory
               this.depMaps = [],
               this.enabled, this.fetched
            */
        };

        Module.prototype = {
            init: function (depMaps, factory, errback, options) {
                options = options || {};

                //Do not do more inits if already done. Can happen if there
                //are multiple define calls for the same module. That is not
                //a normal, common case, but it is also not unexpected.
                if (this.inited) {
                    return;
                }

                this.factory = factory;

                if (errback) {
                    //Register for errors on this module.
                    this.on('error', errback);
                } else if (this.events.error) {
                    //If no errback already, but there are error listeners
                    //on this module, set up an errback to pass to the deps.
                    errback = bind(this, function (err) {
                        this.emit('error', err);
                    });
                }

                //Do a copy of the dependency array, so that
                //source inputs are not modified. For example
                //"shim" deps are passed in here directly, and
                //doing a direct modification of the depMaps array
                //would affect that config.
                this.depMaps = depMaps && depMaps.slice(0);

                this.errback = errback;

                //Indicate this module has be initialized
                this.inited = true;

                this.ignore = options.ignore;

                //Could have option to init this module in enabled mode,
                //or could have been previously marked as enabled. However,
                //the dependencies are not known until init is called. So
                //if enabled previously, now trigger dependencies as enabled.
                if (options.enabled || this.enabled) {
                    //Enable this module and dependencies.
                    //Will call this.check()
                    this.enable();
                } else {
                    this.check();
                }
            },

            defineDep: function (i, depExports) {
                //Because of cycles, defined callback for a given
                //export can be called more than once.
                if (!this.depMatched[i]) {
                    this.depMatched[i] = true;
                    this.depCount -= 1;
                    this.depExports[i] = depExports;
                }
            },

            fetch: function () {
                if (this.fetched) {
                    return;
                }
                this.fetched = true;

                context.startTime = (new Date()).getTime();

                var map = this.map;

                //If the manager is for a plugin managed resource,
                //ask the plugin to load it now.
                if (this.shim) {
                    context.makeRequire(this.map, {
                        enableBuildCallback: true
                    })(this.shim.deps || [], bind(this, function () {
                        return map.prefix ? this.callPlugin() : this.load();
                    }));
                } else {
                    //Regular dependency.
                    return map.prefix ? this.callPlugin() : this.load();
                }
            },

            load: function () {
                var url = this.map.url;

                //Regular dependency.
                if (!urlFetched[url]) {
                    urlFetched[url] = true;
                    context.load(this.map.id, url);
                }
            },

            /**
             * Checks if the module is ready to define itself, and if so,
             * define it.
             */
            check: function () {
                if (!this.enabled || this.enabling) {
                    return;
                }

                var err, cjsModule,
                    id = this.map.id,
                    depExports = this.depExports,
                    exports = this.exports,
                    factory = this.factory;

                if (!this.inited) {
                    this.fetch();
                } else if (this.error) {
                    this.emit('error', this.error);
                } else if (!this.defining) {
                    //The factory could trigger another require call
                    //that would result in checking this module to
                    //define itself again. If already in the process
                    //of doing that, skip this work.
                    this.defining = true;

                    if (this.depCount < 1 && !this.defined) {
                        if (isFunction(factory)) {
                            //If there is an error listener, favor passing
                            //to that instead of throwing an error. However,
                            //only do it for define()'d  modules. require
                            //errbacks should not be called for failures in
                            //their callbacks (#699). However if a global
                            //onError is set, use that.
                            if ((this.events.error && this.map.isDefine) ||
                                req.onError !== defaultOnError) {
                                try {
                                    exports = context.execCb(id, factory, depExports, exports);
                                } catch (e) {
                                    err = e;
                                }
                            } else {
                                exports = context.execCb(id, factory, depExports, exports);
                            }

                            // Favor return value over exports. If node/cjs in play,
                            // then will not have a return value anyway. Favor
                            // module.exports assignment over exports object.
                            if (this.map.isDefine && exports === undefined) {
                                cjsModule = this.module;
                                if (cjsModule) {
                                    exports = cjsModule.exports;
                                } else if (this.usingExports) {
                                    //exports already set the defined value.
                                    exports = this.exports;
                                }
                            }

                            if (err) {
                                err.requireMap = this.map;
                                err.requireModules = this.map.isDefine ? [this.map.id] : null;
                                err.requireType = this.map.isDefine ? 'define' : 'require';
                                return onError((this.error = err));
                            }

                        } else {
                            //Just a literal value
                            exports = factory;
                        }

                        this.exports = exports;

                        if (this.map.isDefine && !this.ignore) {
                            defined[id] = exports;

                            if (req.onResourceLoad) {
                                req.onResourceLoad(context, this.map, this.depMaps);
                            }
                        }

                        //Clean up
                        cleanRegistry(id);

                        this.defined = true;
                    }

                    //Finished the define stage. Allow calling check again
                    //to allow define notifications below in the case of a
                    //cycle.
                    this.defining = false;

                    if (this.defined && !this.defineEmitted) {
                        this.defineEmitted = true;
                        this.emit('defined', this.exports);
                        this.defineEmitComplete = true;
                    }

                }
            },

            callPlugin: function () {
                var map = this.map,
                    id = map.id,
                    //Map already normalized the prefix.
                    pluginMap = makeModuleMap(map.prefix);

                //Mark this as a dependency for this plugin, so it
                //can be traced for cycles.
                this.depMaps.push(pluginMap);

                on(pluginMap, 'defined', bind(this, function (plugin) {
                    var load, normalizedMap, normalizedMod,
                        bundleId = getOwn(bundlesMap, this.map.id),
                        name = this.map.name,
                        parentName = this.map.parentMap ? this.map.parentMap.name : null,
                        localRequire = context.makeRequire(map.parentMap, {
                            enableBuildCallback: true
                        });

                    //If current map is not normalized, wait for that
                    //normalized name to load instead of continuing.
                    if (this.map.unnormalized) {
                        //Normalize the ID if the plugin allows it.
                        if (plugin.normalize) {
                            name = plugin.normalize(name, function (name) {
                                return normalize(name, parentName, true);
                            }) || '';
                        }

                        //prefix and name should already be normalized, no need
                        //for applying map config again either.
                        normalizedMap = makeModuleMap(map.prefix + '!' + name,
                                                      this.map.parentMap);
                        on(normalizedMap,
                            'defined', bind(this, function (value) {
                                this.init([], function () { return value; }, null, {
                                    enabled: true,
                                    ignore: true
                                });
                            }));

                        normalizedMod = getOwn(registry, normalizedMap.id);
                        if (normalizedMod) {
                            //Mark this as a dependency for this plugin, so it
                            //can be traced for cycles.
                            this.depMaps.push(normalizedMap);

                            if (this.events.error) {
                                normalizedMod.on('error', bind(this, function (err) {
                                    this.emit('error', err);
                                }));
                            }
                            normalizedMod.enable();
                        }

                        return;
                    }

                    //If a paths config, then just load that file instead to
                    //resolve the plugin, as it is built into that paths layer.
                    if (bundleId) {
                        this.map.url = context.nameToUrl(bundleId);
                        this.load();
                        return;
                    }

                    load = bind(this, function (value) {
                        this.init([], function () { return value; }, null, {
                            enabled: true
                        });
                    });

                    load.error = bind(this, function (err) {
                        this.inited = true;
                        this.error = err;
                        err.requireModules = [id];

                        //Remove temp unnormalized modules for this module,
                        //since they will never be resolved otherwise now.
                        eachProp(registry, function (mod) {
                            if (mod.map.id.indexOf(id + '_unnormalized') === 0) {
                                cleanRegistry(mod.map.id);
                            }
                        });

                        onError(err);
                    });

                    //Allow plugins to load other code without having to know the
                    //context or how to 'complete' the load.
                    load.fromText = bind(this, function (text, textAlt) {
                        /*jslint evil: true */
                        var moduleName = map.name,
                            moduleMap = makeModuleMap(moduleName),
                            hasInteractive = useInteractive;

                        //As of 2.1.0, support just passing the text, to reinforce
                        //fromText only being called once per resource. Still
                        //support old style of passing moduleName but discard
                        //that moduleName in favor of the internal ref.
                        if (textAlt) {
                            text = textAlt;
                        }

                        //Turn off interactive script matching for IE for any define
                        //calls in the text, then turn it back on at the end.
                        if (hasInteractive) {
                            useInteractive = false;
                        }

                        //Prime the system by creating a module instance for
                        //it.
                        getModule(moduleMap);

                        //Transfer any config to this other module.
                        if (hasProp(config.config, id)) {
                            config.config[moduleName] = config.config[id];
                        }

                        try {
                            req.exec(text);
                        } catch (e) {
                            return onError(makeError('fromtexteval',
                                             'fromText eval for ' + id +
                                            ' failed: ' + e,
                                             e,
                                             [id]));
                        }

                        if (hasInteractive) {
                            useInteractive = true;
                        }

                        //Mark this as a dependency for the plugin
                        //resource
                        this.depMaps.push(moduleMap);

                        //Support anonymous modules.
                        context.completeLoad(moduleName);

                        //Bind the value of that module to the value for this
                        //resource ID.
                        localRequire([moduleName], load);
                    });

                    //Use parentName here since the plugin's name is not reliable,
                    //could be some weird string with no path that actually wants to
                    //reference the parentName's path.
                    plugin.load(map.name, localRequire, load, config);
                }));

                context.enable(pluginMap, this);
                this.pluginMaps[pluginMap.id] = pluginMap;
            },

            enable: function () {
                enabledRegistry[this.map.id] = this;
                this.enabled = true;

                //Set flag mentioning that the module is enabling,
                //so that immediate calls to the defined callbacks
                //for dependencies do not trigger inadvertent load
                //with the depCount still being zero.
                this.enabling = true;

                //Enable each dependency
                each(this.depMaps, bind(this, function (depMap, i) {
                    var id, mod, handler;

                    if (typeof depMap === 'string') {
                        //Dependency needs to be converted to a depMap
                        //and wired up to this module.
                        depMap = makeModuleMap(depMap,
                                               (this.map.isDefine ? this.map : this.map.parentMap),
                                               false,
                                               !this.skipMap);
                        this.depMaps[i] = depMap;

                        handler = getOwn(handlers, depMap.id);

                        if (handler) {
                            this.depExports[i] = handler(this);
                            return;
                        }

                        this.depCount += 1;

                        on(depMap, 'defined', bind(this, function (depExports) {
                            this.defineDep(i, depExports);
                            this.check();
                        }));

                        if (this.errback) {
                            on(depMap, 'error', bind(this, this.errback));
                        }
                    }

                    id = depMap.id;
                    mod = registry[id];

                    //Skip special modules like 'require', 'exports', 'module'
                    //Also, don't call enable if it is already enabled,
                    //important in circular dependency cases.
                    if (!hasProp(handlers, id) && mod && !mod.enabled) {
                        context.enable(depMap, this);
                    }
                }));

                //Enable each plugin that is used in
                //a dependency
                eachProp(this.pluginMaps, bind(this, function (pluginMap) {
                    var mod = getOwn(registry, pluginMap.id);
                    if (mod && !mod.enabled) {
                        context.enable(pluginMap, this);
                    }
                }));

                this.enabling = false;

                this.check();
            },

            on: function (name, cb) {
                var cbs = this.events[name];
                if (!cbs) {
                    cbs = this.events[name] = [];
                }
                cbs.push(cb);
            },

            emit: function (name, evt) {
                each(this.events[name], function (cb) {
                    cb(evt);
                });
                if (name === 'error') {
                    //Now that the error handler was triggered, remove
                    //the listeners, since this broken Module instance
                    //can stay around for a while in the registry.
                    delete this.events[name];
                }
            }
        };

        function callGetModule(args) {
            //Skip modules already defined.
            if (!hasProp(defined, args[0])) {
                getModule(makeModuleMap(args[0], null, true)).init(args[1], args[2]);
            }
        }

        function removeListener(node, func, name, ieName) {
            //Favor detachEvent because of IE9
            //issue, see attachEvent/addEventListener comment elsewhere
            //in this file.
            if (node.detachEvent && !isOpera) {
                //Probably IE. If not it will throw an error, which will be
                //useful to know.
                if (ieName) {
                    node.detachEvent(ieName, func);
                }
            } else {
                node.removeEventListener(name, func, false);
            }
        }

        /**
         * Given an event from a script node, get the requirejs info from it,
         * and then removes the event listeners on the node.
         * @param {Event} evt
         * @returns {Object}
         */
        function getScriptData(evt) {
            //Using currentTarget instead of target for Firefox 2.0's sake. Not
            //all old browsers will be supported, but this one was easy enough
            //to support and still makes sense.
            var node = evt.currentTarget || evt.srcElement;

            //Remove the listeners once here.
            removeListener(node, context.onScriptLoad, 'load', 'onreadystatechange');
            removeListener(node, context.onScriptError, 'error');

            return {
                node: node,
                id: node && node.getAttribute('data-requiremodule')
            };
        }

        function intakeDefines() {
            var args;

            //Any defined modules in the global queue, intake them now.
            takeGlobalQueue();

            //Make sure any remaining defQueue items get properly processed.
            while (defQueue.length) {
                args = defQueue.shift();
                if (args[0] === null) {
                    return onError(makeError('mismatch', 'Mismatched anonymous define() module: ' + args[args.length - 1]));
                } else {
                    //args are id, deps, factory. Should be normalized by the
                    //define() function.
                    callGetModule(args);
                }
            }
        }

        context = {
            config: config,
            contextName: contextName,
            registry: registry,
            defined: defined,
            urlFetched: urlFetched,
            defQueue: defQueue,
            Module: Module,
            makeModuleMap: makeModuleMap,
            nextTick: req.nextTick,
            onError: onError,

            /**
             * Set a configuration for the context.
             * @param {Object} cfg config object to integrate.
             */
            configure: function (cfg) {
                //Make sure the baseUrl ends in a slash.
                if (cfg.baseUrl) {
                    if (cfg.baseUrl.charAt(cfg.baseUrl.length - 1) !== '/') {
                        cfg.baseUrl += '/';
                    }
                }

                //Save off the paths since they require special processing,
                //they are additive.
                var shim = config.shim,
                    objs = {
                        paths: true,
                        bundles: true,
                        config: true,
                        map: true
                    };

                eachProp(cfg, function (value, prop) {
                    if (objs[prop]) {
                        if (!config[prop]) {
                            config[prop] = {};
                        }
                        mixin(config[prop], value, true, true);
                    } else {
                        config[prop] = value;
                    }
                });

                //Reverse map the bundles
                if (cfg.bundles) {
                    eachProp(cfg.bundles, function (value, prop) {
                        each(value, function (v) {
                            if (v !== prop) {
                                bundlesMap[v] = prop;
                            }
                        });
                    });
                }

                //Merge shim
                if (cfg.shim) {
                    eachProp(cfg.shim, function (value, id) {
                        //Normalize the structure
                        if (isArray(value)) {
                            value = {
                                deps: value
                            };
                        }
                        if ((value.exports || value.init) && !value.exportsFn) {
                            value.exportsFn = context.makeShimExports(value);
                        }
                        shim[id] = value;
                    });
                    config.shim = shim;
                }

                //Adjust packages if necessary.
                if (cfg.packages) {
                    each(cfg.packages, function (pkgObj) {
                        var location, name;

                        pkgObj = typeof pkgObj === 'string' ? { name: pkgObj } : pkgObj;

                        name = pkgObj.name;
                        location = pkgObj.location;
                        if (location) {
                            config.paths[name] = pkgObj.location;
                        }

                        //Save pointer to main module ID for pkg name.
                        //Remove leading dot in main, so main paths are normalized,
                        //and remove any trailing .js, since different package
                        //envs have different conventions: some use a module name,
                        //some use a file name.
                        config.pkgs[name] = pkgObj.name + '/' + (pkgObj.main || 'main')
                                     .replace(currDirRegExp, '')
                                     .replace(jsSuffixRegExp, '');
                    });
                }

                //If there are any "waiting to execute" modules in the registry,
                //update the maps for them, since their info, like URLs to load,
                //may have changed.
                eachProp(registry, function (mod, id) {
                    //If module already has init called, since it is too
                    //late to modify them, and ignore unnormalized ones
                    //since they are transient.
                    if (!mod.inited && !mod.map.unnormalized) {
                        mod.map = makeModuleMap(id);
                    }
                });

                //If a deps array or a config callback is specified, then call
                //require with those args. This is useful when require is defined as a
                //config object before require.js is loaded.
                if (cfg.deps || cfg.callback) {
                    context.require(cfg.deps || [], cfg.callback);
                }
            },

            makeShimExports: function (value) {
                function fn() {
                    var ret;
                    if (value.init) {
                        ret = value.init.apply(global, arguments);
                    }
                    return ret || (value.exports && getGlobal(value.exports));
                }
                return fn;
            },

            makeRequire: function (relMap, options) {
                options = options || {};

                function localRequire(deps, callback, errback) {
                    var id, map, requireMod;

                    if (options.enableBuildCallback && callback && isFunction(callback)) {
                        callback.__requireJsBuild = true;
                    }

                    if (typeof deps === 'string') {
                        if (isFunction(callback)) {
                            //Invalid call
                            return onError(makeError('requireargs', 'Invalid require call'), errback);
                        }

                        //If require|exports|module are requested, get the
                        //value for them from the special handlers. Caveat:
                        //this only works while module is being defined.
                        if (relMap && hasProp(handlers, deps)) {
                            return handlers[deps](registry[relMap.id]);
                        }

                        //Synchronous access to one module. If require.get is
                        //available (as in the Node adapter), prefer that.
                        if (req.get) {
                            return req.get(context, deps, relMap, localRequire);
                        }

                        //Normalize module name, if it contains . or ..
                        map = makeModuleMap(deps, relMap, false, true);
                        id = map.id;

                        if (!hasProp(defined, id)) {
                            return onError(makeError('notloaded', 'Module name "' +
                                        id +
                                        '" has not been loaded yet for context: ' +
                                        contextName +
                                        (relMap ? '' : '. Use require([])')));
                        }
                        return defined[id];
                    }

                    //Grab defines waiting in the global queue.
                    intakeDefines();

                    //Mark all the dependencies as needing to be loaded.
                    context.nextTick(function () {
                        //Some defines could have been added since the
                        //require call, collect them.
                        intakeDefines();

                        requireMod = getModule(makeModuleMap(null, relMap));

                        //Store if map config should be applied to this require
                        //call for dependencies.
                        requireMod.skipMap = options.skipMap;

                        requireMod.init(deps, callback, errback, {
                            enabled: true
                        });

                        checkLoaded();
                    });

                    return localRequire;
                }

                mixin(localRequire, {
                    isBrowser: isBrowser,

                    /**
                     * Converts a module name + .extension into an URL path.
                     * *Requires* the use of a module name. It does not support using
                     * plain URLs like nameToUrl.
                     */
                    toUrl: function (moduleNamePlusExt) {
                        var ext,
                            index = moduleNamePlusExt.lastIndexOf('.'),
                            segment = moduleNamePlusExt.split('/')[0],
                            isRelative = segment === '.' || segment === '..';

                        //Have a file extension alias, and it is not the
                        //dots from a relative path.
                        if (index !== -1 && (!isRelative || index > 1)) {
                            ext = moduleNamePlusExt.substring(index, moduleNamePlusExt.length);
                            moduleNamePlusExt = moduleNamePlusExt.substring(0, index);
                        }

                        return context.nameToUrl(normalize(moduleNamePlusExt,
                                                relMap && relMap.id, true), ext,  true);
                    },

                    defined: function (id) {
                        return hasProp(defined, makeModuleMap(id, relMap, false, true).id);
                    },

                    specified: function (id) {
                        id = makeModuleMap(id, relMap, false, true).id;
                        return hasProp(defined, id) || hasProp(registry, id);
                    }
                });

                //Only allow undef on top level require calls
                if (!relMap) {
                    localRequire.undef = function (id) {
                        //Bind any waiting define() calls to this context,
                        //fix for #408
                        takeGlobalQueue();

                        var map = makeModuleMap(id, relMap, true),
                            mod = getOwn(registry, id);

                        removeScript(id);

                        delete defined[id];
                        delete urlFetched[map.url];
                        delete undefEvents[id];

                        //Clean queued defines too. Go backwards
                        //in array so that the splices do not
                        //mess up the iteration.
                        eachReverse(defQueue, function(args, i) {
                            if(args[0] === id) {
                                defQueue.splice(i, 1);
                            }
                        });

                        if (mod) {
                            //Hold on to listeners in case the
                            //module will be attempted to be reloaded
                            //using a different config.
                            if (mod.events.defined) {
                                undefEvents[id] = mod.events;
                            }

                            cleanRegistry(id);
                        }
                    };
                }

                return localRequire;
            },

            /**
             * Called to enable a module if it is still in the registry
             * awaiting enablement. A second arg, parent, the parent module,
             * is passed in for context, when this method is overridden by
             * the optimizer. Not shown here to keep code compact.
             */
            enable: function (depMap) {
                var mod = getOwn(registry, depMap.id);
                if (mod) {
                    getModule(depMap).enable();
                }
            },

            /**
             * Internal method used by environment adapters to complete a load event.
             * A load event could be a script load or just a load pass from a synchronous
             * load call.
             * @param {String} moduleName the name of the module to potentially complete.
             */
            completeLoad: function (moduleName) {
                var found, args, mod,
                    shim = getOwn(config.shim, moduleName) || {},
                    shExports = shim.exports;

                takeGlobalQueue();

                while (defQueue.length) {
                    args = defQueue.shift();
                    if (args[0] === null) {
                        args[0] = moduleName;
                        //If already found an anonymous module and bound it
                        //to this name, then this is some other anon module
                        //waiting for its completeLoad to fire.
                        if (found) {
                            break;
                        }
                        found = true;
                    } else if (args[0] === moduleName) {
                        //Found matching define call for this script!
                        found = true;
                    }

                    callGetModule(args);
                }

                //Do this after the cycle of callGetModule in case the result
                //of those calls/init calls changes the registry.
                mod = getOwn(registry, moduleName);

                if (!found && !hasProp(defined, moduleName) && mod && !mod.inited) {
                    if (config.enforceDefine && (!shExports || !getGlobal(shExports))) {
                        if (hasPathFallback(moduleName)) {
                            return;
                        } else {
                            return onError(makeError('nodefine',
                                             'No define call for ' + moduleName,
                                             null,
                                             [moduleName]));
                        }
                    } else {
                        //A script that does not call define(), so just simulate
                        //the call for it.
                        callGetModule([moduleName, (shim.deps || []), shim.exportsFn]);
                    }
                }

                checkLoaded();
            },

            /**
             * Converts a module name to a file path. Supports cases where
             * moduleName may actually be just an URL.
             * Note that it **does not** call normalize on the moduleName,
             * it is assumed to have already been normalized. This is an
             * internal API, not a public one. Use toUrl for the public API.
             */
            nameToUrl: function (moduleName, ext, skipExt) {
                var paths, syms, i, parentModule, url,
                    parentPath, bundleId,
                    pkgMain = getOwn(config.pkgs, moduleName);

                if (pkgMain) {
                    moduleName = pkgMain;
                }

                bundleId = getOwn(bundlesMap, moduleName);

                if (bundleId) {
                    return context.nameToUrl(bundleId, ext, skipExt);
                }

                //If a colon is in the URL, it indicates a protocol is used and it is just
                //an URL to a file, or if it starts with a slash, contains a query arg (i.e. ?)
                //or ends with .js, then assume the user meant to use an url and not a module id.
                //The slash is important for protocol-less URLs as well as full paths.
                if (req.jsExtRegExp.test(moduleName)) {
                    //Just a plain path, not module name lookup, so just return it.
                    //Add extension if it is included. This is a bit wonky, only non-.js things pass
                    //an extension, this method probably needs to be reworked.
                    url = moduleName + (ext || '');
                } else {
                    //A module that needs to be converted to a path.
                    paths = config.paths;

                    syms = moduleName.split('/');
                    //For each module name segment, see if there is a path
                    //registered for it. Start with most specific name
                    //and work up from it.
                    for (i = syms.length; i > 0; i -= 1) {
                        parentModule = syms.slice(0, i).join('/');

                        parentPath = getOwn(paths, parentModule);
                        if (parentPath) {
                            //If an array, it means there are a few choices,
                            //Choose the one that is desired
                            if (isArray(parentPath)) {
                                parentPath = parentPath[0];
                            }
                            syms.splice(0, i, parentPath);
                            break;
                        }
                    }

                    //Join the path parts together, then figure out if baseUrl is needed.
                    url = syms.join('/');
                    url += (ext || (/^data\:|\?/.test(url) || skipExt ? '' : '.js'));
                    url = (url.charAt(0) === '/' || url.match(/^[\w\+\.\-]+:/) ? '' : config.baseUrl) + url;
                }

                return config.urlArgs ? url +
                                        ((url.indexOf('?') === -1 ? '?' : '&') +
                                         config.urlArgs) : url;
            },

            //Delegates to req.load. Broken out as a separate function to
            //allow overriding in the optimizer.
            load: function (id, url) {
                req.load(context, id, url);
            },

            /**
             * Executes a module callback function. Broken out as a separate function
             * solely to allow the build system to sequence the files in the built
             * layer in the right sequence.
             *
             * @private
             */
            execCb: function (name, callback, args, exports) {
                return callback.apply(exports, args);
            },

            /**
             * callback for script loads, used to check status of loading.
             *
             * @param {Event} evt the event from the browser for the script
             * that was loaded.
             */
            onScriptLoad: function (evt) {
                //Using currentTarget instead of target for Firefox 2.0's sake. Not
                //all old browsers will be supported, but this one was easy enough
                //to support and still makes sense.
                if (evt.type === 'load' ||
                        (readyRegExp.test((evt.currentTarget || evt.srcElement).readyState))) {
                    //Reset interactive script so a script node is not held onto for
                    //to long.
                    interactiveScript = null;

                    //Pull out the name of the module and the context.
                    var data = getScriptData(evt);
                    context.completeLoad(data.id);
                }
            },

            /**
             * Callback for script errors.
             */
            onScriptError: function (evt) {
                var data = getScriptData(evt);
                if (!hasPathFallback(data.id)) {
                    return onError(makeError('scripterror', 'Script error for: ' + data.id, evt, [data.id]));
                }
            }
        };

        context.require = context.makeRequire();
        return context;
    }

    /**
     * Main entry point.
     *
     * If the only argument to require is a string, then the module that
     * is represented by that string is fetched for the appropriate context.
     *
     * If the first argument is an array, then it will be treated as an array
     * of dependency string names to fetch. An optional function callback can
     * be specified to execute when all of those dependencies are available.
     *
     * Make a local req variable to help Caja compliance (it assumes things
     * on a require that are not standardized), and to give a short
     * name for minification/local scope use.
     */
    req = requirejs = function (deps, callback, errback, optional) {

        //Find the right context, use default
        var context, config,
            contextName = defContextName;

        // Determine if have config object in the call.
        if (!isArray(deps) && typeof deps !== 'string') {
            // deps is a config object
            config = deps;
            if (isArray(callback)) {
                // Adjust args if there are dependencies
                deps = callback;
                callback = errback;
                errback = optional;
            } else {
                deps = [];
            }
        }

        if (config && config.context) {
            contextName = config.context;
        }

        context = getOwn(contexts, contextName);
        if (!context) {
            context = contexts[contextName] = req.s.newContext(contextName);
        }

        if (config) {
            context.configure(config);
        }

        return context.require(deps, callback, errback);
    };

    /**
     * Support require.config() to make it easier to cooperate with other
     * AMD loaders on globally agreed names.
     */
    req.config = function (config) {
        return req(config);
    };

    /**
     * Execute something after the current tick
     * of the event loop. Override for other envs
     * that have a better solution than setTimeout.
     * @param  {Function} fn function to execute later.
     */
    req.nextTick = typeof setTimeout !== 'undefined' ? function (fn) {
        setTimeout(fn, 4);
    } : function (fn) { fn(); };

    /**
     * Export require as a global, but only if it does not already exist.
     */
    if (!require) {
        require = req;
    }

    req.version = version;

    //Used to filter out dependencies that are already paths.
    req.jsExtRegExp = /^\/|:|\?|\.js$/;
    req.isBrowser = isBrowser;
    s = req.s = {
        contexts: contexts,
        newContext: newContext
    };

    //Create default context.
    req({});

    //Exports some context-sensitive methods on global require.
    each([
        'toUrl',
        'undef',
        'defined',
        'specified'
    ], function (prop) {
        //Reference from contexts instead of early binding to default context,
        //so that during builds, the latest instance of the default context
        //with its config gets used.
        req[prop] = function () {
            var ctx = contexts[defContextName];
            return ctx.require[prop].apply(ctx, arguments);
        };
    });

    if (isBrowser) {
        head = s.head = document.getElementsByTagName('head')[0];
        //If BASE tag is in play, using appendChild is a problem for IE6.
        //When that browser dies, this can be removed. Details in this jQuery bug:
        //http://dev.jquery.com/ticket/2709
        baseElement = document.getElementsByTagName('base')[0];
        if (baseElement) {
            head = s.head = baseElement.parentNode;
        }
    }

    /**
     * Any errors that require explicitly generates will be passed to this
     * function. Intercept/override it if you want custom error handling.
     * @param {Error} err the error object.
     */
    req.onError = defaultOnError;

    /**
     * Creates the node for the load command. Only used in browser envs.
     */
    req.createNode = function (config, moduleName, url) {
        var node = config.xhtml ?
                document.createElementNS('http://www.w3.org/1999/xhtml', 'html:script') :
                document.createElement('script');
        node.type = config.scriptType || 'text/javascript';
        node.charset = 'utf-8';
        node.async = true;
        return node;
    };

    /**
     * Does the request to load a module for the browser case.
     * Make this a separate function to allow other environments
     * to override it.
     *
     * @param {Object} context the require context to find state.
     * @param {String} moduleName the name of the module.
     * @param {Object} url the URL to the module.
     */
    req.load = function (context, moduleName, url) {
        var config = (context && context.config) || {},
            node;
        if (isBrowser) {
            //In the browser so use a script tag
            node = req.createNode(config, moduleName, url);

            node.setAttribute('data-requirecontext', context.contextName);
            node.setAttribute('data-requiremodule', moduleName);

            //Set up load listener. Test attachEvent first because IE9 has
            //a subtle issue in its addEventListener and script onload firings
            //that do not match the behavior of all other browsers with
            //addEventListener support, which fire the onload event for a
            //script right after the script execution. See:
            //https://connect.microsoft.com/IE/feedback/details/648057/script-onload-event-is-not-fired-immediately-after-script-execution
            //UNFORTUNATELY Opera implements attachEvent but does not follow the script
            //script execution mode.
            if (node.attachEvent &&
                    //Check if node.attachEvent is artificially added by custom script or
                    //natively supported by browser
                    //read https://github.com/jrburke/requirejs/issues/187
                    //if we can NOT find [native code] then it must NOT natively supported.
                    //in IE8, node.attachEvent does not have toString()
                    //Note the test for "[native code" with no closing brace, see:
                    //https://github.com/jrburke/requirejs/issues/273
                    !(node.attachEvent.toString && node.attachEvent.toString().indexOf('[native code') < 0) &&
                    !isOpera) {
                //Probably IE. IE (at least 6-8) do not fire
                //script onload right after executing the script, so
                //we cannot tie the anonymous define call to a name.
                //However, IE reports the script as being in 'interactive'
                //readyState at the time of the define call.
                useInteractive = true;

                node.attachEvent('onreadystatechange', context.onScriptLoad);
                //It would be great to add an error handler here to catch
                //404s in IE9+. However, onreadystatechange will fire before
                //the error handler, so that does not help. If addEventListener
                //is used, then IE will fire error before load, but we cannot
                //use that pathway given the connect.microsoft.com issue
                //mentioned above about not doing the 'script execute,
                //then fire the script load event listener before execute
                //next script' that other browsers do.
                //Best hope: IE10 fixes the issues,
                //and then destroys all installs of IE 6-9.
                //node.attachEvent('onerror', context.onScriptError);
            } else {
                node.addEventListener('load', context.onScriptLoad, false);
                node.addEventListener('error', context.onScriptError, false);
            }
            node.src = url;

            //For some cache cases in IE 6-8, the script executes before the end
            //of the appendChild execution, so to tie an anonymous define
            //call to the module name (which is stored on the node), hold on
            //to a reference to this node, but clear after the DOM insertion.
            currentlyAddingScript = node;
            if (baseElement) {
                head.insertBefore(node, baseElement);
            } else {
                head.appendChild(node);
            }
            currentlyAddingScript = null;

            return node;
        } else if (isWebWorker) {
            try {
                //In a web worker, use importScripts. This is not a very
                //efficient use of importScripts, importScripts will block until
                //its script is downloaded and evaluated. However, if web workers
                //are in play, the expectation that a build has been done so that
                //only one script needs to be loaded anyway. This may need to be
                //reevaluated if other use cases become common.
                importScripts(url);

                //Account for anonymous modules
                context.completeLoad(moduleName);
            } catch (e) {
                context.onError(makeError('importscripts',
                                'importScripts failed for ' +
                                    moduleName + ' at ' + url,
                                e,
                                [moduleName]));
            }
        }
    };

    function getInteractiveScript() {
        if (interactiveScript && interactiveScript.readyState === 'interactive') {
            return interactiveScript;
        }

        eachReverse(scripts(), function (script) {
            if (script.readyState === 'interactive') {
                return (interactiveScript = script);
            }
        });
        return interactiveScript;
    }

    //Look for a data-main script attribute, which could also adjust the baseUrl.
    if (isBrowser && !cfg.skipDataMain) {
        //Figure out baseUrl. Get it from the script tag with require.js in it.
        eachReverse(scripts(), function (script) {
            //Set the 'head' where we can append children by
            //using the script's parent.
            if (!head) {
                head = script.parentNode;
            }

            //Look for a data-main attribute to set main script for the page
            //to load. If it is there, the path to data main becomes the
            //baseUrl, if it is not already set.
            dataMain = script.getAttribute('data-main');
            if (dataMain) {
                //Preserve dataMain in case it is a path (i.e. contains '?')
                mainScript = dataMain;

                //Set final baseUrl if there is not already an explicit one.
                if (!cfg.baseUrl) {
                    //Pull off the directory of data-main for use as the
                    //baseUrl.
                    src = mainScript.split('/');
                    mainScript = src.pop();
                    subPath = src.length ? src.join('/')  + '/' : './';

                    cfg.baseUrl = subPath;
                }

                //Strip off any trailing .js since mainScript is now
                //like a module name.
                mainScript = mainScript.replace(jsSuffixRegExp, '');

                 //If mainScript is still a path, fall back to dataMain
                if (req.jsExtRegExp.test(mainScript)) {
                    mainScript = dataMain;
                }

                //Put the data-main script in the files to load.
                cfg.deps = cfg.deps ? cfg.deps.concat(mainScript) : [mainScript];

                return true;
            }
        });
    }

    /**
     * The function that handles definitions of modules. Differs from
     * require() in that a string for the module should be the first argument,
     * and the function to execute after dependencies are loaded should
     * return a value to define the module corresponding to the first argument's
     * name.
     */
    define = function (name, deps, callback) {
        var node, context;

        //Allow for anonymous modules
        if (typeof name !== 'string') {
            //Adjust args appropriately
            callback = deps;
            deps = name;
            name = null;
        }

        //This module may not have dependencies
        if (!isArray(deps)) {
            callback = deps;
            deps = null;
        }

        //If no name, and callback is a function, then figure out if it a
        //CommonJS thing with dependencies.
        if (!deps && isFunction(callback)) {
            deps = [];
            //Remove comments from the callback string,
            //look for require calls, and pull them into the dependencies,
            //but only if there are function args.
            if (callback.length) {
                callback
                    .toString()
                    .replace(commentRegExp, '')
                    .replace(cjsRequireRegExp, function (match, dep) {
                        deps.push(dep);
                    });

                //May be a CommonJS thing even without require calls, but still
                //could use exports, and module. Avoid doing exports and module
                //work though if it just needs require.
                //REQUIRES the function to expect the CommonJS variables in the
                //order listed below.
                deps = (callback.length === 1 ? ['require'] : ['require', 'exports', 'module']).concat(deps);
            }
        }

        //If in IE 6-8 and hit an anonymous define() call, do the interactive
        //work.
        if (useInteractive) {
            node = currentlyAddingScript || getInteractiveScript();
            if (node) {
                if (!name) {
                    name = node.getAttribute('data-requiremodule');
                }
                context = contexts[node.getAttribute('data-requirecontext')];
            }
        }

        //Always save off evaluating the def call until the script onload handler.
        //This allows multiple modules to be in a file without prematurely
        //tracing dependencies, and allows for anonymous module support,
        //where the module name is not known until the script onload event
        //occurs. If no context, use the global queue, and get it processed
        //in the onscript load callback.
        (context ? context.defQueue : globalDefQueue).push([name, deps, callback]);
    };

    define.amd = {
        jQuery: true
    };


    /**
     * Executes the text. Normally just uses eval, but can be modified
     * to use a better, environment-specific call. Only used for transpiling
     * loader plugins, not for plain JS modules.
     * @param {String} text the text to execute/evaluate.
     */
    req.exec = function (text) {
        /*jslint evil: true */
        return eval(text);
    };

    //Set up with config info.
    req(cfg);
}(this));

define("gesture_engine/gestures/TranslateGesture", [], function() {
    var rightHand, leftHand;
    function computeAngle(a, b) {
        var cos = Math.acos(Leap.vec3.dot(a, b) / (Leap.vec3.len(a) * Leap.vec3.len(b))), angle = cos / Math.PI * 180;
        return angle;
    }
    function TranslateGesture() {}
    return TranslateGesture.prototype.validate = function(controller, frame) {
        if (!controller) return !1;
        var hands = frame.hands;
        if (frame.hands.length && frame.hands.length == 2) {
            frame.hands[0].type == "right" ? (rightHand = frame.hands[0], leftHand = frame.hands[1]) : (rightHand = frame.hands[1], leftHand = frame.hands[0]);
            if (leftHand.palmPosition[2] > rightHand.palmPosition[2]) return !1;
            var palmNormal = leftHand.palmNormal, angle = computeAngle(palmNormal, [ 0, -1, 0 ]);
            return Math.abs(angle - 90) > 30 ? !1 : rightHand.grabStrength != 0 ? !1 : !0;
        }
        return !1;
    }, TranslateGesture;
});

var toArray = function(arguments) {
    return Array.prototype.slice.call(arguments);
}, isFunction = function(fn) {
    return Object.prototype.toString.call(fn) == "[object Function]" ? !0 : !1;
}, isArray = function(array) {
    return Object.prototype.toString.call(array) == "[object Array]" ? !0 : !1;
}, isString = function(str) {
    return Object.prototype.toString.call(str) == "[object String]" ? !0 : !1;
};

define("gesture_engine/engine", [ "./gestures/TranslateGesture" ], function(TranslateGesture) {
    var nativeGestureTypes = [ "circle", "keyTap", "screenTap", "swipe" ], gestures = function GestureValidate(gestures) {
        var result = {}, matchName = /(\w+)Gesture/;
        return toArray(gestures).forEach(function(Gesture) {
            var originName = Gesture.name.match(matchName), gestureName = originName[1].toLowerCase();
            result[gestureName] = new Gesture;
        }), nativeGestureTypes.forEach(function(gestureType) {
            result[gestureType] = new Function;
        }), result;
    }(arguments);
    function GestureRecognitionEngine(controller) {
        this.controller = controller, this._registeredEventList = {}, this._gestures = gestures, this._gestureCount, this._registerEvent();
    }
    return GestureRecognitionEngine.prototype = {
        constructor: GestureRecognitionEngine,
        _registerEvent: function() {
            var gestures = this._gestures, eventList = this._registeredEventList;
            for (var gestureType in gestures) eventList[gestureType] = [];
            this._gestureCount = eventList.length;
        },
        _checkGesture: function(frame) {
            var gestures = this._gestures, gesture, _this = this;
            for (var gestureType in gestures) {
                if (nativeGestureTypes.indexOf(gestureType) > -1) return;
                gesture = gestures[gestureType];
                var valdiateResult = gesture.validate(_this.controller, frame);
                valdiateResult && _this._dispatch(gestureType, frame);
            }
        },
        _dispatch: function(gestureType, frame) {
            var eventList = this._registeredEventList, controller = this.controller;
            if (!eventList[gestureType] || !eventList[gestureType].length) return;
            eventList[gestureType].forEach(function(callback) {
                callback(controller, frame);
            });
        },
        on: function(evt, callback) {
            var eventList = this._registeredEventList;
            if (!eventList[evt]) return;
            eventList[evt].push(callback.bind(this));
        },
        gestureHappened: function(gestureInfo, frame) {
            this._dispatch(gestureInfo.type, frame);
        },
        frameHappened: function(frame) {
            this._checkGesture(frame);
        }
    }, GestureRecognitionEngine;
}), define("apis/image", [], function() {
    document.addEventListener("DOMContentLoaded", function() {
        console.log("DOMContentLoaded！");
    });
    var hasInit = !1;
    if (!hasInit && $ && $("#srcPic") && $(".img-next") && $(".img-prev")) {
        document.body.style.perspective = "1000px";
        var imgTarget = $("#srcPic img").length ? $("#srcPic img")[0] : $("#srcPic img");
        imgTarget.style.transformStyle = "preserve-3d", imgTarget.style.transition = "all .1s", console.log("API INIT CONPLETE"), hasInit = !0;
    }
    var emptyFn = function() {
        console.log("NO API");
    }, emptyElement = {
        isFake: !0,
        style: {},
        click: emptyFn
    }, nextBtn = $(".img-next") || emptyElement, prevBtn = $(".img-prev") || emptyElement, slideNextBtn = $(".slider-btn-next") || emptyElement, slidePrevBtn = $(".slider-btn-prev") || emptyElement, zoomInBtn = $("#btnZoomIn") || emptyElement, zoomOutBtn = $("#btnZoomOut") || emptyElement, pullHandler = $(".album-handler") || emptyElement, img = $("#srcPic img") || emptyElement, ad = $("#sider") || emptyElement, header = $("#header") || emptyElement, dock = $(".album-pnl") || emptyElement, rotateX = 0, rotateY = 0, rotateZ = 0, translateX = 0, translateY = 0, translateZ = 0, TRANS_TIMES = 2;
    function generateTransform() {
        return [ "translateX(" + translateX * TRANS_TIMES + "px)", "translateY(" + translateY * TRANS_TIMES + "px)", "translateZ(" + translateZ * TRANS_TIMES + "px)", "rotateX(" + rotateX + "deg)", "rotateY(" + rotateY + "deg)", "rotateZ(" + rotateZ + "deg)" ].join(" ");
    }
    function reset(target) {
        rotateX = 0, rotateY = 0, rotateZ = 0, translateX = 0, translateY = 0, translateZ = 0, target.style.transition = "all .1s", target.style.transform = generateTransform();
    }
    return {
        threed: {
            translate: function(deltaX, deltaY, deltaZ) {
                translateX += deltaX, translateY -= deltaY, translateZ += deltaZ;
                var target = img.length ? img[0] : img;
                target.style.transform = generateTransform();
            },
            rotate: function() {}
        },
        init: function() {
            var body = document.body;
            body.style.perspective = "1000px", img.style.transformStyle = "preserve-3d";
        },
        nextImage: function() {
            nextBtn.click(), reset(img.length ? img[0] : img);
        },
        prevImage: function() {
            prevBtn.click(), reset(img.length ? img[0] : img);
        },
        pullUpDock: function() {
            pullHandler.click();
        },
        pullDownDock: function() {
            pullHandler.click();
        },
        slideToNext: function() {
            slideNextBtn.click();
        },
        slideToPrev: function() {
            slidePrevBtn.click();
        },
        zoomIn: function() {
            zoomInBtn.click();
        },
        zoomOut: function() {
            zoomOutBtn.click();
        }
    };
}), window.dhtmlx || (window.dhtmlx = {}), function() {
    var _dhx_msg_cfg = null;
    function callback(config, result) {
        var usercall = config.callback;
        modality(!1), config.box.parentNode.removeChild(config.box), _dhx_msg_cfg = config.box = null, usercall && usercall(result);
    }
    function modal_key(e) {
        if (_dhx_msg_cfg) {
            e = e || event;
            var code = e.which || event.keyCode;
            return dhtmlx.message.keyboard && ((code == 13 || code == 32) && callback(_dhx_msg_cfg, !0), code == 27 && callback(_dhx_msg_cfg, !1)), e.preventDefault && e.preventDefault(), !(e.cancelBubble = !0);
        }
    }
    document.attachEvent ? document.attachEvent("onkeydown", modal_key) : document.addEventListener("keydown", modal_key, !0);
    function modality(mode) {
        modality.cover || (modality.cover = document.createElement("DIV"), modality.cover.onkeydown = modal_key, modality.cover.className = "dhx_modal_cover", document.body.appendChild(modality.cover));
        var height = document.body.scrollHeight;
        modality.cover.style.display = mode ? "inline-block" : "none";
    }
    function button(text, result) {
        return "<div class='dhtmlx_popup_button' result='" + result + "' ><div>" + text + "</div></div>";
    }
    function info(text) {
        t.area || (t.area = document.createElement("DIV"), t.area.className = "dhtmlx_message_area", t.area.style[t.position] = "5px", document.body.appendChild(t.area)), t.hide(text.id);
        var message = document.createElement("DIV");
        return message.innerHTML = "<div>" + text.text + "</div>", message.className = "dhtmlx-info dhtmlx-" + text.type, message.onclick = function() {
            t.hide(text.id), text = null;
        }, t.position == "bottom" && t.area.firstChild ? t.area.insertBefore(message, t.area.firstChild) : t.area.appendChild(message), text.expire > 0 && (t.timers[text.id] = window.setTimeout(function() {
            t.hide(text.id);
        }, text.expire)), t.pull[text.id] = message, message = null, text.id;
    }
    function _boxStructure(config, ok, cancel) {
        var box = document.createElement("DIV");
        box.className = " dhtmlx_modal_box dhtmlx-" + config.type, box.setAttribute("dhxbox", 1);
        var inner = "";
        config.width && (box.style.width = config.width), config.height && (box.style.height = config.height), config.title && (inner += '<div class="dhtmlx_popup_title">' + config.title + "</div>"), inner += '<div class="dhtmlx_popup_text"><span>' + (config.content ? "" : config.text) + '</span></div><div  class="dhtmlx_popup_controls">', ok && (inner += button(config.ok || "OK", !0)), cancel && (inner += button(config.cancel || "Cancel", !1));
        if (config.buttons) for (var i = 0; i < config.buttons.length; i++) inner += button(config.buttons[i], i);
        inner += "</div>", box.innerHTML = inner;
        if (config.content) {
            var node = config.content;
            typeof node == "string" && (node = document.getElementById(node)), node.style.display == "none" && (node.style.display = ""), box.childNodes[config.title ? 1 : 0].appendChild(node);
        }
        box.onclick = function(e) {
            e = e || event;
            var source = e.target || e.srcElement;
            source.className || (source = source.parentNode);
            if (source.className == "dhtmlx_popup_button") {
                var result = source.getAttribute("result");
                result = result == "true" || (result == "false" ? !1 : result), callback(config, result);
            }
        }, config.box = box;
        if (ok || cancel) _dhx_msg_cfg = config;
        return box;
    }
    function _createBox(config, ok, cancel) {
        var box = config.tagName ? config : _boxStructure(config, ok, cancel);
        config.hidden || modality(!0), document.body.appendChild(box);
        var x = config.left || Math.abs(Math.floor(((window.innerWidth || document.documentElement.offsetWidth) - box.offsetWidth) / 2)), y = config.top || Math.abs(Math.floor(((window.innerHeight || document.documentElement.offsetHeight) - box.offsetHeight) / 2));
        return config.position == "top" ? box.style.top = "-3px" : box.style.top = y + "px", box.style.left = x + "px", box.onkeydown = modal_key, box.focus(), config.hidden && dhtmlx.modalbox.hide(box), box;
    }
    function alertPopup(config) {
        return _createBox(config, !0, !1);
    }
    function confirmPopup(config) {
        return _createBox(config, !0, !0);
    }
    function boxPopup(config) {
        return _createBox(config);
    }
    function box_params(text, type, callback) {
        return typeof text != "object" && (typeof type == "function" && (callback = type, type = ""), text = {
            text: text,
            type: type,
            callback: callback
        }), text;
    }
    function params(text, type, expire, id) {
        return typeof text != "object" && (text = {
            text: text,
            type: type,
            expire: expire,
            id: id
        }), text.id = text.id || t.uid(), text.expire = text.expire || t.expire, text;
    }
    dhtmlx.alert = function() {
        var text = box_params.apply(this, arguments);
        return text.type = text.type || "confirm", alertPopup(text);
    }, dhtmlx.confirm = function() {
        var text = box_params.apply(this, arguments);
        return text.type = text.type || "alert", confirmPopup(text);
    }, dhtmlx.modalbox = function() {
        var text = box_params.apply(this, arguments);
        return text.type = text.type || "alert", boxPopup(text);
    }, dhtmlx.modalbox.hide = function(node) {
        while (node && node.getAttribute && !node.getAttribute("dhxbox")) node = node.parentNode;
        node && (node.parentNode.removeChild(node), modality(!1));
    };
    var t = dhtmlx.message = function(text, type, expire, id) {
        text = params.apply(this, arguments), text.type = text.type || "info";
        var subtype = text.type.split("-")[0];
        switch (subtype) {
          case "alert":
            return alertPopup(text);
          case "confirm":
            return confirmPopup(text);
          case "modalbox":
            return boxPopup(text);
          default:
            return info(text);
        }
    };
    t.seed = (new Date).valueOf(), t.uid = function() {
        return t.seed++;
    }, t.expire = 4e3, t.keyboard = !0, t.position = "top", t.pull = {}, t.timers = {}, t.hideAll = function() {
        for (var key in t.pull) t.hide(key);
    }, t.hide = function(id) {
        var obj = t.pull[id];
        obj && obj.parentNode && (window.setTimeout(function() {
            obj.parentNode.removeChild(obj), obj = null;
        }, 2e3), obj.className += " hidden", t.timers[id] && window.clearTimeout(t.timers[id]), delete t.pull[id]);
    };
}(), define("lib/message", function() {}), define("apis/notify", [ "../lib/message" ], function() {
    function injectStyle() {
        var head = document.head, cssText = ".dhtmlx_message_area{position:fixed;right:5px;width:250px;z-index:1000}.dhtmlx-info{min-width:120px;min-height:20px;padding:4px 4px 4px 20px;font-family:Tahoma;z-index:10000;margin:5px;margin-bottom:10px;-webkit-transition:all .5s ease;-moz-transition:all .5s ease;-o-transition:all .5s ease;transition:all .5s ease}.dhtmlx-info.hidden{height:0;min-height:0;padding-top:0;padding-bottom:0;border-width:0;margin-top:0;margin-bottom:0;overflow:hidden}.dhtmlx_modal_box{overflow:hidden;display:inline-block;min-width:300px;width:300px;text-align:center;position:fixed;background-color:#fff;background:-webkit-linear-gradient(top,#fff 1%,#d0d0d0 99%);background:-moz-linear-gradient(top,#fff 1%,#d0d0d0 99%);box-shadow:0 0 14px #888;font-family:Tahoma;z-index:20000;border-radius:6px;border:1px solid #fff}.dhtmlx_popup_title{border-top-left-radius:5px;border-top-right-radius:5px;border-width:0;background:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAAoCAMAAAAIaGBFAAAAhFBMVEVwcHBubm5sbGxqampoaGhmZmZlZWVjY2NhYWFfX19dXV1bW1taWlpYWFhWVlZUVFRSUlJRUVFPT09NTU1LS0tJSUlHR0dGRkZERERCQkJAQEA+Pj49PT09PT0+Pj5AQEBBQUFDQ0NERERGRkZHR0dJSUlKSkpMTExMTEw5OTk5OTk5OTkny8YEAAAAQklEQVQImQXBCRJCAAAAwKVSQqdyjSPXNP7/QLsIhA6OTiJnF7GrRCpzc/fw9PKW+/gqlCq1RqvTG/yMJrPF6m/bAVEhAxxnHG0oAAAAAElFTkSuQmCC);background-image:-webkit-linear-gradient(top,#707070 1%,#3d3d3d 70%,#4c4c4c 97%,#393939 97%);background-image:-moz-linear-gradient(top,#707070 1%,#3d3d3d 70%,#4c4c4c 97%,#393939 97%)}.dhtmlx-info,.dhtmlx_popup_button,.dhtmlx_button{user-select:none;-webkit-user-select:none;-moz-user-select:-moz-none;cursor:pointer}.dhtmlx_popup_text{overflow:hidden}.dhtmlx_popup_controls{border-radius:6px;padding:5px}.dhtmlx_popup_button,.dhtmlx_button{height:30px;line-height:30px;display:inline-block;margin:0 5px;border-radius:6px;color:#FFF}.dhtmlx_popup_button{min-width:120px}div.dhx_modal_cover{background-color:#000;cursor:default;filter:alpha(opacity = 20);opacity:.2;position:fixed;z-index:19999;left:0;top:0;width:100%;height:100%;border:0;zoom:1}.dhtmlx-info img,.dhtmlx_modal_box img{float:left;margin-right:20px}.dhtmlx-info img{margin-left:-10px}.dhtmlx-alert-error .dhtmlx_popup_title,.dhtmlx-confirm-error .dhtmlx_popup_title{background:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAAsCAIAAAArRUU2AAAATklEQVR4nIWLuw2AMBBDjVuQiBT2oWbRDATrnB0KQOJoqPzRe3BrHI6dcBASYREKovtK6/6DsDOX+stN+3H1YX9ciRgnYq5EWYhS2dftBIuLT4JyIrPCAAAAAElFTkSuQmCC)}.dhtmlx-alert-error,.dhtmlx-confirm-error{border:1px solid #f00}.dhtmlx_button,.dhtmlx_popup_button{box-shadow:0 0 4px #888;border:1px solid #838383}.dhtmlx_button input,.dhtmlx_popup_button div{border:1px solid #FFF;background:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAAeCAMAAADaS4T1AAAAYFBMVEVwcHBtbW1ra2toaGhmZmZjY2NhYWFeXl5cXFxaWlpXV1dVVVVSUlJQUFBNTU1LS0tJSUlGRkZERERBQUE/Pz88PDw9PT0+Pj5AQEBCQkJDQ0NFRUVHR0dISEhKSkpMTEzqthaMAAAAMklEQVQImQXBhQ2AMAAAsOIMlwWH/8+kRSKVyRVKlVrQaHV6g9FktlhFm93hdLk9Xt8PIfgBvdUqyskAAAAASUVORK5CYII=);background-image:-webkit-linear-gradient(top,#707070 1%,#3d3d3d 70%,#4c4c4c 99%);background-image:-moz-linear-gradient(top,#707070 1%,#3d3d3d 70%,#4c4c4c 99%);border-radius:6px;font-size:15px;-moz-box-sizing:content-box;box-sizing:content-box;color:#fff;padding:0;margin:0;vertical-align:top;height:28px;line-height:28px}.dhtmlx_button input:focus,.dhtmlx_button input:active,.dhtmlx_popup_button div:active,.dhtmlx_popup_button div:focus{background:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAAeCAMAAADaS4T1AAAAXVBMVEVwcHBubm5tbW1sbGxra2tpaWloaGhnZ2dmZmZlZWVjY2NiYmJhYWFgYGBfX19dXV1cXFxbW1taWlpZWVlXV1dWVlZVVVVUVFRTU1NRUVFQUFBPT09OTk5NTU1LS0tT9SY0AAAAMUlEQVQImQXBhQGAMAAAIGxnx2z9/00BiVQmVyhVakGj1ekNRpPZYhVtdofT5fZ4fT8hpwG05JjexgAAAABJRU5ErkJggg==);background-image:-webkit-linear-gradient(top,#707070 1%,#4c4c4c 99%);background-image:-moz-linear-gradient(top,#707070 1%,#4c4c4c 99%)}.dhtmlx_popup_title{color:#fff;text-shadow:1px 1px #000;height:40px;line-height:40px;font-size:20px}.dhtmlx_popup_text{margin:15px 15px 5px 15px;font-size:14px;color:#000;min-height:30px;border-radius:6px}.dhtmlx-info,.dhtmlx-error{font-size:14px;color:#fff;box-shadow:0 4px 4px -4px #000;border-radius:5px;background-color:#000;background-color:rgba(0,0,0,0.8)}.dhtmlx-error{color:#F00}", styleBlock = document.createElement("style");
        styleBlock.innerHTML = cssText, head.appendChild(styleBlock);
    }
    var injectStyleAlready = !1;
    return injectStyleAlready || (injectStyle(), injectStyleAlready = !0), {
        log: function(msg) {
            dhtmlx.message(msg);
        }
    };
}), define("gesture_handlers/swipe", [ "../apis/image", "../apis/notify" ], function(ImageAPI, Notify) {
    var onProcessing = !1, lastActionTimestamp = 0, actionInteral = 300, directionObserver = {
        right: [ ImageAPI.nextImage ],
        left: [ ImageAPI.prevImage ],
        up: [],
        down: []
    };
    function _checkActionInterval() {
        return +(new Date) - lastActionTimestamp > actionInteral ? !0 : !1;
    }
    function _dispatchAPI(direction) {
        directionObserver[direction].forEach(function(fn) {
            fn();
        });
    }
    function _computeDirection(gesture) {
        var isHorizontal = Math.abs(gesture.direction[0]) > Math.abs(gesture.direction[1]), swipeDirection;
        return isHorizontal ? gesture.direction[0] > 0 ? swipeDirection = "right" : swipeDirection = "left" : gesture.direction[1] > 0 ? swipeDirection = "up" : swipeDirection = "down", swipeDirection;
    }
    function _callback(rawInfo) {
        var direction = _computeDirection(rawInfo);
        lastActionTimestamp = +(new Date), _dispatchAPI(direction), console.log(direction), Notify.log("右手滑动方向是" + direction), onProcessing = !1;
    }
    function entry(controller, frame) {
        var curFrame = frame;
        if (onProcessing || !curFrame.gestures || !curFrame.gestures.length) return;
        var gesture = curFrame.gestures[0];
        if (gesture.type != "swipe") return;
        _checkActionInterval() && (onProcessing = !0, _callback(gesture));
    }
    return entry;
}), define("gesture_handlers/translate", [ "../apis/image", "../apis/notify" ], function(ImageAPI, Notify) {
    var leftHand, rightHand;
    function computeAngle(a, b) {
        var cos = Math.acos(Leap.vec3.dot(a, b) / (Leap.vec3.len(a) * Leap.vec3.len(b))), angle = cos / Math.PI * 180;
        return angle;
    }
    function entry(controller, frame) {
        if (!controller) return;
        if (frame.hands.length && frame.hands.length == 2) {
            frame.hands[0].type == "right" ? (rightHand = frame.hands[0], leftHand = frame.hands[1]) : (rightHand = frame.hands[1], leftHand = frame.hands[0]);
            var palmNormal = leftHand.palmNormal, angle = computeAngle(palmNormal, [ 0, -1, 0 ]), previousFrame = controller.frame(1), movement = rightHand.translation(previousFrame), deltaX = movement[0], deltaY = movement[1], deltaZ = movement[2];
            ImageAPI.threed.translate(deltaX, deltaY, deltaZ);
        }
    }
    return entry;
}), define("gesture_handlers/scale", [ "../apis/image" ], function(ImageAPI) {
    function entry(controller, frame) {
        if (!controller) return;
        var rightHand = frame.hands[0];
        if (rightHand.type == "left") return;
        var interactionBox = frame.interactionBox, normalizedPosition = interactionBox.normalizePoint(rightHand.palmPosition, !0), MAX_SCALE = 1e3;
        ImageAPI.threed.zoom((normalizedPosition[2] - .5) * MAX_SCALE);
    }
    return entry;
}), requirejs.config({
    baseUrl: "./src/"
}), require([ "./gesture_engine/engine", "./gesture_handlers/swipe", "./gesture_handlers/translate", "./gesture_handlers/scale" ], function(Engine, swipeHandler, translateHandler, scaleHandler) {
    if (!window.Leap) return;
    var controller = new Leap.Controller({
        enableGestures: !0
    }), engine;
    controller.on("connect", function() {
        engine = new Engine(controller), engine.on("swipe", swipeHandler), engine.on("translate", translateHandler), engine.on("scale", scaleHandler);
    }), controller.on("gesture", function(gesture, frame) {
        engine.gestureHappened(gesture, frame);
    }), controller.on("frame", function(frame) {
        engine.frameHappened(frame);
    }), controller.on("disconnect", function() {
        console.error("disconnect");
    }), controller.on("deviceDisconnected", function() {
        console.error("deviceDisconnected");
    }), controller.connect();
}), define("main", function() {});;