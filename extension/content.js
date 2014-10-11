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

/*! jQuery v1.7.2 jquery.com | jquery.org/license */

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
}), define("gesture_engine/gestures/RiseDockGesture", [], function() {
    var rightHand, leftHand, prevRightHand, prevLeftHand;
    function computeAngle(a, b) {
        var cos = Math.acos(Leap.vec3.dot(a, b) / (Leap.vec3.len(a) * Leap.vec3.len(b))), angle = cos / Math.PI * 180;
        return angle;
    }
    function getHands(frame) {
        var hands = {};
        return frame.hands[0].type == "right" ? (hands.rightHand = frame.hands[0], hands.leftHand = frame.hands[1]) : (hands.rightHand = frame.hands[1], hands.leftHand = frame.hands[0]), hands;
    }
    function RiseDockGesture() {}
    return RiseDockGesture.prototype.validate = function(controller, frame) {
        if (!controller) return !1;
        if (frame.hands.length && frame.hands.length == 2) {
            rightHand = getHands(frame).rightHand, leftHand = getHands(frame).leftHand;
            var previousFrame = controller.frame(10);
            if (!previousFrame.hands.length || previousFrame.hands.length != 2) return !1;
            prevRightHand = getHands(previousFrame).rightHand, prevLeftHand = getHands(previousFrame).leftHand;
            if (rightHand.palmPosition[1] > prevRightHand.palmPosition[1]) return !0;
        }
        return !1;
    }, RiseDockGesture;
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

define("gesture_engine/engine", [ "./gestures/TranslateGesture", "./gestures/RiseDockGesture" ], function(TranslateGesture) {
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
    var $ = document.querySelector, hasInit = !1, doms = {
        nextBtn: document.querySelector(".img-next"),
        prevBtn: document.querySelector(".img-prev"),
        slideNextBtn: document.querySelector(".slider-btn-next"),
        slidePrevBtn: document.querySelector(".slider-btn-prev"),
        zoomInBtn: document.querySelector("#btnZoomIn"),
        zoomOutBtn: document.querySelector("#btnZoomOut"),
        pullHandler: document.querySelector(".album-handler"),
        img: document.querySelector("#srcPic img"),
        ad: document.querySelector("#sider"),
        header: document.querySelector("#header"),
        dock: document.querySelector(".album-pnl")
    };
    function check() {
        for (var el in doms) if (!doms[el]) return !1;
        return !0;
    }
    if (!!hasInit || !check()) return !1;
    document.body.style.perspective = "1000px";
    var imgTarget = doms.img;
    imgTarget.style.transformStyle = "preserve-3d", imgTarget.style.transition = "all .1s", console.log("API INIT CONPLETE"), hasInit = !0;
    var emptyFn = function() {
        console.log("NO API");
    }, rotateX = 0, rotateY = 0, rotateZ = 0, translateX = 0, translateY = 0, translateZ = 0, TRANS_TIMES = 2;
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
                var target = doms.img;
                target.style.transform = generateTransform();
            },
            rotate: function() {}
        },
        init: function() {
            var body = document.body;
            body.style.perspective = "1000px", doms.img.style.transformStyle = "preserve-3d";
        },
        nextImage: function() {
            doms.nextBtn.click(), reset(doms.img);
        },
        prevImage: function() {
            doms.prevBtn.click(), reset(doms.img);
        },
        pullUpDock: function() {
            doms.pullHandler.click();
        },
        pullDownDock: function() {
            doms.pullHandler.click();
        },
        slideToNext: function() {
            doms.slideNextBtn.click();
        },
        slideToPrev: function() {
            doms.slidePrevBtn.click();
        },
        zoomIn: function() {
            doms.zoomInBtn.click();
        },
        zoomOut: function() {
            doms.zoomOutBtn.click();
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
}(), define("lib/message", function() {}), function(a, b) {
    function cy(a) {
        return f.isWindow(a) ? a : a.nodeType === 9 ? a.defaultView || a.parentWindow : !1;
    }
    function cu(a) {
        if (!cj[a]) {
            var b = c.body, d = f("<" + a + ">").appendTo(b), e = d.css("display");
            d.remove();
            if (e === "none" || e === "") {
                ck || (ck = c.createElement("iframe"), ck.frameBorder = ck.width = ck.height = 0), b.appendChild(ck);
                if (!cl || !ck.createElement) cl = (ck.contentWindow || ck.contentDocument).document, cl.write((f.support.boxModel ? "<!doctype html>" : "") + "<html><body>"), cl.close();
                d = cl.createElement(a), cl.body.appendChild(d), e = f.css(d, "display"), b.removeChild(ck);
            }
            cj[a] = e;
        }
        return cj[a];
    }
    function ct(a, b) {
        var c = {};
        return f.each(cp.concat.apply([], cp.slice(0, b)), function() {
            c[this] = a;
        }), c;
    }
    function cs() {
        cq = b;
    }
    function cr() {
        return setTimeout(cs, 0), cq = f.now();
    }
    function ci() {
        try {
            return new a.ActiveXObject("Microsoft.XMLHTTP");
        } catch (b) {}
    }
    function ch() {
        try {
            return new a.XMLHttpRequest;
        } catch (b) {}
    }
    function cb(a, c) {
        a.dataFilter && (c = a.dataFilter(c, a.dataType));
        var d = a.dataTypes, e = {}, g, h, i = d.length, j, k = d[0], l, m, n, o, p;
        for (g = 1; g < i; g++) {
            if (g === 1) for (h in a.converters) typeof h == "string" && (e[h.toLowerCase()] = a.converters[h]);
            l = k, k = d[g];
            if (k === "*") k = l; else if (l !== "*" && l !== k) {
                m = l + " " + k, n = e[m] || e["* " + k];
                if (!n) {
                    p = b;
                    for (o in e) {
                        j = o.split(" ");
                        if (j[0] === l || j[0] === "*") {
                            p = e[j[1] + " " + k];
                            if (p) {
                                o = e[o], o === !0 ? n = p : p === !0 && (n = o);
                                break;
                            }
                        }
                    }
                }
                !n && !p && f.error("No conversion from " + m.replace(" ", " to ")), n !== !0 && (c = n ? n(c) : p(o(c)));
            }
        }
        return c;
    }
    function ca(a, c, d) {
        var e = a.contents, f = a.dataTypes, g = a.responseFields, h, i, j, k;
        for (i in g) i in d && (c[g[i]] = d[i]);
        while (f[0] === "*") f.shift(), h === b && (h = a.mimeType || c.getResponseHeader("content-type"));
        if (h) for (i in e) if (e[i] && e[i].test(h)) {
            f.unshift(i);
            break;
        }
        if (f[0] in d) j = f[0]; else {
            for (i in d) {
                if (!f[0] || a.converters[i + " " + f[0]]) {
                    j = i;
                    break;
                }
                k || (k = i);
            }
            j = j || k;
        }
        if (j) return j !== f[0] && f.unshift(j), d[j];
    }
    function b_(a, b, c, d) {
        if (f.isArray(b)) f.each(b, function(b, e) {
            c || bD.test(a) ? d(a, e) : b_(a + "[" + (typeof e == "object" ? b : "") + "]", e, c, d);
        }); else if (!c && f.type(b) === "object") for (var e in b) b_(a + "[" + e + "]", b[e], c, d); else d(a, b);
    }
    function b$(a, c) {
        var d, e, g = f.ajaxSettings.flatOptions || {};
        for (d in c) c[d] !== b && ((g[d] ? a : e || (e = {}))[d] = c[d]);
        e && f.extend(!0, a, e);
    }
    function bZ(a, c, d, e, f, g) {
        f = f || c.dataTypes[0], g = g || {}, g[f] = !0;
        var h = a[f], i = 0, j = h ? h.length : 0, k = a === bS, l;
        for (; i < j && (k || !l); i++) l = h[i](c, d, e), typeof l == "string" && (!k || g[l] ? l = b : (c.dataTypes.unshift(l), l = bZ(a, c, d, e, l, g)));
        return (k || !l) && !g["*"] && (l = bZ(a, c, d, e, "*", g)), l;
    }
    function bY(a) {
        return function(b, c) {
            typeof b != "string" && (c = b, b = "*");
            if (f.isFunction(c)) {
                var d = b.toLowerCase().split(bO), e = 0, g = d.length, h, i, j;
                for (; e < g; e++) h = d[e], j = /^\+/.test(h), j && (h = h.substr(1) || "*"), i = a[h] = a[h] || [], i[j ? "unshift" : "push"](c);
            }
        };
    }
    function bB(a, b, c) {
        var d = b === "width" ? a.offsetWidth : a.offsetHeight, e = b === "width" ? 1 : 0, g = 4;
        if (d > 0) {
            if (c !== "border") for (; e < g; e += 2) c || (d -= parseFloat(f.css(a, "padding" + bx[e])) || 0), c === "margin" ? d += parseFloat(f.css(a, c + bx[e])) || 0 : d -= parseFloat(f.css(a, "border" + bx[e] + "Width")) || 0;
            return d + "px";
        }
        d = by(a, b);
        if (d < 0 || d == null) d = a.style[b];
        if (bt.test(d)) return d;
        d = parseFloat(d) || 0;
        if (c) for (; e < g; e += 2) d += parseFloat(f.css(a, "padding" + bx[e])) || 0, c !== "padding" && (d += parseFloat(f.css(a, "border" + bx[e] + "Width")) || 0), c === "margin" && (d += parseFloat(f.css(a, c + bx[e])) || 0);
        return d + "px";
    }
    function bo(a) {
        var b = c.createElement("div");
        return bh.appendChild(b), b.innerHTML = a.outerHTML, b.firstChild;
    }
    function bn(a) {
        var b = (a.nodeName || "").toLowerCase();
        b === "input" ? bm(a) : b !== "script" && typeof a.getElementsByTagName != "undefined" && f.grep(a.getElementsByTagName("input"), bm);
    }
    function bm(a) {
        if (a.type === "checkbox" || a.type === "radio") a.defaultChecked = a.checked;
    }
    function bl(a) {
        return typeof a.getElementsByTagName != "undefined" ? a.getElementsByTagName("*") : typeof a.querySelectorAll != "undefined" ? a.querySelectorAll("*") : [];
    }
    function bk(a, b) {
        var c;
        b.nodeType === 1 && (b.clearAttributes && b.clearAttributes(), b.mergeAttributes && b.mergeAttributes(a), c = b.nodeName.toLowerCase(), c === "object" ? b.outerHTML = a.outerHTML : c !== "input" || a.type !== "checkbox" && a.type !== "radio" ? c === "option" ? b.selected = a.defaultSelected : c === "input" || c === "textarea" ? b.defaultValue = a.defaultValue : c === "script" && b.text !== a.text && (b.text = a.text) : (a.checked && (b.defaultChecked = b.checked = a.checked), b.value !== a.value && (b.value = a.value)), b.removeAttribute(f.expando), b.removeAttribute("_submit_attached"), b.removeAttribute("_change_attached"));
    }
    function bj(a, b) {
        if (b.nodeType === 1 && !!f.hasData(a)) {
            var c, d, e, g = f._data(a), h = f._data(b, g), i = g.events;
            if (i) {
                delete h.handle, h.events = {};
                for (c in i) for (d = 0, e = i[c].length; d < e; d++) f.event.add(b, c, i[c][d]);
            }
            h.data && (h.data = f.extend({}, h.data));
        }
    }
    function bi(a, b) {
        return f.nodeName(a, "table") ? a.getElementsByTagName("tbody")[0] || a.appendChild(a.ownerDocument.createElement("tbody")) : a;
    }
    function U(a) {
        var b = V.split("|"), c = a.createDocumentFragment();
        if (c.createElement) while (b.length) c.createElement(b.pop());
        return c;
    }
    function T(a, b, c) {
        b = b || 0;
        if (f.isFunction(b)) return f.grep(a, function(a, d) {
            var e = !!b.call(a, d, a);
            return e === c;
        });
        if (b.nodeType) return f.grep(a, function(a, d) {
            return a === b === c;
        });
        if (typeof b == "string") {
            var d = f.grep(a, function(a) {
                return a.nodeType === 1;
            });
            if (O.test(b)) return f.filter(b, d, !c);
            b = f.filter(b, d);
        }
        return f.grep(a, function(a, d) {
            return f.inArray(a, b) >= 0 === c;
        });
    }
    function S(a) {
        return !a || !a.parentNode || a.parentNode.nodeType === 11;
    }
    function K() {
        return !0;
    }
    function J() {
        return !1;
    }
    function n(a, b, c) {
        var d = b + "defer", e = b + "queue", g = b + "mark", h = f._data(a, d);
        h && (c === "queue" || !f._data(a, e)) && (c === "mark" || !f._data(a, g)) && setTimeout(function() {
            !f._data(a, e) && !f._data(a, g) && (f.removeData(a, d, !0), h.fire());
        }, 0);
    }
    function m(a) {
        for (var b in a) {
            if (b === "data" && f.isEmptyObject(a[b])) continue;
            if (b !== "toJSON") return !1;
        }
        return !0;
    }
    function l(a, c, d) {
        if (d === b && a.nodeType === 1) {
            var e = "data-" + c.replace(k, "-$1").toLowerCase();
            d = a.getAttribute(e);
            if (typeof d == "string") {
                try {
                    d = d === "true" ? !0 : d === "false" ? !1 : d === "null" ? null : f.isNumeric(d) ? +d : j.test(d) ? f.parseJSON(d) : d;
                } catch (g) {}
                f.data(a, c, d);
            } else d = b;
        }
        return d;
    }
    function h(a) {
        var b = g[a] = {}, c, d;
        a = a.split(/\s+/);
        for (c = 0, d = a.length; c < d; c++) b[a[c]] = !0;
        return b;
    }
    var c = a.document, d = a.navigator, e = a.location, f = function() {
        function J() {
            if (!e.isReady) {
                try {
                    c.documentElement.doScroll("left");
                } catch (a) {
                    setTimeout(J, 1);
                    return;
                }
                e.ready();
            }
        }
        var e = function(a, b) {
            return new e.fn.init(a, b, h);
        }, f = a.jQuery, g = a.$, h, i = /^(?:[^#<]*(<[\w\W]+>)[^>]*$|#([\w\-]*)$)/, j = /\S/, k = /^\s+/, l = /\s+$/, m = /^<(\w+)\s*\/?>(?:<\/\1>)?$/, n = /^[\],:{}\s]*$/, o = /\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, p = /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, q = /(?:^|:|,)(?:\s*\[)+/g, r = /(webkit)[ \/]([\w.]+)/, s = /(opera)(?:.*version)?[ \/]([\w.]+)/, t = /(msie) ([\w.]+)/, u = /(mozilla)(?:.*? rv:([\w.]+))?/, v = /-([a-z]|[0-9])/ig, w = /^-ms-/, x = function(a, b) {
            return (b + "").toUpperCase();
        }, y = d.userAgent, z, A, B, C = Object.prototype.toString, D = Object.prototype.hasOwnProperty, E = Array.prototype.push, F = Array.prototype.slice, G = String.prototype.trim, H = Array.prototype.indexOf, I = {};
        return e.fn = e.prototype = {
            constructor: e,
            init: function(a, d, f) {
                var g, h, j, k;
                if (!a) return this;
                if (a.nodeType) return this.context = this[0] = a, this.length = 1, this;
                if (a === "body" && !d && c.body) return this.context = c, this[0] = c.body, this.selector = a, this.length = 1, this;
                if (typeof a == "string") {
                    a.charAt(0) !== "<" || a.charAt(a.length - 1) !== ">" || a.length < 3 ? g = i.exec(a) : g = [ null, a, null ];
                    if (g && (g[1] || !d)) {
                        if (g[1]) return d = d instanceof e ? d[0] : d, k = d ? d.ownerDocument || d : c, j = m.exec(a), j ? e.isPlainObject(d) ? (a = [ c.createElement(j[1]) ], e.fn.attr.call(a, d, !0)) : a = [ k.createElement(j[1]) ] : (j = e.buildFragment([ g[1] ], [ k ]), a = (j.cacheable ? e.clone(j.fragment) : j.fragment).childNodes), e.merge(this, a);
                        h = c.getElementById(g[2]);
                        if (h && h.parentNode) {
                            if (h.id !== g[2]) return f.find(a);
                            this.length = 1, this[0] = h;
                        }
                        return this.context = c, this.selector = a, this;
                    }
                    return !d || d.jquery ? (d || f).find(a) : this.constructor(d).find(a);
                }
                return e.isFunction(a) ? f.ready(a) : (a.selector !== b && (this.selector = a.selector, this.context = a.context), e.makeArray(a, this));
            },
            selector: "",
            jquery: "1.7.2",
            length: 0,
            size: function() {
                return this.length;
            },
            toArray: function() {
                return F.call(this, 0);
            },
            get: function(a) {
                return a == null ? this.toArray() : a < 0 ? this[this.length + a] : this[a];
            },
            pushStack: function(a, b, c) {
                var d = this.constructor();
                return e.isArray(a) ? E.apply(d, a) : e.merge(d, a), d.prevObject = this, d.context = this.context, b === "find" ? d.selector = this.selector + (this.selector ? " " : "") + c : b && (d.selector = this.selector + "." + b + "(" + c + ")"), d;
            },
            each: function(a, b) {
                return e.each(this, a, b);
            },
            ready: function(a) {
                return e.bindReady(), A.add(a), this;
            },
            eq: function(a) {
                return a = +a, a === -1 ? this.slice(a) : this.slice(a, a + 1);
            },
            first: function() {
                return this.eq(0);
            },
            last: function() {
                return this.eq(-1);
            },
            slice: function() {
                return this.pushStack(F.apply(this, arguments), "slice", F.call(arguments).join(","));
            },
            map: function(a) {
                return this.pushStack(e.map(this, function(b, c) {
                    return a.call(b, c, b);
                }));
            },
            end: function() {
                return this.prevObject || this.constructor(null);
            },
            push: E,
            sort: [].sort,
            splice: [].splice
        }, e.fn.init.prototype = e.fn, e.extend = e.fn.extend = function() {
            var a, c, d, f, g, h, i = arguments[0] || {}, j = 1, k = arguments.length, l = !1;
            typeof i == "boolean" && (l = i, i = arguments[1] || {}, j = 2), typeof i != "object" && !e.isFunction(i) && (i = {}), k === j && (i = this, --j);
            for (; j < k; j++) if ((a = arguments[j]) != null) for (c in a) {
                d = i[c], f = a[c];
                if (i === f) continue;
                l && f && (e.isPlainObject(f) || (g = e.isArray(f))) ? (g ? (g = !1, h = d && e.isArray(d) ? d : []) : h = d && e.isPlainObject(d) ? d : {}, i[c] = e.extend(l, h, f)) : f !== b && (i[c] = f);
            }
            return i;
        }, e.extend({
            noConflict: function(b) {
                return a.$ === e && (a.$ = g), b && a.jQuery === e && (a.jQuery = f), e;
            },
            isReady: !1,
            readyWait: 1,
            holdReady: function(a) {
                a ? e.readyWait++ : e.ready(!0);
            },
            ready: function(a) {
                if (a === !0 && !--e.readyWait || a !== !0 && !e.isReady) {
                    if (!c.body) return setTimeout(e.ready, 1);
                    e.isReady = !0;
                    if (a !== !0 && --e.readyWait > 0) return;
                    A.fireWith(c, [ e ]), e.fn.trigger && e(c).trigger("ready").off("ready");
                }
            },
            bindReady: function() {
                if (!A) {
                    A = e.Callbacks("once memory");
                    if (c.readyState === "complete") return setTimeout(e.ready, 1);
                    if (c.addEventListener) c.addEventListener("DOMContentLoaded", B, !1), a.addEventListener("load", e.ready, !1); else if (c.attachEvent) {
                        c.attachEvent("onreadystatechange", B), a.attachEvent("onload", e.ready);
                        var b = !1;
                        try {
                            b = a.frameElement == null;
                        } catch (d) {}
                        c.documentElement.doScroll && b && J();
                    }
                }
            },
            isFunction: function(a) {
                return e.type(a) === "function";
            },
            isArray: Array.isArray || function(a) {
                return e.type(a) === "array";
            },
            isWindow: function(a) {
                return a != null && a == a.window;
            },
            isNumeric: function(a) {
                return !isNaN(parseFloat(a)) && isFinite(a);
            },
            type: function(a) {
                return a == null ? String(a) : I[C.call(a)] || "object";
            },
            isPlainObject: function(a) {
                if (!a || e.type(a) !== "object" || a.nodeType || e.isWindow(a)) return !1;
                try {
                    if (a.constructor && !D.call(a, "constructor") && !D.call(a.constructor.prototype, "isPrototypeOf")) return !1;
                } catch (c) {
                    return !1;
                }
                var d;
                for (d in a) ;
                return d === b || D.call(a, d);
            },
            isEmptyObject: function(a) {
                for (var b in a) return !1;
                return !0;
            },
            error: function(a) {
                throw new Error(a);
            },
            parseJSON: function(b) {
                if (typeof b != "string" || !b) return null;
                b = e.trim(b);
                if (a.JSON && a.JSON.parse) return a.JSON.parse(b);
                if (n.test(b.replace(o, "@").replace(p, "]").replace(q, ""))) return (new Function("return " + b))();
                e.error("Invalid JSON: " + b);
            },
            parseXML: function(c) {
                if (typeof c != "string" || !c) return null;
                var d, f;
                try {
                    a.DOMParser ? (f = new DOMParser, d = f.parseFromString(c, "text/xml")) : (d = new ActiveXObject("Microsoft.XMLDOM"), d.async = "false", d.loadXML(c));
                } catch (g) {
                    d = b;
                }
                return (!d || !d.documentElement || d.getElementsByTagName("parsererror").length) && e.error("Invalid XML: " + c), d;
            },
            noop: function() {},
            globalEval: function(b) {
                b && j.test(b) && (a.execScript || function(b) {
                    a.eval.call(a, b);
                })(b);
            },
            camelCase: function(a) {
                return a.replace(w, "ms-").replace(v, x);
            },
            nodeName: function(a, b) {
                return a.nodeName && a.nodeName.toUpperCase() === b.toUpperCase();
            },
            each: function(a, c, d) {
                var f, g = 0, h = a.length, i = h === b || e.isFunction(a);
                if (d) {
                    if (i) {
                        for (f in a) if (c.apply(a[f], d) === !1) break;
                    } else for (; g < h; ) if (c.apply(a[g++], d) === !1) break;
                } else if (i) {
                    for (f in a) if (c.call(a[f], f, a[f]) === !1) break;
                } else for (; g < h; ) if (c.call(a[g], g, a[g++]) === !1) break;
                return a;
            },
            trim: G ? function(a) {
                return a == null ? "" : G.call(a);
            } : function(a) {
                return a == null ? "" : (a + "").replace(k, "").replace(l, "");
            },
            makeArray: function(a, b) {
                var c = b || [];
                if (a != null) {
                    var d = e.type(a);
                    a.length == null || d === "string" || d === "function" || d === "regexp" || e.isWindow(a) ? E.call(c, a) : e.merge(c, a);
                }
                return c;
            },
            inArray: function(a, b, c) {
                var d;
                if (b) {
                    if (H) return H.call(b, a, c);
                    d = b.length, c = c ? c < 0 ? Math.max(0, d + c) : c : 0;
                    for (; c < d; c++) if (c in b && b[c] === a) return c;
                }
                return -1;
            },
            merge: function(a, c) {
                var d = a.length, e = 0;
                if (typeof c.length == "number") for (var f = c.length; e < f; e++) a[d++] = c[e]; else while (c[e] !== b) a[d++] = c[e++];
                return a.length = d, a;
            },
            grep: function(a, b, c) {
                var d = [], e;
                c = !!c;
                for (var f = 0, g = a.length; f < g; f++) e = !!b(a[f], f), c !== e && d.push(a[f]);
                return d;
            },
            map: function(a, c, d) {
                var f, g, h = [], i = 0, j = a.length, k = a instanceof e || j !== b && typeof j == "number" && (j > 0 && a[0] && a[j - 1] || j === 0 || e.isArray(a));
                if (k) for (; i < j; i++) f = c(a[i], i, d), f != null && (h[h.length] = f); else for (g in a) f = c(a[g], g, d), f != null && (h[h.length] = f);
                return h.concat.apply([], h);
            },
            guid: 1,
            proxy: function(a, c) {
                if (typeof c == "string") {
                    var d = a[c];
                    c = a, a = d;
                }
                if (!e.isFunction(a)) return b;
                var f = F.call(arguments, 2), g = function() {
                    return a.apply(c, f.concat(F.call(arguments)));
                };
                return g.guid = a.guid = a.guid || g.guid || e.guid++, g;
            },
            access: function(a, c, d, f, g, h, i) {
                var j, k = d == null, l = 0, m = a.length;
                if (d && typeof d == "object") {
                    for (l in d) e.access(a, c, l, d[l], 1, h, f);
                    g = 1;
                } else if (f !== b) {
                    j = i === b && e.isFunction(f), k && (j ? (j = c, c = function(a, b, c) {
                        return j.call(e(a), c);
                    }) : (c.call(a, f), c = null));
                    if (c) for (; l < m; l++) c(a[l], d, j ? f.call(a[l], l, c(a[l], d)) : f, i);
                    g = 1;
                }
                return g ? a : k ? c.call(a) : m ? c(a[0], d) : h;
            },
            now: function() {
                return (new Date).getTime();
            },
            uaMatch: function(a) {
                a = a.toLowerCase();
                var b = r.exec(a) || s.exec(a) || t.exec(a) || a.indexOf("compatible") < 0 && u.exec(a) || [];
                return {
                    browser: b[1] || "",
                    version: b[2] || "0"
                };
            },
            sub: function() {
                function a(b, c) {
                    return new a.fn.init(b, c);
                }
                e.extend(!0, a, this), a.superclass = this, a.fn = a.prototype = this(), a.fn.constructor = a, a.sub = this.sub, a.fn.init = function(d, f) {
                    return f && f instanceof e && !(f instanceof a) && (f = a(f)), e.fn.init.call(this, d, f, b);
                }, a.fn.init.prototype = a.fn;
                var b = a(c);
                return a;
            },
            browser: {}
        }), e.each("Boolean Number String Function Array Date RegExp Object".split(" "), function(a, b) {
            I["[object " + b + "]"] = b.toLowerCase();
        }), z = e.uaMatch(y), z.browser && (e.browser[z.browser] = !0, e.browser.version = z.version), e.browser.webkit && (e.browser.safari = !0), j.test(" ") && (k = /^[\s\xA0]+/, l = /[\s\xA0]+$/), h = e(c), c.addEventListener ? B = function() {
            c.removeEventListener("DOMContentLoaded", B, !1), e.ready();
        } : c.attachEvent && (B = function() {
            c.readyState === "complete" && (c.detachEvent("onreadystatechange", B), e.ready());
        }), e;
    }(), g = {};
    f.Callbacks = function(a) {
        a = a ? g[a] || h(a) : {};
        var c = [], d = [], e, i, j, k, l, m, n = function(b) {
            var d, e, g, h, i;
            for (d = 0, e = b.length; d < e; d++) g = b[d], h = f.type(g), h === "array" ? n(g) : h === "function" && (!a.unique || !p.has(g)) && c.push(g);
        }, o = function(b, f) {
            f = f || [], e = !a.memory || [ b, f ], i = !0, j = !0, m = k || 0, k = 0, l = c.length;
            for (; c && m < l; m++) if (c[m].apply(b, f) === !1 && a.stopOnFalse) {
                e = !0;
                break;
            }
            j = !1, c && (a.once ? e === !0 ? p.disable() : c = [] : d && d.length && (e = d.shift(), p.fireWith(e[0], e[1])));
        }, p = {
            add: function() {
                if (c) {
                    var a = c.length;
                    n(arguments), j ? l = c.length : e && e !== !0 && (k = a, o(e[0], e[1]));
                }
                return this;
            },
            remove: function() {
                if (c) {
                    var b = arguments, d = 0, e = b.length;
                    for (; d < e; d++) for (var f = 0; f < c.length; f++) if (b[d] === c[f]) {
                        j && f <= l && (l--, f <= m && m--), c.splice(f--, 1);
                        if (a.unique) break;
                    }
                }
                return this;
            },
            has: function(a) {
                if (c) {
                    var b = 0, d = c.length;
                    for (; b < d; b++) if (a === c[b]) return !0;
                }
                return !1;
            },
            empty: function() {
                return c = [], this;
            },
            disable: function() {
                return c = d = e = b, this;
            },
            disabled: function() {
                return !c;
            },
            lock: function() {
                return d = b, (!e || e === !0) && p.disable(), this;
            },
            locked: function() {
                return !d;
            },
            fireWith: function(b, c) {
                return d && (j ? a.once || d.push([ b, c ]) : (!a.once || !e) && o(b, c)), this;
            },
            fire: function() {
                return p.fireWith(this, arguments), this;
            },
            fired: function() {
                return !!i;
            }
        };
        return p;
    };
    var i = [].slice;
    f.extend({
        Deferred: function(a) {
            var b = f.Callbacks("once memory"), c = f.Callbacks("once memory"), d = f.Callbacks("memory"), e = "pending", g = {
                resolve: b,
                reject: c,
                notify: d
            }, h = {
                done: b.add,
                fail: c.add,
                progress: d.add,
                state: function() {
                    return e;
                },
                isResolved: b.fired,
                isRejected: c.fired,
                then: function(a, b, c) {
                    return i.done(a).fail(b).progress(c), this;
                },
                always: function() {
                    return i.done.apply(i, arguments).fail.apply(i, arguments), this;
                },
                pipe: function(a, b, c) {
                    return f.Deferred(function(d) {
                        f.each({
                            done: [ a, "resolve" ],
                            fail: [ b, "reject" ],
                            progress: [ c, "notify" ]
                        }, function(a, b) {
                            var c = b[0], e = b[1], g;
                            f.isFunction(c) ? i[a](function() {
                                g = c.apply(this, arguments), g && f.isFunction(g.promise) ? g.promise().then(d.resolve, d.reject, d.notify) : d[e + "With"](this === i ? d : this, [ g ]);
                            }) : i[a](d[e]);
                        });
                    }).promise();
                },
                promise: function(a) {
                    if (a == null) a = h; else for (var b in h) a[b] = h[b];
                    return a;
                }
            }, i = h.promise({}), j;
            for (j in g) i[j] = g[j].fire, i[j + "With"] = g[j].fireWith;
            return i.done(function() {
                e = "resolved";
            }, c.disable, d.lock).fail(function() {
                e = "rejected";
            }, b.disable, d.lock), a && a.call(i, i), i;
        },
        when: function(a) {
            function m(a) {
                return function(b) {
                    e[a] = arguments.length > 1 ? i.call(arguments, 0) : b, j.notifyWith(k, e);
                };
            }
            function l(a) {
                return function(c) {
                    b[a] = arguments.length > 1 ? i.call(arguments, 0) : c, --g || j.resolveWith(j, b);
                };
            }
            var b = i.call(arguments, 0), c = 0, d = b.length, e = Array(d), g = d, h = d, j = d <= 1 && a && f.isFunction(a.promise) ? a : f.Deferred(), k = j.promise();
            if (d > 1) {
                for (; c < d; c++) b[c] && b[c].promise && f.isFunction(b[c].promise) ? b[c].promise().then(l(c), j.reject, m(c)) : --g;
                g || j.resolveWith(j, b);
            } else j !== a && j.resolveWith(j, d ? [ a ] : []);
            return k;
        }
    }), f.support = function() {
        var b, d, e, g, h, i, j, k, l, m, n, o, p = c.createElement("div"), q = c.documentElement;
        p.setAttribute("className", "t"), p.innerHTML = "   <link/><table></table><a href='/a' style='top:1px;float:left;opacity:.55;'>a</a><input type='checkbox'/>", d = p.getElementsByTagName("*"), e = p.getElementsByTagName("a")[0];
        if (!d || !d.length || !e) return {};
        g = c.createElement("select"), h = g.appendChild(c.createElement("option")), i = p.getElementsByTagName("input")[0], b = {
            leadingWhitespace: p.firstChild.nodeType === 3,
            tbody: !p.getElementsByTagName("tbody").length,
            htmlSerialize: !!p.getElementsByTagName("link").length,
            style: /top/.test(e.getAttribute("style")),
            hrefNormalized: e.getAttribute("href") === "/a",
            opacity: /^0.55/.test(e.style.opacity),
            cssFloat: !!e.style.cssFloat,
            checkOn: i.value === "on",
            optSelected: h.selected,
            getSetAttribute: p.className !== "t",
            enctype: !!c.createElement("form").enctype,
            html5Clone: c.createElement("nav").cloneNode(!0).outerHTML !== "<:nav></:nav>",
            submitBubbles: !0,
            changeBubbles: !0,
            focusinBubbles: !1,
            deleteExpando: !0,
            noCloneEvent: !0,
            inlineBlockNeedsLayout: !1,
            shrinkWrapBlocks: !1,
            reliableMarginRight: !0,
            pixelMargin: !0
        }, f.boxModel = b.boxModel = c.compatMode === "CSS1Compat", i.checked = !0, b.noCloneChecked = i.cloneNode(!0).checked, g.disabled = !0, b.optDisabled = !h.disabled;
        try {
            delete p.test;
        } catch (r) {
            b.deleteExpando = !1;
        }
        !p.addEventListener && p.attachEvent && p.fireEvent && (p.attachEvent("onclick", function() {
            b.noCloneEvent = !1;
        }), p.cloneNode(!0).fireEvent("onclick")), i = c.createElement("input"), i.value = "t", i.setAttribute("type", "radio"), b.radioValue = i.value === "t", i.setAttribute("checked", "checked"), i.setAttribute("name", "t"), p.appendChild(i), j = c.createDocumentFragment(), j.appendChild(p.lastChild), b.checkClone = j.cloneNode(!0).cloneNode(!0).lastChild.checked, b.appendChecked = i.checked, j.removeChild(i), j.appendChild(p);
        if (p.attachEvent) for (n in {
            submit: 1,
            change: 1,
            focusin: 1
        }) m = "on" + n, o = m in p, o || (p.setAttribute(m, "return;"), o = typeof p[m] == "function"), b[n + "Bubbles"] = o;
        return j.removeChild(p), j = g = h = p = i = null, f(function() {
            var d, e, g, h, i, j, l, m, n, q, r, s, t, u = c.getElementsByTagName("body")[0];
            !u || (m = 1, t = "padding:0;margin:0;border:", r = "position:absolute;top:0;left:0;width:1px;height:1px;", s = t + "0;visibility:hidden;", n = "style='" + r + t + "5px solid #000;", q = "<div " + n + "display:block;'><div style='" + t + "0;display:block;overflow:hidden;'></div></div>" + "<table " + n + "' cellpadding='0' cellspacing='0'>" + "<tr><td></td></tr></table>", d = c.createElement("div"), d.style.cssText = s + "width:0;height:0;position:static;top:0;margin-top:" + m + "px", u.insertBefore(d, u.firstChild), p = c.createElement("div"), d.appendChild(p), p.innerHTML = "<table><tr><td style='" + t + "0;display:none'></td><td>t</td></tr></table>", k = p.getElementsByTagName("td"), o = k[0].offsetHeight === 0, k[0].style.display = "", k[1].style.display = "none", b.reliableHiddenOffsets = o && k[0].offsetHeight === 0, a.getComputedStyle && (p.innerHTML = "", l = c.createElement("div"), l.style.width = "0", l.style.marginRight = "0", p.style.width = "2px", p.appendChild(l), b.reliableMarginRight = (parseInt((a.getComputedStyle(l, null) || {
                marginRight: 0
            }).marginRight, 10) || 0) === 0), typeof p.style.zoom != "undefined" && (p.innerHTML = "", p.style.width = p.style.padding = "1px", p.style.border = 0, p.style.overflow = "hidden", p.style.display = "inline", p.style.zoom = 1, b.inlineBlockNeedsLayout = p.offsetWidth === 3, p.style.display = "block", p.style.overflow = "visible", p.innerHTML = "<div style='width:5px;'></div>", b.shrinkWrapBlocks = p.offsetWidth !== 3), p.style.cssText = r + s, p.innerHTML = q, e = p.firstChild, g = e.firstChild, i = e.nextSibling.firstChild.firstChild, j = {
                doesNotAddBorder: g.offsetTop !== 5,
                doesAddBorderForTableAndCells: i.offsetTop === 5
            }, g.style.position = "fixed", g.style.top = "20px", j.fixedPosition = g.offsetTop === 20 || g.offsetTop === 15, g.style.position = g.style.top = "", e.style.overflow = "hidden", e.style.position = "relative", j.subtractsBorderForOverflowNotVisible = g.offsetTop === -5, j.doesNotIncludeMarginInBodyOffset = u.offsetTop !== m, a.getComputedStyle && (p.style.marginTop = "1%", b.pixelMargin = (a.getComputedStyle(p, null) || {
                marginTop: 0
            }).marginTop !== "1%"), typeof d.style.zoom != "undefined" && (d.style.zoom = 1), u.removeChild(d), l = p = d = null, f.extend(b, j));
        }), b;
    }();
    var j = /^(?:\{.*\}|\[.*\])$/, k = /([A-Z])/g;
    f.extend({
        cache: {},
        uuid: 0,
        expando: "jQuery" + (f.fn.jquery + Math.random()).replace(/\D/g, ""),
        noData: {
            embed: !0,
            object: "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000",
            applet: !0
        },
        hasData: function(a) {
            return a = a.nodeType ? f.cache[a[f.expando]] : a[f.expando], !!a && !m(a);
        },
        data: function(a, c, d, e) {
            if (!!f.acceptData(a)) {
                var g, h, i, j = f.expando, k = typeof c == "string", l = a.nodeType, m = l ? f.cache : a, n = l ? a[j] : a[j] && j, o = c === "events";
                if ((!n || !m[n] || !o && !e && !m[n].data) && k && d === b) return;
                n || (l ? a[j] = n = ++f.uuid : n = j), m[n] || (m[n] = {}, l || (m[n].toJSON = f.noop));
                if (typeof c == "object" || typeof c == "function") e ? m[n] = f.extend(m[n], c) : m[n].data = f.extend(m[n].data, c);
                return g = h = m[n], e || (h.data || (h.data = {}), h = h.data), d !== b && (h[f.camelCase(c)] = d), o && !h[c] ? g.events : (k ? (i = h[c], i == null && (i = h[f.camelCase(c)])) : i = h, i);
            }
        },
        removeData: function(a, b, c) {
            if (!!f.acceptData(a)) {
                var d, e, g, h = f.expando, i = a.nodeType, j = i ? f.cache : a, k = i ? a[h] : h;
                if (!j[k]) return;
                if (b) {
                    d = c ? j[k] : j[k].data;
                    if (d) {
                        f.isArray(b) || (b in d ? b = [ b ] : (b = f.camelCase(b), b in d ? b = [ b ] : b = b.split(" ")));
                        for (e = 0, g = b.length; e < g; e++) delete d[b[e]];
                        if (!(c ? m : f.isEmptyObject)(d)) return;
                    }
                }
                if (!c) {
                    delete j[k].data;
                    if (!m(j[k])) return;
                }
                f.support.deleteExpando || !j.setInterval ? delete j[k] : j[k] = null, i && (f.support.deleteExpando ? delete a[h] : a.removeAttribute ? a.removeAttribute(h) : a[h] = null);
            }
        },
        _data: function(a, b, c) {
            return f.data(a, b, c, !0);
        },
        acceptData: function(a) {
            if (a.nodeName) {
                var b = f.noData[a.nodeName.toLowerCase()];
                if (b) return b !== !0 && a.getAttribute("classid") === b;
            }
            return !0;
        }
    }), f.fn.extend({
        data: function(a, c) {
            var d, e, g, h, i, j = this[0], k = 0, m = null;
            if (a === b) {
                if (this.length) {
                    m = f.data(j);
                    if (j.nodeType === 1 && !f._data(j, "parsedAttrs")) {
                        g = j.attributes;
                        for (i = g.length; k < i; k++) h = g[k].name, h.indexOf("data-") === 0 && (h = f.camelCase(h.substring(5)), l(j, h, m[h]));
                        f._data(j, "parsedAttrs", !0);
                    }
                }
                return m;
            }
            return typeof a == "object" ? this.each(function() {
                f.data(this, a);
            }) : (d = a.split(".", 2), d[1] = d[1] ? "." + d[1] : "", e = d[1] + "!", f.access(this, function(c) {
                if (c === b) return m = this.triggerHandler("getData" + e, [ d[0] ]), m === b && j && (m = f.data(j, a), m = l(j, a, m)), m === b && d[1] ? this.data(d[0]) : m;
                d[1] = c, this.each(function() {
                    var b = f(this);
                    b.triggerHandler("setData" + e, d), f.data(this, a, c), b.triggerHandler("changeData" + e, d);
                });
            }, null, c, arguments.length > 1, null, !1));
        },
        removeData: function(a) {
            return this.each(function() {
                f.removeData(this, a);
            });
        }
    }), f.extend({
        _mark: function(a, b) {
            a && (b = (b || "fx") + "mark", f._data(a, b, (f._data(a, b) || 0) + 1));
        },
        _unmark: function(a, b, c) {
            a !== !0 && (c = b, b = a, a = !1);
            if (b) {
                c = c || "fx";
                var d = c + "mark", e = a ? 0 : (f._data(b, d) || 1) - 1;
                e ? f._data(b, d, e) : (f.removeData(b, d, !0), n(b, c, "mark"));
            }
        },
        queue: function(a, b, c) {
            var d;
            if (a) return b = (b || "fx") + "queue", d = f._data(a, b), c && (!d || f.isArray(c) ? d = f._data(a, b, f.makeArray(c)) : d.push(c)), d || [];
        },
        dequeue: function(a, b) {
            b = b || "fx";
            var c = f.queue(a, b), d = c.shift(), e = {};
            d === "inprogress" && (d = c.shift()), d && (b === "fx" && c.unshift("inprogress"), f._data(a, b + ".run", e), d.call(a, function() {
                f.dequeue(a, b);
            }, e)), c.length || (f.removeData(a, b + "queue " + b + ".run", !0), n(a, b, "queue"));
        }
    }), f.fn.extend({
        queue: function(a, c) {
            var d = 2;
            return typeof a != "string" && (c = a, a = "fx", d--), arguments.length < d ? f.queue(this[0], a) : c === b ? this : this.each(function() {
                var b = f.queue(this, a, c);
                a === "fx" && b[0] !== "inprogress" && f.dequeue(this, a);
            });
        },
        dequeue: function(a) {
            return this.each(function() {
                f.dequeue(this, a);
            });
        },
        delay: function(a, b) {
            return a = f.fx ? f.fx.speeds[a] || a : a, b = b || "fx", this.queue(b, function(b, c) {
                var d = setTimeout(b, a);
                c.stop = function() {
                    clearTimeout(d);
                };
            });
        },
        clearQueue: function(a) {
            return this.queue(a || "fx", []);
        },
        promise: function(a, c) {
            function m() {
                --h || d.resolveWith(e, [ e ]);
            }
            typeof a != "string" && (c = a, a = b), a = a || "fx";
            var d = f.Deferred(), e = this, g = e.length, h = 1, i = a + "defer", j = a + "queue", k = a + "mark", l;
            while (g--) if (l = f.data(e[g], i, b, !0) || (f.data(e[g], j, b, !0) || f.data(e[g], k, b, !0)) && f.data(e[g], i, f.Callbacks("once memory"), !0)) h++, l.add(m);
            return m(), d.promise(c);
        }
    });
    var o = /[\n\t\r]/g, p = /\s+/, q = /\r/g, r = /^(?:button|input)$/i, s = /^(?:button|input|object|select|textarea)$/i, t = /^a(?:rea)?$/i, u = /^(?:autofocus|autoplay|async|checked|controls|defer|disabled|hidden|loop|multiple|open|readonly|required|scoped|selected)$/i, v = f.support.getSetAttribute, w, x, y;
    f.fn.extend({
        attr: function(a, b) {
            return f.access(this, f.attr, a, b, arguments.length > 1);
        },
        removeAttr: function(a) {
            return this.each(function() {
                f.removeAttr(this, a);
            });
        },
        prop: function(a, b) {
            return f.access(this, f.prop, a, b, arguments.length > 1);
        },
        removeProp: function(a) {
            return a = f.propFix[a] || a, this.each(function() {
                try {
                    this[a] = b, delete this[a];
                } catch (c) {}
            });
        },
        addClass: function(a) {
            var b, c, d, e, g, h, i;
            if (f.isFunction(a)) return this.each(function(b) {
                f(this).addClass(a.call(this, b, this.className));
            });
            if (a && typeof a == "string") {
                b = a.split(p);
                for (c = 0, d = this.length; c < d; c++) {
                    e = this[c];
                    if (e.nodeType === 1) if (!e.className && b.length === 1) e.className = a; else {
                        g = " " + e.className + " ";
                        for (h = 0, i = b.length; h < i; h++) ~g.indexOf(" " + b[h] + " ") || (g += b[h] + " ");
                        e.className = f.trim(g);
                    }
                }
            }
            return this;
        },
        removeClass: function(a) {
            var c, d, e, g, h, i, j;
            if (f.isFunction(a)) return this.each(function(b) {
                f(this).removeClass(a.call(this, b, this.className));
            });
            if (a && typeof a == "string" || a === b) {
                c = (a || "").split(p);
                for (d = 0, e = this.length; d < e; d++) {
                    g = this[d];
                    if (g.nodeType === 1 && g.className) if (a) {
                        h = (" " + g.className + " ").replace(o, " ");
                        for (i = 0, j = c.length; i < j; i++) h = h.replace(" " + c[i] + " ", " ");
                        g.className = f.trim(h);
                    } else g.className = "";
                }
            }
            return this;
        },
        toggleClass: function(a, b) {
            var c = typeof a, d = typeof b == "boolean";
            return f.isFunction(a) ? this.each(function(c) {
                f(this).toggleClass(a.call(this, c, this.className, b), b);
            }) : this.each(function() {
                if (c === "string") {
                    var e, g = 0, h = f(this), i = b, j = a.split(p);
                    while (e = j[g++]) i = d ? i : !h.hasClass(e), h[i ? "addClass" : "removeClass"](e);
                } else if (c === "undefined" || c === "boolean") this.className && f._data(this, "__className__", this.className), this.className = this.className || a === !1 ? "" : f._data(this, "__className__") || "";
            });
        },
        hasClass: function(a) {
            var b = " " + a + " ", c = 0, d = this.length;
            for (; c < d; c++) if (this[c].nodeType === 1 && (" " + this[c].className + " ").replace(o, " ").indexOf(b) > -1) return !0;
            return !1;
        },
        val: function(a) {
            var c, d, e, g = this[0];
            if (!!arguments.length) return e = f.isFunction(a), this.each(function(d) {
                var g = f(this), h;
                if (this.nodeType === 1) {
                    e ? h = a.call(this, d, g.val()) : h = a, h == null ? h = "" : typeof h == "number" ? h += "" : f.isArray(h) && (h = f.map(h, function(a) {
                        return a == null ? "" : a + "";
                    })), c = f.valHooks[this.type] || f.valHooks[this.nodeName.toLowerCase()];
                    if (!c || !("set" in c) || c.set(this, h, "value") === b) this.value = h;
                }
            });
            if (g) return c = f.valHooks[g.type] || f.valHooks[g.nodeName.toLowerCase()], c && "get" in c && (d = c.get(g, "value")) !== b ? d : (d = g.value, typeof d == "string" ? d.replace(q, "") : d == null ? "" : d);
        }
    }), f.extend({
        valHooks: {
            option: {
                get: function(a) {
                    var b = a.attributes.value;
                    return !b || b.specified ? a.value : a.text;
                }
            },
            select: {
                get: function(a) {
                    var b, c, d, e, g = a.selectedIndex, h = [], i = a.options, j = a.type === "select-one";
                    if (g < 0) return null;
                    c = j ? g : 0, d = j ? g + 1 : i.length;
                    for (; c < d; c++) {
                        e = i[c];
                        if (e.selected && (f.support.optDisabled ? !e.disabled : e.getAttribute("disabled") === null) && (!e.parentNode.disabled || !f.nodeName(e.parentNode, "optgroup"))) {
                            b = f(e).val();
                            if (j) return b;
                            h.push(b);
                        }
                    }
                    return j && !h.length && i.length ? f(i[g]).val() : h;
                },
                set: function(a, b) {
                    var c = f.makeArray(b);
                    return f(a).find("option").each(function() {
                        this.selected = f.inArray(f(this).val(), c) >= 0;
                    }), c.length || (a.selectedIndex = -1), c;
                }
            }
        },
        attrFn: {
            val: !0,
            css: !0,
            html: !0,
            text: !0,
            data: !0,
            width: !0,
            height: !0,
            offset: !0
        },
        attr: function(a, c, d, e) {
            var g, h, i, j = a.nodeType;
            if (!!a && j !== 3 && j !== 8 && j !== 2) {
                if (e && c in f.attrFn) return f(a)[c](d);
                if (typeof a.getAttribute == "undefined") return f.prop(a, c, d);
                i = j !== 1 || !f.isXMLDoc(a), i && (c = c.toLowerCase(), h = f.attrHooks[c] || (u.test(c) ? x : w));
                if (d !== b) {
                    if (d === null) {
                        f.removeAttr(a, c);
                        return;
                    }
                    return h && "set" in h && i && (g = h.set(a, d, c)) !== b ? g : (a.setAttribute(c, "" + d), d);
                }
                return h && "get" in h && i && (g = h.get(a, c)) !== null ? g : (g = a.getAttribute(c), g === null ? b : g);
            }
        },
        removeAttr: function(a, b) {
            var c, d, e, g, h, i = 0;
            if (b && a.nodeType === 1) {
                d = b.toLowerCase().split(p), g = d.length;
                for (; i < g; i++) e = d[i], e && (c = f.propFix[e] || e, h = u.test(e), h || f.attr(a, e, ""), a.removeAttribute(v ? e : c), h && c in a && (a[c] = !1));
            }
        },
        attrHooks: {
            type: {
                set: function(a, b) {
                    if (r.test(a.nodeName) && a.parentNode) f.error("type property can't be changed"); else if (!f.support.radioValue && b === "radio" && f.nodeName(a, "input")) {
                        var c = a.value;
                        return a.setAttribute("type", b), c && (a.value = c), b;
                    }
                }
            },
            value: {
                get: function(a, b) {
                    return w && f.nodeName(a, "button") ? w.get(a, b) : b in a ? a.value : null;
                },
                set: function(a, b, c) {
                    if (w && f.nodeName(a, "button")) return w.set(a, b, c);
                    a.value = b;
                }
            }
        },
        propFix: {
            tabindex: "tabIndex",
            readonly: "readOnly",
            "for": "htmlFor",
            "class": "className",
            maxlength: "maxLength",
            cellspacing: "cellSpacing",
            cellpadding: "cellPadding",
            rowspan: "rowSpan",
            colspan: "colSpan",
            usemap: "useMap",
            frameborder: "frameBorder",
            contenteditable: "contentEditable"
        },
        prop: function(a, c, d) {
            var e, g, h, i = a.nodeType;
            if (!!a && i !== 3 && i !== 8 && i !== 2) return h = i !== 1 || !f.isXMLDoc(a), h && (c = f.propFix[c] || c, g = f.propHooks[c]), d !== b ? g && "set" in g && (e = g.set(a, d, c)) !== b ? e : a[c] = d : g && "get" in g && (e = g.get(a, c)) !== null ? e : a[c];
        },
        propHooks: {
            tabIndex: {
                get: function(a) {
                    var c = a.getAttributeNode("tabindex");
                    return c && c.specified ? parseInt(c.value, 10) : s.test(a.nodeName) || t.test(a.nodeName) && a.href ? 0 : b;
                }
            }
        }
    }), f.attrHooks.tabindex = f.propHooks.tabIndex, x = {
        get: function(a, c) {
            var d, e = f.prop(a, c);
            return e === !0 || typeof e != "boolean" && (d = a.getAttributeNode(c)) && d.nodeValue !== !1 ? c.toLowerCase() : b;
        },
        set: function(a, b, c) {
            var d;
            return b === !1 ? f.removeAttr(a, c) : (d = f.propFix[c] || c, d in a && (a[d] = !0), a.setAttribute(c, c.toLowerCase())), c;
        }
    }, v || (y = {
        name: !0,
        id: !0,
        coords: !0
    }, w = f.valHooks.button = {
        get: function(a, c) {
            var d;
            return d = a.getAttributeNode(c), d && (y[c] ? d.nodeValue !== "" : d.specified) ? d.nodeValue : b;
        },
        set: function(a, b, d) {
            var e = a.getAttributeNode(d);
            return e || (e = c.createAttribute(d), a.setAttributeNode(e)), e.nodeValue = b + "";
        }
    }, f.attrHooks.tabindex.set = w.set, f.each([ "width", "height" ], function(a, b) {
        f.attrHooks[b] = f.extend(f.attrHooks[b], {
            set: function(a, c) {
                if (c === "") return a.setAttribute(b, "auto"), c;
            }
        });
    }), f.attrHooks.contenteditable = {
        get: w.get,
        set: function(a, b, c) {
            b === "" && (b = "false"), w.set(a, b, c);
        }
    }), f.support.hrefNormalized || f.each([ "href", "src", "width", "height" ], function(a, c) {
        f.attrHooks[c] = f.extend(f.attrHooks[c], {
            get: function(a) {
                var d = a.getAttribute(c, 2);
                return d === null ? b : d;
            }
        });
    }), f.support.style || (f.attrHooks.style = {
        get: function(a) {
            return a.style.cssText.toLowerCase() || b;
        },
        set: function(a, b) {
            return a.style.cssText = "" + b;
        }
    }), f.support.optSelected || (f.propHooks.selected = f.extend(f.propHooks.selected, {
        get: function(a) {
            var b = a.parentNode;
            return b && (b.selectedIndex, b.parentNode && b.parentNode.selectedIndex), null;
        }
    })), f.support.enctype || (f.propFix.enctype = "encoding"), f.support.checkOn || f.each([ "radio", "checkbox" ], function() {
        f.valHooks[this] = {
            get: function(a) {
                return a.getAttribute("value") === null ? "on" : a.value;
            }
        };
    }), f.each([ "radio", "checkbox" ], function() {
        f.valHooks[this] = f.extend(f.valHooks[this], {
            set: function(a, b) {
                if (f.isArray(b)) return a.checked = f.inArray(f(a).val(), b) >= 0;
            }
        });
    });
    var z = /^(?:textarea|input|select)$/i, A = /^([^\.]*)?(?:\.(.+))?$/, B = /(?:^|\s)hover(\.\S+)?\b/, C = /^key/, D = /^(?:mouse|contextmenu)|click/, E = /^(?:focusinfocus|focusoutblur)$/, F = /^(\w*)(?:#([\w\-]+))?(?:\.([\w\-]+))?$/, G = function(a) {
        var b = F.exec(a);
        return b && (b[1] = (b[1] || "").toLowerCase(), b[3] = b[3] && new RegExp("(?:^|\\s)" + b[3] + "(?:\\s|$)")), b;
    }, H = function(a, b) {
        var c = a.attributes || {};
        return (!b[1] || a.nodeName.toLowerCase() === b[1]) && (!b[2] || (c.id || {}).value === b[2]) && (!b[3] || b[3].test((c["class"] || {}).value));
    }, I = function(a) {
        return f.event.special.hover ? a : a.replace(B, "mouseenter$1 mouseleave$1");
    };
    f.event = {
        add: function(a, c, d, e, g) {
            var h, i, j, k, l, m, n, o, p, q, r, s;
            if (!(a.nodeType === 3 || a.nodeType === 8 || !c || !d || !(h = f._data(a)))) {
                d.handler && (p = d, d = p.handler, g = p.selector), d.guid || (d.guid = f.guid++), j = h.events, j || (h.events = j = {}), i = h.handle, i || (h.handle = i = function(a) {
                    return typeof f == "undefined" || !!a && f.event.triggered === a.type ? b : f.event.dispatch.apply(i.elem, arguments);
                }, i.elem = a), c = f.trim(I(c)).split(" ");
                for (k = 0; k < c.length; k++) {
                    l = A.exec(c[k]) || [], m = l[1], n = (l[2] || "").split(".").sort(), s = f.event.special[m] || {}, m = (g ? s.delegateType : s.bindType) || m, s = f.event.special[m] || {}, o = f.extend({
                        type: m,
                        origType: l[1],
                        data: e,
                        handler: d,
                        guid: d.guid,
                        selector: g,
                        quick: g && G(g),
                        namespace: n.join(".")
                    }, p), r = j[m];
                    if (!r) {
                        r = j[m] = [], r.delegateCount = 0;
                        if (!s.setup || s.setup.call(a, e, n, i) === !1) a.addEventListener ? a.addEventListener(m, i, !1) : a.attachEvent && a.attachEvent("on" + m, i);
                    }
                    s.add && (s.add.call(a, o), o.handler.guid || (o.handler.guid = d.guid)), g ? r.splice(r.delegateCount++, 0, o) : r.push(o), f.event.global[m] = !0;
                }
                a = null;
            }
        },
        global: {},
        remove: function(a, b, c, d, e) {
            var g = f.hasData(a) && f._data(a), h, i, j, k, l, m, n, o, p, q, r, s;
            if (!!g && !!(o = g.events)) {
                b = f.trim(I(b || "")).split(" ");
                for (h = 0; h < b.length; h++) {
                    i = A.exec(b[h]) || [], j = k = i[1], l = i[2];
                    if (!j) {
                        for (j in o) f.event.remove(a, j + b[h], c, d, !0);
                        continue;
                    }
                    p = f.event.special[j] || {}, j = (d ? p.delegateType : p.bindType) || j, r = o[j] || [], m = r.length, l = l ? new RegExp("(^|\\.)" + l.split(".").sort().join("\\.(?:.*\\.)?") + "(\\.|$)") : null;
                    for (n = 0; n < r.length; n++) s = r[n], (e || k === s.origType) && (!c || c.guid === s.guid) && (!l || l.test(s.namespace)) && (!d || d === s.selector || d === "**" && s.selector) && (r.splice(n--, 1), s.selector && r.delegateCount--, p.remove && p.remove.call(a, s));
                    r.length === 0 && m !== r.length && ((!p.teardown || p.teardown.call(a, l) === !1) && f.removeEvent(a, j, g.handle), delete o[j]);
                }
                f.isEmptyObject(o) && (q = g.handle, q && (q.elem = null), f.removeData(a, [ "events", "handle" ], !0));
            }
        },
        customEvent: {
            getData: !0,
            setData: !0,
            changeData: !0
        },
        trigger: function(c, d, e, g) {
            if (!e || e.nodeType !== 3 && e.nodeType !== 8) {
                var h = c.type || c, i = [], j, k, l, m, n, o, p, q, r, s;
                if (E.test(h + f.event.triggered)) return;
                h.indexOf("!") >= 0 && (h = h.slice(0, -1), k = !0), h.indexOf(".") >= 0 && (i = h.split("."), h = i.shift(), i.sort());
                if ((!e || f.event.customEvent[h]) && !f.event.global[h]) return;
                c = typeof c == "object" ? c[f.expando] ? c : new f.Event(h, c) : new f.Event(h), c.type = h, c.isTrigger = !0, c.exclusive = k, c.namespace = i.join("."), c.namespace_re = c.namespace ? new RegExp("(^|\\.)" + i.join("\\.(?:.*\\.)?") + "(\\.|$)") : null, o = h.indexOf(":") < 0 ? "on" + h : "";
                if (!e) {
                    j = f.cache;
                    for (l in j) j[l].events && j[l].events[h] && f.event.trigger(c, d, j[l].handle.elem, !0);
                    return;
                }
                c.result = b, c.target || (c.target = e), d = d != null ? f.makeArray(d) : [], d.unshift(c), p = f.event.special[h] || {};
                if (p.trigger && p.trigger.apply(e, d) === !1) return;
                r = [ [ e, p.bindType || h ] ];
                if (!g && !p.noBubble && !f.isWindow(e)) {
                    s = p.delegateType || h, m = E.test(s + h) ? e : e.parentNode, n = null;
                    for (; m; m = m.parentNode) r.push([ m, s ]), n = m;
                    n && n === e.ownerDocument && r.push([ n.defaultView || n.parentWindow || a, s ]);
                }
                for (l = 0; l < r.length && !c.isPropagationStopped(); l++) m = r[l][0], c.type = r[l][1], q = (f._data(m, "events") || {})[c.type] && f._data(m, "handle"), q && q.apply(m, d), q = o && m[o], q && f.acceptData(m) && q.apply(m, d) === !1 && c.preventDefault();
                return c.type = h, !g && !c.isDefaultPrevented() && (!p._default || p._default.apply(e.ownerDocument, d) === !1) && (h !== "click" || !f.nodeName(e, "a")) && f.acceptData(e) && o && e[h] && (h !== "focus" && h !== "blur" || c.target.offsetWidth !== 0) && !f.isWindow(e) && (n = e[o], n && (e[o] = null), f.event.triggered = h, e[h](), f.event.triggered = b, n && (e[o] = n)), c.result;
            }
        },
        dispatch: function(c) {
            c = f.event.fix(c || a.event);
            var d = (f._data(this, "events") || {})[c.type] || [], e = d.delegateCount, g = [].slice.call(arguments, 0), h = !c.exclusive && !c.namespace, i = f.event.special[c.type] || {}, j = [], k, l, m, n, o, p, q, r, s, t, u;
            g[0] = c, c.delegateTarget = this;
            if (!i.preDispatch || i.preDispatch.call(this, c) !== !1) {
                if (e && (!c.button || c.type !== "click")) {
                    n = f(this), n.context = this.ownerDocument || this;
                    for (m = c.target; m != this; m = m.parentNode || this) if (m.disabled !== !0) {
                        p = {}, r = [], n[0] = m;
                        for (k = 0; k < e; k++) s = d[k], t = s.selector, p[t] === b && (p[t] = s.quick ? H(m, s.quick) : n.is(t)), p[t] && r.push(s);
                        r.length && j.push({
                            elem: m,
                            matches: r
                        });
                    }
                }
                d.length > e && j.push({
                    elem: this,
                    matches: d.slice(e)
                });
                for (k = 0; k < j.length && !c.isPropagationStopped(); k++) {
                    q = j[k], c.currentTarget = q.elem;
                    for (l = 0; l < q.matches.length && !c.isImmediatePropagationStopped(); l++) {
                        s = q.matches[l];
                        if (h || !c.namespace && !s.namespace || c.namespace_re && c.namespace_re.test(s.namespace)) c.data = s.data, c.handleObj = s, o = ((f.event.special[s.origType] || {}).handle || s.handler).apply(q.elem, g), o !== b && (c.result = o, o === !1 && (c.preventDefault(), c.stopPropagation()));
                    }
                }
                return i.postDispatch && i.postDispatch.call(this, c), c.result;
            }
        },
        props: "attrChange attrName relatedNode srcElement altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),
        fixHooks: {},
        keyHooks: {
            props: "char charCode key keyCode".split(" "),
            filter: function(a, b) {
                return a.which == null && (a.which = b.charCode != null ? b.charCode : b.keyCode), a;
            }
        },
        mouseHooks: {
            props: "button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement".split(" "),
            filter: function(a, d) {
                var e, f, g, h = d.button, i = d.fromElement;
                return a.pageX == null && d.clientX != null && (e = a.target.ownerDocument || c, f = e.documentElement, g = e.body, a.pageX = d.clientX + (f && f.scrollLeft || g && g.scrollLeft || 0) - (f && f.clientLeft || g && g.clientLeft || 0), a.pageY = d.clientY + (f && f.scrollTop || g && g.scrollTop || 0) - (f && f.clientTop || g && g.clientTop || 0)), !a.relatedTarget && i && (a.relatedTarget = i === a.target ? d.toElement : i), !a.which && h !== b && (a.which = h & 1 ? 1 : h & 2 ? 3 : h & 4 ? 2 : 0), a;
            }
        },
        fix: function(a) {
            if (a[f.expando]) return a;
            var d, e, g = a, h = f.event.fixHooks[a.type] || {}, i = h.props ? this.props.concat(h.props) : this.props;
            a = f.Event(g);
            for (d = i.length; d; ) e = i[--d], a[e] = g[e];
            return a.target || (a.target = g.srcElement || c), a.target.nodeType === 3 && (a.target = a.target.parentNode), a.metaKey === b && (a.metaKey = a.ctrlKey), h.filter ? h.filter(a, g) : a;
        },
        special: {
            ready: {
                setup: f.bindReady
            },
            load: {
                noBubble: !0
            },
            focus: {
                delegateType: "focusin"
            },
            blur: {
                delegateType: "focusout"
            },
            beforeunload: {
                setup: function(a, b, c) {
                    f.isWindow(this) && (this.onbeforeunload = c);
                },
                teardown: function(a, b) {
                    this.onbeforeunload === b && (this.onbeforeunload = null);
                }
            }
        },
        simulate: function(a, b, c, d) {
            var e = f.extend(new f.Event, c, {
                type: a,
                isSimulated: !0,
                originalEvent: {}
            });
            d ? f.event.trigger(e, null, b) : f.event.dispatch.call(b, e), e.isDefaultPrevented() && c.preventDefault();
        }
    }, f.event.handle = f.event.dispatch, f.removeEvent = c.removeEventListener ? function(a, b, c) {
        a.removeEventListener && a.removeEventListener(b, c, !1);
    } : function(a, b, c) {
        a.detachEvent && a.detachEvent("on" + b, c);
    }, f.Event = function(a, b) {
        if (!(this instanceof f.Event)) return new f.Event(a, b);
        a && a.type ? (this.originalEvent = a, this.type = a.type, this.isDefaultPrevented = a.defaultPrevented || a.returnValue === !1 || a.getPreventDefault && a.getPreventDefault() ? K : J) : this.type = a, b && f.extend(this, b), this.timeStamp = a && a.timeStamp || f.now(), this[f.expando] = !0;
    }, f.Event.prototype = {
        preventDefault: function() {
            this.isDefaultPrevented = K;
            var a = this.originalEvent;
            !a || (a.preventDefault ? a.preventDefault() : a.returnValue = !1);
        },
        stopPropagation: function() {
            this.isPropagationStopped = K;
            var a = this.originalEvent;
            !a || (a.stopPropagation && a.stopPropagation(), a.cancelBubble = !0);
        },
        stopImmediatePropagation: function() {
            this.isImmediatePropagationStopped = K, this.stopPropagation();
        },
        isDefaultPrevented: J,
        isPropagationStopped: J,
        isImmediatePropagationStopped: J
    }, f.each({
        mouseenter: "mouseover",
        mouseleave: "mouseout"
    }, function(a, b) {
        f.event.special[a] = {
            delegateType: b,
            bindType: b,
            handle: function(a) {
                var c = this, d = a.relatedTarget, e = a.handleObj, g = e.selector, h;
                if (!d || d !== c && !f.contains(c, d)) a.type = e.origType, h = e.handler.apply(this, arguments), a.type = b;
                return h;
            }
        };
    }), f.support.submitBubbles || (f.event.special.submit = {
        setup: function() {
            if (f.nodeName(this, "form")) return !1;
            f.event.add(this, "click._submit keypress._submit", function(a) {
                var c = a.target, d = f.nodeName(c, "input") || f.nodeName(c, "button") ? c.form : b;
                d && !d._submit_attached && (f.event.add(d, "submit._submit", function(a) {
                    a._submit_bubble = !0;
                }), d._submit_attached = !0);
            });
        },
        postDispatch: function(a) {
            a._submit_bubble && (delete a._submit_bubble, this.parentNode && !a.isTrigger && f.event.simulate("submit", this.parentNode, a, !0));
        },
        teardown: function() {
            if (f.nodeName(this, "form")) return !1;
            f.event.remove(this, "._submit");
        }
    }), f.support.changeBubbles || (f.event.special.change = {
        setup: function() {
            if (z.test(this.nodeName)) {
                if (this.type === "checkbox" || this.type === "radio") f.event.add(this, "propertychange._change", function(a) {
                    a.originalEvent.propertyName === "checked" && (this._just_changed = !0);
                }), f.event.add(this, "click._change", function(a) {
                    this._just_changed && !a.isTrigger && (this._just_changed = !1, f.event.simulate("change", this, a, !0));
                });
                return !1;
            }
            f.event.add(this, "beforeactivate._change", function(a) {
                var b = a.target;
                z.test(b.nodeName) && !b._change_attached && (f.event.add(b, "change._change", function(a) {
                    this.parentNode && !a.isSimulated && !a.isTrigger && f.event.simulate("change", this.parentNode, a, !0);
                }), b._change_attached = !0);
            });
        },
        handle: function(a) {
            var b = a.target;
            if (this !== b || a.isSimulated || a.isTrigger || b.type !== "radio" && b.type !== "checkbox") return a.handleObj.handler.apply(this, arguments);
        },
        teardown: function() {
            return f.event.remove(this, "._change"), z.test(this.nodeName);
        }
    }), f.support.focusinBubbles || f.each({
        focus: "focusin",
        blur: "focusout"
    }, function(a, b) {
        var d = 0, e = function(a) {
            f.event.simulate(b, a.target, f.event.fix(a), !0);
        };
        f.event.special[b] = {
            setup: function() {
                d++ === 0 && c.addEventListener(a, e, !0);
            },
            teardown: function() {
                --d === 0 && c.removeEventListener(a, e, !0);
            }
        };
    }), f.fn.extend({
        on: function(a, c, d, e, g) {
            var h, i;
            if (typeof a == "object") {
                typeof c != "string" && (d = d || c, c = b);
                for (i in a) this.on(i, c, d, a[i], g);
                return this;
            }
            d == null && e == null ? (e = c, d = c = b) : e == null && (typeof c == "string" ? (e = d, d = b) : (e = d, d = c, c = b));
            if (e === !1) e = J; else if (!e) return this;
            return g === 1 && (h = e, e = function(a) {
                return f().off(a), h.apply(this, arguments);
            }, e.guid = h.guid || (h.guid = f.guid++)), this.each(function() {
                f.event.add(this, a, e, d, c);
            });
        },
        one: function(a, b, c, d) {
            return this.on(a, b, c, d, 1);
        },
        off: function(a, c, d) {
            if (a && a.preventDefault && a.handleObj) {
                var e = a.handleObj;
                return f(a.delegateTarget).off(e.namespace ? e.origType + "." + e.namespace : e.origType, e.selector, e.handler), this;
            }
            if (typeof a == "object") {
                for (var g in a) this.off(g, c, a[g]);
                return this;
            }
            if (c === !1 || typeof c == "function") d = c, c = b;
            return d === !1 && (d = J), this.each(function() {
                f.event.remove(this, a, d, c);
            });
        },
        bind: function(a, b, c) {
            return this.on(a, null, b, c);
        },
        unbind: function(a, b) {
            return this.off(a, null, b);
        },
        live: function(a, b, c) {
            return f(this.context).on(a, this.selector, b, c), this;
        },
        die: function(a, b) {
            return f(this.context).off(a, this.selector || "**", b), this;
        },
        delegate: function(a, b, c, d) {
            return this.on(b, a, c, d);
        },
        undelegate: function(a, b, c) {
            return arguments.length == 1 ? this.off(a, "**") : this.off(b, a, c);
        },
        trigger: function(a, b) {
            return this.each(function() {
                f.event.trigger(a, b, this);
            });
        },
        triggerHandler: function(a, b) {
            if (this[0]) return f.event.trigger(a, b, this[0], !0);
        },
        toggle: function(a) {
            var b = arguments, c = a.guid || f.guid++, d = 0, e = function(c) {
                var e = (f._data(this, "lastToggle" + a.guid) || 0) % d;
                return f._data(this, "lastToggle" + a.guid, e + 1), c.preventDefault(), b[e].apply(this, arguments) || !1;
            };
            e.guid = c;
            while (d < b.length) b[d++].guid = c;
            return this.click(e);
        },
        hover: function(a, b) {
            return this.mouseenter(a).mouseleave(b || a);
        }
    }), f.each("blur focus focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup error contextmenu".split(" "), function(a, b) {
        f.fn[b] = function(a, c) {
            return c == null && (c = a, a = null), arguments.length > 0 ? this.on(b, null, a, c) : this.trigger(b);
        }, f.attrFn && (f.attrFn[b] = !0), C.test(b) && (f.event.fixHooks[b] = f.event.keyHooks), D.test(b) && (f.event.fixHooks[b] = f.event.mouseHooks);
    }), function() {
        function x(a, b, c, e, f, g) {
            for (var h = 0, i = e.length; h < i; h++) {
                var j = e[h];
                if (j) {
                    var k = !1;
                    j = j[a];
                    while (j) {
                        if (j[d] === c) {
                            k = e[j.sizset];
                            break;
                        }
                        if (j.nodeType === 1) {
                            g || (j[d] = c, j.sizset = h);
                            if (typeof b != "string") {
                                if (j === b) {
                                    k = !0;
                                    break;
                                }
                            } else if (m.filter(b, [ j ]).length > 0) {
                                k = j;
                                break;
                            }
                        }
                        j = j[a];
                    }
                    e[h] = k;
                }
            }
        }
        function w(a, b, c, e, f, g) {
            for (var h = 0, i = e.length; h < i; h++) {
                var j = e[h];
                if (j) {
                    var k = !1;
                    j = j[a];
                    while (j) {
                        if (j[d] === c) {
                            k = e[j.sizset];
                            break;
                        }
                        j.nodeType === 1 && !g && (j[d] = c, j.sizset = h);
                        if (j.nodeName.toLowerCase() === b) {
                            k = j;
                            break;
                        }
                        j = j[a];
                    }
                    e[h] = k;
                }
            }
        }
        var a = /((?:\((?:\([^()]+\)|[^()]+)+\)|\[(?:\[[^\[\]]*\]|['"][^'"]*['"]|[^\[\]'"]+)+\]|\\.|[^ >+~,(\[\\]+)+|[>+~])(\s*,\s*)?((?:.|\r|\n)*)/g, d = "sizcache" + (Math.random() + "").replace(".", ""), e = 0, g = Object.prototype.toString, h = !1, i = !0, j = /\\/g, k = /\r\n/g, l = /\W/;
        [ 0, 0 ].sort(function() {
            return i = !1, 0;
        });
        var m = function(b, d, e, f) {
            e = e || [], d = d || c;
            var h = d;
            if (d.nodeType !== 1 && d.nodeType !== 9) return [];
            if (!b || typeof b != "string") return e;
            var i, j, k, l, n, q, r, t, u = !0, v = m.isXML(d), w = [], x = b;
            do {
                a.exec(""), i = a.exec(x);
                if (i) {
                    x = i[3], w.push(i[1]);
                    if (i[2]) {
                        l = i[3];
                        break;
                    }
                }
            } while (i);
            if (w.length > 1 && p.exec(b)) if (w.length === 2 && o.relative[w[0]]) j = y(w[0] + w[1], d, f); else {
                j = o.relative[w[0]] ? [ d ] : m(w.shift(), d);
                while (w.length) b = w.shift(), o.relative[b] && (b += w.shift()), j = y(b, j, f);
            } else {
                !f && w.length > 1 && d.nodeType === 9 && !v && o.match.ID.test(w[0]) && !o.match.ID.test(w[w.length - 1]) && (n = m.find(w.shift(), d, v), d = n.expr ? m.filter(n.expr, n.set)[0] : n.set[0]);
                if (d) {
                    n = f ? {
                        expr: w.pop(),
                        set: s(f)
                    } : m.find(w.pop(), w.length !== 1 || w[0] !== "~" && w[0] !== "+" || !d.parentNode ? d : d.parentNode, v), j = n.expr ? m.filter(n.expr, n.set) : n.set, w.length > 0 ? k = s(j) : u = !1;
                    while (w.length) q = w.pop(), r = q, o.relative[q] ? r = w.pop() : q = "", r == null && (r = d), o.relative[q](k, r, v);
                } else k = w = [];
            }
            k || (k = j), k || m.error(q || b);
            if (g.call(k) === "[object Array]") if (!u) e.push.apply(e, k); else if (d && d.nodeType === 1) for (t = 0; k[t] != null; t++) k[t] && (k[t] === !0 || k[t].nodeType === 1 && m.contains(d, k[t])) && e.push(j[t]); else for (t = 0; k[t] != null; t++) k[t] && k[t].nodeType === 1 && e.push(j[t]); else s(k, e);
            return l && (m(l, h, e, f), m.uniqueSort(e)), e;
        };
        m.uniqueSort = function(a) {
            if (u) {
                h = i, a.sort(u);
                if (h) for (var b = 1; b < a.length; b++) a[b] === a[b - 1] && a.splice(b--, 1);
            }
            return a;
        }, m.matches = function(a, b) {
            return m(a, null, null, b);
        }, m.matchesSelector = function(a, b) {
            return m(b, null, null, [ a ]).length > 0;
        }, m.find = function(a, b, c) {
            var d, e, f, g, h, i;
            if (!a) return [];
            for (e = 0, f = o.order.length; e < f; e++) {
                h = o.order[e];
                if (g = o.leftMatch[h].exec(a)) {
                    i = g[1], g.splice(1, 1);
                    if (i.substr(i.length - 1) !== "\\") {
                        g[1] = (g[1] || "").replace(j, ""), d = o.find[h](g, b, c);
                        if (d != null) {
                            a = a.replace(o.match[h], "");
                            break;
                        }
                    }
                }
            }
            return d || (d = typeof b.getElementsByTagName != "undefined" ? b.getElementsByTagName("*") : []), {
                set: d,
                expr: a
            };
        }, m.filter = function(a, c, d, e) {
            var f, g, h, i, j, k, l, n, p, q = a, r = [], s = c, t = c && c[0] && m.isXML(c[0]);
            while (a && c.length) {
                for (h in o.filter) if ((f = o.leftMatch[h].exec(a)) != null && f[2]) {
                    k = o.filter[h], l = f[1], g = !1, f.splice(1, 1);
                    if (l.substr(l.length - 1) === "\\") continue;
                    s === r && (r = []);
                    if (o.preFilter[h]) {
                        f = o.preFilter[h](f, s, d, r, e, t);
                        if (!f) g = i = !0; else if (f === !0) continue;
                    }
                    if (f) for (n = 0; (j = s[n]) != null; n++) j && (i = k(j, f, n, s), p = e ^ i, d && i != null ? p ? g = !0 : s[n] = !1 : p && (r.push(j), g = !0));
                    if (i !== b) {
                        d || (s = r), a = a.replace(o.match[h], "");
                        if (!g) return [];
                        break;
                    }
                }
                if (a === q) {
                    if (g != null) break;
                    m.error(a);
                }
                q = a;
            }
            return s;
        }, m.error = function(a) {
            throw new Error("Syntax error, unrecognized expression: " + a);
        };
        var n = m.getText = function(a) {
            var b, c, d = a.nodeType, e = "";
            if (d) {
                if (d === 1 || d === 9 || d === 11) {
                    if (typeof a.textContent == "string") return a.textContent;
                    if (typeof a.innerText == "string") return a.innerText.replace(k, "");
                    for (a = a.firstChild; a; a = a.nextSibling) e += n(a);
                } else if (d === 3 || d === 4) return a.nodeValue;
            } else for (b = 0; c = a[b]; b++) c.nodeType !== 8 && (e += n(c));
            return e;
        }, o = m.selectors = {
            order: [ "ID", "NAME", "TAG" ],
            match: {
                ID: /#((?:[\w\u00c0-\uFFFF\-]|\\.)+)/,
                CLASS: /\.((?:[\w\u00c0-\uFFFF\-]|\\.)+)/,
                NAME: /\[name=['"]*((?:[\w\u00c0-\uFFFF\-]|\\.)+)['"]*\]/,
                ATTR: /\[\s*((?:[\w\u00c0-\uFFFF\-]|\\.)+)\s*(?:(\S?=)\s*(?:(['"])(.*?)\3|(#?(?:[\w\u00c0-\uFFFF\-]|\\.)*)|)|)\s*\]/,
                TAG: /^((?:[\w\u00c0-\uFFFF\*\-]|\\.)+)/,
                CHILD: /:(only|nth|last|first)-child(?:\(\s*(even|odd|(?:[+\-]?\d+|(?:[+\-]?\d*)?n\s*(?:[+\-]\s*\d+)?))\s*\))?/,
                POS: /:(nth|eq|gt|lt|first|last|even|odd)(?:\((\d*)\))?(?=[^\-]|$)/,
                PSEUDO: /:((?:[\w\u00c0-\uFFFF\-]|\\.)+)(?:\((['"]?)((?:\([^\)]+\)|[^\(\)]*)+)\2\))?/
            },
            leftMatch: {},
            attrMap: {
                "class": "className",
                "for": "htmlFor"
            },
            attrHandle: {
                href: function(a) {
                    return a.getAttribute("href");
                },
                type: function(a) {
                    return a.getAttribute("type");
                }
            },
            relative: {
                "+": function(a, b) {
                    var c = typeof b == "string", d = c && !l.test(b), e = c && !d;
                    d && (b = b.toLowerCase());
                    for (var f = 0, g = a.length, h; f < g; f++) if (h = a[f]) {
                        while ((h = h.previousSibling) && h.nodeType !== 1) ;
                        a[f] = e || h && h.nodeName.toLowerCase() === b ? h || !1 : h === b;
                    }
                    e && m.filter(b, a, !0);
                },
                ">": function(a, b) {
                    var c, d = typeof b == "string", e = 0, f = a.length;
                    if (d && !l.test(b)) {
                        b = b.toLowerCase();
                        for (; e < f; e++) {
                            c = a[e];
                            if (c) {
                                var g = c.parentNode;
                                a[e] = g.nodeName.toLowerCase() === b ? g : !1;
                            }
                        }
                    } else {
                        for (; e < f; e++) c = a[e], c && (a[e] = d ? c.parentNode : c.parentNode === b);
                        d && m.filter(b, a, !0);
                    }
                },
                "": function(a, b, c) {
                    var d, f = e++, g = x;
                    typeof b == "string" && !l.test(b) && (b = b.toLowerCase(), d = b, g = w), g("parentNode", b, f, a, d, c);
                },
                "~": function(a, b, c) {
                    var d, f = e++, g = x;
                    typeof b == "string" && !l.test(b) && (b = b.toLowerCase(), d = b, g = w), g("previousSibling", b, f, a, d, c);
                }
            },
            find: {
                ID: function(a, b, c) {
                    if (typeof b.getElementById != "undefined" && !c) {
                        var d = b.getElementById(a[1]);
                        return d && d.parentNode ? [ d ] : [];
                    }
                },
                NAME: function(a, b) {
                    if (typeof b.getElementsByName != "undefined") {
                        var c = [], d = b.getElementsByName(a[1]);
                        for (var e = 0, f = d.length; e < f; e++) d[e].getAttribute("name") === a[1] && c.push(d[e]);
                        return c.length === 0 ? null : c;
                    }
                },
                TAG: function(a, b) {
                    if (typeof b.getElementsByTagName != "undefined") return b.getElementsByTagName(a[1]);
                }
            },
            preFilter: {
                CLASS: function(a, b, c, d, e, f) {
                    a = " " + a[1].replace(j, "") + " ";
                    if (f) return a;
                    for (var g = 0, h; (h = b[g]) != null; g++) h && (e ^ (h.className && (" " + h.className + " ").replace(/[\t\n\r]/g, " ").indexOf(a) >= 0) ? c || d.push(h) : c && (b[g] = !1));
                    return !1;
                },
                ID: function(a) {
                    return a[1].replace(j, "");
                },
                TAG: function(a, b) {
                    return a[1].replace(j, "").toLowerCase();
                },
                CHILD: function(a) {
                    if (a[1] === "nth") {
                        a[2] || m.error(a[0]), a[2] = a[2].replace(/^\+|\s*/g, "");
                        var b = /(-?)(\d*)(?:n([+\-]?\d*))?/.exec(a[2] === "even" && "2n" || a[2] === "odd" && "2n+1" || !/\D/.test(a[2]) && "0n+" + a[2] || a[2]);
                        a[2] = b[1] + (b[2] || 1) - 0, a[3] = b[3] - 0;
                    } else a[2] && m.error(a[0]);
                    return a[0] = e++, a;
                },
                ATTR: function(a, b, c, d, e, f) {
                    var g = a[1] = a[1].replace(j, "");
                    return !f && o.attrMap[g] && (a[1] = o.attrMap[g]), a[4] = (a[4] || a[5] || "").replace(j, ""), a[2] === "~=" && (a[4] = " " + a[4] + " "), a;
                },
                PSEUDO: function(b, c, d, e, f) {
                    if (b[1] === "not") {
                        if (!((a.exec(b[3]) || "").length > 1 || /^\w/.test(b[3]))) {
                            var g = m.filter(b[3], c, d, !0 ^ f);
                            return d || e.push.apply(e, g), !1;
                        }
                        b[3] = m(b[3], null, null, c);
                    } else if (o.match.POS.test(b[0]) || o.match.CHILD.test(b[0])) return !0;
                    return b;
                },
                POS: function(a) {
                    return a.unshift(!0), a;
                }
            },
            filters: {
                enabled: function(a) {
                    return a.disabled === !1 && a.type !== "hidden";
                },
                disabled: function(a) {
                    return a.disabled === !0;
                },
                checked: function(a) {
                    return a.checked === !0;
                },
                selected: function(a) {
                    return a.parentNode && a.parentNode.selectedIndex, a.selected === !0;
                },
                parent: function(a) {
                    return !!a.firstChild;
                },
                empty: function(a) {
                    return !a.firstChild;
                },
                has: function(a, b, c) {
                    return !!m(c[3], a).length;
                },
                header: function(a) {
                    return /h\d/i.test(a.nodeName);
                },
                text: function(a) {
                    var b = a.getAttribute("type"), c = a.type;
                    return a.nodeName.toLowerCase() === "input" && "text" === c && (b === c || b === null);
                },
                radio: function(a) {
                    return a.nodeName.toLowerCase() === "input" && "radio" === a.type;
                },
                checkbox: function(a) {
                    return a.nodeName.toLowerCase() === "input" && "checkbox" === a.type;
                },
                file: function(a) {
                    return a.nodeName.toLowerCase() === "input" && "file" === a.type;
                },
                password: function(a) {
                    return a.nodeName.toLowerCase() === "input" && "password" === a.type;
                },
                submit: function(a) {
                    var b = a.nodeName.toLowerCase();
                    return (b === "input" || b === "button") && "submit" === a.type;
                },
                image: function(a) {
                    return a.nodeName.toLowerCase() === "input" && "image" === a.type;
                },
                reset: function(a) {
                    var b = a.nodeName.toLowerCase();
                    return (b === "input" || b === "button") && "reset" === a.type;
                },
                button: function(a) {
                    var b = a.nodeName.toLowerCase();
                    return b === "input" && "button" === a.type || b === "button";
                },
                input: function(a) {
                    return /input|select|textarea|button/i.test(a.nodeName);
                },
                focus: function(a) {
                    return a === a.ownerDocument.activeElement;
                }
            },
            setFilters: {
                first: function(a, b) {
                    return b === 0;
                },
                last: function(a, b, c, d) {
                    return b === d.length - 1;
                },
                even: function(a, b) {
                    return b % 2 === 0;
                },
                odd: function(a, b) {
                    return b % 2 === 1;
                },
                lt: function(a, b, c) {
                    return b < c[3] - 0;
                },
                gt: function(a, b, c) {
                    return b > c[3] - 0;
                },
                nth: function(a, b, c) {
                    return c[3] - 0 === b;
                },
                eq: function(a, b, c) {
                    return c[3] - 0 === b;
                }
            },
            filter: {
                PSEUDO: function(a, b, c, d) {
                    var e = b[1], f = o.filters[e];
                    if (f) return f(a, c, b, d);
                    if (e === "contains") return (a.textContent || a.innerText || n([ a ]) || "").indexOf(b[3]) >= 0;
                    if (e === "not") {
                        var g = b[3];
                        for (var h = 0, i = g.length; h < i; h++) if (g[h] === a) return !1;
                        return !0;
                    }
                    m.error(e);
                },
                CHILD: function(a, b) {
                    var c, e, f, g, h, i, j, k = b[1], l = a;
                    switch (k) {
                      case "only":
                      case "first":
                        while (l = l.previousSibling) if (l.nodeType === 1) return !1;
                        if (k === "first") return !0;
                        l = a;
                      case "last":
                        while (l = l.nextSibling) if (l.nodeType === 1) return !1;
                        return !0;
                      case "nth":
                        c = b[2], e = b[3];
                        if (c === 1 && e === 0) return !0;
                        f = b[0], g = a.parentNode;
                        if (g && (g[d] !== f || !a.nodeIndex)) {
                            i = 0;
                            for (l = g.firstChild; l; l = l.nextSibling) l.nodeType === 1 && (l.nodeIndex = ++i);
                            g[d] = f;
                        }
                        return j = a.nodeIndex - e, c === 0 ? j === 0 : j % c === 0 && j / c >= 0;
                    }
                },
                ID: function(a, b) {
                    return a.nodeType === 1 && a.getAttribute("id") === b;
                },
                TAG: function(a, b) {
                    return b === "*" && a.nodeType === 1 || !!a.nodeName && a.nodeName.toLowerCase() === b;
                },
                CLASS: function(a, b) {
                    return (" " + (a.className || a.getAttribute("class")) + " ").indexOf(b) > -1;
                },
                ATTR: function(a, b) {
                    var c = b[1], d = m.attr ? m.attr(a, c) : o.attrHandle[c] ? o.attrHandle[c](a) : a[c] != null ? a[c] : a.getAttribute(c), e = d + "", f = b[2], g = b[4];
                    return d == null ? f === "!=" : !f && m.attr ? d != null : f === "=" ? e === g : f === "*=" ? e.indexOf(g) >= 0 : f === "~=" ? (" " + e + " ").indexOf(g) >= 0 : g ? f === "!=" ? e !== g : f === "^=" ? e.indexOf(g) === 0 : f === "$=" ? e.substr(e.length - g.length) === g : f === "|=" ? e === g || e.substr(0, g.length + 1) === g + "-" : !1 : e && d !== !1;
                },
                POS: function(a, b, c, d) {
                    var e = b[2], f = o.setFilters[e];
                    if (f) return f(a, c, b, d);
                }
            }
        }, p = o.match.POS, q = function(a, b) {
            return "\\" + (b - 0 + 1);
        };
        for (var r in o.match) o.match[r] = new RegExp(o.match[r].source + /(?![^\[]*\])(?![^\(]*\))/.source), o.leftMatch[r] = new RegExp(/(^(?:.|\r|\n)*?)/.source + o.match[r].source.replace(/\\(\d+)/g, q));
        o.match.globalPOS = p;
        var s = function(a, b) {
            return a = Array.prototype.slice.call(a, 0), b ? (b.push.apply(b, a), b) : a;
        };
        try {
            Array.prototype.slice.call(c.documentElement.childNodes, 0)[0].nodeType;
        } catch (t) {
            s = function(a, b) {
                var c = 0, d = b || [];
                if (g.call(a) === "[object Array]") Array.prototype.push.apply(d, a); else if (typeof a.length == "number") for (var e = a.length; c < e; c++) d.push(a[c]); else for (; a[c]; c++) d.push(a[c]);
                return d;
            };
        }
        var u, v;
        c.documentElement.compareDocumentPosition ? u = function(a, b) {
            return a === b ? (h = !0, 0) : !a.compareDocumentPosition || !b.compareDocumentPosition ? a.compareDocumentPosition ? -1 : 1 : a.compareDocumentPosition(b) & 4 ? -1 : 1;
        } : (u = function(a, b) {
            if (a === b) return h = !0, 0;
            if (a.sourceIndex && b.sourceIndex) return a.sourceIndex - b.sourceIndex;
            var c, d, e = [], f = [], g = a.parentNode, i = b.parentNode, j = g;
            if (g === i) return v(a, b);
            if (!g) return -1;
            if (!i) return 1;
            while (j) e.unshift(j), j = j.parentNode;
            j = i;
            while (j) f.unshift(j), j = j.parentNode;
            c = e.length, d = f.length;
            for (var k = 0; k < c && k < d; k++) if (e[k] !== f[k]) return v(e[k], f[k]);
            return k === c ? v(a, f[k], -1) : v(e[k], b, 1);
        }, v = function(a, b, c) {
            if (a === b) return c;
            var d = a.nextSibling;
            while (d) {
                if (d === b) return -1;
                d = d.nextSibling;
            }
            return 1;
        }), function() {
            var a = c.createElement("div"), d = "script" + (new Date).getTime(), e = c.documentElement;
            a.innerHTML = "<a name='" + d + "'/>", e.insertBefore(a, e.firstChild), c.getElementById(d) && (o.find.ID = function(a, c, d) {
                if (typeof c.getElementById != "undefined" && !d) {
                    var e = c.getElementById(a[1]);
                    return e ? e.id === a[1] || typeof e.getAttributeNode != "undefined" && e.getAttributeNode("id").nodeValue === a[1] ? [ e ] : b : [];
                }
            }, o.filter.ID = function(a, b) {
                var c = typeof a.getAttributeNode != "undefined" && a.getAttributeNode("id");
                return a.nodeType === 1 && c && c.nodeValue === b;
            }), e.removeChild(a), e = a = null;
        }(), function() {
            var a = c.createElement("div");
            a.appendChild(c.createComment("")), a.getElementsByTagName("*").length > 0 && (o.find.TAG = function(a, b) {
                var c = b.getElementsByTagName(a[1]);
                if (a[1] === "*") {
                    var d = [];
                    for (var e = 0; c[e]; e++) c[e].nodeType === 1 && d.push(c[e]);
                    c = d;
                }
                return c;
            }), a.innerHTML = "<a href='#'></a>", a.firstChild && typeof a.firstChild.getAttribute != "undefined" && a.firstChild.getAttribute("href") !== "#" && (o.attrHandle.href = function(a) {
                return a.getAttribute("href", 2);
            }), a = null;
        }(), c.querySelectorAll && function() {
            var a = m, b = c.createElement("div"), d = "__sizzle__";
            b.innerHTML = "<p class='TEST'></p>";
            if (!b.querySelectorAll || b.querySelectorAll(".TEST").length !== 0) {
                m = function(b, e, f, g) {
                    e = e || c;
                    if (!g && !m.isXML(e)) {
                        var h = /^(\w+$)|^\.([\w\-]+$)|^#([\w\-]+$)/.exec(b);
                        if (h && (e.nodeType === 1 || e.nodeType === 9)) {
                            if (h[1]) return s(e.getElementsByTagName(b), f);
                            if (h[2] && o.find.CLASS && e.getElementsByClassName) return s(e.getElementsByClassName(h[2]), f);
                        }
                        if (e.nodeType === 9) {
                            if (b === "body" && e.body) return s([ e.body ], f);
                            if (h && h[3]) {
                                var i = e.getElementById(h[3]);
                                if (!i || !i.parentNode) return s([], f);
                                if (i.id === h[3]) return s([ i ], f);
                            }
                            try {
                                return s(e.querySelectorAll(b), f);
                            } catch (j) {}
                        } else if (e.nodeType === 1 && e.nodeName.toLowerCase() !== "object") {
                            var k = e, l = e.getAttribute("id"), n = l || d, p = e.parentNode, q = /^\s*[+~]/.test(b);
                            l ? n = n.replace(/'/g, "\\$&") : e.setAttribute("id", n), q && p && (e = e.parentNode);
                            try {
                                if (!q || p) return s(e.querySelectorAll("[id='" + n + "'] " + b), f);
                            } catch (r) {} finally {
                                l || k.removeAttribute("id");
                            }
                        }
                    }
                    return a(b, e, f, g);
                };
                for (var e in a) m[e] = a[e];
                b = null;
            }
        }(), function() {
            var a = c.documentElement, b = a.matchesSelector || a.mozMatchesSelector || a.webkitMatchesSelector || a.msMatchesSelector;
            if (b) {
                var d = !b.call(c.createElement("div"), "div"), e = !1;
                try {
                    b.call(c.documentElement, "[test!='']:sizzle");
                } catch (f) {
                    e = !0;
                }
                m.matchesSelector = function(a, c) {
                    c = c.replace(/\=\s*([^'"\]]*)\s*\]/g, "='$1']");
                    if (!m.isXML(a)) try {
                        if (e || !o.match.PSEUDO.test(c) && !/!=/.test(c)) {
                            var f = b.call(a, c);
                            if (f || !d || a.document && a.document.nodeType !== 11) return f;
                        }
                    } catch (g) {}
                    return m(c, null, null, [ a ]).length > 0;
                };
            }
        }(), function() {
            var a = c.createElement("div");
            a.innerHTML = "<div class='test e'></div><div class='test'></div>";
            if (!!a.getElementsByClassName && a.getElementsByClassName("e").length !== 0) {
                a.lastChild.className = "e";
                if (a.getElementsByClassName("e").length === 1) return;
                o.order.splice(1, 0, "CLASS"), o.find.CLASS = function(a, b, c) {
                    if (typeof b.getElementsByClassName != "undefined" && !c) return b.getElementsByClassName(a[1]);
                }, a = null;
            }
        }(), c.documentElement.contains ? m.contains = function(a, b) {
            return a !== b && (a.contains ? a.contains(b) : !0);
        } : c.documentElement.compareDocumentPosition ? m.contains = function(a, b) {
            return !!(a.compareDocumentPosition(b) & 16);
        } : m.contains = function() {
            return !1;
        }, m.isXML = function(a) {
            var b = (a ? a.ownerDocument || a : 0).documentElement;
            return b ? b.nodeName !== "HTML" : !1;
        };
        var y = function(a, b, c) {
            var d, e = [], f = "", g = b.nodeType ? [ b ] : b;
            while (d = o.match.PSEUDO.exec(a)) f += d[0], a = a.replace(o.match.PSEUDO, "");
            a = o.relative[a] ? a + "*" : a;
            for (var h = 0, i = g.length; h < i; h++) m(a, g[h], e, c);
            return m.filter(f, e);
        };
        m.attr = f.attr, m.selectors.attrMap = {}, f.find = m, f.expr = m.selectors, f.expr[":"] = f.expr.filters, f.unique = m.uniqueSort, f.text = m.getText, f.isXMLDoc = m.isXML, f.contains = m.contains;
    }();
    var L = /Until$/, M = /^(?:parents|prevUntil|prevAll)/, N = /,/, O = /^.[^:#\[\.,]*$/, P = Array.prototype.slice, Q = f.expr.match.globalPOS, R = {
        children: !0,
        contents: !0,
        next: !0,
        prev: !0
    };
    f.fn.extend({
        find: function(a) {
            var b = this, c, d;
            if (typeof a != "string") return f(a).filter(function() {
                for (c = 0, d = b.length; c < d; c++) if (f.contains(b[c], this)) return !0;
            });
            var e = this.pushStack("", "find", a), g, h, i;
            for (c = 0, d = this.length; c < d; c++) {
                g = e.length, f.find(a, this[c], e);
                if (c > 0) for (h = g; h < e.length; h++) for (i = 0; i < g; i++) if (e[i] === e[h]) {
                    e.splice(h--, 1);
                    break;
                }
            }
            return e;
        },
        has: function(a) {
            var b = f(a);
            return this.filter(function() {
                for (var a = 0, c = b.length; a < c; a++) if (f.contains(this, b[a])) return !0;
            });
        },
        not: function(a) {
            return this.pushStack(T(this, a, !1), "not", a);
        },
        filter: function(a) {
            return this.pushStack(T(this, a, !0), "filter", a);
        },
        is: function(a) {
            return !!a && (typeof a == "string" ? Q.test(a) ? f(a, this.context).index(this[0]) >= 0 : f.filter(a, this).length > 0 : this.filter(a).length > 0);
        },
        closest: function(a, b) {
            var c = [], d, e, g = this[0];
            if (f.isArray(a)) {
                var h = 1;
                while (g && g.ownerDocument && g !== b) {
                    for (d = 0; d < a.length; d++) f(g).is(a[d]) && c.push({
                        selector: a[d],
                        elem: g,
                        level: h
                    });
                    g = g.parentNode, h++;
                }
                return c;
            }
            var i = Q.test(a) || typeof a != "string" ? f(a, b || this.context) : 0;
            for (d = 0, e = this.length; d < e; d++) {
                g = this[d];
                while (g) {
                    if (i ? i.index(g) > -1 : f.find.matchesSelector(g, a)) {
                        c.push(g);
                        break;
                    }
                    g = g.parentNode;
                    if (!g || !g.ownerDocument || g === b || g.nodeType === 11) break;
                }
            }
            return c = c.length > 1 ? f.unique(c) : c, this.pushStack(c, "closest", a);
        },
        index: function(a) {
            return a ? typeof a == "string" ? f.inArray(this[0], f(a)) : f.inArray(a.jquery ? a[0] : a, this) : this[0] && this[0].parentNode ? this.prevAll().length : -1;
        },
        add: function(a, b) {
            var c = typeof a == "string" ? f(a, b) : f.makeArray(a && a.nodeType ? [ a ] : a), d = f.merge(this.get(), c);
            return this.pushStack(S(c[0]) || S(d[0]) ? d : f.unique(d));
        },
        andSelf: function() {
            return this.add(this.prevObject);
        }
    }), f.each({
        parent: function(a) {
            var b = a.parentNode;
            return b && b.nodeType !== 11 ? b : null;
        },
        parents: function(a) {
            return f.dir(a, "parentNode");
        },
        parentsUntil: function(a, b, c) {
            return f.dir(a, "parentNode", c);
        },
        next: function(a) {
            return f.nth(a, 2, "nextSibling");
        },
        prev: function(a) {
            return f.nth(a, 2, "previousSibling");
        },
        nextAll: function(a) {
            return f.dir(a, "nextSibling");
        },
        prevAll: function(a) {
            return f.dir(a, "previousSibling");
        },
        nextUntil: function(a, b, c) {
            return f.dir(a, "nextSibling", c);
        },
        prevUntil: function(a, b, c) {
            return f.dir(a, "previousSibling", c);
        },
        siblings: function(a) {
            return f.sibling((a.parentNode || {}).firstChild, a);
        },
        children: function(a) {
            return f.sibling(a.firstChild);
        },
        contents: function(a) {
            return f.nodeName(a, "iframe") ? a.contentDocument || a.contentWindow.document : f.makeArray(a.childNodes);
        }
    }, function(a, b) {
        f.fn[a] = function(c, d) {
            var e = f.map(this, b, c);
            return L.test(a) || (d = c), d && typeof d == "string" && (e = f.filter(d, e)), e = this.length > 1 && !R[a] ? f.unique(e) : e, (this.length > 1 || N.test(d)) && M.test(a) && (e = e.reverse()), this.pushStack(e, a, P.call(arguments).join(","));
        };
    }), f.extend({
        filter: function(a, b, c) {
            return c && (a = ":not(" + a + ")"), b.length === 1 ? f.find.matchesSelector(b[0], a) ? [ b[0] ] : [] : f.find.matches(a, b);
        },
        dir: function(a, c, d) {
            var e = [], g = a[c];
            while (g && g.nodeType !== 9 && (d === b || g.nodeType !== 1 || !f(g).is(d))) g.nodeType === 1 && e.push(g), g = g[c];
            return e;
        },
        nth: function(a, b, c, d) {
            b = b || 1;
            var e = 0;
            for (; a; a = a[c]) if (a.nodeType === 1 && ++e === b) break;
            return a;
        },
        sibling: function(a, b) {
            var c = [];
            for (; a; a = a.nextSibling) a.nodeType === 1 && a !== b && c.push(a);
            return c;
        }
    });
    var V = "abbr|article|aside|audio|bdi|canvas|data|datalist|details|figcaption|figure|footer|header|hgroup|mark|meter|nav|output|progress|section|summary|time|video", W = / jQuery\d+="(?:\d+|null)"/g, X = /^\s+/, Y = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/ig, Z = /<([\w:]+)/, $ = /<tbody/i, _ = /<|&#?\w+;/, ba = /<(?:script|style)/i, bb = /<(?:script|object|embed|option|style)/i, bc = new RegExp("<(?:" + V + ")[\\s/>]", "i"), bd = /checked\s*(?:[^=]|=\s*.checked.)/i, be = /\/(java|ecma)script/i, bf = /^\s*<!(?:\[CDATA\[|\-\-)/, bg = {
        option: [ 1, "<select multiple='multiple'>", "</select>" ],
        legend: [ 1, "<fieldset>", "</fieldset>" ],
        thead: [ 1, "<table>", "</table>" ],
        tr: [ 2, "<table><tbody>", "</tbody></table>" ],
        td: [ 3, "<table><tbody><tr>", "</tr></tbody></table>" ],
        col: [ 2, "<table><tbody></tbody><colgroup>", "</colgroup></table>" ],
        area: [ 1, "<map>", "</map>" ],
        _default: [ 0, "", "" ]
    }, bh = U(c);
    bg.optgroup = bg.option, bg.tbody = bg.tfoot = bg.colgroup = bg.caption = bg.thead, bg.th = bg.td, f.support.htmlSerialize || (bg._default = [ 1, "div<div>", "</div>" ]), f.fn.extend({
        text: function(a) {
            return f.access(this, function(a) {
                return a === b ? f.text(this) : this.empty().append((this[0] && this[0].ownerDocument || c).createTextNode(a));
            }, null, a, arguments.length);
        },
        wrapAll: function(a) {
            if (f.isFunction(a)) return this.each(function(b) {
                f(this).wrapAll(a.call(this, b));
            });
            if (this[0]) {
                var b = f(a, this[0].ownerDocument).eq(0).clone(!0);
                this[0].parentNode && b.insertBefore(this[0]), b.map(function() {
                    var a = this;
                    while (a.firstChild && a.firstChild.nodeType === 1) a = a.firstChild;
                    return a;
                }).append(this);
            }
            return this;
        },
        wrapInner: function(a) {
            return f.isFunction(a) ? this.each(function(b) {
                f(this).wrapInner(a.call(this, b));
            }) : this.each(function() {
                var b = f(this), c = b.contents();
                c.length ? c.wrapAll(a) : b.append(a);
            });
        },
        wrap: function(a) {
            var b = f.isFunction(a);
            return this.each(function(c) {
                f(this).wrapAll(b ? a.call(this, c) : a);
            });
        },
        unwrap: function() {
            return this.parent().each(function() {
                f.nodeName(this, "body") || f(this).replaceWith(this.childNodes);
            }).end();
        },
        append: function() {
            return this.domManip(arguments, !0, function(a) {
                this.nodeType === 1 && this.appendChild(a);
            });
        },
        prepend: function() {
            return this.domManip(arguments, !0, function(a) {
                this.nodeType === 1 && this.insertBefore(a, this.firstChild);
            });
        },
        before: function() {
            if (this[0] && this[0].parentNode) return this.domManip(arguments, !1, function(a) {
                this.parentNode.insertBefore(a, this);
            });
            if (arguments.length) {
                var a = f.clean(arguments);
                return a.push.apply(a, this.toArray()), this.pushStack(a, "before", arguments);
            }
        },
        after: function() {
            if (this[0] && this[0].parentNode) return this.domManip(arguments, !1, function(a) {
                this.parentNode.insertBefore(a, this.nextSibling);
            });
            if (arguments.length) {
                var a = this.pushStack(this, "after", arguments);
                return a.push.apply(a, f.clean(arguments)), a;
            }
        },
        remove: function(a, b) {
            for (var c = 0, d; (d = this[c]) != null; c++) if (!a || f.filter(a, [ d ]).length) !b && d.nodeType === 1 && (f.cleanData(d.getElementsByTagName("*")), f.cleanData([ d ])), d.parentNode && d.parentNode.removeChild(d);
            return this;
        },
        empty: function() {
            for (var a = 0, b; (b = this[a]) != null; a++) {
                b.nodeType === 1 && f.cleanData(b.getElementsByTagName("*"));
                while (b.firstChild) b.removeChild(b.firstChild);
            }
            return this;
        },
        clone: function(a, b) {
            return a = a == null ? !1 : a, b = b == null ? a : b, this.map(function() {
                return f.clone(this, a, b);
            });
        },
        html: function(a) {
            return f.access(this, function(a) {
                var c = this[0] || {}, d = 0, e = this.length;
                if (a === b) return c.nodeType === 1 ? c.innerHTML.replace(W, "") : null;
                if (typeof a == "string" && !ba.test(a) && (f.support.leadingWhitespace || !X.test(a)) && !bg[(Z.exec(a) || [ "", "" ])[1].toLowerCase()]) {
                    a = a.replace(Y, "<$1></$2>");
                    try {
                        for (; d < e; d++) c = this[d] || {}, c.nodeType === 1 && (f.cleanData(c.getElementsByTagName("*")), c.innerHTML = a);
                        c = 0;
                    } catch (g) {}
                }
                c && this.empty().append(a);
            }, null, a, arguments.length);
        },
        replaceWith: function(a) {
            return this[0] && this[0].parentNode ? f.isFunction(a) ? this.each(function(b) {
                var c = f(this), d = c.html();
                c.replaceWith(a.call(this, b, d));
            }) : (typeof a != "string" && (a = f(a).detach()), this.each(function() {
                var b = this.nextSibling, c = this.parentNode;
                f(this).remove(), b ? f(b).before(a) : f(c).append(a);
            })) : this.length ? this.pushStack(f(f.isFunction(a) ? a() : a), "replaceWith", a) : this;
        },
        detach: function(a) {
            return this.remove(a, !0);
        },
        domManip: function(a, c, d) {
            var e, g, h, i, j = a[0], k = [];
            if (!f.support.checkClone && arguments.length === 3 && typeof j == "string" && bd.test(j)) return this.each(function() {
                f(this).domManip(a, c, d, !0);
            });
            if (f.isFunction(j)) return this.each(function(e) {
                var g = f(this);
                a[0] = j.call(this, e, c ? g.html() : b), g.domManip(a, c, d);
            });
            if (this[0]) {
                i = j && j.parentNode, f.support.parentNode && i && i.nodeType === 11 && i.childNodes.length === this.length ? e = {
                    fragment: i
                } : e = f.buildFragment(a, this, k), h = e.fragment, h.childNodes.length === 1 ? g = h = h.firstChild : g = h.firstChild;
                if (g) {
                    c = c && f.nodeName(g, "tr");
                    for (var l = 0, m = this.length, n = m - 1; l < m; l++) d.call(c ? bi(this[l], g) : this[l], e.cacheable || m > 1 && l < n ? f.clone(h, !0, !0) : h);
                }
                k.length && f.each(k, function(a, b) {
                    b.src ? f.ajax({
                        type: "GET",
                        global: !1,
                        url: b.src,
                        async: !1,
                        dataType: "script"
                    }) : f.globalEval((b.text || b.textContent || b.innerHTML || "").replace(bf, "/*$0*/")), b.parentNode && b.parentNode.removeChild(b);
                });
            }
            return this;
        }
    }), f.buildFragment = function(a, b, d) {
        var e, g, h, i, j = a[0];
        return b && b[0] && (i = b[0].ownerDocument || b[0]), i.createDocumentFragment || (i = c), a.length === 1 && typeof j == "string" && j.length < 512 && i === c && j.charAt(0) === "<" && !bb.test(j) && (f.support.checkClone || !bd.test(j)) && (f.support.html5Clone || !bc.test(j)) && (g = !0, h = f.fragments[j], h && h !== 1 && (e = h)), e || (e = i.createDocumentFragment(), f.clean(a, i, e, d)), g && (f.fragments[j] = h ? e : 1), {
            fragment: e,
            cacheable: g
        };
    }, f.fragments = {}, f.each({
        appendTo: "append",
        prependTo: "prepend",
        insertBefore: "before",
        insertAfter: "after",
        replaceAll: "replaceWith"
    }, function(a, b) {
        f.fn[a] = function(c) {
            var d = [], e = f(c), g = this.length === 1 && this[0].parentNode;
            if (g && g.nodeType === 11 && g.childNodes.length === 1 && e.length === 1) return e[b](this[0]), this;
            for (var h = 0, i = e.length; h < i; h++) {
                var j = (h > 0 ? this.clone(!0) : this).get();
                f(e[h])[b](j), d = d.concat(j);
            }
            return this.pushStack(d, a, e.selector);
        };
    }), f.extend({
        clone: function(a, b, c) {
            var d, e, g, h = f.support.html5Clone || f.isXMLDoc(a) || !bc.test("<" + a.nodeName + ">") ? a.cloneNode(!0) : bo(a);
            if ((!f.support.noCloneEvent || !f.support.noCloneChecked) && (a.nodeType === 1 || a.nodeType === 11) && !f.isXMLDoc(a)) {
                bk(a, h), d = bl(a), e = bl(h);
                for (g = 0; d[g]; ++g) e[g] && bk(d[g], e[g]);
            }
            if (b) {
                bj(a, h);
                if (c) {
                    d = bl(a), e = bl(h);
                    for (g = 0; d[g]; ++g) bj(d[g], e[g]);
                }
            }
            return d = e = null, h;
        },
        clean: function(a, b, d, e) {
            var g, h, i, j = [];
            b = b || c, typeof b.createElement == "undefined" && (b = b.ownerDocument || b[0] && b[0].ownerDocument || c);
            for (var k = 0, l; (l = a[k]) != null; k++) {
                typeof l == "number" && (l += "");
                if (!l) continue;
                if (typeof l == "string") if (!_.test(l)) l = b.createTextNode(l); else {
                    l = l.replace(Y, "<$1></$2>");
                    var m = (Z.exec(l) || [ "", "" ])[1].toLowerCase(), n = bg[m] || bg._default, o = n[0], p = b.createElement("div"), q = bh.childNodes, r;
                    b === c ? bh.appendChild(p) : U(b).appendChild(p), p.innerHTML = n[1] + l + n[2];
                    while (o--) p = p.lastChild;
                    if (!f.support.tbody) {
                        var s = $.test(l), t = m === "table" && !s ? p.firstChild && p.firstChild.childNodes : n[1] === "<table>" && !s ? p.childNodes : [];
                        for (i = t.length - 1; i >= 0; --i) f.nodeName(t[i], "tbody") && !t[i].childNodes.length && t[i].parentNode.removeChild(t[i]);
                    }
                    !f.support.leadingWhitespace && X.test(l) && p.insertBefore(b.createTextNode(X.exec(l)[0]), p.firstChild), l = p.childNodes, p && (p.parentNode.removeChild(p), q.length > 0 && (r = q[q.length - 1], r && r.parentNode && r.parentNode.removeChild(r)));
                }
                var u;
                if (!f.support.appendChecked) if (l[0] && typeof (u = l.length) == "number") for (i = 0; i < u; i++) bn(l[i]); else bn(l);
                l.nodeType ? j.push(l) : j = f.merge(j, l);
            }
            if (d) {
                g = function(a) {
                    return !a.type || be.test(a.type);
                };
                for (k = 0; j[k]; k++) {
                    h = j[k];
                    if (e && f.nodeName(h, "script") && (!h.type || be.test(h.type))) e.push(h.parentNode ? h.parentNode.removeChild(h) : h); else {
                        if (h.nodeType === 1) {
                            var v = f.grep(h.getElementsByTagName("script"), g);
                            j.splice.apply(j, [ k + 1, 0 ].concat(v));
                        }
                        d.appendChild(h);
                    }
                }
            }
            return j;
        },
        cleanData: function(a) {
            var b, c, d = f.cache, e = f.event.special, g = f.support.deleteExpando;
            for (var h = 0, i; (i = a[h]) != null; h++) {
                if (i.nodeName && f.noData[i.nodeName.toLowerCase()]) continue;
                c = i[f.expando];
                if (c) {
                    b = d[c];
                    if (b && b.events) {
                        for (var j in b.events) e[j] ? f.event.remove(i, j) : f.removeEvent(i, j, b.handle);
                        b.handle && (b.handle.elem = null);
                    }
                    g ? delete i[f.expando] : i.removeAttribute && i.removeAttribute(f.expando), delete d[c];
                }
            }
        }
    });
    var bp = /alpha\([^)]*\)/i, bq = /opacity=([^)]*)/, br = /([A-Z]|^ms)/g, bs = /^[\-+]?(?:\d*\.)?\d+$/i, bt = /^-?(?:\d*\.)?\d+(?!px)[^\d\s]+$/i, bu = /^([\-+])=([\-+.\de]+)/, bv = /^margin/, bw = {
        position: "absolute",
        visibility: "hidden",
        display: "block"
    }, bx = [ "Top", "Right", "Bottom", "Left" ], by, bz, bA;
    f.fn.css = function(a, c) {
        return f.access(this, function(a, c, d) {
            return d !== b ? f.style(a, c, d) : f.css(a, c);
        }, a, c, arguments.length > 1);
    }, f.extend({
        cssHooks: {
            opacity: {
                get: function(a, b) {
                    if (b) {
                        var c = by(a, "opacity");
                        return c === "" ? "1" : c;
                    }
                    return a.style.opacity;
                }
            }
        },
        cssNumber: {
            fillOpacity: !0,
            fontWeight: !0,
            lineHeight: !0,
            opacity: !0,
            orphans: !0,
            widows: !0,
            zIndex: !0,
            zoom: !0
        },
        cssProps: {
            "float": f.support.cssFloat ? "cssFloat" : "styleFloat"
        },
        style: function(a, c, d, e) {
            if (!!a && a.nodeType !== 3 && a.nodeType !== 8 && !!a.style) {
                var g, h, i = f.camelCase(c), j = a.style, k = f.cssHooks[i];
                c = f.cssProps[i] || i;
                if (d === b) return k && "get" in k && (g = k.get(a, !1, e)) !== b ? g : j[c];
                h = typeof d, h === "string" && (g = bu.exec(d)) && (d = +(g[1] + 1) * +g[2] + parseFloat(f.css(a, c)), h = "number");
                if (d == null || h === "number" && isNaN(d)) return;
                h === "number" && !f.cssNumber[i] && (d += "px");
                if (!k || !("set" in k) || (d = k.set(a, d)) !== b) try {
                    j[c] = d;
                } catch (l) {}
            }
        },
        css: function(a, c, d) {
            var e, g;
            c = f.camelCase(c), g = f.cssHooks[c], c = f.cssProps[c] || c, c === "cssFloat" && (c = "float");
            if (g && "get" in g && (e = g.get(a, !0, d)) !== b) return e;
            if (by) return by(a, c);
        },
        swap: function(a, b, c) {
            var d = {}, e, f;
            for (f in b) d[f] = a.style[f], a.style[f] = b[f];
            e = c.call(a);
            for (f in b) a.style[f] = d[f];
            return e;
        }
    }), f.curCSS = f.css, c.defaultView && c.defaultView.getComputedStyle && (bz = function(a, b) {
        var c, d, e, g, h = a.style;
        return b = b.replace(br, "-$1").toLowerCase(), (d = a.ownerDocument.defaultView) && (e = d.getComputedStyle(a, null)) && (c = e.getPropertyValue(b), c === "" && !f.contains(a.ownerDocument.documentElement, a) && (c = f.style(a, b))), !f.support.pixelMargin && e && bv.test(b) && bt.test(c) && (g = h.width, h.width = c, c = e.width, h.width = g), c;
    }), c.documentElement.currentStyle && (bA = function(a, b) {
        var c, d, e, f = a.currentStyle && a.currentStyle[b], g = a.style;
        return f == null && g && (e = g[b]) && (f = e), bt.test(f) && (c = g.left, d = a.runtimeStyle && a.runtimeStyle.left, d && (a.runtimeStyle.left = a.currentStyle.left), g.left = b === "fontSize" ? "1em" : f, f = g.pixelLeft + "px", g.left = c, d && (a.runtimeStyle.left = d)), f === "" ? "auto" : f;
    }), by = bz || bA, f.each([ "height", "width" ], function(a, b) {
        f.cssHooks[b] = {
            get: function(a, c, d) {
                if (c) return a.offsetWidth !== 0 ? bB(a, b, d) : f.swap(a, bw, function() {
                    return bB(a, b, d);
                });
            },
            set: function(a, b) {
                return bs.test(b) ? b + "px" : b;
            }
        };
    }), f.support.opacity || (f.cssHooks.opacity = {
        get: function(a, b) {
            return bq.test((b && a.currentStyle ? a.currentStyle.filter : a.style.filter) || "") ? parseFloat(RegExp.$1) / 100 + "" : b ? "1" : "";
        },
        set: function(a, b) {
            var c = a.style, d = a.currentStyle, e = f.isNumeric(b) ? "alpha(opacity=" + b * 100 + ")" : "", g = d && d.filter || c.filter || "";
            c.zoom = 1;
            if (b >= 1 && f.trim(g.replace(bp, "")) === "") {
                c.removeAttribute("filter");
                if (d && !d.filter) return;
            }
            c.filter = bp.test(g) ? g.replace(bp, e) : g + " " + e;
        }
    }), f(function() {
        f.support.reliableMarginRight || (f.cssHooks.marginRight = {
            get: function(a, b) {
                return f.swap(a, {
                    display: "inline-block"
                }, function() {
                    return b ? by(a, "margin-right") : a.style.marginRight;
                });
            }
        });
    }), f.expr && f.expr.filters && (f.expr.filters.hidden = function(a) {
        var b = a.offsetWidth, c = a.offsetHeight;
        return b === 0 && c === 0 || !f.support.reliableHiddenOffsets && (a.style && a.style.display || f.css(a, "display")) === "none";
    }, f.expr.filters.visible = function(a) {
        return !f.expr.filters.hidden(a);
    }), f.each({
        margin: "",
        padding: "",
        border: "Width"
    }, function(a, b) {
        f.cssHooks[a + b] = {
            expand: function(c) {
                var d, e = typeof c == "string" ? c.split(" ") : [ c ], f = {};
                for (d = 0; d < 4; d++) f[a + bx[d] + b] = e[d] || e[d - 2] || e[0];
                return f;
            }
        };
    });
    var bC = /%20/g, bD = /\[\]$/, bE = /\r?\n/g, bF = /#.*$/, bG = /^(.*?):[ \t]*([^\r\n]*)\r?$/mg, bH = /^(?:color|date|datetime|datetime-local|email|hidden|month|number|password|range|search|tel|text|time|url|week)$/i, bI = /^(?:about|app|app\-storage|.+\-extension|file|res|widget):$/, bJ = /^(?:GET|HEAD)$/, bK = /^\/\//, bL = /\?/, bM = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, bN = /^(?:select|textarea)/i, bO = /\s+/, bP = /([?&])_=[^&]*/, bQ = /^([\w\+\.\-]+:)(?:\/\/([^\/?#:]*)(?::(\d+))?)?/, bR = f.fn.load, bS = {}, bT = {}, bU, bV, bW = [ "*/" ] + [ "*" ];
    try {
        bU = e.href;
    } catch (bX) {
        bU = c.createElement("a"), bU.href = "", bU = bU.href;
    }
    bV = bQ.exec(bU.toLowerCase()) || [], f.fn.extend({
        load: function(a, c, d) {
            if (typeof a != "string" && bR) return bR.apply(this, arguments);
            if (!this.length) return this;
            var e = a.indexOf(" ");
            if (e >= 0) {
                var g = a.slice(e, a.length);
                a = a.slice(0, e);
            }
            var h = "GET";
            c && (f.isFunction(c) ? (d = c, c = b) : typeof c == "object" && (c = f.param(c, f.ajaxSettings.traditional), h = "POST"));
            var i = this;
            return f.ajax({
                url: a,
                type: h,
                dataType: "html",
                data: c,
                complete: function(a, b, c) {
                    c = a.responseText, a.isResolved() && (a.done(function(a) {
                        c = a;
                    }), i.html(g ? f("<div>").append(c.replace(bM, "")).find(g) : c)), d && i.each(d, [ c, b, a ]);
                }
            }), this;
        },
        serialize: function() {
            return f.param(this.serializeArray());
        },
        serializeArray: function() {
            return this.map(function() {
                return this.elements ? f.makeArray(this.elements) : this;
            }).filter(function() {
                return this.name && !this.disabled && (this.checked || bN.test(this.nodeName) || bH.test(this.type));
            }).map(function(a, b) {
                var c = f(this).val();
                return c == null ? null : f.isArray(c) ? f.map(c, function(a, c) {
                    return {
                        name: b.name,
                        value: a.replace(bE, "\r\n")
                    };
                }) : {
                    name: b.name,
                    value: c.replace(bE, "\r\n")
                };
            }).get();
        }
    }), f.each("ajaxStart ajaxStop ajaxComplete ajaxError ajaxSuccess ajaxSend".split(" "), function(a, b) {
        f.fn[b] = function(a) {
            return this.on(b, a);
        };
    }), f.each([ "get", "post" ], function(a, c) {
        f[c] = function(a, d, e, g) {
            return f.isFunction(d) && (g = g || e, e = d, d = b), f.ajax({
                type: c,
                url: a,
                data: d,
                success: e,
                dataType: g
            });
        };
    }), f.extend({
        getScript: function(a, c) {
            return f.get(a, b, c, "script");
        },
        getJSON: function(a, b, c) {
            return f.get(a, b, c, "json");
        },
        ajaxSetup: function(a, b) {
            return b ? b$(a, f.ajaxSettings) : (b = a, a = f.ajaxSettings), b$(a, b), a;
        },
        ajaxSettings: {
            url: bU,
            isLocal: bI.test(bV[1]),
            global: !0,
            type: "GET",
            contentType: "application/x-www-form-urlencoded; charset=UTF-8",
            processData: !0,
            async: !0,
            accepts: {
                xml: "application/xml, text/xml",
                html: "text/html",
                text: "text/plain",
                json: "application/json, text/javascript",
                "*": bW
            },
            contents: {
                xml: /xml/,
                html: /html/,
                json: /json/
            },
            responseFields: {
                xml: "responseXML",
                text: "responseText"
            },
            converters: {
                "* text": a.String,
                "text html": !0,
                "text json": f.parseJSON,
                "text xml": f.parseXML
            },
            flatOptions: {
                context: !0,
                url: !0
            }
        },
        ajaxPrefilter: bY(bS),
        ajaxTransport: bY(bT),
        ajax: function(a, c) {
            function w(a, c, l, m) {
                if (s !== 2) {
                    s = 2, q && clearTimeout(q), p = b, n = m || "", v.readyState = a > 0 ? 4 : 0;
                    var o, r, u, w = c, x = l ? ca(d, v, l) : b, y, z;
                    if (a >= 200 && a < 300 || a === 304) {
                        if (d.ifModified) {
                            if (y = v.getResponseHeader("Last-Modified")) f.lastModified[k] = y;
                            if (z = v.getResponseHeader("Etag")) f.etag[k] = z;
                        }
                        if (a === 304) w = "notmodified", o = !0; else try {
                            r = cb(d, x), w = "success", o = !0;
                        } catch (A) {
                            w = "parsererror", u = A;
                        }
                    } else {
                        u = w;
                        if (!w || a) w = "error", a < 0 && (a = 0);
                    }
                    v.status = a, v.statusText = "" + (c || w), o ? h.resolveWith(e, [ r, w, v ]) : h.rejectWith(e, [ v, w, u ]), v.statusCode(j), j = b, t && g.trigger("ajax" + (o ? "Success" : "Error"), [ v, d, o ? r : u ]), i.fireWith(e, [ v, w ]), t && (g.trigger("ajaxComplete", [ v, d ]), --f.active || f.event.trigger("ajaxStop"));
                }
            }
            typeof a == "object" && (c = a, a = b), c = c || {};
            var d = f.ajaxSetup({}, c), e = d.context || d, g = e !== d && (e.nodeType || e instanceof f) ? f(e) : f.event, h = f.Deferred(), i = f.Callbacks("once memory"), j = d.statusCode || {}, k, l = {}, m = {}, n, o, p, q, r, s = 0, t, u, v = {
                readyState: 0,
                setRequestHeader: function(a, b) {
                    if (!s) {
                        var c = a.toLowerCase();
                        a = m[c] = m[c] || a, l[a] = b;
                    }
                    return this;
                },
                getAllResponseHeaders: function() {
                    return s === 2 ? n : null;
                },
                getResponseHeader: function(a) {
                    var c;
                    if (s === 2) {
                        if (!o) {
                            o = {};
                            while (c = bG.exec(n)) o[c[1].toLowerCase()] = c[2];
                        }
                        c = o[a.toLowerCase()];
                    }
                    return c === b ? null : c;
                },
                overrideMimeType: function(a) {
                    return s || (d.mimeType = a), this;
                },
                abort: function(a) {
                    return a = a || "abort", p && p.abort(a), w(0, a), this;
                }
            };
            h.promise(v), v.success = v.done, v.error = v.fail, v.complete = i.add, v.statusCode = function(a) {
                if (a) {
                    var b;
                    if (s < 2) for (b in a) j[b] = [ j[b], a[b] ]; else b = a[v.status], v.then(b, b);
                }
                return this;
            }, d.url = ((a || d.url) + "").replace(bF, "").replace(bK, bV[1] + "//"), d.dataTypes = f.trim(d.dataType || "*").toLowerCase().split(bO), d.crossDomain == null && (r = bQ.exec(d.url.toLowerCase()), d.crossDomain = !(!r || r[1] == bV[1] && r[2] == bV[2] && (r[3] || (r[1] === "http:" ? 80 : 443)) == (bV[3] || (bV[1] === "http:" ? 80 : 443)))), d.data && d.processData && typeof d.data != "string" && (d.data = f.param(d.data, d.traditional)), bZ(bS, d, c, v);
            if (s === 2) return !1;
            t = d.global, d.type = d.type.toUpperCase(), d.hasContent = !bJ.test(d.type), t && f.active++ === 0 && f.event.trigger("ajaxStart");
            if (!d.hasContent) {
                d.data && (d.url += (bL.test(d.url) ? "&" : "?") + d.data, delete d.data), k = d.url;
                if (d.cache === !1) {
                    var x = f.now(), y = d.url.replace(bP, "$1_=" + x);
                    d.url = y + (y === d.url ? (bL.test(d.url) ? "&" : "?") + "_=" + x : "");
                }
            }
            (d.data && d.hasContent && d.contentType !== !1 || c.contentType) && v.setRequestHeader("Content-Type", d.contentType), d.ifModified && (k = k || d.url, f.lastModified[k] && v.setRequestHeader("If-Modified-Since", f.lastModified[k]), f.etag[k] && v.setRequestHeader("If-None-Match", f.etag[k])), v.setRequestHeader("Accept", d.dataTypes[0] && d.accepts[d.dataTypes[0]] ? d.accepts[d.dataTypes[0]] + (d.dataTypes[0] !== "*" ? ", " + bW + "; q=0.01" : "") : d.accepts["*"]);
            for (u in d.headers) v.setRequestHeader(u, d.headers[u]);
            if (!d.beforeSend || d.beforeSend.call(e, v, d) !== !1 && s !== 2) {
                for (u in {
                    success: 1,
                    error: 1,
                    complete: 1
                }) v[u](d[u]);
                p = bZ(bT, d, c, v);
                if (!p) w(-1, "No Transport"); else {
                    v.readyState = 1, t && g.trigger("ajaxSend", [ v, d ]), d.async && d.timeout > 0 && (q = setTimeout(function() {
                        v.abort("timeout");
                    }, d.timeout));
                    try {
                        s = 1, p.send(l, w);
                    } catch (z) {
                        if (!(s < 2)) throw z;
                        w(-1, z);
                    }
                }
                return v;
            }
            return v.abort(), !1;
        },
        param: function(a, c) {
            var d = [], e = function(a, b) {
                b = f.isFunction(b) ? b() : b, d[d.length] = encodeURIComponent(a) + "=" + encodeURIComponent(b);
            };
            c === b && (c = f.ajaxSettings.traditional);
            if (f.isArray(a) || a.jquery && !f.isPlainObject(a)) f.each(a, function() {
                e(this.name, this.value);
            }); else for (var g in a) b_(g, a[g], c, e);
            return d.join("&").replace(bC, "+");
        }
    }), f.extend({
        active: 0,
        lastModified: {},
        etag: {}
    });
    var cc = f.now(), cd = /(\=)\?(&|$)|\?\?/i;
    f.ajaxSetup({
        jsonp: "callback",
        jsonpCallback: function() {
            return f.expando + "_" + cc++;
        }
    }), f.ajaxPrefilter("json jsonp", function(b, c, d) {
        var e = typeof b.data == "string" && /^application\/x\-www\-form\-urlencoded/.test(b.contentType);
        if (b.dataTypes[0] === "jsonp" || b.jsonp !== !1 && (cd.test(b.url) || e && cd.test(b.data))) {
            var g, h = b.jsonpCallback = f.isFunction(b.jsonpCallback) ? b.jsonpCallback() : b.jsonpCallback, i = a[h], j = b.url, k = b.data, l = "$1" + h + "$2";
            return b.jsonp !== !1 && (j = j.replace(cd, l), b.url === j && (e && (k = k.replace(cd, l)), b.data === k && (j += (/\?/.test(j) ? "&" : "?") + b.jsonp + "=" + h))), b.url = j, b.data = k, a[h] = function(a) {
                g = [ a ];
            }, d.always(function() {
                a[h] = i, g && f.isFunction(i) && a[h](g[0]);
            }), b.converters["script json"] = function() {
                return g || f.error(h + " was not called"), g[0];
            }, b.dataTypes[0] = "json", "script";
        }
    }), f.ajaxSetup({
        accepts: {
            script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
        },
        contents: {
            script: /javascript|ecmascript/
        },
        converters: {
            "text script": function(a) {
                return f.globalEval(a), a;
            }
        }
    }), f.ajaxPrefilter("script", function(a) {
        a.cache === b && (a.cache = !1), a.crossDomain && (a.type = "GET", a.global = !1);
    }), f.ajaxTransport("script", function(a) {
        if (a.crossDomain) {
            var d, e = c.head || c.getElementsByTagName("head")[0] || c.documentElement;
            return {
                send: function(f, g) {
                    d = c.createElement("script"), d.async = "async", a.scriptCharset && (d.charset = a.scriptCharset), d.src = a.url, d.onload = d.onreadystatechange = function(a, c) {
                        if (c || !d.readyState || /loaded|complete/.test(d.readyState)) d.onload = d.onreadystatechange = null, e && d.parentNode && e.removeChild(d), d = b, c || g(200, "success");
                    }, e.insertBefore(d, e.firstChild);
                },
                abort: function() {
                    d && d.onload(0, 1);
                }
            };
        }
    });
    var ce = a.ActiveXObject ? function() {
        for (var a in cg) cg[a](0, 1);
    } : !1, cf = 0, cg;
    f.ajaxSettings.xhr = a.ActiveXObject ? function() {
        return !this.isLocal && ch() || ci();
    } : ch, function(a) {
        f.extend(f.support, {
            ajax: !!a,
            cors: !!a && "withCredentials" in a
        });
    }(f.ajaxSettings.xhr()), f.support.ajax && f.ajaxTransport(function(c) {
        if (!c.crossDomain || f.support.cors) {
            var d;
            return {
                send: function(e, g) {
                    var h = c.xhr(), i, j;
                    c.username ? h.open(c.type, c.url, c.async, c.username, c.password) : h.open(c.type, c.url, c.async);
                    if (c.xhrFields) for (j in c.xhrFields) h[j] = c.xhrFields[j];
                    c.mimeType && h.overrideMimeType && h.overrideMimeType(c.mimeType), !c.crossDomain && !e["X-Requested-With"] && (e["X-Requested-With"] = "XMLHttpRequest");
                    try {
                        for (j in e) h.setRequestHeader(j, e[j]);
                    } catch (k) {}
                    h.send(c.hasContent && c.data || null), d = function(a, e) {
                        var j, k, l, m, n;
                        try {
                            if (d && (e || h.readyState === 4)) {
                                d = b, i && (h.onreadystatechange = f.noop, ce && delete cg[i]);
                                if (e) h.readyState !== 4 && h.abort(); else {
                                    j = h.status, l = h.getAllResponseHeaders(), m = {}, n = h.responseXML, n && n.documentElement && (m.xml = n);
                                    try {
                                        m.text = h.responseText;
                                    } catch (a) {}
                                    try {
                                        k = h.statusText;
                                    } catch (o) {
                                        k = "";
                                    }
                                    !j && c.isLocal && !c.crossDomain ? j = m.text ? 200 : 404 : j === 1223 && (j = 204);
                                }
                            }
                        } catch (p) {
                            e || g(-1, p);
                        }
                        m && g(j, k, m, l);
                    }, !c.async || h.readyState === 4 ? d() : (i = ++cf, ce && (cg || (cg = {}, f(a).unload(ce)), cg[i] = d), h.onreadystatechange = d);
                },
                abort: function() {
                    d && d(0, 1);
                }
            };
        }
    });
    var cj = {}, ck, cl, cm = /^(?:toggle|show|hide)$/, cn = /^([+\-]=)?([\d+.\-]+)([a-z%]*)$/i, co, cp = [ [ "height", "marginTop", "marginBottom", "paddingTop", "paddingBottom" ], [ "width", "marginLeft", "marginRight", "paddingLeft", "paddingRight" ], [ "opacity" ] ], cq;
    f.fn.extend({
        show: function(a, b, c) {
            var d, e;
            if (a || a === 0) return this.animate(ct("show", 3), a, b, c);
            for (var g = 0, h = this.length; g < h; g++) d = this[g], d.style && (e = d.style.display, !f._data(d, "olddisplay") && e === "none" && (e = d.style.display = ""), (e === "" && f.css(d, "display") === "none" || !f.contains(d.ownerDocument.documentElement, d)) && f._data(d, "olddisplay", cu(d.nodeName)));
            for (g = 0; g < h; g++) {
                d = this[g];
                if (d.style) {
                    e = d.style.display;
                    if (e === "" || e === "none") d.style.display = f._data(d, "olddisplay") || "";
                }
            }
            return this;
        },
        hide: function(a, b, c) {
            if (a || a === 0) return this.animate(ct("hide", 3), a, b, c);
            var d, e, g = 0, h = this.length;
            for (; g < h; g++) d = this[g], d.style && (e = f.css(d, "display"), e !== "none" && !f._data(d, "olddisplay") && f._data(d, "olddisplay", e));
            for (g = 0; g < h; g++) this[g].style && (this[g].style.display = "none");
            return this;
        },
        _toggle: f.fn.toggle,
        toggle: function(a, b, c) {
            var d = typeof a == "boolean";
            return f.isFunction(a) && f.isFunction(b) ? this._toggle.apply(this, arguments) : a == null || d ? this.each(function() {
                var b = d ? a : f(this).is(":hidden");
                f(this)[b ? "show" : "hide"]();
            }) : this.animate(ct("toggle", 3), a, b, c), this;
        },
        fadeTo: function(a, b, c, d) {
            return this.filter(":hidden").css("opacity", 0).show().end().animate({
                opacity: b
            }, a, c, d);
        },
        animate: function(a, b, c, d) {
            function g() {
                e.queue === !1 && f._mark(this);
                var b = f.extend({}, e), c = this.nodeType === 1, d = c && f(this).is(":hidden"), g, h, i, j, k, l, m, n, o, p, q;
                b.animatedProperties = {};
                for (i in a) {
                    g = f.camelCase(i), i !== g && (a[g] = a[i], delete a[i]);
                    if ((k = f.cssHooks[g]) && "expand" in k) {
                        l = k.expand(a[g]), delete a[g];
                        for (i in l) i in a || (a[i] = l[i]);
                    }
                }
                for (g in a) {
                    h = a[g], f.isArray(h) ? (b.animatedProperties[g] = h[1], h = a[g] = h[0]) : b.animatedProperties[g] = b.specialEasing && b.specialEasing[g] || b.easing || "swing";
                    if (h === "hide" && d || h === "show" && !d) return b.complete.call(this);
                    c && (g === "height" || g === "width") && (b.overflow = [ this.style.overflow, this.style.overflowX, this.style.overflowY ], f.css(this, "display") === "inline" && f.css(this, "float") === "none" && (!f.support.inlineBlockNeedsLayout || cu(this.nodeName) === "inline" ? this.style.display = "inline-block" : this.style.zoom = 1));
                }
                b.overflow != null && (this.style.overflow = "hidden");
                for (i in a) j = new f.fx(this, b, i), h = a[i], cm.test(h) ? (q = f._data(this, "toggle" + i) || (h === "toggle" ? d ? "show" : "hide" : 0), q ? (f._data(this, "toggle" + i, q === "show" ? "hide" : "show"), j[q]()) : j[h]()) : (m = cn.exec(h), n = j.cur(), m ? (o = parseFloat(m[2]), p = m[3] || (f.cssNumber[i] ? "" : "px"), p !== "px" && (f.style(this, i, (o || 1) + p), n = (o || 1) / j.cur() * n, f.style(this, i, n + p)), m[1] && (o = (m[1] === "-=" ? -1 : 1) * o + n), j.custom(n, o, p)) : j.custom(n, h, ""));
                return !0;
            }
            var e = f.speed(b, c, d);
            return f.isEmptyObject(a) ? this.each(e.complete, [ !1 ]) : (a = f.extend({}, a), e.queue === !1 ? this.each(g) : this.queue(e.queue, g));
        },
        stop: function(a, c, d) {
            return typeof a != "string" && (d = c, c = a, a = b), c && a !== !1 && this.queue(a || "fx", []), this.each(function() {
                function h(a, b, c) {
                    var e = b[c];
                    f.removeData(a, c, !0), e.stop(d);
                }
                var b, c = !1, e = f.timers, g = f._data(this);
                d || f._unmark(!0, this);
                if (a == null) for (b in g) g[b] && g[b].stop && b.indexOf(".run") === b.length - 4 && h(this, g, b); else g[b = a + ".run"] && g[b].stop && h(this, g, b);
                for (b = e.length; b--; ) e[b].elem === this && (a == null || e[b].queue === a) && (d ? e[b](!0) : e[b].saveState(), c = !0, e.splice(b, 1));
                (!d || !c) && f.dequeue(this, a);
            });
        }
    }), f.each({
        slideDown: ct("show", 1),
        slideUp: ct("hide", 1),
        slideToggle: ct("toggle", 1),
        fadeIn: {
            opacity: "show"
        },
        fadeOut: {
            opacity: "hide"
        },
        fadeToggle: {
            opacity: "toggle"
        }
    }, function(a, b) {
        f.fn[a] = function(a, c, d) {
            return this.animate(b, a, c, d);
        };
    }), f.extend({
        speed: function(a, b, c) {
            var d = a && typeof a == "object" ? f.extend({}, a) : {
                complete: c || !c && b || f.isFunction(a) && a,
                duration: a,
                easing: c && b || b && !f.isFunction(b) && b
            };
            d.duration = f.fx.off ? 0 : typeof d.duration == "number" ? d.duration : d.duration in f.fx.speeds ? f.fx.speeds[d.duration] : f.fx.speeds._default;
            if (d.queue == null || d.queue === !0) d.queue = "fx";
            return d.old = d.complete, d.complete = function(a) {
                f.isFunction(d.old) && d.old.call(this), d.queue ? f.dequeue(this, d.queue) : a !== !1 && f._unmark(this);
            }, d;
        },
        easing: {
            linear: function(a) {
                return a;
            },
            swing: function(a) {
                return -Math.cos(a * Math.PI) / 2 + .5;
            }
        },
        timers: [],
        fx: function(a, b, c) {
            this.options = b, this.elem = a, this.prop = c, b.orig = b.orig || {};
        }
    }), f.fx.prototype = {
        update: function() {
            this.options.step && this.options.step.call(this.elem, this.now, this), (f.fx.step[this.prop] || f.fx.step._default)(this);
        },
        cur: function() {
            if (this.elem[this.prop] == null || !!this.elem.style && this.elem.style[this.prop] != null) {
                var a, b = f.css(this.elem, this.prop);
                return isNaN(a = parseFloat(b)) ? !b || b === "auto" ? 0 : b : a;
            }
            return this.elem[this.prop];
        },
        custom: function(a, c, d) {
            function h(a) {
                return e.step(a);
            }
            var e = this, g = f.fx;
            this.startTime = cq || cr(), this.end = c, this.now = this.start = a, this.pos = this.state = 0, this.unit = d || this.unit || (f.cssNumber[this.prop] ? "" : "px"), h.queue = this.options.queue, h.elem = this.elem, h.saveState = function() {
                f._data(e.elem, "fxshow" + e.prop) === b && (e.options.hide ? f._data(e.elem, "fxshow" + e.prop, e.start) : e.options.show && f._data(e.elem, "fxshow" + e.prop, e.end));
            }, h() && f.timers.push(h) && !co && (co = setInterval(g.tick, g.interval));
        },
        show: function() {
            var a = f._data(this.elem, "fxshow" + this.prop);
            this.options.orig[this.prop] = a || f.style(this.elem, this.prop), this.options.show = !0, a !== b ? this.custom(this.cur(), a) : this.custom(this.prop === "width" || this.prop === "height" ? 1 : 0, this.cur()), f(this.elem).show();
        },
        hide: function() {
            this.options.orig[this.prop] = f._data(this.elem, "fxshow" + this.prop) || f.style(this.elem, this.prop), this.options.hide = !0, this.custom(this.cur(), 0);
        },
        step: function(a) {
            var b, c, d, e = cq || cr(), g = !0, h = this.elem, i = this.options;
            if (a || e >= i.duration + this.startTime) {
                this.now = this.end, this.pos = this.state = 1, this.update(), i.animatedProperties[this.prop] = !0;
                for (b in i.animatedProperties) i.animatedProperties[b] !== !0 && (g = !1);
                if (g) {
                    i.overflow != null && !f.support.shrinkWrapBlocks && f.each([ "", "X", "Y" ], function(a, b) {
                        h.style["overflow" + b] = i.overflow[a];
                    }), i.hide && f(h).hide();
                    if (i.hide || i.show) for (b in i.animatedProperties) f.style(h, b, i.orig[b]), f.removeData(h, "fxshow" + b, !0), f.removeData(h, "toggle" + b, !0);
                    d = i.complete, d && (i.complete = !1, d.call(h));
                }
                return !1;
            }
            return i.duration == Infinity ? this.now = e : (c = e - this.startTime, this.state = c / i.duration, this.pos = f.easing[i.animatedProperties[this.prop]](this.state, c, 0, 1, i.duration), this.now = this.start + (this.end - this.start) * this.pos), this.update(), !0;
        }
    }, f.extend(f.fx, {
        tick: function() {
            var a, b = f.timers, c = 0;
            for (; c < b.length; c++) a = b[c], !a() && b[c] === a && b.splice(c--, 1);
            b.length || f.fx.stop();
        },
        interval: 13,
        stop: function() {
            clearInterval(co), co = null;
        },
        speeds: {
            slow: 600,
            fast: 200,
            _default: 400
        },
        step: {
            opacity: function(a) {
                f.style(a.elem, "opacity", a.now);
            },
            _default: function(a) {
                a.elem.style && a.elem.style[a.prop] != null ? a.elem.style[a.prop] = a.now + a.unit : a.elem[a.prop] = a.now;
            }
        }
    }), f.each(cp.concat.apply([], cp), function(a, b) {
        b.indexOf("margin") && (f.fx.step[b] = function(a) {
            f.style(a.elem, b, Math.max(0, a.now) + a.unit);
        });
    }), f.expr && f.expr.filters && (f.expr.filters.animated = function(a) {
        return f.grep(f.timers, function(b) {
            return a === b.elem;
        }).length;
    });
    var cv, cw = /^t(?:able|d|h)$/i, cx = /^(?:body|html)$/i;
    "getBoundingClientRect" in c.documentElement ? cv = function(a, b, c, d) {
        try {
            d = a.getBoundingClientRect();
        } catch (e) {}
        if (!d || !f.contains(c, a)) return d ? {
            top: d.top,
            left: d.left
        } : {
            top: 0,
            left: 0
        };
        var g = b.body, h = cy(b), i = c.clientTop || g.clientTop || 0, j = c.clientLeft || g.clientLeft || 0, k = h.pageYOffset || f.support.boxModel && c.scrollTop || g.scrollTop, l = h.pageXOffset || f.support.boxModel && c.scrollLeft || g.scrollLeft, m = d.top + k - i, n = d.left + l - j;
        return {
            top: m,
            left: n
        };
    } : cv = function(a, b, c) {
        var d, e = a.offsetParent, g = a, h = b.body, i = b.defaultView, j = i ? i.getComputedStyle(a, null) : a.currentStyle, k = a.offsetTop, l = a.offsetLeft;
        while ((a = a.parentNode) && a !== h && a !== c) {
            if (f.support.fixedPosition && j.position === "fixed") break;
            d = i ? i.getComputedStyle(a, null) : a.currentStyle, k -= a.scrollTop, l -= a.scrollLeft, a === e && (k += a.offsetTop, l += a.offsetLeft, f.support.doesNotAddBorder && (!f.support.doesAddBorderForTableAndCells || !cw.test(a.nodeName)) && (k += parseFloat(d.borderTopWidth) || 0, l += parseFloat(d.borderLeftWidth) || 0), g = e, e = a.offsetParent), f.support.subtractsBorderForOverflowNotVisible && d.overflow !== "visible" && (k += parseFloat(d.borderTopWidth) || 0, l += parseFloat(d.borderLeftWidth) || 0), j = d;
        }
        if (j.position === "relative" || j.position === "static") k += h.offsetTop, l += h.offsetLeft;
        return f.support.fixedPosition && j.position === "fixed" && (k += Math.max(c.scrollTop, h.scrollTop), l += Math.max(c.scrollLeft, h.scrollLeft)), {
            top: k,
            left: l
        };
    }, f.fn.offset = function(a) {
        if (arguments.length) return a === b ? this : this.each(function(b) {
            f.offset.setOffset(this, a, b);
        });
        var c = this[0], d = c && c.ownerDocument;
        return d ? c === d.body ? f.offset.bodyOffset(c) : cv(c, d, d.documentElement) : null;
    }, f.offset = {
        bodyOffset: function(a) {
            var b = a.offsetTop, c = a.offsetLeft;
            return f.support.doesNotIncludeMarginInBodyOffset && (b += parseFloat(f.css(a, "marginTop")) || 0, c += parseFloat(f.css(a, "marginLeft")) || 0), {
                top: b,
                left: c
            };
        },
        setOffset: function(a, b, c) {
            var d = f.css(a, "position");
            d === "static" && (a.style.position = "relative");
            var e = f(a), g = e.offset(), h = f.css(a, "top"), i = f.css(a, "left"), j = (d === "absolute" || d === "fixed") && f.inArray("auto", [ h, i ]) > -1, k = {}, l = {}, m, n;
            j ? (l = e.position(), m = l.top, n = l.left) : (m = parseFloat(h) || 0, n = parseFloat(i) || 0), f.isFunction(b) && (b = b.call(a, c, g)), b.top != null && (k.top = b.top - g.top + m), b.left != null && (k.left = b.left - g.left + n), "using" in b ? b.using.call(a, k) : e.css(k);
        }
    }, f.fn.extend({
        position: function() {
            if (!this[0]) return null;
            var a = this[0], b = this.offsetParent(), c = this.offset(), d = cx.test(b[0].nodeName) ? {
                top: 0,
                left: 0
            } : b.offset();
            return c.top -= parseFloat(f.css(a, "marginTop")) || 0, c.left -= parseFloat(f.css(a, "marginLeft")) || 0, d.top += parseFloat(f.css(b[0], "borderTopWidth")) || 0, d.left += parseFloat(f.css(b[0], "borderLeftWidth")) || 0, {
                top: c.top - d.top,
                left: c.left - d.left
            };
        },
        offsetParent: function() {
            return this.map(function() {
                var a = this.offsetParent || c.body;
                while (a && !cx.test(a.nodeName) && f.css(a, "position") === "static") a = a.offsetParent;
                return a;
            });
        }
    }), f.each({
        scrollLeft: "pageXOffset",
        scrollTop: "pageYOffset"
    }, function(a, c) {
        var d = /Y/.test(c);
        f.fn[a] = function(e) {
            return f.access(this, function(a, e, g) {
                var h = cy(a);
                if (g === b) return h ? c in h ? h[c] : f.support.boxModel && h.document.documentElement[e] || h.document.body[e] : a[e];
                h ? h.scrollTo(d ? f(h).scrollLeft() : g, d ? g : f(h).scrollTop()) : a[e] = g;
            }, a, e, arguments.length, null);
        };
    }), f.each({
        Height: "height",
        Width: "width"
    }, function(a, c) {
        var d = "client" + a, e = "scroll" + a, g = "offset" + a;
        f.fn["inner" + a] = function() {
            var a = this[0];
            return a ? a.style ? parseFloat(f.css(a, c, "padding")) : this[c]() : null;
        }, f.fn["outer" + a] = function(a) {
            var b = this[0];
            return b ? b.style ? parseFloat(f.css(b, c, a ? "margin" : "border")) : this[c]() : null;
        }, f.fn[c] = function(a) {
            return f.access(this, function(a, c, h) {
                var i, j, k, l;
                if (f.isWindow(a)) return i = a.document, j = i.documentElement[d], f.support.boxModel && j || i.body && i.body[d] || j;
                if (a.nodeType === 9) return i = a.documentElement, i[d] >= i[e] ? i[d] : Math.max(a.body[e], i[e], a.body[g], i[g]);
                if (h === b) return k = f.css(a, c), l = parseFloat(k), f.isNumeric(l) ? l : k;
                f(a).css(c, h);
            }, c, a, arguments.length, null);
        };
    }), a.jQuery = a.$ = f, typeof define == "function" && define.amd && define.amd.jQuery && define("jquery", [], function() {
        return f;
    });
}(window), define("lib/jQuery", function() {}), define("apis/notify", [ "../lib/message", "../lib/jQuery" ], function() {
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
}), define("gesture_handlers/risedock", [ "../apis/image", "../apis/notify" ], function(ImageAPI, Notify) {
    function entry() {
        console.log("RISE DOCK!");
    }
    return entry;
}), requirejs.config({
    baseUrl: "./src/"
}), require([ "./gesture_engine/engine", "./gesture_handlers/swipe", "./gesture_handlers/translate", "./gesture_handlers/risedock" ], function(Engine, swipeHandler, translateHandler, risedockHandler) {
    if (!window.Leap) return;
    var controller = new Leap.Controller({
        enableGestures: !0
    }), engine;
    controller.on("connect", function() {
        engine = new Engine(controller), engine.on("swipe", swipeHandler), engine.on("translate", translateHandler), engine.on("risedock", risedockHandler);
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