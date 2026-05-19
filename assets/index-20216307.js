var Ln=Object.defineProperty;var $n=(x,n,e)=>n in x?Ln(x,n,{enumerable:!0,configurable:!0,writable:!0,value:e}):x[n]=e;var xn=(x,n,e)=>($n(x,typeof n!="symbol"?n+"":n,e),e);(function(){const n=document.createElement("link").relList;if(n&&n.supports&&n.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))t(a);new MutationObserver(a=>{for(const r of a)if(r.type==="childList")for(const o of r.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&t(o)}).observe(document,{childList:!0,subtree:!0});function e(a){const r={};return a.integrity&&(r.integrity=a.integrity),a.referrerPolicy&&(r.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?r.credentials="include":a.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function t(a){if(a.ep)return;a.ep=!0;const r=e(a);fetch(a.href,r)}})();const K=(x,n)=>{try{return{BASE_URL:"/MinimalCoordinationGame-CHS-unmoderated/",MODE:"production",DEV:!1,PROD:!0,SSR:!1}[x]||n}catch{return console.warn(`Environment variable ${x} not available, using default: ${n}`),n}},bn=typeof window<"u"&&window.location&&window.location.origin?window.location.origin:"http://localhost:3001",Tn="gridworld.rlStudyCondition",wn=()=>Math.random()<.5?"joint":"individual",zn=()=>{const x=String(K("VITE_STUDY_RL_CONDITION","")||"").toLowerCase();if(x==="joint"||x==="individual")return x;try{if(typeof sessionStorage<"u"){const n=sessionStorage.getItem(Tn);if(n==="joint"||n==="individual")return n;const e=wn();return sessionStorage.setItem(Tn,e),e}}catch{}return wn()},un=zn(),vn=un==="joint"?"rl_joint":"rl_individual",Hn=un==="joint"?"joint":"individual",i={debug:{disableConsoleLogs:K("VITE_DISABLE_DEBUG_LOGS","false")==="true"},server:{url:K("VITE_SERVER_URL",bn),reconnectAttempts:3,reconnectDelay:1e3,googleAppsScriptUrl:K("VITE_GOOGLE_APPS_SCRIPT_URL","https://script.google.com/macros/s/AKfycbyfQ-XKsoFbmQZGM7c741rEXh2ZUpVK-uUIu9ycooXKnaxM5-hRSzIUhQ-uWZ668Qql/exec"),enableGoogleDriveSave:K("VITE_ENABLE_GOOGLE_DRIVE_SAVE","true")==="true"},game:{name:"GridWorldExperiment",version:"2.0.0",prolificCompletionCode:K("VITE_PROLIFIC_COMPLETION_CODE","CTNDR8GV"),matrixSize:15,maxGameLength:60,studyRLCondition:un,players:{player1:{type:"human",color:"red",description:"Human player (you)"},player2:{type:vn,color:"purple",description:"Human, GPT, or RL partner"}},experiments:{order:["1P1G","1P2G","2P2G","2P3G"],numTrials:{"1P1G":2,"1P2G":8,"2P2G":4,"2P3G":8}},successThreshold:{enabled:!1,consecutiveSuccessesRequired:5,minTrialsBeforeCheck:12,maxTrials:24,randomSamplingAfterTrial:12},timing:{trialToFeedbackDelay:500,feedbackDisplayDuration:1e3,preTrialDisplayDuration:2e3,fixationDuration:1e3,newGoalMessageDuration:0,maxTrialDurationMs:60*1e3,waitingForPartnerMinDuration:9*1e3,waitingForPartnerMaxDuration:9*1e3},agent:{type:Hn,delay:500,independentDelay:300,synchronizedMoves:!0,gpt:{model:"gpt",temperature:0,memory:{enabled:!0,maxSteps:50}}}},visual:{canvasSize:632,cellSize:40,padding:2,colors:{background:"#ffffff",grid:"#cccccc",player1:"#ff0000",player2:"#8000ff",goal:"#0066ff",obstacle:"#333333"}},tts:{useOpenAI:K("VITE_USE_OPENAI_TTS","true")==="true",openAIVoice:K("VITE_OPENAI_TTS_VOICE","nova"),ttsServerUrl:K("VITE_TTS_SERVER_URL",bn),useCustomAudio:K("VITE_USE_CUSTOM_AUDIO","true")==="true",customAudioPath:K("VITE_CUSTOM_AUDIO_PATH","/audio/questionnaire/")},oneP2G:{minStepsBeforeNewGoal:1,distanceConditions:{CLOSER_TO_PLAYER1:"closer_to_player1",FARTHER_TO_PLAYER1:"farther_to_player1",EQUAL_TO_PLAYER1:"equal_to_player1",NO_NEW_GOAL:"no_new_goal"},distanceConstraint:{closerThreshold:2,fartherThreshold:2,equalTolerance:!1,allowEqualDistance:!1},goalConstraints:{minDistanceFromHuman:1,maxDistanceFromHuman:12,minDistanceBetweenGoals:3,avoidRectangleArea:!1,blockPathCheck:!1}},twoP3G:{minStepsBeforeNewGoal:1,newGoalMessageDuration:5e3,distanceConditions:{CLOSER_TO_PLAYER2:"closer_to_player2",CLOSER_TO_PLAYER1:"closer_to_player1",EQUAL_TO_BOTH:"equal_to_both",NO_NEW_GOAL:"no_new_goal"},distanceConstraint:{closerThreshold:2,allowEqualDistance:!1,maxDistanceIncrease:5},goalConstraints:{minDistanceFromHuman:1,maxDistanceFromHuman:12,avoidRectangleArea:!1,maintainDistanceSum:!1,blockPathCheck:!1}},multiplayer:{maxWaitTime:6e4,roomTimeout:3e5,reconnectAttempts:3,syncInterval:100,moveTimeout:1e4,synchronizedHumanTurns:!1,matchPlayReadyTimeout:1e4,fallbackAIType:vn,inactivityFallback:{enabled:!0,timeoutMs:4e4,checkIntervalMs:5e3},realTimeMovement:{moveThrottleDelay:100,immediateLocalUpdates:!0,stateSyncInterval:300,moveValidationTimeout:1e3,localMoveProtectionWindow:300}}},H={blank:0,player:1,ai_player:2,goal:3,obstacle:4},on={arrowup:{movement:[-1,0],name:"up"},arrowdown:{movement:[1,0],name:"down"},arrowleft:{movement:[0,-1],name:"left"},arrowright:{movement:[0,1],name:"right"}};(()=>{var x;try{if((x=i==null?void 0:i.debug)==null?void 0:x.disableConsoleLogs){const e=()=>{};typeof console<"u"&&(console.log=e,console.info=e,console.debug=e)}}catch{}})();const L={setPlayerType(x,n){const e=n==="ai"?"rl_joint":n;["human","gpt","rl_individual","rl_joint"].includes(e)&&(i.game.players[`player${x}`].type=e,x===2&&(e==="rl_joint"&&(i.game.agent.type="joint",i.game.studyRLCondition="joint"),e==="rl_individual"&&(i.game.agent.type="individual",i.game.studyRLCondition="individual")))},getPlayerType(x){return i.game.players[`player${x}`].type},isHumanAIMode(){return i.game.players.player2.type!=="human"},isHumanHumanMode(){return i.game.players.player2.type==="human"},setExperimentOrder(x){i.game.experiments.order=x},getUrlParam(x){try{if(typeof window>"u"||!window.location)return"";const n=new URLSearchParams(window.location.search);for(const e of x){const t=n.get(e);if(t)return t}}catch{}return""},getBooleanUrlParam(x){const n=this.getUrlParam(x).toLowerCase();return["1","true","yes","y"].includes(n)},getTestTrialOverride(){const x=Number.parseInt(this.getUrlParam(["testTrials","numTestTrials","trialCount"]),10);return Number.isInteger(x)&&x>0?x:this.getBooleanUrlParam(["skipDob","skipDOB","shortTest","oneTrial","singleTrial","testMode"])?1:null},getNumTrials(x){const n=this.getTestTrialOverride();return n||i.game.experiments.numTrials[x]||12},isSynchronizedHumanTurnsEnabled(x){var n;try{return String(x||"").toUpperCase().includes("2P")&&!!((n=i==null?void 0:i.multiplayer)!=null&&n.synchronizedHumanTurns)}catch{return!1}}},Sn=window.io;class jn{constructor(){this.socket=null,this.isConnected=!1,this.eventHandlers=new Map,this.reconnectAttempts=0,this.maxReconnectAttempts=i.server.reconnectAttempts}async connect(){return new Promise((n,e)=>{if(!Sn){e(new Error("Socket.IO not available. Please ensure the Socket.IO client is loaded."));return}this.socket=Sn(i.server.url,{transports:["websocket"],upgrade:!1}),this.socket.on("connect",()=>{console.log("Connected to server"),this.isConnected=!0,this.reconnectAttempts=0,n()}),this.socket.on("disconnect",t=>{console.log("Disconnected from server:",t),this.isConnected=!1,this.emit("disconnect",t),t!=="io server disconnect"&&this.handleReconnection()}),this.socket.on("connect_error",t=>{console.error("Connection error:",t),this.isConnected=!1,this.reconnectAttempts===0&&e(t)}),this.setupEventForwarding(),setTimeout(()=>{this.isConnected||e(new Error("Connection timeout"))},1e4)})}setupEventForwarding(){["room-joined","player-joined","room-full","player-disconnected","player-ready-status","match-play-ready-status","game-started","player-action","game-state-update","trial-completed","experiment-completed","chat-message","error"].forEach(e=>{this.socket.on(e,t=>{this.emit(e,t)})})}handleReconnection(){this.reconnectAttempts<this.maxReconnectAttempts?(this.reconnectAttempts++,console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})`),this.emit("reconnecting",{attempt:this.reconnectAttempts,maxAttempts:this.maxReconnectAttempts}),setTimeout(()=>{this.socket.connect()},i.server.reconnectDelay*this.reconnectAttempts)):(console.error("Max reconnection attempts reached"),this.emit("error",{message:"Connection lost. Please refresh the page or try reconnecting.",type:"connection_lost",canRetry:!0}))}async retryConnection(){if(this.socket&&!this.isConnected){console.log("Manually retrying connection..."),this.reconnectAttempts=0;try{return await this.connect(),!0}catch(n){return console.error("Manual reconnection failed:",n),!1}}return!1}async joinRoom(n={}){return new Promise((e,t)=>{const a=setTimeout(()=>{t(new Error("Join room timeout"))},1e4);this.socket.once("room-joined",r=>{clearTimeout(a),e(r)}),this.socket.once("error",r=>{clearTimeout(a),t(r)}),this.socket.emit("join-room",n)})}setPlayerReady(){this.isConnected&&this.socket.emit("player-ready")}setMatchPlayReady(){this.isConnected&&this.socket.emit("match-play-ready")}sendGameAction(n){this.isConnected&&this.socket.emit("game-action",{action:n})}syncGameState(n){this.isConnected&&this.socket.emit("sync-game-state",n)}sendTrialComplete(n){this.isConnected&&this.socket.emit("trial-complete",n)}sendExperimentComplete(n){this.isConnected&&this.socket.emit("experiment-complete",n)}sendChatMessage(n){this.isConnected&&this.socket.emit("chat-message",n)}on(n,e){this.eventHandlers.has(n)||this.eventHandlers.set(n,[]),this.eventHandlers.get(n).push(e)}off(n,e){if(this.eventHandlers.has(n)){const t=this.eventHandlers.get(n),a=t.indexOf(e);a>-1&&t.splice(a,1)}}emit(n,e){this.eventHandlers.has(n)&&this.eventHandlers.get(n).forEach(t=>{try{t(e)}catch(a){console.error(`Error in event handler for ${n}:`,a)}})}disconnect(){this.socket&&(this.socket.disconnect(),this.socket=null),this.isConnected=!1}}const I={isValidPosition(x){if(!x||!Array.isArray(x)||x.length<2)return!1;const[n,e]=x;return n>=0&&n<i.game.matrixSize&&e>=0&&e<i.game.matrixSize},isValidMove(x,n,e){const t=this.transition(n,e);if(!this.isValidPosition(t))return[0,0];const[a,r]=t;return x[a][r]===H.obstacle?[0,0]:e},transition(x,n){const[e,t]=x;return[e+n[0],t+n[1]]},calculateGridDistance(x,n){return!x||!n||!Array.isArray(x)||!Array.isArray(n)||x.length<2||n.length<2?1/0:Math.abs(x[0]-n[0])+Math.abs(x[1]-n[1])},isGoalReached(x,n){if(!x||!n||!Array.isArray(n))return!1;for(let e=0;e<n.length;e++)if(x[0]===n[e][0]&&x[1]===n[e][1])return!0;return!1},whichGoalReached(x,n){for(let e=0;e<n.length;e++)if(this.isGoalReached(x,[n[e]]))return e;return null},detectPlayerGoal(x,n,e,t){if(!n)return null;let a;if(typeof n=="string")switch(n){case"up":a=[-1,0];break;case"down":a=[1,0];break;case"left":a=[0,-1];break;case"right":a=[0,1];break;default:return null}else if(Array.isArray(n))a=n;else return null;if(a[0]===0&&a[1]===0)return null;const r=this.transition(x,a);let o=1/0,s=null;const l=[];for(let c=0;c<e.length;c++){const p=this.calculateGridDistance(r,e[c]);p<o?(o=p,s=c,l.length=0,l.push(c)):p===o&&l.push(c)}return l.length>1?t&&t.length>0?t[t.length-1]:null:s},updateMatrix(x,n,e,t){const a=x.map(r=>[...r]);return n>=0&&n<a.length&&e>=0&&e<a[0].length&&(a[n][e]=t),a},generateRandomPosition(x=[]){const n=i.game.matrixSize;let e,t=0;const a=100;do e=[Math.floor(Math.random()*n),Math.floor(Math.random()*n)],t++;while(t<a&&x.some(r=>r[0]===e[0]&&r[1]===e[1]));return e},createFallbackDesign(x){switch(console.log("Creating fallback design for:",x),x){case"1P1G":return{initPlayerGrid:[7,2],target1:[7,12],mapType:"1P1G"};case"1P2G":return{initPlayerGrid:[7,7],target1:[2,7],target2:[12,7],mapType:"1P2G"};case"2P2G":return{initPlayerGrid:[7,2],initAIGrid:[7,12],target1:[2,7],target2:[12,7],mapType:"2P2G"};case"2P3G":return{initPlayerGrid:[7,2],initAIGrid:[7,12],target1:[2,7],target2:[12,7],mapType:"2P3G"};default:return console.error("No fallback design for experiment type:",x),null}},calculateSuccessRate(x){if(!x||x.length===0)return 0;const n=x.filter(e=>e.collaborationSucceeded===!0||e.completed===!0).length;return Math.round(n/x.length*100)},formatDuration(x){const n=Math.floor(x/1e3),e=Math.floor(n/60),t=n%60;return e>0?`${e}:${t.toString().padStart(2,"0")}`:`${t}s`},deepClone(x){if(x===null||typeof x!="object")return x;if(x instanceof Date)return new Date(x);if(x instanceof Array)return x.map(n=>this.deepClone(n));if(typeof x=="object"){const n={};for(const e in x)x.hasOwnProperty(e)&&(n[e]=this.deepClone(x[e]));return n}}};class Bn{constructor(){this.currentState=null,this.trialData=null,this.experimentData=null,this.isMoving=!1,this.gameStartTime=0,this.stepCount=0,this.conditionSequences={},this.lastMoveTime=new Map,this.lastLocalMoveTime=new Map,this.moveCounter=0,this.lastSyncTime=0,this.syncPending=!1,this.reset()}reset(){this.currentState={gridMatrix:null,player1:null,player2:null,currentGoals:[],experimentType:null,trialIndex:0,gameMode:"human-ai"},this.clearRealTimeSync(),this.trialData={trialIndex:0,experimentType:null,partnerAgentType:null,distanceCondition:null,gptErrorEvents:[],player1Trajectory:[],player2Trajectory:[],player1Actions:[],player2Actions:[],player1RT:[],player2RT:[],aiInferredOtherGoals:[],currentPlayerIndex:[],player1StartPosition:null,player2StartPosition:null,initialGoalPositions:[],trialStartTime:0,player1GoalReachedStep:-1,player2GoalReachedStep:-1,player1CurrentGoal:[],player2CurrentGoal:[],player1FirstDetectedGoal:null,player2FirstDetectedGoal:null,player1FinalReachedGoal:null,player2FinalReachedGoal:null,firstDetectedSharedGoal:null,newGoalPresentedTime:null,newGoalPosition:null,newGoalConditionType:null,newGoalPresented:!1,isNewGoalCloserToPlayer2:null,collaborationSucceeded:void 0,partnerFallbackOccurred:!1,partnerFallbackReason:null,partnerFallbackStage:null,partnerFallbackTime:null,partnerFallbackAIType:null,humanPlayerIndex:null,aiPlayerIndex:null},this.experimentData={allTrialsData:[],currentExperiment:null,successThreshold:{consecutiveSuccesses:0,totalTrialsCompleted:0,experimentEndedEarly:!1,lastSuccessTrial:-1,successHistory:[]},fallbackEvents:[]},this.stepCount=0,this.gameStartTime=0,this.isMoving=!1,this.conditionSequences={}}initializeTrial(n,e,t){var a,r,o,s,l,c,p,d;this.trialData.trialIndex=n,this.trialData.experimentType=e,this.trialData.partnerAgentType=this.getPartnerAgentType(e),this.trialData.trialStartTime=Date.now(),this.gameStartTime=Date.now(),this.stepCount=0,this.isMoving=!1,this.trialData.player1Trajectory=[],this.trialData.player2Trajectory=[],this.trialData.player1Actions=[],this.trialData.player2Actions=[],this.trialData.player1RT=[],this.trialData.player2RT=[],this.trialData.currentPlayerIndex=[],this.trialData.gptErrorEvents=[],this.trialData.player1StartPosition=null,this.trialData.player2StartPosition=null,this.trialData.initialGoalPositions=[],this.trialData.player1CurrentGoal=[],this.trialData.player2CurrentGoal=[],this.trialData.player1FirstDetectedGoal=null,this.trialData.player2FirstDetectedGoal=null,this.trialData.player1FinalReachedGoal=null,this.trialData.player2FinalReachedGoal=null,this.trialData.firstDetectedSharedGoal=null,this.trialData.player1GoalReachedStep=-1,this.trialData.player2GoalReachedStep=-1,this.trialData.newGoalPresentedTime=null,this.trialData.newGoalPosition=null,this.trialData.newGoalConditionType=null,this.trialData.distanceCondition=null,this.trialData.newGoalPresented=!1,this.trialData.isNewGoalCloserToPlayer2=null,this.trialData.collaborationSucceeded=void 0,this.trialData._finalized=!1,this.trialData.partnerFallbackOccurred=!1,this.trialData.partnerFallbackReason=null,this.trialData.partnerFallbackStage=null,this.trialData.partnerFallbackTime=null;try{if(String(e||"").includes("2P")){const g=(o=(r=(a=i==null?void 0:i.game)==null?void 0:a.players)==null?void 0:r.player1)==null?void 0:o.type,u=(c=(l=(s=i==null?void 0:i.game)==null?void 0:s.players)==null?void 0:l.player2)==null?void 0:c.type;g==="human"&&u!=="human"?(this.trialData.humanPlayerIndex=0,this.trialData.aiPlayerIndex=1):u==="human"&&g!=="human"?(this.trialData.humanPlayerIndex=1,this.trialData.aiPlayerIndex=0):(this.trialData.humanPlayerIndex=null,this.trialData.aiPlayerIndex=null)}else this.trialData.humanPlayerIndex=0,this.trialData.aiPlayerIndex=null}catch{}if(e==="2P3G"){const g=this.getRandomDistanceConditionFor2P3G(n);this.trialData.newGoalConditionType=g,this.trialData.distanceCondition=g,this.currentState.newGoalConditionType=g,this.currentState.distanceCondition=g}else if(e==="1P2G"){const g=this.getRandomDistanceConditionFor1P2G(n);this.trialData.newGoalConditionType=g,this.trialData.distanceCondition=g,this.currentState.newGoalConditionType=g,this.currentState.distanceCondition=g}else if(e==="2P2G"){const g=(d=(p=i==null?void 0:i.twoP3G)==null?void 0:p.distanceConditions)==null?void 0:d.NO_NEW_GOAL;this.trialData.newGoalConditionType=g,this.trialData.distanceCondition=g,this.currentState.newGoalConditionType=g,this.currentState.distanceCondition=g}(e==="1P2G"||e==="2P3G")&&(console.log(`🗺️ Starting ${e} trial ${n}: new-goal condition =`,this.trialData.distanceCondition),console.log(`🤝 Partner agent type: ${this.trialData.partnerAgentType}`)),this.setupGridMatrix(t,e),this.currentState.experimentType=e,this.currentState.trialIndex=n;try{this.trialData.player1StartPosition=Array.isArray(this.currentState.player1)&&this.currentState.player1.length>=2?[...this.currentState.player1]:null,this.trialData.player2StartPosition=Array.isArray(this.currentState.player2)&&this.currentState.player2.length>=2?[...this.currentState.player2]:null,Array.isArray(this.currentState.currentGoals)?this.trialData.initialGoalPositions=this.currentState.currentGoals.filter(g=>Array.isArray(g)&&g.length>=2).map(g=>[...g]):this.trialData.initialGoalPositions=[]}catch{}}recordPartnerFallback({reason:n="disconnect",stage:e="in-game",at:t=Date.now(),fallbackAIType:a=null}={}){var r,o,s,l,c,p,d,g,u,h,y,f,T;try{let m="unknown";if(a)m=this.normalizeAITypeName(a);else try{const G=(s=(o=(r=i==null?void 0:i.game)==null?void 0:r.players)==null?void 0:o.player1)==null?void 0:s.type,P=(p=(c=(l=i==null?void 0:i.game)==null?void 0:l.players)==null?void 0:c.player2)==null?void 0:p.type,b=G!=="human"?G:P!=="human"?P:null;if(b==="gpt"){const v=(u=(g=(d=i==null?void 0:i.game)==null?void 0:d.agent)==null?void 0:g.gpt)==null?void 0:u.model;v&&String(v).trim().length>0?m=String(v):(console.warn("⚠️ GPT model not cached in CONFIG for fallback recording, using configured default"),m="gpt-4o")}else if(b==="rl_joint")m="joint-rl";else if(b==="rl_individual")m="individual-rl";else if(b==="ai")m=((y=(h=i==null?void 0:i.game)==null?void 0:h.agent)==null?void 0:y.type)==="individual"?"individual-rl":"joint-rl";else if(b&&b!=="human")m=String(b);else{const v=((f=i==null?void 0:i.multiplayer)==null?void 0:f.fallbackAIType)||"rl_joint";m=this.normalizeAITypeName(v)}}catch{const P=((T=i==null?void 0:i.multiplayer)==null?void 0:T.fallbackAIType)||"rl_joint";m=this.normalizeAITypeName(P)}if(this.trialData&&(this.trialData.partnerFallbackOccurred=!0,this.trialData.partnerFallbackReason=n,this.trialData.partnerFallbackStage=e,this.trialData.partnerFallbackTime=t,this.trialData.partnerFallbackAIType=m),this.experimentData){const G=this.currentState&&Number.isInteger(this.currentState.trialIndex)?this.currentState.trialIndex:-1,P=this.currentState&&this.currentState.experimentType||null,b={reason:n,stage:e,at:t,trialIndex:G,experimentType:P,aiType:m};Array.isArray(this.experimentData.fallbackEvents)?this.experimentData.fallbackEvents.push(b):this.experimentData.fallbackEvents=[b]}}catch{}}recordGptErrorEvent({phase:n="independent",error:e="",humanDirection:t=null,fallback:a=null,fallbackDirection:r=null}={}){try{const o={step:this.stepCount,timeMs:Date.now()-(this.gameStartTime||Date.now()),phase:n,error:String(e||""),humanDirection:t||null,fallback:a||null,fallbackDirection:r||null};Array.isArray(this.trialData.gptErrorEvents)?this.trialData.gptErrorEvents.push(o):this.trialData.gptErrorEvents=[o]}catch{}}setupGridMatrix(n,e){if(!n){console.error("Invalid design provided to setupGridMatrix:",n);return}const t=i.game.matrixSize;if(this.currentState.gridMatrix=Array(t).fill(0).map(()=>Array(t).fill(0)),n.initPlayerGrid&&n.initPlayerGrid.length>=2){const[a,r]=n.initPlayerGrid;this.currentState.gridMatrix[a][r]=H.player,this.currentState.player1=[a,r]}if(e&&e.includes("2P")&&n.initAIGrid&&n.initAIGrid.length>=2){const[a,r]=n.initAIGrid;this.currentState.gridMatrix[a][r]=H.ai_player,this.currentState.player2=[a,r]}else this.currentState.player2=null;if(this.currentState.currentGoals=[],n.target1&&n.target1.length>=2){const[a,r]=n.target1;this.currentState.gridMatrix[a][r]=H.goal,this.currentState.currentGoals.push([a,r])}if(n.target2&&n.target2.length>=2){const[a,r]=n.target2;this.currentState.gridMatrix[a][r]=H.goal,this.currentState.currentGoals.push([a,r])}}addGoal(n){if(!n||n.length<2)return;const[e,t]=n;if(!(!this.currentState||!this.currentState.gridMatrix)&&!(e<0||e>=this.currentState.gridMatrix.length)&&!(t<0||t>=this.currentState.gridMatrix[0].length)){if(this.currentState.currentGoals.some(a=>a[0]===e&&a[1]===t)){console.log(`🔧 [GOAL] Duplicate goal at [${e}, ${t}] not added`);return}console.log(`🎯 [GOAL] Adding goal at [${e}, ${t}]. Total goals: ${this.currentState.currentGoals.length+1}`),this.currentState.gridMatrix[e][t]=H.goal,this.currentState.currentGoals.push([e,t])}}markNewGoalPresented(n,e,t={}){if(!this.trialData)return;this.trialData.newGoalPresented=!0,this.trialData.newGoalPresentedTime=this.stepCount,this.trialData.newGoalPosition=n?[...n]:null;const a=e||this.trialData.newGoalConditionType||this.trialData.distanceCondition||null;this.trialData.newGoalConditionType=a,this.trialData.distanceCondition=a,this.currentState&&(this.currentState.newGoalConditionType=a,this.currentState.distanceCondition=a),typeof t.isNewGoalCloserToPlayer2=="boolean"&&(this.trialData.isNewGoalCloserToPlayer2=t.isNewGoalCloserToPlayer2)}processPlayerMove(n,e,t=null){var r;if(this.isMoving)return{success:!1,reason:"already_moving"};const a=n===1?this.currentState.player1:this.currentState.player2;if(!a)return{success:!1,reason:"invalid_player"};if(I.isGoalReached(a,this.currentState.currentGoals))return{success:!1,reason:"already_at_goal"};this.isMoving=!0;try{const o=(r=on[`arrow${e}`])==null?void 0:r.movement;if(!o)return{success:!1,reason:"invalid_direction"};(this.gameStartTime===0||Date.now()-this.gameStartTime>6e4)&&(console.warn("Invalid gameStartTime detected, resetting to current time"),this.gameStartTime=Date.now());const s=Date.now()-this.gameStartTime;this.recordPlayerMove(n,o,s,t);const l=I.isValidMove(this.currentState.gridMatrix,a,o),c=I.transition(a,l);return this.updatePlayerPosition(n,a,c),this.detectAndRecordGoals(n,o),this.stepCount++,{success:!0,trialComplete:this.checkTrialCompletion(),newPosition:c,stepCount:this.stepCount}}finally{setTimeout(()=>{this.isMoving=!1},100)}}processSynchronizedMoves(n,e){var t,a;if(this.isMoving)return{success:!1,reason:"already_moving"};this.isMoving=!0;try{const r={success:!0,trialComplete:!1},o=this.currentState.player1,s=this.currentState.player2,l=n?(t=on[`arrow${n}`])==null?void 0:t.movement:null,c=e?(a=on[`arrow${e}`])==null?void 0:a.movement:null,p=Date.now()-this.gameStartTime;let d=o;if(o&&l&&!I.isGoalReached(o,this.currentState.currentGoals)){this.recordPlayerMove(1,l,p);const u=I.isValidMove(this.currentState.gridMatrix,o,l);d=I.transition(o,u)}let g=s;if(s&&c&&!I.isGoalReached(s,this.currentState.currentGoals)){this.recordPlayerMove(2,c,p);const u=I.isValidMove(this.currentState.gridMatrix,s,c);g=I.transition(s,u)}return o&&d&&d!==o&&this.updatePlayerPosition(1,o,d),s&&g&&g!==s&&this.updatePlayerPosition(2,s,g),o&&l&&this.detectAndRecordGoals(1,l),s&&c&&this.detectAndRecordGoals(2,c),this.stepCount++,r.trialComplete=this.checkTrialCompletion(),r.newPositions={player1:d,player2:g},r}finally{setTimeout(()=>{this.isMoving=!1},100)}}processSynchronizedMovesMapped(n,e,t){var a,r;if(this.isMoving)return{success:!1,reason:"already_moving"};this.isMoving=!0;try{const o={success:!0,trialComplete:!1},s=this.currentState.player1,l=this.currentState.player2,c=e?(a=on[`arrow${e}`])==null?void 0:a.movement:null,p=t?(r=on[`arrow${t}`])==null?void 0:r.movement:null,d=n===1?c:p,g=n===2?c:p,u=Date.now()-this.gameStartTime;let h=s;if(s&&d&&!I.isGoalReached(s,this.currentState.currentGoals)){this.recordPlayerMove(1,d,u);const f=I.isValidMove(this.currentState.gridMatrix,s,d);h=I.transition(s,f)}let y=l;if(l&&g&&!I.isGoalReached(l,this.currentState.currentGoals)){this.recordPlayerMove(2,g,u);const f=I.isValidMove(this.currentState.gridMatrix,l,g);y=I.transition(l,f)}return s&&h&&h!==s&&this.updatePlayerPosition(1,s,h),l&&y&&y!==l&&this.updatePlayerPosition(2,l,y),s&&d&&this.detectAndRecordGoals(1,d),l&&g&&this.detectAndRecordGoals(2,g),this.stepCount++,o.trialComplete=this.checkTrialCompletion(),o}finally{setTimeout(()=>{this.isMoving=!1},100)}}updatePlayerPosition(n,e,t){const a=n===1?H.player:H.ai_player;this.currentState.gridMatrix[e[0]][e[1]]=H.blank,this.currentState.gridMatrix[t[0]][t[1]]=a,n===1?this.currentState.player1=[...t]:this.currentState.player2=[...t]}recordPlayerMove(n,e,t,a=null){const r=n===1?this.currentState.player1:this.currentState.player2;n===1?(this.trialData.player1Actions.push(e),this.trialData.player1Trajectory.push([...r]),this.trialData.player1RT.push(t)):(this.trialData.player2Actions.push(e),this.trialData.player2Trajectory.push([...r]),this.trialData.player2RT.push(t)),a!==null?this.trialData.currentPlayerIndex.push(a):this.trialData.currentPlayerIndex.push(n===1?0:1)}recordAIInferredOtherGoal(n){try{Array.isArray(this.trialData.aiInferredOtherGoals)||(this.trialData.aiInferredOtherGoals=[]),this.trialData.aiInferredOtherGoals.push(Array.isArray(n)&&n.length>=2?[n[0],n[1]]:null)}catch{}}detectAndRecordGoals(n,e){const t=n===1?this.currentState.player1:this.currentState.player2,a=n===1?this.trialData.player1CurrentGoal:this.trialData.player2CurrentGoal,r=I.detectPlayerGoal(t,e,this.currentState.currentGoals,a);if(n===1?(this.trialData.player1CurrentGoal.push(r),r!==null&&this.trialData.player1FirstDetectedGoal===null&&(this.trialData.player1FirstDetectedGoal=r)):(this.trialData.player2CurrentGoal.push(r),r!==null&&this.trialData.player2FirstDetectedGoal===null&&(this.trialData.player2FirstDetectedGoal=r)),this.currentState.experimentType==="2P3G"&&this.trialData.player1CurrentGoal.length>0&&this.trialData.player2CurrentGoal.length>0){const o=this.trialData.player1CurrentGoal[this.trialData.player1CurrentGoal.length-1],s=this.trialData.player2CurrentGoal[this.trialData.player2CurrentGoal.length-1];o!==null&&s!==null&&o===s&&this.trialData.firstDetectedSharedGoal===null&&(this.trialData.firstDetectedSharedGoal=o)}}checkTrialCompletion(){const n=I.isGoalReached(this.currentState.player1,this.currentState.currentGoals),e=this.currentState.player2?I.isGoalReached(this.currentState.player2,this.currentState.currentGoals):!0;if(n&&this.trialData.player1GoalReachedStep===-1&&(this.trialData.player1GoalReachedStep=this.stepCount,this.trialData.player1FinalReachedGoal=I.whichGoalReached(this.currentState.player1,this.currentState.currentGoals)),this.currentState.player2&&e&&this.trialData.player2GoalReachedStep===-1&&(this.trialData.player2GoalReachedStep=this.stepCount,this.trialData.player2FinalReachedGoal=I.whichGoalReached(this.currentState.player2,this.currentState.currentGoals)),this.currentState.experimentType.startsWith("1P"))return n;if(n&&e){const t=this.trialData.player1FinalReachedGoal,a=this.trialData.player2FinalReachedGoal;return this.trialData.collaborationSucceeded=t===a&&t!==null,!0}return this.stepCount>=i.game.maxGameLength}finalizeTrial(n){var e,t,a,r;if(this.trialData._finalized){console.warn("Trial already finalized, skipping duplicate finalization");return}try{this.currentState&&typeof this.currentState.experimentType=="string"&&this.currentState.experimentType.includes("2P")&&typeof this.trialData.collaborationSucceeded!="boolean"&&(this.trialData.collaborationSucceeded=!1)}catch{}this.trialData.completed=!!n,this.trialData.endTime=Date.now(),this.trialData.totalSteps=this.stepCount;try{if(this.currentState&&String(this.currentState.experimentType||"").includes("2P")){const s=String(this.trialData.partnerAgentType||"").trim(),l=this.getPartnerAgentType(this.currentState.experimentType);l&&s!==l&&(this.trialData.partnerAgentType=l);const c=(a=(t=(e=i==null?void 0:i.game)==null?void 0:e.agent)==null?void 0:t.gpt)==null?void 0:a.model;this.trialData.partnerFallbackOccurred&&c&&/^gpt$/i.test(String(this.trialData.partnerFallbackAIType||""))&&(this.trialData.partnerFallbackAIType=c)}}catch{}try{if(this.trialData.newGoalPresented&&(!this.trialData.newGoalPosition||this.trialData.newGoalPosition.length<2)){const o=Array.isArray((r=this.currentState)==null?void 0:r.currentGoals)?this.currentState.currentGoals:[];if(o.length>=3){const s=o[o.length-1];Array.isArray(s)&&s.length>=2&&(this.trialData.newGoalPosition=[s[0],s[1]])}}}catch{}this.fixMissingGoalValues(),this.experimentData.allTrialsData.push({...this.trialData}),this.trialData._finalized=!0,this.updateSuccessThreshold(n)}fixMissingGoalValues(){var e;const n=((e=this.currentState)==null?void 0:e.experimentType)||"";n.startsWith("1P")?this.trialData.player2FinalReachedGoal=-1:n.startsWith("2P")&&(this.trialData.player1GoalReachedStep===-1&&this.trialData.player1FinalReachedGoal===null&&(this.trialData.player1FinalReachedGoal=-1),this.trialData.player2GoalReachedStep===-1&&this.trialData.player2FinalReachedGoal===null&&(this.trialData.player2FinalReachedGoal=-1))}normalizeAITypeName(n){var t,a,r,o,s,l,c,p,d;if(!n||typeof n!="string")return"unknown";switch(n.toLowerCase().trim()){case"gpt":const g=(r=(a=(t=i==null?void 0:i.game)==null?void 0:t.agent)==null?void 0:a.gpt)==null?void 0:r.model;return g&&String(g).trim()?String(g):"gpt-4o";case"rl_joint":case"joint":return"joint-rl";case"rl_individual":case"individual":return"individual-rl";case"ai":return((s=(o=i==null?void 0:i.game)==null?void 0:o.agent)==null?void 0:s.type)==="individual"?"individual-rl":"joint-rl";case"human":console.error('❌ BUG: Attempted to set partnerFallbackAIType to "human" - using default instead');const u=((l=i==null?void 0:i.multiplayer)==null?void 0:l.fallbackAIType)||"rl_joint";if(u==="rl_joint")return"joint-rl";if(u==="rl_individual")return"individual-rl";if(u==="gpt"){const h=(d=(p=(c=i==null?void 0:i.game)==null?void 0:c.agent)==null?void 0:p.gpt)==null?void 0:d.model;return h&&String(h).trim()?String(h):"gpt-4o"}return"joint-rl";default:return n}}updateSuccessThreshold(n){const e=this.experimentData.successThreshold;e.totalTrialsCompleted++,e.successHistory.push(n),n?(e.consecutiveSuccesses++,e.lastSuccessTrial=e.totalTrialsCompleted-1):e.consecutiveSuccesses=0,e.consecutiveSuccesses>=i.game.successThreshold.consecutiveSuccessesRequired&&e.totalTrialsCompleted>=i.game.successThreshold.minTrialsBeforeCheck&&(e.experimentEndedEarly=!0)}getPartnerAgentType(n){var e,t,a,r,o,s,l,c,p,d,g;try{if(!String(n||"").includes("2P"))return"none";const u=(a=(t=(e=i==null?void 0:i.game)==null?void 0:e.players)==null?void 0:t.player1)==null?void 0:a.type,h=(s=(o=(r=i==null?void 0:i.game)==null?void 0:r.players)==null?void 0:o.player2)==null?void 0:s.type,y=u!=="human"?u:h!=="human"?h:"human";if(y==="human")return"human";if(y==="gpt"){const f=(p=(c=(l=i==null?void 0:i.game)==null?void 0:l.agent)==null?void 0:c.gpt)==null?void 0:p.model;return f&&String(f).trim().length>0?String(f):(console.warn("⚠️ GPT model not cached in CONFIG, using fallback logic"),"gpt-4o")}return y==="rl_joint"?"joint-rl":y==="rl_individual"?"individual-rl":y==="ai"?((g=(d=i==null?void 0:i.game)==null?void 0:d.agent)==null?void 0:g.type)==="individual"?"individual-rl":"joint-rl":String(y||"unknown")}catch{return"unknown"}}getSessionSeedInt(){try{if(typeof window<"u"&&Number.isInteger(window.__SESSION_SEED__))return window.__SESSION_SEED__}catch{}return null}seededShuffle(n,e){if(!Array.isArray(n)||n.length<=1)return n;if(!Number.isInteger(e))return this.randomShuffle(n);const t=n.slice();let a=e>>>0||1;const r=4294967296,o=1664525,s=1013904223,l=()=>(a=Math.imul(o,a)+s>>>0,a/r);for(let c=t.length-1;c>0;c--){const p=Math.floor(l()*(c+1));[t[c],t[p]]=[t[p],t[c]]}return t}randomShuffle(n){const e=n.slice();for(let t=e.length-1;t>0;t--){const a=Math.floor(Math.random()*(t+1));[e[t],e[a]]=[e[a],e[t]]}return e}getRandomDistanceConditionFor2P3G(n){var r,o,s;const e="2P3G",t=L.getNumTrials(e);if(!this.conditionSequences[e]){const c=((s=(o=(r=i==null?void 0:i.game)==null?void 0:r.players)==null?void 0:o.player2)==null?void 0:s.type)==="human"?this.getSessionSeedInt()??null:null;this.conditionSequences[e]=this.generateBalancedConditionSequence(Object.values(i.twoP3G.distanceConditions),t,c),console.log(`🎲 Generated balanced condition sequence for ${e}:`,this.conditionSequences[e])}const a=this.conditionSequences[e];return a[n%a.length]}getRandomDistanceConditionFor1P2G(n){const e="1P2G",t=L.getNumTrials(e);this.conditionSequences[e]||(this.conditionSequences[e]=this.generateBalancedConditionSequence(Object.values(i.oneP2G.distanceConditions),t),console.log(`🎲 Generated balanced condition sequence for ${e}:`,this.conditionSequences[e]));const a=this.conditionSequences[e];return a[n%a.length]}generateBalancedConditionSequence(n,e,t=null){if(!Array.isArray(n)||n.length===0||e<=0)return[];const a=n.length,r=Math.floor(e/a);let o=e%a;const s=[];for(let d=0;d<a;d++)for(let g=0;g<r;g++)s.push(n[d]);let l=[...Array(a).keys()];l=Number.isInteger(t)?this.seededShuffle(l,t):this.randomShuffle(l);let c=0;for(;o>0;)s.push(n[l[c%a]]),c++,o--;return Number.isInteger(t)?this.seededShuffle(s,t^2654435769):this.randomShuffle(s)}syncState(n){var r,o,s,l,c;try{const p=Array.isArray((r=this.currentState)==null?void 0:r.currentGoals)?this.currentState.currentGoals:[],d=Array.isArray(n==null?void 0:n.currentGoals)?n.currentGoals:null;if(d&&Array.isArray(d)&&Array.isArray(p)&&d.length>p.length&&(((o=this.currentState)==null?void 0:o.experimentType)==="2P3G"||(n==null?void 0:n.experimentType)==="2P3G")&&this.trialData&&this.trialData.newGoalPresented===!1){const g=(h,y)=>Array.isArray(h)&&Array.isArray(y)&&h[0]===y[0]&&h[1]===y[1],u=d.find(h=>!p.some(y=>g(y,h)));if(Array.isArray(u)&&u.length===2){const h=n&&(n.distanceCondition||n.newGoalConditionType)||this.trialData.distanceCondition||this.trialData.newGoalConditionType||null;this.markNewGoalPresented([...u],h,{})}}}catch{}const e={...this.currentState,...n},t=i.multiplayer.realTimeMovement,a=Date.now();if(t&&this.currentState&&[1,2].forEach(p=>{const d=`player${p}`,g=this.currentState[d],u=n[d];if(g&&u){const h=this.lastMoveTime.get(p)||0,y=a-h,f=t.localMoveProtectionWindow;if(y<f&&(console.log(`🔧 [ROLLBACK FIX] Preserving local position for player${p} (moved ${y}ms ago)`),e[d]=g,e.gridMatrix&&Array.isArray(g)&&g.length===2)){const[T,m]=g;T>=0&&T<e.gridMatrix.length&&m>=0&&m<e.gridMatrix[0].length&&(Array.isArray(u)&&(u[0]!==g[0]||u[1]!==g[1])&&(e.gridMatrix[u[0]][u[1]]=H.blank),e.gridMatrix[T][m]=p)}}}),((s=this.currentState)==null?void 0:s.experimentType)==="2P3G"||(n==null?void 0:n.experimentType)==="2P3G"){const p=Array.isArray((l=this.currentState)==null?void 0:l.currentGoals)?this.currentState.currentGoals:[],d=Array.isArray(n==null?void 0:n.currentGoals)?n.currentGoals:[];p.length>d.length?(console.log(`🔧 [SYNC FIX] Preserving local goals (${p.length}) over remote goals (${d.length})`),e.currentGoals=p,(c=this.currentState)!=null&&c.gridMatrix&&(e.gridMatrix=this.currentState.gridMatrix)):d.length>p.length&&(console.log(`🔧 [SYNC FIX] Accepting remote goals (${d.length}) over local goals (${p.length})`),n!=null&&n.gridMatrix&&(e.gridMatrix=n.gridMatrix))}this.currentState=e}getCurrentState(){return{...this.currentState}}processPlayerMoveRealTime(n,e,t=Date.now(),a=!1,r=null){const o=i.multiplayer.realTimeMovement,s=this.lastMoveTime.get(n)||0;if(t-s<o.moveThrottleDelay)return{success:!1,reason:"throttled"};this.lastMoveTime.set(n,t),a&&this.lastLocalMoveTime.set(n,t);const l=this.isMoving;let c;try{this.isMoving=!1,c=this.processPlayerMove(n,e,r)}finally{this.isMoving=l}return c.timestamp=t,c.isLocal=a,c.moveId=`move_${this.moveCounter++}_${n}_${t}`,c}shouldSyncState(){const n=i.multiplayer.realTimeMovement;return Date.now()-this.lastSyncTime>n.stateSyncInterval}hasRecentLocalMoves(){const n=Date.now(),e=250;for(const[t,a]of this.lastLocalMoveTime.entries())if(n-a<e)return!0;return!1}markStateSynced(){this.lastSyncTime=Date.now()}clearRealTimeSync(){this.lastMoveTime.clear(),this.lastLocalMoveTime.clear(),this.moveCounter=0,this.lastSyncTime=0,this.syncPending=!1}getCurrentTrialData(){return{...this.trialData}}getTrialData(){return{...this.trialData}}getExperimentData(){return{...this.experimentData}}}class Nn{constructor(){this.canvas=null,this.ctx=null,this.cellSize=i.visual.cellSize,this.canvasSize=i.visual.canvasSize,this.padding=i.visual.padding,this.effectiveCellSize=this.cellSize+this.padding}createCanvas(){this.canvas=document.createElement("canvas"),this.canvas.width=this.canvasSize,this.canvas.height=this.canvasSize,this.canvas.style.border="2px solid #333",this.canvas.style.backgroundColor=i.visual.colors.background,this.ctx=this.canvas.getContext("2d");try{this.applyResponsiveSizing()}catch{}return this.canvas}applyResponsiveSizing(){var T,m,G;if(!this.canvas)return;const n=i.game.matrixSize,e=typeof window<"u"&&window.devicePixelRatio?window.devicePixelRatio:1,t=this.canvas.parentElement,a=(m=(T=this.canvas).closest)==null?void 0:m.call(T,'[data-grid-fit-container="true"]'),r=typeof window<"u"?window.innerWidth||0:this.canvasSize,o=typeof window<"u"?Math.floor(((G=window.visualViewport)==null?void 0:G.height)||window.innerHeight||0):this.canvasSize,s=Math.min(r,o),l=(a==null?void 0:a.clientWidth)||(t==null?void 0:t.clientWidth)||s,c=a?Number(a.getAttribute("data-grid-reserved-height")||170):0,p=c>0?Math.max(220,o-c):s*.85,d=Number(i.visual.canvasSize)||this.canvasSize,g=Math.min(l-16,r-32),u=Math.max(200,Math.floor(Math.min(p,g,d)));let h=Math.floor((u-(n+1)*this.padding)/n);h=Math.max(10,h);const y=n*h+(n+1)*this.padding;this.cellSize=h,this.effectiveCellSize=this.cellSize+this.padding,this.canvasSize=y,this.canvas.style.width=`${y}px`,this.canvas.style.height=`${y}px`;const f=Math.floor(y*e);(this.canvas.width!==f||this.canvas.height!==f)&&(this.canvas.width=f,this.canvas.height=f),this.ctx||(this.ctx=this.canvas.getContext("2d")),this.ctx&&typeof this.ctx.setTransform=="function"&&this.ctx.setTransform(e,0,0,e,0,0)}render(n,e){!n||!e||!e.gridMatrix||(this.canvas=n,this.ctx=n.getContext("2d"),this.gameState=e,this.applyResponsiveSizing(),this.ctx.fillStyle=i.visual.colors.grid,this.ctx.fillRect(0-this.padding,0-this.padding,this.canvasSize+this.padding,this.canvasSize+this.padding),this.drawGrid(),this.drawGameObjects(e.gridMatrix))}drawGrid(){const n=i.game.matrixSize;for(let e=0;e<n;e++)for(let t=0;t<n;t++)this.ctx.fillStyle=i.visual.colors.background,this.ctx.fillRect(t*this.effectiveCellSize+this.padding,e*this.effectiveCellSize+this.padding,this.cellSize,this.cellSize)}drawGameObjects(n){const e=i.game.matrixSize;for(let a=0;a<e;a++)for(let r=0;r<e;r++){const o=n[a][r];o===H.obstacle&&this.drawCell(a,r,o)}this.drawGoals();const t=this.getPlayerPositions(n);this.drawPlayersWithOverlap(t)}drawGoals(){if(this.gameState&&this.gameState.currentGoals&&Array.isArray(this.gameState.currentGoals)){for(const n of this.gameState.currentGoals)if(n&&Array.isArray(n)&&n.length>=2){const[e,t]=n;this.drawGoalWithPlayerCheck(e,t)}}else{const n=i.game.matrixSize;for(let e=0;e<n;e++)for(let t=0;t<n;t++)this.gameState.gridMatrix[e][t]===H.goal&&this.drawGoalWithPlayerCheck(e,t)}}drawGoalWithPlayerCheck(n,e){const t=this.isPlayerAtPosition(n,e),a=e*this.effectiveCellSize+this.padding,r=n*this.effectiveCellSize+this.padding;this.ctx.save(),this.ctx.fillStyle=i.visual.colors.goal,t&&(this.ctx.globalAlpha=.7),this.ctx.fillRect(a,r,this.cellSize,this.cellSize),this.ctx.restore()}isPlayerAtPosition(n,e){return this.gameState?!!(this.gameState.player1&&this.gameState.player1.length===2&&this.gameState.player1[0]===n&&this.gameState.player1[1]===e||this.gameState.player2&&this.gameState.player2.length===2&&this.gameState.player2[0]===n&&this.gameState.player2[1]===e):!1}getPlayerPositions(n){const e=i.game.matrixSize,t=[];for(let a=0;a<e;a++)for(let r=0;r<e;r++){const o=n[a][r];(o===H.player||o===H.ai_player)&&t.push({row:a,col:r,type:o})}return this.gameState&&(t.length=0,this.gameState.player1&&this.gameState.player1.length===2&&t.push({row:this.gameState.player1[0],col:this.gameState.player1[1],type:H.player}),this.gameState.player2&&this.gameState.player2.length===2&&t.push({row:this.gameState.player2[0],col:this.gameState.player2[1],type:H.ai_player})),t}drawPlayersWithOverlap(n){const e=new Map;for(const t of n){const a=`${t.row},${t.col}`;e.has(a)||e.set(a,[]),e.get(a).push(t)}for(const[t,a]of e){const[r,o]=t.split(",").map(Number);this.drawOverlappingPlayers(r,o,a)}}drawCell(n,e,t){const a=e*this.effectiveCellSize+this.padding,r=n*this.effectiveCellSize+this.padding;switch(a+this.cellSize/2,r+this.cellSize/2,this.cellSize*.35,this.ctx.save(),t){case H.player:case H.ai_player:break;case H.goal:this.ctx.fillStyle=i.visual.colors.goal,this.ctx.fillRect(a,r,this.cellSize,this.cellSize);break;case H.obstacle:this.ctx.fillStyle=i.visual.colors.obstacle,this.ctx.fillRect(a+2,r+2,this.cellSize-4,this.cellSize-4);break}this.ctx.restore()}drawOverlappingPlayers(n,e,t){const a=e*this.effectiveCellSize+this.padding,r=n*this.effectiveCellSize+this.padding,o=a+this.cellSize/2,s=r+this.cellSize/2,l=this.cellSize*.35,c=this.cellSize*.15;if(this.ctx.save(),t.length===1){const d=t[0].type===H.player?i.visual.colors.player1:i.visual.colors.player2;this.ctx.fillStyle=d,this.ctx.beginPath(),this.ctx.arc(o,s,l,0,2*Math.PI),this.ctx.fill()}else if(t.length>=2){const d=t[0].type===H.player?i.visual.colors.player1:i.visual.colors.player2;this.ctx.fillStyle=d,this.ctx.beginPath(),this.ctx.arc(o-c,s,l,0,2*Math.PI),this.ctx.fill();const u=t[1].type===H.player?i.visual.colors.player1:i.visual.colors.player2;this.ctx.fillStyle=u,this.ctx.beginPath(),this.ctx.arc(o+c,s,l,0,2*Math.PI),this.ctx.fill()}this.ctx.restore()}highlightCell(n,e,t="#ffff00",a=.3){if(!this.ctx)return;const r=e*this.cellSize,o=n*this.cellSize;this.ctx.save(),this.ctx.fillStyle=t,this.ctx.globalAlpha=a,this.ctx.fillRect(r,o,this.cellSize,this.cellSize),this.ctx.restore()}drawTrajectory(n,e="#ff0000",t=.5){if(!(!this.ctx||!n||n.length<2)){this.ctx.save(),this.ctx.strokeStyle=e,this.ctx.globalAlpha=t,this.ctx.lineWidth=3,this.ctx.lineCap="round",this.ctx.lineJoin="round",this.ctx.beginPath();for(let a=0;a<n.length;a++){const[r,o]=n[a],s=o*this.cellSize+this.cellSize/2,l=r*this.cellSize+this.cellSize/2;a===0?this.ctx.moveTo(s,l):this.ctx.lineTo(s,l)}this.ctx.stroke(),this.ctx.restore()}}drawNewGoalIndicator(n,e){if(!this.ctx)return;const t=e*this.cellSize,a=n*this.cellSize,r=t+this.cellSize/2,o=a+this.cellSize/2;this.ctx.save();const s=Date.now()*.005,l=(Math.sin(s)+1)*.3+.2;this.ctx.fillStyle="#ffff00",this.ctx.globalAlpha=l,this.ctx.fillRect(t,a,this.cellSize,this.cellSize),this.ctx.globalAlpha=1,this.ctx.fillStyle="#ff0000",this.ctx.font="12px Arial",this.ctx.textAlign="center",this.ctx.fillText("NEW!",r,o-15),this.ctx.restore()}animateMove(n,e,t,a,r,o=200){return new Promise(s=>{if(!this.ctx){s();return}const l=Date.now(),c=e*this.cellSize+this.cellSize/2,p=n*this.cellSize+this.cellSize/2,d=a*this.cellSize+this.cellSize/2,g=t*this.cellSize+this.cellSize/2,u=()=>{const h=Date.now()-l,y=Math.min(h/o,1),f=1-Math.pow(1-y,3),T=c+(d-c)*f,m=p+(g-p)*f;this.ctx.save(),this.ctx.globalAlpha=.8;const G=this.cellSize*.35;r===H.player?this.ctx.fillStyle=i.visual.colors.player1:r===H.ai_player&&(this.ctx.fillStyle=i.visual.colors.player2),this.ctx.beginPath(),this.ctx.arc(T,m,G,0,2*Math.PI),this.ctx.fill(),this.ctx.restore(),y<1?requestAnimationFrame(u):s()};u()})}getCellFromPixel(n,e){const t=Math.floor(n/this.cellSize),a=Math.floor(e/this.cellSize);return a>=0&&a<i.game.matrixSize&&t>=0&&t<i.game.matrixSize?{row:a,col:t}:null}getPixelFromCell(n,e){return{x:e*this.cellSize+this.cellSize/2,y:n*this.cellSize+this.cellSize/2}}}class Fn{constructor(n){this.container=n,this.renderer=new Nn,this.eventHandlers=new Map,this.currentScreen=null,this.gameCanvas=null,this.keyboardHandler=null,this.playerIndex=0,this.gameMode="human-ai",this.lastGameState=null,this.handleResize=null}cleanupCanvas(){this.handleResize&&(window.removeEventListener("resize",this.handleResize),this.handleResize=null),this.gameCanvas=null,this.lastGameState=null}on(n,e){this.eventHandlers.has(n)||this.eventHandlers.set(n,[]),this.eventHandlers.get(n).push(e)}off(n,e){if(this.eventHandlers.has(n)){const t=this.eventHandlers.get(n),a=t.indexOf(e);a>-1&&t.splice(a,1)}}emit(n,e){this.eventHandlers.has(n)&&this.eventHandlers.get(n).forEach(t=>{try{t(e)}catch(a){console.error(`Error in UI event handler for ${n}:`,a)}})}setPlayerInfo(n,e){this.playerIndex=n,this.gameMode=e}showMainScreen(){this.cleanupCanvas(),this.currentScreen="main",this.container.innerHTML=`
      <div style="display: flex; align-items: center; justify-content: center; min-height: 100vh; background: #f8f9fa;">
        <div style="text-align: center; max-width: 600px; padding: 20px;">
          <h1 style="margin-bottom: 20px;">Grid World Collaboration Experiment</h1>
          <p style="font-size: 18px; margin-bottom: 30px;">
            Welcome to the grid-based collaboration game. You'll work with an AI partner
            to navigate through different scenarios and reach goals together.
          </p>
          <div style="margin-bottom: 30px;">
            <h3>Instructions:</h3>
            <ul style="text-align: left; display: inline-block;">
              <li>Use arrow keys (↑ ↓ ← →) to move</li>
              <li>You are the red player ⚫</li>
              <li>Your partner is the purple player ⚫</li>
              <li>Work together to reach the green goals ⚫</li>
            </ul>
          </div>
          <button id="start-experiment" style="
            padding: 15px 30px;
            font-size: 18px;
            background: #007bff;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
          ">
            Start Experiment
          </button>
        </div>
      </div>
    `,document.getElementById("start-experiment").addEventListener("click",()=>{this.emit("start-experiment",i.game.experiments.order[0])})}showLobbyScreen(){this.cleanupCanvas(),this.currentScreen="lobby",this.container.innerHTML=`
      <div style="display: flex; align-items: center; justify-content: center; min-height: 100vh; background: #f8f9fa;">
        <div style="text-align: center; max-width: 500px; padding: 20px;">
          <h1 style="margin-bottom: 20px;">Multiplayer Lobby</h1>
          <div id="lobby-info" style="margin-bottom: 30px;">
            <p>Connecting to game room...</p>
          </div>
          <div id="player-list" style="margin-bottom: 30px;">
            <!-- Player list will be populated here -->
          </div>
          <button id="ready-button" style="
            padding: 15px 30px;
            font-size: 18px;
            background: #28a745;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            display: none;
          ">
            Ready to Play
          </button>
          <div id="waiting-message" style="display: none; color: #666; margin-top: 20px;">
            Waiting for other player to be ready...
          </div>
        </div>
      </div>
    `,document.getElementById("ready-button").addEventListener("click",()=>{this.emit("player-ready"),document.getElementById("ready-button").style.display="none",document.getElementById("waiting-message").style.display="block"})}showGameScreen(){this.currentScreen="game";const n=this.playerIndex===0?i.visual.colors.player1:i.visual.colors.player2,e=this.playerIndex===0?"Player 1 (Red)":"Player 2 (Purple)";this.container.innerHTML=`
      <div style="display: flex; align-items: center; justify-content: center; min-height: 100vh; background: #f8f9fa;">
        <div style="text-align: center;">
          <h3 id="game-title" style="margin-bottom: 10px;">Game</h3>
          <h4 id="trial-info" style="margin-bottom: 20px;">Round 1</h4>
          <div id="gameCanvas" style="margin-bottom: 20px;"></div>
          <p style="font-size: 20px;">You are ${e} <span style="display: inline-block; width: 18px; height: 18px; background-color: ${n}; border-radius: 50%; vertical-align: middle;"></span>. Press ↑ ↓ ← → to move.</p>
        </div>
      </div>
    `,this.createGameCanvas(),this.setupKeyboardControls()}createGameCanvas(){const n=document.getElementById("gameCanvas");if(n){this.handleResize&&(window.removeEventListener("resize",this.handleResize),this.handleResize=null),this.gameCanvas=this.renderer.createCanvas(),n.appendChild(this.gameCanvas);const e=()=>{this.renderer.applyResponsiveSizing(),this.lastGameState&&this.renderer.render(this.gameCanvas,this.lastGameState)};this.handleResize=()=>e(),window.addEventListener("resize",this.handleResize),setTimeout(e,0)}}setupKeyboardControls(){this.keyboardHandler&&document.removeEventListener("keydown",this.keyboardHandler),this.keyboardHandler=n=>{const e=n.code;if(["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].includes(e)){n.preventDefault();const a=e.replace("Arrow","").toLowerCase();this.emit("player-move",a)}},document.addEventListener("keydown",this.keyboardHandler),document.body.focus()}updateLobbyInfo(n){const e=document.getElementById("lobby-info");e&&(e.innerHTML=`
        <h3>Room: ${n.roomId.substring(0,8)}...</h3>
        <p>Game Mode: ${n.gameMode==="human-human"?"Human vs Human":"Human vs AI"}</p>
        <p>Experiment: ${n.experimentType}</p>
      `,n.players&&n.players.length>0&&(document.getElementById("ready-button").style.display="inline-block"))}updatePlayerList(n){const e=document.getElementById("player-list");e&&n&&(e.innerHTML=`
        <h4>Players (${n.length}/2):</h4>
        <div style="text-align: left; display: inline-block;">
          ${n.map((t,a)=>`
            <div style="margin: 5px 0;">
              Player ${a+1}: ${t.id.substring(0,8)}...
              ${t.isReady?"✅ Ready":"⏳ Not Ready"}
            </div>
          `).join("")}
        </div>
      `)}updateGameDisplay(n){this.gameCanvas&&n&&(this.lastGameState=n,this.renderer.render(this.gameCanvas,n))}updateGameInfo(n,e,t){var o,s,l;const a=document.getElementById("game-title"),r=document.getElementById("trial-info");if(a){const c=L.getNumTrials(t)||"",p=((l=(s=(o=i==null?void 0:i.game)==null?void 0:o.experiments)==null?void 0:s.order)==null?void 0:l.length)||"",d=p?`Game ${n+1}/${p}`:`Game ${n+1}`;a.textContent=c?`${d}: Round ${e+1}/${c}`:d}r&&(r.textContent=`Round ${e+1}`)}showGameStatus(n,e="info"){const t=document.getElementById("game-status");if(t){const a={info:"#666",success:"#28a745",warning:"#ffc107",error:"#dc3545"};t.innerHTML=`
        <div style="color: ${a[e]||a.info}; font-weight: bold;">
          ${n}
        </div>
      `}}showWaitingMessage(){this.showGameStatus("Waiting for partner to finish...","info")}showTrialFeedback(n){const e=n.success||n.collaborationSucceeded,a=(n.experimentType||"2P2G").startsWith("1P")?"single":"collaboration",r=e?a==="single"?"🎉 Goal reached!":"🎉 Collaboration succeeded!":a==="single"?"❌ Time up!":"❌ Collaboration failed!";this.showGameStatus(r,e?"success":"warning"),setTimeout(()=>{this.showGameStatus("")},i.game.timing.feedbackDisplayDuration)}showExperimentComplete(n){this.container.innerHTML=`
      <div style="display: flex; align-items: center; justify-content: center; min-height: 100vh; background: #f8f9fa;">
        <div style="text-align: center; max-width: 600px; padding: 20px;">
          <h1 style="margin-bottom: 20px;">🎉 Experiment Complete!</h1>
          <div style="background: white; padding: 20px; border-radius: 10px; margin-bottom: 30px;">
            <h3>Results Summary:</h3>
            <p><strong>Total Trials:</strong> ${n.totalTrials}</p>
            <p><strong>Successful Trials:</strong> ${n.successfulTrials}</p>
            <p><strong>Success Rate:</strong> ${n.successRate}%</p>
            <p><strong>Total Time:</strong> ${n.totalTime}</p>
          </div>
          <button onclick="window.location.reload()" style="
            padding: 15px 30px;
            font-size: 18px;
            background: #007bff;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
          ">
            Start New Experiment
          </button>
        </div>
      </div>
    `}showNotification(n,e=3e3){const t=document.createElement("div");t.style.cssText=`
      position: fixed;
      top: 20px;
      right: 20px;
      background: #007bff;
      color: white;
      padding: 15px;
      border-radius: 5px;
      z-index: 1000;
      box-shadow: 0 2px 10px rgba(0,0,0,0.3);
    `,t.textContent=n,document.body.appendChild(t),setTimeout(()=>{t.parentNode&&t.parentNode.removeChild(t)},e)}showError(n){this.container.innerHTML=`
      <div style="display: flex; align-items: center; justify-content: center; height: 100vh;">
        <div style="text-align: center; color: #dc3545; max-width: 500px; padding: 20px;">
          <h2>⚠️ Error</h2>
          <p style="margin: 20px 0;">${n}</p>
          <button onclick="window.location.reload()" style="
            padding: 10px 20px;
            font-size: 16px;
            background: #dc3545;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
          ">
            Retry
          </button>
        </div>
      </div>
    `}showFixation(){console.log("⚡ Showing fixation display"),this.container.innerHTML=`
      <div style="display: flex; align-items: center; justify-content: center; min-height: 100vh; background: #f8f9fa;">
        <div style="font-size: 48px; font-weight: bold; color: #333;">
          +
        </div>
      </div>
    `}showTrialFeedbackInContainer(n,e,t="collaboration"){if(console.log(`📊 Showing trial feedback in container: ${n?"SUCCESS":"FAILURE"}`),!e){console.warn("No canvas container provided for trial feedback");return}t!=="single"&&t!=="collaboration"&&(console.warn('Invalid messageType. Must be "single" or "collaboration"'),t="collaboration");let a;n?a=`
        <div style="display: flex; justify-content: center; margin: 30px 0;">
          <div style="
            width: 120px;
            height: 120px;
            background-color: #28a745;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 4px 8px rgba(0,0,0,0.2);
          ">
            <svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12,1A11,11,0,1,0,23,12,11.013,11.013,0,0,0,12,1Zm0,20a9,9,0,1,1,9-9A9.011,9.011,0,0,1,12,21Zm6-8A6,6,0,0,1,6,13a1,1,0,0,1,2,0,4,4,0,0,0,8,0,1,1,0,0,1,2,0ZM8,10V9a1,1,0,0,1,2,0v1a1,1,0,0,1-2,0Zm6,0V9a1,1,0,0,1,2,0v1a1,1,0,0,1-2,0Z" fill="white"/>
            </svg>
          </div>
        </div>
      `:a=`
        <div style="display: flex; justify-content: center; margin: 30px 0;">
          <div style="
            width: 120px;
            height: 120px;
            background-color: #dc3545;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 4px 8px rgba(0,0,0,0.2);
          ">
            <svg width="80" height="80" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19.5 10c.277 0 .5.223.5.5v3c0 .277-.223.5-.5.5s-.5-.223-.5-.5v-3c0-.277.223-.5.5-.5zm-9 0c.277 0 .5.223.5.5v3c0 .277-.223.5-.5.5s-.5-.223-.5-.5v-3c0-.277.223-.5.5-.5zM15 20c-2.104 0-4.186.756-5.798 2.104-.542.4.148 1.223.638.76C11.268 21.67 13.137 21 15 21s3.732.67 5.16 1.864c.478.45 1.176-.364.638-.76C19.186 20.756 17.104 20 15 20zm0-20C6.722 0 0 6.722 0 15c0 8.278 6.722 15 15 15 8.278 0 15-6.722 15-15 0-8.278-6.722-15-15-15zm0 1c7.738 0 14 6.262 14 14s-6.262 14-14 14S1 22.738 1 15 7.262 1 15 1z" fill="white"/>
            </svg>
          </div>
        </div>
      `;let r;t==="single"?r=n?"Goal reached!":"Time up!":t==="collaboration"&&(r=n?"Collaboration succeeded!":"Collaboration failed!");const o=document.createElement("div");o.innerHTML=`
      <div style="
        text-align: center;
        background: rgba(255, 255, 255, 0.95);
        border: 3px solid ${n?"#28a745":"#dc3545"};
        border-radius: 15px;
        padding: 30px 40px;
        box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
        backdrop-filter: blur(5px);
      ">
        <div style="font-size: 32px; font-weight: bold; margin-bottom: 20px; color: ${n?"#28a745":"#dc3545"};">
          ${r}
        </div>
        ${a}
      </div>
    `,o.style.cssText=`
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      z-index: 1000;
      pointer-events: none;
      width: auto;
      height: auto;
      display: flex;
      align-items: center;
      justify-content: center;
    `,e.style.position="relative",e.appendChild(o),setTimeout(()=>{o.parentNode&&o.parentNode.removeChild(o)},2e3)}setupGameCanvasInContainer(n){if(console.log("🎨 Setting up game canvas in timeline container"),!n){console.error("No container provided for game canvas");return}this.handleResize&&(window.removeEventListener("resize",this.handleResize),this.handleResize=null);const e=this.renderer.createCanvas();e.id="gameCanvas",n.innerHTML="",n.appendChild(e),this.gameCanvas=e;const t=()=>{this.renderer.applyResponsiveSizing(),this.lastGameState&&this.renderer.render(this.gameCanvas,this.lastGameState)};this.handleResize=()=>t(),window.addEventListener("resize",this.handleResize),setTimeout(t,0),this.setupKeyboardControls(),console.log("✅ Game canvas set up in timeline container")}showConnectionLostError(n,e){this.container.innerHTML=`
      <div style="text-align: center; padding: 20px; background: #f8d7da; border: 1px solid #f5c6cb; border-radius: 8px; margin: 20px;">
        <h3 style="color: #721c24; margin-bottom: 15px;">⚠️ Connection Lost</h3>
        <p style="color: #721c24; margin-bottom: 20px;">${n}</p>
        <div style="display: flex; gap: 10px; justify-content: center;">
          <button onclick="location.reload()" style="background: #6c757d; color: white; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer;">
            Refresh Page
          </button>
          <button id="retry-connection-btn" style="background: #007bff; color: white; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer;">
            Try Reconnecting
          </button>
        </div>
      </div>
    `;const t=document.getElementById("retry-connection-btn");t&&e&&t.addEventListener("click",e)}showReconnectingMessage(n){this.showGameStatus(n,"info")}showSuccessMessage(n){this.showGameStatus(n,"success"),setTimeout(()=>{this.showGameStatus("")},3e3)}destroy(){this.keyboardHandler&&document.removeEventListener("keydown",this.keyboardHandler),this.eventHandlers.clear(),this.gameCanvas=null,this.keyboardHandler=null}}const j={gridSize:15,noise:0,gamma:.9,goalReward:30,stepCost:-1,softmaxBeta:3,proximityRewardWeight:.01,coordinationRewardWeight:.02,maxPolicyIterations:15,progressivePolicyBuilding:!0,policyBuildTimeout:10,debugMode:!1,useFastOptimalPolicy:!1,enablePolicyPrecalculation:!1,jointRLImplementation:"bfs"};var Dn;try{(Dn=i==null?void 0:i.game)!=null&&Dn.matrixSize&&(j.gridSize=i.game.matrixSize)}catch{}function dn(x){return x.map(n=>`${n[0]},${n[1]}`).sort().join("|")}function Un(x,n){if(!Array.isArray(x)||x.length===0)return[];if(x.some(s=>!isFinite(s)))return new Array(x.length).fill(1/x.length);const e=Math.max(...x),r=x.map(s=>n*(s-e)).map(s=>Math.max(-700,Math.min(700,s))).map(s=>Math.exp(s)),o=r.reduce((s,l)=>s+l,0)||1;return r.map(s=>s/o)}class On{constructor(n,e){this.nx=n,this.ny=e,this.coordinates=[];for(let t=0;t<n;t++)for(let a=0;a<e;a++)this.coordinates.push([t,a]);this.terminals=[],this.obstacles=[],this.features={}}addTerminals(n){this.terminals.push(...n)}addObstacles(n){this.obstacles.push(...n)}addFeatureMap(n,e,t=0){this.features[n]={};for(const a of this.coordinates)this.features[n][a.toString()]=t;for(const a in e)this.features[n][a.toString()]=e[a]}isStateValid([n,e]){return n<0||n>=this.nx||e<0||e>=this.ny?!1:!this.obstacles.some(t=>t[0]===n&&t[1]===e)}reward(n,e,t,a=null){return a?Object.keys(a).reduce((r,o)=>r+this.features[o][t.toString()]*a[o],0):Object.keys(this.features).reduce((r,o)=>r+this.features[o][t.toString()],0)}}function kn(x,n){return[x[0]+n[0],x[1]+n[1]]}class qn{constructor(n,e,t,a){this.noise=n,this.noiseActionSpace=e,this.terminals=t,this.isStateValid=a}call(n,e){if(this.terminals.some(s=>s[0]===n[0]&&s[1]===n[1]))return{[n.toString()]:1};const t=kn(n,e);if(!this.isStateValid(t))return{[n.toString()]:1};const a=this.noiseActionSpace.map(s=>kn(n,s)).filter(this.isStateValid),r=this.noise/(a.length-1||1),o={};for(const s of a)o[s.toString()]=r;return o[t.toString()]=1-this.noise,o}}class Vn{constructor(n,e=.001,t=100,a=[]){this.gamma=n,this.epsilon=e,this.maxIter=t,this.terminals=a.map(r=>r.toString())}run(n,e,t,a){const r={};for(const o of n)r[o]=this.terminals.includes(o)?0:.1;for(let o=0;o<this.maxIter;o++){const s={...r};for(const c of n)this.terminals.includes(c)||(r[c]=Math.max(...e.map(p=>Object.entries(t[c][p]).reduce((d,[g,u])=>d+u*(a[c][p][g]+this.gamma*s[g]),0))));if(n.filter(c=>!this.terminals.includes(c)).map(c=>Math.abs(r[c]-s[c])).every(c=>c<this.epsilon))break}return r}}class Wn{constructor(n,e,t,a,r,o,s){this.gridSize=n,this.actionSpace=e,this.noiseSpace=t,this.noise=a,this.gamma=r,this.goalReward=o,this.softmaxBeta=s}call(n,e){const t=new On(this.gridSize,this.gridSize);Array.isArray(n[0])||(n=[n]);const a={};for(const h of n)a[h.toString()]=this.goalReward;t.addFeatureMap("goal",a,0),t.addTerminals(n),t.addObstacles(e);const r=[];for(let h=0;h<t.nx;h++)for(let y=0;y<t.ny;y++){const f=[h,y];t.isStateValid(f)&&r.push(f.toString())}const o=new qn(this.noise,this.noiseSpace,n,t.isStateValid.bind(t)),s={};for(const h of r){s[h]={};for(const y of this.actionSpace)s[h][y.toString()]=o.call(h.split(",").map(Number),y)}const l=j.stepCost,c={};for(const h of r){c[h]={};for(const y of this.actionSpace){c[h][y.toString()]={};const f=h.split(",").map(Number);for(const T of r){const m=T.split(",").map(Number),G=n.some(P=>P.toString()===T)?l+t.reward(m,y,m):l+t.reward(f,y,f);c[h][y.toString()][T]=G}}}const d=new Vn(this.gamma,.001,100,n).run(r,this.actionSpace.map(h=>h.toString()),s,c);for(const h of n)d[h.toString()]=this.goalReward;const g={};for(const h of r){g[h]={};for(const y of this.actionSpace.map(f=>f.toString()))g[h][y]=Object.entries(s[h][y]).reduce((f,[T,m])=>f+m*(c[h][y][T]+this.gamma*d[T]),0)}const u=new Yn(g,this.softmaxBeta);return{Q_dict:g,policy:u}}}class Yn{constructor(n,e=1){this.Q=n,this.beta=e}call(n){const e=n.toString(),t=Object.keys(this.Q[e]||{}),a=t.map(o=>this.Q[e][o]),r=Un(a,this.beta);return Object.fromEntries(t.map((o,s)=>[o,r[s]]))}}function Qn(x){const n=Object.keys(x),e=Object.values(x),t=Math.max(...e),a=n.filter((o,s)=>e[s]===t);return a[Math.floor(Math.random()*a.length)].split(",").map(Number)}const Mn=(()=>{const t=[[0,-1],[0,1],[-1,0],[1,0]],a=(y,f)=>y*15+f,r=y=>Math.floor(y/15),o=y=>y%15,s=(y,f)=>y>=0&&y<15&&f>=0&&f<15;function l(y,f){const T=r(y),m=o(y),[G,P]=t[f],b=T+G,v=m+P;return s(b,v)?a(b,v):y}function c(y,f,T=null){const m=r(y),G=o(y);let P=f[0],b=1/0;for(let k=0;k<f.length;k++){const S=f[k],A=Math.abs(m-S[0])+Math.abs(G-S[1]);let D;if(T!==null){const M=r(T),C=o(T),E=Math.abs(M-S[0])+Math.abs(C-S[1]);D=A+E}else D=A;D<b&&(P=S,b=D)}let v=m,w=G;return m!==P[0]?v+=P[0]<m?-1:1:G!==P[1]&&(w+=P[1]<G?-1:1),a(v,w)}const p=new Map;function d(y,f=1){const T=new Set(y.map(([M,C])=>a(M,C))),m=225*225,G=new Float32Array(m),P=new Float32Array(m*4),b=j.goalReward,v=j.stepCost,w=j.gamma;G.fill(-1e3);for(let M=0;M<m;M++){const C=Math.floor(M/225),E=M%225,$=T.has(C),O=T.has(E);if($&&O&&C===E){G[M]=0;for(let F=0;F<4;F++)P[M*4+F]=0}}let k,S=0;const A=1e3,D=1e-6;do{k=0,S++;for(let M=0;M<m;M++){const C=Math.floor(M/225),E=M%225,$=T.has(C),O=T.has(E);if($&&O&&C===E){G[M]=0;for(let U=0;U<4;U++)P[M*4+U]=0;continue}let F=-1/0;for(let U=0;U<4;U++){const q=$?C:l(C,U),N=c(E,y,q),_=T.has(q),Q=T.has(N),Z=_&&Q&&q===N;let nn=v;Z?nn=b:_&&Q&&q!==N?nn=v*.5:(_||Q)&&(nn=v*.8);const gn=q*225+N,an=nn+(Z?0:w*G[gn]);P[M*4+U]=an,an>F&&(F=an)}const R=Math.abs(F-G[M]);R>k&&(k=R),G[M]=F}if(S>A){console.warn(`Joint RL VI did not converge after ${A} iters Δ=${k}`);break}}while(k>D);return{Q:P,goalSet:T,beta:f}}function g(y,f,T,m=null){m==null&&(m=j.softmaxBeta);const G=dn(T)+"|"+m;p.has(G)||p.set(G,d(T,m));const{Q:P,goalSet:b}=p.get(G),v=(_,Q)=>_*15+Q,w=v(y[0],y[1]),k=v(f[0],f[1]),S=b.has(w),A=b.has(k);if(S&&A&&w===k)return null;const C=(w*225+k)*4,E=[P[C],P[C+1],P[C+2],P[C+3]];if(E.some(_=>!isFinite(_)))return t[Math.floor(Math.random()*t.length)];if(m>10){const _=Math.max(...E),Q=E.map((Z,nn)=>({q:Z,i:nn})).filter(Z=>Z.q===_);return t[Q[Math.floor(Math.random()*Q.length)].i]}const $=Math.max(...E),F=E.map(_=>m*(_-$)).map(_=>Math.max(-700,Math.min(700,_))).map(_=>Math.exp(_)),R=F.reduce((_,Q)=>_+Q,0);if(!isFinite(R)||R===0){const _=E.indexOf($);return t[_]}const U=Math.random()*R;let q=0;for(let _=0;_<F.length;_++)if(q+=F[_],U<q)return t[_];const N=E.indexOf($);return t[N]}function u(y){const f=j.softmaxBeta,T=dn(y)+"|"+f;p.has(T)||p.set(T,d(y,f))}function h(){p.clear()}return{getAction:g,precalc:u,clear:h}})(),An=(()=>{const x=j.gridSize||15,n=j.gridSize||15,e=x*n,t=[[0,-1],[0,1],[-1,0],[1,0]],a=(h,y)=>h*n+y,r=h=>Math.floor(h/n),o=h=>h%n,s=(h,y)=>h>=0&&h<x&&y>=0&&y<n,l=(h,y)=>{const f=r(h),T=o(h),m=f+t[y][0],G=T+t[y][1];return s(m,G)?a(m,G):h},c=new Map;function p(h,y=1){const f=new Set(h.map(([S,A])=>a(S,A))),T=e*e,m=new Float32Array(T*16),G=j.goalReward,P=j.stepCost,b=j.gamma,v=new Array(e);for(let S=0;S<e;S++){v[S]=new Array(h.length);const A=Math.floor(S/n),D=S%n;for(let M=0;M<h.length;M++){const[C,E]=h[M];v[S][M]=Math.abs(A-C)+Math.abs(D-E)}}const w=new Map;function k(S,A,D){if(D)return 0;const M=S<=A?`${S}-${A}`:`${A}-${S}`;if(w.has(M))return w.get(M);let C=1/0;for(let $=0;$<h.length;$++){const O=v[S][$]+v[A][$];O<C&&(C=O)}const E=-j.proximityRewardWeight*C;return w.set(M,E),E}for(let S=0;S<T;S++){const A=Math.floor(S/e),D=S%e;if(f.has(A)&&f.has(D)&&A===D){for(let M=0;M<16;M++)m[S*16+M]=0;continue}for(let M=0;M<4;M++){const C=f.has(A)?A:l(A,M);for(let E=0;E<4;E++){const $=f.has(D)?D:l(D,E),O=M*4+E,X=f.has(C)&&f.has($)&&C===$,F=k(C,$,X),R=X?G:P+F;let U=0;if(!X){let q=1/0;for(let N=0;N<h.length;N++){const _=v[C][N]+v[$][N];_<q&&(q=_)}U=b*(G+P*q)}m[S*16+O]=R+U}}}return{Q:m,goalSet:f,beta:y}}function d(h,y,f,T=null){T==null&&(T=j.softmaxBeta);const m=dn(f)+"|"+T;c.has(m)||c.set(m,p(f,T));const{Q:G,goalSet:P}=c.get(m),b=a(h[0],h[1]),v=a(y[0],y[1]);if(P.has(b)&&P.has(v)&&b===v)return null;const k=(b*e+v)*16,S=[G[k],G[k+1],G[k+2],G[k+3],G[k+4],G[k+5],G[k+6],G[k+7],G[k+8],G[k+9],G[k+10],G[k+11],G[k+12],G[k+13],G[k+14],G[k+15]],A=P.has(v),D=P.has(b);if(A&&!D)for(let R=0;R<16;R++)Math.floor(R/4)<4&&(S[R]*=.5);if(S.some(R=>!isFinite(R)))return t[Math.floor(Math.random()*t.length)];const M=Math.max(...S),$=S.map(R=>T*(R-M)).map(R=>Math.max(-700,Math.min(700,R))).map(R=>Math.exp(R)),O=$.reduce((R,U)=>R+U,0);if(!isFinite(O)||O===0)return t[Math.floor(Math.random()*t.length)];const X=Math.random()*O;let F=0;for(let R=0;R<16;R++)if(F+=$[R],X<F){const U=Math.floor(R/4);return t[U]}return t[0]}function g(h){const y=j.softmaxBeta,f=dn(h)+"|"+y;c.has(f)||c.set(f,p(h,y))}function u(){c.clear()}return{getAction:d,precalc:g,clear:u}})();class In{constructor(){this.isPreCalculating=!1}getAIAction(n,e,t,a=null){if(!t||t.length===0)return[0,0];try{if(a&&i.game.agent.type==="joint"){const o=(j.jointRLImplementation||"vi4").toLowerCase()==="bfs"?An.getAction(e,a,t,j.softmaxBeta):Mn.getAction(e,a,t,j.softmaxBeta);return o===null?[0,0]:o}return this.getIndividualRLAction(e,t)}catch(r){return console.error("Error in RL agent:",r),[0,0]}}getIndividualRLAction(n,e){const t=[[0,-1],[0,1],[-1,0],[1,0]],a=[...t],r=[],o=new Wn(j.gridSize,t,a,j.noise,j.gamma,j.goalReward,j.softmaxBeta),{policy:s}=o.call(e,r),l=s.call(n);return Qn(l)}precalculatePolicyForGoals(n,e){this.isPreCalculating||(this.isPreCalculating=!0,setTimeout(()=>{try{(j.jointRLImplementation||"vi4").toLowerCase()==="bfs"?An.precalc(n):Mn.precalc(n)}finally{this.isPreCalculating=!1}},0))}enableAutoPolicyPrecalculation(){}resetNewGoalPreCalculationFlag(){}}class pn{constructor(){this.baseUrl=i.server.url||""}static guidanceFor(n){switch(n){case"2P2G":return"You will collaborate  with another player. Each round, you can win if both of you go to the same restaurant. You lose the round if you end up at different restaurants. For each round that you win, you earn an additional 10 points.";case"2P3G":return"You will collaborate  with another player. Each round, you can win if both of you go to the same restaurant. You lose the round if you end up at different restaurants. Note that some restaurants are already open when the round starts. Others may appear later. For each round that you win, you earn an additional 10 points.";case"1P2G":return"Single player: reach any open goal.";case"1P1G":return"Single player: reach the goal.";default:return"Choose the best single step to reach a valid goal."}}static buildRelativeInfo(n,e="player2"){const t=n[e],a=n.currentGoals||[];if(!t||a.length===0)return null;let r=null,o=1/0;for(const l of a){const c=Math.abs(l[0]-t[0])+Math.abs(l[1]-t[1]);c<o&&(o=c,r=l)}const s=r?{dRow:r[0]-t[0],dCol:r[1]-t[1]}:null;return{nearestGoal:r,manhattanDistance:o,deltaToNearest:s}}async getNextAction(n,e={}){var T,m,G,P,b,v,w,k;const t=n.experimentType,a=e.guidance||pn.guidanceFor(t),o=(Number(e.aiPlayerNumber)===1?1:2)===1?"player1":"player2",s=((m=(T=i==null?void 0:i.game)==null?void 0:T.agent)==null?void 0:m.gpt)||{},l=n.trialData||null,c=Math.max(0,Number((G=s==null?void 0:s.memory)==null?void 0:G.maxSteps)||0),p=Array.isArray(l==null?void 0:l.player1Trajectory)?l.player1Trajectory:[],d=Array.isArray(l==null?void 0:l.player2Trajectory)?l.player2Trajectory:[],g=S=>c>0?S.slice(-c):S,u={guidance:a,matrix:n.gridMatrix,currentPlayer:{label:o,pos:n[o]},goals:n.currentGoals,relativeInfo:pn.buildRelativeInfo(n,o),model:e.model||s.model||void 0,temperature:typeof e.temperature=="number"?e.temperature:typeof s.temperature=="number"?s.temperature:void 0,memory:{enabled:!!((P=s==null?void 0:s.memory)!=null&&P.enabled),maxSteps:c,trajectories:(b=s==null?void 0:s.memory)!=null&&b.enabled?{player1:g(p),player2:g(d)}:void 0}},h=`${this.baseUrl.replace(/\/$/,"")}/api/ai/gpt/action`,y=await fetch(h,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(u)});if(!y.ok){const S=await y.text();throw new Error(`GPT action request failed: ${y.status} ${S}`)}const f=await y.json();try{const S=f&&(f.model||f.modelUsed);if(S){const A=(k=(w=(v=i==null?void 0:i.game)==null?void 0:v.agent)==null?void 0:w.gpt)==null?void 0:k.model;(!A||String(A).trim()!==String(S).trim())&&(i.game.agent.gpt.model=String(S).trim())}}catch{}return f&&Object.prototype.hasOwnProperty.call(f,"inferredGoal")?{action:(f==null?void 0:f.action)||null,inferredGoal:(f==null?void 0:f.inferredGoal)??null,model:f==null?void 0:f.model}:(f==null?void 0:f.action)||null}}class cn{static generateRandomizedDistanceSequence(n){const e=[this.DISTANCE_CONDITIONS.CLOSER_TO_PLAYER2,this.DISTANCE_CONDITIONS.CLOSER_TO_PLAYER1,this.DISTANCE_CONDITIONS.EQUAL_TO_BOTH,this.DISTANCE_CONDITIONS.NO_NEW_GOAL],t=e.length,a=Math.floor(n/t),r=n%t,o=[];for(let s=0;s<t;s++)for(let l=0;l<a;l++)o.push(e[s]);for(let s=0;s<r;s++){const l=e[Math.floor(Math.random()*t)];o.push(l)}for(let s=o.length-1;s>0;s--){const l=Math.floor(Math.random()*(s+1));[o[s],o[l]]=[o[l],o[s]]}return o}static generateNewGoal1P2G(n,e,t,a){var m,G,P,b,v,w,k;if(!n||!e)return null;const r=i.oneP2G;if(!r||a===((m=r==null?void 0:r.distanceConditions)==null?void 0:m.NO_NEW_GOAL))return null;const o=I.calculateGridDistance(n,e),s=i.game.matrixSize,l=(G=r.goalConstraints)==null?void 0:G.minDistanceFromHuman,c=(P=r.goalConstraints)==null?void 0:P.maxDistanceFromHuman,p=(b=r.goalConstraints)==null?void 0:b.minDistanceBetweenGoals,d=(v=r.distanceConstraint)==null?void 0:v.closerThreshold,g=(w=r.distanceConstraint)==null?void 0:w.fartherThreshold,u=!!((k=r.distanceConstraint)!=null&&k.allowEqualDistance),h=(S,A)=>{if(Array.isArray(t)){for(const D of t)if(D[0]===S&&D[1]===A)return!0}return n[0]===S&&n[1]===A},y=S=>{var A,D,M;switch(a){case((A=r.distanceConditions)==null?void 0:A.CLOSER_TO_PLAYER1):return S<=o-d;case((D=r.distanceConditions)==null?void 0:D.FARTHER_TO_PLAYER1):return S>=o+g;case((M=r.distanceConditions)==null?void 0:M.EQUAL_TO_PLAYER1):return u;default:return!1}},f=[];for(let S=0;S<s;S++)for(let A=0;A<s;A++){if(h(S,A))continue;const D=[S,A],M=I.calculateGridDistance(n,D);M<l||M>c||I.calculateGridDistance(e,D)<p||y(M)&&f.push(D)}if(f.length===0)for(let S=0;S<s;S++)for(let A=0;A<s;A++){if(h(S,A))continue;const D=[S,A],M=I.calculateGridDistance(n,D);M>=1&&M<=Math.max(10,c)&&f.push(D)}if(f.length===0)return null;const T=f[Math.floor(Math.random()*f.length)];return{position:T,conditionType:a,distanceToPlayer1:I.calculateGridDistance(n,T)}}static checkNewGoalPresentation1P2G(n,e,t){if(!n||!e||!n.currentGoals||n.currentGoals.length!==2||e.newGoalPresented)return null;const a=e.player1CurrentGoal;if((Array.isArray(a)&&a.length>0?a[a.length-1]:null)===null)return null;const o=n.currentGoals[0],s=this.generateNewGoal1P2G(n.player1,o,n.currentGoals,t);return s?{position:s.position,conditionType:s.conditionType,distanceToPlayer1:s.distanceToPlayer1}:null}static generateNewGoal(n,e,t,a,r){if(r===this.DISTANCE_CONDITIONS.NO_NEW_GOAL||a===null||a>=t.length)return null;const o=t[a],s=I.calculateGridDistance(e,o),l=I.calculateGridDistance(n,o),c=s+l,p=[],d=i.game.matrixSize,g=i&&i.twoP3G&&i.twoP3G.goalConstraints||{},u=Number.isFinite(g.minDistanceFromHuman)?g.minDistanceFromHuman:1,h=Number.isFinite(g.maxDistanceFromHuman)?g.maxDistanceFromHuman:1/0;for(let f=0;f<d;f++)for(let T=0;T<d;T++){const m=[f,T];if(this.isPositionOccupied(m,t,e,n))continue;const G=I.calculateGridDistance(e,m),P=I.calculateGridDistance(n,m),b=G+P;G<u||G>h||P<u||P>h||this.meetsDistanceCondition(r,G,P,s,l,b,c)&&p.push({position:m,conditionType:r,distanceToPlayer1:G,distanceToPlayer2:P,distanceSum:b})}if(p.length>0)return p[Math.floor(Math.random()*p.length)];const y=this.findRelaxedValidPositions(e,n,t,r);return y.length>0?y[Math.floor(Math.random()*y.length)]:null}static isPositionOccupied(n,e,t,a){const[r,o]=n;for(const s of e)if(s[0]===r&&s[1]===o)return!0;return t[0]===r&&t[1]===o||a[0]===r&&a[1]===o}static meetsDistanceCondition(n,e,t,a,r,o,s){const l=i&&i.twoP3G&&i.twoP3G.distanceConstraint||{},c=i&&i.twoP3G&&i.twoP3G.goalConstraints||{},p=Number.isFinite(l.closerThreshold)?l.closerThreshold:1,d=!!l.allowEqualDistance,g=Number.isFinite(l.maxDistanceIncrease)?l.maxDistanceIncrease:0,h=!!c.maintainDistanceSum?o===s:o<=s+g;switch(n){case this.DISTANCE_CONDITIONS.CLOSER_TO_PLAYER2:return(d?t<=r-p:t<r-p)&&h;case this.DISTANCE_CONDITIONS.CLOSER_TO_PLAYER1:return(d?e<=a-p:e<a-p)&&h;case this.DISTANCE_CONDITIONS.EQUAL_TO_BOTH:{const y=Math.abs(e-a),f=Math.abs(t-r),T=Math.abs(t-e),m=d?1:0,G=d?1:0;return y<=m&&f<=m&&T<=m&&Math.abs(o-s)<=G}default:return!1}}static findRelaxedValidPositions(n,e,t,a){const r=[],o=i.game.matrixSize,s=i&&i.twoP3G&&i.twoP3G.distanceConstraint||{},l=i&&i.twoP3G&&i.twoP3G.goalConstraints||{},c=Number.isFinite(l.minDistanceFromHuman)?l.minDistanceFromHuman:2,p=Number.isFinite(l.maxDistanceFromHuman)?l.maxDistanceFromHuman:Number.isFinite(s.maxDistanceIncrease)?Math.max(10,2+s.maxDistanceIncrease):10;for(let d=0;d<o;d++)for(let g=0;g<o;g++){const u=[d,g];if(!this.isPositionOccupied(u,t,n,e)){const h=I.calculateGridDistance(n,u),y=I.calculateGridDistance(e,u);h>=c&&h<=p&&y>=c&&y<=p&&r.push({position:u,conditionType:a,distanceToPlayer1:h,distanceToPlayer2:y,distanceSum:h+y})}}return r}static checkNewGoalPresentation2P3G(n,e,t){const{player1:a,player2:r,currentGoals:o}=n;if(!a||!r||!o||o.length<2||e.newGoalPresented)return null;const s=this.getPlayerCurrentGoal(e.player1CurrentGoal),l=this.getPlayerCurrentGoal(e.player2CurrentGoal);if(s!==null&&l!==null&&s===l){console.log("=== SHARED GOAL DETECTED ==="),console.log("Player1 goal:",s,"Player2 goal:",l);const c=this.generateNewGoal(r,a,o,s,t);if(c)return console.log("=== NEW GOAL GENERATED ==="),console.log("New goal position:",c.position),console.log("Distance condition:",t),{position:c.position,conditionType:c.conditionType,distanceToPlayer1:c.distanceToPlayer1,distanceToPlayer2:c.distanceToPlayer2}}return null}static getPlayerCurrentGoal(n){return!n||n.length===0?null:n[n.length-1]}}xn(cn,"DISTANCE_CONDITIONS",{CLOSER_TO_PLAYER2:"closer_to_player2",CLOSER_TO_PLAYER1:"closer_to_player1",EQUAL_TO_BOTH:"equal_to_both",NO_NEW_GOAL:"no_new_goal"});const Kn=`var MapsFor1P1G = {
    "0": [
        {
            "initPlayerGrid": [
                7,
                10
            ],
            "target1": [
                2,
                5
            ],
            "mapType": "1P1G"
        }
    ],
    "1": [
        {
            "initPlayerGrid": [
                7,
                13
            ],
            "target1": [
                0,
                7
            ],
            "mapType": "1P1G"
        }
    ],
    "2": [
        {
            "initPlayerGrid": [
                7,
                0
            ],
            "target1": [
                0,
                7
            ],
            "mapType": "1P1G"
        }
    ],
    "3": [
        {
            "initPlayerGrid": [
                7,
                12
            ],
            "target1": [
                1,
                7
            ],
            "mapType": "1P1G"
        }
    ],
    "4": [
        {
            "initPlayerGrid": [
                7,
                14
            ],
            "target1": [
                1,
                7
            ],
            "mapType": "1P1G"
        }
    ],
    "5": [
        {
            "initPlayerGrid": [
                7,
                1
            ],
            "target1": [
                1,
                6
            ],
            "mapType": "1P1G"
        }
    ],
    "6": [
        {
            "initPlayerGrid": [
                7,
                14
            ],
            "target1": [
                2,
                7
            ],
            "mapType": "1P1G"
        }
    ],
    "7": [
        {
            "initPlayerGrid": [
                0,
                7
            ],
            "target1": [
                6,
                1
            ],
            "mapType": "1P1G"
        }
    ],
    "8": [
        {
            "initPlayerGrid": [
                3,
                7
            ],
            "target1": [
                8,
                0
            ],
            "mapType": "1P1G"
        }
    ],
    "9": [
        {
            "initPlayerGrid": [
                3,
                7
            ],
            "target1": [
                8,
                2
            ],
            "mapType": "1P1G"
        }
    ],
    "10": [
        {
            "initPlayerGrid": [
                7,
                14
            ],
            "target1": [
                1,
                9
            ],
            "mapType": "1P1G"
        }
    ],
    "11": [
        {
            "initPlayerGrid": [
                13,
                7
            ],
            "target1": [
                8,
                1
            ],
            "mapType": "1P1G"
        }
    ],
    "12": [
        {
            "initPlayerGrid": [
                7,
                12
            ],
            "target1": [
                2,
                7
            ],
            "mapType": "1P1G"
        }
    ],
    "13": [
        {
            "initPlayerGrid": [
                7,
                1
            ],
            "target1": [
                2,
                7
            ],
            "mapType": "1P1G"
        }
    ],
    "14": [
        {
            "initPlayerGrid": [
                11,
                7
            ],
            "target1": [
                6,
                0
            ],
            "mapType": "1P1G"
        }
    ],
    "15": [
        {
            "initPlayerGrid": [
                0,
                7
            ],
            "target1": [
                7,
                0
            ],
            "mapType": "1P1G"
        }
    ],
    "16": [
        {
            "initPlayerGrid": [
                7,
                14
            ],
            "target1": [
                1,
                7
            ],
            "mapType": "1P1G"
        }
    ],
    "17": [
        {
            "initPlayerGrid": [
                7,
                12
            ],
            "target1": [
                0,
                6
            ],
            "mapType": "1P1G"
        }
    ],
    "18": [
        {
            "initPlayerGrid": [
                7,
                3
            ],
            "target1": [
                2,
                8
            ],
            "mapType": "1P1G"
        }
    ],
    "19": [
        {
            "initPlayerGrid": [
                12,
                7
            ],
            "target1": [
                6,
                1
            ],
            "mapType": "1P1G"
        }
    ],
    "20": [
        {
            "initPlayerGrid": [
                7,
                14
            ],
            "target1": [
                0,
                9
            ],
            "mapType": "1P1G"
        }
    ],
    "21": [
        {
            "initPlayerGrid": [
                14,
                7
            ],
            "target1": [
                8,
                0
            ],
            "mapType": "1P1G"
        }
    ],
    "22": [
        {
            "initPlayerGrid": [
                3,
                7
            ],
            "target1": [
                8,
                2
            ],
            "mapType": "1P1G"
        }
    ],
    "23": [
        {
            "initPlayerGrid": [
                12,
                7
            ],
            "target1": [
                6,
                2
            ],
            "mapType": "1P1G"
        }
    ],
    "24": [
        {
            "initPlayerGrid": [
                1,
                7
            ],
            "target1": [
                7,
                1
            ],
            "mapType": "1P1G"
        }
    ],
    "25": [
        {
            "initPlayerGrid": [
                7,
                3
            ],
            "target1": [
                2,
                8
            ],
            "mapType": "1P1G"
        }
    ],
    "26": [
        {
            "initPlayerGrid": [
                7,
                13
            ],
            "target1": [
                2,
                7
            ],
            "mapType": "1P1G"
        }
    ],
    "27": [
        {
            "initPlayerGrid": [
                7,
                0
            ],
            "target1": [
                1,
                7
            ],
            "mapType": "1P1G"
        }
    ],
    "28": [
        {
            "initPlayerGrid": [
                7,
                14
            ],
            "target1": [
                0,
                8
            ],
            "mapType": "1P1G"
        }
    ],
    "29": [
        {
            "initPlayerGrid": [
                7,
                4
            ],
            "target1": [
                1,
                9
            ],
            "mapType": "1P1G"
        }
    ],
    "30": [
        {
            "initPlayerGrid": [
                4,
                7
            ],
            "target1": [
                9,
                0
            ],
            "mapType": "1P1G"
        }
    ],
    "31": [
        {
            "initPlayerGrid": [
                7,
                13
            ],
            "target1": [
                1,
                7
            ],
            "mapType": "1P1G"
        }
    ],
    "32": [
        {
            "initPlayerGrid": [
                7,
                0
            ],
            "target1": [
                2,
                7
            ],
            "mapType": "1P1G"
        }
    ],
    "33": [
        {
            "initPlayerGrid": [
                4,
                7
            ],
            "target1": [
                9,
                2
            ],
            "mapType": "1P1G"
        }
    ],
    "34": [
        {
            "initPlayerGrid": [
                0,
                7
            ],
            "target1": [
                7,
                2
            ],
            "mapType": "1P1G"
        }
    ],
    "35": [
        {
            "initPlayerGrid": [
                14,
                7
            ],
            "target1": [
                7,
                0
            ],
            "mapType": "1P1G"
        }
    ],
    "36": [
        {
            "initPlayerGrid": [
                7,
                10
            ],
            "target1": [
                1,
                5
            ],
            "mapType": "1P1G"
        }
    ],
    "37": [
        {
            "initPlayerGrid": [
                7,
                13
            ],
            "target1": [
                2,
                7
            ],
            "mapType": "1P1G"
        }
    ],
    "38": [
        {
            "initPlayerGrid": [
                7,
                14
            ],
            "target1": [
                0,
                7
            ],
            "mapType": "1P1G"
        }
    ],
    "39": [
        {
            "initPlayerGrid": [
                3,
                7
            ],
            "target1": [
                8,
                1
            ],
            "mapType": "1P1G"
        }
    ],
    "40": [
        {
            "initPlayerGrid": [
                7,
                14
            ],
            "target1": [
                0,
                7
            ],
            "mapType": "1P1G"
        }
    ],
    "41": [
        {
            "initPlayerGrid": [
                14,
                7
            ],
            "target1": [
                7,
                0
            ],
            "mapType": "1P1G"
        }
    ],
    "42": [
        {
            "initPlayerGrid": [
                7,
                12
            ],
            "target1": [
                0,
                7
            ],
            "mapType": "1P1G"
        }
    ],
    "43": [
        {
            "initPlayerGrid": [
                14,
                7
            ],
            "target1": [
                8,
                1
            ],
            "mapType": "1P1G"
        }
    ],
    "44": [
        {
            "initPlayerGrid": [
                7,
                14
            ],
            "target1": [
                2,
                7
            ],
            "mapType": "1P1G"
        }
    ],
    "45": [
        {
            "initPlayerGrid": [
                7,
                0
            ],
            "target1": [
                0,
                5
            ],
            "mapType": "1P1G"
        }
    ],
    "46": [
        {
            "initPlayerGrid": [
                14,
                7
            ],
            "target1": [
                7,
                2
            ],
            "mapType": "1P1G"
        }
    ],
    "47": [
        {
            "initPlayerGrid": [
                7,
                11
            ],
            "target1": [
                1,
                6
            ],
            "mapType": "1P1G"
        }
    ],
    "48": [
        {
            "initPlayerGrid": [
                13,
                7
            ],
            "target1": [
                8,
                1
            ],
            "mapType": "1P1G"
        }
    ],
    "49": [
        {
            "initPlayerGrid": [
                12,
                7
            ],
            "target1": [
                7,
                0
            ],
            "mapType": "1P1G"
        }
    ],
    "50": [
        {
            "initPlayerGrid": [
                7,
                2
            ],
            "target1": [
                2,
                8
            ],
            "mapType": "1P1G"
        }
    ],
    "51": [
        {
            "initPlayerGrid": [
                0,
                7
            ],
            "target1": [
                5,
                1
            ],
            "mapType": "1P1G"
        }
    ],
    "52": [
        {
            "initPlayerGrid": [
                14,
                7
            ],
            "target1": [
                7,
                1
            ],
            "mapType": "1P1G"
        }
    ],
    "53": [
        {
            "initPlayerGrid": [
                7,
                0
            ],
            "target1": [
                1,
                6
            ],
            "mapType": "1P1G"
        }
    ],
    "54": [
        {
            "initPlayerGrid": [
                1,
                7
            ],
            "target1": [
                7,
                0
            ],
            "mapType": "1P1G"
        }
    ],
    "55": [
        {
            "initPlayerGrid": [
                7,
                13
            ],
            "target1": [
                1,
                7
            ],
            "mapType": "1P1G"
        }
    ],
    "56": [
        {
            "initPlayerGrid": [
                14,
                7
            ],
            "target1": [
                8,
                2
            ],
            "mapType": "1P1G"
        }
    ],
    "57": [
        {
            "initPlayerGrid": [
                12,
                7
            ],
            "target1": [
                6,
                1
            ],
            "mapType": "1P1G"
        }
    ],
    "58": [
        {
            "initPlayerGrid": [
                7,
                14
            ],
            "target1": [
                2,
                7
            ],
            "mapType": "1P1G"
        }
    ],
    "59": [
        {
            "initPlayerGrid": [
                0,
                7
            ],
            "target1": [
                7,
                0
            ],
            "mapType": "1P1G"
        }
    ],
    "60": [
        {
            "initPlayerGrid": [
                7,
                0
            ],
            "target1": [
                1,
                7
            ],
            "mapType": "1P1G"
        }
    ],
    "61": [
        {
            "initPlayerGrid": [
                0,
                7
            ],
            "target1": [
                7,
                1
            ],
            "mapType": "1P1G"
        }
    ],
    "62": [
        {
            "initPlayerGrid": [
                1,
                7
            ],
            "target1": [
                6,
                1
            ],
            "mapType": "1P1G"
        }
    ],
    "63": [
        {
            "initPlayerGrid": [
                7,
                13
            ],
            "target1": [
                0,
                8
            ],
            "mapType": "1P1G"
        }
    ],
    "64": [
        {
            "initPlayerGrid": [
                14,
                7
            ],
            "target1": [
                7,
                1
            ],
            "mapType": "1P1G"
        }
    ],
    "65": [
        {
            "initPlayerGrid": [
                0,
                7
            ],
            "target1": [
                7,
                2
            ],
            "mapType": "1P1G"
        }
    ],
    "66": [
        {
            "initPlayerGrid": [
                0,
                7
            ],
            "target1": [
                7,
                2
            ],
            "mapType": "1P1G"
        }
    ],
    "67": [
        {
            "initPlayerGrid": [
                10,
                7
            ],
            "target1": [
                5,
                0
            ],
            "mapType": "1P1G"
        }
    ],
    "68": [
        {
            "initPlayerGrid": [
                11,
                7
            ],
            "target1": [
                6,
                2
            ],
            "mapType": "1P1G"
        }
    ],
    "69": [
        {
            "initPlayerGrid": [
                12,
                7
            ],
            "target1": [
                7,
                1
            ],
            "mapType": "1P1G"
        }
    ],
    "70": [
        {
            "initPlayerGrid": [
                7,
                3
            ],
            "target1": [
                2,
                8
            ],
            "mapType": "1P1G"
        }
    ],
    "71": [
        {
            "initPlayerGrid": [
                7,
                14
            ],
            "target1": [
                2,
                8
            ],
            "mapType": "1P1G"
        }
    ],
    "72": [
        {
            "initPlayerGrid": [
                14,
                7
            ],
            "target1": [
                7,
                2
            ],
            "mapType": "1P1G"
        }
    ],
    "73": [
        {
            "initPlayerGrid": [
                7,
                1
            ],
            "target1": [
                1,
                6
            ],
            "mapType": "1P1G"
        }
    ],
    "74": [
        {
            "initPlayerGrid": [
                1,
                7
            ],
            "target1": [
                7,
                2
            ],
            "mapType": "1P1G"
        }
    ],
    "75": [
        {
            "initPlayerGrid": [
                1,
                7
            ],
            "target1": [
                6,
                0
            ],
            "mapType": "1P1G"
        }
    ],
    "76": [
        {
            "initPlayerGrid": [
                7,
                14
            ],
            "target1": [
                2,
                9
            ],
            "mapType": "1P1G"
        }
    ],
    "77": [
        {
            "initPlayerGrid": [
                1,
                7
            ],
            "target1": [
                6,
                1
            ],
            "mapType": "1P1G"
        }
    ],
    "78": [
        {
            "initPlayerGrid": [
                2,
                7
            ],
            "target1": [
                8,
                0
            ],
            "mapType": "1P1G"
        }
    ],
    "79": [
        {
            "initPlayerGrid": [
                12,
                7
            ],
            "target1": [
                7,
                2
            ],
            "mapType": "1P1G"
        }
    ],
    "80": [
        {
            "initPlayerGrid": [
                7,
                2
            ],
            "target1": [
                2,
                7
            ],
            "mapType": "1P1G"
        }
    ],
    "81": [
        {
            "initPlayerGrid": [
                14,
                7
            ],
            "target1": [
                9,
                0
            ],
            "mapType": "1P1G"
        }
    ],
    "82": [
        {
            "initPlayerGrid": [
                7,
                4
            ],
            "target1": [
                1,
                9
            ],
            "mapType": "1P1G"
        }
    ],
    "83": [
        {
            "initPlayerGrid": [
                7,
                0
            ],
            "target1": [
                2,
                7
            ],
            "mapType": "1P1G"
        }
    ],
    "84": [
        {
            "initPlayerGrid": [
                13,
                7
            ],
            "target1": [
                7,
                1
            ],
            "mapType": "1P1G"
        }
    ],
    "85": [
        {
            "initPlayerGrid": [
                14,
                7
            ],
            "target1": [
                9,
                1
            ],
            "mapType": "1P1G"
        }
    ],
    "86": [
        {
            "initPlayerGrid": [
                7,
                0
            ],
            "target1": [
                1,
                7
            ],
            "mapType": "1P1G"
        }
    ],
    "87": [
        {
            "initPlayerGrid": [
                7,
                0
            ],
            "target1": [
                0,
                7
            ],
            "mapType": "1P1G"
        }
    ],
    "88": [
        {
            "initPlayerGrid": [
                14,
                7
            ],
            "target1": [
                7,
                2
            ],
            "mapType": "1P1G"
        }
    ],
    "89": [
        {
            "initPlayerGrid": [
                7,
                0
            ],
            "target1": [
                2,
                7
            ],
            "mapType": "1P1G"
        }
    ],
    "90": [
        {
            "initPlayerGrid": [
                14,
                7
            ],
            "target1": [
                8,
                2
            ],
            "mapType": "1P1G"
        }
    ],
    "91": [
        {
            "initPlayerGrid": [
                7,
                11
            ],
            "target1": [
                0,
                6
            ],
            "mapType": "1P1G"
        }
    ],
    "92": [
        {
            "initPlayerGrid": [
                14,
                7
            ],
            "target1": [
                8,
                1
            ],
            "mapType": "1P1G"
        }
    ],
    "93": [
        {
            "initPlayerGrid": [
                0,
                7
            ],
            "target1": [
                7,
                0
            ],
            "mapType": "1P1G"
        }
    ],
    "94": [
        {
            "initPlayerGrid": [
                12,
                7
            ],
            "target1": [
                7,
                1
            ],
            "mapType": "1P1G"
        }
    ],
    "95": [
        {
            "initPlayerGrid": [
                7,
                10
            ],
            "target1": [
                0,
                5
            ],
            "mapType": "1P1G"
        }
    ],
    "96": [
        {
            "initPlayerGrid": [
                12,
                7
            ],
            "target1": [
                7,
                0
            ],
            "mapType": "1P1G"
        }
    ],
    "97": [
        {
            "initPlayerGrid": [
                13,
                7
            ],
            "target1": [
                7,
                2
            ],
            "mapType": "1P1G"
        }
    ],
    "98": [
        {
            "initPlayerGrid": [
                0,
                7
            ],
            "target1": [
                7,
                1
            ],
            "mapType": "1P1G"
        }
    ]
};`,Xn=`var MapsFor1P2G = {
    "99": [
        {
            "initPlayerGrid": [
                7,
                12
            ],
            "target1": [
                1,
                6
            ],
            "target2": [
                13,
                6
            ],
            "mapType": "1P2G"
        }
    ],
    "100": [
        {
            "initPlayerGrid": [
                7,
                14
            ],
            "target1": [
                1,
                8
            ],
            "target2": [
                13,
                8
            ],
            "mapType": "1P2G"
        }
    ],
    "101": [
        {
            "initPlayerGrid": [
                0,
                7
            ],
            "target1": [
                6,
                2
            ],
            "target2": [
                6,
                12
            ],
            "mapType": "1P2G"
        }
    ],
    "102": [
        {
            "initPlayerGrid": [
                2,
                7
            ],
            "target1": [
                8,
                1
            ],
            "target2": [
                8,
                13
            ],
            "mapType": "1P2G"
        }
    ],
    "103": [
        {
            "initPlayerGrid": [
                7,
                3
            ],
            "target1": [
                2,
                8
            ],
            "target2": [
                12,
                8
            ],
            "mapType": "1P2G"
        }
    ],
    "104": [
        {
            "initPlayerGrid": [
                7,
                1
            ],
            "target1": [
                2,
                7
            ],
            "target2": [
                12,
                7
            ],
            "mapType": "1P2G"
        }
    ],
    "105": [
        {
            "initPlayerGrid": [
                7,
                0
            ],
            "target1": [
                1,
                7
            ],
            "target2": [
                13,
                7
            ],
            "mapType": "1P2G"
        }
    ],
    "106": [
        {
            "initPlayerGrid": [
                7,
                12
            ],
            "target1": [
                2,
                7
            ],
            "target2": [
                12,
                7
            ],
            "mapType": "1P2G"
        }
    ],
    "107": [
        {
            "initPlayerGrid": [
                7,
                12
            ],
            "target1": [
                1,
                7
            ],
            "target2": [
                13,
                7
            ],
            "mapType": "1P2G"
        }
    ],
    "108": [
        {
            "initPlayerGrid": [
                13,
                7
            ],
            "target1": [
                7,
                2
            ],
            "target2": [
                7,
                12
            ],
            "mapType": "1P2G"
        }
    ],
    "109": [
        {
            "initPlayerGrid": [
                10,
                7
            ],
            "target1": [
                5,
                1
            ],
            "target2": [
                5,
                13
            ],
            "mapType": "1P2G"
        }
    ],
    "110": [
        {
            "initPlayerGrid": [
                14,
                7
            ],
            "target1": [
                7,
                2
            ],
            "target2": [
                7,
                12
            ],
            "mapType": "1P2G"
        }
    ],
    "111": [
        {
            "initPlayerGrid": [
                7,
                1
            ],
            "target1": [
                2,
                6
            ],
            "target2": [
                12,
                6
            ],
            "mapType": "1P2G"
        }
    ],
    "112": [
        {
            "initPlayerGrid": [
                2,
                7
            ],
            "target1": [
                8,
                1
            ],
            "target2": [
                8,
                13
            ],
            "mapType": "1P2G"
        }
    ],
    "113": [
        {
            "initPlayerGrid": [
                7,
                14
            ],
            "target1": [
                0,
                7
            ],
            "target2": [
                14,
                7
            ],
            "mapType": "1P2G"
        }
    ],
    "114": [
        {
            "initPlayerGrid": [
                7,
                12
            ],
            "target1": [
                1,
                6
            ],
            "target2": [
                13,
                6
            ],
            "mapType": "1P2G"
        }
    ],
    "115": [
        {
            "initPlayerGrid": [
                14,
                7
            ],
            "target1": [
                7,
                2
            ],
            "target2": [
                7,
                12
            ],
            "mapType": "1P2G"
        }
    ],
    "116": [
        {
            "initPlayerGrid": [
                7,
                12
            ],
            "target1": [
                1,
                6
            ],
            "target2": [
                13,
                6
            ],
            "mapType": "1P2G"
        }
    ],
    "117": [
        {
            "initPlayerGrid": [
                7,
                11
            ],
            "target1": [
                2,
                6
            ],
            "target2": [
                12,
                6
            ],
            "mapType": "1P2G"
        }
    ],
    "118": [
        {
            "initPlayerGrid": [
                0,
                7
            ],
            "target1": [
                6,
                2
            ],
            "target2": [
                6,
                12
            ],
            "mapType": "1P2G"
        }
    ],
    "119": [
        {
            "initPlayerGrid": [
                14,
                7
            ],
            "target1": [
                8,
                0
            ],
            "target2": [
                8,
                14
            ],
            "mapType": "1P2G"
        }
    ],
    "120": [
        {
            "initPlayerGrid": [
                7,
                2
            ],
            "target1": [
                1,
                7
            ],
            "target2": [
                13,
                7
            ],
            "mapType": "1P2G"
        }
    ],
    "121": [
        {
            "initPlayerGrid": [
                0,
                7
            ],
            "target1": [
                5,
                0
            ],
            "target2": [
                5,
                14
            ],
            "mapType": "1P2G"
        }
    ],
    "122": [
        {
            "initPlayerGrid": [
                4,
                7
            ],
            "target1": [
                9,
                2
            ],
            "target2": [
                9,
                12
            ],
            "mapType": "1P2G"
        }
    ],
    "123": [
        {
            "initPlayerGrid": [
                7,
                1
            ],
            "target1": [
                2,
                6
            ],
            "target2": [
                12,
                6
            ],
            "mapType": "1P2G"
        }
    ],
    "124": [
        {
            "initPlayerGrid": [
                11,
                7
            ],
            "target1": [
                6,
                1
            ],
            "target2": [
                6,
                13
            ],
            "mapType": "1P2G"
        }
    ],
    "125": [
        {
            "initPlayerGrid": [
                13,
                7
            ],
            "target1": [
                7,
                2
            ],
            "target2": [
                7,
                12
            ],
            "mapType": "1P2G"
        }
    ],
    "126": [
        {
            "initPlayerGrid": [
                0,
                7
            ],
            "target1": [
                7,
                0
            ],
            "target2": [
                7,
                14
            ],
            "mapType": "1P2G"
        }
    ],
    "127": [
        {
            "initPlayerGrid": [
                7,
                0
            ],
            "target1": [
                0,
                7
            ],
            "target2": [
                14,
                7
            ],
            "mapType": "1P2G"
        }
    ],
    "128": [
        {
            "initPlayerGrid": [
                7,
                2
            ],
            "target1": [
                1,
                8
            ],
            "target2": [
                13,
                8
            ],
            "mapType": "1P2G"
        }
    ],
    "129": [
        {
            "initPlayerGrid": [
                12,
                7
            ],
            "target1": [
                7,
                0
            ],
            "target2": [
                7,
                14
            ],
            "mapType": "1P2G"
        }
    ],
    "130": [
        {
            "initPlayerGrid": [
                1,
                7
            ],
            "target1": [
                7,
                0
            ],
            "target2": [
                7,
                14
            ],
            "mapType": "1P2G"
        }
    ],
    "131": [
        {
            "initPlayerGrid": [
                2,
                7
            ],
            "target1": [
                8,
                0
            ],
            "target2": [
                8,
                14
            ],
            "mapType": "1P2G"
        }
    ],
    "132": [
        {
            "initPlayerGrid": [
                7,
                2
            ],
            "target1": [
                1,
                8
            ],
            "target2": [
                13,
                8
            ],
            "mapType": "1P2G"
        }
    ],
    "133": [
        {
            "initPlayerGrid": [
                7,
                11
            ],
            "target1": [
                1,
                6
            ],
            "target2": [
                13,
                6
            ],
            "mapType": "1P2G"
        }
    ],
    "134": [
        {
            "initPlayerGrid": [
                7,
                1
            ],
            "target1": [
                0,
                7
            ],
            "target2": [
                14,
                7
            ],
            "mapType": "1P2G"
        }
    ],
    "135": [
        {
            "initPlayerGrid": [
                0,
                7
            ],
            "target1": [
                5,
                0
            ],
            "target2": [
                5,
                14
            ],
            "mapType": "1P2G"
        }
    ],
    "136": [
        {
            "initPlayerGrid": [
                7,
                4
            ],
            "target1": [
                0,
                9
            ],
            "target2": [
                14,
                9
            ],
            "mapType": "1P2G"
        }
    ],
    "137": [
        {
            "initPlayerGrid": [
                7,
                0
            ],
            "target1": [
                0,
                7
            ],
            "target2": [
                14,
                7
            ],
            "mapType": "1P2G"
        }
    ],
    "138": [
        {
            "initPlayerGrid": [
                14,
                7
            ],
            "target1": [
                9,
                0
            ],
            "target2": [
                9,
                14
            ],
            "mapType": "1P2G"
        }
    ],
    "139": [
        {
            "initPlayerGrid": [
                7,
                1
            ],
            "target1": [
                0,
                6
            ],
            "target2": [
                14,
                6
            ],
            "mapType": "1P2G"
        }
    ],
    "140": [
        {
            "initPlayerGrid": [
                0,
                7
            ],
            "target1": [
                7,
                1
            ],
            "target2": [
                7,
                13
            ],
            "mapType": "1P2G"
        }
    ],
    "141": [
        {
            "initPlayerGrid": [
                7,
                3
            ],
            "target1": [
                0,
                8
            ],
            "target2": [
                14,
                8
            ],
            "mapType": "1P2G"
        }
    ],
    "142": [
        {
            "initPlayerGrid": [
                7,
                1
            ],
            "target1": [
                2,
                6
            ],
            "target2": [
                12,
                6
            ],
            "mapType": "1P2G"
        }
    ],
    "143": [
        {
            "initPlayerGrid": [
                14,
                7
            ],
            "target1": [
                8,
                0
            ],
            "target2": [
                8,
                14
            ],
            "mapType": "1P2G"
        }
    ],
    "144": [
        {
            "initPlayerGrid": [
                7,
                3
            ],
            "target1": [
                0,
                8
            ],
            "target2": [
                14,
                8
            ],
            "mapType": "1P2G"
        }
    ],
    "145": [
        {
            "initPlayerGrid": [
                2,
                7
            ],
            "target1": [
                7,
                1
            ],
            "target2": [
                7,
                13
            ],
            "mapType": "1P2G"
        }
    ],
    "146": [
        {
            "initPlayerGrid": [
                7,
                12
            ],
            "target1": [
                1,
                6
            ],
            "target2": [
                13,
                6
            ],
            "mapType": "1P2G"
        }
    ],
    "147": [
        {
            "initPlayerGrid": [
                0,
                7
            ],
            "target1": [
                5,
                0
            ],
            "target2": [
                5,
                14
            ],
            "mapType": "1P2G"
        }
    ],
    "148": [
        {
            "initPlayerGrid": [
                7,
                10
            ],
            "target1": [
                0,
                5
            ],
            "target2": [
                14,
                5
            ],
            "mapType": "1P2G"
        }
    ],
    "149": [
        {
            "initPlayerGrid": [
                7,
                14
            ],
            "target1": [
                2,
                7
            ],
            "target2": [
                12,
                7
            ],
            "mapType": "1P2G"
        }
    ],
    "150": [
        {
            "initPlayerGrid": [
                7,
                12
            ],
            "target1": [
                0,
                6
            ],
            "target2": [
                14,
                6
            ],
            "mapType": "1P2G"
        }
    ],
    "151": [
        {
            "initPlayerGrid": [
                2,
                7
            ],
            "target1": [
                7,
                0
            ],
            "target2": [
                7,
                14
            ],
            "mapType": "1P2G"
        }
    ],
    "152": [
        {
            "initPlayerGrid": [
                14,
                7
            ],
            "target1": [
                7,
                2
            ],
            "target2": [
                7,
                12
            ],
            "mapType": "1P2G"
        }
    ],
    "153": [
        {
            "initPlayerGrid": [
                13,
                7
            ],
            "target1": [
                7,
                1
            ],
            "target2": [
                7,
                13
            ],
            "mapType": "1P2G"
        }
    ],
    "154": [
        {
            "initPlayerGrid": [
                7,
                13
            ],
            "target1": [
                2,
                8
            ],
            "target2": [
                12,
                8
            ],
            "mapType": "1P2G"
        }
    ],
    "155": [
        {
            "initPlayerGrid": [
                7,
                14
            ],
            "target1": [
                0,
                8
            ],
            "target2": [
                14,
                8
            ],
            "mapType": "1P2G"
        }
    ],
    "156": [
        {
            "initPlayerGrid": [
                7,
                13
            ],
            "target1": [
                0,
                8
            ],
            "target2": [
                14,
                8
            ],
            "mapType": "1P2G"
        }
    ],
    "157": [
        {
            "initPlayerGrid": [
                7,
                1
            ],
            "target1": [
                1,
                6
            ],
            "target2": [
                13,
                6
            ],
            "mapType": "1P2G"
        }
    ],
    "158": [
        {
            "initPlayerGrid": [
                7,
                0
            ],
            "target1": [
                0,
                7
            ],
            "target2": [
                14,
                7
            ],
            "mapType": "1P2G"
        }
    ],
    "159": [
        {
            "initPlayerGrid": [
                7,
                12
            ],
            "target1": [
                2,
                6
            ],
            "target2": [
                12,
                6
            ],
            "mapType": "1P2G"
        }
    ],
    "160": [
        {
            "initPlayerGrid": [
                14,
                7
            ],
            "target1": [
                7,
                0
            ],
            "target2": [
                7,
                14
            ],
            "mapType": "1P2G"
        }
    ],
    "161": [
        {
            "initPlayerGrid": [
                7,
                3
            ],
            "target1": [
                1,
                8
            ],
            "target2": [
                13,
                8
            ],
            "mapType": "1P2G"
        }
    ],
    "162": [
        {
            "initPlayerGrid": [
                7,
                1
            ],
            "target1": [
                1,
                7
            ],
            "target2": [
                13,
                7
            ],
            "mapType": "1P2G"
        }
    ],
    "163": [
        {
            "initPlayerGrid": [
                7,
                14
            ],
            "target1": [
                0,
                8
            ],
            "target2": [
                14,
                8
            ],
            "mapType": "1P2G"
        }
    ],
    "164": [
        {
            "initPlayerGrid": [
                14,
                7
            ],
            "target1": [
                7,
                2
            ],
            "target2": [
                7,
                12
            ],
            "mapType": "1P2G"
        }
    ],
    "165": [
        {
            "initPlayerGrid": [
                0,
                7
            ],
            "target1": [
                7,
                1
            ],
            "target2": [
                7,
                13
            ],
            "mapType": "1P2G"
        }
    ],
    "166": [
        {
            "initPlayerGrid": [
                7,
                14
            ],
            "target1": [
                2,
                8
            ],
            "target2": [
                12,
                8
            ],
            "mapType": "1P2G"
        }
    ],
    "167": [
        {
            "initPlayerGrid": [
                0,
                7
            ],
            "target1": [
                6,
                2
            ],
            "target2": [
                6,
                12
            ],
            "mapType": "1P2G"
        }
    ],
    "168": [
        {
            "initPlayerGrid": [
                0,
                7
            ],
            "target1": [
                7,
                2
            ],
            "target2": [
                7,
                12
            ],
            "mapType": "1P2G"
        }
    ],
    "169": [
        {
            "initPlayerGrid": [
                0,
                7
            ],
            "target1": [
                6,
                0
            ],
            "target2": [
                6,
                14
            ],
            "mapType": "1P2G"
        }
    ],
    "170": [
        {
            "initPlayerGrid": [
                7,
                14
            ],
            "target1": [
                0,
                7
            ],
            "target2": [
                14,
                7
            ],
            "mapType": "1P2G"
        }
    ],
    "171": [
        {
            "initPlayerGrid": [
                14,
                7
            ],
            "target1": [
                7,
                0
            ],
            "target2": [
                7,
                14
            ],
            "mapType": "1P2G"
        }
    ],
    "172": [
        {
            "initPlayerGrid": [
                7,
                12
            ],
            "target1": [
                0,
                6
            ],
            "target2": [
                14,
                6
            ],
            "mapType": "1P2G"
        }
    ],
    "173": [
        {
            "initPlayerGrid": [
                4,
                7
            ],
            "target1": [
                9,
                1
            ],
            "target2": [
                9,
                13
            ],
            "mapType": "1P2G"
        }
    ],
    "174": [
        {
            "initPlayerGrid": [
                0,
                7
            ],
            "target1": [
                7,
                0
            ],
            "target2": [
                7,
                14
            ],
            "mapType": "1P2G"
        }
    ],
    "175": [
        {
            "initPlayerGrid": [
                7,
                14
            ],
            "target1": [
                1,
                7
            ],
            "target2": [
                13,
                7
            ],
            "mapType": "1P2G"
        }
    ],
    "176": [
        {
            "initPlayerGrid": [
                14,
                7
            ],
            "target1": [
                7,
                1
            ],
            "target2": [
                7,
                13
            ],
            "mapType": "1P2G"
        }
    ],
    "177": [
        {
            "initPlayerGrid": [
                12,
                7
            ],
            "target1": [
                6,
                0
            ],
            "target2": [
                6,
                14
            ],
            "mapType": "1P2G"
        }
    ],
    "178": [
        {
            "initPlayerGrid": [
                7,
                14
            ],
            "target1": [
                2,
                7
            ],
            "target2": [
                12,
                7
            ],
            "mapType": "1P2G"
        }
    ],
    "179": [
        {
            "initPlayerGrid": [
                2,
                7
            ],
            "target1": [
                7,
                2
            ],
            "target2": [
                7,
                12
            ],
            "mapType": "1P2G"
        }
    ],
    "180": [
        {
            "initPlayerGrid": [
                7,
                0
            ],
            "target1": [
                2,
                6
            ],
            "target2": [
                12,
                6
            ],
            "mapType": "1P2G"
        }
    ],
    "181": [
        {
            "initPlayerGrid": [
                14,
                7
            ],
            "target1": [
                7,
                1
            ],
            "target2": [
                7,
                13
            ],
            "mapType": "1P2G"
        }
    ],
    "182": [
        {
            "initPlayerGrid": [
                7,
                0
            ],
            "target1": [
                2,
                6
            ],
            "target2": [
                12,
                6
            ],
            "mapType": "1P2G"
        }
    ],
    "183": [
        {
            "initPlayerGrid": [
                12,
                7
            ],
            "target1": [
                7,
                1
            ],
            "target2": [
                7,
                13
            ],
            "mapType": "1P2G"
        }
    ],
    "184": [
        {
            "initPlayerGrid": [
                0,
                7
            ],
            "target1": [
                7,
                0
            ],
            "target2": [
                7,
                14
            ],
            "mapType": "1P2G"
        }
    ],
    "185": [
        {
            "initPlayerGrid": [
                0,
                7
            ],
            "target1": [
                5,
                2
            ],
            "target2": [
                5,
                12
            ],
            "mapType": "1P2G"
        }
    ],
    "186": [
        {
            "initPlayerGrid": [
                0,
                7
            ],
            "target1": [
                6,
                0
            ],
            "target2": [
                6,
                14
            ],
            "mapType": "1P2G"
        }
    ],
    "187": [
        {
            "initPlayerGrid": [
                7,
                12
            ],
            "target1": [
                2,
                6
            ],
            "target2": [
                12,
                6
            ],
            "mapType": "1P2G"
        }
    ],
    "188": [
        {
            "initPlayerGrid": [
                0,
                7
            ],
            "target1": [
                7,
                0
            ],
            "target2": [
                7,
                14
            ],
            "mapType": "1P2G"
        }
    ],
    "189": [
        {
            "initPlayerGrid": [
                7,
                14
            ],
            "target1": [
                2,
                9
            ],
            "target2": [
                12,
                9
            ],
            "mapType": "1P2G"
        }
    ],
    "190": [
        {
            "initPlayerGrid": [
                7,
                14
            ],
            "target1": [
                0,
                7
            ],
            "target2": [
                14,
                7
            ],
            "mapType": "1P2G"
        }
    ],
    "191": [
        {
            "initPlayerGrid": [
                7,
                0
            ],
            "target1": [
                2,
                6
            ],
            "target2": [
                12,
                6
            ],
            "mapType": "1P2G"
        }
    ],
    "192": [
        {
            "initPlayerGrid": [
                7,
                14
            ],
            "target1": [
                2,
                8
            ],
            "target2": [
                12,
                8
            ],
            "mapType": "1P2G"
        }
    ],
    "193": [
        {
            "initPlayerGrid": [
                7,
                14
            ],
            "target1": [
                2,
                8
            ],
            "target2": [
                12,
                8
            ],
            "mapType": "1P2G"
        }
    ],
    "194": [
        {
            "initPlayerGrid": [
                0,
                7
            ],
            "target1": [
                5,
                2
            ],
            "target2": [
                5,
                12
            ],
            "mapType": "1P2G"
        }
    ],
    "195": [
        {
            "initPlayerGrid": [
                7,
                14
            ],
            "target1": [
                2,
                7
            ],
            "target2": [
                12,
                7
            ],
            "mapType": "1P2G"
        }
    ],
    "196": [
        {
            "initPlayerGrid": [
                1,
                7
            ],
            "target1": [
                6,
                2
            ],
            "target2": [
                6,
                12
            ],
            "mapType": "1P2G"
        }
    ],
    "197": [
        {
            "initPlayerGrid": [
                11,
                7
            ],
            "target1": [
                6,
                2
            ],
            "target2": [
                6,
                12
            ],
            "mapType": "1P2G"
        }
    ]
};`,Jn=`var MapsFor2P2G = {
    "198": [
        {
            "initPlayerGrid": [
                14,
                7
            ],
            "initAIGrid": [
                4,
                7
            ],
            "target1": [
                9,
                1
            ],
            "target2": [
                9,
                13
            ],
            "mapType": "2P2G"
        }
    ],
    "199": [
        {
            "initPlayerGrid": [
                7,
                1
            ],
            "initAIGrid": [
                7,
                11
            ],
            "target1": [
                1,
                6
            ],
            "target2": [
                13,
                6
            ],
            "mapType": "2P2G"
        }
    ],
    "200": [
        {
            "initPlayerGrid": [
                7,
                14
            ],
            "initAIGrid": [
                7,
                2
            ],
            "target1": [
                1,
                8
            ],
            "target2": [
                13,
                8
            ],
            "mapType": "2P2G"
        }
    ],
    "201": [
        {
            "initPlayerGrid": [
                7,
                14
            ],
            "initAIGrid": [
                7,
                4
            ],
            "target1": [
                1,
                9
            ],
            "target2": [
                13,
                9
            ],
            "mapType": "2P2G"
        }
    ],
    "202": [
        {
            "initPlayerGrid": [
                1,
                7
            ],
            "initAIGrid": [
                11,
                7
            ],
            "target1": [
                6,
                1
            ],
            "target2": [
                6,
                13
            ],
            "mapType": "2P2G"
        }
    ],
    "203": [
        {
            "initPlayerGrid": [
                7,
                11
            ],
            "initAIGrid": [
                7,
                1
            ],
            "target1": [
                0,
                6
            ],
            "target2": [
                14,
                6
            ],
            "mapType": "2P2G"
        }
    ],
    "204": [
        {
            "initPlayerGrid": [
                7,
                13
            ],
            "initAIGrid": [
                7,
                1
            ],
            "target1": [
                0,
                7
            ],
            "target2": [
                14,
                7
            ],
            "mapType": "2P2G"
        }
    ],
    "205": [
        {
            "initPlayerGrid": [
                0,
                7
            ],
            "initAIGrid": [
                14,
                7
            ],
            "target1": [
                7,
                1
            ],
            "target2": [
                7,
                13
            ],
            "mapType": "2P2G"
        }
    ],
    "206": [
        {
            "initPlayerGrid": [
                14,
                7
            ],
            "initAIGrid": [
                0,
                7
            ],
            "target1": [
                7,
                0
            ],
            "target2": [
                7,
                14
            ],
            "mapType": "2P2G"
        }
    ],
    "207": [
        {
            "initPlayerGrid": [
                14,
                7
            ],
            "initAIGrid": [
                0,
                7
            ],
            "target1": [
                7,
                1
            ],
            "target2": [
                7,
                13
            ],
            "mapType": "2P2G"
        }
    ],
    "208": [
        {
            "initPlayerGrid": [
                0,
                7
            ],
            "initAIGrid": [
                14,
                7
            ],
            "target1": [
                7,
                1
            ],
            "target2": [
                7,
                13
            ],
            "mapType": "2P2G"
        }
    ],
    "209": [
        {
            "initPlayerGrid": [
                1,
                7
            ],
            "initAIGrid": [
                13,
                7
            ],
            "target1": [
                7,
                1
            ],
            "target2": [
                7,
                13
            ],
            "mapType": "2P2G"
        }
    ],
    "210": [
        {
            "initPlayerGrid": [
                12,
                7
            ],
            "initAIGrid": [
                2,
                7
            ],
            "target1": [
                7,
                1
            ],
            "target2": [
                7,
                13
            ],
            "mapType": "2P2G"
        }
    ],
    "211": [
        {
            "initPlayerGrid": [
                7,
                14
            ],
            "initAIGrid": [
                7,
                0
            ],
            "target1": [
                0,
                7
            ],
            "target2": [
                14,
                7
            ],
            "mapType": "2P2G"
        }
    ],
    "212": [
        {
            "initPlayerGrid": [
                13,
                7
            ],
            "initAIGrid": [
                1,
                7
            ],
            "target1": [
                7,
                1
            ],
            "target2": [
                7,
                13
            ],
            "mapType": "2P2G"
        }
    ],
    "213": [
        {
            "initPlayerGrid": [
                14,
                7
            ],
            "initAIGrid": [
                2,
                7
            ],
            "target1": [
                8,
                2
            ],
            "target2": [
                8,
                12
            ],
            "mapType": "2P2G"
        }
    ],
    "214": [
        {
            "initPlayerGrid": [
                14,
                7
            ],
            "initAIGrid": [
                0,
                7
            ],
            "target1": [
                7,
                2
            ],
            "target2": [
                7,
                12
            ],
            "mapType": "2P2G"
        }
    ],
    "215": [
        {
            "initPlayerGrid": [
                7,
                13
            ],
            "initAIGrid": [
                7,
                1
            ],
            "target1": [
                0,
                7
            ],
            "target2": [
                14,
                7
            ],
            "mapType": "2P2G"
        }
    ],
    "216": [
        {
            "initPlayerGrid": [
                0,
                7
            ],
            "initAIGrid": [
                14,
                7
            ],
            "target1": [
                7,
                2
            ],
            "target2": [
                7,
                12
            ],
            "mapType": "2P2G"
        }
    ],
    "217": [
        {
            "initPlayerGrid": [
                7,
                3
            ],
            "initAIGrid": [
                7,
                13
            ],
            "target1": [
                0,
                8
            ],
            "target2": [
                14,
                8
            ],
            "mapType": "2P2G"
        }
    ],
    "218": [
        {
            "initPlayerGrid": [
                14,
                7
            ],
            "initAIGrid": [
                0,
                7
            ],
            "target1": [
                7,
                2
            ],
            "target2": [
                7,
                12
            ],
            "mapType": "2P2G"
        }
    ],
    "219": [
        {
            "initPlayerGrid": [
                7,
                14
            ],
            "initAIGrid": [
                7,
                0
            ],
            "target1": [
                0,
                7
            ],
            "target2": [
                14,
                7
            ],
            "mapType": "2P2G"
        }
    ],
    "220": [
        {
            "initPlayerGrid": [
                14,
                7
            ],
            "initAIGrid": [
                0,
                7
            ],
            "target1": [
                7,
                0
            ],
            "target2": [
                7,
                14
            ],
            "mapType": "2P2G"
        }
    ],
    "221": [
        {
            "initPlayerGrid": [
                0,
                7
            ],
            "initAIGrid": [
                12,
                7
            ],
            "target1": [
                6,
                0
            ],
            "target2": [
                6,
                14
            ],
            "mapType": "2P2G"
        }
    ],
    "222": [
        {
            "initPlayerGrid": [
                7,
                2
            ],
            "initAIGrid": [
                7,
                14
            ],
            "target1": [
                0,
                8
            ],
            "target2": [
                14,
                8
            ],
            "mapType": "2P2G"
        }
    ],
    "223": [
        {
            "initPlayerGrid": [
                13,
                7
            ],
            "initAIGrid": [
                1,
                7
            ],
            "target1": [
                7,
                2
            ],
            "target2": [
                7,
                12
            ],
            "mapType": "2P2G"
        }
    ],
    "224": [
        {
            "initPlayerGrid": [
                2,
                7
            ],
            "initAIGrid": [
                14,
                7
            ],
            "target1": [
                8,
                1
            ],
            "target2": [
                8,
                13
            ],
            "mapType": "2P2G"
        }
    ],
    "225": [
        {
            "initPlayerGrid": [
                14,
                7
            ],
            "initAIGrid": [
                4,
                7
            ],
            "target1": [
                9,
                0
            ],
            "target2": [
                9,
                14
            ],
            "mapType": "2P2G"
        }
    ],
    "226": [
        {
            "initPlayerGrid": [
                0,
                7
            ],
            "initAIGrid": [
                12,
                7
            ],
            "target1": [
                6,
                1
            ],
            "target2": [
                6,
                13
            ],
            "mapType": "2P2G"
        }
    ],
    "227": [
        {
            "initPlayerGrid": [
                14,
                7
            ],
            "initAIGrid": [
                0,
                7
            ],
            "target1": [
                7,
                0
            ],
            "target2": [
                7,
                14
            ],
            "mapType": "2P2G"
        }
    ],
    "228": [
        {
            "initPlayerGrid": [
                7,
                4
            ],
            "initAIGrid": [
                7,
                14
            ],
            "target1": [
                0,
                9
            ],
            "target2": [
                14,
                9
            ],
            "mapType": "2P2G"
        }
    ],
    "229": [
        {
            "initPlayerGrid": [
                7,
                0
            ],
            "initAIGrid": [
                7,
                12
            ],
            "target1": [
                1,
                6
            ],
            "target2": [
                13,
                6
            ],
            "mapType": "2P2G"
        }
    ],
    "230": [
        {
            "initPlayerGrid": [
                7,
                0
            ],
            "initAIGrid": [
                7,
                12
            ],
            "target1": [
                0,
                6
            ],
            "target2": [
                14,
                6
            ],
            "mapType": "2P2G"
        }
    ],
    "231": [
        {
            "initPlayerGrid": [
                7,
                10
            ],
            "initAIGrid": [
                7,
                0
            ],
            "target1": [
                1,
                5
            ],
            "target2": [
                13,
                5
            ],
            "mapType": "2P2G"
        }
    ],
    "232": [
        {
            "initPlayerGrid": [
                2,
                7
            ],
            "initAIGrid": [
                14,
                7
            ],
            "target1": [
                8,
                0
            ],
            "target2": [
                8,
                14
            ],
            "mapType": "2P2G"
        }
    ],
    "233": [
        {
            "initPlayerGrid": [
                7,
                1
            ],
            "initAIGrid": [
                7,
                13
            ],
            "target1": [
                1,
                7
            ],
            "target2": [
                13,
                7
            ],
            "mapType": "2P2G"
        }
    ],
    "234": [
        {
            "initPlayerGrid": [
                13,
                7
            ],
            "initAIGrid": [
                1,
                7
            ],
            "target1": [
                7,
                1
            ],
            "target2": [
                7,
                13
            ],
            "mapType": "2P2G"
        }
    ],
    "235": [
        {
            "initPlayerGrid": [
                12,
                7
            ],
            "initAIGrid": [
                0,
                7
            ],
            "target1": [
                6,
                0
            ],
            "target2": [
                6,
                14
            ],
            "mapType": "2P2G"
        }
    ],
    "236": [
        {
            "initPlayerGrid": [
                10,
                7
            ],
            "initAIGrid": [
                0,
                7
            ],
            "target1": [
                5,
                0
            ],
            "target2": [
                5,
                14
            ],
            "mapType": "2P2G"
        }
    ],
    "237": [
        {
            "initPlayerGrid": [
                2,
                7
            ],
            "initAIGrid": [
                12,
                7
            ],
            "target1": [
                7,
                0
            ],
            "target2": [
                7,
                14
            ],
            "mapType": "2P2G"
        }
    ],
    "238": [
        {
            "initPlayerGrid": [
                7,
                14
            ],
            "initAIGrid": [
                7,
                0
            ],
            "target1": [
                0,
                7
            ],
            "target2": [
                14,
                7
            ],
            "mapType": "2P2G"
        }
    ],
    "239": [
        {
            "initPlayerGrid": [
                7,
                1
            ],
            "initAIGrid": [
                7,
                13
            ],
            "target1": [
                1,
                7
            ],
            "target2": [
                13,
                7
            ],
            "mapType": "2P2G"
        }
    ],
    "240": [
        {
            "initPlayerGrid": [
                7,
                4
            ],
            "initAIGrid": [
                7,
                14
            ],
            "target1": [
                2,
                9
            ],
            "target2": [
                12,
                9
            ],
            "mapType": "2P2G"
        }
    ],
    "241": [
        {
            "initPlayerGrid": [
                10,
                7
            ],
            "initAIGrid": [
                0,
                7
            ],
            "target1": [
                5,
                2
            ],
            "target2": [
                5,
                12
            ],
            "mapType": "2P2G"
        }
    ],
    "242": [
        {
            "initPlayerGrid": [
                12,
                7
            ],
            "initAIGrid": [
                0,
                7
            ],
            "target1": [
                6,
                1
            ],
            "target2": [
                6,
                13
            ],
            "mapType": "2P2G"
        }
    ],
    "243": [
        {
            "initPlayerGrid": [
                7,
                0
            ],
            "initAIGrid": [
                7,
                14
            ],
            "target1": [
                1,
                7
            ],
            "target2": [
                13,
                7
            ],
            "mapType": "2P2G"
        }
    ],
    "244": [
        {
            "initPlayerGrid": [
                7,
                0
            ],
            "initAIGrid": [
                7,
                14
            ],
            "target1": [
                1,
                7
            ],
            "target2": [
                13,
                7
            ],
            "mapType": "2P2G"
        }
    ],
    "245": [
        {
            "initPlayerGrid": [
                13,
                7
            ],
            "initAIGrid": [
                3,
                7
            ],
            "target1": [
                8,
                0
            ],
            "target2": [
                8,
                14
            ],
            "mapType": "2P2G"
        }
    ],
    "246": [
        {
            "initPlayerGrid": [
                7,
                4
            ],
            "initAIGrid": [
                7,
                14
            ],
            "target1": [
                0,
                9
            ],
            "target2": [
                14,
                9
            ],
            "mapType": "2P2G"
        }
    ],
    "247": [
        {
            "initPlayerGrid": [
                7,
                0
            ],
            "initAIGrid": [
                7,
                14
            ],
            "target1": [
                0,
                7
            ],
            "target2": [
                14,
                7
            ],
            "mapType": "2P2G"
        }
    ],
    "248": [
        {
            "initPlayerGrid": [
                7,
                14
            ],
            "initAIGrid": [
                7,
                0
            ],
            "target1": [
                0,
                7
            ],
            "target2": [
                14,
                7
            ],
            "mapType": "2P2G"
        }
    ],
    "249": [
        {
            "initPlayerGrid": [
                7,
                14
            ],
            "initAIGrid": [
                7,
                0
            ],
            "target1": [
                1,
                7
            ],
            "target2": [
                13,
                7
            ],
            "mapType": "2P2G"
        }
    ],
    "250": [
        {
            "initPlayerGrid": [
                0,
                7
            ],
            "initAIGrid": [
                12,
                7
            ],
            "target1": [
                6,
                2
            ],
            "target2": [
                6,
                12
            ],
            "mapType": "2P2G"
        }
    ],
    "251": [
        {
            "initPlayerGrid": [
                11,
                7
            ],
            "initAIGrid": [
                1,
                7
            ],
            "target1": [
                6,
                0
            ],
            "target2": [
                6,
                14
            ],
            "mapType": "2P2G"
        }
    ],
    "252": [
        {
            "initPlayerGrid": [
                7,
                12
            ],
            "initAIGrid": [
                7,
                0
            ],
            "target1": [
                2,
                6
            ],
            "target2": [
                12,
                6
            ],
            "mapType": "2P2G"
        }
    ],
    "253": [
        {
            "initPlayerGrid": [
                7,
                0
            ],
            "initAIGrid": [
                7,
                14
            ],
            "target1": [
                0,
                7
            ],
            "target2": [
                14,
                7
            ],
            "mapType": "2P2G"
        }
    ],
    "254": [
        {
            "initPlayerGrid": [
                7,
                12
            ],
            "initAIGrid": [
                7,
                2
            ],
            "target1": [
                2,
                7
            ],
            "target2": [
                12,
                7
            ],
            "mapType": "2P2G"
        }
    ],
    "255": [
        {
            "initPlayerGrid": [
                7,
                14
            ],
            "initAIGrid": [
                7,
                2
            ],
            "target1": [
                0,
                8
            ],
            "target2": [
                14,
                8
            ],
            "mapType": "2P2G"
        }
    ],
    "256": [
        {
            "initPlayerGrid": [
                7,
                14
            ],
            "initAIGrid": [
                7,
                0
            ],
            "target1": [
                2,
                7
            ],
            "target2": [
                12,
                7
            ],
            "mapType": "2P2G"
        }
    ],
    "257": [
        {
            "initPlayerGrid": [
                7,
                0
            ],
            "initAIGrid": [
                7,
                14
            ],
            "target1": [
                1,
                7
            ],
            "target2": [
                13,
                7
            ],
            "mapType": "2P2G"
        }
    ],
    "258": [
        {
            "initPlayerGrid": [
                10,
                7
            ],
            "initAIGrid": [
                0,
                7
            ],
            "target1": [
                5,
                0
            ],
            "target2": [
                5,
                14
            ],
            "mapType": "2P2G"
        }
    ],
    "259": [
        {
            "initPlayerGrid": [
                7,
                14
            ],
            "initAIGrid": [
                7,
                0
            ],
            "target1": [
                2,
                7
            ],
            "target2": [
                12,
                7
            ],
            "mapType": "2P2G"
        }
    ],
    "260": [
        {
            "initPlayerGrid": [
                7,
                1
            ],
            "initAIGrid": [
                7,
                13
            ],
            "target1": [
                2,
                7
            ],
            "target2": [
                12,
                7
            ],
            "mapType": "2P2G"
        }
    ],
    "261": [
        {
            "initPlayerGrid": [
                1,
                7
            ],
            "initAIGrid": [
                13,
                7
            ],
            "target1": [
                7,
                0
            ],
            "target2": [
                7,
                14
            ],
            "mapType": "2P2G"
        }
    ],
    "262": [
        {
            "initPlayerGrid": [
                0,
                7
            ],
            "initAIGrid": [
                14,
                7
            ],
            "target1": [
                7,
                2
            ],
            "target2": [
                7,
                12
            ],
            "mapType": "2P2G"
        }
    ],
    "263": [
        {
            "initPlayerGrid": [
                3,
                7
            ],
            "initAIGrid": [
                13,
                7
            ],
            "target1": [
                8,
                0
            ],
            "target2": [
                8,
                14
            ],
            "mapType": "2P2G"
        }
    ],
    "264": [
        {
            "initPlayerGrid": [
                0,
                7
            ],
            "initAIGrid": [
                14,
                7
            ],
            "target1": [
                7,
                2
            ],
            "target2": [
                7,
                12
            ],
            "mapType": "2P2G"
        }
    ],
    "265": [
        {
            "initPlayerGrid": [
                1,
                7
            ],
            "initAIGrid": [
                13,
                7
            ],
            "target1": [
                7,
                0
            ],
            "target2": [
                7,
                14
            ],
            "mapType": "2P2G"
        }
    ],
    "266": [
        {
            "initPlayerGrid": [
                7,
                14
            ],
            "initAIGrid": [
                7,
                0
            ],
            "target1": [
                1,
                7
            ],
            "target2": [
                13,
                7
            ],
            "mapType": "2P2G"
        }
    ],
    "267": [
        {
            "initPlayerGrid": [
                7,
                2
            ],
            "initAIGrid": [
                7,
                14
            ],
            "target1": [
                1,
                8
            ],
            "target2": [
                13,
                8
            ],
            "mapType": "2P2G"
        }
    ],
    "268": [
        {
            "initPlayerGrid": [
                7,
                0
            ],
            "initAIGrid": [
                7,
                14
            ],
            "target1": [
                2,
                7
            ],
            "target2": [
                12,
                7
            ],
            "mapType": "2P2G"
        }
    ],
    "269": [
        {
            "initPlayerGrid": [
                14,
                7
            ],
            "initAIGrid": [
                4,
                7
            ],
            "target1": [
                9,
                2
            ],
            "target2": [
                9,
                12
            ],
            "mapType": "2P2G"
        }
    ],
    "270": [
        {
            "initPlayerGrid": [
                7,
                13
            ],
            "initAIGrid": [
                7,
                1
            ],
            "target1": [
                2,
                7
            ],
            "target2": [
                12,
                7
            ],
            "mapType": "2P2G"
        }
    ],
    "271": [
        {
            "initPlayerGrid": [
                7,
                12
            ],
            "initAIGrid": [
                7,
                2
            ],
            "target1": [
                0,
                7
            ],
            "target2": [
                14,
                7
            ],
            "mapType": "2P2G"
        }
    ],
    "272": [
        {
            "initPlayerGrid": [
                2,
                7
            ],
            "initAIGrid": [
                14,
                7
            ],
            "target1": [
                8,
                1
            ],
            "target2": [
                8,
                13
            ],
            "mapType": "2P2G"
        }
    ],
    "273": [
        {
            "initPlayerGrid": [
                14,
                7
            ],
            "initAIGrid": [
                0,
                7
            ],
            "target1": [
                7,
                1
            ],
            "target2": [
                7,
                13
            ],
            "mapType": "2P2G"
        }
    ],
    "274": [
        {
            "initPlayerGrid": [
                1,
                7
            ],
            "initAIGrid": [
                11,
                7
            ],
            "target1": [
                6,
                2
            ],
            "target2": [
                6,
                12
            ],
            "mapType": "2P2G"
        }
    ],
    "275": [
        {
            "initPlayerGrid": [
                7,
                3
            ],
            "initAIGrid": [
                7,
                13
            ],
            "target1": [
                1,
                8
            ],
            "target2": [
                13,
                8
            ],
            "mapType": "2P2G"
        }
    ],
    "276": [
        {
            "initPlayerGrid": [
                0,
                7
            ],
            "initAIGrid": [
                12,
                7
            ],
            "target1": [
                6,
                1
            ],
            "target2": [
                6,
                13
            ],
            "mapType": "2P2G"
        }
    ],
    "277": [
        {
            "initPlayerGrid": [
                0,
                7
            ],
            "initAIGrid": [
                14,
                7
            ],
            "target1": [
                7,
                1
            ],
            "target2": [
                7,
                13
            ],
            "mapType": "2P2G"
        }
    ],
    "278": [
        {
            "initPlayerGrid": [
                3,
                7
            ],
            "initAIGrid": [
                13,
                7
            ],
            "target1": [
                8,
                0
            ],
            "target2": [
                8,
                14
            ],
            "mapType": "2P2G"
        }
    ],
    "279": [
        {
            "initPlayerGrid": [
                0,
                7
            ],
            "initAIGrid": [
                14,
                7
            ],
            "target1": [
                7,
                2
            ],
            "target2": [
                7,
                12
            ],
            "mapType": "2P2G"
        }
    ],
    "280": [
        {
            "initPlayerGrid": [
                10,
                7
            ],
            "initAIGrid": [
                0,
                7
            ],
            "target1": [
                5,
                0
            ],
            "target2": [
                5,
                14
            ],
            "mapType": "2P2G"
        }
    ],
    "281": [
        {
            "initPlayerGrid": [
                0,
                7
            ],
            "initAIGrid": [
                14,
                7
            ],
            "target1": [
                7,
                0
            ],
            "target2": [
                7,
                14
            ],
            "mapType": "2P2G"
        }
    ],
    "282": [
        {
            "initPlayerGrid": [
                7,
                4
            ],
            "initAIGrid": [
                7,
                14
            ],
            "target1": [
                1,
                9
            ],
            "target2": [
                13,
                9
            ],
            "mapType": "2P2G"
        }
    ],
    "283": [
        {
            "initPlayerGrid": [
                7,
                0
            ],
            "initAIGrid": [
                7,
                14
            ],
            "target1": [
                2,
                7
            ],
            "target2": [
                12,
                7
            ],
            "mapType": "2P2G"
        }
    ],
    "284": [
        {
            "initPlayerGrid": [
                7,
                0
            ],
            "initAIGrid": [
                7,
                14
            ],
            "target1": [
                2,
                7
            ],
            "target2": [
                12,
                7
            ],
            "mapType": "2P2G"
        }
    ],
    "285": [
        {
            "initPlayerGrid": [
                7,
                0
            ],
            "initAIGrid": [
                7,
                14
            ],
            "target1": [
                2,
                7
            ],
            "target2": [
                12,
                7
            ],
            "mapType": "2P2G"
        }
    ],
    "286": [
        {
            "initPlayerGrid": [
                7,
                0
            ],
            "initAIGrid": [
                7,
                14
            ],
            "target1": [
                1,
                7
            ],
            "target2": [
                13,
                7
            ],
            "mapType": "2P2G"
        }
    ],
    "287": [
        {
            "initPlayerGrid": [
                13,
                7
            ],
            "initAIGrid": [
                1,
                7
            ],
            "target1": [
                7,
                2
            ],
            "target2": [
                7,
                12
            ],
            "mapType": "2P2G"
        }
    ],
    "288": [
        {
            "initPlayerGrid": [
                7,
                12
            ],
            "initAIGrid": [
                7,
                2
            ],
            "target1": [
                2,
                7
            ],
            "target2": [
                12,
                7
            ],
            "mapType": "2P2G"
        }
    ],
    "289": [
        {
            "initPlayerGrid": [
                13,
                7
            ],
            "initAIGrid": [
                1,
                7
            ],
            "target1": [
                7,
                1
            ],
            "target2": [
                7,
                13
            ],
            "mapType": "2P2G"
        }
    ],
    "290": [
        {
            "initPlayerGrid": [
                2,
                7
            ],
            "initAIGrid": [
                14,
                7
            ],
            "target1": [
                8,
                1
            ],
            "target2": [
                8,
                13
            ],
            "mapType": "2P2G"
        }
    ],
    "291": [
        {
            "initPlayerGrid": [
                12,
                7
            ],
            "initAIGrid": [
                2,
                7
            ],
            "target1": [
                7,
                0
            ],
            "target2": [
                7,
                14
            ],
            "mapType": "2P2G"
        }
    ],
    "292": [
        {
            "initPlayerGrid": [
                7,
                12
            ],
            "initAIGrid": [
                7,
                0
            ],
            "target1": [
                0,
                6
            ],
            "target2": [
                14,
                6
            ],
            "mapType": "2P2G"
        }
    ],
    "293": [
        {
            "initPlayerGrid": [
                0,
                7
            ],
            "initAIGrid": [
                12,
                7
            ],
            "target1": [
                6,
                1
            ],
            "target2": [
                6,
                13
            ],
            "mapType": "2P2G"
        }
    ],
    "294": [
        {
            "initPlayerGrid": [
                7,
                14
            ],
            "initAIGrid": [
                7,
                2
            ],
            "target1": [
                2,
                8
            ],
            "target2": [
                12,
                8
            ],
            "mapType": "2P2G"
        }
    ],
    "295": [
        {
            "initPlayerGrid": [
                7,
                11
            ],
            "initAIGrid": [
                7,
                1
            ],
            "target1": [
                1,
                6
            ],
            "target2": [
                13,
                6
            ],
            "mapType": "2P2G"
        }
    ],
    "296": [
        {
            "initPlayerGrid": [
                2,
                7
            ],
            "initAIGrid": [
                12,
                7
            ],
            "target1": [
                7,
                2
            ],
            "target2": [
                7,
                12
            ],
            "mapType": "2P2G"
        }
    ]
};`,Zn=`var MapsFor2P3G = {
    "297": [
        {
            "initPlayerGrid": [
                7,
                2
            ],
            "initAIGrid": [
                7,
                14
            ],
            "target1": [
                0,
                8
            ],
            "target2": [
                14,
                8
            ],
            "mapType": "2P3G"
        }
    ],
    "298": [
        {
            "initPlayerGrid": [
                7,
                1
            ],
            "initAIGrid": [
                7,
                13
            ],
            "target1": [
                1,
                7
            ],
            "target2": [
                13,
                7
            ],
            "mapType": "2P3G"
        }
    ],
    "299": [
        {
            "initPlayerGrid": [
                0,
                7
            ],
            "initAIGrid": [
                14,
                7
            ],
            "target1": [
                7,
                0
            ],
            "target2": [
                7,
                14
            ],
            "mapType": "2P3G"
        }
    ],
    "300": [
        {
            "initPlayerGrid": [
                7,
                14
            ],
            "initAIGrid": [
                7,
                0
            ],
            "target1": [
                0,
                7
            ],
            "target2": [
                14,
                7
            ],
            "mapType": "2P3G"
        }
    ],
    "301": [
        {
            "initPlayerGrid": [
                7,
                0
            ],
            "initAIGrid": [
                7,
                14
            ],
            "target1": [
                0,
                7
            ],
            "target2": [
                14,
                7
            ],
            "mapType": "2P3G"
        }
    ],
    "302": [
        {
            "initPlayerGrid": [
                0,
                7
            ],
            "initAIGrid": [
                14,
                7
            ],
            "target1": [
                7,
                1
            ],
            "target2": [
                7,
                13
            ],
            "mapType": "2P3G"
        }
    ],
    "303": [
        {
            "initPlayerGrid": [
                7,
                2
            ],
            "initAIGrid": [
                7,
                14
            ],
            "target1": [
                1,
                8
            ],
            "target2": [
                13,
                8
            ],
            "mapType": "2P3G"
        }
    ],
    "304": [
        {
            "initPlayerGrid": [
                7,
                0
            ],
            "initAIGrid": [
                7,
                14
            ],
            "target1": [
                0,
                7
            ],
            "target2": [
                14,
                7
            ],
            "mapType": "2P3G"
        }
    ],
    "305": [
        {
            "initPlayerGrid": [
                7,
                11
            ],
            "initAIGrid": [
                7,
                1
            ],
            "target1": [
                1,
                6
            ],
            "target2": [
                13,
                6
            ],
            "mapType": "2P3G"
        }
    ],
    "306": [
        {
            "initPlayerGrid": [
                13,
                7
            ],
            "initAIGrid": [
                3,
                7
            ],
            "target1": [
                8,
                0
            ],
            "target2": [
                8,
                14
            ],
            "mapType": "2P3G"
        }
    ],
    "307": [
        {
            "initPlayerGrid": [
                12,
                7
            ],
            "initAIGrid": [
                0,
                7
            ],
            "target1": [
                6,
                1
            ],
            "target2": [
                6,
                13
            ],
            "mapType": "2P3G"
        }
    ],
    "308": [
        {
            "initPlayerGrid": [
                7,
                14
            ],
            "initAIGrid": [
                7,
                4
            ],
            "target1": [
                0,
                9
            ],
            "target2": [
                14,
                9
            ],
            "mapType": "2P3G"
        }
    ],
    "309": [
        {
            "initPlayerGrid": [
                7,
                11
            ],
            "initAIGrid": [
                7,
                1
            ],
            "target1": [
                2,
                6
            ],
            "target2": [
                12,
                6
            ],
            "mapType": "2P3G"
        }
    ],
    "310": [
        {
            "initPlayerGrid": [
                7,
                0
            ],
            "initAIGrid": [
                7,
                14
            ],
            "target1": [
                0,
                7
            ],
            "target2": [
                14,
                7
            ],
            "mapType": "2P3G"
        }
    ],
    "311": [
        {
            "initPlayerGrid": [
                7,
                12
            ],
            "initAIGrid": [
                7,
                0
            ],
            "target1": [
                1,
                6
            ],
            "target2": [
                13,
                6
            ],
            "mapType": "2P3G"
        }
    ],
    "312": [
        {
            "initPlayerGrid": [
                7,
                0
            ],
            "initAIGrid": [
                7,
                14
            ],
            "target1": [
                0,
                7
            ],
            "target2": [
                14,
                7
            ],
            "mapType": "2P3G"
        }
    ],
    "313": [
        {
            "initPlayerGrid": [
                7,
                0
            ],
            "initAIGrid": [
                7,
                14
            ],
            "target1": [
                0,
                7
            ],
            "target2": [
                14,
                7
            ],
            "mapType": "2P3G"
        }
    ],
    "314": [
        {
            "initPlayerGrid": [
                10,
                7
            ],
            "initAIGrid": [
                0,
                7
            ],
            "target1": [
                5,
                2
            ],
            "target2": [
                5,
                12
            ],
            "mapType": "2P3G"
        }
    ],
    "315": [
        {
            "initPlayerGrid": [
                7,
                14
            ],
            "initAIGrid": [
                7,
                2
            ],
            "target1": [
                2,
                8
            ],
            "target2": [
                12,
                8
            ],
            "mapType": "2P3G"
        }
    ],
    "316": [
        {
            "initPlayerGrid": [
                0,
                7
            ],
            "initAIGrid": [
                14,
                7
            ],
            "target1": [
                7,
                0
            ],
            "target2": [
                7,
                14
            ],
            "mapType": "2P3G"
        }
    ],
    "317": [
        {
            "initPlayerGrid": [
                7,
                14
            ],
            "initAIGrid": [
                7,
                0
            ],
            "target1": [
                0,
                7
            ],
            "target2": [
                14,
                7
            ],
            "mapType": "2P3G"
        }
    ],
    "318": [
        {
            "initPlayerGrid": [
                7,
                3
            ],
            "initAIGrid": [
                7,
                13
            ],
            "target1": [
                1,
                8
            ],
            "target2": [
                13,
                8
            ],
            "mapType": "2P3G"
        }
    ],
    "319": [
        {
            "initPlayerGrid": [
                7,
                14
            ],
            "initAIGrid": [
                7,
                0
            ],
            "target1": [
                0,
                7
            ],
            "target2": [
                14,
                7
            ],
            "mapType": "2P3G"
        }
    ],
    "320": [
        {
            "initPlayerGrid": [
                7,
                13
            ],
            "initAIGrid": [
                7,
                1
            ],
            "target1": [
                2,
                7
            ],
            "target2": [
                12,
                7
            ],
            "mapType": "2P3G"
        }
    ],
    "321": [
        {
            "initPlayerGrid": [
                7,
                10
            ],
            "initAIGrid": [
                7,
                0
            ],
            "target1": [
                1,
                5
            ],
            "target2": [
                13,
                5
            ],
            "mapType": "2P3G"
        }
    ],
    "322": [
        {
            "initPlayerGrid": [
                0,
                7
            ],
            "initAIGrid": [
                12,
                7
            ],
            "target1": [
                6,
                0
            ],
            "target2": [
                6,
                14
            ],
            "mapType": "2P3G"
        }
    ],
    "323": [
        {
            "initPlayerGrid": [
                14,
                7
            ],
            "initAIGrid": [
                0,
                7
            ],
            "target1": [
                7,
                0
            ],
            "target2": [
                7,
                14
            ],
            "mapType": "2P3G"
        }
    ],
    "324": [
        {
            "initPlayerGrid": [
                0,
                7
            ],
            "initAIGrid": [
                12,
                7
            ],
            "target1": [
                6,
                2
            ],
            "target2": [
                6,
                12
            ],
            "mapType": "2P3G"
        }
    ],
    "325": [
        {
            "initPlayerGrid": [
                7,
                2
            ],
            "initAIGrid": [
                7,
                14
            ],
            "target1": [
                2,
                8
            ],
            "target2": [
                12,
                8
            ],
            "mapType": "2P3G"
        }
    ],
    "326": [
        {
            "initPlayerGrid": [
                7,
                0
            ],
            "initAIGrid": [
                7,
                14
            ],
            "target1": [
                0,
                7
            ],
            "target2": [
                14,
                7
            ],
            "mapType": "2P3G"
        }
    ],
    "327": [
        {
            "initPlayerGrid": [
                11,
                7
            ],
            "initAIGrid": [
                1,
                7
            ],
            "target1": [
                6,
                2
            ],
            "target2": [
                6,
                12
            ],
            "mapType": "2P3G"
        }
    ],
    "328": [
        {
            "initPlayerGrid": [
                7,
                1
            ],
            "initAIGrid": [
                7,
                11
            ],
            "target1": [
                0,
                6
            ],
            "target2": [
                14,
                6
            ],
            "mapType": "2P3G"
        }
    ],
    "329": [
        {
            "initPlayerGrid": [
                14,
                7
            ],
            "initAIGrid": [
                0,
                7
            ],
            "target1": [
                7,
                1
            ],
            "target2": [
                7,
                13
            ],
            "mapType": "2P3G"
        }
    ],
    "330": [
        {
            "initPlayerGrid": [
                12,
                7
            ],
            "initAIGrid": [
                2,
                7
            ],
            "target1": [
                7,
                1
            ],
            "target2": [
                7,
                13
            ],
            "mapType": "2P3G"
        }
    ],
    "331": [
        {
            "initPlayerGrid": [
                12,
                7
            ],
            "initAIGrid": [
                0,
                7
            ],
            "target1": [
                6,
                2
            ],
            "target2": [
                6,
                12
            ],
            "mapType": "2P3G"
        }
    ],
    "332": [
        {
            "initPlayerGrid": [
                7,
                14
            ],
            "initAIGrid": [
                7,
                0
            ],
            "target1": [
                2,
                7
            ],
            "target2": [
                12,
                7
            ],
            "mapType": "2P3G"
        }
    ],
    "333": [
        {
            "initPlayerGrid": [
                0,
                7
            ],
            "initAIGrid": [
                14,
                7
            ],
            "target1": [
                7,
                1
            ],
            "target2": [
                7,
                13
            ],
            "mapType": "2P3G"
        }
    ],
    "334": [
        {
            "initPlayerGrid": [
                7,
                1
            ],
            "initAIGrid": [
                7,
                13
            ],
            "target1": [
                2,
                7
            ],
            "target2": [
                12,
                7
            ],
            "mapType": "2P3G"
        }
    ],
    "335": [
        {
            "initPlayerGrid": [
                12,
                7
            ],
            "initAIGrid": [
                2,
                7
            ],
            "target1": [
                7,
                0
            ],
            "target2": [
                7,
                14
            ],
            "mapType": "2P3G"
        }
    ],
    "336": [
        {
            "initPlayerGrid": [
                7,
                13
            ],
            "initAIGrid": [
                7,
                3
            ],
            "target1": [
                0,
                8
            ],
            "target2": [
                14,
                8
            ],
            "mapType": "2P3G"
        }
    ],
    "337": [
        {
            "initPlayerGrid": [
                7,
                0
            ],
            "initAIGrid": [
                7,
                14
            ],
            "target1": [
                0,
                7
            ],
            "target2": [
                14,
                7
            ],
            "mapType": "2P3G"
        }
    ],
    "338": [
        {
            "initPlayerGrid": [
                7,
                14
            ],
            "initAIGrid": [
                7,
                0
            ],
            "target1": [
                2,
                7
            ],
            "target2": [
                12,
                7
            ],
            "mapType": "2P3G"
        }
    ],
    "339": [
        {
            "initPlayerGrid": [
                0,
                7
            ],
            "initAIGrid": [
                12,
                7
            ],
            "target1": [
                6,
                0
            ],
            "target2": [
                6,
                14
            ],
            "mapType": "2P3G"
        }
    ],
    "340": [
        {
            "initPlayerGrid": [
                7,
                12
            ],
            "initAIGrid": [
                7,
                0
            ],
            "target1": [
                0,
                6
            ],
            "target2": [
                14,
                6
            ],
            "mapType": "2P3G"
        }
    ],
    "341": [
        {
            "initPlayerGrid": [
                4,
                7
            ],
            "initAIGrid": [
                14,
                7
            ],
            "target1": [
                9,
                2
            ],
            "target2": [
                9,
                12
            ],
            "mapType": "2P3G"
        }
    ],
    "342": [
        {
            "initPlayerGrid": [
                4,
                7
            ],
            "initAIGrid": [
                14,
                7
            ],
            "target1": [
                9,
                1
            ],
            "target2": [
                9,
                13
            ],
            "mapType": "2P3G"
        }
    ],
    "343": [
        {
            "initPlayerGrid": [
                7,
                13
            ],
            "initAIGrid": [
                7,
                1
            ],
            "target1": [
                0,
                7
            ],
            "target2": [
                14,
                7
            ],
            "mapType": "2P3G"
        }
    ],
    "344": [
        {
            "initPlayerGrid": [
                7,
                0
            ],
            "initAIGrid": [
                7,
                14
            ],
            "target1": [
                2,
                7
            ],
            "target2": [
                12,
                7
            ],
            "mapType": "2P3G"
        }
    ],
    "345": [
        {
            "initPlayerGrid": [
                7,
                12
            ],
            "initAIGrid": [
                7,
                0
            ],
            "target1": [
                1,
                6
            ],
            "target2": [
                13,
                6
            ],
            "mapType": "2P3G"
        }
    ],
    "346": [
        {
            "initPlayerGrid": [
                4,
                7
            ],
            "initAIGrid": [
                14,
                7
            ],
            "target1": [
                9,
                2
            ],
            "target2": [
                9,
                12
            ],
            "mapType": "2P3G"
        }
    ],
    "347": [
        {
            "initPlayerGrid": [
                7,
                13
            ],
            "initAIGrid": [
                7,
                3
            ],
            "target1": [
                2,
                8
            ],
            "target2": [
                12,
                8
            ],
            "mapType": "2P3G"
        }
    ],
    "348": [
        {
            "initPlayerGrid": [
                14,
                7
            ],
            "initAIGrid": [
                0,
                7
            ],
            "target1": [
                7,
                1
            ],
            "target2": [
                7,
                13
            ],
            "mapType": "2P3G"
        }
    ],
    "349": [
        {
            "initPlayerGrid": [
                14,
                7
            ],
            "initAIGrid": [
                0,
                7
            ],
            "target1": [
                7,
                0
            ],
            "target2": [
                7,
                14
            ],
            "mapType": "2P3G"
        }
    ],
    "350": [
        {
            "initPlayerGrid": [
                0,
                7
            ],
            "initAIGrid": [
                14,
                7
            ],
            "target1": [
                7,
                2
            ],
            "target2": [
                7,
                12
            ],
            "mapType": "2P3G"
        }
    ],
    "351": [
        {
            "initPlayerGrid": [
                12,
                7
            ],
            "initAIGrid": [
                0,
                7
            ],
            "target1": [
                6,
                2
            ],
            "target2": [
                6,
                12
            ],
            "mapType": "2P3G"
        }
    ],
    "352": [
        {
            "initPlayerGrid": [
                7,
                14
            ],
            "initAIGrid": [
                7,
                4
            ],
            "target1": [
                2,
                9
            ],
            "target2": [
                12,
                9
            ],
            "mapType": "2P3G"
        }
    ],
    "353": [
        {
            "initPlayerGrid": [
                14,
                7
            ],
            "initAIGrid": [
                0,
                7
            ],
            "target1": [
                7,
                0
            ],
            "target2": [
                7,
                14
            ],
            "mapType": "2P3G"
        }
    ],
    "354": [
        {
            "initPlayerGrid": [
                7,
                12
            ],
            "initAIGrid": [
                7,
                0
            ],
            "target1": [
                1,
                6
            ],
            "target2": [
                13,
                6
            ],
            "mapType": "2P3G"
        }
    ],
    "355": [
        {
            "initPlayerGrid": [
                12,
                7
            ],
            "initAIGrid": [
                0,
                7
            ],
            "target1": [
                6,
                1
            ],
            "target2": [
                6,
                13
            ],
            "mapType": "2P3G"
        }
    ],
    "356": [
        {
            "initPlayerGrid": [
                7,
                0
            ],
            "initAIGrid": [
                7,
                12
            ],
            "target1": [
                0,
                6
            ],
            "target2": [
                14,
                6
            ],
            "mapType": "2P3G"
        }
    ],
    "357": [
        {
            "initPlayerGrid": [
                13,
                7
            ],
            "initAIGrid": [
                3,
                7
            ],
            "target1": [
                8,
                0
            ],
            "target2": [
                8,
                14
            ],
            "mapType": "2P3G"
        }
    ],
    "358": [
        {
            "initPlayerGrid": [
                1,
                7
            ],
            "initAIGrid": [
                13,
                7
            ],
            "target1": [
                7,
                1
            ],
            "target2": [
                7,
                13
            ],
            "mapType": "2P3G"
        }
    ],
    "359": [
        {
            "initPlayerGrid": [
                7,
                12
            ],
            "initAIGrid": [
                7,
                2
            ],
            "target1": [
                2,
                7
            ],
            "target2": [
                12,
                7
            ],
            "mapType": "2P3G"
        }
    ],
    "360": [
        {
            "initPlayerGrid": [
                7,
                1
            ],
            "initAIGrid": [
                7,
                13
            ],
            "target1": [
                1,
                7
            ],
            "target2": [
                13,
                7
            ],
            "mapType": "2P3G"
        }
    ],
    "361": [
        {
            "initPlayerGrid": [
                4,
                7
            ],
            "initAIGrid": [
                14,
                7
            ],
            "target1": [
                9,
                1
            ],
            "target2": [
                9,
                13
            ],
            "mapType": "2P3G"
        }
    ],
    "362": [
        {
            "initPlayerGrid": [
                7,
                12
            ],
            "initAIGrid": [
                7,
                0
            ],
            "target1": [
                0,
                6
            ],
            "target2": [
                14,
                6
            ],
            "mapType": "2P3G"
        }
    ],
    "363": [
        {
            "initPlayerGrid": [
                7,
                12
            ],
            "initAIGrid": [
                7,
                0
            ],
            "target1": [
                2,
                6
            ],
            "target2": [
                12,
                6
            ],
            "mapType": "2P3G"
        }
    ],
    "364": [
        {
            "initPlayerGrid": [
                7,
                14
            ],
            "initAIGrid": [
                7,
                4
            ],
            "target1": [
                2,
                9
            ],
            "target2": [
                12,
                9
            ],
            "mapType": "2P3G"
        }
    ],
    "365": [
        {
            "initPlayerGrid": [
                7,
                0
            ],
            "initAIGrid": [
                7,
                10
            ],
            "target1": [
                0,
                5
            ],
            "target2": [
                14,
                5
            ],
            "mapType": "2P3G"
        }
    ],
    "366": [
        {
            "initPlayerGrid": [
                7,
                0
            ],
            "initAIGrid": [
                7,
                14
            ],
            "target1": [
                0,
                7
            ],
            "target2": [
                14,
                7
            ],
            "mapType": "2P3G"
        }
    ],
    "367": [
        {
            "initPlayerGrid": [
                7,
                14
            ],
            "initAIGrid": [
                7,
                4
            ],
            "target1": [
                2,
                9
            ],
            "target2": [
                12,
                9
            ],
            "mapType": "2P3G"
        }
    ],
    "368": [
        {
            "initPlayerGrid": [
                0,
                7
            ],
            "initAIGrid": [
                14,
                7
            ],
            "target1": [
                7,
                0
            ],
            "target2": [
                7,
                14
            ],
            "mapType": "2P3G"
        }
    ],
    "369": [
        {
            "initPlayerGrid": [
                14,
                7
            ],
            "initAIGrid": [
                2,
                7
            ],
            "target1": [
                8,
                0
            ],
            "target2": [
                8,
                14
            ],
            "mapType": "2P3G"
        }
    ],
    "370": [
        {
            "initPlayerGrid": [
                7,
                3
            ],
            "initAIGrid": [
                7,
                13
            ],
            "target1": [
                2,
                8
            ],
            "target2": [
                12,
                8
            ],
            "mapType": "2P3G"
        }
    ],
    "371": [
        {
            "initPlayerGrid": [
                2,
                7
            ],
            "initAIGrid": [
                12,
                7
            ],
            "target1": [
                7,
                1
            ],
            "target2": [
                7,
                13
            ],
            "mapType": "2P3G"
        }
    ],
    "372": [
        {
            "initPlayerGrid": [
                7,
                0
            ],
            "initAIGrid": [
                7,
                14
            ],
            "target1": [
                1,
                7
            ],
            "target2": [
                13,
                7
            ],
            "mapType": "2P3G"
        }
    ],
    "373": [
        {
            "initPlayerGrid": [
                7,
                12
            ],
            "initAIGrid": [
                7,
                2
            ],
            "target1": [
                1,
                7
            ],
            "target2": [
                13,
                7
            ],
            "mapType": "2P3G"
        }
    ],
    "374": [
        {
            "initPlayerGrid": [
                7,
                4
            ],
            "initAIGrid": [
                7,
                14
            ],
            "target1": [
                1,
                9
            ],
            "target2": [
                13,
                9
            ],
            "mapType": "2P3G"
        }
    ],
    "375": [
        {
            "initPlayerGrid": [
                2,
                7
            ],
            "initAIGrid": [
                14,
                7
            ],
            "target1": [
                8,
                0
            ],
            "target2": [
                8,
                14
            ],
            "mapType": "2P3G"
        }
    ],
    "376": [
        {
            "initPlayerGrid": [
                0,
                7
            ],
            "initAIGrid": [
                10,
                7
            ],
            "target1": [
                5,
                1
            ],
            "target2": [
                5,
                13
            ],
            "mapType": "2P3G"
        }
    ],
    "377": [
        {
            "initPlayerGrid": [
                14,
                7
            ],
            "initAIGrid": [
                2,
                7
            ],
            "target1": [
                8,
                2
            ],
            "target2": [
                8,
                12
            ],
            "mapType": "2P3G"
        }
    ],
    "378": [
        {
            "initPlayerGrid": [
                7,
                14
            ],
            "initAIGrid": [
                7,
                2
            ],
            "target1": [
                2,
                8
            ],
            "target2": [
                12,
                8
            ],
            "mapType": "2P3G"
        }
    ],
    "379": [
        {
            "initPlayerGrid": [
                14,
                7
            ],
            "initAIGrid": [
                0,
                7
            ],
            "target1": [
                7,
                1
            ],
            "target2": [
                7,
                13
            ],
            "mapType": "2P3G"
        }
    ],
    "380": [
        {
            "initPlayerGrid": [
                7,
                0
            ],
            "initAIGrid": [
                7,
                14
            ],
            "target1": [
                2,
                7
            ],
            "target2": [
                12,
                7
            ],
            "mapType": "2P3G"
        }
    ],
    "381": [
        {
            "initPlayerGrid": [
                7,
                12
            ],
            "initAIGrid": [
                7,
                0
            ],
            "target1": [
                2,
                6
            ],
            "target2": [
                12,
                6
            ],
            "mapType": "2P3G"
        }
    ],
    "382": [
        {
            "initPlayerGrid": [
                7,
                2
            ],
            "initAIGrid": [
                7,
                12
            ],
            "target1": [
                2,
                7
            ],
            "target2": [
                12,
                7
            ],
            "mapType": "2P3G"
        }
    ],
    "383": [
        {
            "initPlayerGrid": [
                1,
                7
            ],
            "initAIGrid": [
                11,
                7
            ],
            "target1": [
                6,
                2
            ],
            "target2": [
                6,
                12
            ],
            "mapType": "2P3G"
        }
    ],
    "384": [
        {
            "initPlayerGrid": [
                7,
                13
            ],
            "initAIGrid": [
                7,
                1
            ],
            "target1": [
                1,
                7
            ],
            "target2": [
                13,
                7
            ],
            "mapType": "2P3G"
        }
    ],
    "385": [
        {
            "initPlayerGrid": [
                2,
                7
            ],
            "initAIGrid": [
                14,
                7
            ],
            "target1": [
                8,
                2
            ],
            "target2": [
                8,
                12
            ],
            "mapType": "2P3G"
        }
    ],
    "386": [
        {
            "initPlayerGrid": [
                7,
                10
            ],
            "initAIGrid": [
                7,
                0
            ],
            "target1": [
                1,
                5
            ],
            "target2": [
                13,
                5
            ],
            "mapType": "2P3G"
        }
    ],
    "387": [
        {
            "initPlayerGrid": [
                13,
                7
            ],
            "initAIGrid": [
                3,
                7
            ],
            "target1": [
                8,
                2
            ],
            "target2": [
                8,
                12
            ],
            "mapType": "2P3G"
        }
    ],
    "388": [
        {
            "initPlayerGrid": [
                7,
                4
            ],
            "initAIGrid": [
                7,
                14
            ],
            "target1": [
                0,
                9
            ],
            "target2": [
                14,
                9
            ],
            "mapType": "2P3G"
        }
    ],
    "389": [
        {
            "initPlayerGrid": [
                7,
                14
            ],
            "initAIGrid": [
                7,
                0
            ],
            "target1": [
                1,
                7
            ],
            "target2": [
                13,
                7
            ],
            "mapType": "2P3G"
        }
    ],
    "390": [
        {
            "initPlayerGrid": [
                7,
                14
            ],
            "initAIGrid": [
                7,
                0
            ],
            "target1": [
                2,
                7
            ],
            "target2": [
                12,
                7
            ],
            "mapType": "2P3G"
        }
    ],
    "391": [
        {
            "initPlayerGrid": [
                7,
                0
            ],
            "initAIGrid": [
                7,
                12
            ],
            "target1": [
                2,
                6
            ],
            "target2": [
                12,
                6
            ],
            "mapType": "2P3G"
        }
    ],
    "392": [
        {
            "initPlayerGrid": [
                0,
                7
            ],
            "initAIGrid": [
                14,
                7
            ],
            "target1": [
                7,
                2
            ],
            "target2": [
                7,
                12
            ],
            "mapType": "2P3G"
        }
    ],
    "393": [
        {
            "initPlayerGrid": [
                7,
                14
            ],
            "initAIGrid": [
                7,
                2
            ],
            "target1": [
                1,
                8
            ],
            "target2": [
                13,
                8
            ],
            "mapType": "2P3G"
        }
    ],
    "394": [
        {
            "initPlayerGrid": [
                7,
                1
            ],
            "initAIGrid": [
                7,
                13
            ],
            "target1": [
                2,
                7
            ],
            "target2": [
                12,
                7
            ],
            "mapType": "2P3G"
        }
    ],
    "395": [
        {
            "initPlayerGrid": [
                3,
                7
            ],
            "initAIGrid": [
                13,
                7
            ],
            "target1": [
                8,
                1
            ],
            "target2": [
                8,
                13
            ],
            "mapType": "2P3G"
        }
    ]
};`,ne={"1P1G":Kn,"1P2G":Xn,"2P2G":Jn,"2P3G":Zn};class ee{constructor(){this.mapData=null,this.initialize()}async initialize(){this.mapData=await this.loadMapData()}async loadMapData(){console.log("🗺️ Loading bundled map data...");const n={};for(const[e,t]of Object.entries(ne))try{n[e]=this.parseBundledMapFile(e,t),console.log(`✅ Loaded ${Object.keys(n[e]).length} ${e} maps from bundled config`)}catch(a){console.warn(`⚠️ Failed to load bundled ${e} maps, using fallback:`,a.message),n[e]=this.getFallbackMaps(e)}for(const[e,t]of Object.entries(n)){const a=t?Object.keys(t).length:0;console.log(`🗺️ ${e}: ${a} maps loaded`)}return n}parseBundledMapFile(n,e){const t=`MapsFor${n}`,a=new RegExp(`var\\s+${t}\\s*=\\s*({[\\s\\S]*?});`),r=e.match(a);if(!r)throw new Error(`Could not find ${t} declaration`);return JSON.parse(r[1])}generate1P1GMaps(){console.log("🔧 Generating fallback 1P1G maps...");const n={};for(let e=0;e<20;e++){const a=1+e%3,r=2+Math.floor(e/4),o=10+e%5;n[String(e)]=[{initPlayerGrid:[7,a],target1:[r,o],mapType:"1P1G"}]}return console.log(`✅ Generated ${Object.keys(n).length} fallback 1P1G maps`),n}generate1P2GMaps(){const n={};for(let e=0;e<20;e++)n[String(e)]=[{initPlayerGrid:[7,1],target1:[3,7],target2:[11,7],mapType:"1P2G"}];return n}generate2P2GMaps(){const n={},e=[{player1:[7,2],player2:[7,14],goal1:[1,8],goal2:[14,8]},{player1:[2,7],player2:[14,7],goal1:[8,1],goal2:[8,13]},{player1:[7,1],player2:[7,13],goal1:[3,7],goal2:[11,7]},{player1:[1,7],player2:[13,7],goal1:[7,3],goal2:[7,11]},{player1:[3,3],player2:[11,11],goal1:[3,11],goal2:[11,3]},{player1:[5,2],player2:[9,12],goal1:[2,7],goal2:[12,7]},{player1:[2,5],player2:[12,9],goal1:[7,2],goal2:[7,12]},{player1:[6,1],player2:[8,13],goal1:[1,6],goal2:[13,8]}];for(let t=0;t<99;t++){const a=e[t%e.length];n[String(297+t)]=[{initPlayerGrid:a.player1,initAIGrid:a.player2,target1:a.goal1,target2:a.goal2,mapType:"2P2G"}]}return n}generate2P3GMaps(){const n={},e=[{player1:[7,2],player2:[7,14],goal1:[1,8],goal2:[14,8]},{player1:[2,7],player2:[14,7],goal1:[8,1],goal2:[8,13]},{player1:[7,1],player2:[7,13],goal1:[3,7],goal2:[11,7]},{player1:[1,7],player2:[13,7],goal1:[7,3],goal2:[7,11]},{player1:[3,3],player2:[11,11],goal1:[3,11],goal2:[11,3]},{player1:[5,2],player2:[9,12],goal1:[2,7],goal2:[12,7]},{player1:[2,5],player2:[12,9],goal1:[7,2],goal2:[7,12]},{player1:[6,1],player2:[8,13],goal1:[1,6],goal2:[13,8]}];for(let t=0;t<99;t++){const a=e[t%e.length];n[String(397+t)]=[{initPlayerGrid:a.player1,initAIGrid:a.player2,target1:a.goal1,target2:a.goal2,mapType:"2P3G"}]}return n}getMapsForExperiment(n){if(console.log(`🎯 Getting maps for experiment: ${n}`),!this.mapData)return console.warn("⚠️ Map data not loaded yet, using fallback"),this.getFallbackMaps(n);const e=this.mapData[n];return e?(console.log(`✅ Found ${Object.keys(e).length} maps for ${n}`),e):(console.error(`❌ No map data available for experiment type: ${n}`),this.getFallbackMaps(n))}getFallbackMaps(n){switch(n){case"1P1G":return this.generate1P1GMaps();case"1P2G":return this.generate1P2GMaps();case"2P2G":return this.generate2P2GMaps();case"2P3G":return this.generate2P3GMaps();default:return console.error(`Unknown experiment type: ${n}`),{}}}selectRandomMaps(n,e){if(!n||typeof n!="object")return console.error("Invalid map data provided:",n),[];const t=Object.keys(n);if(t.length===0)return console.error("No keys found in map data"),[];const a=[];for(let r=0;r<e;r++){const o=t[Math.floor(Math.random()*t.length)],s=n[o];Array.isArray(s)&&s.length>0&&a.push({...s[0]})}return console.log(`Selected ${a.length} random maps from ${t.length} available maps`),a}getRandomMapForCollaborationGame(n,e){if(e>=i.game.successThreshold.randomSamplingAfterTrial){const t=this.getMapsForExperiment(n);if(console.log(`Getting random map for ${n} trial ${e+1}, mapData:`,t),!t||Object.keys(t).length===0)return console.error(`No map data available for ${n}`),this.createFallbackDesign(n);try{const a=Object.keys(t);if(a.length===0)return this.createFallbackDesign(n);const r=Number(window.__SESSION_SEED__||0);let o=2166136261;const s=`${n}|${e}|${r}`;for(let d=0;d<s.length;d++)o^=s.charCodeAt(d),o=Math.imul(o,16777619);const l=Math.abs(o)%a.length,c=a[l],p=t[c];if(Array.isArray(p)&&p.length>0)return{...p[0]}}catch{const r=this.selectRandomMaps(t,1);if(r.length>0)return r[0]}return console.error(`No selectable maps for ${n}`),this.createFallbackDesign(n)}else return console.log(`Using timeline map data for ${n} trial ${e}`),null}createFallbackDesign(n){const e={"1P1G":{initPlayerGrid:[7,1],target1:[7,7],mapType:"1P1G"},"1P2G":{initPlayerGrid:[7,1],target1:[3,7],target2:[11,7],mapType:"1P2G"},"2P2G":{initPlayerGrid:[7,2],initAIGrid:[7,14],target1:[1,8],target2:[14,8],mapType:"2P2G"},"2P3G":{initPlayerGrid:[7,2],initAIGrid:[7,14],target1:[1,8],target2:[14,8],mapType:"2P3G"}};return e[n]||e["1P1G"]}async checkServerHealth(){try{return(await fetch("/health",{method:"GET",timeout:2e3})).ok}catch{return!1}}loadAllFallbackMaps(){return console.log("🔧 Loading all fallback maps..."),{"1P1G":this.getFallbackMaps("1P1G"),"1P2G":this.getFallbackMaps("1P2G"),"2P2G":this.getFallbackMaps("2P2G"),"2P3G":this.getFallbackMaps("2P3G")}}}const te=new ee;class ae{constructor(n,e,t=null){var a;this.gameStateManager=n,this.uiManager=e,this.timelineManager=t,this.rlAgent=new In,this.gptClient=new pn,this.currentExperimentSequence=[],this.currentExperimentIndex=0,this.currentTrialIndex=0,this.isRunning=!1,this.gameLoopInterval=null,this.aiMoveInterval=null,this.newGoalIntervalId=null,this.aiPlayerNumber=2,this.mapLoader=te;try{(a=i==null?void 0:i.debug)!=null&&a.disableConsoleLogs||console.log("🗺️ ExperimentManager initialized with MapLoader")}catch{}this.ensureMapDataLoaded(),this.setupTimelineIntegration()}activateAIFallback(n=(t=>(t=i==null?void 0:i.multiplayer)==null?void 0:t.fallbackAIType)()||"rl_joint",e=2){var a,r,o,s,l,c,p,d,g,u,h,y,f,T,m;try{try{(a=i==null?void 0:i.debug)!=null&&a.disableConsoleLogs||console.log(`[DEBUG] activateAIFallback called - fallbackType: ${n}, aiPlayerNumber: ${e}`)}catch{}this.aiPlayerNumber=e===1?1:2;const G=this.aiPlayerNumber===1?2:1;L.setPlayerType(this.aiPlayerNumber,n),L.setPlayerType(G,"human");try{(r=i==null?void 0:i.debug)!=null&&r.disableConsoleLogs||console.log(`[DEBUG] After setPlayerType - Player1: ${i.game.players.player1.type}, Player2: ${i.game.players.player2.type}`)}catch{}this.rlAgent||(this.rlAgent=new In);try{const P=(o=this.gameStateManager)==null?void 0:o.trialData;if(P){if(n==="gpt"){const b=(c=(l=(s=i==null?void 0:i.game)==null?void 0:s.agent)==null?void 0:l.gpt)==null?void 0:c.model;P.partnerAgentType=b&&String(b).trim()?b:"gpt",(!b||!String(b).trim())&&((p=this.logCurrentAIModel)==null||p.call(this))}else n==="rl_joint"?P.partnerAgentType="joint-rl":n==="rl_individual"?P.partnerAgentType="individual-rl":P.partnerAgentType=String(n);P.humanPlayerIndex=G-1,P.aiPlayerIndex=this.aiPlayerNumber-1}}catch{}if((g=(d=i==null?void 0:i.game)==null?void 0:d.agent)!=null&&g.synchronizedMoves){console.log("🤖 AI fallback activated (synchronized moves)");try{(u=i==null?void 0:i.debug)!=null&&u.disableConsoleLogs||console.log("[DEBUG] Setting up independent AI movement after human goal")}catch{}this.setupIndependentAIAfterHumanGoal()}try{const P=(y=(h=this.gameStateManager)==null?void 0:h.currentState)==null?void 0:y.experimentType;if(P==="2P3G"){try{(f=i==null?void 0:i.debug)!=null&&f.disableConsoleLogs||console.log("[DEBUG] Restarting new goal checking for 2P3G after AI fallback")}catch{}this.setupNewGoalCheck2P3G()}else if(P==="1P2G"){try{(T=i==null?void 0:i.debug)!=null&&T.disableConsoleLogs||console.log("[DEBUG] Restarting new goal checking for 1P2G after AI fallback")}catch{}this.setupNewGoalCheck1P2G()}}catch(P){console.warn("Failed to restart new goal checking after fallback:",(P==null?void 0:P.message)||P)}(m=this.logCurrentAIModel)==null||m.call(this)}catch(G){console.warn("Failed to activate AI fallback:",(G==null?void 0:G.message)||G)}}async startExperiment(n){await this.startExperimentSequence([n])}async startExperimentSequence(n){this.currentExperimentSequence=n||i.game.experiments.order,this.currentExperimentIndex=0,this.isRunning=!0,console.log("Starting experiment sequence:",this.currentExperimentSequence),await this.startNextExperiment()}async startNextExperiment(){if(this.currentExperimentIndex>=this.currentExperimentSequence.length){this.completeAllExperiments();return}const n=this.currentExperimentSequence[this.currentExperimentIndex];console.log(`Starting experiment ${this.currentExperimentIndex+1}/${this.currentExperimentSequence.length}: ${n}`),this.currentTrialIndex=0,await this.showExperimentIntroduction(n),await this.startNextTrial(n)}async showExperimentIntroduction(n){return Promise.resolve()}async startNextTrial(n){var a,r,o,s,l,c;if(!n){console.error("startNextTrial called with undefined experimentType"),this.completeAllExperiments();return}const e=L.getNumTrials(n)||12;if(this.shouldEndExperimentEarly(n)){console.log(`Experiment ${n} ended early due to success threshold`),this.currentExperimentIndex++,await this.startNextExperiment();return}if(this.currentTrialIndex>=e){console.log(`Completed all trials for ${n}`),this.currentExperimentIndex++,await this.startNextExperiment();return}console.log(`Starting trial ${this.currentTrialIndex+1}/${e} for ${n}`);let t=await this.getTrialDesign(n,this.currentTrialIndex);t||(console.error("Failed to get trial design, using fallback"),t=I.createFallbackDesign(n));try{const p=(o=(r=(a=i==null?void 0:i.game)==null?void 0:a.players)==null?void 0:r.player1)==null?void 0:o.type,d=(c=(l=(s=i==null?void 0:i.game)==null?void 0:s.players)==null?void 0:l.player2)==null?void 0:c.type;String(n||"").includes("2P")&&(p==="gpt"||d==="gpt")&&await this.logCurrentAIModel()}catch{}this.gameStateManager.initializeTrial(this.currentTrialIndex,n,t),this.uiManager.updateGameInfo(this.currentExperimentIndex,this.currentTrialIndex,n),this.uiManager.updateGameDisplay(this.gameStateManager.getCurrentState()),this.startTrialExecution(n)}startTrialExecution(n){switch(this.clearGameIntervals(),n){case"1P1G":this.runTrial1P1G();break;case"1P2G":this.runTrial1P2G();break;case"2P2G":this.runTrial2P2G();break;case"2P3G":this.runTrial2P3G();break;default:console.error("Unknown experiment type:",n)}this.setupGameTimeout()}runTrial1P1G(){}runTrial1P2G(){this.setupNewGoalCheck1P2G()}runTrial2P2G(){const n=i.game.players.player1.type,e=i.game.players.player2.type;e!=="human"||n!=="human"?(this.aiPlayerNumber=e!=="human"?2:1,this.logCurrentAIModel(),console.log("2P2G: Synchronized human-AI moves enabled"),this.setupIndependentAIAfterHumanGoal()):console.log("2P2G: Human-human mode - waiting for network player actions")}runTrial2P3G(){const n=i.game.players.player1.type,e=i.game.players.player2.type;e!=="human"||n!=="human"?(this.aiPlayerNumber=e!=="human"?2:1,this.logCurrentAIModel(),console.log("2P3G: Synchronized human-AI moves enabled"),this.setupIndependentAIAfterHumanGoal()):console.log("2P3G: Human-human mode - waiting for network player actions"),this.setupNewGoalCheck2P3G()}async logCurrentAIModel(){var n,e,t,a,r,o,s,l,c,p,d,g;try{const u=(t=(e=(n=i==null?void 0:i.game)==null?void 0:n.players)==null?void 0:e.player2)==null?void 0:t.type;if(u==="gpt"){const h=(i.server.url||"").replace(/\/$/,""),y=await fetch(`${h}/api/ai/gpt/config`);if(y.ok){const f=await y.json(),T=(f==null?void 0:f.model)||"(unknown)";try{if(T&&T!=="(unknown)"){const m=(o=(r=(a=i==null?void 0:i.game)==null?void 0:a.agent)==null?void 0:r.gpt)==null?void 0:o.model;(!m||!/^gpt-?tom$/i.test(String(m)))&&(i.game.agent.gpt.model=T);const G=(s=this.gameStateManager)==null?void 0:s.trialData,P=(l=this.gameStateManager)==null?void 0:l.currentState;if(G&&P&&String(P.experimentType||"").includes("2P")&&(G.partnerAgentType=T,G.partnerFallbackOccurred)){(!G.partnerFallbackAIType||/^gpt$/i.test(String(G.partnerFallbackAIType)))&&(G.partnerFallbackAIType=T);try{const b=(c=this.gameStateManager)==null?void 0:c.experimentData,v=Number.isInteger(P.trialIndex)?P.trialIndex:null;b&&Array.isArray(b.fallbackEvents)&&b.fallbackEvents.forEach(w=>{(v!==null?w.trialIndex===v:!0)&&(!w.aiType||/^gpt$/i.test(String(w.aiType)))&&(w.aiType=T)})}catch{}}try{const b=(p=this.gameStateManager)==null?void 0:p.experimentData;b&&Array.isArray(b.allTrialsData)&&b.allTrialsData.forEach(v=>{v&&v.partnerFallbackOccurred&&(!v.partnerFallbackAIType||/^gpt$/i.test(String(v.partnerFallbackAIType)))&&(v.partnerFallbackAIType=T),v&&String(v.partnerAgentType||"").toLowerCase()==="gpt"&&(v.partnerAgentType=T)}),b&&Array.isArray(b.fallbackEvents)&&b.fallbackEvents.forEach(v=>{v&&(!v.aiType||/^gpt$/i.test(String(v.aiType)))&&(v.aiType=T)})}catch{}}}catch{}}}else if(u==="rl_joint"||u==="rl_individual"||u==="ai"){const h=((g=(d=i==null?void 0:i.game)==null?void 0:d.agent)==null?void 0:g.type)||(u==="rl_joint"?"joint":"individual");console.log(`🤖 AI partner: RL mode = ${h}`)}}catch(u){console.log("🤖 AI partner: failed to log model info:",(u==null?void 0:u.message)||u)}}setupIndependentAIAfterHumanGoal(){let n=!1;const e=setInterval(()=>{const t=this.gameStateManager.getCurrentState();if(!t.player1||!t.player2)return;const r=(this.aiPlayerNumber===1?2:1)===1?t.player1:t.player2,o=I.isGoalReached(r,t.currentGoals);!n&&o&&(n=!0,this.startIndependentAIMovement())},100);this.gameLoopInterval=e}async handleSynchronizedMove(n){const e=i.game.players.player1.type,t=i.game.players.player2.type;if(e==="human"&&t==="human")return;const a=this.gameStateManager.getCurrentState();if(!a.player1||!a.player2)return;const r=this.aiPlayerNumber===1?2:1;let o=null;const s=a.experimentType==="2P2G"||a.experimentType==="2P3G";let l=null;if((this.aiPlayerNumber===1?i.game.players.player1.type:i.game.players.player2.type)==="gpt"&&s)try{o=await this.gptClient.getNextAction({...a,trialData:this.gameStateManager.getCurrentTrialData()},{aiPlayerNumber:this.aiPlayerNumber}),o&&typeof o=="object"&&(Object.prototype.hasOwnProperty.call(o,"inferredGoal")&&this.gameStateManager.recordAIInferredOtherGoal(o.inferredGoal??null),o=(o==null?void 0:o.action)||null)}catch(d){l=d,console.warn("GPT agent request failed during synchronized move; falling back to RL:",(d==null?void 0:d.message)||d)}if(!o){if(!this.rlAgent)return;const d=this.rlAgent.getAIAction(a.gridMatrix,this.aiPlayerNumber===1?a.player1:a.player2,a.currentGoals,this.aiPlayerNumber===1?a.player2:a.player1);o=this.actionToDirection(d),l&&this.gameStateManager.recordGptErrorEvent({phase:"synchronized",error:(l==null?void 0:l.message)||String(l),humanDirection:n,fallback:"rl",fallbackDirection:o})}let p;r===1?p=this.gameStateManager.processSynchronizedMoves(n,o):p=this.gameStateManager.processSynchronizedMovesMapped(2,n,o),this.uiManager.updateGameDisplay(this.gameStateManager.getCurrentState());try{const d=this.gameStateManager.getCurrentState(),g=r===1?d.player1:d.player2,u=this.aiPlayerNumber===1?d.player1:d.player2,h=I.isGoalReached(g,d.currentGoals),y=I.isGoalReached(u,d.currentGoals);h&&!y&&!this.aiMoveInterval&&this.startIndependentAIMovement()}catch{}p!=null&&p.trialComplete&&this.handleTrialComplete(p)}setupAIMovement(){const n=i.game.agent.delay;let e=!1;this.uiManager.on("player-move",()=>{const a=this.gameStateManager.getCurrentState();a.player2&&(I.isGoalReached(a.player2,a.currentGoals)||setTimeout(()=>{this.makeAIMove()},n))});const t=setInterval(()=>{const a=this.gameStateManager.getCurrentState();if(!a.player1||!a.player2)return;const r=I.isGoalReached(a.player1,a.currentGoals);!e&&r&&(e=!0,this.startIndependentAIMovement())},100);this.gameLoopInterval=t}async makeAIMove(){var s,l,c,p,d;const n=this.gameStateManager.getCurrentState(),e=this.aiPlayerNumber===1?n.player1:n.player2;if(!e||!n.currentGoals||I.isGoalReached(e,n.currentGoals))return;let t=null;const a=this.aiPlayerNumber===1?i.game.players.player1.type:i.game.players.player2.type,r=n.experimentType==="2P2G"||n.experimentType==="2P3G";let o=null;if(a==="gpt"&&r)try{t=await this.gptClient.getNextAction({...n,trialData:this.gameStateManager.getCurrentTrialData()},{aiPlayerNumber:this.aiPlayerNumber}),t&&typeof t=="object"&&(Object.prototype.hasOwnProperty.call(t,"inferredGoal")&&this.gameStateManager.recordAIInferredOtherGoal(t.inferredGoal??null),t=(t==null?void 0:t.action)||null)}catch(g){o=g,console.warn("GPT agent failed, falling back to RL. Reason:",(g==null?void 0:g.message)||g)}if(!t){if(!this.rlAgent)return;const g=this.rlAgent.getAIAction(n.gridMatrix,this.aiPlayerNumber===1?n.player1:n.player2,n.currentGoals,this.aiPlayerNumber===1?n.player2:n.player1);if(g[0]===0&&g[1]===0)return;t=this.actionToDirection(g),o&&this.gameStateManager.recordGptErrorEvent({phase:"independent",error:(o==null?void 0:o.message)||String(o),humanDirection:null,fallback:"rl",fallbackDirection:t})}if(t){const g=this.gameStateManager.processPlayerMove(this.aiPlayerNumber,t);this.uiManager.updateGameDisplay(this.gameStateManager.getCurrentState());try{const u=this.gameStateManager.getCurrentState(),h=(c=(l=(s=i==null?void 0:i.game)==null?void 0:s.players)==null?void 0:l.player2)==null?void 0:c.type;if((h==="rl_joint"||h==="ai"||((d=(p=i==null?void 0:i.game)==null?void 0:p.agent)==null?void 0:d.type)==="joint")&&this.rlAgent&&typeof this.rlAgent.precalculatePolicyForGoals=="function"){const f=Array.isArray(u==null?void 0:u.currentGoals)?u.currentGoals:[];f.length>0&&setTimeout(()=>this.rlAgent.precalculatePolicyForGoals(f,experimentType),0)}}catch{}g.trialComplete&&this.handleTrialComplete(g)}}startIndependentAIMovement(){this.aiMoveInterval&&clearInterval(this.aiMoveInterval),this.aiMoveInterval=setInterval(()=>{const n=this.gameStateManager.getCurrentState(),e=this.aiPlayerNumber===1?n.player1:n.player2;if(e){if(I.isGoalReached(e,n.currentGoals)){clearInterval(this.aiMoveInterval),this.aiMoveInterval=null;return}this.makeAIMove()}},i.game.agent.independentDelay)}setupNewGoalCheck1P2G(){this.newGoalIntervalId&&(clearInterval(this.newGoalIntervalId),this.newGoalIntervalId=null);const e=setInterval(()=>{var s,l,c,p,d,g,u,h,y,f,T;const t=this.gameStateManager.currentState,a=this.gameStateManager.trialData;if(!t||!a||a.newGoalPresented||t.experimentType!=="1P2G"||!t.currentGoals||t.currentGoals.length!==2||this.gameStateManager.stepCount<((s=i.oneP2G)==null?void 0:s.minStepsBeforeNewGoal))return;const r=a.distanceCondition||a.newGoalConditionType||i.oneP2G.distanceConditions.CLOSER_TO_PLAYER1,o=cn.checkNewGoalPresentation1P2G(this.gameStateManager.getCurrentState(),this.gameStateManager.getCurrentTrialData(),r);if(o){this.gameStateManager.addGoal(o.position),this.gameStateManager.markNewGoalPresented(o.position,r,{}),this.rlAgent&&typeof this.rlAgent.resetNewGoalPreCalculationFlag=="function"&&this.rlAgent.resetNewGoalPreCalculationFlag();try{const m=this.gameStateManager.getCurrentState(),G=(p=(c=(l=i==null?void 0:i.game)==null?void 0:l.players)==null?void 0:c.player2)==null?void 0:p.type;if((G==="rl_joint"||G==="ai"||((g=(d=i==null?void 0:i.game)==null?void 0:d.agent)==null?void 0:g.type)==="joint")&&this.rlAgent&&typeof this.rlAgent.precalculatePolicyForGoals=="function"){const b=Array.isArray(m==null?void 0:m.currentGoals)?m.currentGoals:[];b.length>0&&setTimeout(()=>this.rlAgent.precalculatePolicyForGoals(b,(m==null?void 0:m.experimentType)||null),0)}}catch{}try{const m=this.gameStateManager.getCurrentState(),G=(y=(h=(u=i==null?void 0:i.game)==null?void 0:u.players)==null?void 0:h.player2)==null?void 0:y.type;if((G==="rl_joint"||G==="ai"||((T=(f=i==null?void 0:i.game)==null?void 0:f.agent)==null?void 0:T.type)==="joint")&&this.rlAgent&&typeof this.rlAgent.precalculatePolicyForGoals=="function"){const b=Array.isArray(m==null?void 0:m.currentGoals)?m.currentGoals:[];b.length>0&&setTimeout(()=>this.rlAgent.precalculatePolicyForGoals(b,(m==null?void 0:m.experimentType)||null),0)}}catch{}this.uiManager.updateGameDisplay(this.gameStateManager.getCurrentState())}},100);this.newGoalIntervalId=e}setupNewGoalCheck2P3G(){this.newGoalIntervalId&&(clearInterval(this.newGoalIntervalId),this.newGoalIntervalId=null),this._loggedFallbackMode=!1;const e=setInterval(()=>{var c,p;const t=i.game.players.player1.type==="human"&&i.game.players.player2.type==="human";if(t&&!(!!this.timelineManager&&this.timelineManager.playerIndex===0))return;if(!t&&!this._loggedFallbackMode){const d=i.game.players.player1.type,g=i.game.players.player2.type;try{(c=i==null?void 0:i.debug)!=null&&c.disableConsoleLogs||console.log(`[DEBUG] New goal check active in human-AI mode: P1=${d}, P2=${g}, aiPlayerNumber=${this.aiPlayerNumber}`)}catch{}this._loggedFallbackMode=!0}const a=this.gameStateManager.currentState,r=this.gameStateManager.trialData;if(!a||!r||r.newGoalPresented||a.experimentType!=="2P3G"||!a.currentGoals||a.currentGoals.length<2||!a.player1||!a.player2)return;const o=r.distanceCondition||r.newGoalConditionType||i.twoP3G.distanceConditions.CLOSER_TO_PLAYER2;let s=cn.checkNewGoalPresentation2P3G(this.gameStateManager.getCurrentState(),this.gameStateManager.getCurrentTrialData(),o);if(!s&&typeof r.firstDetectedSharedGoal=="number"&&r.firstDetectedSharedGoal!==null)try{const d=cn.generateNewGoal(a.player2,a.player1,a.currentGoals,r.firstDetectedSharedGoal,o);d&&d.position&&(s=d)}catch{}if(!s)return;if((p=this.gameStateManager.trialData)!=null&&p.newGoalPresented){console.log("🔧 [RACE PROTECTION] Goal already presented, skipping duplicate generation");return}console.log("🎯 [GOAL GEN] Generating new goal at position:",s.position),this.gameStateManager.addGoal(s.position);const l=typeof s.distanceToPlayer2=="number"&&typeof s.distanceToPlayer1=="number"?{isNewGoalCloserToPlayer2:s.distanceToPlayer2<s.distanceToPlayer1}:{};if(this.gameStateManager.markNewGoalPresented(s.position,o,l),this.rlAgent&&typeof this.rlAgent.resetNewGoalPreCalculationFlag=="function"&&this.rlAgent.resetNewGoalPreCalculationFlag(),this.uiManager.updateGameDisplay(this.gameStateManager.getCurrentState()),t)try{const d=window.__NETWORK_MANAGER__;d&&typeof d.syncGameState=="function"&&d.syncGameState(this.gameStateManager.getCurrentState())}catch{}},100);this.newGoalIntervalId=e}actionToDirection(n){const[e,t]=n;return e===-1&&t===0?"up":e===1&&t===0?"down":e===0&&t===-1?"left":e===0&&t===1?"right":null}setupGameTimeout(){var e,t,a;const n=Number((t=(e=i==null?void 0:i.game)==null?void 0:e.timing)==null?void 0:t.maxTrialDurationMs)||0;if(n>0){const r=setTimeout(()=>{console.log("Game timeout reached"),this.handleTrialComplete({success:!1,timeout:!0})},n);this.gameTimeoutId=r}else try{(a=i==null?void 0:i.debug)!=null&&a.disableConsoleLogs||console.log("[DEBUG] Trial time cap disabled (maxTrialDurationMs=0)")}catch{}}handleTrialComplete(n){if(console.log("Trial completed:",n),this.timelineManager&&this.currentTrialCompleteCallback){this.handleTimelineTrialComplete(n);return}this.clearGameIntervals();const e=this.gameStateManager.getCurrentState().experimentType;let t;e&&e.startsWith("1P")?t=!!(this.gameStateManager.getCurrentState().player1&&I.isGoalReached(this.gameStateManager.getCurrentState().player1,this.gameStateManager.getCurrentState().currentGoals)):t=!!(n.success||n.trialComplete),this.gameStateManager.finalizeTrial(t),this.uiManager.showTrialFeedback(n),setTimeout(()=>{if(this.currentTrialIndex++,this.currentExperimentIndex>=this.currentExperimentSequence.length){console.log("All experiments completed during timeout"),this.completeAllExperiments();return}const a=this.currentExperimentSequence[this.currentExperimentIndex];a?this.startNextTrial(a):(console.error("No current experiment found, completing all experiments"),this.completeAllExperiments())},i.game.timing.trialToFeedbackDelay+i.game.timing.feedbackDisplayDuration)}shouldEndExperimentEarly(n){return!1}completeAllExperiments(){var t;if(!this.isRunning){console.log("Experiments already completed, ignoring duplicate call");return}console.log("All experiments completed"),this.isRunning=!1;const n=this.gameStateManager.getExperimentData(),e={totalTrials:n.allTrialsData.length,successfulTrials:n.allTrialsData.filter(a=>a.completed||a.collaborationSucceeded).length,successRate:I.calculateSuccessRate(n.allTrialsData),totalTime:I.formatDuration(Date.now()-(((t=n.allTrialsData[0])==null?void 0:t.trialStartTime)||Date.now()))};this.uiManager.showExperimentComplete(e),this.exportExperimentData(n)}exportExperimentData(n){console.log("Export suppressed: data saving handled by timeline (cloud only).")}async startMultiplayerExperiment(n){console.log("Starting multiplayer experiment:",n),this.currentExperimentSequence=[n.experimentType],n.gameMode==="human-human"&&(this.rlAgent=null),await this.startExperimentSequence()}isValidGridPosition(n){return Array.isArray(n)&&n.length>=2&&Number.isInteger(n[0])&&Number.isInteger(n[1])&&n[0]>=0&&n[0]<i.game.matrixSize&&n[1]>=0&&n[1]<i.game.matrixSize}validateTrialDesign(n,e){if(!e||typeof e!="object"||!this.isValidGridPosition(e.initPlayerGrid)||!this.isValidGridPosition(e.target1)||(n==="1P2G"||n.includes("2P"))&&!this.isValidGridPosition(e.target2))return!1;if(n.includes("2P")){if(!this.isValidGridPosition(e.initAIGrid))return!1;const[t,a]=e.initPlayerGrid,[r,o]=e.initAIGrid;if(!(t===r||a===o))return console.warn("⚠️ Rejecting misaligned 2P map design:",e),!1}return!0}async getTrialDesign(n,e){if(!n)return console.error("getTrialDesign called with undefined experimentType"),null;console.log(`🗺️ Loading trial design for ${n} trial ${e}`),await this.ensureMapDataLoaded();try{if(n.includes("2P")&&e>=i.game.successThreshold.randomSamplingAfterTrial){const s=this.mapLoader.getRandomMapForCollaborationGame(n,e);if(this.validateTrialDesign(n,s))return console.log("✅ Loaded random map design:",s),s}const t=this.mapLoader.getMapsForExperiment(n);if(console.log(`🗺️ Available maps for ${n}:`,Object.keys(t||{}).length),!t||Object.keys(t).length===0)return console.warn("⚠️ No maps available, using fallback design"),this.mapLoader.createFallbackDesign(n);const a=Object.keys(t),r=a[e%a.length],o=t[r];if(Array.isArray(o)&&o.length>0){const s={...o[0]};if(this.validateTrialDesign(n,s))return console.log(`✅ Loaded map design for trial ${e}:`,s),s}return console.warn("⚠️ Invalid map structure or layout, using fallback design"),this.mapLoader.createFallbackDesign(n)}catch(t){return console.error("❌ Error loading trial design:",t),this.mapLoader.createFallbackDesign(n)}}async ensureMapDataLoaded(){this.mapLoader.mapData||(console.log("🗺️ Waiting for map data to load..."),await this.mapLoader.initialize(),console.log("✅ Map data loaded for ExperimentManager"))}clearGameIntervals(){this.gameLoopInterval&&(clearInterval(this.gameLoopInterval),this.gameLoopInterval=null),this.aiMoveInterval&&(clearInterval(this.aiMoveInterval),this.aiMoveInterval=null),this.newGoalIntervalId&&(clearInterval(this.newGoalIntervalId),this.newGoalIntervalId=null),this.gameTimeoutId&&(clearTimeout(this.gameTimeoutId),this.gameTimeoutId=null)}setupTimelineIntegration(){this.timelineManager&&(this.timelineManager.on("show-fixation",n=>{this.handleFixationDisplay(n)}),this.timelineManager.on("start-trial",n=>{this.handleTimelineTrialStart(n)}),this.timelineManager.on("show-trial-feedback",n=>{this.handleTrialFeedback(n)}),this.timelineManager.on("ai-fallback-activated",n=>{var a;try{(a=i==null?void 0:i.debug)!=null&&a.disableConsoleLogs||console.log("[DEBUG] ExperimentManager received ai-fallback-activated event:",n)}catch{}const{fallbackType:e,aiPlayerNumber:t}=n;this.activateAIFallback(e,t)}),console.log("✅ Timeline integration setup completed"))}handleFixationDisplay(n){const{experimentType:e,experimentIndex:t,trialIndex:a}=n;console.log(`⚡ Showing fixation for ${e} trial ${a}`);const r=document.getElementById("fixation-canvas-container");r?(r.innerHTML=`
        <div style="font-size: 48px; font-weight: bold; color: #333; padding: 50px;">
          +
        </div>
      `,console.log("✅ Fixation cross added to timeline container")):(console.warn("⚠️ Fixation container not found, timeline may not be set up properly"),this.uiManager.showFixation())}async handleTimelineTrialStart(n){var o;const{experimentType:e,experimentIndex:t,trialIndex:a,onComplete:r}=n;console.log(`🎮 Timeline starting trial ${a} of ${e}`),this.currentTrialCompleteCallback=r;try{const s=window.__GAME_APPLICATION__;s&&e.includes("2P")&&(console.log("🔗 Notifying GameApplication of trial start for inactivity tracking"),(o=s.handleTrialStart)==null||o.call(s,e,t,a))}catch(s){console.warn("⚠️ Could not notify GameApplication of trial start:",s)}try{let s=await this.getTrialDesign(e,a);s||(console.error("Failed to get trial design, using fallback"),s=I.createFallbackDesign(e)),this.gameStateManager.initializeTrial(a,e,s),this.uiManager.updateGameInfo(t,a,e);const l=document.getElementById("game-canvas-container");l?(console.log("✅ Found timeline game container, setting up game canvas"),this.uiManager.setupGameCanvasInContainer(l)):console.warn("⚠️ Timeline game container not found, using fallback"),this.uiManager.updateGameDisplay(this.gameStateManager.getCurrentState()),this.startTimelineTrialExecution(e)}catch(s){console.error("❌ Error starting timeline trial:",s);const l=I.createFallbackDesign(e);this.gameStateManager.initializeTrial(a,e,l),this.uiManager.updateGameInfo(t,a,e),this.uiManager.updateGameDisplay(this.gameStateManager.getCurrentState()),this.startTimelineTrialExecution(e)}}startTimelineTrialExecution(n){switch(this.clearGameIntervals(),n){case"1P1G":this.runTrial1P1G();break;case"1P2G":this.runTrial1P2G();break;case"2P2G":this.runTrial2P2G();break;case"2P3G":this.runTrial2P3G();break;default:console.error("Unknown experiment type:",n)}this.setupTimelineGameTimeout()}setupTimelineGameTimeout(){var e,t,a;const n=Number((t=(e=i==null?void 0:i.game)==null?void 0:e.timing)==null?void 0:t.maxTrialDurationMs)||0;if(n>0){const r=setTimeout(()=>{console.log("Game timeout reached"),this.handleTimelineTrialComplete({success:!1,timeout:!0})},n);this.gameTimeoutId=r}else try{(a=i==null?void 0:i.debug)!=null&&a.disableConsoleLogs||console.log("[DEBUG] Timeline trial time cap disabled (maxTrialDurationMs=0)")}catch{}}handleTimelineTrialComplete(n){var o;console.log("Timeline trial completed:",n),this.clearGameIntervals();try{const s=window.__GAME_APPLICATION__;s&&(console.log("🔗 Notifying GameApplication of trial completion"),(o=s.handleTrialEnd)==null||o.call(s))}catch(s){console.warn("⚠️ Could not notify GameApplication of trial completion:",s)}const e=this.gameStateManager.getCurrentTrialData(),t=this.gameStateManager.getCurrentState().experimentType;let a;t&&t.startsWith("1P")?a=!!(this.gameStateManager.getCurrentState().player1&&I.isGoalReached(this.gameStateManager.getCurrentState().player1,this.gameStateManager.getCurrentState().currentGoals)):(typeof e.collaborationSucceeded!="boolean"&&(e.collaborationSucceeded=!1),a=e.collaborationSucceeded===!0),this.gameStateManager.finalizeTrial(a);const r={...n,success:a,trialData:this.gameStateManager.getCurrentTrialData(),gameState:this.gameStateManager.getCurrentState()};this.currentTrialCompleteCallback&&(this.currentTrialCompleteCallback(r),this.currentTrialCompleteCallback=null)}handleTrialFeedback(n){const{success:e,experimentType:t,trialIndex:a,canvasContainer:r}=n;console.log(`📊 Showing trial feedback for ${t} trial ${a}`);const o=t.startsWith("1P")?"single":"collaboration";this.uiManager.showTrialFeedbackInContainer(e,r,o)}restart(){this.clearGameIntervals(),this.gameStateManager.reset(),this.currentExperimentIndex=0,this.currentTrialIndex=0,this.isRunning=!1}pause(){this.clearGameIntervals()}resume(){if(this.isRunning&&this.currentExperimentIndex<this.currentExperimentSequence.length){const n=this.currentExperimentSequence[this.currentExperimentIndex];n?this.startTrialExecution(n):console.error("No current experiment found during resume")}}}class ie{constructor(n){this.container=n,this.stages=[],this.currentStageIndex=0,this.mapData={},this.hasShownPartnerFindingStage=!1,this.waitingTimes=[],this.experimentData={participantId:this.getParticipantId(),lookitResponseId:this.getLookitResponseId(),lookitChildId:this.getLookitChildId(),startTime:new Date().toISOString(),experiments:{},questionnaire:{},participantDob:null,participantAgeReferenceDate:null,participantAgeYears:null,participantAgeMonths:null,participantAgeDays:null,participantAgeTotalDays:null,totalScore:0,completed:!1},this.eventHandlers=new Map,this.successThreshold={consecutiveSuccesses:0,totalTrialsCompleted:0,experimentEndedEarly:!1,lastSuccessTrial:-1,successHistory:[]},this.sharedMapData={},this.isMapHost=!1,this.pendingMapSync=!1,this.playerIndex=0,this.gameMode="human-ai"}on(n,e){this.eventHandlers.has(n)||this.eventHandlers.set(n,[]),this.eventHandlers.get(n).push(e)}off(n,e){if(this.eventHandlers.has(n)){const t=this.eventHandlers.get(n),a=t.indexOf(e);a>-1&&t.splice(a,1)}}emit(n,e){this.eventHandlers.has(n)&&this.eventHandlers.get(n).forEach(t=>{try{t(e)}catch(a){console.error(`Error in timeline event handler for ${n}:`,a)}})}setPlayerInfo(n,e){this.playerIndex=n,this.gameMode=e,console.log(`🎮 TimelineManager: Set player info - Player ${n+1} (${n===0?"red":"purple"}) in ${e} mode`)}createTimelineStages(){this.stages=[],console.log("📋 Creating comprehensive timeline stages..."),this.stages.push({type:"start",handler:()=>this.showStartStage()}),this.stages.push({type:"welcome_info",handler:()=>this.showWelcomeInfoStage()});const n=i.game.experiments.order;for(let e=0;e<n.length;e++){const t=n[e],a=L.getNumTrials(t);console.log(`📋 Adding stages for experiment: ${t}`),this.stages.push({type:"instructions",experimentType:t,experimentIndex:e,handler:()=>this.showInstructionsStage(t,e)}),t==="2P2G"&&this.stages.push({type:"comprehension_check",experimentType:t,experimentIndex:e,handler:()=>this.showComprehensionCheckStage(t,e)});const r=t.includes("2P");if(console.log(`🔍 Experiment ${t}: isMultiplayer=${r}`),r&&(this.hasShownPartnerFindingStage?(console.log(`➕ Skipping waiting and match-play stages for ${t}; checking partner presence only`),this.stages.push({type:"check_partner_presence",experimentType:t,experimentIndex:e,handler:()=>this.checkPartnerPresenceAndProceed(t,e)})):(console.log(`➕ Adding waiting + match-play stages for ${t}`),this.stages.push({type:"waiting_for_partner",experimentType:t,experimentIndex:e,handler:()=>this.showWaitingForPartnerStage(t,e)}),this.stages.push({type:"match_play",experimentType:t,experimentIndex:e,showPartnerFoundMessage:!0,handler:()=>this.showMatchPlayStage(t,e)}),this.hasShownPartnerFindingStage=!0)),t.includes("2P")&&i.game.successThreshold.enabled)this.addCollaborationExperimentStages(t,e);else for(let o=0;o<a;o++)this.addTrialStages(t,e,o)}this.stages.push({type:"questionnaire",handler:()=>this.showQuestionnaireStage()}),this.stages.push({type:"end-info",handler:()=>this.showEndExperimentInfoStage()}),console.log(`📋 Timeline created with ${this.stages.length} total stages`),console.log("📋 Stages:",this.stages.map((e,t)=>`${t}: ${e.type}`).join(", "))}addTrialStages(n,e,t){this.stages.push({type:"fixation",experimentType:n,experimentIndex:e,trialIndex:t,handler:()=>this.showFixationStage(n,e,t)}),this.stages.push({type:"trial",experimentType:n,experimentIndex:e,trialIndex:t,handler:()=>this.runTrialStage(n,e,t)}),this.stages.push({type:"post-trial",experimentType:n,experimentIndex:e,trialIndex:t,handler:()=>this.showPostTrialStage(n,e,t)})}addCollaborationExperimentStages(n,e){this.initializeSuccessThresholdTracking(),this.addTrialStages(n,e,0)}start(){this.createTimelineStages(),this.currentStageIndex=this.shouldSkipDobInput()?1:0,this.currentStageIndex===1&&console.log("🧪 DOB input skipped by test URL parameter"),this.runCurrentStage()}runCurrentStage(){if(this.currentStageIndex>=this.stages.length){console.log("🏁 Timeline completed!");return}const n=this.stages[this.currentStageIndex];console.log(`🎬 Running stage ${this.currentStageIndex}: ${n.type}`);try{n.handler()}catch(e){console.error(`❌ Error running stage ${n.type}:`,e),this.nextStage()}}nextStage(){console.log(`➡️ Advancing from stage ${this.currentStageIndex} to ${this.currentStageIndex+1}`),this.currentStageIndex++,this.runCurrentStage()}showConsentStage(){this.container.innerHTML=`
      <div style="display: flex; align-items: center; justify-content: center; min-height: 100vh; background: #f8f9fa;">
        <div style="max-width: 800px; margin: 20px; background: white; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); padding: 40px;">
          <h1 style="color: #333; text-align: center; margin-bottom: 30px;">Informed Consent for Research Participation</h1>

          <div style="max-height: 400px; overflow-y: auto; padding: 20px; border: 1px solid #ddd; border-radius: 5px; margin-bottom: 30px; background: #fafafa;">
            <h3>Key Information</h3>
            <p>This consent form asks you to take part in a research study. This study is conducted by researchers at Duke University and UCLA.</p>

            <h4>Purpose</h4>
            <p>The purpose of this study is to investigate how people make decisions.</p>

            <h4>What you will be asked to do</h4>
            <p>You will be playing a series of navigation games on a 2D grid map. Afterward, you will complete some questionnaires regarding your game experience. The study will take approximately 10 minutes to complete.</p>

            <h4>Benefits and Risks</h4>
            <p>There are no foreseen risks or benefits for participating in this study. Should any of the content cause you distress at any point throughout the study, you may stop at any time.</p>

            <h4>Confidentiality</h4>
            <p>We do not ask for your name or any other information that might identify you. Although collected data may be made public or used for future research purposes, your identity will always remain confidential.</p>

            <h4>Voluntary nature of participation</h4>
            <p>Your participation in this research study is voluntary. You may withdraw at any time and you may choose not to answer any question, but you must proceed to the final screen of the study in order to receive your completion code, which you must submit in order to be paid.</p>

            <h4>Compensation</h4>
            <p>You will receive $3 for your participation in this study, and an additional bonus (up to $1) if you finish the task beyond a certain threshold.</p>

            <h4>Contact Information</h4>
            <p>For questions about the study or for research-related complaints, concerns or suggestions about the research, contact Dr. Tamar Kushnir at (919) 660-5640 during regular business hours. For questions about your rights as a participant contact the Duke Campus Institutional Review Board at campusirb@duke.edu. Please reference Protocol ID# 2024-0427 in your email.</p>

            <h4>Agreement</h4>
            <p>By clicking the button below, you acknowledge that your participation in the study is voluntary, you are 18 years of age or older, and that you are aware that you may choose to terminate your participation in the study at any time and for any reason.</p>
          </div>

          <div style="text-align: center;">
            <label style="display: flex; align-items: center; justify-content: center; margin-bottom: 20px; font-size: 16px;">
              <input type="checkbox" id="consentCheckbox" style="margin-right: 10px; transform: scale(1.2);">
              I have read and understood the above information, and I consent to participate in this study.
            </label>

            <button id="continueBtn" disabled style="background: #28a745; color: white; border: none; padding: 12px 30px; font-size: 16px; border-radius: 5px; cursor: not-allowed; margin-right: 10px;">
              Continue to Experiment
            </button>

            <button onclick="window.close()" style="background: #dc3545; color: white; border: none; padding: 12px 30px; font-size: 16px; border-radius: 5px; cursor: pointer;">
              Decline and Exit
            </button>
          </div>
        </div>
      </div>
    `;const n=document.getElementById("consentCheckbox"),e=document.getElementById("continueBtn");n.addEventListener("change",()=>{n.checked?(e.disabled=!1,e.style.cursor="pointer",e.style.background="#28a745"):(e.disabled=!0,e.style.cursor="not-allowed",e.style.background="#6c757d")}),e.addEventListener("click",()=>{n.checked&&(this.experimentData.consentTime=new Date().toISOString(),console.log("✅ Consent obtained"),this.nextStage())})}showStartStage(){var r;this.container.innerHTML=`
      <div style="display: flex; align-items: center; justify-content: center; min-height: 100vh; background: #f8f9fa;">
        <div style="background: white; padding: 36px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); max-width: 560px; width: calc(100% - 40px); text-align: center;">
          <h2 style="color: #333; margin: 0 0 12px; font-size: 28px;">Welcome to the Game!</h2>
          <p style="font-size: 16px; color: #444; line-height: 1.5; margin: 0 0 24px;">
            Please enter your kid's date of birth to start the game.
          </p>

          <form id="dobStartForm" style="display: flex; flex-direction: column; gap: 18px; align-items: stretch;">
            <div style="display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 12px; text-align: left;">
              <label style="font-weight: bold; color: #333;">
                Month
                <select id="dobMonth" required style="width: 100%; margin-top: 6px; padding: 12px; border: 1px solid #bbb; border-radius: 6px; font-size: 16px; background: white;">
                  <option value="">Month</option>
                  ${Array.from({length:12},(o,s)=>`<option value="${s+1}">${s+1}</option>`).join("")}
                </select>
              </label>
              <label style="font-weight: bold; color: #333;">
                Day
                <select id="dobDay" required style="width: 100%; margin-top: 6px; padding: 12px; border: 1px solid #bbb; border-radius: 6px; font-size: 16px; background: white;">
                  <option value="">Day</option>
                  ${Array.from({length:31},(o,s)=>`<option value="${s+1}">${s+1}</option>`).join("")}
                </select>
              </label>
              <label style="font-weight: bold; color: #333;">
                Year
                <select id="dobYear" required style="width: 100%; margin-top: 6px; padding: 12px; border: 1px solid #bbb; border-radius: 6px; font-size: 16px; background: white;">
                  <option value="">Year</option>
                  ${Array.from({length:2024-2018+1},(o,s)=>2018+s).map(o=>`<option value="${o}">${o}</option>`).join("")}
                </select>
              </label>
            </div>

            <div id="dobError" role="alert" style="min-height: 22px; color: #dc3545; font-size: 15px; text-align: center;"></div>

            <button id="startBtn" type="submit" style="align-self: center; background: #28a745; color: white; border: none; padding: 16px 52px; font-size: 22px; font-weight: bold; border-radius: 8px; cursor: pointer; box-shadow: 0 4px 6px rgba(0,0,0,0.1); transition: background 0.3s;">
              Start
            </button>
          </form>
        </div>
      </div>
    `;const n=document.getElementById("dobStartForm"),e=document.getElementById("startBtn"),t=document.getElementById("dobError"),a=o=>{t&&(t.textContent=o||"")};e.addEventListener("mouseenter",()=>{e.style.background="#218838"}),e.addEventListener("mouseleave",()=>{e.style.background="#28a745"}),n.addEventListener("submit",o=>{var g,u,h;o.preventDefault();const s=Number((g=document.getElementById("dobYear"))==null?void 0:g.value),l=Number((u=document.getElementById("dobMonth"))==null?void 0:u.value),c=Number((h=document.getElementById("dobDay"))==null?void 0:h.value),p=`${String(s).padStart(4,"0")}-${String(l).padStart(2,"0")}-${String(c).padStart(2,"0")}`,d=this.calculateAgeFromDob(p,new Date);if(!d){a("Please enter a real date of birth that is not in the future.");return}Object.assign(this.experimentData,d),this.nextStage()}),(r=document.getElementById("dobMonth"))==null||r.focus()}showWelcomeInfoStage(){this.container.innerHTML=`
      <div style="display: flex; align-items: center; justify-content: center; min-height: 100vh; background: #f8f9fa;">
        <style>
          @keyframes welcomeArrowBounce {
            0%, 100% { transform: translate(-50%, -5px); }
            50% { transform: translate(-50%, 7px); }
          }
        </style>
        <div style="background: white; padding: 36px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); width: calc(100% - 48px); max-width: 1120px; text-align: center;">
          <h2 style="color: #333; margin: 0 0 24px; font-size: 36px;">Welcome to the Game!</h2>
          
          <div style="display: flex; justify-content: center; align-items: stretch; gap: 24px; flex-wrap: wrap; margin: 0 auto;">
            <div style="flex: 1 1 640px; min-width: 0; background: #f8fbff; border: 2px solid #007bff; border-radius: 12px; padding: 18px; text-align: center;">
              <h3 style="color: #1f2937; margin: 0 0 16px; font-size: 22px; line-height: 1.3;">
                <span style="display: block;">Hungry travelers need to reach restaurants</span>
                <span style="display: block;">as quickly as possible!</span>
              </h3>
              <div style="display: flex; justify-content: center; align-items: center; gap: 22px; flex-wrap: wrap;">
                <div style="display: flex; justify-content: center; align-items: center; gap: 18px; flex-wrap: wrap;">
                  <div aria-label="Example game map" style="display: grid; grid-template-columns: repeat(5, 36px); grid-template-rows: repeat(5, 36px); gap: 3px; border: 2px solid #2f3a4a; padding: 7px; background: white; border-radius: 9px; box-shadow: 0 4px 10px rgba(0,0,0,0.06);">
                    ${Array.from({length:25},(o,s)=>{const l=s===3,c=s===11;return`<div style="background: ${l?"#007bff":c?"red":"#f8f9fa"}; border: 1px solid #d7dde6; border-radius: ${l?"4px":c?"50%":"0"}; ${c?"box-shadow: 0 2px 5px rgba(255,0,0,0.25);":""}"></div>`}).join("")}
                  </div>
                  <div style="display: flex; flex-direction: column; gap: 10px; font-size: 18px; color: #333; text-align: left;">
                    <div style="display: flex; align-items: center; gap: 8px;"><div style="width: 20px; height: 20px; background: red; border-radius: 50%;"></div><span>Traveler</span></div>
                    <div style="display: flex; align-items: center; gap: 8px;"><div style="width: 20px; height: 20px; background: #007bff; border-radius: 4px;"></div><span>Restaurant</span></div>
                  </div>
                </div>

                <div style="display: flex; justify-content: center; align-items: center;">
                  <div style="display: grid; grid-template-columns: 220px 176px; grid-template-rows: 54px 54px 24px; column-gap: 18px; row-gap: 7px; align-items: start; justify-content: center;">
                    <div aria-label="Space bar" style="grid-column: 1; grid-row: 2; position: relative; width: 220px; height: 54px; border: 2px solid #bac7d6; border-radius: 9px; display: flex; align-items: center; justify-content: center; background: #fff; box-shadow: 0 4px 0 #d7dde6; font-size: 18px; font-weight: bold; letter-spacing: 1px; color: #222;">
                      <div id="welcomeSpacebarPrompt" aria-hidden="true" style="display: none; position: absolute; left: 50%; top: -56px; width: 34px; height: 50px; pointer-events: none; animation: welcomeArrowBounce 0.8s ease-in-out infinite;">
                        <div style="width: 6px; height: 32px; margin: 0 auto; background: #28a745; border-radius: 999px;"></div>
                        <div style="width: 0; height: 0; margin: -1px auto 0; border-left: 14px solid transparent; border-right: 14px solid transparent; border-top: 18px solid #28a745;"></div>
                      </div>
                      SPACE BAR
                    </div>
                    <div style="grid-column: 1; grid-row: 3; color: #475467; font-size: 15px; text-align: center;">start or continue</div>
                    <div aria-label="Arrow keys" style="grid-column: 2; grid-row: 1 / span 2; display: grid; grid-template-columns: repeat(3, 54px); grid-template-rows: repeat(2, 54px); gap: 7px;">
                      <div></div>
                      <div style="width: 54px; height: 54px; border: 2px solid #bac7d6; border-radius: 9px; display: flex; align-items: center; justify-content: center; background: #fff; box-shadow: 0 4px 0 #d7dde6; font-size: 30px; font-weight: bold; color: #1f2937;">&uarr;</div>
                      <div></div>
                      <div style="width: 54px; height: 54px; border: 2px solid #bac7d6; border-radius: 9px; display: flex; align-items: center; justify-content: center; background: #fff; box-shadow: 0 4px 0 #d7dde6; font-size: 30px; font-weight: bold; color: #1f2937;">&larr;</div>
                      <div style="width: 54px; height: 54px; border: 2px solid #bac7d6; border-radius: 9px; display: flex; align-items: center; justify-content: center; background: #fff; box-shadow: 0 4px 0 #d7dde6; font-size: 30px; font-weight: bold; color: #1f2937;">&darr;</div>
                      <div style="width: 54px; height: 54px; border: 2px solid #bac7d6; border-radius: 9px; display: flex; align-items: center; justify-content: center; background: #fff; box-shadow: 0 4px 0 #d7dde6; font-size: 30px; font-weight: bold; color: #1f2937;">&rarr;</div>
                    </div>
                    <div style="grid-column: 2; grid-row: 3; color: #475467; font-size: 15px; text-align: center;">move your traveler</div>
                  </div>
                </div>
              </div>

            </div>

            <div style="flex: 1 1 360px; min-width: 0; display: flex; flex-direction: column; justify-content: center;">
              <video 
                id="welcomeVideo"
                width="100%" 
                height="360"
                controls
                autoPlay
                playsInline
                style="display: block; width: 100%; height: auto; max-height: 420px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); background: #000;">
                <source src="${this.assetUrl("video1.mp4")}" type="video/mp4">
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
        </div>
      </div>
    `;const n=document.getElementById("welcomeVideo"),e=document.getElementById("welcomeSpacebarPrompt");let t=!n;const a=()=>{t=!0,e&&(e.style.display="block")};if(n?(n.addEventListener("ended",a,{once:!0}),n.addEventListener("error",a,{once:!0}),n.ended&&a()):a(),n){n.autoplay=!0,n.playsInline=!0,n.defaultMuted=!1,n.muted=!1,n.volume=1;const o=()=>(n.muted=!1,n.volume=1,n.play()),s=()=>{o().catch(l=>{console.warn("Unable to start welcome video with sound after interaction:",l)}),document.removeEventListener("click",s),document.removeEventListener("keydown",s),n.removeEventListener("click",s)};o().catch(l=>{console.warn("Unable to autoplay welcome video with sound, falling back to muted:",l),n.muted=!0,n.play().catch(c=>{console.warn("Unable to autoplay muted welcome video:",c)}),document.addEventListener("click",s,{once:!0}),document.addEventListener("keydown",s,{once:!0}),n.addEventListener("click",s,{once:!0})})}const r=o=>{if(o.code==="Space"||o.key===" "){if(o.preventDefault(),o.stopPropagation(),!t)return;document.removeEventListener("keydown",r,!0),console.log("🎮 Starting game sequence"),this.nextStage()}};document.addEventListener("keydown",r,!0),document.body.focus()}showInstructionsStage(n,e){const t=this.getInstructionsForExperiment(n);this.container.innerHTML=t.html;let a=null;(n==="1P1G"||n==="1P2G"||n==="2P2G"||n==="2P3G")&&(a=document.getElementById("game1Video")||document.getElementById("game2Video")||document.getElementById("game3Video")||document.getElementById("game4Video")||this.container.querySelector("video"),a&&(a.autoplay=!0,a.playsInline=!0,(()=>(a.muted=!1,a.volume=1,a.play()))().catch(u=>{console.warn("Unable to autoplay instruction video with sound, falling back to muted:",u),a.muted=!0,a.play().catch(y=>{console.warn("Unable to autoplay muted instruction video:",y)});const h=()=>{a.muted=!1,a.volume=1,a.play().catch(y=>{console.warn("Unable to start instruction video with sound after interaction:",y)}),document.removeEventListener("click",h),document.removeEventListener("keydown",h),a.removeEventListener("click",h)};document.addEventListener("click",h,{once:!0}),document.addEventListener("keydown",h,{once:!0}),a.addEventListener("click",h,{once:!0})})));const r=document.getElementById("instructionContinuePanel"),o=document.getElementById("instructionContinueBtn");let s=!a,l=!1;const c=()=>{s=!0,r&&(r.style.display="block"),o&&(o.disabled=!1,o.style.cursor="pointer",o.style.opacity="1")};a?(a.addEventListener("ended",c,{once:!0}),a.addEventListener("error",c,{once:!0}),a.ended&&c()):c();const p=g=>{g&&(g.preventDefault(),g.stopPropagation()),!(!s||l)&&(l=!0,document.removeEventListener("keydown",d,!0),o&&o.removeEventListener("click",p),console.log(`📋 Instructions completed for ${n}`),this.nextStage())},d=g=>{(g.code==="Space"||g.key===" ")&&p(g)};document.addEventListener("keydown",d,!0),o&&o.addEventListener("click",p),document.body.focus()}showComprehensionCheckStage(n,e){const t=(a=!1)=>{this.container.innerHTML=`
        <div style="display: flex; align-items: center; justify-content: center; min-height: 100vh; background: #f8f9fa;">
          <div style="background: white; padding: 40px; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); max-width: 700px; text-align: center;">
            ${a?`
              <h2 style="color:rgb(0, 0, 0); margin-bottom: 20px; font-size: 32px;">Remember you are the red dot, try again!</h2>
            `:`
              <h2 style="color: #333; margin-bottom: 20px; font-size: 32px;">Which dot are you?</h2>
              <p style="font-size: 20px; color: #555; margin-bottom: 30px;">
                Press on your dot to continue.
              </p>
            `}

            <div style="display: flex; justify-content: center; gap: 80px; margin-bottom: 30px;">
              <button id="red-dot-btn" style="
                width: 100px;
                height: 100px;
                border-radius: 50%;
                border: 4px solid #cc0000;
                background: #ff0000;
                cursor: pointer;
                box-shadow: 0 4px 8px rgba(0,0,0,0.2);
              ">
              </button>

              <button id="orange-dot-btn" style="
                width: 100px;
                height: 100px;
                border-radius: 50%;
                border: 4px solid #6600cc;
                background: #8000ff;
                cursor: pointer;
                box-shadow: 0 4px 8px rgba(0,0,0,0.2);
              ">
              </button>
            </div>

          </div>
        </div>
      `;let r=null;const o=()=>{try{r&&(r.pause(),r.currentTime=0,r=null)}catch{}};(()=>{if(a)try{const p=new Audio(this.assetUrl("tryAgain.mp3"));r=p,p.play().catch(d=>{console.warn("Unable to autoplay tryAgain audio:",d)})}catch(p){console.warn("Error starting tryAgain audio:",p)}else try{const p=new Audio(this.assetUrl("comprehensionCheck.mp3"));r=p,p.play().catch(d=>{console.warn("Unable to autoplay comprehension audio:",d)})}catch(p){console.warn("Error starting comprehension audio:",p)}})();const l=document.getElementById("red-dot-btn"),c=document.getElementById("orange-dot-btn");l&&l.addEventListener("click",()=>{o(),console.log("✅ Comprehension check passed (red dot selected). Continuing to Game 3."),this.nextStage()}),c&&c.addEventListener("click",()=>{o(),console.log("⚠️ Comprehension check failed (purple dot selected). Showing error message."),t(!0)})};t(!1)}checkPartnerPresenceAndProceed(n,e){var a,r,o;console.log(`🔍 Checking partner presence for ${n} transition...`),((o=(r=(a=i==null?void 0:i.game)==null?void 0:a.players)==null?void 0:r.player2)==null?void 0:o.type)==="human"?(this.emit("check-partner-status",{experimentType:n,experimentIndex:e}),this.partnerStatusChecked=!1,this.shouldSkipMatchPlay=!1,setTimeout(()=>{var l,c,p;this.partnerStatusChecked||(console.log("⏰ Partner status check timeout - assuming partner disconnected"),this.shouldSkipMatchPlay=!0,this.partnerStatusChecked=!0),((p=(c=(l=i==null?void 0:i.game)==null?void 0:l.players)==null?void 0:c.player2)==null?void 0:p.type)==="human"&&!this.shouldSkipMatchPlay?(console.log("✅ Partner still connected, proceeding to match-play stage"),this.nextStage()):(console.log("🤖 Partner disconnected, switching to AI mode"),this.gameMode="human-ai",this.nextStage())},3e3)):(console.log("🤖 Already in AI mode, skipping match-play stage"),this.gameMode="human-ai",this.nextStage())}showWaitingForPartnerStage(n,e){var g,u,h,y,f,T,m;const t=(u=(g=i==null?void 0:i.game)==null?void 0:g.timing)==null?void 0:u.waitingForPartnerMinDuration,a=(y=(h=i==null?void 0:i.game)==null?void 0:h.timing)==null?void 0:y.waitingForPartnerMaxDuration,r=Date.now()+t;let o=!1;const s=Date.now();if(console.log("⏱️ [WAITING] Partner search started at:",new Date(s).toISOString()),this.container.innerHTML=`
      <div style="display: flex; align-items: center; justify-content: center; min-height: 100vh; background: #f8f9fa;">
        <div id="waiting-room" style="background: white; padding: 40px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); max-width: 600px; text-align: center;">
          <h2 style="color: #333; margin-bottom: 30px;">Finding another player ...</h2>

          <div style="margin-bottom: 30px;">
            <div style="display: inline-block; width: 40px; height: 40px; border: 4px solid #f3f3f3; border-top: 4px solid #007bff; border-radius: 50%; animation: spin 1s linear infinite;"></div>
          </div>

          <p style="font-size: 18px; color: #666; margin-bottom: 20px;">Connecting you with another player...</p>

          <p style="font-size: 14px; color: #999; margin-bottom: 15px;">
            This may take a few moments.
          </p>


        </div>
      </div>

      <style>
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      </style>
    `,!(((m=(T=(f=i==null?void 0:i.game)==null?void 0:f.players)==null?void 0:T.player2)==null?void 0:m.type)==="human")){this.gameMode="human-ai",setTimeout(()=>{this.nextStage()},Math.max(0,r-Date.now()));return}const c=G=>{var P;if(G.code==="Space"||G.key===" "){if(G.preventDefault(),Date.now()<r)return;const b=Date.now(),v=b-s;console.log("⏱️ [WAITING] Skipped after waiting duration:",v+"ms ("+(v/1e3).toFixed(1)+"s)"),this.recordWaitingTime(s,b,v,"skip",n,e),document.removeEventListener("keydown",c),console.log("⏭️ Skipping multiplayer waiting after min wait - continuing with AI partner");const w=((P=i==null?void 0:i.multiplayer)==null?void 0:P.fallbackAIType)||"rl_joint";L.setPlayerType(2,w);try{this.emit("fallback-to-ai",{reason:"waiting-skip",stage:"waiting-for-partner",at:Date.now(),fallbackAIType:w})}catch{}this.nextStage()}};document.addEventListener("keydown",c),this.emit("waiting-for-partner",{experimentType:n,experimentIndex:e});const p=document.getElementById("cancel-wait-btn");p&&(p.onclick=()=>{console.log("⚠️ Waiting canceled by user"),window.close()});const d=G=>{console.log("👥 Partner connected - will advance after minimum waiting time",G),this.gameMode="human-human",o=!0;const P=Date.now(),b=P-s;console.log("⏱️ [WAITING] Partner found! Waiting duration:",b+"ms ("+(b/1e3).toFixed(1)+"s)"),this.recordWaitingTime(s,P,b,"partner_found",n,e),document.removeEventListener("keydown",c),this.off("partner-connected",d);let v=r;if(G&&G.connectedAt){const k=G.connectedAt+t;v=Math.max(v,k)}const w=Math.max(0,v-Date.now());setTimeout(()=>this.nextStage(),w)};this.eventHandlers.delete("partner-connected"),this.on("partner-connected",d),setTimeout(()=>{var G,P;if(!o){const b=Date.now(),v=b-s;console.log("⏱️ [WAITING] Timeout after waiting duration:",v+"ms ("+(v/1e3).toFixed(1)+"s)"),this.recordWaitingTime(s,b,v,"timeout",n,e),console.log(`⌛ No partner found after ${a}ms - falling back to AI mode`);const w=((G=i==null?void 0:i.multiplayer)==null?void 0:G.fallbackAIType)||"rl_joint";L.setPlayerType(2,w),this.gameMode="human-ai",document.removeEventListener("keydown",c);try{this.emit("fallback-to-ai",{reason:"waiting-timeout",stage:"waiting-for-partner",at:Date.now(),fallbackAIType:w})}catch{}try{(P=i==null?void 0:i.debug)!=null&&P.disableConsoleLogs||console.log("[DEBUG] Timeline emitting ai-fallback-activated event (waiting timeout)")}catch{}this.emit("ai-fallback-activated",{fallbackType:w,aiPlayerNumber:2}),this.nextStage()}},a)}showReadyToPlayStage(n,e){if(this.isHumanHumanMode()&&i.game.players.player2.type==="human"){this.container.innerHTML=`
        <div style="display: flex; align-items: center; justify-content: center; min-height: 100vh; background: #f8f9fa;">
          <div style="background: white; padding: 40px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); max-width: 600px; text-align: center;">
            <h2 style="color: #333; margin-bottom: 20px;">Partner Found</h2>
            <p style="font-size: 16px; color: #333; margin-bottom: 15px;">Click ready when you're prepared to start.</p>
            <button id="ready-btn" style="background: #28a745; color: white; border: none; padding: 12px 30px; border-radius: 5px; font-size: 16px; cursor: pointer;">
              Ready to Play
            </button>
            <p style="margin-top: 15px; font-size: 12px; color: #666;">Waiting for both players to be ready...</p>
          </div>
        </div>
        <style>
          #ready-btn:hover { background: #218838 !important; }
        </style>
      `;const a=document.getElementById("ready-btn");a&&(a.onclick=()=>{a.disabled=!0,a.textContent="Waiting for partner...",a.style.background="#6c757d",this.emit("player-ready")});const r=()=>{console.log("🎮 All players ready - proceed to match play gate"),this.off("all-players-ready",r),this.nextStage()};this.eventHandlers.delete("all-players-ready"),this.on("all-players-ready",r)}else this.nextStage()}showMatchPlayStage(n,e){const r=(this.stages[this.currentStageIndex]||{}).showPartnerFoundMessage!==!1?`<p><strong>${this.isHumanHumanMode()?"Another player found!":"Another player found and connection established!"}</strong></p>`:"";this.container.innerHTML=`
      <div style="display: flex; align-items: center; justify-content: center; min-height: 100vh; background: #f8f9fa;">
        <div style="max-width: 600px; margin: 20px; background: white; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); padding: 40px; text-align: center;">
          <h1 style="color: #28a745; margin-bottom: 30px;">✅ Game is Ready!</h1>
          <div style="margin: 20px 0; text-align: center;">
            <video
              id="matchPlayVideo"
              width="100%"
              height="400"
              controls
              autoplay
              playsinline
              style="max-width: 600px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
              <source src="${this.assetUrl("video3.mp4")}" type="video/mp4">
              Your browser does not support the video tag.
            </video>
          </div>
          <div style="font-size: 20px; color: #333; margin-bottom: 20px;">
            ${r}
            <p style="margin-top: 10px; font-size: 20px;">
              You are ${this.playerIndex===0?"Player 1 (Red)":"Player 2 (Orange)"}
              <span style="display:inline-block; width: 14px; height: 14px; background-color: ${this.playerIndex===0?i.visual.colors.player1:i.visual.colors.player2}; border-radius: 50%; vertical-align: middle; margin-left: 6px;"></span>
            </p>
            <div id="matchStartPanel" style="display: none; margin: 24px auto 0; max-width: 480px; background: #f8fbff; border: 2px solid #28a745; border-radius: 12px; padding: 18px 22px; text-align: center;">
              <p style="margin: 0 0 14px; font-size: 24px; font-weight: 700; color: #333;">Press the spacebar or click here to start the game!</p>
              <button id="matchStartBtn" type="button" disabled style="background: #28a745; color: white; border: none; padding: 14px 42px; font-size: 22px; font-weight: bold; border-radius: 8px; cursor: not-allowed; opacity: 0.55; box-shadow: 0 4px 6px rgba(0,0,0,0.1); transition: background 0.2s, opacity 0.2s;">
                Start Game
              </button>
              <p style="font-size: 14px; margin: 14px 0 0;">${this.isHumanHumanMode()?"Both players must be ready to begin.":""}</p>
              <div id="match-status" style="font-size: 14px; color: #666; display: none; margin-top: 8px;">Waiting for the other player to be ready...</div>
            </div>

          </div>
        </div>
      </div>
    `;const o=document.getElementById("matchPlayVideo"),s=document.getElementById("matchStartPanel"),l=document.getElementById("matchStartBtn");let c=!1,p=!1;const d=()=>{c=!0,s&&(s.style.display="block"),l&&(l.disabled=!1,l.style.cursor="pointer",l.style.opacity="1")};o?(o.addEventListener("ended",d,{once:!0}),o.addEventListener("error",d,{once:!0}),o.ended&&d()):d();const g=u=>{var y;const h=(u==null?void 0:u.type)==="keydown"&&(u.code==="Space"||u.key===" ");if(!((u==null?void 0:u.type)==="keydown"&&!h)&&(u&&(u.preventDefault(),u.stopPropagation()),!(!c||p)))if(p=!0,document.removeEventListener("keydown",g,!0),l&&(l.removeEventListener("click",g),l.disabled=!0,l.textContent=this.isHumanHumanMode()?"Waiting...":"Starting...",l.style.cursor="default",l.style.opacity="0.75"),this.emit("match-play-ready"),this.isHumanHumanMode()&&i.game.players.player2.type==="human"){const f=document.getElementById("match-status");f&&(f.style.display="block");const T=(y=i==null?void 0:i.multiplayer)==null?void 0:y.matchPlayReadyTimeout;let m=null;const G=()=>{var b,v,w,k;try{console.log(`⌛ Match-play wait exceeded (${T}ms) - falling back to AI mode`);const S=((b=i==null?void 0:i.multiplayer)==null?void 0:b.fallbackAIType)||"rl_joint";try{(v=i==null?void 0:i.debug)!=null&&v.disableConsoleLogs||console.log(`[DEBUG] Timeline fallback - fallbackType: ${S}`)}catch{}L.setPlayerType(2,S);try{(w=i==null?void 0:i.debug)!=null&&w.disableConsoleLogs||console.log(`[DEBUG] Timeline fallback - After setPlayerType, Player2: ${i.game.players.player2.type}`)}catch{}this.gameMode="human-ai",this.off("all-players-ready",P);try{(k=i==null?void 0:i.debug)!=null&&k.disableConsoleLogs||console.log("[DEBUG] Timeline emitting ai-fallback-activated event")}catch{}this.emit("ai-fallback-activated",{fallbackType:S,aiPlayerNumber:2})}catch{}this.nextStage()},P=()=>{this.off("all-players-ready",P),m&&(clearTimeout(m),m=null),this.nextStage()};this.eventHandlers.delete("all-players-ready"),this.on("all-players-ready",P),m=setTimeout(()=>{var v;const b=((v=i==null?void 0:i.multiplayer)==null?void 0:v.fallbackAIType)||"rl_joint";try{this.emit("fallback-to-ai",{reason:"match-play-timeout",stage:"match-play",at:Date.now(),fallbackAIType:b})}catch{}G()},T)}else this.nextStage()};document.addEventListener("keydown",g,!0),l&&l.addEventListener("click",g),document.body.focus()}showFixationStage(n,e,t){this.container.innerHTML=`
      <div style="display: flex; align-items: center; justify-content: center; min-height: 100vh; background: #f8f9fa;">
        <div style="text-align: center;">
          <div id="fixation-canvas-container"></div>
          <div style="margin-top: 20px; font-size: 14px; color: #666;">
          </div>
        </div>
      </div>
    `,this.emit("show-fixation",{experimentType:n,experimentIndex:e,trialIndex:t});const a=o=>{(o.code==="Space"||o.key===" ")&&(o.preventDefault(),document.removeEventListener("keydown",a),console.log("⏭️ Fixation skipped by user"),this.nextStage())};document.addEventListener("keydown",a),console.log(`⏰ Setting fixation timeout for ${i.game.timing.fixationDuration}ms`);const r=setTimeout(()=>{document.removeEventListener("keydown",a),console.log(`⚡ Fixation completed for trial ${t} - advancing to next stage`),this.nextStage()},i.game.timing.fixationDuration);this.currentFixationTimeout=r}runTrialStage(n,e,t){var l,c,p;console.log(`🎮 Starting trial ${t} of ${n}`);let a=i.visual.colors.player1,r="Player 1 (Red)";n.includes("2P")&&(a=this.playerIndex===0?i.visual.colors.player1:i.visual.colors.player2,r=this.playerIndex===0?"Player 1 (Red)":"Player 2 (Orange)");const o=L.getNumTrials(n),s=((p=(c=(l=i==null?void 0:i.game)==null?void 0:l.experiments)==null?void 0:c.order)==null?void 0:p.length)||1;this.container.innerHTML=`
      <div
        data-grid-fit-container="true"
        data-grid-reserved-height="125"
        style="box-sizing: border-box; display: flex; align-items: flex-start; justify-content: center; min-height: 100vh; background: #f8f9fa; padding: 10px 16px 48px; overflow: hidden;"
      >
        <div style="text-align: center; max-width: 800px; width: 100%; display: flex; flex-direction: column; align-items: center;">
          <h3 id="game-title" style="margin: 4px 0 10px; font-size: 18px; line-height: 1.2;">Game ${e+1}/${s}: Round ${t+1}/${o}</h3>
          <div id="game-canvas-container" style="margin: 0 auto; position: relative; display: flex; justify-content: center; width: 100%; max-width: 100%;">
            <!-- Game canvas will be inserted here by ExperimentManager -->
          </div>
          <div style="margin-top: 8px; font-size: 14px; color: #666; line-height: 1.3;">
            <p style="margin: 0;">You are ${r} <span style="display: inline-block; width: 18px; height: 18px; background-color: ${a}; border-radius: 50%; vertical-align: middle;"></span>. Use arrow keys to move.</p>
          </div>
        </div>
      </div>
    `,this.emit("start-trial",{experimentType:n,experimentIndex:e,trialIndex:t,onComplete:d=>{this.experimentData.experiments[n]||(this.experimentData.experiments[n]=[]),this.experimentData.experiments[n].push(d),n.includes("2P")&&i.game.successThreshold.enabled&&this.updateSuccessThresholdTracking(d.success,t),console.log(`✅ Trial ${t} completed`),this.nextStage()}})}showPostTrialStage(n,e,t){var c,p,d,g;const a=(c=this.experimentData.experiments[n])==null?void 0:c[t],r=(a==null?void 0:a.success)||!1,o=L.getNumTrials(n),s=((g=(d=(p=i==null?void 0:i.game)==null?void 0:p.experiments)==null?void 0:d.order)==null?void 0:g.length)||1,l=document.getElementById("game-canvas-container");l?this.emit("show-trial-feedback",{success:r,experimentType:n,trialIndex:t,canvasContainer:l}):(this.container.innerHTML=`
        <div style="display: flex; align-items: center; justify-content: center; min-height: 100vh; background: #f8f9fa;">
          <div style="text-align: center; max-width: 600px; width: 100%;">
            <h3 style="margin-bottom: 10px;">Game ${e+1}/${s}</h3>
            <h4 style="margin-bottom: 20px;">Round ${t+1}/${o} Results</h4>
            <div id="feedbackCanvasContainer" style="margin: 0 auto 20px auto; position: relative; display: flex; justify-content: center;"></div>
          </div>
        </div>
      `,this.emit("show-trial-feedback",{success:r,experimentType:n,trialIndex:t,canvasContainer:document.getElementById("feedbackCanvasContainer")})),setTimeout(()=>{console.log(`📊 Post-trial feedback completed for trial ${t}`),n.includes("2P")&&i.game.successThreshold.enabled?this.shouldContinueToNextTrial(n,t)?(console.log(`Continuing to next trial for ${n}`),this.addNextTrialStages(n,e,t+1),this.nextStage()):(console.log(`Ending ${n} experiment`),this.skipToNextExperimentOrCompletion(n)):this.nextStage()},i.game.timing.feedbackDisplayDuration)}showGameFeedbackStage(){const e=Object.values(this.experimentData.experiments).flat().map(d=>(d==null?void 0:d.trialData)||d).filter(Boolean),t=e.length;let a=0;if(e.length>0){const d=Math.min(...e.map(h=>Number(h.trialStartTime||0)||0)),g=Math.max(...e.map(h=>Number(h.endTime||h.trialEndTime||0)||0)),u=Math.max(0,g-d);a=Math.round(u/(1e3*60))}const r=e.some(d=>String(d.experimentType||"").includes("2P")),o=e.some(d=>String(d.experimentType||"").includes("1P"));let s=0;if(o){const d=e.filter(u=>String(u.experimentType||"").includes("1P")),g=d.filter(u=>u.completed===!0).length;s=d.length>0?Math.round(g/d.length*100):0}let l=0;if(r){const d=e.filter(u=>String(u.experimentType||"").includes("2P")),g=d.filter(u=>u.collaborationSucceeded===!0).length;l=d.length>0?Math.round(g/d.length*100):0}this.container.innerHTML=`
      <div style="display: flex; align-items: center; justify-content: center; min-height: 100vh; background: #f8f9fa;">
        <div style="background: white; padding: 40px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); max-width: 700px; width: 100%; text-align: center;">
          <h2 style="color: #333; margin-bottom: 30px;">🎮 Game Performance Summary</h2>

          <div style="background: #f8f9fa; border-radius: 8px; padding: 30px; margin-bottom: 30px;">
            <h3 style="color: #666; margin-bottom: 20px;">Your Results</h3>

            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 20px;">
              <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #007bff;">
                <h4 style="color: #007bff; margin-bottom: 10px; font-size: 18px;">📊 Total Trials</h4>
                <p style="font-size: 24px; font-weight: bold; color: #333; margin: 0;">${t}</p>
              </div>

              <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #28a745;">
                <h4 style="color: #28a745; margin-bottom: 10px; font-size: 18px;">⏱️ Total Time</h4>
                <p style="font-size: 24px; font-weight: bold; color: #333; margin: 0;">${a} min</p>
              </div>

              ${o?`
                <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #ffc107;">
                  <h4 style="color: #ffc107; margin-bottom: 10px; font-size: 18px;">🎯 Single Player Success</h4>
                  <p style="font-size: 24px; font-weight: bold; color: #333; margin: 0;">${s}%</p>
                  <p style="font-size: 14px; color: #666; margin: 5px 0 0 0;">(${e.filter(d=>String(d.experimentType||"").includes("1P")).length} single player trials)</p>
                </div>
              `:""}

              ${r?`
                <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #dc3545;">
                  <h4 style="color: #dc3545; margin-bottom: 10px; font-size: 18px;">🤝 Collaboration Success</h4>
                  <p style="font-size: 24px; font-weight: bold; color: #333; margin: 0;">${l}%</p>
                  <p style="font-size: 14px; color: #666; margin: 5px 0 0 0;">(${e.filter(d=>String(d.experimentType||"").includes("2P")).length} collaboration trials)</p>
                </div>
              `:""}
            </div>
          </div>

          <div style="background: #e8f5e8; border: 2px solid #28a745; border-radius: 8px; padding: 25px; margin-bottom: 30px;">
            <h3 style="color: #28a745; margin-bottom: 15px;">📝 Almost Done!</h3>
            <p style="font-size: 18px; color: #333; margin-bottom: 15px;">
              Thank you for completing the game trials!
            </p>
            <p style="font-size: 16px; color: #666; margin-bottom: 0;">
              To finish the experiment, we kindly ask you to fill out a short questionnaire about your experience.
              This will help us understand your thoughts and improve our research.
            </p>
          </div>

          <div style="text-align: center;">
            <button id="continueToQuestionnaireBtn" style="
              background: #28a745;
              color: white;
              border: none;
              padding: 15px 30px;
              font-size: 18px;
              border-radius: 8px;
              cursor: pointer;
              box-shadow: 0 4px 8px rgba(0,0,0,0.2);
              transition: all 0.3s ease;
            " onmouseover="this.style.background='#218838'" onmouseout="this.style.background='#28a745'">
              📋 Continue to Questionnaire
            </button>
          </div>
        </div>
      </div>
    `,this.stages.some(d=>d.type==="questionnaire")||this.stages.push({type:"questionnaire",handler:()=>this.showQuestionnaireStage()});const p=document.getElementById("continueToQuestionnaireBtn");p&&p.addEventListener("click",()=>{console.log("🎮 Game Feedback Stage: Continue button clicked"),this.nextStage()})}showQuestionnaireStage(){const n=()=>{const c=[{name:"ai_detection",title:"Page 1 of 3",prompt:"Do you think the other player is a person or a computer?",options:["Person","Computer"],optionImages:["person.png","computer.png"]},{name:"collaboration_rating",title:"Page 2 of 3",prompt:"How well did the other player collaborate with you?",options:["Good collaborator","Bad collaborator"],optionImages:["good.png","bad.png"]},{name:"play_again",title:"Page 3 of 3",prompt:"Would you like to play this game again in the future?",options:["Yes","No"],optionImages:["yes.png","no.png"]}],p={};let d=0,g=0,u=null;const h=window.speechSynthesis||null,y=async(G=!0)=>{const P=d+1,b=this.assetUrl(`question${P}.mp3`);return G&&(h&&h.cancel(),u&&(u.pause(),u.currentTime=0,u=null)),new Promise(v=>{const w=new Audio(b);w.onloadeddata=()=>{u=w,w.play().then(()=>{w.onended=()=>{u=null,v()},w.onerror=()=>{u=null,console.warn("Questionnaire prompt audio playback failed:",b),v()}}).catch(()=>v())},w.onerror=()=>{console.warn("Questionnaire prompt audio missing or failed to load:",b),v()},w.load()})},f=(G=!1)=>{const P=c[d],b=P.optionImages||[],v=P.options.map((k,S)=>{const A=S===g,D=A?"#4f46e5":"#e5e7eb",M=A?"#eef2ff":"#ffffff",C=b[S]?this.assetUrl(b[S]):"";return`
            <button type="button" class="image-option" data-idx="${S}" aria-label="${k.replace(/"/g,"&quot;")}" style="
              padding: 12px 16px;
              margin: 8px 12px;
              border-radius: 16px;
              border: 3px solid ${D};
              background: ${M};
              cursor: pointer;
              display: inline-flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              box-shadow: 0 4px 10px rgba(0,0,0,0.08);
            ">
              ${C?`<img src="${C}" alt="" style="max-width: min(200px, 38vw); max-height: 180px; height: auto; display: block; object-fit: contain;" />`:`<span style="font-size: 18px; color: #333;">${k}</span>`}
            </button>`}).join("");this.container.innerHTML=`
          <div style="display:flex; align-items:center; justify-content:center; min-height:100vh; background:#f8f9fa; padding:20px;">
            <div style="background:white; padding:32px; border-radius:16px; box-shadow:0 10px 25px rgba(0,0,0,0.1); width:100%; max-width:720px;">
              <div style="text-align:center; margin-bottom:12px; color:#6b7280; font-weight:600;">📋 Post-Game Questionnaire</div>
              <div style="text-align:center; margin-bottom:8px; color:#6b7280; font-weight:600;">${P.title}</div>
              <h2 style="text-align:center; margin:8px 0 20px; color:#111827;">${P.prompt}</h2>
              <div style="margin-bottom:16px; text-align:center; color:#6b7280;">
                Click an image to answer (or use arrow keys and Space).
              </div>
              <div id="options" style="display:flex; flex-direction:row; flex-wrap:wrap; justify-content:center; align-items:center;">${v}</div>
            </div>
          </div>`,G&&y(!0),this.container.querySelectorAll(".image-option").forEach(k=>{k.addEventListener("click",()=>{g=Number(k.getAttribute("data-idx")||"0"),p[P.name]=P.options[g],h&&h.cancel(),u&&(u.pause(),u.currentTime=0,u=null),d<c.length-1?(d+=1,g=0,f(!0)):(document.removeEventListener("keydown",T),this.experimentData.questionnaire=p,console.log("📝 Questionnaire completed"),this.nextStage())})})},T=G=>{const P=G.code==="ArrowUp"||G.key==="ArrowUp"||G.code==="ArrowLeft"||G.key==="ArrowLeft",b=G.code==="ArrowDown"||G.key==="ArrowDown"||G.code==="ArrowRight"||G.key==="ArrowRight";P?(G.preventDefault(),g=Math.max(0,g-1),f(!1)):b?(G.preventDefault(),g=Math.min(c[d].options.length-1,g+1),f(!1)):(G.code==="Space"||G.key===" ")&&(G.preventDefault(),h&&h.cancel(),u&&(u.pause(),u.currentTime=0,u=null),p[c[d].name]=c[d].options[g],d<c.length-1?(d+=1,g=0,f(!0)):(document.removeEventListener("keydown",T),h&&h.cancel(),u&&(u.pause(),u.currentTime=0,u=null),this.experimentData.questionnaire=p,console.log("📝 Questionnaire completed"),this.nextStage()))};f(!0),document.addEventListener("keydown",T);const m=()=>{h&&h.cancel(),u&&(u.pause(),u.currentTime=0,u=null),document.removeEventListener("keydown",T)};this._questionnaireCleanup=m};this.container.innerHTML=`
      <div style="display: flex; align-items: center; justify-content: center; min-height: 100vh; background: #f8f9fa;">
        <div style="background: white; padding: 40px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); max-width: 800px; text-align: center;">
          <h2 style="color: #333; margin-bottom: 30px; font-size: 32px;">Questionnaire</h2>

          <div style="margin: 20px 0; text-align: center;">
            <video
              id="questionnaireInstructionsVideo"
              width="100%"
              height="400"
              controls
              autoPlay
              muted
              playsInline
              preload="auto"
              style="max-width: 600px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
              <source src="${this.assetUrl("questionnaire-instructions.mp4")}" type="video/mp4">
              Your browser does not support the video tag.
            </video>
          </div>

          <div id="questionnaireStartPanel" style="display: none; margin: 24px auto 0; max-width: 520px; background: #f8fbff; border: 2px solid #28a745; border-radius: 12px; padding: 18px 22px; text-align: center;">
            <p style="font-size: 22px; color: #333; font-weight: 700; margin: 0 0 14px;">
              When you are ready, press the spacebar or click here to start the questions.
            </p>
            <button id="questionnaireStartBtn" type="button" disabled style="background: #28a745; color: white; border: none; padding: 14px 42px; font-size: 22px; font-weight: bold; border-radius: 8px; cursor: not-allowed; opacity: 0.55; box-shadow: 0 4px 6px rgba(0,0,0,0.1); transition: background 0.2s, opacity 0.2s;">
              Start Questions
            </button>
          </div>
        </div>
      </div>
    `;const e=document.getElementById("questionnaireInstructionsVideo"),t=document.getElementById("questionnaireStartPanel"),a=document.getElementById("questionnaireStartBtn");let r=!1;const o=()=>{r=!0,t&&(t.style.display="block"),a&&(a.disabled=!1,a.style.cursor="pointer",a.style.opacity="1")};e?(e.addEventListener("ended",o,{once:!0}),e.addEventListener("error",o,{once:!0}),e.ended&&o(),e.autoplay=!0,e.playsInline=!0,(()=>(e.muted=!1,e.volume=1,e.play()))().catch(p=>{console.warn("Unable to autoplay questionnaire video with sound, falling back to muted:",p),e.muted=!0,e.play().catch(g=>{console.warn("Unable to autoplay muted questionnaire video:",g)});const d=()=>{try{e.muted=!1,e.volume=1,e.play().catch(g=>{console.warn("Unable to start questionnaire video with sound after interaction:",g)})}catch{}document.removeEventListener("click",d),document.removeEventListener("keydown",d),e.removeEventListener("click",d)};document.addEventListener("click",d,{once:!0}),document.addEventListener("keydown",d,{once:!0}),e.addEventListener("click",d,{once:!0})})):o();let s=!1;const l=c=>{const p=(c==null?void 0:c.type)==="keydown"&&(c.code==="Space"||c.key===" ");(c==null?void 0:c.type)==="keydown"&&!p||(c&&(c.preventDefault(),c.stopPropagation()),!(!r||s)&&(s=!0,document.removeEventListener("keydown",l,!0),a&&(a.removeEventListener("click",l),a.disabled=!0,a.textContent="Starting...",a.style.cursor="default",a.style.opacity="0.75"),n()))};document.addEventListener("keydown",l,!0),a&&a.addEventListener("click",l),document.body.focus()}showEndExperimentInfoStage(){var a;const n=this.generateCompletionCode(),e=()=>{if(!this._lookitDonePosted){this._lookitDonePosted=!0;try{window.parent.postMessage({type:"exp-lookit:next"},"*")}catch(r){console.warn("Unable to post exp-lookit:next message:",r)}}};this.container.innerHTML=`
      <div style="display: flex; align-items: center; justify-content: center; min-height: 100vh; background: #f8f9fa;">
        <div style="background: white; padding: 40px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); max-width: 600px; text-align: center;">
          <h2 style="color: #222; margin-bottom: 30px;">Experiment Complete</h2>

          <p style="font-size: 18px; margin-bottom: 20px;">
            Thank you for participating in our study!
          </p>

          <!--
          <div style="background: #fff3cd; padding: 20px; border-radius: 8px; margin-bottom: 20px; border: 1px solid #ffeeba; color: #856404;">
            We are saving your data now. Your completion code will be shown after your data has been saved successfully.
          </div>
          -->

          <div style="margin-bottom: 8px;">
            <div id="saving-status" style="display: inline-block; margin: 10px; color: #555; font-size: 16px; line-height: 1.5;">Saving your data...</div>
          </div>
        </div>
      </div>
    `,this.experimentData.completed=!0,this.experimentData.completionCode=n,this.experimentData.endTime=new Date().toISOString(),this.emit("save-data",this.experimentData);try{(a=i==null?void 0:i.server)!=null&&a.enableGoogleDriveSave&&setTimeout(()=>{const r=document.getElementById("saving-status");r&&!this._lookitDonePosted&&(r.textContent="Save taking longer than expected. Please click Next at the bottom right to continue.",r.style.color="#555",e())},15e3)}catch{}const t=()=>{const r=document.getElementById("saving-status");r&&(r.innerHTML='Data saved successfully. Please click <strong style="color: #28a745;">Next</strong> at the bottom right of the screen.',r.style.color="#333"),this.off("data-save-success",t),e()};this.eventHandlers.delete("data-save-success"),this.on("data-save-success",t)}showProlificRedirectStage(){var e;const n=((e=i==null?void 0:i.game)==null?void 0:e.prolificCompletionCode)||this.experimentData.completionCode||"CTNDR8GV";this.container.innerHTML=`
      <div style="display: flex; align-items: center; justify-content: center; min-height: 100vh; background: #f8f9fa;">
        <div style="background: white; padding: 40px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); max-width: 600px; text-align: center;">
          <h2 style="color: #333; margin-bottom: 20px;">🎉 Experiment Complete!</h2>
          <p style="font-size: 16px; margin-bottom: 12px;">Thank you for completing the experiment!</p>
          <p style="font-size: 14px; color: #666; margin-bottom: 20px;">Please copy the code below and submit it in Prolific.</p>

          <div style="background: #e8f5e8; border: 2px solid #28a745; border-radius: 8px; padding: 20px; margin: 20px 0;">
            <h3 style="color: #28a745; margin-bottom: 10px;">Your Completion Code</h3>
            <div style="background: white; border: 2px dashed #28a745; border-radius: 5px; padding: 15px; margin: 10px 0;">
              <p id="completionCodeText" style="font-size: 24px; font-weight: bold; color: #28a745; margin: 0; font-family: monospace; letter-spacing: 2px;">${n}</p>
            </div>
            <p style="font-size: 14px; color: #666; margin: 10px 0 0 0;">Copy this code now to complete your submission in Prolific.</p>
            <div style="margin-top: 12px;">
              <button id="copyCodeBtn" style="background: #007bff; color: white; border: none; padding: 10px 16px; font-size: 14px; border-radius: 5px; cursor: pointer;">Copy Code</button>
              <span id="copyStatus" style="margin-left: 10px; font-size: 14px; color: #28a745; display: none;">Copied!</span>
            </div>
          </div>
        </div>
      </div>
    `;try{const t=document.getElementById("copyCodeBtn"),a=document.getElementById("completionCodeText"),r=document.getElementById("copyStatus");t&&a&&t.addEventListener("click",async()=>{const o=(a.textContent||"").trim();try{if(navigator.clipboard&&navigator.clipboard.writeText)await navigator.clipboard.writeText(o);else{const s=document.createElement("textarea");s.value=o,document.body.appendChild(s),s.select(),document.execCommand("copy"),document.body.removeChild(s)}r&&(r.style.display="inline",t.textContent="Copied!",t.style.background="#28a745",setTimeout(()=>{r.style.display="none",t.textContent="Copy Code",t.style.background="#007bff"},2e3))}catch(s){console.warn("Copy failed:",s)}})}catch{}}isHumanHumanMode(){return this.gameMode==="human-human"||L&&typeof L.isHumanHumanMode=="function"&&L.isHumanHumanMode()?!0:new URLSearchParams(window.location.search).get("mode")==="human-human"}assetUrl(n){const e="/MinimalCoordinationGame-CHS-unmoderated/",t=String(n||"").replace(/^\/+/,"");return`${e}${t}`}getInstructionsForExperiment(n){var l;const e=((l=i==null?void 0:i.game)==null?void 0:l.studyRLCondition)==="individual"?"#2563eb":"#dc2626",t='<span style="display:inline-block;width:20px;height:20px;background:red;border-radius:50%;vertical-align:middle;margin:0 4px;"></span>',a='<span style="display:inline-block;width:20px;height:20px;background:#007bff;border-radius:3px;vertical-align:middle;margin:0 4px;"></span>',r=c=>`
      <ul style="font-size: 22px; color: #1f2937; margin: 0; line-height: 1.55; text-align: left; padding-left: 24px;">
        ${c.map(p=>`<li style="margin-bottom: 10px;">${p}</li>`).join("")}
      </ul>
    `,o=({title:c,titleColor:p="#333",subtitle:d,intro:g="",items:u,videoId:h,videoSrc:y})=>({html:`
        <div style="display: flex; align-items: center; justify-content: center; min-height: 100vh; background: #f8f9fa; padding: 24px;">
          <div style="background: white; padding: 30px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); width: calc(100% - 24px); max-width: 1120px; text-align: center;">
            <h2 style="color: ${p}; margin: 0 0 12px; font-size: 36px;">${c}</h2>
            <h3 style="color: #000; margin: 0 0 22px; font-size: 24px;">${d}</h3>

            <div style="display: flex; justify-content: center; align-items: stretch; gap: 24px; flex-wrap: wrap;">
              <div style="flex: 1 1 420px; min-width: 300px; background: #f8fbff; border: 2px solid #007bff; border-radius: 12px; padding: 28px; display: flex; flex-direction: column; justify-content: center;">
                ${g?`<p style="font-size: 22px; color: #1f2937; margin: 0 0 16px; line-height: 1.55; text-align: left;">${g}</p>`:""}
                ${r(u)}
              </div>

              <div style="flex: 1 1 420px; min-width: 300px; display: flex; flex-direction: column; align-items: center; justify-content: center;">
                <video
                  id="${h}"
                  width="100%"
                  height="360"
                  controls
                  autoplay
                  playsinline
                  style="display: block; width: 100%; height: auto; max-height: 420px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); background: #000;">
                  <source src="${this.assetUrl(y)}" type="video/mp4">
                  Your browser does not support the video tag.
                </video>
                <div id="instructionContinuePanel" style="display: none; box-sizing: border-box; width: 100%; margin-top: 14px; background: #f8fbff; border: 2px solid #007bff; border-radius: 12px; padding: 16px 18px; text-align: center;">
                  <p style="font-size: 18px; color: #1f2937; font-weight: bold; line-height: 1.35; margin: 0 0 14px;">
                    Press the spacebar or click here to continue!
                  </p>
                  <button id="instructionContinueBtn" type="button" disabled style="background: #28a745; color: white; border: none; padding: 14px 42px; font-size: 20px; font-weight: bold; border-radius: 8px; cursor: not-allowed; opacity: 0.55; box-shadow: 0 4px 6px rgba(0,0,0,0.1); transition: background 0.2s, opacity 0.2s;">
                    Continue
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      `});return{"1P1G":o({title:"Game 1",titleColor:e,subtitle:"Before we begin, let's practice a few rounds!",videoId:"game1Video",videoSrc:"game1.mp4",items:[`You are the traveler ${t}.`,`There is one restaurant ${a} on the map.`,"Use the arrow keys to reach the restaurant."]}),"1P2G":o({title:"Game 2",subtitle:"Great job!",videoId:"game2Video",videoSrc:"game2.mp4",intro:"Now there will be several identical restaurants on the map.",items:["Each round, you can win by getting to one of the restaurants.","Some restaurants are open when the round starts. Others may appear later."]}),"2P2G":o({title:"Game 3",subtitle:"Well done!",videoId:"game3Video",videoSrc:"game3.mp4",intro:"In this game, you will work with a teammate.",items:["Each round, you win if both players go to the same restaurant.","You lose the round if you end up at different restaurants.","Both players move one step at a time after both players choose a direction."]}),"2P3G":o({title:"Game 4",subtitle:"Good job!",videoId:"game4Video",videoSrc:"video2.mp4",intro:"Now you will work with the same teammate again.",items:["Each round, you win if both players go to the same restaurant.","You lose the round if you end up at different restaurants.","Some restaurants are open when the round starts. Others may appear later."]})}[n]||{html:`
        <div style="display: flex; align-items: center; justify-content: center; min-height: 100vh; background: #f8f9fa;">
          <div style="background: white; padding: 40px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); max-width: 800px; text-align: center;">
            <h2 style="color: #333; margin-bottom: 30px;">Game Instructions</h2>
            <p style="font-size: 18px; margin-bottom: 30px;">Use arrow keys to navigate and reach the goals.</p>
            <p style="font-size: 20px; margin-top: 30px;">Press <strong>space bar</strong> to begin.</p>
          </div>
        </div>
      `}}generateParticipantId(){return"P"+Date.now().toString(36)+Math.random().toString(36).substr(2,5)}parseDob(n){const e=/^(\d{4})-(\d{2})-(\d{2})$/.exec(String(n||"").trim());if(!e)return null;const t=Number(e[1]),a=Number(e[2]),r=Number(e[3]);if(!Number.isInteger(t)||!Number.isInteger(a)||!Number.isInteger(r)||t<1900||a<1||a>12||r<1||r>31)return null;const o=new Date(t,a-1,r);return o.getFullYear()!==t||o.getMonth()!==a-1||o.getDate()!==r?null:{year:t,month:a,day:r,date:o}}calculateAgeFromDob(n,e=new Date){const t=this.parseDob(n);if(!t)return null;const a=new Date(e.getFullYear(),e.getMonth(),e.getDate()),r=t.date;if(r>a)return null;let o=a.getFullYear()-r.getFullYear(),s=a.getMonth()-r.getMonth(),l=a.getDate()-r.getDate();l<0&&(s-=1,l+=new Date(a.getFullYear(),a.getMonth(),0).getDate()),s<0&&(o-=1,s+=12);const c=Date.UTC(t.year,t.month-1,t.day),p=Date.UTC(a.getFullYear(),a.getMonth(),a.getDate()),d=Math.floor((p-c)/864e5);return{participantDob:`${String(t.year).padStart(4,"0")}-${String(t.month).padStart(2,"0")}-${String(t.day).padStart(2,"0")}`,participantAgeReferenceDate:`${a.getFullYear()}-${String(a.getMonth()+1).padStart(2,"0")}-${String(a.getDate()).padStart(2,"0")}`,participantAgeYears:o,participantAgeMonths:s,participantAgeDays:l,participantAgeTotalDays:d}}getUrlParam(n){try{const e=new URLSearchParams(window.location.search);for(const t of n){const a=e.get(t);if(a)return a}}catch{}return""}getBooleanUrlParam(n){const e=this.getUrlParam(n).toLowerCase();return["1","true","yes","y"].includes(e)}shouldSkipDobInput(){return this.getBooleanUrlParam(["skipDob","skipDOB","skipDateOfBirth","skip_dob"])}getLookitResponseId(){return this.getUrlParam(["response","responseId","lookit_response","lookitResponseId","LOOKIT_RESPONSE_ID"])}getLookitChildId(){return this.getUrlParam(["child","childId","lookit_child","lookitChildId","LOOKIT_CHILD_ID"])}getParticipantId(){const n=this.getUrlParam(["PROLIFIC_PID","prolific_pid","participantId","participant_id"]);if(n)return n;const e=this.getLookitResponseId();return e||this.generateParticipantId()}generateCompletionCode(){var n;return((n=i==null?void 0:i.game)==null?void 0:n.prolificCompletionCode)||"CTNDR8GV"}initializeSuccessThresholdTracking(){this.successThreshold.consecutiveSuccesses=0,this.successThreshold.totalTrialsCompleted=0,this.successThreshold.experimentEndedEarly=!1,this.successThreshold.lastSuccessTrial=-1,this.successThreshold.successHistory=[]}updateSuccessThresholdTracking(n,e){this.successThreshold.totalTrialsCompleted++,this.successThreshold.successHistory.push(n),n?(this.successThreshold.consecutiveSuccesses++,this.successThreshold.lastSuccessTrial=e):this.successThreshold.consecutiveSuccesses=0,console.log(`Success threshold update - Trial ${e+1}: ${n?"SUCCESS":"FAILURE"}`),console.log(`  Consecutive successes: ${this.successThreshold.consecutiveSuccesses}/${i.game.successThreshold.consecutiveSuccessesRequired}`),console.log(`  Total trials: ${this.successThreshold.totalTrialsCompleted}/${i.game.successThreshold.maxTrials}`)}shouldEndExperimentDueToSuccessThreshold(){return!1}shouldContinueToNextTrial(n,e){if(!n.includes("2P"))return e<L.getNumTrials(n)-1;if(this.shouldEndExperimentDueToSuccessThreshold())return console.log(`Ending ${n} experiment due to success threshold`),!1;const t=L.getNumTrials(n)||i.game.successThreshold.maxTrials;return e>=t-1?(console.log(`Ending ${n} experiment: Completed ${t} trials`),!1):!0}addNextTrialStages(n,e,t){const a=this.currentStageIndex,r=[{type:"fixation",experimentType:n,experimentIndex:e,trialIndex:t,handler:()=>this.showFixationStage(n,e,t)},{type:"trial",experimentType:n,experimentIndex:e,trialIndex:t,handler:()=>this.runTrialStage(n,e,t)},{type:"post-trial",experimentType:n,experimentIndex:e,trialIndex:t,handler:()=>this.showPostTrialStage(n,e,t)}];this.stages.splice(a+1,0,...r),console.log(`Added next trial stages for ${n} trial ${t+1}`)}skipToNextExperimentOrCompletion(n){console.log(`Skipping to next experiment or completion from ${n}`);let e=this.currentStageIndex+1;for(console.log(`Starting search from stage ${e}`),console.log(`Total stages in timeline: ${this.stages.length}`);e<this.stages.length;){const t=this.stages[e];if(console.log(`Checking stage ${e}: ${t.type}`),t.type==="game-feedback"||t.type==="questionnaire"||t.type==="completion"||t.experimentType&&t.experimentType!==n){console.log(`Found stopping point: ${t.type}`);break}e++}if(this.currentStageIndex=e,this.currentStageIndex<this.stages.length){const t=this.stages[this.currentStageIndex];t.experimentType&&t.experimentType!==n&&(console.log(`Switching from ${n} to ${t.experimentType} - resetting success threshold`),this.initializeSuccessThresholdTracking()),console.log(`Skipped to stage ${this.currentStageIndex}: ${t.type}`),this.runCurrentStage()}else console.log("No more stages to run")}recordWaitingTime(n,e,t,a,r,o){const s=Math.round(t/1e3*10)/10;this.experimentData.waitingDuration||(this.experimentData.waitingDuration=0),this.experimentData.waitingDuration+=s,this.experimentData.waitingDetails||(this.experimentData.waitingDetails=[]),this.experimentData.waitingDetails.push({experimentType:r,experimentIndex:o,durationSeconds:s,reason:a,startTime:new Date(n).toISOString(),endTime:new Date(e).toISOString()}),console.log("📊 [WAITING] Recorded waiting time:",s+"s (total: "+this.experimentData.waitingDuration+"s)")}}class re{constructor(n){var e,t,a,r;this.container=n,this.networkManager=null,this.gameStateManager=null,this.uiManager=null,this.experimentManager=null,this.timelineManager=null,this.isInitialized=!1,this.playerIndex=0,this.gameConfig=null,this.useTimelineFlow=!0,this.currentRoomId=null,this._hhSync={pendingMoves:{0:null,1:null}},this._rtSync={syncInterval:null},this._inactivityTracking={enabled:!1,partnerLastMoveTime:null,inactivityTimerId:null,inactivityTimeoutMs:(t=(e=i==null?void 0:i.multiplayer)==null?void 0:e.inactivityFallback)==null?void 0:t.timeoutMs,checkIntervalMs:(r=(a=i==null?void 0:i.multiplayer)==null?void 0:a.inactivityFallback)==null?void 0:r.checkIntervalMs}}async start(n={}){const{mode:e="human-ai",experimentType:t="2P2G",roomId:a=null,useTimeline:r=!0}=n,o=new URLSearchParams(window.location.search);this.useTimelineFlow=o.get("timeline")!=="false"&&r;const s=o.get("ai");s&&L.setPlayerType(2,s),console.log(`Starting application with timeline flow: ${this.useTimelineFlow}`);try{await this.initialize(e,t,a),this.useTimelineFlow?await this.startTimelineFlow(e,t,a):e==="human-human"?await this.startMultiplayerMode(t,a):await this.startSinglePlayerMode(t),console.log("Application started successfully")}catch(l){throw console.error("Failed to start application:",l),l}}async initialize(n,e,t){var o,s;if(this.isInitialized)return;if(this.gameStateManager=new Bn,this.uiManager=new Fn(this.container),this.useTimelineFlow&&(this.timelineManager=new ie(this.container),this.setupTimelineEventHandlers()),this.experimentManager=new ae(this.gameStateManager,this.uiManager,this.timelineManager),new URLSearchParams(window.location.search).get("skipNetwork")==="true")console.log("⚠️ Network connection skipped for testing"),this.networkManager=null;else try{this.networkManager=new jn,await this.networkManager.connect(),this.setupNetworkEventHandlers(),console.log("✅ Network manager initialized");try{window.__NETWORK_MANAGER__=this.networkManager}catch{}}catch(l){console.warn("⚠️ Failed to initialize network manager:",l.message),console.log("💡 You can test timeline with mock multiplayer using: ?skipNetwork=true"),this.networkManager=null}this.setupUIEventHandlers(),this.isInitialized=!0;try{window.__GAME_APPLICATION__=this}catch{}try{await((s=(o=this.experimentManager)==null?void 0:o.logCurrentAIModel)==null?void 0:s.call(o))}catch{}}async startTimelineFlow(n,e,t){console.log(`🎬 Starting timeline flow for ${n} mode`);const r=new URLSearchParams(window.location.search).get("skipNetwork")==="true";["gpt","human","rl_joint","rl_individual"].includes(i.game.players.player2.type)||L.setPlayerType(2,i.multiplayer.fallbackAIType||"rl_joint"),this.uiManager.setPlayerInfo(0,"human-ai"),r||(this.networkManager&&this.networkManager.isConnected?(console.log("🌐 Enabling real multiplayer integration for collaboration phases"),this.setupMultiplayerTimelineIntegration(e,t)):(console.log("🤖 Using mock multiplayer for timeline (server not available or skipped)"),this.setupMockMultiplayerForTimeline())),this.timelineManager.start()}setupMultiplayerTimelineIntegration(n,e){this.timelineManager.on("waiting-for-partner",async t=>{console.log("Timeline requesting partner connection..."),i.game.players.player2.type="human",console.log("🎮 Set player2 type to human for multiplayer experiment");try{const a=await this.networkManager.joinRoom({roomId:e,gameMode:"human-human",experimentType:t.experimentType});console.log("Joined room during timeline flow:",a)}catch(a){console.error("Failed to join room during timeline:",a)}}),this.timelineManager.on("player-ready",()=>{console.log("🎮 Timeline player clicked ready - forwarding to network"),this.networkManager&&this.networkManager.isConnected?this.networkManager.setPlayerReady():console.warn("⚠️ Network manager not available for player ready")}),this.timelineManager.on("match-play-ready",()=>{console.log("🎮 Timeline match-play SPACE pressed - forwarding to network"),this.networkManager&&this.networkManager.isConnected?this.networkManager.setMatchPlayReady():console.warn("⚠️ Network manager not available for match-play-ready")}),this.timelineManager.on("check-partner-status",async t=>{if(console.log("🔍 Timeline checking partner status..."),!this.networkManager||!this.networkManager.isConnected){console.log("❌ No network connection - switching to AI mode"),this.activateAIFallbackForExperiment(t.experimentType);return}if(!!!this.currentRoomId){console.log("❌ Not in a room - switching to AI mode"),this.activateAIFallbackForExperiment(t.experimentType);return}try{this.networkManager.socket.emit("ping-room-status");const r=await new Promise(s=>{const l=setTimeout(()=>s(null),2e3);this.networkManager.socket.once("room-status-response",c=>{clearTimeout(l),s(c)})});if(!r){console.log("❌ No response from server - switching to AI mode"),this.activateAIFallbackForExperiment(t.experimentType),this.timelineManager&&(this.timelineManager.partnerStatusChecked=!0,this.timelineManager.shouldSkipMatchPlay=!0);return}if(!(r.playerCount>1)){console.log("❌ No other players in room - switching to AI mode"),this.activateAIFallbackForExperiment(t.experimentType),this.timelineManager&&(this.timelineManager.partnerStatusChecked=!0,this.timelineManager.shouldSkipMatchPlay=!0);return}console.log("✅ Partner status check passed - partner appears to be connected"),this.timelineManager&&(this.timelineManager.partnerStatusChecked=!0,this.timelineManager.shouldSkipMatchPlay=!1)}catch(r){console.error("Error checking partner status:",r),console.log("❌ Error checking partner status - switching to AI mode"),this.activateAIFallbackForExperiment(t.experimentType),this.timelineManager&&(this.timelineManager.partnerStatusChecked=!0,this.timelineManager.shouldSkipMatchPlay=!0)}})}setupMockMultiplayerForTimeline(){console.log("🤖 Setting up mock multiplayer timeline events..."),this.timelineManager.on("waiting-for-partner",async n=>{console.log("🤖 Mock: Timeline waiting for partner - simulating connection..."),i.game.players.player2.type="human",console.log("🎮 Mock: Set player2 type to human for mock multiplayer experiment"),setTimeout(()=>{console.log("🤖 Mock: Partner found, showing ready button"),this.timelineManager.emit("partner-connected",{players:[{id:"mock-player1",name:"You"},{id:"mock-player2",name:"AI Partner"}]})},2e3)}),this.timelineManager.on("player-ready",()=>{console.log("🤖 Mock: Player clicked ready, simulating partner ready..."),setTimeout(()=>{console.log("🤖 Mock: Both players ready, starting game"),this.uiManager.setPlayerInfo(0,"human-human"),this.timelineManager.emit("all-players-ready",{gameMode:"human-human",players:[{id:"mock-player1",playerIndex:0},{id:"mock-player2",playerIndex:1}]})},1e3)}),console.log("✅ Mock multiplayer timeline events registered")}setupTimelineEventHandlers(){this.timelineManager&&(this.timelineManager.on("save-data",n=>{console.log("💾 Timeline requesting data save:",n),this.saveExperimentData(n)}),this.timelineManager.on("show-trial-feedback",n=>{console.log("📊 Timeline requesting trial feedback:",n),this.experimentManager&&this.experimentManager.handleTrialFeedback(n)}),this.timelineManager.on("partner-connected",()=>{console.log("👥 Partner connected via timeline")}),this.timelineManager.on("all-players-ready",()=>{console.log("🎮 All players ready via timeline")}),this.timelineManager.on("fallback-to-ai",n=>{var e,t,a,r,o,s;try{const{reason:l="unknown",stage:c="waiting-for-partner",at:p=Date.now(),fallbackAIType:d=null}=n||{};try{(t=(e=this.experimentManager)==null?void 0:e.logCurrentAIModel)==null||t.call(e)}catch{}(r=(a=this.gameStateManager)==null?void 0:a.recordPartnerFallback)==null||r.call(a,{reason:l,stage:c,at:p,fallbackAIType:d});try{(s=(o=this.experimentManager)==null?void 0:o.logCurrentAIModel)==null||s.call(o)}catch{}}catch{}}),console.log("📡 Timeline event handlers setup completed"))}async saveExperimentData(n){var e,t,a,r,o,s,l,c,p;try{const d=((t=(e=this.gameStateManager)==null?void 0:e.getExperimentData)==null?void 0:t.call(e))||{allTrialsData:[],successThreshold:{}};let g=null;const u=w=>{try{g=g||new URLSearchParams(window.location.search);for(const k of w){const S=g.get(k);if(S)return S}}catch{}return""},h=n.lookitResponseId||u(["response","responseId","lookit_response","lookitResponseId","LOOKIT_RESPONSE_ID"]),y=n.lookitChildId||u(["child","childId","lookit_child","lookitChildId","LOOKIT_CHILD_ID"]);let f=n.participantId;f||(f=u(["PROLIFIC_PID","prolific_pid","participantId","participant_id"])||h||`participant_${Date.now()}`);const T=this.currentRoomId||n.roomId||null,m={participantId:f,lookitResponseId:h,lookitChildId:y,timestamp:new Date().toISOString(),experimentOrder:((r=(a=i==null?void 0:i.game)==null?void 0:a.experiments)==null?void 0:r.order)||[],allTrialsData:d.allTrialsData||[],questionnaireData:n.questionnaire||null,participantDob:n.participantDob||null,participantAgeReferenceDate:n.participantAgeReferenceDate||null,participantAgeYears:n.participantAgeYears??null,participantAgeMonths:n.participantAgeMonths??null,participantAgeDays:n.participantAgeDays??null,participantAgeTotalDays:n.participantAgeTotalDays??null,successThreshold:d.successThreshold||{},completionCode:n.completionCode||"",version:((o=i==null?void 0:i.game)==null?void 0:o.version)||"2.0.0",experimentType:((s=this.timelineManager)==null?void 0:s.gameMode)==="human-human"?"human-human":"human-AI",roomId:T,waitingDuration:n.waitingDuration||0,waitingDetails:n.waitingDetails||[]},G=JSON.stringify(m,null,2),P=i.server.googleAppsScriptUrl,b=i.server.enableGoogleDriveSave,v=typeof window<"u"&&typeof window.XLSX<"u";if(b&&P&&v)try{const w=window.XLSX,k=w.utils.book_new(),S=m.allTrialsData||[];if(S.length>0){const B=S.map(W=>{const z={};for(const rn in W){const tn=W[rn];z[rn]=Array.isArray(tn)||tn&&typeof tn=="object"?JSON.stringify(tn):tn}return z.roomId=m.roomId||"",z.participantId=m.participantId,z.lookitResponseId=m.lookitResponseId||"",z.lookitChildId=m.lookitChildId||"",z.participantDob=m.participantDob||"",z.participantAgeReferenceDate=m.participantAgeReferenceDate||"",z.participantAgeYears=m.participantAgeYears??"",z.participantAgeMonths=m.participantAgeMonths??"",z.participantAgeDays=m.participantAgeDays??"",z.participantAgeTotalDays=m.participantAgeTotalDays??"",z.currentPlayer=this.playerIndex!==void 0?this.playerIndex+1:null,z.newGoalConditionType&&!z.distanceCondition&&(z.distanceCondition=z.newGoalConditionType),delete z.newGoalConditionType,z}),V=new Set;B.forEach(W=>Object.keys(W).forEach(z=>V.add(z)));const Y=["trialIndex","experimentType","partnerAgentType","currentPlayer","participantId","lookitResponseId","lookitChildId","roomId","participantDob","participantAgeReferenceDate","participantAgeYears","participantAgeMonths","participantAgeDays","participantAgeTotalDays","humanPlayerIndex","aiPlayerIndex","player1StartPosition","player2StartPosition","initialGoalPositions","partnerFallbackOccurred","partnerFallbackReason","partnerFallbackStage","partnerFallbackTime","partnerFallbackAIType","collaborationSucceeded","player1GoalReachedStep","player2GoalReachedStep","newGoalPresented","newGoalPosition","distanceCondition","isNewGoalCloserToPlayer2","trialStartTime","gptErrorEvents","currentPlayerIndex","player1Trajectory","player2Trajectory","player1Actions","player2Actions","player1RT","player2RT","player1CurrentGoal","player2CurrentGoal","player1FirstDetectedGoal","player2FirstDetectedGoal","player1FinalReachedGoal","player2FinalReachedGoal","firstDetectedSharedGoal"],J=[];Y.forEach(W=>{V.has(W)&&(J.push(W),V.delete(W))}),J.push(...Array.from(V).sort());const en=[J,...B.map(W=>J.map(z=>z in W?W[z]:""))],ln=w.utils.aoa_to_sheet(en);w.utils.book_append_sheet(k,ln,"ExperimentData")}else{const B=w.utils.aoa_to_sheet([["No experimental data available"],[new Date().toISOString()]]);w.utils.book_append_sheet(k,B,"ExperimentData")}const A=((p=(c=(l=i==null?void 0:i.game)==null?void 0:l.players)==null?void 0:c.player2)==null?void 0:p.type)||"",D=function(){var J,en,ln,W,z,rn,tn,yn,fn,Pn,Gn;const B=(ln=(en=(J=i==null?void 0:i.game)==null?void 0:J.players)==null?void 0:en.player1)==null?void 0:ln.type,V=(rn=(z=(W=i==null?void 0:i.game)==null?void 0:W.players)==null?void 0:z.player2)==null?void 0:rn.type,Y=B!=="human"?B:V!=="human"?V:"human";if(Y==="human")return"human";if(Y==="gpt"){const hn=(fn=(yn=(tn=i==null?void 0:i.game)==null?void 0:tn.agent)==null?void 0:yn.gpt)==null?void 0:fn.model;return hn&&String(hn).trim().length>0?String(hn):(console.warn("⚠️ GPT model not cached in CONFIG for export, using configured default"),"gpt-4o")}return Y==="rl_joint"?"joint-rl":Y==="rl_individual"?"individual-rl":Y==="ai"?((Gn=(Pn=i==null?void 0:i.game)==null?void 0:Pn.agent)==null?void 0:Gn.type)==="individual"?"individual-rl":"joint-rl":Y||"unknown"}(),M=d&&Array.isArray(d.fallbackEvents)?d.fallbackEvents:[],E=(m.allTrialsData||[]).filter(B=>B.experimentType&&B.experimentType.includes("2P")),$=E.filter(B=>B.collaborationSucceeded===!0).length,O=E.length>0?Math.round($/E.length*100):0,X=[["participantId",m.participantId],["lookitResponseId",m.lookitResponseId||""],["lookitChildId",m.lookitChildId||""],["participantDob",m.participantDob||""],["participantAgeReferenceDate",m.participantAgeReferenceDate||""],["participantAgeYears",m.participantAgeYears??""],["participantAgeMonths",m.participantAgeMonths??""],["participantAgeDays",m.participantAgeDays??""],["participantAgeTotalDays",m.participantAgeTotalDays??""],["roomId",m.roomId||""],["experimentOrder",JSON.stringify(m.experimentOrder||[])],["experimentType",m.experimentType],["partnerAgentType",D],["fallbackEventCount",M.length],["fallbackEvents",JSON.stringify(M)],["waitingDuration",m.waitingDuration||0],["waitingDetails",JSON.stringify(m.waitingDetails||[])],["collaborationTrialsTotal",E.length],["collaborationSuccessCount",$],["collaborationSuccessRate",O],["version",m.version],["timestamp",m.timestamp]],F=w.utils.aoa_to_sheet(X);w.utils.book_append_sheet(k,F,"Meta");const R=[["Metric","Value"],["Total Collaboration Trials",E.length],["Collaboration Successes",$],["Collaboration Failures",E.length-$],["Collaboration Success Rate (%)",O],["",""],["Experiment Type","Success Count","Total Trials","Success Rate (%)"]];[...new Set(E.map(B=>B.experimentType))].forEach(B=>{const V=E.filter(en=>en.experimentType===B),Y=V.filter(en=>en.collaborationSucceeded===!0).length,J=V.length>0?Math.round(Y/V.length*100):0;R.push([B,Y,V.length,J])});const q=w.utils.aoa_to_sheet(R);w.utils.book_append_sheet(k,q,"CollaborationSummary");const N=m.questionnaireData||m.questionnaire||{};let _;if(N&&typeof N=="object"&&!Array.isArray(N)){const B=Object.keys(N),V=B.map(Y=>N[Y]);_=w.utils.aoa_to_sheet([B,V])}else Array.isArray(N)?_=w.utils.aoa_to_sheet(N):_=w.utils.aoa_to_sheet([["Questionnaire"],[JSON.stringify(N)]]);w.utils.book_append_sheet(k,_,"Questionnaire");const Q=w.write(k,{bookType:"xlsx",type:"array"}),Z=btoa(String.fromCharCode.apply(null,new Uint8Array(Q))),nn=new Date().toISOString().replace(/[:.]/g,"-"),gn=String(m.participantId).replace(/[^a-zA-Z0-9_-]/g,"_"),an=String(m.roomId||"no-room").replace(/[^a-zA-Z0-9_-]/g,"_"),Rn=`experiment_data_${gn}_room_${an}_${nn}.xlsx`,sn=new FormData;sn.append("filename",Rn),sn.append("filedata",Z),sn.append("filetype","excel"),fetch(P,{method:"POST",mode:"no-cors",body:sn}).then(()=>{console.log("✅ Google Drive save attempted via Apps Script");try{this.timelineManager&&this.timelineManager.emit("data-save-success"),alert("Data saved successfully!")}catch{}}).catch(B=>{console.warn("⚠️ Google Drive save failed. Local saving is disabled.",B)})}catch(w){console.warn("⚠️ Excel/Apps Script save failed. Local saving is disabled.",w)}else console.warn("⚠️ Google Drive save disabled or XLSX not available. Local saving is disabled.")}catch(d){console.error("Failed to save/export experiment data:",d)}}async startSinglePlayerMode(n){L.setPlayerType(2,i.multiplayer.fallbackAIType||"rl_joint"),this.uiManager.setPlayerInfo(0,"human-ai"),this.uiManager.showMainScreen(),await this.experimentManager.startExperimentSequence([n])}async startMultiplayerMode(n,e){i.game.players.player2.type="human",this.uiManager.showLobbyScreen();try{const t=await this.networkManager.joinRoom({roomId:e,gameMode:"human-human",experimentType:n});console.log("Joined room:",t),this.uiManager.updateLobbyInfo(t)}catch(t){console.error("Failed to join room:",t),this.uiManager.showError("Failed to join game room. Please try again.")}}setupNetworkEventHandlers(){this.networkManager&&(this.networkManager.on("room-joined",n=>{if(console.log("Room joined:",n),n&&n.roomId){this.currentRoomId=n.roomId;try{window.__ROOM_ID__=n.roomId;const e=String(n.roomId||"");let t=0;for(let a=0;a<e.length;a++)t=(t<<5)-t+e.charCodeAt(a),t|=0;window.__SESSION_SEED__=Math.abs(t)}catch{}}try{typeof n.isHost=="boolean"&&(this.playerIndex=n.isHost?0:1),this.useTimelineFlow&&(this.uiManager.setPlayerInfo(this.playerIndex,n.gameMode||"human-human"),this.timelineManager&&this.timelineManager.setPlayerInfo(this.playerIndex,n.gameMode||"human-human"))}catch{}this.useTimelineFlow||this.uiManager.updateLobbyInfo(n)}),this.networkManager.on("player-joined",n=>{console.log("Player joined:",n),this.useTimelineFlow&&this.timelineManager?this.timelineManager.emit("partner-connected",n):this.uiManager.updatePlayerList(n.players)}),this.networkManager.on("room-full",n=>{var e,t;console.log("Room is full - both players connected:",n);try{const a=(t=(e=this.networkManager)==null?void 0:e.socket)==null?void 0:t.id,r=Array.isArray(n==null?void 0:n.players)?n.players.findIndex(o=>o.id===a):-1;(r===0||r===1)&&(this.playerIndex=r,this.useTimelineFlow&&(this.uiManager.setPlayerInfo(this.playerIndex,n.gameMode||"human-human"),this.timelineManager&&this.timelineManager.setPlayerInfo(this.playerIndex,n.gameMode||"human-human")))}catch{}this.useTimelineFlow&&this.timelineManager&&this.timelineManager.emit("partner-connected",n)}),this.networkManager.on("player-disconnected",n=>{var e,t,a,r,o,s,l,c,p,d,g,u,h,y,f,T,m,G;if(console.log("Player disconnected:",n),this.useTimelineFlow){console.log("Partner disconnected during timeline flow - switching to AI");const P=((e=i==null?void 0:i.multiplayer)==null?void 0:e.fallbackAIType)||"rl_joint";let b=null;try{const w=this.gameConfig;w&&Array.isArray(w.players)&&(b=w.players.findIndex(k=>k.id===(n==null?void 0:n.playerId)))}catch{}b!==0&&b!==1&&(b=this.playerIndex===0?1:0);const v=b+1;try{(a=(t=this.experimentManager)==null?void 0:t.activateAIFallback)==null||a.call(t,P,v)}catch{}try{(o=(r=this.experimentManager)==null?void 0:r.logCurrentAIModel)==null||o.call(r)}catch{}try{(l=(s=this.gameStateManager)==null?void 0:s.recordPartnerFallback)==null||l.call(s,{reason:"disconnect",stage:"in-game",at:Date.now(),fallbackAIType:P})}catch{}try{(p=(c=this.experimentManager)==null?void 0:c.logCurrentAIModel)==null||p.call(c)}catch{}try{this.uiManager.setPlayerInfo(this.playerIndex,"human-ai")}catch{}try{this.timelineManager&&(this.timelineManager.gameMode="human-ai",this.timelineManager.emit("partner-connected",{connectedAt:Date.now(),players:(n==null?void 0:n.players)||[]}),this.timelineManager.emit("all-players-ready",{gameMode:"human-ai"}))}catch{}}else{this.uiManager.updatePlayerList(n.players);const P=((d=i==null?void 0:i.multiplayer)==null?void 0:d.fallbackAIType)||"rl_joint";let b=null;try{const w=this.gameConfig;w&&Array.isArray(w.players)&&(b=w.players.findIndex(k=>k.id===(n==null?void 0:n.playerId)))}catch{}b!==0&&b!==1&&(b=this.playerIndex===0?1:0);const v=b+1;try{(u=(g=this.experimentManager)==null?void 0:g.activateAIFallback)==null||u.call(g,P,v)}catch{}try{(y=(h=this.experimentManager)==null?void 0:h.logCurrentAIModel)==null||y.call(h)}catch{}try{(T=(f=this.gameStateManager)==null?void 0:f.recordPartnerFallback)==null||T.call(f,{reason:"disconnect",stage:"in-game",at:Date.now(),fallbackAIType:P})}catch{}try{(G=(m=this.experimentManager)==null?void 0:m.logCurrentAIModel)==null||G.call(m)}catch{}}}),this.networkManager.on("player-ready-status",n=>{if(console.log("Player ready status update:",n),this.useTimelineFlow&&this.timelineManager){const e=n.players&&n.players.every(t=>t.isReady);console.log(`All players ready: ${e}`,n.players),e&&(console.log("🎮 All players ready - emitting to timeline"),this.timelineManager.emit("all-players-ready",{gameMode:"human-human",players:n.players}))}else this.uiManager.updatePlayerReadyStatus(n.players)}),this.networkManager.on("game-started",n=>{console.log("Game started:",n),this.gameConfig=n;const e=this.networkManager.socket.id,t=n.players.find(a=>a.id===e);if(t){this.playerIndex=t.playerIndex,console.log(`I am player ${this.playerIndex+1} (${this.playerIndex===0?"red":"purple"})`);try{window.__PLAYER_INDEX__=this.playerIndex,window.__IS_HOST__=this.playerIndex===0}catch{}}this.useTimelineFlow?(this.uiManager.setPlayerInfo(this.playerIndex,n.gameMode),this.timelineManager.setPlayerInfo(this.playerIndex,n.gameMode),this.timelineManager.emit("all-players-ready",n)):this.startNetworkedGame(n)}),this.networkManager.on("player-action",n=>{console.log("Player action received:",n),this.handleRemotePlayerAction(n)}),this.networkManager.on("game-state-update",n=>{console.log("Game state update received");const e=i.game.players.player1.type==="human"&&i.game.players.player2.type==="human",t=L.isSynchronizedHumanTurnsEnabled(n==null?void 0:n.experimentType);if(e&&!t){try{const o=(()=>{var c,p,d;try{return(((d=(p=(c=this.gameStateManager)==null?void 0:c.getCurrentState)==null?void 0:p.call(c))==null?void 0:d.currentGoals)||[]).length}catch{return 0}})();if((Array.isArray(n==null?void 0:n.currentGoals)?n.currentGoals.length:0)>o){console.log("🎯 Detected new goal on remote — forcing immediate sync"),this.gameStateManager.syncState(n),this.uiManager.updateGameDisplay(this.gameStateManager.getCurrentState()),this.gameStateManager.markStateSynced();return}}catch{}const a=this.gameStateManager.shouldSyncState(),r=this.gameStateManager.hasRecentLocalMoves();a&&!r?(console.log("🔄 Syncing remote state (no recent local moves)"),this.gameStateManager.syncState(n),this.uiManager.updateGameDisplay(this.gameStateManager.getCurrentState()),this.gameStateManager.markStateSynced()):r&&console.log("⏸️ Skipping sync - recent local moves detected")}else this.gameStateManager.syncState(n),this.uiManager.updateGameDisplay(this.gameStateManager.getCurrentState()),t&&(this._hhSync.pendingMoves[0]=null,this._hhSync.pendingMoves[1]=null)}),this.networkManager.on("error",n=>{console.error("Network error:",n),n.type==="connection_lost"&&n.canRetry?this.uiManager.showConnectionLostError(n.message,()=>{this.retryConnection()}):this.uiManager.showError(n.message)}),this.networkManager.on("disconnect",()=>{console.log("Disconnected from server"),this.stopRealTimeSync(),this.uiManager.showConnectionLostError("Connection lost. Attempting to reconnect...",()=>{this.retryConnection()})}),this.networkManager.on("reconnecting",n=>{this.uiManager.showReconnectingMessage(`Reconnecting... (${n.attempt}/${n.maxAttempts})`)}))}setupUIEventHandlers(){this.uiManager.on("player-ready",()=>{this.networkManager&&this.networkManager.setPlayerReady()}),this.uiManager.on("player-move",async n=>{var c,p,d,g,u,h,y,f,T,m,G;try{const P=(p=(c=this.gameStateManager)==null?void 0:c.getCurrentState)==null?void 0:p.call(c),b=(P==null?void 0:P.experimentType)||"",v=String(b).includes("2P"),w=!!(P!=null&&P.player1&&(P!=null&&P.player2));if(!v||!w){this.handlePlayerMove(n);return}}catch{}const e=this.playerIndex===0?1:0,t=(u=(g=(d=i.game)==null?void 0:d.players)==null?void 0:g[e===0?"player1":"player2"])==null?void 0:u.type,a=(y=(h=i.game)==null?void 0:h.agent)==null?void 0:y.synchronizedMoves,r=t!=="human",o=L.isSynchronizedHumanTurnsEnabled((m=(T=(f=this.gameStateManager)==null?void 0:f.getCurrentState)==null?void 0:T.call(f))==null?void 0:m.experimentType),s=!!(this.networkManager&&this.networkManager.isConnected);if(o&&(!r&&s)){try{await this.handleHumanHumanSynchronizedMove(n)}catch(P){console.warn("HH sync move failed, falling back to immediate move:",(P==null?void 0:P.message)||P),this.handlePlayerMove(n)}return}if(r&&a&&((G=this.experimentManager)!=null&&G.handleSynchronizedMove))try{await this.experimentManager.handleSynchronizedMove(n)}catch(P){console.warn("Synchronized move failed, falling back to local move:",(P==null?void 0:P.message)||P),this.handlePlayerMove(n)}else this.handlePlayerMove(n)}),this.uiManager.on("start-experiment",n=>{this.experimentManager.startExperiment(n)}),this.uiManager.on("restart-experiment",()=>{this.experimentManager.restart()})}async startNetworkedGame(n){this.uiManager.setPlayerInfo(this.playerIndex,n.gameMode),this.timelineManager&&this.timelineManager.setPlayerInfo(this.playerIndex,n.gameMode),this.uiManager.showGameScreen(),this.startRealTimeSync(),await this.experimentManager.startMultiplayerExperiment(n)}startRealTimeSync(){i.game.players.player1.type==="human"&&i.game.players.player2.type==="human"&&(this._rtSync.syncInterval=setInterval(()=>{this.networkManager&&this.networkManager.isConnected&&this.gameStateManager.shouldSyncState()&&(this.networkManager.syncGameState(this.gameStateManager.getCurrentState()),this.gameStateManager.markStateSynced())},i.multiplayer.realTimeMovement.stateSyncInterval),console.log("Real-time synchronization started"))}stopRealTimeSync(){this._rtSync.syncInterval&&(clearInterval(this._rtSync.syncInterval),this._rtSync.syncInterval=null),this.gameStateManager&&this.gameStateManager.clearRealTimeSync&&this.gameStateManager.clearRealTimeSync(),console.log("Real-time synchronization stopped")}handlePlayerMove(n){var s,l,c;const e=this.playerIndex+1,t=Date.now(),a=this.networkManager&&this.networkManager.isConnected&&i.game.players.player1.type==="human"&&i.game.players.player2.type==="human",r=L.isSynchronizedHumanTurnsEnabled((c=(l=(s=this.gameStateManager)==null?void 0:s.getCurrentState)==null?void 0:l.call(s))==null?void 0:c.experimentType);if(a&&!r){const p=this.gameStateManager.processPlayerMoveRealTime(e,n,t,!0,this.playerIndex);if(!p.success){if(p.reason==="throttled")return;console.warn("Move rejected:",p.reason);return}this.uiManager.updateGameDisplay(this.gameStateManager.getCurrentState()),this.networkManager.isConnected&&(this.networkManager.sendGameAction({type:"move",direction:n,playerIndex:this.playerIndex,timestamp:t,moveId:p.moveId}),this.gameStateManager.shouldSyncState()&&(this.networkManager.syncGameState(this.gameStateManager.getCurrentState()),this.gameStateManager.markStateSynced())),p.trialComplete&&this.handleTrialComplete(p);return}const o=this.gameStateManager.processPlayerMove(e,n,this.playerIndex);this.networkManager&&this.networkManager.isConnected&&this.networkManager.sendGameAction({type:"move",direction:n,playerIndex:this.playerIndex,timestamp:t}),this.uiManager.updateGameDisplay(this.gameStateManager.getCurrentState()),o.trialComplete&&this.handleTrialComplete(o)}handleRemotePlayerAction(n){var t,a,r,o,s,l;const{action:e}=n;if(e.type==="move"){const c=e.playerIndex+1;if(e.playerIndex!==this.playerIndex){console.log("🎮 Received partner move from player",e.playerIndex,"direction:",e.direction),this.updatePartnerLastMoveTime();const p=i.game.players.player1.type==="human"&&i.game.players.player2.type==="human",d=L.isSynchronizedHumanTurnsEnabled((r=(a=(t=this.gameStateManager)==null?void 0:t.getCurrentState)==null?void 0:a.call(t))==null?void 0:r.experimentType);let g;p&&!d?g=this.gameStateManager.processPlayerMoveRealTime(c,e.direction,e.timestamp||Date.now(),!1,e.playerIndex):g=this.gameStateManager.processPlayerMove(c,e.direction,e.playerIndex),this.uiManager.updateGameDisplay(this.gameStateManager.getCurrentState()),g&&g.trialComplete&&this.handleTrialComplete(g)}return}if(e.type==="proposed-move"){if(!L.isSynchronizedHumanTurnsEnabled((l=(s=(o=this.gameStateManager)==null?void 0:o.getCurrentState)==null?void 0:s.call(o))==null?void 0:l.experimentType))return;const p=!!(typeof window<"u"&&window.__IS_HOST__),d=e.playerIndex;this._hhSync.pendingMoves[d]=e.direction,p&&this.tryResolveHumanHumanTurn()}}async handleHumanHumanSynchronizedMove(n){this._hhSync.pendingMoves[this.playerIndex]=n,this.networkManager&&this.networkManager.isConnected&&this.networkManager.sendGameAction({type:"proposed-move",direction:n,playerIndex:this.playerIndex,timestamp:Date.now()}),!!(typeof window<"u"&&window.__IS_HOST__)&&this.tryResolveHumanHumanTurn()}tryResolveHumanHumanTurn(){const n=this._hhSync.pendingMoves[0],e=this._hhSync.pendingMoves[1];if(!n||!e)return;const t=this.gameStateManager.processSynchronizedMoves(n,e);this.uiManager.updateGameDisplay(this.gameStateManager.getCurrentState()),this.networkManager&&this.networkManager.isConnected&&this.networkManager.syncGameState(this.gameStateManager.getCurrentState()),this._hhSync.pendingMoves[0]=null,this._hhSync.pendingMoves[1]=null,t!=null&&t.trialComplete&&this.handleTrialComplete(t)}handleTrialComplete(n){this.networkManager&&this.networkManager.isConnected&&this.networkManager.sendTrialComplete(n),this.experimentManager.handleTrialComplete(n)}async retryConnection(){if(this.networkManager){console.log("Attempting to reconnect...");try{await this.networkManager.retryConnection()?(this.uiManager.showSuccessMessage("Reconnected successfully!"),this.currentRoomId&&await this.networkManager.joinRoom({roomId:this.currentRoomId})):this.uiManager.showError("Reconnection failed. Please refresh the page.")}catch(n){console.error("Reconnection error:",n),this.uiManager.showError("Reconnection failed. Please refresh the page.")}}}activateAIFallbackForExperiment(n){var a,r,o,s,l;console.log(`🤖 Activating AI fallback for experiment: ${n}`);const e=((a=i==null?void 0:i.multiplayer)==null?void 0:a.fallbackAIType)||"rl_joint",t=this.playerIndex===0?2:1;L.setPlayerType(t,e),this.timelineManager.gameMode="human-ai";try{(o=(r=this.experimentManager)==null?void 0:r.activateAIFallback)==null||o.call(r,e,t)}catch(c){console.error("Error activating AI fallback:",c)}try{(l=(s=this.gameStateManager)==null?void 0:s.recordPartnerFallback)==null||l.call(s,{reason:"partner-disconnected",stage:"experiment-transition",at:Date.now(),fallbackAIType:e})}catch(c){console.error("Error recording fallback event:",c)}try{this.uiManager.setPlayerInfo(this.playerIndex,"human-ai")}catch(c){console.error("Error updating UI:",c)}this.stopInactivityTracking(),console.log(`✅ AI fallback activated - Player${t} is now ${e}`)}startInactivityTracking(){var a,r;const n=((r=(a=i==null?void 0:i.multiplayer)==null?void 0:a.inactivityFallback)==null?void 0:r.enabled)!==!1,e=i.game.players.player1.type==="human"&&i.game.players.player2.type==="human";if(console.log("🔍 startInactivityTracking called:"),console.log("  - isHumanHuman:",e),console.log("  - inactivityFallbackEnabled:",n),console.log("  - timeoutMs:",this._inactivityTracking.inactivityTimeoutMs),console.log("  - checkIntervalMs:",this._inactivityTracking.checkIntervalMs),!e||!n){e||console.log("⚠️ Not in human-human mode - P1:",i.game.players.player1.type,"P2:",i.game.players.player2.type);return}const t=Math.round(this._inactivityTracking.inactivityTimeoutMs/1e3);console.log(`🕐 Starting partner inactivity tracking (${t}s timeout)`),this._inactivityTracking.inactivityTimerId&&(clearInterval(this._inactivityTracking.inactivityTimerId),this._inactivityTracking.inactivityTimerId=null),this._inactivityTracking.enabled=!0,this._inactivityTracking.partnerLastMoveTime=Date.now(),this._inactivityTracking.inactivityTimerId=setInterval(()=>{this.checkPartnerInactivity()},this._inactivityTracking.checkIntervalMs),console.log("✅ Inactivity tracking timer started with ID:",this._inactivityTracking.inactivityTimerId)}stopInactivityTracking(){this._inactivityTracking.inactivityTimerId&&(clearInterval(this._inactivityTracking.inactivityTimerId),this._inactivityTracking.inactivityTimerId=null),this._inactivityTracking.enabled=!1,console.log("⏹️ Partner inactivity tracking stopped")}updatePartnerLastMoveTime(){this._inactivityTracking.enabled&&(this._inactivityTracking.partnerLastMoveTime=Date.now(),console.log("📝 Partner moved - resetting inactivity timer"))}checkPartnerInactivity(){if(console.log("🔍 checkPartnerInactivity called - enabled:",this._inactivityTracking.enabled,"lastMoveTime:",this._inactivityTracking.partnerLastMoveTime),!this._inactivityTracking.enabled||!this._inactivityTracking.partnerLastMoveTime){console.log("⚠️ Inactivity check skipped - not enabled or no last move time");return}const n=Date.now()-this._inactivityTracking.partnerLastMoveTime;if(console.log(`⏱️ Time since last partner move: ${Math.round(n/1e3)}s (timeout: ${Math.round(this._inactivityTracking.inactivityTimeoutMs/1e3)}s)`),n>=this._inactivityTracking.inactivityTimeoutMs)console.log(`⏰ Partner inactive for ${Math.round(n/1e3)}s - activating AI fallback`),this.stopInactivityTracking(),this.activateAIFallbackDueToInactivity();else{const e=this._inactivityTracking.inactivityTimeoutMs-n;console.log(`⏱️ Partner inactive for ${Math.round(n/1e3)}s, ${Math.round(e/1e3)}s remaining`)}}activateAIFallbackDueToInactivity(){var t,a,r,o,s;console.log("🤖 Activating AI fallback due to partner inactivity");const n=((t=i==null?void 0:i.multiplayer)==null?void 0:t.fallbackAIType)||"rl_joint",e=this.playerIndex===0?2:1;L.setPlayerType(e,n),this.timelineManager&&(this.timelineManager.gameMode="human-ai");try{(r=(a=this.experimentManager)==null?void 0:a.activateAIFallback)==null||r.call(a,n,e)}catch(l){console.error("Error activating AI fallback:",l)}try{(s=(o=this.gameStateManager)==null?void 0:o.recordPartnerFallback)==null||s.call(o,{reason:"partner-inactivity",stage:"in-game",at:Date.now(),fallbackAIType:n})}catch(l){console.error("Error recording fallback event:",l)}try{this.uiManager.showGameStatus("🤖 Partner inactive - switching to AI partner","info"),setTimeout(()=>{this.uiManager.showGameStatus("")},3e3)}catch(l){console.error("Error updating UI:",l)}console.log(`✅ AI fallback activated due to inactivity - Player${e} is now ${n}`)}handleTrialStart(n,e,t){console.log(`🎬 Trial start notification received: ${n} (${e}, ${t})`),console.log("🔍 Player types - P1:",i.game.players.player1.type,"P2:",i.game.players.player2.type);const a=i.game.players.player1.type==="human"&&i.game.players.player2.type==="human";console.log("🔍 Is human-human:",a,"Experiment type:",n),a&&n&&n.includes("2P")?(console.log("🕐 Starting inactivity tracking for human-human trial"),this.startInactivityTracking()):console.log("⚠️ Not starting inactivity tracking - isHumanHuman:",a,"is2P:",n==null?void 0:n.includes("2P"))}handleTrialEnd(){console.log("🔚 Trial end notification received - stopping inactivity tracking"),this.stopInactivityTracking()}destroy(){this.stopRealTimeSync(),this.stopInactivityTracking(),this.networkManager&&this.networkManager.disconnect(),this.uiManager&&this.uiManager.destroy(),this.isInitialized=!1}}const oe=new re(document.getElementById("app")),mn=new URLSearchParams(window.location.search),En=mn.get("mode")||"human-ai",Cn=mn.get("experiment")||"2P2G",_n=mn.get("room");console.log("Starting application with:",{mode:En,experimentType:Cn,roomId:_n});document.addEventListener("DOMContentLoaded",()=>{oe.start({mode:En,experimentType:Cn,roomId:_n}).catch(x=>{console.error("Failed to start application:",x),document.getElementById("app").innerHTML=`
      <div style="display: flex; align-items: center; justify-content: center; height: 100vh;">
        <div style="text-align: center; color: #666;">
          <h2>Error</h2>
          <p>Failed to start the experiment: ${x.message}</p>
          <button onclick="window.location.reload()" style="padding: 10px 20px; font-size: 16px;">
            Retry
          </button>
        </div>
      </div>
    `})});
