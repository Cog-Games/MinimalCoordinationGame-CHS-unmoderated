var En=Object.defineProperty;var Cn=(P,n,e)=>n in P?En(P,n,{enumerable:!0,configurable:!0,writable:!0,value:e}):P[n]=e;var fn=(P,n,e)=>(Cn(P,typeof n!="symbol"?n+"":n,e),e);(function(){const n=document.createElement("link").relList;if(n&&n.supports&&n.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))t(a);new MutationObserver(a=>{for(const r of a)if(r.type==="childList")for(const o of r.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&t(o)}).observe(document,{childList:!0,subtree:!0});function e(a){const r={};return a.integrity&&(r.integrity=a.integrity),a.referrerPolicy&&(r.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?r.credentials="include":a.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function t(a){if(a.ep)return;a.ep=!0;const r=e(a);fetch(a.href,r)}})();const X=(P,n)=>{try{return{BASE_URL:"/MinimalCoordinationGame-CHS-unmoderated/",MODE:"production",DEV:!1,PROD:!0,SSR:!1}[P]||n}catch{return console.warn(`Environment variable ${P} not available, using default: ${n}`),n}},Gn=typeof window<"u"&&window.location&&window.location.origin?window.location.origin:"http://localhost:3001",Pn="gridworld.rlStudyCondition",xn=()=>Math.random()<.5?"joint":"individual",_n=()=>{const P=String(X("VITE_STUDY_RL_CONDITION","")||"").toLowerCase();if(P==="joint"||P==="individual")return P;try{if(typeof sessionStorage<"u"){const n=sessionStorage.getItem(Pn);if(n==="joint"||n==="individual")return n;const e=xn();return sessionStorage.setItem(Pn,e),e}}catch{}return xn()},pn=_n(),Tn=pn==="joint"?"rl_joint":"rl_individual",Rn=pn==="joint"?"joint":"individual",i={debug:{disableConsoleLogs:X("VITE_DISABLE_DEBUG_LOGS","false")==="true"},server:{url:X("VITE_SERVER_URL",Gn),reconnectAttempts:3,reconnectDelay:1e3,googleAppsScriptUrl:X("VITE_GOOGLE_APPS_SCRIPT_URL","https://script.google.com/macros/s/AKfycbyfQ-XKsoFbmQZGM7c741rEXh2ZUpVK-uUIu9ycooXKnaxM5-hRSzIUhQ-uWZ668Qql/exec"),enableGoogleDriveSave:X("VITE_ENABLE_GOOGLE_DRIVE_SAVE","true")==="true"},game:{name:"GridWorldExperiment",version:"2.0.0",prolificCompletionCode:X("VITE_PROLIFIC_COMPLETION_CODE","CTNDR8GV"),matrixSize:15,maxGameLength:60,studyRLCondition:pn,players:{player1:{type:"human",color:"red",description:"Human player (you)"},player2:{type:Tn,color:"purple",description:"Human, GPT, or RL partner"}},experiments:{order:["1P1G","1P2G","2P2G","2P3G"],numTrials:{"1P1G":1,"1P2G":1,"2P2G":1,"2P3G":1}},successThreshold:{enabled:!1,consecutiveSuccessesRequired:5,minTrialsBeforeCheck:12,maxTrials:24,randomSamplingAfterTrial:12},timing:{trialToFeedbackDelay:500,feedbackDisplayDuration:1e3,preTrialDisplayDuration:2e3,fixationDuration:1e3,newGoalMessageDuration:0,maxTrialDurationMs:60*1e3,waitingForPartnerMinDuration:3*1e3,waitingForPartnerMaxDuration:3*1e3},agent:{type:Rn,delay:500,independentDelay:300,synchronizedMoves:!0,gpt:{model:"gpt",temperature:0,memory:{enabled:!0,maxSteps:50}}}},visual:{canvasSize:632,cellSize:40,padding:2,colors:{background:"#ffffff",grid:"#cccccc",player1:"#ff0000",player2:"#8000ff",goal:"#0066ff",obstacle:"#333333"}},tts:{useOpenAI:X("VITE_USE_OPENAI_TTS","true")==="true",openAIVoice:X("VITE_OPENAI_TTS_VOICE","nova"),ttsServerUrl:X("VITE_TTS_SERVER_URL",Gn),useCustomAudio:X("VITE_USE_CUSTOM_AUDIO","true")==="true",customAudioPath:X("VITE_CUSTOM_AUDIO_PATH","/audio/questionnaire/")},oneP2G:{minStepsBeforeNewGoal:1,distanceConditions:{CLOSER_TO_PLAYER1:"closer_to_player1",FARTHER_TO_PLAYER1:"farther_to_player1",EQUAL_TO_PLAYER1:"equal_to_player1",NO_NEW_GOAL:"no_new_goal"},distanceConstraint:{closerThreshold:2,fartherThreshold:2,equalTolerance:!1,allowEqualDistance:!1},goalConstraints:{minDistanceFromHuman:1,maxDistanceFromHuman:12,minDistanceBetweenGoals:3,avoidRectangleArea:!1,blockPathCheck:!1}},twoP3G:{minStepsBeforeNewGoal:1,newGoalMessageDuration:5e3,distanceConditions:{CLOSER_TO_PLAYER2:"closer_to_player2",CLOSER_TO_PLAYER1:"closer_to_player1",EQUAL_TO_BOTH:"equal_to_both",NO_NEW_GOAL:"no_new_goal"},distanceConstraint:{closerThreshold:2,allowEqualDistance:!1,maxDistanceIncrease:5},goalConstraints:{minDistanceFromHuman:1,maxDistanceFromHuman:12,avoidRectangleArea:!1,maintainDistanceSum:!1,blockPathCheck:!1}},multiplayer:{maxWaitTime:6e4,roomTimeout:3e5,reconnectAttempts:3,syncInterval:100,moveTimeout:1e4,synchronizedHumanTurns:!1,matchPlayReadyTimeout:1e4,fallbackAIType:Tn,inactivityFallback:{enabled:!0,timeoutMs:4e4,checkIntervalMs:5e3},realTimeMovement:{moveThrottleDelay:100,immediateLocalUpdates:!0,stateSyncInterval:300,moveValidationTimeout:1e3,localMoveProtectionWindow:300}}},$={blank:0,player:1,ai_player:2,goal:3,obstacle:4},rn={arrowup:{movement:[-1,0],name:"up"},arrowdown:{movement:[1,0],name:"down"},arrowleft:{movement:[0,-1],name:"left"},arrowright:{movement:[0,1],name:"right"}};(()=>{var P;try{if((P=i==null?void 0:i.debug)==null?void 0:P.disableConsoleLogs){const e=()=>{};typeof console<"u"&&(console.log=e,console.info=e,console.debug=e)}}catch{}})();const q={setPlayerType(P,n){const e=n==="ai"?"rl_joint":n;["human","gpt","rl_individual","rl_joint"].includes(e)&&(i.game.players[`player${P}`].type=e,P===2&&(e==="rl_joint"&&(i.game.agent.type="joint",i.game.studyRLCondition="joint"),e==="rl_individual"&&(i.game.agent.type="individual",i.game.studyRLCondition="individual")))},getPlayerType(P){return i.game.players[`player${P}`].type},isHumanAIMode(){return i.game.players.player2.type!=="human"},isHumanHumanMode(){return i.game.players.player2.type==="human"},setExperimentOrder(P){i.game.experiments.order=P},getNumTrials(P){return i.game.experiments.numTrials[P]||12},isSynchronizedHumanTurnsEnabled(P){var n;try{return String(P||"").toUpperCase().includes("2P")&&!!((n=i==null?void 0:i.multiplayer)!=null&&n.synchronizedHumanTurns)}catch{return!1}}},vn=window.io;class Ln{constructor(){this.socket=null,this.isConnected=!1,this.eventHandlers=new Map,this.reconnectAttempts=0,this.maxReconnectAttempts=i.server.reconnectAttempts}async connect(){return new Promise((n,e)=>{if(!vn){e(new Error("Socket.IO not available. Please ensure the Socket.IO client is loaded."));return}this.socket=vn(i.server.url,{transports:["websocket"],upgrade:!1}),this.socket.on("connect",()=>{console.log("Connected to server"),this.isConnected=!0,this.reconnectAttempts=0,n()}),this.socket.on("disconnect",t=>{console.log("Disconnected from server:",t),this.isConnected=!1,this.emit("disconnect",t),t!=="io server disconnect"&&this.handleReconnection()}),this.socket.on("connect_error",t=>{console.error("Connection error:",t),this.isConnected=!1,this.reconnectAttempts===0&&e(t)}),this.setupEventForwarding(),setTimeout(()=>{this.isConnected||e(new Error("Connection timeout"))},1e4)})}setupEventForwarding(){["room-joined","player-joined","room-full","player-disconnected","player-ready-status","match-play-ready-status","game-started","player-action","game-state-update","trial-completed","experiment-completed","chat-message","error"].forEach(e=>{this.socket.on(e,t=>{this.emit(e,t)})})}handleReconnection(){this.reconnectAttempts<this.maxReconnectAttempts?(this.reconnectAttempts++,console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})`),this.emit("reconnecting",{attempt:this.reconnectAttempts,maxAttempts:this.maxReconnectAttempts}),setTimeout(()=>{this.socket.connect()},i.server.reconnectDelay*this.reconnectAttempts)):(console.error("Max reconnection attempts reached"),this.emit("error",{message:"Connection lost. Please refresh the page or try reconnecting.",type:"connection_lost",canRetry:!0}))}async retryConnection(){if(this.socket&&!this.isConnected){console.log("Manually retrying connection..."),this.reconnectAttempts=0;try{return await this.connect(),!0}catch(n){return console.error("Manual reconnection failed:",n),!1}}return!1}async joinRoom(n={}){return new Promise((e,t)=>{const a=setTimeout(()=>{t(new Error("Join room timeout"))},1e4);this.socket.once("room-joined",r=>{clearTimeout(a),e(r)}),this.socket.once("error",r=>{clearTimeout(a),t(r)}),this.socket.emit("join-room",n)})}setPlayerReady(){this.isConnected&&this.socket.emit("player-ready")}setMatchPlayReady(){this.isConnected&&this.socket.emit("match-play-ready")}sendGameAction(n){this.isConnected&&this.socket.emit("game-action",{action:n})}syncGameState(n){this.isConnected&&this.socket.emit("sync-game-state",n)}sendTrialComplete(n){this.isConnected&&this.socket.emit("trial-complete",n)}sendExperimentComplete(n){this.isConnected&&this.socket.emit("experiment-complete",n)}sendChatMessage(n){this.isConnected&&this.socket.emit("chat-message",n)}on(n,e){this.eventHandlers.has(n)||this.eventHandlers.set(n,[]),this.eventHandlers.get(n).push(e)}off(n,e){if(this.eventHandlers.has(n)){const t=this.eventHandlers.get(n),a=t.indexOf(e);a>-1&&t.splice(a,1)}}emit(n,e){this.eventHandlers.has(n)&&this.eventHandlers.get(n).forEach(t=>{try{t(e)}catch(a){console.error(`Error in event handler for ${n}:`,a)}})}disconnect(){this.socket&&(this.socket.disconnect(),this.socket=null),this.isConnected=!1}}const I={isValidPosition(P){if(!P||!Array.isArray(P)||P.length<2)return!1;const[n,e]=P;return n>=0&&n<i.game.matrixSize&&e>=0&&e<i.game.matrixSize},isValidMove(P,n,e){const t=this.transition(n,e);if(!this.isValidPosition(t))return[0,0];const[a,r]=t;return P[a][r]===$.obstacle?[0,0]:e},transition(P,n){const[e,t]=P;return[e+n[0],t+n[1]]},calculateGridDistance(P,n){return!P||!n||!Array.isArray(P)||!Array.isArray(n)||P.length<2||n.length<2?1/0:Math.abs(P[0]-n[0])+Math.abs(P[1]-n[1])},isGoalReached(P,n){if(!P||!n||!Array.isArray(n))return!1;for(let e=0;e<n.length;e++)if(P[0]===n[e][0]&&P[1]===n[e][1])return!0;return!1},whichGoalReached(P,n){for(let e=0;e<n.length;e++)if(this.isGoalReached(P,[n[e]]))return e;return null},detectPlayerGoal(P,n,e,t){if(!n)return null;let a;if(typeof n=="string")switch(n){case"up":a=[-1,0];break;case"down":a=[1,0];break;case"left":a=[0,-1];break;case"right":a=[0,1];break;default:return null}else if(Array.isArray(n))a=n;else return null;if(a[0]===0&&a[1]===0)return null;const r=this.transition(P,a);let o=1/0,s=null;const l=[];for(let c=0;c<e.length;c++){const h=this.calculateGridDistance(r,e[c]);h<o?(o=h,s=c,l.length=0,l.push(c)):h===o&&l.push(c)}return l.length>1?t&&t.length>0?t[t.length-1]:null:s},updateMatrix(P,n,e,t){const a=P.map(r=>[...r]);return n>=0&&n<a.length&&e>=0&&e<a[0].length&&(a[n][e]=t),a},generateRandomPosition(P=[]){const n=i.game.matrixSize;let e,t=0;const a=100;do e=[Math.floor(Math.random()*n),Math.floor(Math.random()*n)],t++;while(t<a&&P.some(r=>r[0]===e[0]&&r[1]===e[1]));return e},createFallbackDesign(P){switch(console.log("Creating fallback design for:",P),P){case"1P1G":return{initPlayerGrid:[7,2],target1:[7,12],mapType:"1P1G"};case"1P2G":return{initPlayerGrid:[7,7],target1:[2,7],target2:[12,7],mapType:"1P2G"};case"2P2G":return{initPlayerGrid:[7,2],initAIGrid:[7,12],target1:[2,7],target2:[12,7],mapType:"2P2G"};case"2P3G":return{initPlayerGrid:[7,2],initAIGrid:[7,12],target1:[2,7],target2:[12,7],mapType:"2P3G"};default:return console.error("No fallback design for experiment type:",P),null}},calculateSuccessRate(P){if(!P||P.length===0)return 0;const n=P.filter(e=>e.collaborationSucceeded===!0||e.completed===!0).length;return Math.round(n/P.length*100)},formatDuration(P){const n=Math.floor(P/1e3),e=Math.floor(n/60),t=n%60;return e>0?`${e}:${t.toString().padStart(2,"0")}`:`${t}s`},deepClone(P){if(P===null||typeof P!="object")return P;if(P instanceof Date)return new Date(P);if(P instanceof Array)return P.map(n=>this.deepClone(n));if(typeof P=="object"){const n={};for(const e in P)P.hasOwnProperty(e)&&(n[e]=this.deepClone(P[e]));return n}}};class zn{constructor(){this.currentState=null,this.trialData=null,this.experimentData=null,this.isMoving=!1,this.gameStartTime=0,this.stepCount=0,this.conditionSequences={},this.lastMoveTime=new Map,this.lastLocalMoveTime=new Map,this.moveCounter=0,this.lastSyncTime=0,this.syncPending=!1,this.reset()}reset(){this.currentState={gridMatrix:null,player1:null,player2:null,currentGoals:[],experimentType:null,trialIndex:0,gameMode:"human-ai"},this.clearRealTimeSync(),this.trialData={trialIndex:0,experimentType:null,partnerAgentType:null,distanceCondition:null,gptErrorEvents:[],player1Trajectory:[],player2Trajectory:[],player1Actions:[],player2Actions:[],player1RT:[],player2RT:[],aiInferredOtherGoals:[],currentPlayerIndex:[],player1StartPosition:null,player2StartPosition:null,initialGoalPositions:[],trialStartTime:0,player1GoalReachedStep:-1,player2GoalReachedStep:-1,player1CurrentGoal:[],player2CurrentGoal:[],player1FirstDetectedGoal:null,player2FirstDetectedGoal:null,player1FinalReachedGoal:null,player2FinalReachedGoal:null,firstDetectedSharedGoal:null,newGoalPresentedTime:null,newGoalPosition:null,newGoalConditionType:null,newGoalPresented:!1,isNewGoalCloserToPlayer2:null,collaborationSucceeded:void 0,partnerFallbackOccurred:!1,partnerFallbackReason:null,partnerFallbackStage:null,partnerFallbackTime:null,partnerFallbackAIType:null,humanPlayerIndex:null,aiPlayerIndex:null},this.experimentData={allTrialsData:[],currentExperiment:null,successThreshold:{consecutiveSuccesses:0,totalTrialsCompleted:0,experimentEndedEarly:!1,lastSuccessTrial:-1,successHistory:[]},fallbackEvents:[]},this.stepCount=0,this.gameStartTime=0,this.isMoving=!1,this.conditionSequences={}}initializeTrial(n,e,t){var a,r,o,s,l,c,h,d;this.trialData.trialIndex=n,this.trialData.experimentType=e,this.trialData.partnerAgentType=this.getPartnerAgentType(e),this.trialData.trialStartTime=Date.now(),this.gameStartTime=Date.now(),this.stepCount=0,this.isMoving=!1,this.trialData.player1Trajectory=[],this.trialData.player2Trajectory=[],this.trialData.player1Actions=[],this.trialData.player2Actions=[],this.trialData.player1RT=[],this.trialData.player2RT=[],this.trialData.currentPlayerIndex=[],this.trialData.gptErrorEvents=[],this.trialData.player1StartPosition=null,this.trialData.player2StartPosition=null,this.trialData.initialGoalPositions=[],this.trialData.player1CurrentGoal=[],this.trialData.player2CurrentGoal=[],this.trialData.player1FirstDetectedGoal=null,this.trialData.player2FirstDetectedGoal=null,this.trialData.player1FinalReachedGoal=null,this.trialData.player2FinalReachedGoal=null,this.trialData.firstDetectedSharedGoal=null,this.trialData.player1GoalReachedStep=-1,this.trialData.player2GoalReachedStep=-1,this.trialData.newGoalPresentedTime=null,this.trialData.newGoalPosition=null,this.trialData.newGoalConditionType=null,this.trialData.distanceCondition=null,this.trialData.newGoalPresented=!1,this.trialData.isNewGoalCloserToPlayer2=null,this.trialData.collaborationSucceeded=void 0,this.trialData._finalized=!1,this.trialData.partnerFallbackOccurred=!1,this.trialData.partnerFallbackReason=null,this.trialData.partnerFallbackStage=null,this.trialData.partnerFallbackTime=null;try{if(String(e||"").includes("2P")){const g=(o=(r=(a=i==null?void 0:i.game)==null?void 0:a.players)==null?void 0:r.player1)==null?void 0:o.type,x=(c=(l=(s=i==null?void 0:i.game)==null?void 0:s.players)==null?void 0:l.player2)==null?void 0:c.type;g==="human"&&x!=="human"?(this.trialData.humanPlayerIndex=0,this.trialData.aiPlayerIndex=1):x==="human"&&g!=="human"?(this.trialData.humanPlayerIndex=1,this.trialData.aiPlayerIndex=0):(this.trialData.humanPlayerIndex=null,this.trialData.aiPlayerIndex=null)}else this.trialData.humanPlayerIndex=0,this.trialData.aiPlayerIndex=null}catch{}if(e==="2P3G"){const g=this.getRandomDistanceConditionFor2P3G(n);this.trialData.newGoalConditionType=g,this.trialData.distanceCondition=g,this.currentState.newGoalConditionType=g,this.currentState.distanceCondition=g}else if(e==="1P2G"){const g=this.getRandomDistanceConditionFor1P2G(n);this.trialData.newGoalConditionType=g,this.trialData.distanceCondition=g,this.currentState.newGoalConditionType=g,this.currentState.distanceCondition=g}else if(e==="2P2G"){const g=(d=(h=i==null?void 0:i.twoP3G)==null?void 0:h.distanceConditions)==null?void 0:d.NO_NEW_GOAL;this.trialData.newGoalConditionType=g,this.trialData.distanceCondition=g,this.currentState.newGoalConditionType=g,this.currentState.distanceCondition=g}(e==="1P2G"||e==="2P3G")&&(console.log(`🗺️ Starting ${e} trial ${n}: new-goal condition =`,this.trialData.distanceCondition),console.log(`🤝 Partner agent type: ${this.trialData.partnerAgentType}`)),this.setupGridMatrix(t,e),this.currentState.experimentType=e,this.currentState.trialIndex=n;try{this.trialData.player1StartPosition=Array.isArray(this.currentState.player1)&&this.currentState.player1.length>=2?[...this.currentState.player1]:null,this.trialData.player2StartPosition=Array.isArray(this.currentState.player2)&&this.currentState.player2.length>=2?[...this.currentState.player2]:null,Array.isArray(this.currentState.currentGoals)?this.trialData.initialGoalPositions=this.currentState.currentGoals.filter(g=>Array.isArray(g)&&g.length>=2).map(g=>[...g]):this.trialData.initialGoalPositions=[]}catch{}}recordPartnerFallback({reason:n="disconnect",stage:e="in-game",at:t=Date.now(),fallbackAIType:a=null}={}){var r,o,s,l,c,h,d,g,x,p,m,u,T;try{let f="unknown";if(a)f=this.normalizeAITypeName(a);else try{const y=(s=(o=(r=i==null?void 0:i.game)==null?void 0:r.players)==null?void 0:o.player1)==null?void 0:s.type,G=(h=(c=(l=i==null?void 0:i.game)==null?void 0:l.players)==null?void 0:c.player2)==null?void 0:h.type,v=y!=="human"?y:G!=="human"?G:null;if(v==="gpt"){const b=(x=(g=(d=i==null?void 0:i.game)==null?void 0:d.agent)==null?void 0:g.gpt)==null?void 0:x.model;b&&String(b).trim().length>0?f=String(b):(console.warn("⚠️ GPT model not cached in CONFIG for fallback recording, using configured default"),f="gpt-4o")}else if(v==="rl_joint")f="joint-rl";else if(v==="rl_individual")f="individual-rl";else if(v==="ai")f=((m=(p=i==null?void 0:i.game)==null?void 0:p.agent)==null?void 0:m.type)==="individual"?"individual-rl":"joint-rl";else if(v&&v!=="human")f=String(v);else{const b=((u=i==null?void 0:i.multiplayer)==null?void 0:u.fallbackAIType)||"rl_joint";f=this.normalizeAITypeName(b)}}catch{const G=((T=i==null?void 0:i.multiplayer)==null?void 0:T.fallbackAIType)||"rl_joint";f=this.normalizeAITypeName(G)}if(this.trialData&&(this.trialData.partnerFallbackOccurred=!0,this.trialData.partnerFallbackReason=n,this.trialData.partnerFallbackStage=e,this.trialData.partnerFallbackTime=t,this.trialData.partnerFallbackAIType=f),this.experimentData){const y=this.currentState&&Number.isInteger(this.currentState.trialIndex)?this.currentState.trialIndex:-1,G=this.currentState&&this.currentState.experimentType||null,v={reason:n,stage:e,at:t,trialIndex:y,experimentType:G,aiType:f};Array.isArray(this.experimentData.fallbackEvents)?this.experimentData.fallbackEvents.push(v):this.experimentData.fallbackEvents=[v]}}catch{}}recordGptErrorEvent({phase:n="independent",error:e="",humanDirection:t=null,fallback:a=null,fallbackDirection:r=null}={}){try{const o={step:this.stepCount,timeMs:Date.now()-(this.gameStartTime||Date.now()),phase:n,error:String(e||""),humanDirection:t||null,fallback:a||null,fallbackDirection:r||null};Array.isArray(this.trialData.gptErrorEvents)?this.trialData.gptErrorEvents.push(o):this.trialData.gptErrorEvents=[o]}catch{}}setupGridMatrix(n,e){if(!n){console.error("Invalid design provided to setupGridMatrix:",n);return}const t=i.game.matrixSize;if(this.currentState.gridMatrix=Array(t).fill(0).map(()=>Array(t).fill(0)),n.initPlayerGrid&&n.initPlayerGrid.length>=2){const[a,r]=n.initPlayerGrid;this.currentState.gridMatrix[a][r]=$.player,this.currentState.player1=[a,r]}if(e&&e.includes("2P")&&n.initAIGrid&&n.initAIGrid.length>=2){const[a,r]=n.initAIGrid;this.currentState.gridMatrix[a][r]=$.ai_player,this.currentState.player2=[a,r]}else this.currentState.player2=null;if(this.currentState.currentGoals=[],n.target1&&n.target1.length>=2){const[a,r]=n.target1;this.currentState.gridMatrix[a][r]=$.goal,this.currentState.currentGoals.push([a,r])}if(n.target2&&n.target2.length>=2){const[a,r]=n.target2;this.currentState.gridMatrix[a][r]=$.goal,this.currentState.currentGoals.push([a,r])}}addGoal(n){if(!n||n.length<2)return;const[e,t]=n;if(!(!this.currentState||!this.currentState.gridMatrix)&&!(e<0||e>=this.currentState.gridMatrix.length)&&!(t<0||t>=this.currentState.gridMatrix[0].length)){if(this.currentState.currentGoals.some(a=>a[0]===e&&a[1]===t)){console.log(`🔧 [GOAL] Duplicate goal at [${e}, ${t}] not added`);return}console.log(`🎯 [GOAL] Adding goal at [${e}, ${t}]. Total goals: ${this.currentState.currentGoals.length+1}`),this.currentState.gridMatrix[e][t]=$.goal,this.currentState.currentGoals.push([e,t])}}markNewGoalPresented(n,e,t={}){if(!this.trialData)return;this.trialData.newGoalPresented=!0,this.trialData.newGoalPresentedTime=this.stepCount,this.trialData.newGoalPosition=n?[...n]:null;const a=e||this.trialData.newGoalConditionType||this.trialData.distanceCondition||null;this.trialData.newGoalConditionType=a,this.trialData.distanceCondition=a,this.currentState&&(this.currentState.newGoalConditionType=a,this.currentState.distanceCondition=a),typeof t.isNewGoalCloserToPlayer2=="boolean"&&(this.trialData.isNewGoalCloserToPlayer2=t.isNewGoalCloserToPlayer2)}processPlayerMove(n,e,t=null){var r;if(this.isMoving)return{success:!1,reason:"already_moving"};const a=n===1?this.currentState.player1:this.currentState.player2;if(!a)return{success:!1,reason:"invalid_player"};if(I.isGoalReached(a,this.currentState.currentGoals))return{success:!1,reason:"already_at_goal"};this.isMoving=!0;try{const o=(r=rn[`arrow${e}`])==null?void 0:r.movement;if(!o)return{success:!1,reason:"invalid_direction"};(this.gameStartTime===0||Date.now()-this.gameStartTime>6e4)&&(console.warn("Invalid gameStartTime detected, resetting to current time"),this.gameStartTime=Date.now());const s=Date.now()-this.gameStartTime;this.recordPlayerMove(n,o,s,t);const l=I.isValidMove(this.currentState.gridMatrix,a,o),c=I.transition(a,l);return this.updatePlayerPosition(n,a,c),this.detectAndRecordGoals(n,o),this.stepCount++,{success:!0,trialComplete:this.checkTrialCompletion(),newPosition:c,stepCount:this.stepCount}}finally{setTimeout(()=>{this.isMoving=!1},100)}}processSynchronizedMoves(n,e){var t,a;if(this.isMoving)return{success:!1,reason:"already_moving"};this.isMoving=!0;try{const r={success:!0,trialComplete:!1},o=this.currentState.player1,s=this.currentState.player2,l=n?(t=rn[`arrow${n}`])==null?void 0:t.movement:null,c=e?(a=rn[`arrow${e}`])==null?void 0:a.movement:null,h=Date.now()-this.gameStartTime;let d=o;if(o&&l&&!I.isGoalReached(o,this.currentState.currentGoals)){this.recordPlayerMove(1,l,h);const x=I.isValidMove(this.currentState.gridMatrix,o,l);d=I.transition(o,x)}let g=s;if(s&&c&&!I.isGoalReached(s,this.currentState.currentGoals)){this.recordPlayerMove(2,c,h);const x=I.isValidMove(this.currentState.gridMatrix,s,c);g=I.transition(s,x)}return o&&d&&d!==o&&this.updatePlayerPosition(1,o,d),s&&g&&g!==s&&this.updatePlayerPosition(2,s,g),o&&l&&this.detectAndRecordGoals(1,l),s&&c&&this.detectAndRecordGoals(2,c),this.stepCount++,r.trialComplete=this.checkTrialCompletion(),r.newPositions={player1:d,player2:g},r}finally{setTimeout(()=>{this.isMoving=!1},100)}}processSynchronizedMovesMapped(n,e,t){var a,r;if(this.isMoving)return{success:!1,reason:"already_moving"};this.isMoving=!0;try{const o={success:!0,trialComplete:!1},s=this.currentState.player1,l=this.currentState.player2,c=e?(a=rn[`arrow${e}`])==null?void 0:a.movement:null,h=t?(r=rn[`arrow${t}`])==null?void 0:r.movement:null,d=n===1?c:h,g=n===2?c:h,x=Date.now()-this.gameStartTime;let p=s;if(s&&d&&!I.isGoalReached(s,this.currentState.currentGoals)){this.recordPlayerMove(1,d,x);const u=I.isValidMove(this.currentState.gridMatrix,s,d);p=I.transition(s,u)}let m=l;if(l&&g&&!I.isGoalReached(l,this.currentState.currentGoals)){this.recordPlayerMove(2,g,x);const u=I.isValidMove(this.currentState.gridMatrix,l,g);m=I.transition(l,u)}return s&&p&&p!==s&&this.updatePlayerPosition(1,s,p),l&&m&&m!==l&&this.updatePlayerPosition(2,l,m),s&&d&&this.detectAndRecordGoals(1,d),l&&g&&this.detectAndRecordGoals(2,g),this.stepCount++,o.trialComplete=this.checkTrialCompletion(),o}finally{setTimeout(()=>{this.isMoving=!1},100)}}updatePlayerPosition(n,e,t){const a=n===1?$.player:$.ai_player;this.currentState.gridMatrix[e[0]][e[1]]=$.blank,this.currentState.gridMatrix[t[0]][t[1]]=a,n===1?this.currentState.player1=[...t]:this.currentState.player2=[...t]}recordPlayerMove(n,e,t,a=null){const r=n===1?this.currentState.player1:this.currentState.player2;n===1?(this.trialData.player1Actions.push(e),this.trialData.player1Trajectory.push([...r]),this.trialData.player1RT.push(t)):(this.trialData.player2Actions.push(e),this.trialData.player2Trajectory.push([...r]),this.trialData.player2RT.push(t)),a!==null?this.trialData.currentPlayerIndex.push(a):this.trialData.currentPlayerIndex.push(n===1?0:1)}recordAIInferredOtherGoal(n){try{Array.isArray(this.trialData.aiInferredOtherGoals)||(this.trialData.aiInferredOtherGoals=[]),this.trialData.aiInferredOtherGoals.push(Array.isArray(n)&&n.length>=2?[n[0],n[1]]:null)}catch{}}detectAndRecordGoals(n,e){const t=n===1?this.currentState.player1:this.currentState.player2,a=n===1?this.trialData.player1CurrentGoal:this.trialData.player2CurrentGoal,r=I.detectPlayerGoal(t,e,this.currentState.currentGoals,a);if(n===1?(this.trialData.player1CurrentGoal.push(r),r!==null&&this.trialData.player1FirstDetectedGoal===null&&(this.trialData.player1FirstDetectedGoal=r)):(this.trialData.player2CurrentGoal.push(r),r!==null&&this.trialData.player2FirstDetectedGoal===null&&(this.trialData.player2FirstDetectedGoal=r)),this.currentState.experimentType==="2P3G"&&this.trialData.player1CurrentGoal.length>0&&this.trialData.player2CurrentGoal.length>0){const o=this.trialData.player1CurrentGoal[this.trialData.player1CurrentGoal.length-1],s=this.trialData.player2CurrentGoal[this.trialData.player2CurrentGoal.length-1];o!==null&&s!==null&&o===s&&this.trialData.firstDetectedSharedGoal===null&&(this.trialData.firstDetectedSharedGoal=o)}}checkTrialCompletion(){const n=I.isGoalReached(this.currentState.player1,this.currentState.currentGoals),e=this.currentState.player2?I.isGoalReached(this.currentState.player2,this.currentState.currentGoals):!0;if(n&&this.trialData.player1GoalReachedStep===-1&&(this.trialData.player1GoalReachedStep=this.stepCount,this.trialData.player1FinalReachedGoal=I.whichGoalReached(this.currentState.player1,this.currentState.currentGoals)),this.currentState.player2&&e&&this.trialData.player2GoalReachedStep===-1&&(this.trialData.player2GoalReachedStep=this.stepCount,this.trialData.player2FinalReachedGoal=I.whichGoalReached(this.currentState.player2,this.currentState.currentGoals)),this.currentState.experimentType.startsWith("1P"))return n;if(n&&e){const t=this.trialData.player1FinalReachedGoal,a=this.trialData.player2FinalReachedGoal;return this.trialData.collaborationSucceeded=t===a&&t!==null,!0}return this.stepCount>=i.game.maxGameLength}finalizeTrial(n){var e,t,a,r;if(this.trialData._finalized){console.warn("Trial already finalized, skipping duplicate finalization");return}try{this.currentState&&typeof this.currentState.experimentType=="string"&&this.currentState.experimentType.includes("2P")&&typeof this.trialData.collaborationSucceeded!="boolean"&&(this.trialData.collaborationSucceeded=!1)}catch{}this.trialData.completed=!!n,this.trialData.endTime=Date.now(),this.trialData.totalSteps=this.stepCount;try{if(this.currentState&&String(this.currentState.experimentType||"").includes("2P")){const s=String(this.trialData.partnerAgentType||"").trim(),l=this.getPartnerAgentType(this.currentState.experimentType);l&&s!==l&&(this.trialData.partnerAgentType=l);const c=(a=(t=(e=i==null?void 0:i.game)==null?void 0:e.agent)==null?void 0:t.gpt)==null?void 0:a.model;this.trialData.partnerFallbackOccurred&&c&&/^gpt$/i.test(String(this.trialData.partnerFallbackAIType||""))&&(this.trialData.partnerFallbackAIType=c)}}catch{}try{if(this.trialData.newGoalPresented&&(!this.trialData.newGoalPosition||this.trialData.newGoalPosition.length<2)){const o=Array.isArray((r=this.currentState)==null?void 0:r.currentGoals)?this.currentState.currentGoals:[];if(o.length>=3){const s=o[o.length-1];Array.isArray(s)&&s.length>=2&&(this.trialData.newGoalPosition=[s[0],s[1]])}}}catch{}this.fixMissingGoalValues(),this.experimentData.allTrialsData.push({...this.trialData}),this.trialData._finalized=!0,this.updateSuccessThreshold(n)}fixMissingGoalValues(){var e;const n=((e=this.currentState)==null?void 0:e.experimentType)||"";n.startsWith("1P")?this.trialData.player2FinalReachedGoal=-1:n.startsWith("2P")&&(this.trialData.player1GoalReachedStep===-1&&this.trialData.player1FinalReachedGoal===null&&(this.trialData.player1FinalReachedGoal=-1),this.trialData.player2GoalReachedStep===-1&&this.trialData.player2FinalReachedGoal===null&&(this.trialData.player2FinalReachedGoal=-1))}normalizeAITypeName(n){var t,a,r,o,s,l,c,h,d;if(!n||typeof n!="string")return"unknown";switch(n.toLowerCase().trim()){case"gpt":const g=(r=(a=(t=i==null?void 0:i.game)==null?void 0:t.agent)==null?void 0:a.gpt)==null?void 0:r.model;return g&&String(g).trim()?String(g):"gpt-4o";case"rl_joint":case"joint":return"joint-rl";case"rl_individual":case"individual":return"individual-rl";case"ai":return((s=(o=i==null?void 0:i.game)==null?void 0:o.agent)==null?void 0:s.type)==="individual"?"individual-rl":"joint-rl";case"human":console.error('❌ BUG: Attempted to set partnerFallbackAIType to "human" - using default instead');const x=((l=i==null?void 0:i.multiplayer)==null?void 0:l.fallbackAIType)||"rl_joint";if(x==="rl_joint")return"joint-rl";if(x==="rl_individual")return"individual-rl";if(x==="gpt"){const p=(d=(h=(c=i==null?void 0:i.game)==null?void 0:c.agent)==null?void 0:h.gpt)==null?void 0:d.model;return p&&String(p).trim()?String(p):"gpt-4o"}return"joint-rl";default:return n}}updateSuccessThreshold(n){const e=this.experimentData.successThreshold;e.totalTrialsCompleted++,e.successHistory.push(n),n?(e.consecutiveSuccesses++,e.lastSuccessTrial=e.totalTrialsCompleted-1):e.consecutiveSuccesses=0,e.consecutiveSuccesses>=i.game.successThreshold.consecutiveSuccessesRequired&&e.totalTrialsCompleted>=i.game.successThreshold.minTrialsBeforeCheck&&(e.experimentEndedEarly=!0)}getPartnerAgentType(n){var e,t,a,r,o,s,l,c,h,d,g;try{if(!String(n||"").includes("2P"))return"none";const x=(a=(t=(e=i==null?void 0:i.game)==null?void 0:e.players)==null?void 0:t.player1)==null?void 0:a.type,p=(s=(o=(r=i==null?void 0:i.game)==null?void 0:r.players)==null?void 0:o.player2)==null?void 0:s.type,m=x!=="human"?x:p!=="human"?p:"human";if(m==="human")return"human";if(m==="gpt"){const u=(h=(c=(l=i==null?void 0:i.game)==null?void 0:l.agent)==null?void 0:c.gpt)==null?void 0:h.model;return u&&String(u).trim().length>0?String(u):(console.warn("⚠️ GPT model not cached in CONFIG, using fallback logic"),"gpt-4o")}return m==="rl_joint"?"joint-rl":m==="rl_individual"?"individual-rl":m==="ai"?((g=(d=i==null?void 0:i.game)==null?void 0:d.agent)==null?void 0:g.type)==="individual"?"individual-rl":"joint-rl":String(m||"unknown")}catch{return"unknown"}}getSessionSeedInt(){try{if(typeof window<"u"&&Number.isInteger(window.__SESSION_SEED__))return window.__SESSION_SEED__}catch{}return null}seededShuffle(n,e){if(!Array.isArray(n)||n.length<=1)return n;if(!Number.isInteger(e))return this.randomShuffle(n);const t=n.slice();let a=e>>>0||1;const r=4294967296,o=1664525,s=1013904223,l=()=>(a=Math.imul(o,a)+s>>>0,a/r);for(let c=t.length-1;c>0;c--){const h=Math.floor(l()*(c+1));[t[c],t[h]]=[t[h],t[c]]}return t}randomShuffle(n){const e=n.slice();for(let t=e.length-1;t>0;t--){const a=Math.floor(Math.random()*(t+1));[e[t],e[a]]=[e[a],e[t]]}return e}getRandomDistanceConditionFor2P3G(n){var r,o,s,l,c;const e="2P3G",t=(o=(r=i.game.experiments)==null?void 0:r.numTrials)==null?void 0:o[e];if(!this.conditionSequences[e]){const d=((c=(l=(s=i==null?void 0:i.game)==null?void 0:s.players)==null?void 0:l.player2)==null?void 0:c.type)==="human"?this.getSessionSeedInt()??null:null;this.conditionSequences[e]=this.generateBalancedConditionSequence(Object.values(i.twoP3G.distanceConditions),t,d),console.log(`🎲 Generated balanced condition sequence for ${e}:`,this.conditionSequences[e])}const a=this.conditionSequences[e];return a[n%a.length]}getRandomDistanceConditionFor1P2G(n){var r,o;const e="1P2G",t=(o=(r=i.game.experiments)==null?void 0:r.numTrials)==null?void 0:o[e];this.conditionSequences[e]||(this.conditionSequences[e]=this.generateBalancedConditionSequence(Object.values(i.oneP2G.distanceConditions),t),console.log(`🎲 Generated balanced condition sequence for ${e}:`,this.conditionSequences[e]));const a=this.conditionSequences[e];return a[n%a.length]}generateBalancedConditionSequence(n,e,t=null){if(!Array.isArray(n)||n.length===0||e<=0)return[];const a=n.length,r=Math.floor(e/a);let o=e%a;const s=[];for(let d=0;d<a;d++)for(let g=0;g<r;g++)s.push(n[d]);let l=[...Array(a).keys()];l=Number.isInteger(t)?this.seededShuffle(l,t):this.randomShuffle(l);let c=0;for(;o>0;)s.push(n[l[c%a]]),c++,o--;return Number.isInteger(t)?this.seededShuffle(s,t^2654435769):this.randomShuffle(s)}syncState(n){var r,o,s,l,c;try{const h=Array.isArray((r=this.currentState)==null?void 0:r.currentGoals)?this.currentState.currentGoals:[],d=Array.isArray(n==null?void 0:n.currentGoals)?n.currentGoals:null;if(d&&Array.isArray(d)&&Array.isArray(h)&&d.length>h.length&&(((o=this.currentState)==null?void 0:o.experimentType)==="2P3G"||(n==null?void 0:n.experimentType)==="2P3G")&&this.trialData&&this.trialData.newGoalPresented===!1){const g=(p,m)=>Array.isArray(p)&&Array.isArray(m)&&p[0]===m[0]&&p[1]===m[1],x=d.find(p=>!h.some(m=>g(m,p)));if(Array.isArray(x)&&x.length===2){const p=n&&(n.distanceCondition||n.newGoalConditionType)||this.trialData.distanceCondition||this.trialData.newGoalConditionType||null;this.markNewGoalPresented([...x],p,{})}}}catch{}const e={...this.currentState,...n},t=i.multiplayer.realTimeMovement,a=Date.now();if(t&&this.currentState&&[1,2].forEach(h=>{const d=`player${h}`,g=this.currentState[d],x=n[d];if(g&&x){const p=this.lastMoveTime.get(h)||0,m=a-p,u=t.localMoveProtectionWindow;if(m<u&&(console.log(`🔧 [ROLLBACK FIX] Preserving local position for player${h} (moved ${m}ms ago)`),e[d]=g,e.gridMatrix&&Array.isArray(g)&&g.length===2)){const[T,f]=g;T>=0&&T<e.gridMatrix.length&&f>=0&&f<e.gridMatrix[0].length&&(Array.isArray(x)&&(x[0]!==g[0]||x[1]!==g[1])&&(e.gridMatrix[x[0]][x[1]]=$.blank),e.gridMatrix[T][f]=h)}}}),((s=this.currentState)==null?void 0:s.experimentType)==="2P3G"||(n==null?void 0:n.experimentType)==="2P3G"){const h=Array.isArray((l=this.currentState)==null?void 0:l.currentGoals)?this.currentState.currentGoals:[],d=Array.isArray(n==null?void 0:n.currentGoals)?n.currentGoals:[];h.length>d.length?(console.log(`🔧 [SYNC FIX] Preserving local goals (${h.length}) over remote goals (${d.length})`),e.currentGoals=h,(c=this.currentState)!=null&&c.gridMatrix&&(e.gridMatrix=this.currentState.gridMatrix)):d.length>h.length&&(console.log(`🔧 [SYNC FIX] Accepting remote goals (${d.length}) over local goals (${h.length})`),n!=null&&n.gridMatrix&&(e.gridMatrix=n.gridMatrix))}this.currentState=e}getCurrentState(){return{...this.currentState}}processPlayerMoveRealTime(n,e,t=Date.now(),a=!1,r=null){const o=i.multiplayer.realTimeMovement,s=this.lastMoveTime.get(n)||0;if(t-s<o.moveThrottleDelay)return{success:!1,reason:"throttled"};this.lastMoveTime.set(n,t),a&&this.lastLocalMoveTime.set(n,t);const l=this.isMoving;let c;try{this.isMoving=!1,c=this.processPlayerMove(n,e,r)}finally{this.isMoving=l}return c.timestamp=t,c.isLocal=a,c.moveId=`move_${this.moveCounter++}_${n}_${t}`,c}shouldSyncState(){const n=i.multiplayer.realTimeMovement;return Date.now()-this.lastSyncTime>n.stateSyncInterval}hasRecentLocalMoves(){const n=Date.now(),e=250;for(const[t,a]of this.lastLocalMoveTime.entries())if(n-a<e)return!0;return!1}markStateSynced(){this.lastSyncTime=Date.now()}clearRealTimeSync(){this.lastMoveTime.clear(),this.lastLocalMoveTime.clear(),this.moveCounter=0,this.lastSyncTime=0,this.syncPending=!1}getCurrentTrialData(){return{...this.trialData}}getTrialData(){return{...this.trialData}}getExperimentData(){return{...this.experimentData}}}class $n{constructor(){this.canvas=null,this.ctx=null,this.cellSize=i.visual.cellSize,this.canvasSize=i.visual.canvasSize,this.padding=i.visual.padding,this.effectiveCellSize=this.cellSize+this.padding}createCanvas(){this.canvas=document.createElement("canvas"),this.canvas.width=this.canvasSize,this.canvas.height=this.canvasSize,this.canvas.style.border="2px solid #333",this.canvas.style.backgroundColor=i.visual.colors.background,this.ctx=this.canvas.getContext("2d");try{this.applyResponsiveSizing()}catch{}return this.canvas}applyResponsiveSizing(){var T,f,y;if(!this.canvas)return;const n=i.game.matrixSize,e=typeof window<"u"&&window.devicePixelRatio?window.devicePixelRatio:1,t=this.canvas.parentElement,a=(f=(T=this.canvas).closest)==null?void 0:f.call(T,'[data-grid-fit-container="true"]'),r=typeof window<"u"?window.innerWidth||0:this.canvasSize,o=typeof window<"u"?Math.floor(((y=window.visualViewport)==null?void 0:y.height)||window.innerHeight||0):this.canvasSize,s=Math.min(r,o),l=(a==null?void 0:a.clientWidth)||(t==null?void 0:t.clientWidth)||s,c=a?Number(a.getAttribute("data-grid-reserved-height")||170):0,h=c>0?Math.max(220,o-c):s*.85,d=Number(i.visual.canvasSize)||this.canvasSize,g=Math.min(l-16,r-32),x=Math.max(200,Math.floor(Math.min(h,g,d)));let p=Math.floor((x-(n+1)*this.padding)/n);p=Math.max(10,p);const m=n*p+(n+1)*this.padding;this.cellSize=p,this.effectiveCellSize=this.cellSize+this.padding,this.canvasSize=m,this.canvas.style.width=`${m}px`,this.canvas.style.height=`${m}px`;const u=Math.floor(m*e);(this.canvas.width!==u||this.canvas.height!==u)&&(this.canvas.width=u,this.canvas.height=u),this.ctx||(this.ctx=this.canvas.getContext("2d")),this.ctx&&typeof this.ctx.setTransform=="function"&&this.ctx.setTransform(e,0,0,e,0,0)}render(n,e){!n||!e||!e.gridMatrix||(this.canvas=n,this.ctx=n.getContext("2d"),this.gameState=e,this.applyResponsiveSizing(),this.ctx.fillStyle=i.visual.colors.grid,this.ctx.fillRect(0-this.padding,0-this.padding,this.canvasSize+this.padding,this.canvasSize+this.padding),this.drawGrid(),this.drawGameObjects(e.gridMatrix))}drawGrid(){const n=i.game.matrixSize;for(let e=0;e<n;e++)for(let t=0;t<n;t++)this.ctx.fillStyle=i.visual.colors.background,this.ctx.fillRect(t*this.effectiveCellSize+this.padding,e*this.effectiveCellSize+this.padding,this.cellSize,this.cellSize)}drawGameObjects(n){const e=i.game.matrixSize;for(let a=0;a<e;a++)for(let r=0;r<e;r++){const o=n[a][r];o===$.obstacle&&this.drawCell(a,r,o)}this.drawGoals();const t=this.getPlayerPositions(n);this.drawPlayersWithOverlap(t)}drawGoals(){if(this.gameState&&this.gameState.currentGoals&&Array.isArray(this.gameState.currentGoals)){for(const n of this.gameState.currentGoals)if(n&&Array.isArray(n)&&n.length>=2){const[e,t]=n;this.drawGoalWithPlayerCheck(e,t)}}else{const n=i.game.matrixSize;for(let e=0;e<n;e++)for(let t=0;t<n;t++)this.gameState.gridMatrix[e][t]===$.goal&&this.drawGoalWithPlayerCheck(e,t)}}drawGoalWithPlayerCheck(n,e){const t=this.isPlayerAtPosition(n,e),a=e*this.effectiveCellSize+this.padding,r=n*this.effectiveCellSize+this.padding;this.ctx.save(),this.ctx.fillStyle=i.visual.colors.goal,t&&(this.ctx.globalAlpha=.7),this.ctx.fillRect(a,r,this.cellSize,this.cellSize),this.ctx.restore()}isPlayerAtPosition(n,e){return this.gameState?!!(this.gameState.player1&&this.gameState.player1.length===2&&this.gameState.player1[0]===n&&this.gameState.player1[1]===e||this.gameState.player2&&this.gameState.player2.length===2&&this.gameState.player2[0]===n&&this.gameState.player2[1]===e):!1}getPlayerPositions(n){const e=i.game.matrixSize,t=[];for(let a=0;a<e;a++)for(let r=0;r<e;r++){const o=n[a][r];(o===$.player||o===$.ai_player)&&t.push({row:a,col:r,type:o})}return this.gameState&&(t.length=0,this.gameState.player1&&this.gameState.player1.length===2&&t.push({row:this.gameState.player1[0],col:this.gameState.player1[1],type:$.player}),this.gameState.player2&&this.gameState.player2.length===2&&t.push({row:this.gameState.player2[0],col:this.gameState.player2[1],type:$.ai_player})),t}drawPlayersWithOverlap(n){const e=new Map;for(const t of n){const a=`${t.row},${t.col}`;e.has(a)||e.set(a,[]),e.get(a).push(t)}for(const[t,a]of e){const[r,o]=t.split(",").map(Number);this.drawOverlappingPlayers(r,o,a)}}drawCell(n,e,t){const a=e*this.effectiveCellSize+this.padding,r=n*this.effectiveCellSize+this.padding;switch(a+this.cellSize/2,r+this.cellSize/2,this.cellSize*.35,this.ctx.save(),t){case $.player:case $.ai_player:break;case $.goal:this.ctx.fillStyle=i.visual.colors.goal,this.ctx.fillRect(a,r,this.cellSize,this.cellSize);break;case $.obstacle:this.ctx.fillStyle=i.visual.colors.obstacle,this.ctx.fillRect(a+2,r+2,this.cellSize-4,this.cellSize-4);break}this.ctx.restore()}drawOverlappingPlayers(n,e,t){const a=e*this.effectiveCellSize+this.padding,r=n*this.effectiveCellSize+this.padding,o=a+this.cellSize/2,s=r+this.cellSize/2,l=this.cellSize*.35,c=this.cellSize*.15;if(this.ctx.save(),t.length===1){const d=t[0].type===$.player?i.visual.colors.player1:i.visual.colors.player2;this.ctx.fillStyle=d,this.ctx.beginPath(),this.ctx.arc(o,s,l,0,2*Math.PI),this.ctx.fill()}else if(t.length>=2){const d=t[0].type===$.player?i.visual.colors.player1:i.visual.colors.player2;this.ctx.fillStyle=d,this.ctx.beginPath(),this.ctx.arc(o-c,s,l,0,2*Math.PI),this.ctx.fill();const x=t[1].type===$.player?i.visual.colors.player1:i.visual.colors.player2;this.ctx.fillStyle=x,this.ctx.beginPath(),this.ctx.arc(o+c,s,l,0,2*Math.PI),this.ctx.fill()}this.ctx.restore()}highlightCell(n,e,t="#ffff00",a=.3){if(!this.ctx)return;const r=e*this.cellSize,o=n*this.cellSize;this.ctx.save(),this.ctx.fillStyle=t,this.ctx.globalAlpha=a,this.ctx.fillRect(r,o,this.cellSize,this.cellSize),this.ctx.restore()}drawTrajectory(n,e="#ff0000",t=.5){if(!(!this.ctx||!n||n.length<2)){this.ctx.save(),this.ctx.strokeStyle=e,this.ctx.globalAlpha=t,this.ctx.lineWidth=3,this.ctx.lineCap="round",this.ctx.lineJoin="round",this.ctx.beginPath();for(let a=0;a<n.length;a++){const[r,o]=n[a],s=o*this.cellSize+this.cellSize/2,l=r*this.cellSize+this.cellSize/2;a===0?this.ctx.moveTo(s,l):this.ctx.lineTo(s,l)}this.ctx.stroke(),this.ctx.restore()}}drawNewGoalIndicator(n,e){if(!this.ctx)return;const t=e*this.cellSize,a=n*this.cellSize,r=t+this.cellSize/2,o=a+this.cellSize/2;this.ctx.save();const s=Date.now()*.005,l=(Math.sin(s)+1)*.3+.2;this.ctx.fillStyle="#ffff00",this.ctx.globalAlpha=l,this.ctx.fillRect(t,a,this.cellSize,this.cellSize),this.ctx.globalAlpha=1,this.ctx.fillStyle="#ff0000",this.ctx.font="12px Arial",this.ctx.textAlign="center",this.ctx.fillText("NEW!",r,o-15),this.ctx.restore()}animateMove(n,e,t,a,r,o=200){return new Promise(s=>{if(!this.ctx){s();return}const l=Date.now(),c=e*this.cellSize+this.cellSize/2,h=n*this.cellSize+this.cellSize/2,d=a*this.cellSize+this.cellSize/2,g=t*this.cellSize+this.cellSize/2,x=()=>{const p=Date.now()-l,m=Math.min(p/o,1),u=1-Math.pow(1-m,3),T=c+(d-c)*u,f=h+(g-h)*u;this.ctx.save(),this.ctx.globalAlpha=.8;const y=this.cellSize*.35;r===$.player?this.ctx.fillStyle=i.visual.colors.player1:r===$.ai_player&&(this.ctx.fillStyle=i.visual.colors.player2),this.ctx.beginPath(),this.ctx.arc(T,f,y,0,2*Math.PI),this.ctx.fill(),this.ctx.restore(),m<1?requestAnimationFrame(x):s()};x()})}getCellFromPixel(n,e){const t=Math.floor(n/this.cellSize),a=Math.floor(e/this.cellSize);return a>=0&&a<i.game.matrixSize&&t>=0&&t<i.game.matrixSize?{row:a,col:t}:null}getPixelFromCell(n,e){return{x:e*this.cellSize+this.cellSize/2,y:n*this.cellSize+this.cellSize/2}}}class Hn{constructor(n){this.container=n,this.renderer=new $n,this.eventHandlers=new Map,this.currentScreen=null,this.gameCanvas=null,this.keyboardHandler=null,this.playerIndex=0,this.gameMode="human-ai",this.lastGameState=null,this.handleResize=null}cleanupCanvas(){this.handleResize&&(window.removeEventListener("resize",this.handleResize),this.handleResize=null),this.gameCanvas=null,this.lastGameState=null}on(n,e){this.eventHandlers.has(n)||this.eventHandlers.set(n,[]),this.eventHandlers.get(n).push(e)}off(n,e){if(this.eventHandlers.has(n)){const t=this.eventHandlers.get(n),a=t.indexOf(e);a>-1&&t.splice(a,1)}}emit(n,e){this.eventHandlers.has(n)&&this.eventHandlers.get(n).forEach(t=>{try{t(e)}catch(a){console.error(`Error in UI event handler for ${n}:`,a)}})}setPlayerInfo(n,e){this.playerIndex=n,this.gameMode=e}showMainScreen(){this.cleanupCanvas(),this.currentScreen="main",this.container.innerHTML=`
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
      `)}updateGameDisplay(n){this.gameCanvas&&n&&(this.lastGameState=n,this.renderer.render(this.gameCanvas,n))}updateGameInfo(n,e,t){var o,s,l;const a=document.getElementById("game-title"),r=document.getElementById("trial-info");if(a){const c=((l=(s=(o=i==null?void 0:i.game)==null?void 0:o.experiments)==null?void 0:s.numTrials)==null?void 0:l[t])||"";a.textContent=c?`Game ${n+1}: Round ${e+1}/${c}`:`Game ${n+1}`}r&&(r.textContent=`Round ${e+1}`)}showGameStatus(n,e="info"){const t=document.getElementById("game-status");if(t){const a={info:"#666",success:"#28a745",warning:"#ffc107",error:"#dc3545"};t.innerHTML=`
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
    `;const t=document.getElementById("retry-connection-btn");t&&e&&t.addEventListener("click",e)}showReconnectingMessage(n){this.showGameStatus(n,"info")}showSuccessMessage(n){this.showGameStatus(n,"success"),setTimeout(()=>{this.showGameStatus("")},3e3)}destroy(){this.keyboardHandler&&document.removeEventListener("keydown",this.keyboardHandler),this.eventHandlers.clear(),this.gameCanvas=null,this.keyboardHandler=null}}const j={gridSize:15,noise:0,gamma:.9,goalReward:30,stepCost:-1,softmaxBeta:3,proximityRewardWeight:.01,coordinationRewardWeight:.02,maxPolicyIterations:15,progressivePolicyBuilding:!0,policyBuildTimeout:10,debugMode:!1,useFastOptimalPolicy:!1,enablePolicyPrecalculation:!1,jointRLImplementation:"bfs"};var kn;try{(kn=i==null?void 0:i.game)!=null&&kn.matrixSize&&(j.gridSize=i.game.matrixSize)}catch{}function ln(P){return P.map(n=>`${n[0]},${n[1]}`).sort().join("|")}function jn(P,n){if(!Array.isArray(P)||P.length===0)return[];if(P.some(s=>!isFinite(s)))return new Array(P.length).fill(1/P.length);const e=Math.max(...P),r=P.map(s=>n*(s-e)).map(s=>Math.max(-700,Math.min(700,s))).map(s=>Math.exp(s)),o=r.reduce((s,l)=>s+l,0)||1;return r.map(s=>s/o)}class Fn{constructor(n,e){this.nx=n,this.ny=e,this.coordinates=[];for(let t=0;t<n;t++)for(let a=0;a<e;a++)this.coordinates.push([t,a]);this.terminals=[],this.obstacles=[],this.features={}}addTerminals(n){this.terminals.push(...n)}addObstacles(n){this.obstacles.push(...n)}addFeatureMap(n,e,t=0){this.features[n]={};for(const a of this.coordinates)this.features[n][a.toString()]=t;for(const a in e)this.features[n][a.toString()]=e[a]}isStateValid([n,e]){return n<0||n>=this.nx||e<0||e>=this.ny?!1:!this.obstacles.some(t=>t[0]===n&&t[1]===e)}reward(n,e,t,a=null){return a?Object.keys(a).reduce((r,o)=>r+this.features[o][t.toString()]*a[o],0):Object.keys(this.features).reduce((r,o)=>r+this.features[o][t.toString()],0)}}function bn(P,n){return[P[0]+n[0],P[1]+n[1]]}class Nn{constructor(n,e,t,a){this.noise=n,this.noiseActionSpace=e,this.terminals=t,this.isStateValid=a}call(n,e){if(this.terminals.some(s=>s[0]===n[0]&&s[1]===n[1]))return{[n.toString()]:1};const t=bn(n,e);if(!this.isStateValid(t))return{[n.toString()]:1};const a=this.noiseActionSpace.map(s=>bn(n,s)).filter(this.isStateValid),r=this.noise/(a.length-1||1),o={};for(const s of a)o[s.toString()]=r;return o[t.toString()]=1-this.noise,o}}class Bn{constructor(n,e=.001,t=100,a=[]){this.gamma=n,this.epsilon=e,this.maxIter=t,this.terminals=a.map(r=>r.toString())}run(n,e,t,a){const r={};for(const o of n)r[o]=this.terminals.includes(o)?0:.1;for(let o=0;o<this.maxIter;o++){const s={...r};for(const c of n)this.terminals.includes(c)||(r[c]=Math.max(...e.map(h=>Object.entries(t[c][h]).reduce((d,[g,x])=>d+x*(a[c][h][g]+this.gamma*s[g]),0))));if(n.filter(c=>!this.terminals.includes(c)).map(c=>Math.abs(r[c]-s[c])).every(c=>c<this.epsilon))break}return r}}class qn{constructor(n,e,t,a,r,o,s){this.gridSize=n,this.actionSpace=e,this.noiseSpace=t,this.noise=a,this.gamma=r,this.goalReward=o,this.softmaxBeta=s}call(n,e){const t=new Fn(this.gridSize,this.gridSize);Array.isArray(n[0])||(n=[n]);const a={};for(const p of n)a[p.toString()]=this.goalReward;t.addFeatureMap("goal",a,0),t.addTerminals(n),t.addObstacles(e);const r=[];for(let p=0;p<t.nx;p++)for(let m=0;m<t.ny;m++){const u=[p,m];t.isStateValid(u)&&r.push(u.toString())}const o=new Nn(this.noise,this.noiseSpace,n,t.isStateValid.bind(t)),s={};for(const p of r){s[p]={};for(const m of this.actionSpace)s[p][m.toString()]=o.call(p.split(",").map(Number),m)}const l=j.stepCost,c={};for(const p of r){c[p]={};for(const m of this.actionSpace){c[p][m.toString()]={};const u=p.split(",").map(Number);for(const T of r){const f=T.split(",").map(Number),y=n.some(G=>G.toString()===T)?l+t.reward(f,m,f):l+t.reward(u,m,u);c[p][m.toString()][T]=y}}}const d=new Bn(this.gamma,.001,100,n).run(r,this.actionSpace.map(p=>p.toString()),s,c);for(const p of n)d[p.toString()]=this.goalReward;const g={};for(const p of r){g[p]={};for(const m of this.actionSpace.map(u=>u.toString()))g[p][m]=Object.entries(s[p][m]).reduce((u,[T,f])=>u+f*(c[p][m][T]+this.gamma*d[T]),0)}const x=new Un(g,this.softmaxBeta);return{Q_dict:g,policy:x}}}class Un{constructor(n,e=1){this.Q=n,this.beta=e}call(n){const e=n.toString(),t=Object.keys(this.Q[e]||{}),a=t.map(o=>this.Q[e][o]),r=jn(a,this.beta);return Object.fromEntries(t.map((o,s)=>[o,r[s]]))}}function On(P){const n=Object.keys(P),e=Object.values(P),t=Math.max(...e),a=n.filter((o,s)=>e[s]===t);return a[Math.floor(Math.random()*a.length)].split(",").map(Number)}const Sn=(()=>{const t=[[0,-1],[0,1],[-1,0],[1,0]],a=(m,u)=>m*15+u,r=m=>Math.floor(m/15),o=m=>m%15,s=(m,u)=>m>=0&&m<15&&u>=0&&u<15;function l(m,u){const T=r(m),f=o(m),[y,G]=t[u],v=T+y,b=f+G;return s(v,b)?a(v,b):m}function c(m,u,T=null){const f=r(m),y=o(m);let G=u[0],v=1/0;for(let M=0;M<u.length;M++){const S=u[M],A=Math.abs(f-S[0])+Math.abs(y-S[1]);let D;if(T!==null){const k=r(T),C=o(T),_=Math.abs(k-S[0])+Math.abs(C-S[1]);D=A+_}else D=A;D<v&&(G=S,v=D)}let b=f,w=y;return f!==G[0]?b+=G[0]<f?-1:1:y!==G[1]&&(w+=G[1]<y?-1:1),a(b,w)}const h=new Map;function d(m,u=1){const T=new Set(m.map(([k,C])=>a(k,C))),f=225*225,y=new Float32Array(f),G=new Float32Array(f*4),v=j.goalReward,b=j.stepCost,w=j.gamma;y.fill(-1e3);for(let k=0;k<f;k++){const C=Math.floor(k/225),_=k%225,H=T.has(C),U=T.has(_);if(H&&U&&C===_){y[k]=0;for(let L=0;L<4;L++)G[k*4+L]=0}}let M,S=0;const A=1e3,D=1e-6;do{M=0,S++;for(let k=0;k<f;k++){const C=Math.floor(k/225),_=k%225,H=T.has(C),U=T.has(_);if(H&&U&&C===_){y[k]=0;for(let F=0;F<4;F++)G[k*4+F]=0;continue}let L=-1/0;for(let F=0;F<4;F++){const O=H?C:l(C,F),W=c(_,m,O),R=T.has(O),Q=T.has(W),nn=R&&Q&&O===W;let K=b;nn?K=v:R&&Q&&O!==W?K=b*.5:(R||Q)&&(K=b*.8);const z=O*225+W,N=K+(nn?0:w*y[z]);G[k*4+F]=N,N>L&&(L=N)}const E=Math.abs(L-y[k]);E>M&&(M=E),y[k]=L}if(S>A){console.warn(`Joint RL VI did not converge after ${A} iters Δ=${M}`);break}}while(M>D);return{Q:G,goalSet:T,beta:u}}function g(m,u,T,f=null){f==null&&(f=j.softmaxBeta);const y=ln(T)+"|"+f;h.has(y)||h.set(y,d(T,f));const{Q:G,goalSet:v}=h.get(y),b=(R,Q)=>R*15+Q,w=b(m[0],m[1]),M=b(u[0],u[1]),S=v.has(w),A=v.has(M);if(S&&A&&w===M)return null;const C=(w*225+M)*4,_=[G[C],G[C+1],G[C+2],G[C+3]];if(_.some(R=>!isFinite(R)))return t[Math.floor(Math.random()*t.length)];if(f>10){const R=Math.max(..._),Q=_.map((nn,K)=>({q:nn,i:K})).filter(nn=>nn.q===R);return t[Q[Math.floor(Math.random()*Q.length)].i]}const H=Math.max(..._),L=_.map(R=>f*(R-H)).map(R=>Math.max(-700,Math.min(700,R))).map(R=>Math.exp(R)),E=L.reduce((R,Q)=>R+Q,0);if(!isFinite(E)||E===0){const R=_.indexOf(H);return t[R]}const F=Math.random()*E;let O=0;for(let R=0;R<L.length;R++)if(O+=L[R],F<O)return t[R];const W=_.indexOf(H);return t[W]}function x(m){const u=j.softmaxBeta,T=ln(m)+"|"+u;h.has(T)||h.set(T,d(m,u))}function p(){h.clear()}return{getAction:g,precalc:x,clear:p}})(),wn=(()=>{const P=j.gridSize||15,n=j.gridSize||15,e=P*n,t=[[0,-1],[0,1],[-1,0],[1,0]],a=(p,m)=>p*n+m,r=p=>Math.floor(p/n),o=p=>p%n,s=(p,m)=>p>=0&&p<P&&m>=0&&m<n,l=(p,m)=>{const u=r(p),T=o(p),f=u+t[m][0],y=T+t[m][1];return s(f,y)?a(f,y):p},c=new Map;function h(p,m=1){const u=new Set(p.map(([S,A])=>a(S,A))),T=e*e,f=new Float32Array(T*16),y=j.goalReward,G=j.stepCost,v=j.gamma,b=new Array(e);for(let S=0;S<e;S++){b[S]=new Array(p.length);const A=Math.floor(S/n),D=S%n;for(let k=0;k<p.length;k++){const[C,_]=p[k];b[S][k]=Math.abs(A-C)+Math.abs(D-_)}}const w=new Map;function M(S,A,D){if(D)return 0;const k=S<=A?`${S}-${A}`:`${A}-${S}`;if(w.has(k))return w.get(k);let C=1/0;for(let H=0;H<p.length;H++){const U=b[S][H]+b[A][H];U<C&&(C=U)}const _=-j.proximityRewardWeight*C;return w.set(k,_),_}for(let S=0;S<T;S++){const A=Math.floor(S/e),D=S%e;if(u.has(A)&&u.has(D)&&A===D){for(let k=0;k<16;k++)f[S*16+k]=0;continue}for(let k=0;k<4;k++){const C=u.has(A)?A:l(A,k);for(let _=0;_<4;_++){const H=u.has(D)?D:l(D,_),U=k*4+_,J=u.has(C)&&u.has(H)&&C===H,L=M(C,H,J),E=J?y:G+L;let F=0;if(!J){let O=1/0;for(let W=0;W<p.length;W++){const R=b[C][W]+b[H][W];R<O&&(O=R)}F=v*(y+G*O)}f[S*16+U]=E+F}}}return{Q:f,goalSet:u,beta:m}}function d(p,m,u,T=null){T==null&&(T=j.softmaxBeta);const f=ln(u)+"|"+T;c.has(f)||c.set(f,h(u,T));const{Q:y,goalSet:G}=c.get(f),v=a(p[0],p[1]),b=a(m[0],m[1]);if(G.has(v)&&G.has(b)&&v===b)return null;const M=(v*e+b)*16,S=[y[M],y[M+1],y[M+2],y[M+3],y[M+4],y[M+5],y[M+6],y[M+7],y[M+8],y[M+9],y[M+10],y[M+11],y[M+12],y[M+13],y[M+14],y[M+15]],A=G.has(b),D=G.has(v);if(A&&!D)for(let E=0;E<16;E++)Math.floor(E/4)<4&&(S[E]*=.5);if(S.some(E=>!isFinite(E)))return t[Math.floor(Math.random()*t.length)];const k=Math.max(...S),H=S.map(E=>T*(E-k)).map(E=>Math.max(-700,Math.min(700,E))).map(E=>Math.exp(E)),U=H.reduce((E,F)=>E+F,0);if(!isFinite(U)||U===0)return t[Math.floor(Math.random()*t.length)];const J=Math.random()*U;let L=0;for(let E=0;E<16;E++)if(L+=H[E],J<L){const F=Math.floor(E/4);return t[F]}return t[0]}function g(p){const m=j.softmaxBeta,u=ln(p)+"|"+m;c.has(u)||c.set(u,h(p,m))}function x(){c.clear()}return{getAction:d,precalc:g,clear:x}})();class Mn{constructor(){this.isPreCalculating=!1}getAIAction(n,e,t,a=null){if(!t||t.length===0)return[0,0];try{if(a&&i.game.agent.type==="joint"){const o=(j.jointRLImplementation||"vi4").toLowerCase()==="bfs"?wn.getAction(e,a,t,j.softmaxBeta):Sn.getAction(e,a,t,j.softmaxBeta);return o===null?[0,0]:o}return this.getIndividualRLAction(e,t)}catch(r){return console.error("Error in RL agent:",r),[0,0]}}getIndividualRLAction(n,e){const t=[[0,-1],[0,1],[-1,0],[1,0]],a=[...t],r=[],o=new qn(j.gridSize,t,a,j.noise,j.gamma,j.goalReward,j.softmaxBeta),{policy:s}=o.call(e,r),l=s.call(n);return On(l)}precalculatePolicyForGoals(n,e){this.isPreCalculating||(this.isPreCalculating=!0,setTimeout(()=>{try{(j.jointRLImplementation||"vi4").toLowerCase()==="bfs"?wn.precalc(n):Sn.precalc(n)}finally{this.isPreCalculating=!1}},0))}enableAutoPolicyPrecalculation(){}resetNewGoalPreCalculationFlag(){}}class cn{constructor(){this.baseUrl=i.server.url||""}static guidanceFor(n){switch(n){case"2P2G":return"You will collaborate  with another player. Each round, you can win if both of you go to the same restaurant. You lose the round if you end up at different restaurants. For each round that you win, you earn an additional 10 points.";case"2P3G":return"You will collaborate  with another player. Each round, you can win if both of you go to the same restaurant. You lose the round if you end up at different restaurants. Note that some restaurants are already open when the round starts. Others may appear later. For each round that you win, you earn an additional 10 points.";case"1P2G":return"Single player: reach any open goal.";case"1P1G":return"Single player: reach the goal.";default:return"Choose the best single step to reach a valid goal."}}static buildRelativeInfo(n,e="player2"){const t=n[e],a=n.currentGoals||[];if(!t||a.length===0)return null;let r=null,o=1/0;for(const l of a){const c=Math.abs(l[0]-t[0])+Math.abs(l[1]-t[1]);c<o&&(o=c,r=l)}const s=r?{dRow:r[0]-t[0],dCol:r[1]-t[1]}:null;return{nearestGoal:r,manhattanDistance:o,deltaToNearest:s}}async getNextAction(n,e={}){var T,f,y,G,v,b,w,M;const t=n.experimentType,a=e.guidance||cn.guidanceFor(t),o=(Number(e.aiPlayerNumber)===1?1:2)===1?"player1":"player2",s=((f=(T=i==null?void 0:i.game)==null?void 0:T.agent)==null?void 0:f.gpt)||{},l=n.trialData||null,c=Math.max(0,Number((y=s==null?void 0:s.memory)==null?void 0:y.maxSteps)||0),h=Array.isArray(l==null?void 0:l.player1Trajectory)?l.player1Trajectory:[],d=Array.isArray(l==null?void 0:l.player2Trajectory)?l.player2Trajectory:[],g=S=>c>0?S.slice(-c):S,x={guidance:a,matrix:n.gridMatrix,currentPlayer:{label:o,pos:n[o]},goals:n.currentGoals,relativeInfo:cn.buildRelativeInfo(n,o),model:e.model||s.model||void 0,temperature:typeof e.temperature=="number"?e.temperature:typeof s.temperature=="number"?s.temperature:void 0,memory:{enabled:!!((G=s==null?void 0:s.memory)!=null&&G.enabled),maxSteps:c,trajectories:(v=s==null?void 0:s.memory)!=null&&v.enabled?{player1:g(h),player2:g(d)}:void 0}},p=`${this.baseUrl.replace(/\/$/,"")}/api/ai/gpt/action`,m=await fetch(p,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(x)});if(!m.ok){const S=await m.text();throw new Error(`GPT action request failed: ${m.status} ${S}`)}const u=await m.json();try{const S=u&&(u.model||u.modelUsed);if(S){const A=(M=(w=(b=i==null?void 0:i.game)==null?void 0:b.agent)==null?void 0:w.gpt)==null?void 0:M.model;(!A||String(A).trim()!==String(S).trim())&&(i.game.agent.gpt.model=String(S).trim())}}catch{}return u&&Object.prototype.hasOwnProperty.call(u,"inferredGoal")?{action:(u==null?void 0:u.action)||null,inferredGoal:(u==null?void 0:u.inferredGoal)??null,model:u==null?void 0:u.model}:(u==null?void 0:u.action)||null}}class sn{static generateRandomizedDistanceSequence(n){const e=[this.DISTANCE_CONDITIONS.CLOSER_TO_PLAYER2,this.DISTANCE_CONDITIONS.CLOSER_TO_PLAYER1,this.DISTANCE_CONDITIONS.EQUAL_TO_BOTH,this.DISTANCE_CONDITIONS.NO_NEW_GOAL],t=e.length,a=Math.floor(n/t),r=n%t,o=[];for(let s=0;s<t;s++)for(let l=0;l<a;l++)o.push(e[s]);for(let s=0;s<r;s++){const l=e[Math.floor(Math.random()*t)];o.push(l)}for(let s=o.length-1;s>0;s--){const l=Math.floor(Math.random()*(s+1));[o[s],o[l]]=[o[l],o[s]]}return o}static generateNewGoal1P2G(n,e,t,a){var f,y,G,v,b,w,M;if(!n||!e)return null;const r=i.oneP2G;if(!r||a===((f=r==null?void 0:r.distanceConditions)==null?void 0:f.NO_NEW_GOAL))return null;const o=I.calculateGridDistance(n,e),s=i.game.matrixSize,l=(y=r.goalConstraints)==null?void 0:y.minDistanceFromHuman,c=(G=r.goalConstraints)==null?void 0:G.maxDistanceFromHuman,h=(v=r.goalConstraints)==null?void 0:v.minDistanceBetweenGoals,d=(b=r.distanceConstraint)==null?void 0:b.closerThreshold,g=(w=r.distanceConstraint)==null?void 0:w.fartherThreshold,x=!!((M=r.distanceConstraint)!=null&&M.allowEqualDistance),p=(S,A)=>{if(Array.isArray(t)){for(const D of t)if(D[0]===S&&D[1]===A)return!0}return n[0]===S&&n[1]===A},m=S=>{var A,D,k;switch(a){case((A=r.distanceConditions)==null?void 0:A.CLOSER_TO_PLAYER1):return S<=o-d;case((D=r.distanceConditions)==null?void 0:D.FARTHER_TO_PLAYER1):return S>=o+g;case((k=r.distanceConditions)==null?void 0:k.EQUAL_TO_PLAYER1):return x;default:return!1}},u=[];for(let S=0;S<s;S++)for(let A=0;A<s;A++){if(p(S,A))continue;const D=[S,A],k=I.calculateGridDistance(n,D);k<l||k>c||I.calculateGridDistance(e,D)<h||m(k)&&u.push(D)}if(u.length===0)for(let S=0;S<s;S++)for(let A=0;A<s;A++){if(p(S,A))continue;const D=[S,A],k=I.calculateGridDistance(n,D);k>=1&&k<=Math.max(10,c)&&u.push(D)}if(u.length===0)return null;const T=u[Math.floor(Math.random()*u.length)];return{position:T,conditionType:a,distanceToPlayer1:I.calculateGridDistance(n,T)}}static checkNewGoalPresentation1P2G(n,e,t){if(!n||!e||!n.currentGoals||n.currentGoals.length!==2||e.newGoalPresented)return null;const a=e.player1CurrentGoal;if((Array.isArray(a)&&a.length>0?a[a.length-1]:null)===null)return null;const o=n.currentGoals[0],s=this.generateNewGoal1P2G(n.player1,o,n.currentGoals,t);return s?{position:s.position,conditionType:s.conditionType,distanceToPlayer1:s.distanceToPlayer1}:null}static generateNewGoal(n,e,t,a,r){if(r===this.DISTANCE_CONDITIONS.NO_NEW_GOAL||a===null||a>=t.length)return null;const o=t[a],s=I.calculateGridDistance(e,o),l=I.calculateGridDistance(n,o),c=s+l,h=[],d=i.game.matrixSize,g=i&&i.twoP3G&&i.twoP3G.goalConstraints||{},x=Number.isFinite(g.minDistanceFromHuman)?g.minDistanceFromHuman:1,p=Number.isFinite(g.maxDistanceFromHuman)?g.maxDistanceFromHuman:1/0;for(let u=0;u<d;u++)for(let T=0;T<d;T++){const f=[u,T];if(this.isPositionOccupied(f,t,e,n))continue;const y=I.calculateGridDistance(e,f),G=I.calculateGridDistance(n,f),v=y+G;y<x||y>p||G<x||G>p||this.meetsDistanceCondition(r,y,G,s,l,v,c)&&h.push({position:f,conditionType:r,distanceToPlayer1:y,distanceToPlayer2:G,distanceSum:v})}if(h.length>0)return h[Math.floor(Math.random()*h.length)];const m=this.findRelaxedValidPositions(e,n,t,r);return m.length>0?m[Math.floor(Math.random()*m.length)]:null}static isPositionOccupied(n,e,t,a){const[r,o]=n;for(const s of e)if(s[0]===r&&s[1]===o)return!0;return t[0]===r&&t[1]===o||a[0]===r&&a[1]===o}static meetsDistanceCondition(n,e,t,a,r,o,s){const l=i&&i.twoP3G&&i.twoP3G.distanceConstraint||{},c=i&&i.twoP3G&&i.twoP3G.goalConstraints||{},h=Number.isFinite(l.closerThreshold)?l.closerThreshold:1,d=!!l.allowEqualDistance,g=Number.isFinite(l.maxDistanceIncrease)?l.maxDistanceIncrease:0,p=!!c.maintainDistanceSum?o===s:o<=s+g;switch(n){case this.DISTANCE_CONDITIONS.CLOSER_TO_PLAYER2:return(d?t<=r-h:t<r-h)&&p;case this.DISTANCE_CONDITIONS.CLOSER_TO_PLAYER1:return(d?e<=a-h:e<a-h)&&p;case this.DISTANCE_CONDITIONS.EQUAL_TO_BOTH:{const m=Math.abs(e-a),u=Math.abs(t-r),T=Math.abs(t-e),f=d?1:0,y=d?1:0;return m<=f&&u<=f&&T<=f&&Math.abs(o-s)<=y}default:return!1}}static findRelaxedValidPositions(n,e,t,a){const r=[],o=i.game.matrixSize,s=i&&i.twoP3G&&i.twoP3G.distanceConstraint||{},l=i&&i.twoP3G&&i.twoP3G.goalConstraints||{},c=Number.isFinite(l.minDistanceFromHuman)?l.minDistanceFromHuman:2,h=Number.isFinite(l.maxDistanceFromHuman)?l.maxDistanceFromHuman:Number.isFinite(s.maxDistanceIncrease)?Math.max(10,2+s.maxDistanceIncrease):10;for(let d=0;d<o;d++)for(let g=0;g<o;g++){const x=[d,g];if(!this.isPositionOccupied(x,t,n,e)){const p=I.calculateGridDistance(n,x),m=I.calculateGridDistance(e,x);p>=c&&p<=h&&m>=c&&m<=h&&r.push({position:x,conditionType:a,distanceToPlayer1:p,distanceToPlayer2:m,distanceSum:p+m})}}return r}static checkNewGoalPresentation2P3G(n,e,t){const{player1:a,player2:r,currentGoals:o}=n;if(!a||!r||!o||o.length<2||e.newGoalPresented)return null;const s=this.getPlayerCurrentGoal(e.player1CurrentGoal),l=this.getPlayerCurrentGoal(e.player2CurrentGoal);if(s!==null&&l!==null&&s===l){console.log("=== SHARED GOAL DETECTED ==="),console.log("Player1 goal:",s,"Player2 goal:",l);const c=this.generateNewGoal(r,a,o,s,t);if(c)return console.log("=== NEW GOAL GENERATED ==="),console.log("New goal position:",c.position),console.log("Distance condition:",t),{position:c.position,conditionType:c.conditionType,distanceToPlayer1:c.distanceToPlayer1,distanceToPlayer2:c.distanceToPlayer2}}return null}static getPlayerCurrentGoal(n){return!n||n.length===0?null:n[n.length-1]}}fn(sn,"DISTANCE_CONDITIONS",{CLOSER_TO_PLAYER2:"closer_to_player2",CLOSER_TO_PLAYER1:"closer_to_player1",EQUAL_TO_BOTH:"equal_to_both",NO_NEW_GOAL:"no_new_goal"});const Vn=`var MapsFor1P1G = {
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
};`,Wn=`var MapsFor1P2G = {
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
};`,Yn=`var MapsFor2P2G = {
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
};`,Qn=`var MapsFor2P3G = {
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
};`,Kn={"1P1G":Vn,"1P2G":Wn,"2P2G":Yn,"2P3G":Qn};class Xn{constructor(){this.mapData=null,this.initialize()}async initialize(){this.mapData=await this.loadMapData()}async loadMapData(){console.log("🗺️ Loading bundled map data...");const n={};for(const[e,t]of Object.entries(Kn))try{n[e]=this.parseBundledMapFile(e,t),console.log(`✅ Loaded ${Object.keys(n[e]).length} ${e} maps from bundled config`)}catch(a){console.warn(`⚠️ Failed to load bundled ${e} maps, using fallback:`,a.message),n[e]=this.getFallbackMaps(e)}for(const[e,t]of Object.entries(n)){const a=t?Object.keys(t).length:0;console.log(`🗺️ ${e}: ${a} maps loaded`)}return n}parseBundledMapFile(n,e){const t=`MapsFor${n}`,a=new RegExp(`var\\s+${t}\\s*=\\s*({[\\s\\S]*?});`),r=e.match(a);if(!r)throw new Error(`Could not find ${t} declaration`);return JSON.parse(r[1])}generate1P1GMaps(){console.log("🔧 Generating fallback 1P1G maps...");const n={};for(let e=0;e<20;e++){const a=1+e%3,r=2+Math.floor(e/4),o=10+e%5;n[String(e)]=[{initPlayerGrid:[7,a],target1:[r,o],mapType:"1P1G"}]}return console.log(`✅ Generated ${Object.keys(n).length} fallback 1P1G maps`),n}generate1P2GMaps(){const n={};for(let e=0;e<20;e++)n[String(e)]=[{initPlayerGrid:[7,1],target1:[3,7],target2:[11,7],mapType:"1P2G"}];return n}generate2P2GMaps(){const n={},e=[{player1:[7,2],player2:[7,14],goal1:[1,8],goal2:[14,8]},{player1:[2,7],player2:[14,7],goal1:[8,1],goal2:[8,13]},{player1:[7,1],player2:[7,13],goal1:[3,7],goal2:[11,7]},{player1:[1,7],player2:[13,7],goal1:[7,3],goal2:[7,11]},{player1:[3,3],player2:[11,11],goal1:[3,11],goal2:[11,3]},{player1:[5,2],player2:[9,12],goal1:[2,7],goal2:[12,7]},{player1:[2,5],player2:[12,9],goal1:[7,2],goal2:[7,12]},{player1:[6,1],player2:[8,13],goal1:[1,6],goal2:[13,8]}];for(let t=0;t<99;t++){const a=e[t%e.length];n[String(297+t)]=[{initPlayerGrid:a.player1,initAIGrid:a.player2,target1:a.goal1,target2:a.goal2,mapType:"2P2G"}]}return n}generate2P3GMaps(){const n={},e=[{player1:[7,2],player2:[7,14],goal1:[1,8],goal2:[14,8]},{player1:[2,7],player2:[14,7],goal1:[8,1],goal2:[8,13]},{player1:[7,1],player2:[7,13],goal1:[3,7],goal2:[11,7]},{player1:[1,7],player2:[13,7],goal1:[7,3],goal2:[7,11]},{player1:[3,3],player2:[11,11],goal1:[3,11],goal2:[11,3]},{player1:[5,2],player2:[9,12],goal1:[2,7],goal2:[12,7]},{player1:[2,5],player2:[12,9],goal1:[7,2],goal2:[7,12]},{player1:[6,1],player2:[8,13],goal1:[1,6],goal2:[13,8]}];for(let t=0;t<99;t++){const a=e[t%e.length];n[String(397+t)]=[{initPlayerGrid:a.player1,initAIGrid:a.player2,target1:a.goal1,target2:a.goal2,mapType:"2P3G"}]}return n}getMapsForExperiment(n){if(console.log(`🎯 Getting maps for experiment: ${n}`),!this.mapData)return console.warn("⚠️ Map data not loaded yet, using fallback"),this.getFallbackMaps(n);const e=this.mapData[n];return e?(console.log(`✅ Found ${Object.keys(e).length} maps for ${n}`),e):(console.error(`❌ No map data available for experiment type: ${n}`),this.getFallbackMaps(n))}getFallbackMaps(n){switch(n){case"1P1G":return this.generate1P1GMaps();case"1P2G":return this.generate1P2GMaps();case"2P2G":return this.generate2P2GMaps();case"2P3G":return this.generate2P3GMaps();default:return console.error(`Unknown experiment type: ${n}`),{}}}selectRandomMaps(n,e){if(!n||typeof n!="object")return console.error("Invalid map data provided:",n),[];const t=Object.keys(n);if(t.length===0)return console.error("No keys found in map data"),[];const a=[];for(let r=0;r<e;r++){const o=t[Math.floor(Math.random()*t.length)],s=n[o];Array.isArray(s)&&s.length>0&&a.push({...s[0]})}return console.log(`Selected ${a.length} random maps from ${t.length} available maps`),a}getRandomMapForCollaborationGame(n,e){if(e>=i.game.successThreshold.randomSamplingAfterTrial){const t=this.getMapsForExperiment(n);if(console.log(`Getting random map for ${n} trial ${e+1}, mapData:`,t),!t||Object.keys(t).length===0)return console.error(`No map data available for ${n}`),this.createFallbackDesign(n);try{const a=Object.keys(t);if(a.length===0)return this.createFallbackDesign(n);const r=Number(window.__SESSION_SEED__||0);let o=2166136261;const s=`${n}|${e}|${r}`;for(let d=0;d<s.length;d++)o^=s.charCodeAt(d),o=Math.imul(o,16777619);const l=Math.abs(o)%a.length,c=a[l],h=t[c];if(Array.isArray(h)&&h.length>0)return{...h[0]}}catch{const r=this.selectRandomMaps(t,1);if(r.length>0)return r[0]}return console.error(`No selectable maps for ${n}`),this.createFallbackDesign(n)}else return console.log(`Using timeline map data for ${n} trial ${e}`),null}createFallbackDesign(n){const e={"1P1G":{initPlayerGrid:[7,1],target1:[7,7],mapType:"1P1G"},"1P2G":{initPlayerGrid:[7,1],target1:[3,7],target2:[11,7],mapType:"1P2G"},"2P2G":{initPlayerGrid:[7,2],initAIGrid:[7,14],target1:[1,8],target2:[14,8],mapType:"2P2G"},"2P3G":{initPlayerGrid:[7,2],initAIGrid:[7,14],target1:[1,8],target2:[14,8],mapType:"2P3G"}};return e[n]||e["1P1G"]}async checkServerHealth(){try{return(await fetch("/health",{method:"GET",timeout:2e3})).ok}catch{return!1}}loadAllFallbackMaps(){return console.log("🔧 Loading all fallback maps..."),{"1P1G":this.getFallbackMaps("1P1G"),"1P2G":this.getFallbackMaps("1P2G"),"2P2G":this.getFallbackMaps("2P2G"),"2P3G":this.getFallbackMaps("2P3G")}}}const Jn=new Xn;class Zn{constructor(n,e,t=null){var a;this.gameStateManager=n,this.uiManager=e,this.timelineManager=t,this.rlAgent=new Mn,this.gptClient=new cn,this.currentExperimentSequence=[],this.currentExperimentIndex=0,this.currentTrialIndex=0,this.isRunning=!1,this.gameLoopInterval=null,this.aiMoveInterval=null,this.newGoalIntervalId=null,this.aiPlayerNumber=2,this.mapLoader=Jn;try{(a=i==null?void 0:i.debug)!=null&&a.disableConsoleLogs||console.log("🗺️ ExperimentManager initialized with MapLoader")}catch{}this.ensureMapDataLoaded(),this.setupTimelineIntegration()}activateAIFallback(n=(t=>(t=i==null?void 0:i.multiplayer)==null?void 0:t.fallbackAIType)()||"rl_joint",e=2){var a,r,o,s,l,c,h,d,g,x,p,m,u,T,f;try{try{(a=i==null?void 0:i.debug)!=null&&a.disableConsoleLogs||console.log(`[DEBUG] activateAIFallback called - fallbackType: ${n}, aiPlayerNumber: ${e}`)}catch{}this.aiPlayerNumber=e===1?1:2;const y=this.aiPlayerNumber===1?2:1;q.setPlayerType(this.aiPlayerNumber,n),q.setPlayerType(y,"human");try{(r=i==null?void 0:i.debug)!=null&&r.disableConsoleLogs||console.log(`[DEBUG] After setPlayerType - Player1: ${i.game.players.player1.type}, Player2: ${i.game.players.player2.type}`)}catch{}this.rlAgent||(this.rlAgent=new Mn);try{const G=(o=this.gameStateManager)==null?void 0:o.trialData;if(G){if(n==="gpt"){const v=(c=(l=(s=i==null?void 0:i.game)==null?void 0:s.agent)==null?void 0:l.gpt)==null?void 0:c.model;G.partnerAgentType=v&&String(v).trim()?v:"gpt",(!v||!String(v).trim())&&((h=this.logCurrentAIModel)==null||h.call(this))}else n==="rl_joint"?G.partnerAgentType="joint-rl":n==="rl_individual"?G.partnerAgentType="individual-rl":G.partnerAgentType=String(n);G.humanPlayerIndex=y-1,G.aiPlayerIndex=this.aiPlayerNumber-1}}catch{}if((g=(d=i==null?void 0:i.game)==null?void 0:d.agent)!=null&&g.synchronizedMoves){console.log("🤖 AI fallback activated (synchronized moves)");try{(x=i==null?void 0:i.debug)!=null&&x.disableConsoleLogs||console.log("[DEBUG] Setting up independent AI movement after human goal")}catch{}this.setupIndependentAIAfterHumanGoal()}try{const G=(m=(p=this.gameStateManager)==null?void 0:p.currentState)==null?void 0:m.experimentType;if(G==="2P3G"){try{(u=i==null?void 0:i.debug)!=null&&u.disableConsoleLogs||console.log("[DEBUG] Restarting new goal checking for 2P3G after AI fallback")}catch{}this.setupNewGoalCheck2P3G()}else if(G==="1P2G"){try{(T=i==null?void 0:i.debug)!=null&&T.disableConsoleLogs||console.log("[DEBUG] Restarting new goal checking for 1P2G after AI fallback")}catch{}this.setupNewGoalCheck1P2G()}}catch(G){console.warn("Failed to restart new goal checking after fallback:",(G==null?void 0:G.message)||G)}(f=this.logCurrentAIModel)==null||f.call(this)}catch(y){console.warn("Failed to activate AI fallback:",(y==null?void 0:y.message)||y)}}async startExperiment(n){await this.startExperimentSequence([n])}async startExperimentSequence(n){this.currentExperimentSequence=n||i.game.experiments.order,this.currentExperimentIndex=0,this.isRunning=!0,console.log("Starting experiment sequence:",this.currentExperimentSequence),await this.startNextExperiment()}async startNextExperiment(){if(this.currentExperimentIndex>=this.currentExperimentSequence.length){this.completeAllExperiments();return}const n=this.currentExperimentSequence[this.currentExperimentIndex];console.log(`Starting experiment ${this.currentExperimentIndex+1}/${this.currentExperimentSequence.length}: ${n}`),this.currentTrialIndex=0,await this.showExperimentIntroduction(n),await this.startNextTrial(n)}async showExperimentIntroduction(n){return Promise.resolve()}async startNextTrial(n){var a,r,o,s,l,c;if(!n){console.error("startNextTrial called with undefined experimentType"),this.completeAllExperiments();return}const e=i.game.experiments.numTrials[n]||12;if(this.shouldEndExperimentEarly(n)){console.log(`Experiment ${n} ended early due to success threshold`),this.currentExperimentIndex++,await this.startNextExperiment();return}if(this.currentTrialIndex>=e){console.log(`Completed all trials for ${n}`),this.currentExperimentIndex++,await this.startNextExperiment();return}console.log(`Starting trial ${this.currentTrialIndex+1}/${e} for ${n}`);let t=await this.getTrialDesign(n,this.currentTrialIndex);t||(console.error("Failed to get trial design, using fallback"),t=I.createFallbackDesign(n));try{const h=(o=(r=(a=i==null?void 0:i.game)==null?void 0:a.players)==null?void 0:r.player1)==null?void 0:o.type,d=(c=(l=(s=i==null?void 0:i.game)==null?void 0:s.players)==null?void 0:l.player2)==null?void 0:c.type;String(n||"").includes("2P")&&(h==="gpt"||d==="gpt")&&await this.logCurrentAIModel()}catch{}this.gameStateManager.initializeTrial(this.currentTrialIndex,n,t),this.uiManager.updateGameInfo(this.currentExperimentIndex,this.currentTrialIndex,n),this.uiManager.updateGameDisplay(this.gameStateManager.getCurrentState()),this.startTrialExecution(n)}startTrialExecution(n){switch(this.clearGameIntervals(),n){case"1P1G":this.runTrial1P1G();break;case"1P2G":this.runTrial1P2G();break;case"2P2G":this.runTrial2P2G();break;case"2P3G":this.runTrial2P3G();break;default:console.error("Unknown experiment type:",n)}this.setupGameTimeout()}runTrial1P1G(){}runTrial1P2G(){this.setupNewGoalCheck1P2G()}runTrial2P2G(){const n=i.game.players.player1.type,e=i.game.players.player2.type;e!=="human"||n!=="human"?(this.aiPlayerNumber=e!=="human"?2:1,this.logCurrentAIModel(),console.log("2P2G: Synchronized human-AI moves enabled"),this.setupIndependentAIAfterHumanGoal()):console.log("2P2G: Human-human mode - waiting for network player actions")}runTrial2P3G(){const n=i.game.players.player1.type,e=i.game.players.player2.type;e!=="human"||n!=="human"?(this.aiPlayerNumber=e!=="human"?2:1,this.logCurrentAIModel(),console.log("2P3G: Synchronized human-AI moves enabled"),this.setupIndependentAIAfterHumanGoal()):console.log("2P3G: Human-human mode - waiting for network player actions"),this.setupNewGoalCheck2P3G()}async logCurrentAIModel(){var n,e,t,a,r,o,s,l,c,h,d,g;try{const x=(t=(e=(n=i==null?void 0:i.game)==null?void 0:n.players)==null?void 0:e.player2)==null?void 0:t.type;if(x==="gpt"){const p=(i.server.url||"").replace(/\/$/,""),m=await fetch(`${p}/api/ai/gpt/config`);if(m.ok){const u=await m.json(),T=(u==null?void 0:u.model)||"(unknown)";try{if(T&&T!=="(unknown)"){const f=(o=(r=(a=i==null?void 0:i.game)==null?void 0:a.agent)==null?void 0:r.gpt)==null?void 0:o.model;(!f||!/^gpt-?tom$/i.test(String(f)))&&(i.game.agent.gpt.model=T);const y=(s=this.gameStateManager)==null?void 0:s.trialData,G=(l=this.gameStateManager)==null?void 0:l.currentState;if(y&&G&&String(G.experimentType||"").includes("2P")&&(y.partnerAgentType=T,y.partnerFallbackOccurred)){(!y.partnerFallbackAIType||/^gpt$/i.test(String(y.partnerFallbackAIType)))&&(y.partnerFallbackAIType=T);try{const v=(c=this.gameStateManager)==null?void 0:c.experimentData,b=Number.isInteger(G.trialIndex)?G.trialIndex:null;v&&Array.isArray(v.fallbackEvents)&&v.fallbackEvents.forEach(w=>{(b!==null?w.trialIndex===b:!0)&&(!w.aiType||/^gpt$/i.test(String(w.aiType)))&&(w.aiType=T)})}catch{}}try{const v=(h=this.gameStateManager)==null?void 0:h.experimentData;v&&Array.isArray(v.allTrialsData)&&v.allTrialsData.forEach(b=>{b&&b.partnerFallbackOccurred&&(!b.partnerFallbackAIType||/^gpt$/i.test(String(b.partnerFallbackAIType)))&&(b.partnerFallbackAIType=T),b&&String(b.partnerAgentType||"").toLowerCase()==="gpt"&&(b.partnerAgentType=T)}),v&&Array.isArray(v.fallbackEvents)&&v.fallbackEvents.forEach(b=>{b&&(!b.aiType||/^gpt$/i.test(String(b.aiType)))&&(b.aiType=T)})}catch{}}}catch{}}}else if(x==="rl_joint"||x==="rl_individual"||x==="ai"){const p=((g=(d=i==null?void 0:i.game)==null?void 0:d.agent)==null?void 0:g.type)||(x==="rl_joint"?"joint":"individual");console.log(`🤖 AI partner: RL mode = ${p}`)}}catch(x){console.log("🤖 AI partner: failed to log model info:",(x==null?void 0:x.message)||x)}}setupIndependentAIAfterHumanGoal(){let n=!1;const e=setInterval(()=>{const t=this.gameStateManager.getCurrentState();if(!t.player1||!t.player2)return;const r=(this.aiPlayerNumber===1?2:1)===1?t.player1:t.player2,o=I.isGoalReached(r,t.currentGoals);!n&&o&&(n=!0,this.startIndependentAIMovement())},100);this.gameLoopInterval=e}async handleSynchronizedMove(n){const e=i.game.players.player1.type,t=i.game.players.player2.type;if(e==="human"&&t==="human")return;const a=this.gameStateManager.getCurrentState();if(!a.player1||!a.player2)return;const r=this.aiPlayerNumber===1?2:1;let o=null;const s=a.experimentType==="2P2G"||a.experimentType==="2P3G";let l=null;if((this.aiPlayerNumber===1?i.game.players.player1.type:i.game.players.player2.type)==="gpt"&&s)try{o=await this.gptClient.getNextAction({...a,trialData:this.gameStateManager.getCurrentTrialData()},{aiPlayerNumber:this.aiPlayerNumber}),o&&typeof o=="object"&&(Object.prototype.hasOwnProperty.call(o,"inferredGoal")&&this.gameStateManager.recordAIInferredOtherGoal(o.inferredGoal??null),o=(o==null?void 0:o.action)||null)}catch(d){l=d,console.warn("GPT agent request failed during synchronized move; falling back to RL:",(d==null?void 0:d.message)||d)}if(!o){if(!this.rlAgent)return;const d=this.rlAgent.getAIAction(a.gridMatrix,this.aiPlayerNumber===1?a.player1:a.player2,a.currentGoals,this.aiPlayerNumber===1?a.player2:a.player1);o=this.actionToDirection(d),l&&this.gameStateManager.recordGptErrorEvent({phase:"synchronized",error:(l==null?void 0:l.message)||String(l),humanDirection:n,fallback:"rl",fallbackDirection:o})}let h;r===1?h=this.gameStateManager.processSynchronizedMoves(n,o):h=this.gameStateManager.processSynchronizedMovesMapped(2,n,o),this.uiManager.updateGameDisplay(this.gameStateManager.getCurrentState());try{const d=this.gameStateManager.getCurrentState(),g=r===1?d.player1:d.player2,x=this.aiPlayerNumber===1?d.player1:d.player2,p=I.isGoalReached(g,d.currentGoals),m=I.isGoalReached(x,d.currentGoals);p&&!m&&!this.aiMoveInterval&&this.startIndependentAIMovement()}catch{}h!=null&&h.trialComplete&&this.handleTrialComplete(h)}setupAIMovement(){const n=i.game.agent.delay;let e=!1;this.uiManager.on("player-move",()=>{const a=this.gameStateManager.getCurrentState();a.player2&&(I.isGoalReached(a.player2,a.currentGoals)||setTimeout(()=>{this.makeAIMove()},n))});const t=setInterval(()=>{const a=this.gameStateManager.getCurrentState();if(!a.player1||!a.player2)return;const r=I.isGoalReached(a.player1,a.currentGoals);!e&&r&&(e=!0,this.startIndependentAIMovement())},100);this.gameLoopInterval=t}async makeAIMove(){var s,l,c,h,d;const n=this.gameStateManager.getCurrentState(),e=this.aiPlayerNumber===1?n.player1:n.player2;if(!e||!n.currentGoals||I.isGoalReached(e,n.currentGoals))return;let t=null;const a=this.aiPlayerNumber===1?i.game.players.player1.type:i.game.players.player2.type,r=n.experimentType==="2P2G"||n.experimentType==="2P3G";let o=null;if(a==="gpt"&&r)try{t=await this.gptClient.getNextAction({...n,trialData:this.gameStateManager.getCurrentTrialData()},{aiPlayerNumber:this.aiPlayerNumber}),t&&typeof t=="object"&&(Object.prototype.hasOwnProperty.call(t,"inferredGoal")&&this.gameStateManager.recordAIInferredOtherGoal(t.inferredGoal??null),t=(t==null?void 0:t.action)||null)}catch(g){o=g,console.warn("GPT agent failed, falling back to RL. Reason:",(g==null?void 0:g.message)||g)}if(!t){if(!this.rlAgent)return;const g=this.rlAgent.getAIAction(n.gridMatrix,this.aiPlayerNumber===1?n.player1:n.player2,n.currentGoals,this.aiPlayerNumber===1?n.player2:n.player1);if(g[0]===0&&g[1]===0)return;t=this.actionToDirection(g),o&&this.gameStateManager.recordGptErrorEvent({phase:"independent",error:(o==null?void 0:o.message)||String(o),humanDirection:null,fallback:"rl",fallbackDirection:t})}if(t){const g=this.gameStateManager.processPlayerMove(this.aiPlayerNumber,t);this.uiManager.updateGameDisplay(this.gameStateManager.getCurrentState());try{const x=this.gameStateManager.getCurrentState(),p=(c=(l=(s=i==null?void 0:i.game)==null?void 0:s.players)==null?void 0:l.player2)==null?void 0:c.type;if((p==="rl_joint"||p==="ai"||((d=(h=i==null?void 0:i.game)==null?void 0:h.agent)==null?void 0:d.type)==="joint")&&this.rlAgent&&typeof this.rlAgent.precalculatePolicyForGoals=="function"){const u=Array.isArray(x==null?void 0:x.currentGoals)?x.currentGoals:[];u.length>0&&setTimeout(()=>this.rlAgent.precalculatePolicyForGoals(u,experimentType),0)}}catch{}g.trialComplete&&this.handleTrialComplete(g)}}startIndependentAIMovement(){this.aiMoveInterval&&clearInterval(this.aiMoveInterval),this.aiMoveInterval=setInterval(()=>{const n=this.gameStateManager.getCurrentState(),e=this.aiPlayerNumber===1?n.player1:n.player2;if(e){if(I.isGoalReached(e,n.currentGoals)){clearInterval(this.aiMoveInterval),this.aiMoveInterval=null;return}this.makeAIMove()}},i.game.agent.independentDelay)}setupNewGoalCheck1P2G(){this.newGoalIntervalId&&(clearInterval(this.newGoalIntervalId),this.newGoalIntervalId=null);const e=setInterval(()=>{var s,l,c,h,d,g,x,p,m,u,T;const t=this.gameStateManager.currentState,a=this.gameStateManager.trialData;if(!t||!a||a.newGoalPresented||t.experimentType!=="1P2G"||!t.currentGoals||t.currentGoals.length!==2||this.gameStateManager.stepCount<((s=i.oneP2G)==null?void 0:s.minStepsBeforeNewGoal))return;const r=a.distanceCondition||a.newGoalConditionType||i.oneP2G.distanceConditions.CLOSER_TO_PLAYER1,o=sn.checkNewGoalPresentation1P2G(this.gameStateManager.getCurrentState(),this.gameStateManager.getCurrentTrialData(),r);if(o){this.gameStateManager.addGoal(o.position),this.gameStateManager.markNewGoalPresented(o.position,r,{}),this.rlAgent&&typeof this.rlAgent.resetNewGoalPreCalculationFlag=="function"&&this.rlAgent.resetNewGoalPreCalculationFlag();try{const f=this.gameStateManager.getCurrentState(),y=(h=(c=(l=i==null?void 0:i.game)==null?void 0:l.players)==null?void 0:c.player2)==null?void 0:h.type;if((y==="rl_joint"||y==="ai"||((g=(d=i==null?void 0:i.game)==null?void 0:d.agent)==null?void 0:g.type)==="joint")&&this.rlAgent&&typeof this.rlAgent.precalculatePolicyForGoals=="function"){const v=Array.isArray(f==null?void 0:f.currentGoals)?f.currentGoals:[];v.length>0&&setTimeout(()=>this.rlAgent.precalculatePolicyForGoals(v,(f==null?void 0:f.experimentType)||null),0)}}catch{}try{const f=this.gameStateManager.getCurrentState(),y=(m=(p=(x=i==null?void 0:i.game)==null?void 0:x.players)==null?void 0:p.player2)==null?void 0:m.type;if((y==="rl_joint"||y==="ai"||((T=(u=i==null?void 0:i.game)==null?void 0:u.agent)==null?void 0:T.type)==="joint")&&this.rlAgent&&typeof this.rlAgent.precalculatePolicyForGoals=="function"){const v=Array.isArray(f==null?void 0:f.currentGoals)?f.currentGoals:[];v.length>0&&setTimeout(()=>this.rlAgent.precalculatePolicyForGoals(v,(f==null?void 0:f.experimentType)||null),0)}}catch{}this.uiManager.updateGameDisplay(this.gameStateManager.getCurrentState())}},100);this.newGoalIntervalId=e}setupNewGoalCheck2P3G(){this.newGoalIntervalId&&(clearInterval(this.newGoalIntervalId),this.newGoalIntervalId=null),this._loggedFallbackMode=!1;const e=setInterval(()=>{var c,h;const t=i.game.players.player1.type==="human"&&i.game.players.player2.type==="human";if(t&&!(!!this.timelineManager&&this.timelineManager.playerIndex===0))return;if(!t&&!this._loggedFallbackMode){const d=i.game.players.player1.type,g=i.game.players.player2.type;try{(c=i==null?void 0:i.debug)!=null&&c.disableConsoleLogs||console.log(`[DEBUG] New goal check active in human-AI mode: P1=${d}, P2=${g}, aiPlayerNumber=${this.aiPlayerNumber}`)}catch{}this._loggedFallbackMode=!0}const a=this.gameStateManager.currentState,r=this.gameStateManager.trialData;if(!a||!r||r.newGoalPresented||a.experimentType!=="2P3G"||!a.currentGoals||a.currentGoals.length<2||!a.player1||!a.player2)return;const o=r.distanceCondition||r.newGoalConditionType||i.twoP3G.distanceConditions.CLOSER_TO_PLAYER2;let s=sn.checkNewGoalPresentation2P3G(this.gameStateManager.getCurrentState(),this.gameStateManager.getCurrentTrialData(),o);if(!s&&typeof r.firstDetectedSharedGoal=="number"&&r.firstDetectedSharedGoal!==null)try{const d=sn.generateNewGoal(a.player2,a.player1,a.currentGoals,r.firstDetectedSharedGoal,o);d&&d.position&&(s=d)}catch{}if(!s)return;if((h=this.gameStateManager.trialData)!=null&&h.newGoalPresented){console.log("🔧 [RACE PROTECTION] Goal already presented, skipping duplicate generation");return}console.log("🎯 [GOAL GEN] Generating new goal at position:",s.position),this.gameStateManager.addGoal(s.position);const l=typeof s.distanceToPlayer2=="number"&&typeof s.distanceToPlayer1=="number"?{isNewGoalCloserToPlayer2:s.distanceToPlayer2<s.distanceToPlayer1}:{};if(this.gameStateManager.markNewGoalPresented(s.position,o,l),this.rlAgent&&typeof this.rlAgent.resetNewGoalPreCalculationFlag=="function"&&this.rlAgent.resetNewGoalPreCalculationFlag(),this.uiManager.updateGameDisplay(this.gameStateManager.getCurrentState()),t)try{const d=window.__NETWORK_MANAGER__;d&&typeof d.syncGameState=="function"&&d.syncGameState(this.gameStateManager.getCurrentState())}catch{}},100);this.newGoalIntervalId=e}actionToDirection(n){const[e,t]=n;return e===-1&&t===0?"up":e===1&&t===0?"down":e===0&&t===-1?"left":e===0&&t===1?"right":null}setupGameTimeout(){var e,t,a;const n=Number((t=(e=i==null?void 0:i.game)==null?void 0:e.timing)==null?void 0:t.maxTrialDurationMs)||0;if(n>0){const r=setTimeout(()=>{console.log("Game timeout reached"),this.handleTrialComplete({success:!1,timeout:!0})},n);this.gameTimeoutId=r}else try{(a=i==null?void 0:i.debug)!=null&&a.disableConsoleLogs||console.log("[DEBUG] Trial time cap disabled (maxTrialDurationMs=0)")}catch{}}handleTrialComplete(n){if(console.log("Trial completed:",n),this.timelineManager&&this.currentTrialCompleteCallback){this.handleTimelineTrialComplete(n);return}this.clearGameIntervals();const e=this.gameStateManager.getCurrentState().experimentType;let t;e&&e.startsWith("1P")?t=!!(this.gameStateManager.getCurrentState().player1&&I.isGoalReached(this.gameStateManager.getCurrentState().player1,this.gameStateManager.getCurrentState().currentGoals)):t=!!(n.success||n.trialComplete),this.gameStateManager.finalizeTrial(t),this.uiManager.showTrialFeedback(n),setTimeout(()=>{if(this.currentTrialIndex++,this.currentExperimentIndex>=this.currentExperimentSequence.length){console.log("All experiments completed during timeout"),this.completeAllExperiments();return}const a=this.currentExperimentSequence[this.currentExperimentIndex];a?this.startNextTrial(a):(console.error("No current experiment found, completing all experiments"),this.completeAllExperiments())},i.game.timing.trialToFeedbackDelay+i.game.timing.feedbackDisplayDuration)}shouldEndExperimentEarly(n){return!1}completeAllExperiments(){var t;if(!this.isRunning){console.log("Experiments already completed, ignoring duplicate call");return}console.log("All experiments completed"),this.isRunning=!1;const n=this.gameStateManager.getExperimentData(),e={totalTrials:n.allTrialsData.length,successfulTrials:n.allTrialsData.filter(a=>a.completed||a.collaborationSucceeded).length,successRate:I.calculateSuccessRate(n.allTrialsData),totalTime:I.formatDuration(Date.now()-(((t=n.allTrialsData[0])==null?void 0:t.trialStartTime)||Date.now()))};this.uiManager.showExperimentComplete(e),this.exportExperimentData(n)}exportExperimentData(n){console.log("Export suppressed: data saving handled by timeline (cloud only).")}async startMultiplayerExperiment(n){console.log("Starting multiplayer experiment:",n),this.currentExperimentSequence=[n.experimentType],n.gameMode==="human-human"&&(this.rlAgent=null),await this.startExperimentSequence()}isValidGridPosition(n){return Array.isArray(n)&&n.length>=2&&Number.isInteger(n[0])&&Number.isInteger(n[1])&&n[0]>=0&&n[0]<i.game.matrixSize&&n[1]>=0&&n[1]<i.game.matrixSize}validateTrialDesign(n,e){if(!e||typeof e!="object"||!this.isValidGridPosition(e.initPlayerGrid)||!this.isValidGridPosition(e.target1)||(n==="1P2G"||n.includes("2P"))&&!this.isValidGridPosition(e.target2))return!1;if(n.includes("2P")){if(!this.isValidGridPosition(e.initAIGrid))return!1;const[t,a]=e.initPlayerGrid,[r,o]=e.initAIGrid;if(!(t===r||a===o))return console.warn("⚠️ Rejecting misaligned 2P map design:",e),!1}return!0}async getTrialDesign(n,e){if(!n)return console.error("getTrialDesign called with undefined experimentType"),null;console.log(`🗺️ Loading trial design for ${n} trial ${e}`),await this.ensureMapDataLoaded();try{if(n.includes("2P")&&e>=i.game.successThreshold.randomSamplingAfterTrial){const s=this.mapLoader.getRandomMapForCollaborationGame(n,e);if(this.validateTrialDesign(n,s))return console.log("✅ Loaded random map design:",s),s}const t=this.mapLoader.getMapsForExperiment(n);if(console.log(`🗺️ Available maps for ${n}:`,Object.keys(t||{}).length),!t||Object.keys(t).length===0)return console.warn("⚠️ No maps available, using fallback design"),this.mapLoader.createFallbackDesign(n);const a=Object.keys(t),r=a[e%a.length],o=t[r];if(Array.isArray(o)&&o.length>0){const s={...o[0]};if(this.validateTrialDesign(n,s))return console.log(`✅ Loaded map design for trial ${e}:`,s),s}return console.warn("⚠️ Invalid map structure or layout, using fallback design"),this.mapLoader.createFallbackDesign(n)}catch(t){return console.error("❌ Error loading trial design:",t),this.mapLoader.createFallbackDesign(n)}}async ensureMapDataLoaded(){this.mapLoader.mapData||(console.log("🗺️ Waiting for map data to load..."),await this.mapLoader.initialize(),console.log("✅ Map data loaded for ExperimentManager"))}clearGameIntervals(){this.gameLoopInterval&&(clearInterval(this.gameLoopInterval),this.gameLoopInterval=null),this.aiMoveInterval&&(clearInterval(this.aiMoveInterval),this.aiMoveInterval=null),this.newGoalIntervalId&&(clearInterval(this.newGoalIntervalId),this.newGoalIntervalId=null),this.gameTimeoutId&&(clearTimeout(this.gameTimeoutId),this.gameTimeoutId=null)}setupTimelineIntegration(){this.timelineManager&&(this.timelineManager.on("show-fixation",n=>{this.handleFixationDisplay(n)}),this.timelineManager.on("start-trial",n=>{this.handleTimelineTrialStart(n)}),this.timelineManager.on("show-trial-feedback",n=>{this.handleTrialFeedback(n)}),this.timelineManager.on("ai-fallback-activated",n=>{var a;try{(a=i==null?void 0:i.debug)!=null&&a.disableConsoleLogs||console.log("[DEBUG] ExperimentManager received ai-fallback-activated event:",n)}catch{}const{fallbackType:e,aiPlayerNumber:t}=n;this.activateAIFallback(e,t)}),console.log("✅ Timeline integration setup completed"))}handleFixationDisplay(n){const{experimentType:e,experimentIndex:t,trialIndex:a}=n;console.log(`⚡ Showing fixation for ${e} trial ${a}`);const r=document.getElementById("fixation-canvas-container");r?(r.innerHTML=`
        <div style="font-size: 48px; font-weight: bold; color: #333; padding: 50px;">
          +
        </div>
      `,console.log("✅ Fixation cross added to timeline container")):(console.warn("⚠️ Fixation container not found, timeline may not be set up properly"),this.uiManager.showFixation())}async handleTimelineTrialStart(n){var o;const{experimentType:e,experimentIndex:t,trialIndex:a,onComplete:r}=n;console.log(`🎮 Timeline starting trial ${a} of ${e}`),this.currentTrialCompleteCallback=r;try{const s=window.__GAME_APPLICATION__;s&&e.includes("2P")&&(console.log("🔗 Notifying GameApplication of trial start for inactivity tracking"),(o=s.handleTrialStart)==null||o.call(s,e,t,a))}catch(s){console.warn("⚠️ Could not notify GameApplication of trial start:",s)}try{let s=await this.getTrialDesign(e,a);s||(console.error("Failed to get trial design, using fallback"),s=I.createFallbackDesign(e)),this.gameStateManager.initializeTrial(a,e,s),this.uiManager.updateGameInfo(t,a,e);const l=document.getElementById("game-canvas-container");l?(console.log("✅ Found timeline game container, setting up game canvas"),this.uiManager.setupGameCanvasInContainer(l)):console.warn("⚠️ Timeline game container not found, using fallback"),this.uiManager.updateGameDisplay(this.gameStateManager.getCurrentState()),this.startTimelineTrialExecution(e)}catch(s){console.error("❌ Error starting timeline trial:",s);const l=I.createFallbackDesign(e);this.gameStateManager.initializeTrial(a,e,l),this.uiManager.updateGameInfo(t,a,e),this.uiManager.updateGameDisplay(this.gameStateManager.getCurrentState()),this.startTimelineTrialExecution(e)}}startTimelineTrialExecution(n){switch(this.clearGameIntervals(),n){case"1P1G":this.runTrial1P1G();break;case"1P2G":this.runTrial1P2G();break;case"2P2G":this.runTrial2P2G();break;case"2P3G":this.runTrial2P3G();break;default:console.error("Unknown experiment type:",n)}this.setupTimelineGameTimeout()}setupTimelineGameTimeout(){var e,t,a;const n=Number((t=(e=i==null?void 0:i.game)==null?void 0:e.timing)==null?void 0:t.maxTrialDurationMs)||0;if(n>0){const r=setTimeout(()=>{console.log("Game timeout reached"),this.handleTimelineTrialComplete({success:!1,timeout:!0})},n);this.gameTimeoutId=r}else try{(a=i==null?void 0:i.debug)!=null&&a.disableConsoleLogs||console.log("[DEBUG] Timeline trial time cap disabled (maxTrialDurationMs=0)")}catch{}}handleTimelineTrialComplete(n){var o;console.log("Timeline trial completed:",n),this.clearGameIntervals();try{const s=window.__GAME_APPLICATION__;s&&(console.log("🔗 Notifying GameApplication of trial completion"),(o=s.handleTrialEnd)==null||o.call(s))}catch(s){console.warn("⚠️ Could not notify GameApplication of trial completion:",s)}const e=this.gameStateManager.getCurrentTrialData(),t=this.gameStateManager.getCurrentState().experimentType;let a;t&&t.startsWith("1P")?a=!!(this.gameStateManager.getCurrentState().player1&&I.isGoalReached(this.gameStateManager.getCurrentState().player1,this.gameStateManager.getCurrentState().currentGoals)):(typeof e.collaborationSucceeded!="boolean"&&(e.collaborationSucceeded=!1),a=e.collaborationSucceeded===!0),this.gameStateManager.finalizeTrial(a);const r={...n,success:a,trialData:this.gameStateManager.getCurrentTrialData(),gameState:this.gameStateManager.getCurrentState()};this.currentTrialCompleteCallback&&(this.currentTrialCompleteCallback(r),this.currentTrialCompleteCallback=null)}handleTrialFeedback(n){const{success:e,experimentType:t,trialIndex:a,canvasContainer:r}=n;console.log(`📊 Showing trial feedback for ${t} trial ${a}`);const o=t.startsWith("1P")?"single":"collaboration";this.uiManager.showTrialFeedbackInContainer(e,r,o)}restart(){this.clearGameIntervals(),this.gameStateManager.reset(),this.currentExperimentIndex=0,this.currentTrialIndex=0,this.isRunning=!1}pause(){this.clearGameIntervals()}resume(){if(this.isRunning&&this.currentExperimentIndex<this.currentExperimentSequence.length){const n=this.currentExperimentSequence[this.currentExperimentIndex];n?this.startTrialExecution(n):console.error("No current experiment found during resume")}}}class ne{constructor(n){this.container=n,this.stages=[],this.currentStageIndex=0,this.mapData={},this.hasShownPartnerFindingStage=!1,this.waitingTimes=[],this.experimentData={participantId:this.getParticipantId(),startTime:new Date().toISOString(),experiments:{},questionnaire:{},totalScore:0,completed:!1},this.eventHandlers=new Map,this.successThreshold={consecutiveSuccesses:0,totalTrialsCompleted:0,experimentEndedEarly:!1,lastSuccessTrial:-1,successHistory:[]},this.sharedMapData={},this.isMapHost=!1,this.pendingMapSync=!1,this.playerIndex=0,this.gameMode="human-ai"}on(n,e){this.eventHandlers.has(n)||this.eventHandlers.set(n,[]),this.eventHandlers.get(n).push(e)}off(n,e){if(this.eventHandlers.has(n)){const t=this.eventHandlers.get(n),a=t.indexOf(e);a>-1&&t.splice(a,1)}}emit(n,e){this.eventHandlers.has(n)&&this.eventHandlers.get(n).forEach(t=>{try{t(e)}catch(a){console.error(`Error in timeline event handler for ${n}:`,a)}})}setPlayerInfo(n,e){this.playerIndex=n,this.gameMode=e,console.log(`🎮 TimelineManager: Set player info - Player ${n+1} (${n===0?"red":"purple"}) in ${e} mode`)}createTimelineStages(){this.stages=[],console.log("📋 Creating comprehensive timeline stages..."),this.stages.push({type:"start",handler:()=>this.showStartStage()}),this.stages.push({type:"welcome_info",handler:()=>this.showWelcomeInfoStage()});const n=i.game.experiments.order;for(let e=0;e<n.length;e++){const t=n[e],a=i.game.experiments.numTrials[t];console.log(`📋 Adding stages for experiment: ${t}`),this.stages.push({type:"instructions",experimentType:t,experimentIndex:e,handler:()=>this.showInstructionsStage(t,e)}),t==="2P2G"&&this.stages.push({type:"comprehension_check",experimentType:t,experimentIndex:e,handler:()=>this.showComprehensionCheckStage(t,e)});const r=t.includes("2P");if(console.log(`🔍 Experiment ${t}: isMultiplayer=${r}`),r&&(this.hasShownPartnerFindingStage?(console.log(`➕ Skipping waiting and match-play stages for ${t}; checking partner presence only`),this.stages.push({type:"check_partner_presence",experimentType:t,experimentIndex:e,handler:()=>this.checkPartnerPresenceAndProceed(t,e)})):(console.log(`➕ Adding waiting + match-play stages for ${t}`),this.stages.push({type:"waiting_for_partner",experimentType:t,experimentIndex:e,handler:()=>this.showWaitingForPartnerStage(t,e)}),this.stages.push({type:"match_play",experimentType:t,experimentIndex:e,showPartnerFoundMessage:!0,handler:()=>this.showMatchPlayStage(t,e)}),this.hasShownPartnerFindingStage=!0)),t.includes("2P")&&i.game.successThreshold.enabled)this.addCollaborationExperimentStages(t,e);else for(let o=0;o<a;o++)this.addTrialStages(t,e,o)}this.stages.push({type:"questionnaire",handler:()=>this.showQuestionnaireStage()}),this.stages.push({type:"end-info",handler:()=>this.showEndExperimentInfoStage()}),console.log(`📋 Timeline created with ${this.stages.length} total stages`),console.log("📋 Stages:",this.stages.map((e,t)=>`${t}: ${e.type}`).join(", "))}addTrialStages(n,e,t){this.stages.push({type:"fixation",experimentType:n,experimentIndex:e,trialIndex:t,handler:()=>this.showFixationStage(n,e,t)}),this.stages.push({type:"trial",experimentType:n,experimentIndex:e,trialIndex:t,handler:()=>this.runTrialStage(n,e,t)}),this.stages.push({type:"post-trial",experimentType:n,experimentIndex:e,trialIndex:t,handler:()=>this.showPostTrialStage(n,e,t)})}addCollaborationExperimentStages(n,e){this.initializeSuccessThresholdTracking(),this.addTrialStages(n,e,0)}start(){this.createTimelineStages(),this.currentStageIndex=0,this.runCurrentStage()}runCurrentStage(){if(this.currentStageIndex>=this.stages.length){console.log("🏁 Timeline completed!");return}const n=this.stages[this.currentStageIndex];console.log(`🎬 Running stage ${this.currentStageIndex}: ${n.type}`);try{n.handler()}catch(e){console.error(`❌ Error running stage ${n.type}:`,e),this.nextStage()}}nextStage(){console.log(`➡️ Advancing from stage ${this.currentStageIndex} to ${this.currentStageIndex+1}`),this.currentStageIndex++,this.runCurrentStage()}showConsentStage(){this.container.innerHTML=`
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
    `;const n=document.getElementById("consentCheckbox"),e=document.getElementById("continueBtn");n.addEventListener("change",()=>{n.checked?(e.disabled=!1,e.style.cursor="pointer",e.style.background="#28a745"):(e.disabled=!0,e.style.cursor="not-allowed",e.style.background="#6c757d")}),e.addEventListener("click",()=>{n.checked&&(this.experimentData.consentTime=new Date().toISOString(),console.log("✅ Consent obtained"),this.nextStage())})}showStartStage(){this.container.innerHTML=`
      <div style="display: flex; align-items: center; justify-content: center; min-height: 100vh; background: #f8f9fa;">
        <div style="text-align: center;">
          <button id="startBtn" style="background: #28a745; color: white; border: none; padding: 20px 60px; font-size: 24px; font-weight: bold; border-radius: 8px; cursor: pointer; box-shadow: 0 4px 6px rgba(0,0,0,0.1); transition: background 0.3s;">
            Start
          </button>
        </div>
      </div>
    `;const n=document.getElementById("startBtn");n.addEventListener("mouseenter",()=>{n.style.background="#218838"}),n.addEventListener("mouseleave",()=>{n.style.background="#28a745"}),n.addEventListener("click",()=>{this.nextStage()})}showWelcomeInfoStage(){this.container.innerHTML=`
      <div style="display: flex; align-items: center; justify-content: center; min-height: 100vh; background: #f8f9fa;">
        <div style="background: white; padding: 40px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); max-width: 800px; text-align: center;">
          <h2 style="color: #333; margin-bottom: 30px; font-size: 36px;">Welcome to the Game!</h2>
          
          <div style="margin: 20px 0; text-align: center;">
            <video 
              id="welcomeVideo"
              width="100%" 
              height="400" 
              controls
              autoPlay
              muted
              playsInline
              style="max-width: 600px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
              <source src="${this.assetUrl("video1.mp4")}" type="video/mp4">
              Your browser does not support the video tag.
            </video>
          </div>
  
          <div style="margin-top: 30px;">
            <p style="font-size: 22px; font-weight: bold; color: #333; margin-bottom: 20px;">
              Press the <span style="background: #f0f0f0; padding: 4px 8px; border-radius: 4px; font-family: monospace;">spacebar</span> to continue!
            </p>
          </div>
        </div>
      </div>
    `;const n=document.getElementById("welcomeVideo"),e=()=>{n&&(n.muted=!1,n.volume=1,n.play().catch(a=>{console.warn("Unable to start video with sound:",a)}),document.removeEventListener("click",e),document.removeEventListener("keydown",e),n.removeEventListener("click",e))};document.addEventListener("click",e,{once:!0}),document.addEventListener("keydown",e,{once:!0}),n&&n.addEventListener("click",e,{once:!0});const t=a=>{(a.code==="Space"||a.key===" ")&&(a.preventDefault(),a.stopPropagation(),document.removeEventListener("keydown",t,!0),console.log("🎮 Starting game sequence"),this.nextStage())};document.addEventListener("keydown",t,!0),document.body.focus()}showInstructionsStage(n,e){const t=this.getInstructionsForExperiment(n);if(this.container.innerHTML=t.html,n==="1P1G"||n==="1P2G"||n==="2P2G"||n==="2P3G"){const r=document.getElementById("game1Video")||document.getElementById("game2Video")||document.getElementById("game3Video")||document.getElementById("game4Video")||this.container.querySelector("video");r&&(r.autoplay=!0,r.playsInline=!0,(()=>(r.muted=!1,r.volume=1,r.play()))().catch(s=>{console.warn("Unable to autoplay instruction video with sound, falling back to muted:",s),r.muted=!0,r.play().catch(c=>{console.warn("Unable to autoplay muted instruction video:",c)});const l=()=>{r.muted=!1,r.volume=1,r.play().catch(c=>{console.warn("Unable to start instruction video with sound after interaction:",c)}),document.removeEventListener("click",l),document.removeEventListener("keydown",l),r.removeEventListener("click",l)};document.addEventListener("click",l,{once:!0}),document.addEventListener("keydown",l,{once:!0}),r.addEventListener("click",l,{once:!0})}))}const a=r=>{(r.code==="Space"||r.key===" ")&&(r.preventDefault(),r.stopPropagation(),document.removeEventListener("keydown",a,!0),console.log(`📋 Instructions completed for ${n}`),this.nextStage())};document.addEventListener("keydown",a,!0),document.body.focus()}showComprehensionCheckStage(n,e){const t=(a=!1)=>{this.container.innerHTML=`
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
      `;let r=null;const o=()=>{try{r&&(r.pause(),r.currentTime=0,r=null)}catch{}};(()=>{if(a)try{const h=new Audio(this.assetUrl("tryAgain.mp3"));r=h,h.play().catch(d=>{console.warn("Unable to autoplay tryAgain audio:",d)})}catch(h){console.warn("Error starting tryAgain audio:",h)}else try{const h=new Audio(this.assetUrl("comprehensionCheck.mp3"));r=h,h.play().catch(d=>{console.warn("Unable to autoplay comprehension audio:",d)})}catch(h){console.warn("Error starting comprehension audio:",h)}})();const l=document.getElementById("red-dot-btn"),c=document.getElementById("orange-dot-btn");l&&l.addEventListener("click",()=>{o(),console.log("✅ Comprehension check passed (red dot selected). Continuing to Game 3."),this.nextStage()}),c&&c.addEventListener("click",()=>{o(),console.log("⚠️ Comprehension check failed (purple dot selected). Showing error message."),t(!0)})};t(!1)}checkPartnerPresenceAndProceed(n,e){var a,r,o;console.log(`🔍 Checking partner presence for ${n} transition...`),((o=(r=(a=i==null?void 0:i.game)==null?void 0:a.players)==null?void 0:r.player2)==null?void 0:o.type)==="human"?(this.emit("check-partner-status",{experimentType:n,experimentIndex:e}),this.partnerStatusChecked=!1,this.shouldSkipMatchPlay=!1,setTimeout(()=>{var l,c,h;this.partnerStatusChecked||(console.log("⏰ Partner status check timeout - assuming partner disconnected"),this.shouldSkipMatchPlay=!0,this.partnerStatusChecked=!0),((h=(c=(l=i==null?void 0:i.game)==null?void 0:l.players)==null?void 0:c.player2)==null?void 0:h.type)==="human"&&!this.shouldSkipMatchPlay?(console.log("✅ Partner still connected, proceeding to match-play stage"),this.nextStage()):(console.log("🤖 Partner disconnected, switching to AI mode"),this.gameMode="human-ai",this.nextStage())},3e3)):(console.log("🤖 Already in AI mode, skipping match-play stage"),this.gameMode="human-ai",this.nextStage())}showWaitingForPartnerStage(n,e){var g,x,p,m,u,T,f;const t=(x=(g=i==null?void 0:i.game)==null?void 0:g.timing)==null?void 0:x.waitingForPartnerMinDuration,a=(m=(p=i==null?void 0:i.game)==null?void 0:p.timing)==null?void 0:m.waitingForPartnerMaxDuration,r=Date.now()+t;let o=!1;const s=Date.now();if(console.log("⏱️ [WAITING] Partner search started at:",new Date(s).toISOString()),this.container.innerHTML=`
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
    `,!(((f=(T=(u=i==null?void 0:i.game)==null?void 0:u.players)==null?void 0:T.player2)==null?void 0:f.type)==="human")){this.gameMode="human-ai",setTimeout(()=>{this.nextStage()},Math.max(0,r-Date.now()));return}const c=y=>{var G;if(y.code==="Space"||y.key===" "){if(y.preventDefault(),Date.now()<r)return;const v=Date.now(),b=v-s;console.log("⏱️ [WAITING] Skipped after waiting duration:",b+"ms ("+(b/1e3).toFixed(1)+"s)"),this.recordWaitingTime(s,v,b,"skip",n,e),document.removeEventListener("keydown",c),console.log("⏭️ Skipping multiplayer waiting after min wait - continuing with AI partner");const w=((G=i==null?void 0:i.multiplayer)==null?void 0:G.fallbackAIType)||"rl_joint";q.setPlayerType(2,w);try{this.emit("fallback-to-ai",{reason:"waiting-skip",stage:"waiting-for-partner",at:Date.now(),fallbackAIType:w})}catch{}this.nextStage()}};document.addEventListener("keydown",c),this.emit("waiting-for-partner",{experimentType:n,experimentIndex:e});const h=document.getElementById("cancel-wait-btn");h&&(h.onclick=()=>{console.log("⚠️ Waiting canceled by user"),window.close()});const d=y=>{console.log("👥 Partner connected - will advance after minimum waiting time",y),this.gameMode="human-human",o=!0;const G=Date.now(),v=G-s;console.log("⏱️ [WAITING] Partner found! Waiting duration:",v+"ms ("+(v/1e3).toFixed(1)+"s)"),this.recordWaitingTime(s,G,v,"partner_found",n,e),document.removeEventListener("keydown",c),this.off("partner-connected",d);let b=r;if(y&&y.connectedAt){const M=y.connectedAt+t;b=Math.max(b,M)}const w=Math.max(0,b-Date.now());setTimeout(()=>this.nextStage(),w)};this.eventHandlers.delete("partner-connected"),this.on("partner-connected",d),setTimeout(()=>{var y,G;if(!o){const v=Date.now(),b=v-s;console.log("⏱️ [WAITING] Timeout after waiting duration:",b+"ms ("+(b/1e3).toFixed(1)+"s)"),this.recordWaitingTime(s,v,b,"timeout",n,e),console.log(`⌛ No partner found after ${a}ms - falling back to AI mode`);const w=((y=i==null?void 0:i.multiplayer)==null?void 0:y.fallbackAIType)||"rl_joint";q.setPlayerType(2,w),this.gameMode="human-ai",document.removeEventListener("keydown",c);try{this.emit("fallback-to-ai",{reason:"waiting-timeout",stage:"waiting-for-partner",at:Date.now(),fallbackAIType:w})}catch{}try{(G=i==null?void 0:i.debug)!=null&&G.disableConsoleLogs||console.log("[DEBUG] Timeline emitting ai-fallback-activated event (waiting timeout)")}catch{}this.emit("ai-fallback-activated",{fallbackType:w,aiPlayerNumber:2}),this.nextStage()}},a)}showReadyToPlayStage(n,e){if(this.isHumanHumanMode()&&i.game.players.player2.type==="human"){this.container.innerHTML=`
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
            <p>Press SPACE to start the game!</p>
            <p style="font-size: 14px;">${this.isHumanHumanMode()?"Both players must press SPACE to begin.":""}</p>

          <div id="match-status" style="font-size: 14px; color: #666; display: none;">Waiting for the other player to press space...</div>
        </div>
      </div>
    `;const o=s=>{var l;if(s.code==="Space"||s.key===" ")if(s.preventDefault(),s.stopPropagation(),document.removeEventListener("keydown",o,!0),this.emit("match-play-ready"),this.isHumanHumanMode()&&i.game.players.player2.type==="human"){const c=document.getElementById("match-status");c&&(c.style.display="block");const h=(l=i==null?void 0:i.multiplayer)==null?void 0:l.matchPlayReadyTimeout;let d=null;const g=()=>{var p,m,u,T;try{console.log(`⌛ Match-play wait exceeded (${h}ms) - falling back to AI mode`);const f=((p=i==null?void 0:i.multiplayer)==null?void 0:p.fallbackAIType)||"rl_joint";try{(m=i==null?void 0:i.debug)!=null&&m.disableConsoleLogs||console.log(`[DEBUG] Timeline fallback - fallbackType: ${f}`)}catch{}q.setPlayerType(2,f);try{(u=i==null?void 0:i.debug)!=null&&u.disableConsoleLogs||console.log(`[DEBUG] Timeline fallback - After setPlayerType, Player2: ${i.game.players.player2.type}`)}catch{}this.gameMode="human-ai",this.off("all-players-ready",x);try{(T=i==null?void 0:i.debug)!=null&&T.disableConsoleLogs||console.log("[DEBUG] Timeline emitting ai-fallback-activated event")}catch{}this.emit("ai-fallback-activated",{fallbackType:f,aiPlayerNumber:2})}catch{}this.nextStage()},x=()=>{this.off("all-players-ready",x),d&&(clearTimeout(d),d=null),this.nextStage()};this.eventHandlers.delete("all-players-ready"),this.on("all-players-ready",x),d=setTimeout(()=>{var m;const p=((m=i==null?void 0:i.multiplayer)==null?void 0:m.fallbackAIType)||"rl_joint";try{this.emit("fallback-to-ai",{reason:"match-play-timeout",stage:"match-play",at:Date.now(),fallbackAIType:p})}catch{}g()},h)}else this.nextStage()};document.addEventListener("keydown",o,!0),document.body.focus()}showFixationStage(n,e,t){this.container.innerHTML=`
      <div style="display: flex; align-items: center; justify-content: center; min-height: 100vh; background: #f8f9fa;">
        <div style="text-align: center;">
          <div id="fixation-canvas-container"></div>
          <div style="margin-top: 20px; font-size: 14px; color: #666;">
          </div>
        </div>
      </div>
    `,this.emit("show-fixation",{experimentType:n,experimentIndex:e,trialIndex:t});const a=o=>{(o.code==="Space"||o.key===" ")&&(o.preventDefault(),document.removeEventListener("keydown",a),console.log("⏭️ Fixation skipped by user"),this.nextStage())};document.addEventListener("keydown",a),console.log(`⏰ Setting fixation timeout for ${i.game.timing.fixationDuration}ms`);const r=setTimeout(()=>{document.removeEventListener("keydown",a),console.log(`⚡ Fixation completed for trial ${t} - advancing to next stage`),this.nextStage()},i.game.timing.fixationDuration);this.currentFixationTimeout=r}runTrialStage(n,e,t){var s,l,c;console.log(`🎮 Starting trial ${t} of ${n}`);let a=i.visual.colors.player1,r="Player 1 (Red)";n.includes("2P")&&(a=this.playerIndex===0?i.visual.colors.player1:i.visual.colors.player2,r=this.playerIndex===0?"Player 1 (Red)":"Player 2 (Orange)");const o=((c=(l=(s=i==null?void 0:i.game)==null?void 0:s.experiments)==null?void 0:l.numTrials)==null?void 0:c[n])||1;this.container.innerHTML=`
      <div
        data-grid-fit-container="true"
        data-grid-reserved-height="125"
        style="box-sizing: border-box; display: flex; align-items: flex-start; justify-content: center; min-height: 100vh; background: #f8f9fa; padding: 10px 16px 48px; overflow: hidden;"
      >
        <div style="text-align: center; max-width: 800px; width: 100%; display: flex; flex-direction: column; align-items: center;">
          <h3 id="game-title" style="margin: 4px 0 10px; font-size: 18px; line-height: 1.2;">Game ${e+1}: Round ${t+1}/${o}</h3>
          <div id="game-canvas-container" style="margin: 0 auto; position: relative; display: flex; justify-content: center; width: 100%; max-width: 100%;">
            <!-- Game canvas will be inserted here by ExperimentManager -->
          </div>
          <div style="margin-top: 8px; font-size: 14px; color: #666; line-height: 1.3;">
            <p style="margin: 0;">You are ${r} <span style="display: inline-block; width: 18px; height: 18px; background-color: ${a}; border-radius: 50%; vertical-align: middle;"></span>. Use arrow keys to move.</p>
          </div>
        </div>
      </div>
    `,this.emit("start-trial",{experimentType:n,experimentIndex:e,trialIndex:t,onComplete:h=>{this.experimentData.experiments[n]||(this.experimentData.experiments[n]=[]),this.experimentData.experiments[n].push(h),n.includes("2P")&&i.game.successThreshold.enabled&&this.updateSuccessThresholdTracking(h.success,t),console.log(`✅ Trial ${t} completed`),this.nextStage()}})}showPostTrialStage(n,e,t){var l,c,h,d;const a=(l=this.experimentData.experiments[n])==null?void 0:l[t],r=(a==null?void 0:a.success)||!1,o=((d=(h=(c=i==null?void 0:i.game)==null?void 0:c.experiments)==null?void 0:h.numTrials)==null?void 0:d[n])||1,s=document.getElementById("game-canvas-container");s?this.emit("show-trial-feedback",{success:r,experimentType:n,trialIndex:t,canvasContainer:s}):(this.container.innerHTML=`
        <div style="display: flex; align-items: center; justify-content: center; min-height: 100vh; background: #f8f9fa;">
          <div style="text-align: center; max-width: 600px; width: 100%;">
            <h3 style="margin-bottom: 10px;">Game ${e+1}</h3>
            <h4 style="margin-bottom: 20px;">Round ${t+1}/${o} Results</h4>
            <div id="feedbackCanvasContainer" style="margin: 0 auto 20px auto; position: relative; display: flex; justify-content: center;"></div>
          </div>
        </div>
      `,this.emit("show-trial-feedback",{success:r,experimentType:n,trialIndex:t,canvasContainer:document.getElementById("feedbackCanvasContainer")})),setTimeout(()=>{console.log(`📊 Post-trial feedback completed for trial ${t}`),n.includes("2P")&&i.game.successThreshold.enabled?this.shouldContinueToNextTrial(n,t)?(console.log(`Continuing to next trial for ${n}`),this.addNextTrialStages(n,e,t+1),this.nextStage()):(console.log(`Ending ${n} experiment`),this.skipToNextExperimentOrCompletion(n)):this.nextStage()},i.game.timing.feedbackDisplayDuration)}showGameFeedbackStage(){const e=Object.values(this.experimentData.experiments).flat().map(d=>(d==null?void 0:d.trialData)||d).filter(Boolean),t=e.length;let a=0;if(e.length>0){const d=Math.min(...e.map(p=>Number(p.trialStartTime||0)||0)),g=Math.max(...e.map(p=>Number(p.endTime||p.trialEndTime||0)||0)),x=Math.max(0,g-d);a=Math.round(x/(1e3*60))}const r=e.some(d=>String(d.experimentType||"").includes("2P")),o=e.some(d=>String(d.experimentType||"").includes("1P"));let s=0;if(o){const d=e.filter(x=>String(x.experimentType||"").includes("1P")),g=d.filter(x=>x.completed===!0).length;s=d.length>0?Math.round(g/d.length*100):0}let l=0;if(r){const d=e.filter(x=>String(x.experimentType||"").includes("2P")),g=d.filter(x=>x.collaborationSucceeded===!0).length;l=d.length>0?Math.round(g/d.length*100):0}this.container.innerHTML=`
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
    `,this.stages.some(d=>d.type==="questionnaire")||this.stages.push({type:"questionnaire",handler:()=>this.showQuestionnaireStage()});const h=document.getElementById("continueToQuestionnaireBtn");h&&h.addEventListener("click",()=>{console.log("🎮 Game Feedback Stage: Continue button clicked"),this.nextStage()})}showQuestionnaireStage(){const n=()=>{const a=[{name:"ai_detection",title:"Page 1 of 3",prompt:"Do you think the other player is a person or a computer?",options:["Person","Computer"],optionImages:["person.png","computer.png"]},{name:"collaboration_rating",title:"Page 2 of 3",prompt:"How well did the other player collaborate with you?",options:["Good collaborator","Bad collaborator"],optionImages:["good.png","bad.png"]},{name:"play_again",title:"Page 3 of 3",prompt:"Would you like to play this game again in the future?",options:["Yes","No"],optionImages:["yes.png","no.png"]}],r={};let o=0,s=0,l=null;const c=window.speechSynthesis||null,h=async(p=!0)=>{const m=o+1,u=this.assetUrl(`question${m}.mp3`);return p&&(c&&c.cancel(),l&&(l.pause(),l.currentTime=0,l=null)),new Promise(T=>{const f=new Audio(u);f.onloadeddata=()=>{l=f,f.play().then(()=>{f.onended=()=>{l=null,T()},f.onerror=()=>{l=null,console.warn("Questionnaire prompt audio playback failed:",u),T()}}).catch(()=>T())},f.onerror=()=>{console.warn("Questionnaire prompt audio missing or failed to load:",u),T()},f.load()})},d=(p=!1)=>{const m=a[o],u=m.optionImages||[],T=m.options.map((y,G)=>{const v=G===s,b=v?"#4f46e5":"#e5e7eb",w=v?"#eef2ff":"#ffffff",M=u[G]?this.assetUrl(u[G]):"";return`
            <button type="button" class="image-option" data-idx="${G}" aria-label="${y.replace(/"/g,"&quot;")}" style="
              padding: 12px 16px;
              margin: 8px 12px;
              border-radius: 16px;
              border: 3px solid ${b};
              background: ${w};
              cursor: pointer;
              display: inline-flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              box-shadow: 0 4px 10px rgba(0,0,0,0.08);
            ">
              ${M?`<img src="${M}" alt="" style="max-width: min(200px, 38vw); max-height: 180px; height: auto; display: block; object-fit: contain;" />`:`<span style="font-size: 18px; color: #333;">${y}</span>`}
            </button>`}).join("");this.container.innerHTML=`
          <div style="display:flex; align-items:center; justify-content:center; min-height:100vh; background:#f8f9fa; padding:20px;">
            <div style="background:white; padding:32px; border-radius:16px; box-shadow:0 10px 25px rgba(0,0,0,0.1); width:100%; max-width:720px;">
              <div style="text-align:center; margin-bottom:12px; color:#6b7280; font-weight:600;">📋 Post-Game Questionnaire</div>
              <div style="text-align:center; margin-bottom:8px; color:#6b7280; font-weight:600;">${m.title}</div>
              <h2 style="text-align:center; margin:8px 0 20px; color:#111827;">${m.prompt}</h2>
              <div style="margin-bottom:16px; text-align:center; color:#6b7280;">
                Click an image to answer (or use arrow keys and Space).
              </div>
              <div id="options" style="display:flex; flex-direction:row; flex-wrap:wrap; justify-content:center; align-items:center;">${T}</div>
            </div>
          </div>`,p&&h(!0),this.container.querySelectorAll(".image-option").forEach(y=>{y.addEventListener("click",()=>{s=Number(y.getAttribute("data-idx")||"0"),r[m.name]=m.options[s],c&&c.cancel(),l&&(l.pause(),l.currentTime=0,l=null),o<a.length-1?(o+=1,s=0,d(!0)):(document.removeEventListener("keydown",g),this.experimentData.questionnaire=r,console.log("📝 Questionnaire completed"),this.nextStage())})})},g=p=>{const m=p.code==="ArrowUp"||p.key==="ArrowUp"||p.code==="ArrowLeft"||p.key==="ArrowLeft",u=p.code==="ArrowDown"||p.key==="ArrowDown"||p.code==="ArrowRight"||p.key==="ArrowRight";m?(p.preventDefault(),s=Math.max(0,s-1),d(!1)):u?(p.preventDefault(),s=Math.min(a[o].options.length-1,s+1),d(!1)):(p.code==="Space"||p.key===" ")&&(p.preventDefault(),c&&c.cancel(),l&&(l.pause(),l.currentTime=0,l=null),r[a[o].name]=a[o].options[s],o<a.length-1?(o+=1,s=0,d(!0)):(document.removeEventListener("keydown",g),c&&c.cancel(),l&&(l.pause(),l.currentTime=0,l=null),this.experimentData.questionnaire=r,console.log("📝 Questionnaire completed"),this.nextStage()))};d(!0),document.addEventListener("keydown",g);const x=()=>{c&&c.cancel(),l&&(l.pause(),l.currentTime=0,l=null),document.removeEventListener("keydown",g)};this._questionnaireCleanup=x};this.container.innerHTML=`
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

          <p style="font-size: 20px; color: #333; margin-top: 20px;">
            When you are ready, press the <span style="background:#f0f0f0; padding:4px 8px; border-radius:4px; font-family:monospace;">spacebar</span> to start the questions.
          </p>
        </div>
      </div>
    `;const e=document.getElementById("questionnaireInstructionsVideo");e&&(e.autoplay=!0,e.playsInline=!0,(()=>(e.muted=!1,e.volume=1,e.play()))().catch(r=>{console.warn("Unable to autoplay questionnaire video with sound, falling back to muted:",r),e.muted=!0,e.play().catch(s=>{console.warn("Unable to autoplay muted questionnaire video:",s)});const o=()=>{try{e.muted=!1,e.volume=1,e.play().catch(s=>{console.warn("Unable to start questionnaire video with sound after interaction:",s)})}catch{}document.removeEventListener("click",o),document.removeEventListener("keydown",o),e.removeEventListener("click",o)};document.addEventListener("click",o,{once:!0}),document.addEventListener("keydown",o,{once:!0}),e.addEventListener("click",o,{once:!0})}));const t=a=>{(a.code==="Space"||a.key===" ")&&(a.preventDefault(),a.stopPropagation(),document.removeEventListener("keydown",t,!0),n())};document.addEventListener("keydown",t,!0),document.body.focus()}showEndExperimentInfoStage(){var a;const n=this.generateCompletionCode(),e=()=>{if(!this._lookitDonePosted){this._lookitDonePosted=!0;try{window.parent.postMessage({type:"exp-lookit:next"},"*")}catch(r){console.warn("Unable to post exp-lookit:next message:",r)}}};this.container.innerHTML=`
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
    `;try{const t=document.getElementById("copyCodeBtn"),a=document.getElementById("completionCodeText"),r=document.getElementById("copyStatus");t&&a&&t.addEventListener("click",async()=>{const o=(a.textContent||"").trim();try{if(navigator.clipboard&&navigator.clipboard.writeText)await navigator.clipboard.writeText(o);else{const s=document.createElement("textarea");s.value=o,document.body.appendChild(s),s.select(),document.execCommand("copy"),document.body.removeChild(s)}r&&(r.style.display="inline",t.textContent="Copied!",t.style.background="#28a745",setTimeout(()=>{r.style.display="none",t.textContent="Copy Code",t.style.background="#007bff"},2e3))}catch(s){console.warn("Copy failed:",s)}})}catch{}}isHumanHumanMode(){return this.gameMode==="human-human"||q&&typeof q.isHumanHumanMode=="function"&&q.isHumanHumanMode()?!0:new URLSearchParams(window.location.search).get("mode")==="human-human"}assetUrl(n){const e="/MinimalCoordinationGame-CHS-unmoderated/",t=String(n||"").replace(/^\/+/,"");return`${e}${t}`}getInstructionsForExperiment(n){var a;return{"1P1G":{html:`
          <div style="display: flex; align-items: center; justify-content: center; min-height: 100vh; background: #f8f9fa;">
            <div style="background: white; padding: 40px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); max-width: 800px; text-align: center;">
              <h2 style="color: ${((a=i==null?void 0:i.game)==null?void 0:a.studyRLCondition)==="individual"?"#2563eb":"#dc2626"}; margin-bottom: 30px; font-size: 36px;">Game 1</h2>
              <h3 style="color: #000; margin-bottom: 20px; font-size: 24px;">Before we begin, let's practice a few rounds!</h3>
              <div style="margin: 20px 0; text-align: center;">
                <video 
                  id="game1Video"
                  width="100%" 
                  height="400" 
                  controls
                  autoplay
                  muted
                  playsinline
                  style="max-width: 600px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                  <source src="${this.assetUrl("game1.mp4")}" type="video/mp4">
                  Your browser does not support the video tag.
                </video>
              </div>
              <p style="font-size: 22px; margin-top: 30px;">Press <strong>space bar</strong> to begin.</p>
            </div>
          </div>
        `},"1P2G":{html:`
          <div style="display: flex; align-items: center; justify-content: center; min-height: 100vh; background: #f8f9fa;">
            <div style="background: white; padding: 40px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); max-width: 800px; text-align: center;">
              <h2 style="color: #333; margin-bottom: 30px; font-size: 36px;">Game 2</h2>
              <h3 style="color: #000; margin-bottom: 20px; font-size: 24px;">Great job!</h3>
              <div style="margin: 20px 0; text-align: center;">
                <video 
                  id="game2Video"
                  width="100%" 
                  height="400" 
                  controls
                  autoplay
                  muted
                  playsinline
                  style="max-width: 600px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                  <source src="${this.assetUrl("game2.mp4")}" type="video/mp4">
                  Your browser does not support the video tag.
                </video>
              </div>
              <p style="font-size: 22px; margin-top: 30px;">Press <strong>space bar</strong> to begin.</p>
            </div>
          </div>
        `},"2P2G":{html:`
          <div style="display: flex; align-items: center; justify-content: center; min-height: 100vh; background: #f8f9fa;">
            <div style="background: white; padding: 40px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); max-width: 800px; text-align: center;">
              <h2 style="color: #333; margin-bottom: 30px; font-size: 36px;">Game 3</h2>
              <h3 style="color: #000; margin-bottom: 20px; font-size: 24px;">Well done!</h3>
              <div style="margin: 20px 0; text-align: center;">
                <video 
                  id="game3Video"
                  width="100%" 
                  height="400" 
                  controls
                  autoplay
                  muted
                  playsinline
                  style="max-width: 600px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                  <source src="${this.assetUrl("game3.mp4")}" type="video/mp4">
                  Your browser does not support the video tag.
                </video>
              </div>
              <p style="font-size: 22px; margin-top: 30px;">Press <strong>space bar</strong> to begin.</p>
            </div>
          </div>
        `},"2P3G":{html:`
          <div style="display: flex; align-items: center; justify-content: center; min-height: 100vh; background: #f8f9fa;">
            <div style="background: white; padding: 40px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); max-width: 800px; text-align: center;">
              <h2 style="color: #333; margin-bottom: 30px; font-size: 36px;">Game 4</h2>
              <h3 style="color: #000; margin-bottom: 20px; font-size: 24px;">Good job!</h3>
              <div style="margin: 20px 0; text-align: center;">
                <video 
                  id="game4Video"
                  width="100%" 
                  height="400" 
                  controls
                  autoplay
                  muted
                  playsinline
                  style="max-width: 600px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                  <source src="${this.assetUrl("video2.mp4")}" type="video/mp4">
                  Your browser does not support the video tag.
                </video>
              </div>
              <p style="font-size: 22px; margin-top: 30px;">Press <strong>space bar</strong> to begin.</p>
            </div>
          </div>
        `}}[n]||{html:`
        <div style="display: flex; align-items: center; justify-content: center; min-height: 100vh; background: #f8f9fa;">
          <div style="background: white; padding: 40px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); max-width: 800px; text-align: center;">
            <h2 style="color: #333; margin-bottom: 30px;">Game Instructions</h2>
            <p style="font-size: 18px; margin-bottom: 30px;">Use arrow keys to navigate and reach the goals.</p>
            <p style="font-size: 20px; margin-top: 30px;">Press <strong>space bar</strong> to begin.</p>
          </div>
        </div>
      `}}generateParticipantId(){return"P"+Date.now().toString(36)+Math.random().toString(36).substr(2,5)}getParticipantId(){try{const n=new URLSearchParams(window.location.search),e=n.get("PROLIFIC_PID")||n.get("prolific_pid");if(e)return e}catch{}return this.generateParticipantId()}generateCompletionCode(){var n;return((n=i==null?void 0:i.game)==null?void 0:n.prolificCompletionCode)||"CTNDR8GV"}initializeSuccessThresholdTracking(){this.successThreshold.consecutiveSuccesses=0,this.successThreshold.totalTrialsCompleted=0,this.successThreshold.experimentEndedEarly=!1,this.successThreshold.lastSuccessTrial=-1,this.successThreshold.successHistory=[]}updateSuccessThresholdTracking(n,e){this.successThreshold.totalTrialsCompleted++,this.successThreshold.successHistory.push(n),n?(this.successThreshold.consecutiveSuccesses++,this.successThreshold.lastSuccessTrial=e):this.successThreshold.consecutiveSuccesses=0,console.log(`Success threshold update - Trial ${e+1}: ${n?"SUCCESS":"FAILURE"}`),console.log(`  Consecutive successes: ${this.successThreshold.consecutiveSuccesses}/${i.game.successThreshold.consecutiveSuccessesRequired}`),console.log(`  Total trials: ${this.successThreshold.totalTrialsCompleted}/${i.game.successThreshold.maxTrials}`)}shouldEndExperimentDueToSuccessThreshold(){return!1}shouldContinueToNextTrial(n,e){if(!n.includes("2P"))return e<i.game.experiments.numTrials[n]-1;if(this.shouldEndExperimentDueToSuccessThreshold())return console.log(`Ending ${n} experiment due to success threshold`),!1;const t=i.game.experiments.numTrials[n]||i.game.successThreshold.maxTrials;return e>=t-1?(console.log(`Ending ${n} experiment: Completed ${t} trials`),!1):!0}addNextTrialStages(n,e,t){const a=this.currentStageIndex,r=[{type:"fixation",experimentType:n,experimentIndex:e,trialIndex:t,handler:()=>this.showFixationStage(n,e,t)},{type:"trial",experimentType:n,experimentIndex:e,trialIndex:t,handler:()=>this.runTrialStage(n,e,t)},{type:"post-trial",experimentType:n,experimentIndex:e,trialIndex:t,handler:()=>this.showPostTrialStage(n,e,t)}];this.stages.splice(a+1,0,...r),console.log(`Added next trial stages for ${n} trial ${t+1}`)}skipToNextExperimentOrCompletion(n){console.log(`Skipping to next experiment or completion from ${n}`);let e=this.currentStageIndex+1;for(console.log(`Starting search from stage ${e}`),console.log(`Total stages in timeline: ${this.stages.length}`);e<this.stages.length;){const t=this.stages[e];if(console.log(`Checking stage ${e}: ${t.type}`),t.type==="game-feedback"||t.type==="questionnaire"||t.type==="completion"||t.experimentType&&t.experimentType!==n){console.log(`Found stopping point: ${t.type}`);break}e++}if(this.currentStageIndex=e,this.currentStageIndex<this.stages.length){const t=this.stages[this.currentStageIndex];t.experimentType&&t.experimentType!==n&&(console.log(`Switching from ${n} to ${t.experimentType} - resetting success threshold`),this.initializeSuccessThresholdTracking()),console.log(`Skipped to stage ${this.currentStageIndex}: ${t.type}`),this.runCurrentStage()}else console.log("No more stages to run")}recordWaitingTime(n,e,t,a,r,o){const s=Math.round(t/1e3*10)/10;this.experimentData.waitingDuration||(this.experimentData.waitingDuration=0),this.experimentData.waitingDuration+=s,this.experimentData.waitingDetails||(this.experimentData.waitingDetails=[]),this.experimentData.waitingDetails.push({experimentType:r,experimentIndex:o,durationSeconds:s,reason:a,startTime:new Date(n).toISOString(),endTime:new Date(e).toISOString()}),console.log("📊 [WAITING] Recorded waiting time:",s+"s (total: "+this.experimentData.waitingDuration+"s)")}}class ee{constructor(n){var e,t,a,r;this.container=n,this.networkManager=null,this.gameStateManager=null,this.uiManager=null,this.experimentManager=null,this.timelineManager=null,this.isInitialized=!1,this.playerIndex=0,this.gameConfig=null,this.useTimelineFlow=!0,this.currentRoomId=null,this._hhSync={pendingMoves:{0:null,1:null}},this._rtSync={syncInterval:null},this._inactivityTracking={enabled:!1,partnerLastMoveTime:null,inactivityTimerId:null,inactivityTimeoutMs:(t=(e=i==null?void 0:i.multiplayer)==null?void 0:e.inactivityFallback)==null?void 0:t.timeoutMs,checkIntervalMs:(r=(a=i==null?void 0:i.multiplayer)==null?void 0:a.inactivityFallback)==null?void 0:r.checkIntervalMs}}async start(n={}){const{mode:e="human-ai",experimentType:t="2P2G",roomId:a=null,useTimeline:r=!0}=n,o=new URLSearchParams(window.location.search);this.useTimelineFlow=o.get("timeline")!=="false"&&r;const s=o.get("ai");s&&q.setPlayerType(2,s),console.log(`Starting application with timeline flow: ${this.useTimelineFlow}`);try{await this.initialize(e,t,a),this.useTimelineFlow?await this.startTimelineFlow(e,t,a):e==="human-human"?await this.startMultiplayerMode(t,a):await this.startSinglePlayerMode(t),console.log("Application started successfully")}catch(l){throw console.error("Failed to start application:",l),l}}async initialize(n,e,t){var o,s;if(this.isInitialized)return;if(this.gameStateManager=new zn,this.uiManager=new Hn(this.container),this.useTimelineFlow&&(this.timelineManager=new ne(this.container),this.setupTimelineEventHandlers()),this.experimentManager=new Zn(this.gameStateManager,this.uiManager,this.timelineManager),new URLSearchParams(window.location.search).get("skipNetwork")==="true")console.log("⚠️ Network connection skipped for testing"),this.networkManager=null;else try{this.networkManager=new Ln,await this.networkManager.connect(),this.setupNetworkEventHandlers(),console.log("✅ Network manager initialized");try{window.__NETWORK_MANAGER__=this.networkManager}catch{}}catch(l){console.warn("⚠️ Failed to initialize network manager:",l.message),console.log("💡 You can test timeline with mock multiplayer using: ?skipNetwork=true"),this.networkManager=null}this.setupUIEventHandlers(),this.isInitialized=!0;try{window.__GAME_APPLICATION__=this}catch{}try{await((s=(o=this.experimentManager)==null?void 0:o.logCurrentAIModel)==null?void 0:s.call(o))}catch{}}async startTimelineFlow(n,e,t){console.log(`🎬 Starting timeline flow for ${n} mode`);const r=new URLSearchParams(window.location.search).get("skipNetwork")==="true";["gpt","human","rl_joint","rl_individual"].includes(i.game.players.player2.type)||q.setPlayerType(2,i.multiplayer.fallbackAIType||"rl_joint"),this.uiManager.setPlayerInfo(0,"human-ai"),r||(this.networkManager&&this.networkManager.isConnected?(console.log("🌐 Enabling real multiplayer integration for collaboration phases"),this.setupMultiplayerTimelineIntegration(e,t)):(console.log("🤖 Using mock multiplayer for timeline (server not available or skipped)"),this.setupMockMultiplayerForTimeline())),this.timelineManager.start()}setupMultiplayerTimelineIntegration(n,e){this.timelineManager.on("waiting-for-partner",async t=>{console.log("Timeline requesting partner connection..."),i.game.players.player2.type="human",console.log("🎮 Set player2 type to human for multiplayer experiment");try{const a=await this.networkManager.joinRoom({roomId:e,gameMode:"human-human",experimentType:t.experimentType});console.log("Joined room during timeline flow:",a)}catch(a){console.error("Failed to join room during timeline:",a)}}),this.timelineManager.on("player-ready",()=>{console.log("🎮 Timeline player clicked ready - forwarding to network"),this.networkManager&&this.networkManager.isConnected?this.networkManager.setPlayerReady():console.warn("⚠️ Network manager not available for player ready")}),this.timelineManager.on("match-play-ready",()=>{console.log("🎮 Timeline match-play SPACE pressed - forwarding to network"),this.networkManager&&this.networkManager.isConnected?this.networkManager.setMatchPlayReady():console.warn("⚠️ Network manager not available for match-play-ready")}),this.timelineManager.on("check-partner-status",async t=>{if(console.log("🔍 Timeline checking partner status..."),!this.networkManager||!this.networkManager.isConnected){console.log("❌ No network connection - switching to AI mode"),this.activateAIFallbackForExperiment(t.experimentType);return}if(!!!this.currentRoomId){console.log("❌ Not in a room - switching to AI mode"),this.activateAIFallbackForExperiment(t.experimentType);return}try{this.networkManager.socket.emit("ping-room-status");const r=await new Promise(s=>{const l=setTimeout(()=>s(null),2e3);this.networkManager.socket.once("room-status-response",c=>{clearTimeout(l),s(c)})});if(!r){console.log("❌ No response from server - switching to AI mode"),this.activateAIFallbackForExperiment(t.experimentType),this.timelineManager&&(this.timelineManager.partnerStatusChecked=!0,this.timelineManager.shouldSkipMatchPlay=!0);return}if(!(r.playerCount>1)){console.log("❌ No other players in room - switching to AI mode"),this.activateAIFallbackForExperiment(t.experimentType),this.timelineManager&&(this.timelineManager.partnerStatusChecked=!0,this.timelineManager.shouldSkipMatchPlay=!0);return}console.log("✅ Partner status check passed - partner appears to be connected"),this.timelineManager&&(this.timelineManager.partnerStatusChecked=!0,this.timelineManager.shouldSkipMatchPlay=!1)}catch(r){console.error("Error checking partner status:",r),console.log("❌ Error checking partner status - switching to AI mode"),this.activateAIFallbackForExperiment(t.experimentType),this.timelineManager&&(this.timelineManager.partnerStatusChecked=!0,this.timelineManager.shouldSkipMatchPlay=!0)}})}setupMockMultiplayerForTimeline(){console.log("🤖 Setting up mock multiplayer timeline events..."),this.timelineManager.on("waiting-for-partner",async n=>{console.log("🤖 Mock: Timeline waiting for partner - simulating connection..."),i.game.players.player2.type="human",console.log("🎮 Mock: Set player2 type to human for mock multiplayer experiment"),setTimeout(()=>{console.log("🤖 Mock: Partner found, showing ready button"),this.timelineManager.emit("partner-connected",{players:[{id:"mock-player1",name:"You"},{id:"mock-player2",name:"AI Partner"}]})},2e3)}),this.timelineManager.on("player-ready",()=>{console.log("🤖 Mock: Player clicked ready, simulating partner ready..."),setTimeout(()=>{console.log("🤖 Mock: Both players ready, starting game"),this.uiManager.setPlayerInfo(0,"human-human"),this.timelineManager.emit("all-players-ready",{gameMode:"human-human",players:[{id:"mock-player1",playerIndex:0},{id:"mock-player2",playerIndex:1}]})},1e3)}),console.log("✅ Mock multiplayer timeline events registered")}setupTimelineEventHandlers(){this.timelineManager&&(this.timelineManager.on("save-data",n=>{console.log("💾 Timeline requesting data save:",n),this.saveExperimentData(n)}),this.timelineManager.on("show-trial-feedback",n=>{console.log("📊 Timeline requesting trial feedback:",n),this.experimentManager&&this.experimentManager.handleTrialFeedback(n)}),this.timelineManager.on("partner-connected",()=>{console.log("👥 Partner connected via timeline")}),this.timelineManager.on("all-players-ready",()=>{console.log("🎮 All players ready via timeline")}),this.timelineManager.on("fallback-to-ai",n=>{var e,t,a,r,o,s;try{const{reason:l="unknown",stage:c="waiting-for-partner",at:h=Date.now(),fallbackAIType:d=null}=n||{};try{(t=(e=this.experimentManager)==null?void 0:e.logCurrentAIModel)==null||t.call(e)}catch{}(r=(a=this.gameStateManager)==null?void 0:a.recordPartnerFallback)==null||r.call(a,{reason:l,stage:c,at:h,fallbackAIType:d});try{(s=(o=this.experimentManager)==null?void 0:o.logCurrentAIModel)==null||s.call(o)}catch{}}catch{}}),console.log("📡 Timeline event handlers setup completed"))}async saveExperimentData(n){var e,t,a,r,o,s,l,c,h;try{const d=((t=(e=this.gameStateManager)==null?void 0:e.getExperimentData)==null?void 0:t.call(e))||{allTrialsData:[],successThreshold:{}};let g=n.participantId;if(!g){const y=new URLSearchParams(window.location.search);g=y.get("PROLIFIC_PID")||y.get("prolific_pid")||`participant_${Date.now()}`}const x=this.currentRoomId||n.roomId||null,p={participantId:g,timestamp:new Date().toISOString(),experimentOrder:((r=(a=i==null?void 0:i.game)==null?void 0:a.experiments)==null?void 0:r.order)||[],allTrialsData:d.allTrialsData||[],questionnaireData:n.questionnaire||null,successThreshold:d.successThreshold||{},completionCode:n.completionCode||"",version:((o=i==null?void 0:i.game)==null?void 0:o.version)||"2.0.0",experimentType:((s=this.timelineManager)==null?void 0:s.gameMode)==="human-human"?"human-human":"human-AI",roomId:x,waitingDuration:n.waitingDuration||0,waitingDetails:n.waitingDetails||[]},m=JSON.stringify(p,null,2),u=i.server.googleAppsScriptUrl,T=i.server.enableGoogleDriveSave,f=typeof window<"u"&&typeof window.XLSX<"u";if(T&&u&&f)try{const y=window.XLSX,G=y.utils.book_new(),v=p.allTrialsData||[];if(v.length>0){const z=v.map(V=>{const B={};for(const an in V){const tn=V[an];B[an]=Array.isArray(tn)||tn&&typeof tn=="object"?JSON.stringify(tn):tn}return B.roomId=p.roomId||"",B.participantId=p.participantId,B.currentPlayer=this.playerIndex!==void 0?this.playerIndex+1:null,B.newGoalConditionType&&!B.distanceCondition&&(B.distanceCondition=B.newGoalConditionType),delete B.newGoalConditionType,B}),N=new Set;z.forEach(V=>Object.keys(V).forEach(B=>N.add(B)));const Y=["trialIndex","experimentType","partnerAgentType","currentPlayer","participantId","roomId","humanPlayerIndex","aiPlayerIndex","player1StartPosition","player2StartPosition","initialGoalPositions","partnerFallbackOccurred","partnerFallbackReason","partnerFallbackStage","partnerFallbackTime","partnerFallbackAIType","collaborationSucceeded","player1GoalReachedStep","player2GoalReachedStep","newGoalPresented","newGoalPosition","distanceCondition","isNewGoalCloserToPlayer2","trialStartTime","gptErrorEvents","currentPlayerIndex","player1Trajectory","player2Trajectory","player1Actions","player2Actions","player1RT","player2RT","player1CurrentGoal","player2CurrentGoal","player1FirstDetectedGoal","player2FirstDetectedGoal","player1FinalReachedGoal","player2FinalReachedGoal","firstDetectedSharedGoal"],Z=[];Y.forEach(V=>{N.has(V)&&(Z.push(V),N.delete(V))}),Z.push(...Array.from(N).sort());const en=[Z,...z.map(V=>Z.map(B=>B in V?V[B]:""))],on=y.utils.aoa_to_sheet(en);y.utils.book_append_sheet(G,on,"ExperimentData")}else{const z=y.utils.aoa_to_sheet([["No experimental data available"],[new Date().toISOString()]]);y.utils.book_append_sheet(G,z,"ExperimentData")}const b=((h=(c=(l=i==null?void 0:i.game)==null?void 0:l.players)==null?void 0:c.player2)==null?void 0:h.type)||"",w=function(){var Z,en,on,V,B,an,tn,gn,mn,un,yn;const z=(on=(en=(Z=i==null?void 0:i.game)==null?void 0:Z.players)==null?void 0:en.player1)==null?void 0:on.type,N=(an=(B=(V=i==null?void 0:i.game)==null?void 0:V.players)==null?void 0:B.player2)==null?void 0:an.type,Y=z!=="human"?z:N!=="human"?N:"human";if(Y==="human")return"human";if(Y==="gpt"){const dn=(mn=(gn=(tn=i==null?void 0:i.game)==null?void 0:tn.agent)==null?void 0:gn.gpt)==null?void 0:mn.model;return dn&&String(dn).trim().length>0?String(dn):(console.warn("⚠️ GPT model not cached in CONFIG for export, using configured default"),"gpt-4o")}return Y==="rl_joint"?"joint-rl":Y==="rl_individual"?"individual-rl":Y==="ai"?((yn=(un=i==null?void 0:i.game)==null?void 0:un.agent)==null?void 0:yn.type)==="individual"?"individual-rl":"joint-rl":Y||"unknown"}(),M=d&&Array.isArray(d.fallbackEvents)?d.fallbackEvents:[],A=(p.allTrialsData||[]).filter(z=>z.experimentType&&z.experimentType.includes("2P")),D=A.filter(z=>z.collaborationSucceeded===!0).length,k=A.length>0?Math.round(D/A.length*100):0,C=[["participantId",p.participantId],["roomId",p.roomId||""],["experimentOrder",JSON.stringify(p.experimentOrder||[])],["experimentType",p.experimentType],["partnerAgentType",w],["fallbackEventCount",M.length],["fallbackEvents",JSON.stringify(M)],["waitingDuration",p.waitingDuration||0],["waitingDetails",JSON.stringify(p.waitingDetails||[])],["collaborationTrialsTotal",A.length],["collaborationSuccessCount",D],["collaborationSuccessRate",k],["version",p.version],["timestamp",p.timestamp]],_=y.utils.aoa_to_sheet(C);y.utils.book_append_sheet(G,_,"Meta");const H=[["Metric","Value"],["Total Collaboration Trials",A.length],["Collaboration Successes",D],["Collaboration Failures",A.length-D],["Collaboration Success Rate (%)",k],["",""],["Experiment Type","Success Count","Total Trials","Success Rate (%)"]];[...new Set(A.map(z=>z.experimentType))].forEach(z=>{const N=A.filter(en=>en.experimentType===z),Y=N.filter(en=>en.collaborationSucceeded===!0).length,Z=N.length>0?Math.round(Y/N.length*100):0;H.push([z,Y,N.length,Z])});const J=y.utils.aoa_to_sheet(H);y.utils.book_append_sheet(G,J,"CollaborationSummary");const L=p.questionnaireData||p.questionnaire||{};let E;if(L&&typeof L=="object"&&!Array.isArray(L)){const z=Object.keys(L),N=z.map(Y=>L[Y]);E=y.utils.aoa_to_sheet([z,N])}else Array.isArray(L)?E=y.utils.aoa_to_sheet(L):E=y.utils.aoa_to_sheet([["Questionnaire"],[JSON.stringify(L)]]);y.utils.book_append_sheet(G,E,"Questionnaire");const F=y.write(G,{bookType:"xlsx",type:"array"}),O=btoa(String.fromCharCode.apply(null,new Uint8Array(F))),W=new Date().toISOString().replace(/[:.]/g,"-"),R=String(p.participantId).replace(/[^a-zA-Z0-9_-]/g,"_"),Q=String(p.roomId||"no-room").replace(/[^a-zA-Z0-9_-]/g,"_"),nn=`experiment_data_${R}_room_${Q}_${W}.xlsx`,K=new FormData;K.append("filename",nn),K.append("filedata",O),K.append("filetype","excel"),fetch(u,{method:"POST",mode:"no-cors",body:K}).then(()=>{console.log("✅ Google Drive save attempted via Apps Script");try{this.timelineManager&&this.timelineManager.emit("data-save-success"),alert("Data saved successfully!")}catch{}}).catch(z=>{console.warn("⚠️ Google Drive save failed. Local saving is disabled.",z)})}catch(y){console.warn("⚠️ Excel/Apps Script save failed. Local saving is disabled.",y)}else console.warn("⚠️ Google Drive save disabled or XLSX not available. Local saving is disabled.")}catch(d){console.error("Failed to save/export experiment data:",d)}}async startSinglePlayerMode(n){q.setPlayerType(2,i.multiplayer.fallbackAIType||"rl_joint"),this.uiManager.setPlayerInfo(0,"human-ai"),this.uiManager.showMainScreen(),await this.experimentManager.startExperimentSequence([n])}async startMultiplayerMode(n,e){i.game.players.player2.type="human",this.uiManager.showLobbyScreen();try{const t=await this.networkManager.joinRoom({roomId:e,gameMode:"human-human",experimentType:n});console.log("Joined room:",t),this.uiManager.updateLobbyInfo(t)}catch(t){console.error("Failed to join room:",t),this.uiManager.showError("Failed to join game room. Please try again.")}}setupNetworkEventHandlers(){this.networkManager&&(this.networkManager.on("room-joined",n=>{if(console.log("Room joined:",n),n&&n.roomId){this.currentRoomId=n.roomId;try{window.__ROOM_ID__=n.roomId;const e=String(n.roomId||"");let t=0;for(let a=0;a<e.length;a++)t=(t<<5)-t+e.charCodeAt(a),t|=0;window.__SESSION_SEED__=Math.abs(t)}catch{}}try{typeof n.isHost=="boolean"&&(this.playerIndex=n.isHost?0:1),this.useTimelineFlow&&(this.uiManager.setPlayerInfo(this.playerIndex,n.gameMode||"human-human"),this.timelineManager&&this.timelineManager.setPlayerInfo(this.playerIndex,n.gameMode||"human-human"))}catch{}this.useTimelineFlow||this.uiManager.updateLobbyInfo(n)}),this.networkManager.on("player-joined",n=>{console.log("Player joined:",n),this.useTimelineFlow&&this.timelineManager?this.timelineManager.emit("partner-connected",n):this.uiManager.updatePlayerList(n.players)}),this.networkManager.on("room-full",n=>{var e,t;console.log("Room is full - both players connected:",n);try{const a=(t=(e=this.networkManager)==null?void 0:e.socket)==null?void 0:t.id,r=Array.isArray(n==null?void 0:n.players)?n.players.findIndex(o=>o.id===a):-1;(r===0||r===1)&&(this.playerIndex=r,this.useTimelineFlow&&(this.uiManager.setPlayerInfo(this.playerIndex,n.gameMode||"human-human"),this.timelineManager&&this.timelineManager.setPlayerInfo(this.playerIndex,n.gameMode||"human-human")))}catch{}this.useTimelineFlow&&this.timelineManager&&this.timelineManager.emit("partner-connected",n)}),this.networkManager.on("player-disconnected",n=>{var e,t,a,r,o,s,l,c,h,d,g,x,p,m,u,T,f,y;if(console.log("Player disconnected:",n),this.useTimelineFlow){console.log("Partner disconnected during timeline flow - switching to AI");const G=((e=i==null?void 0:i.multiplayer)==null?void 0:e.fallbackAIType)||"rl_joint";let v=null;try{const w=this.gameConfig;w&&Array.isArray(w.players)&&(v=w.players.findIndex(M=>M.id===(n==null?void 0:n.playerId)))}catch{}v!==0&&v!==1&&(v=this.playerIndex===0?1:0);const b=v+1;try{(a=(t=this.experimentManager)==null?void 0:t.activateAIFallback)==null||a.call(t,G,b)}catch{}try{(o=(r=this.experimentManager)==null?void 0:r.logCurrentAIModel)==null||o.call(r)}catch{}try{(l=(s=this.gameStateManager)==null?void 0:s.recordPartnerFallback)==null||l.call(s,{reason:"disconnect",stage:"in-game",at:Date.now(),fallbackAIType:G})}catch{}try{(h=(c=this.experimentManager)==null?void 0:c.logCurrentAIModel)==null||h.call(c)}catch{}try{this.uiManager.setPlayerInfo(this.playerIndex,"human-ai")}catch{}try{this.timelineManager&&(this.timelineManager.gameMode="human-ai",this.timelineManager.emit("partner-connected",{connectedAt:Date.now(),players:(n==null?void 0:n.players)||[]}),this.timelineManager.emit("all-players-ready",{gameMode:"human-ai"}))}catch{}}else{this.uiManager.updatePlayerList(n.players);const G=((d=i==null?void 0:i.multiplayer)==null?void 0:d.fallbackAIType)||"rl_joint";let v=null;try{const w=this.gameConfig;w&&Array.isArray(w.players)&&(v=w.players.findIndex(M=>M.id===(n==null?void 0:n.playerId)))}catch{}v!==0&&v!==1&&(v=this.playerIndex===0?1:0);const b=v+1;try{(x=(g=this.experimentManager)==null?void 0:g.activateAIFallback)==null||x.call(g,G,b)}catch{}try{(m=(p=this.experimentManager)==null?void 0:p.logCurrentAIModel)==null||m.call(p)}catch{}try{(T=(u=this.gameStateManager)==null?void 0:u.recordPartnerFallback)==null||T.call(u,{reason:"disconnect",stage:"in-game",at:Date.now(),fallbackAIType:G})}catch{}try{(y=(f=this.experimentManager)==null?void 0:f.logCurrentAIModel)==null||y.call(f)}catch{}}}),this.networkManager.on("player-ready-status",n=>{if(console.log("Player ready status update:",n),this.useTimelineFlow&&this.timelineManager){const e=n.players&&n.players.every(t=>t.isReady);console.log(`All players ready: ${e}`,n.players),e&&(console.log("🎮 All players ready - emitting to timeline"),this.timelineManager.emit("all-players-ready",{gameMode:"human-human",players:n.players}))}else this.uiManager.updatePlayerReadyStatus(n.players)}),this.networkManager.on("game-started",n=>{console.log("Game started:",n),this.gameConfig=n;const e=this.networkManager.socket.id,t=n.players.find(a=>a.id===e);if(t){this.playerIndex=t.playerIndex,console.log(`I am player ${this.playerIndex+1} (${this.playerIndex===0?"red":"purple"})`);try{window.__PLAYER_INDEX__=this.playerIndex,window.__IS_HOST__=this.playerIndex===0}catch{}}this.useTimelineFlow?(this.uiManager.setPlayerInfo(this.playerIndex,n.gameMode),this.timelineManager.setPlayerInfo(this.playerIndex,n.gameMode),this.timelineManager.emit("all-players-ready",n)):this.startNetworkedGame(n)}),this.networkManager.on("player-action",n=>{console.log("Player action received:",n),this.handleRemotePlayerAction(n)}),this.networkManager.on("game-state-update",n=>{console.log("Game state update received");const e=i.game.players.player1.type==="human"&&i.game.players.player2.type==="human",t=q.isSynchronizedHumanTurnsEnabled(n==null?void 0:n.experimentType);if(e&&!t){try{const o=(()=>{var c,h,d;try{return(((d=(h=(c=this.gameStateManager)==null?void 0:c.getCurrentState)==null?void 0:h.call(c))==null?void 0:d.currentGoals)||[]).length}catch{return 0}})();if((Array.isArray(n==null?void 0:n.currentGoals)?n.currentGoals.length:0)>o){console.log("🎯 Detected new goal on remote — forcing immediate sync"),this.gameStateManager.syncState(n),this.uiManager.updateGameDisplay(this.gameStateManager.getCurrentState()),this.gameStateManager.markStateSynced();return}}catch{}const a=this.gameStateManager.shouldSyncState(),r=this.gameStateManager.hasRecentLocalMoves();a&&!r?(console.log("🔄 Syncing remote state (no recent local moves)"),this.gameStateManager.syncState(n),this.uiManager.updateGameDisplay(this.gameStateManager.getCurrentState()),this.gameStateManager.markStateSynced()):r&&console.log("⏸️ Skipping sync - recent local moves detected")}else this.gameStateManager.syncState(n),this.uiManager.updateGameDisplay(this.gameStateManager.getCurrentState()),t&&(this._hhSync.pendingMoves[0]=null,this._hhSync.pendingMoves[1]=null)}),this.networkManager.on("error",n=>{console.error("Network error:",n),n.type==="connection_lost"&&n.canRetry?this.uiManager.showConnectionLostError(n.message,()=>{this.retryConnection()}):this.uiManager.showError(n.message)}),this.networkManager.on("disconnect",()=>{console.log("Disconnected from server"),this.stopRealTimeSync(),this.uiManager.showConnectionLostError("Connection lost. Attempting to reconnect...",()=>{this.retryConnection()})}),this.networkManager.on("reconnecting",n=>{this.uiManager.showReconnectingMessage(`Reconnecting... (${n.attempt}/${n.maxAttempts})`)}))}setupUIEventHandlers(){this.uiManager.on("player-ready",()=>{this.networkManager&&this.networkManager.setPlayerReady()}),this.uiManager.on("player-move",async n=>{var c,h,d,g,x,p,m,u,T,f,y;try{const G=(h=(c=this.gameStateManager)==null?void 0:c.getCurrentState)==null?void 0:h.call(c),v=(G==null?void 0:G.experimentType)||"",b=String(v).includes("2P"),w=!!(G!=null&&G.player1&&(G!=null&&G.player2));if(!b||!w){this.handlePlayerMove(n);return}}catch{}const e=this.playerIndex===0?1:0,t=(x=(g=(d=i.game)==null?void 0:d.players)==null?void 0:g[e===0?"player1":"player2"])==null?void 0:x.type,a=(m=(p=i.game)==null?void 0:p.agent)==null?void 0:m.synchronizedMoves,r=t!=="human",o=q.isSynchronizedHumanTurnsEnabled((f=(T=(u=this.gameStateManager)==null?void 0:u.getCurrentState)==null?void 0:T.call(u))==null?void 0:f.experimentType),s=!!(this.networkManager&&this.networkManager.isConnected);if(o&&(!r&&s)){try{await this.handleHumanHumanSynchronizedMove(n)}catch(G){console.warn("HH sync move failed, falling back to immediate move:",(G==null?void 0:G.message)||G),this.handlePlayerMove(n)}return}if(r&&a&&((y=this.experimentManager)!=null&&y.handleSynchronizedMove))try{await this.experimentManager.handleSynchronizedMove(n)}catch(G){console.warn("Synchronized move failed, falling back to local move:",(G==null?void 0:G.message)||G),this.handlePlayerMove(n)}else this.handlePlayerMove(n)}),this.uiManager.on("start-experiment",n=>{this.experimentManager.startExperiment(n)}),this.uiManager.on("restart-experiment",()=>{this.experimentManager.restart()})}async startNetworkedGame(n){this.uiManager.setPlayerInfo(this.playerIndex,n.gameMode),this.timelineManager&&this.timelineManager.setPlayerInfo(this.playerIndex,n.gameMode),this.uiManager.showGameScreen(),this.startRealTimeSync(),await this.experimentManager.startMultiplayerExperiment(n)}startRealTimeSync(){i.game.players.player1.type==="human"&&i.game.players.player2.type==="human"&&(this._rtSync.syncInterval=setInterval(()=>{this.networkManager&&this.networkManager.isConnected&&this.gameStateManager.shouldSyncState()&&(this.networkManager.syncGameState(this.gameStateManager.getCurrentState()),this.gameStateManager.markStateSynced())},i.multiplayer.realTimeMovement.stateSyncInterval),console.log("Real-time synchronization started"))}stopRealTimeSync(){this._rtSync.syncInterval&&(clearInterval(this._rtSync.syncInterval),this._rtSync.syncInterval=null),this.gameStateManager&&this.gameStateManager.clearRealTimeSync&&this.gameStateManager.clearRealTimeSync(),console.log("Real-time synchronization stopped")}handlePlayerMove(n){var s,l,c;const e=this.playerIndex+1,t=Date.now(),a=this.networkManager&&this.networkManager.isConnected&&i.game.players.player1.type==="human"&&i.game.players.player2.type==="human",r=q.isSynchronizedHumanTurnsEnabled((c=(l=(s=this.gameStateManager)==null?void 0:s.getCurrentState)==null?void 0:l.call(s))==null?void 0:c.experimentType);if(a&&!r){const h=this.gameStateManager.processPlayerMoveRealTime(e,n,t,!0,this.playerIndex);if(!h.success){if(h.reason==="throttled")return;console.warn("Move rejected:",h.reason);return}this.uiManager.updateGameDisplay(this.gameStateManager.getCurrentState()),this.networkManager.isConnected&&(this.networkManager.sendGameAction({type:"move",direction:n,playerIndex:this.playerIndex,timestamp:t,moveId:h.moveId}),this.gameStateManager.shouldSyncState()&&(this.networkManager.syncGameState(this.gameStateManager.getCurrentState()),this.gameStateManager.markStateSynced())),h.trialComplete&&this.handleTrialComplete(h);return}const o=this.gameStateManager.processPlayerMove(e,n,this.playerIndex);this.networkManager&&this.networkManager.isConnected&&this.networkManager.sendGameAction({type:"move",direction:n,playerIndex:this.playerIndex,timestamp:t}),this.uiManager.updateGameDisplay(this.gameStateManager.getCurrentState()),o.trialComplete&&this.handleTrialComplete(o)}handleRemotePlayerAction(n){var t,a,r,o,s,l;const{action:e}=n;if(e.type==="move"){const c=e.playerIndex+1;if(e.playerIndex!==this.playerIndex){console.log("🎮 Received partner move from player",e.playerIndex,"direction:",e.direction),this.updatePartnerLastMoveTime();const h=i.game.players.player1.type==="human"&&i.game.players.player2.type==="human",d=q.isSynchronizedHumanTurnsEnabled((r=(a=(t=this.gameStateManager)==null?void 0:t.getCurrentState)==null?void 0:a.call(t))==null?void 0:r.experimentType);let g;h&&!d?g=this.gameStateManager.processPlayerMoveRealTime(c,e.direction,e.timestamp||Date.now(),!1,e.playerIndex):g=this.gameStateManager.processPlayerMove(c,e.direction,e.playerIndex),this.uiManager.updateGameDisplay(this.gameStateManager.getCurrentState()),g&&g.trialComplete&&this.handleTrialComplete(g)}return}if(e.type==="proposed-move"){if(!q.isSynchronizedHumanTurnsEnabled((l=(s=(o=this.gameStateManager)==null?void 0:o.getCurrentState)==null?void 0:s.call(o))==null?void 0:l.experimentType))return;const h=!!(typeof window<"u"&&window.__IS_HOST__),d=e.playerIndex;this._hhSync.pendingMoves[d]=e.direction,h&&this.tryResolveHumanHumanTurn()}}async handleHumanHumanSynchronizedMove(n){this._hhSync.pendingMoves[this.playerIndex]=n,this.networkManager&&this.networkManager.isConnected&&this.networkManager.sendGameAction({type:"proposed-move",direction:n,playerIndex:this.playerIndex,timestamp:Date.now()}),!!(typeof window<"u"&&window.__IS_HOST__)&&this.tryResolveHumanHumanTurn()}tryResolveHumanHumanTurn(){const n=this._hhSync.pendingMoves[0],e=this._hhSync.pendingMoves[1];if(!n||!e)return;const t=this.gameStateManager.processSynchronizedMoves(n,e);this.uiManager.updateGameDisplay(this.gameStateManager.getCurrentState()),this.networkManager&&this.networkManager.isConnected&&this.networkManager.syncGameState(this.gameStateManager.getCurrentState()),this._hhSync.pendingMoves[0]=null,this._hhSync.pendingMoves[1]=null,t!=null&&t.trialComplete&&this.handleTrialComplete(t)}handleTrialComplete(n){this.networkManager&&this.networkManager.isConnected&&this.networkManager.sendTrialComplete(n),this.experimentManager.handleTrialComplete(n)}async retryConnection(){if(this.networkManager){console.log("Attempting to reconnect...");try{await this.networkManager.retryConnection()?(this.uiManager.showSuccessMessage("Reconnected successfully!"),this.currentRoomId&&await this.networkManager.joinRoom({roomId:this.currentRoomId})):this.uiManager.showError("Reconnection failed. Please refresh the page.")}catch(n){console.error("Reconnection error:",n),this.uiManager.showError("Reconnection failed. Please refresh the page.")}}}activateAIFallbackForExperiment(n){var a,r,o,s,l;console.log(`🤖 Activating AI fallback for experiment: ${n}`);const e=((a=i==null?void 0:i.multiplayer)==null?void 0:a.fallbackAIType)||"rl_joint",t=this.playerIndex===0?2:1;q.setPlayerType(t,e),this.timelineManager.gameMode="human-ai";try{(o=(r=this.experimentManager)==null?void 0:r.activateAIFallback)==null||o.call(r,e,t)}catch(c){console.error("Error activating AI fallback:",c)}try{(l=(s=this.gameStateManager)==null?void 0:s.recordPartnerFallback)==null||l.call(s,{reason:"partner-disconnected",stage:"experiment-transition",at:Date.now(),fallbackAIType:e})}catch(c){console.error("Error recording fallback event:",c)}try{this.uiManager.setPlayerInfo(this.playerIndex,"human-ai")}catch(c){console.error("Error updating UI:",c)}this.stopInactivityTracking(),console.log(`✅ AI fallback activated - Player${t} is now ${e}`)}startInactivityTracking(){var a,r;const n=((r=(a=i==null?void 0:i.multiplayer)==null?void 0:a.inactivityFallback)==null?void 0:r.enabled)!==!1,e=i.game.players.player1.type==="human"&&i.game.players.player2.type==="human";if(console.log("🔍 startInactivityTracking called:"),console.log("  - isHumanHuman:",e),console.log("  - inactivityFallbackEnabled:",n),console.log("  - timeoutMs:",this._inactivityTracking.inactivityTimeoutMs),console.log("  - checkIntervalMs:",this._inactivityTracking.checkIntervalMs),!e||!n){e||console.log("⚠️ Not in human-human mode - P1:",i.game.players.player1.type,"P2:",i.game.players.player2.type);return}const t=Math.round(this._inactivityTracking.inactivityTimeoutMs/1e3);console.log(`🕐 Starting partner inactivity tracking (${t}s timeout)`),this._inactivityTracking.inactivityTimerId&&(clearInterval(this._inactivityTracking.inactivityTimerId),this._inactivityTracking.inactivityTimerId=null),this._inactivityTracking.enabled=!0,this._inactivityTracking.partnerLastMoveTime=Date.now(),this._inactivityTracking.inactivityTimerId=setInterval(()=>{this.checkPartnerInactivity()},this._inactivityTracking.checkIntervalMs),console.log("✅ Inactivity tracking timer started with ID:",this._inactivityTracking.inactivityTimerId)}stopInactivityTracking(){this._inactivityTracking.inactivityTimerId&&(clearInterval(this._inactivityTracking.inactivityTimerId),this._inactivityTracking.inactivityTimerId=null),this._inactivityTracking.enabled=!1,console.log("⏹️ Partner inactivity tracking stopped")}updatePartnerLastMoveTime(){this._inactivityTracking.enabled&&(this._inactivityTracking.partnerLastMoveTime=Date.now(),console.log("📝 Partner moved - resetting inactivity timer"))}checkPartnerInactivity(){if(console.log("🔍 checkPartnerInactivity called - enabled:",this._inactivityTracking.enabled,"lastMoveTime:",this._inactivityTracking.partnerLastMoveTime),!this._inactivityTracking.enabled||!this._inactivityTracking.partnerLastMoveTime){console.log("⚠️ Inactivity check skipped - not enabled or no last move time");return}const n=Date.now()-this._inactivityTracking.partnerLastMoveTime;if(console.log(`⏱️ Time since last partner move: ${Math.round(n/1e3)}s (timeout: ${Math.round(this._inactivityTracking.inactivityTimeoutMs/1e3)}s)`),n>=this._inactivityTracking.inactivityTimeoutMs)console.log(`⏰ Partner inactive for ${Math.round(n/1e3)}s - activating AI fallback`),this.stopInactivityTracking(),this.activateAIFallbackDueToInactivity();else{const e=this._inactivityTracking.inactivityTimeoutMs-n;console.log(`⏱️ Partner inactive for ${Math.round(n/1e3)}s, ${Math.round(e/1e3)}s remaining`)}}activateAIFallbackDueToInactivity(){var t,a,r,o,s;console.log("🤖 Activating AI fallback due to partner inactivity");const n=((t=i==null?void 0:i.multiplayer)==null?void 0:t.fallbackAIType)||"rl_joint",e=this.playerIndex===0?2:1;q.setPlayerType(e,n),this.timelineManager&&(this.timelineManager.gameMode="human-ai");try{(r=(a=this.experimentManager)==null?void 0:a.activateAIFallback)==null||r.call(a,n,e)}catch(l){console.error("Error activating AI fallback:",l)}try{(s=(o=this.gameStateManager)==null?void 0:o.recordPartnerFallback)==null||s.call(o,{reason:"partner-inactivity",stage:"in-game",at:Date.now(),fallbackAIType:n})}catch(l){console.error("Error recording fallback event:",l)}try{this.uiManager.showGameStatus("🤖 Partner inactive - switching to AI partner","info"),setTimeout(()=>{this.uiManager.showGameStatus("")},3e3)}catch(l){console.error("Error updating UI:",l)}console.log(`✅ AI fallback activated due to inactivity - Player${e} is now ${n}`)}handleTrialStart(n,e,t){console.log(`🎬 Trial start notification received: ${n} (${e}, ${t})`),console.log("🔍 Player types - P1:",i.game.players.player1.type,"P2:",i.game.players.player2.type);const a=i.game.players.player1.type==="human"&&i.game.players.player2.type==="human";console.log("🔍 Is human-human:",a,"Experiment type:",n),a&&n&&n.includes("2P")?(console.log("🕐 Starting inactivity tracking for human-human trial"),this.startInactivityTracking()):console.log("⚠️ Not starting inactivity tracking - isHumanHuman:",a,"is2P:",n==null?void 0:n.includes("2P"))}handleTrialEnd(){console.log("🔚 Trial end notification received - stopping inactivity tracking"),this.stopInactivityTracking()}destroy(){this.stopRealTimeSync(),this.stopInactivityTracking(),this.networkManager&&this.networkManager.disconnect(),this.uiManager&&this.uiManager.destroy(),this.isInitialized=!1}}const te=new ee(document.getElementById("app")),hn=new URLSearchParams(window.location.search),An=hn.get("mode")||"human-ai",In=hn.get("experiment")||"2P2G",Dn=hn.get("room");console.log("Starting application with:",{mode:An,experimentType:In,roomId:Dn});document.addEventListener("DOMContentLoaded",()=>{te.start({mode:An,experimentType:In,roomId:Dn}).catch(P=>{console.error("Failed to start application:",P),document.getElementById("app").innerHTML=`
      <div style="display: flex; align-items: center; justify-content: center; height: 100vh;">
        <div style="text-align: center; color: #666;">
          <h2>Error</h2>
          <p>Failed to start the experiment: ${P.message}</p>
          <button onclick="window.location.reload()" style="padding: 10px 20px; font-size: 16px;">
            Retry
          </button>
        </div>
      </div>
    `})});
