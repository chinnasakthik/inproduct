//$Id$
class messageboardsdk{
    constructor(domainID,orgId,messagepanel_iconId){
        this.serviceId=domainID.serviceid;
        this.orgId=orgId;
        this.domain=domainID.inproductdomain;
        this.messagepanel_iconId=document.getElementById(messagepanel_iconId);
        this.customizePanelStyle();
        this.customizeMessageStyle();
        this.setOnClickCallback();
    }
  
    customizePanelStyle(panelstyle={}){
        this.panelJson=panelstyle;
    }
  
    customizeMessageStyle(messagestyle={}){
        this.styleJson=messagestyle;
    }
  
    customizeStyles(styles={}){
        if(Object.keys(styles).length > 1){
            styles.messageStyle?this.customizeMessageStyle(styles.messageStyle):'';
            styles.panelStyle?this.customizePanelStyle(styles.panelStyle):'';
        }
    }
  
    setOnClickCallback(funcName){
        this.callback=funcName;
    }
  
    changeOrg(orgID)
    {   if(this.mics_iframe){
        this.messagepanel_iconId.style["pointer-events"] = "none";
        this.messagepanel_iconId.style.opacity = this.panelJson.panelIconOpacity || "0.4";
        document.getElementById("stackedNumber").style.display = 'none';
        this.iconDisabled = true;
        this.mics_iframe.contentWindow.postMessage({
            "type": "orgUpdate",
            "orgID": orgID
        },this.domain);
    }
    }
  
    updateMessageStyle(styleJSON) {
        if(this.mics_iframe){
        this.mics_iframe.contentWindow.postMessage({
            "type": "styleUpdate",
            "styles": styleJSON
        },this.domain);
    }
    }
    initialize(){
        this.urlsrc="https://"+document.domain+"/mics/analytics/stacked.jsp?frameorigin=https://"+document.domain;
        var tipDomain=this.domain.split('//')[1].replace("tipengine.","").split('.').reverse();
        var domainCheck=(document.domain).split('.').reverse();
        domainCheck=domainCheck.slice(0,tipDomain.length).join('');
        tipDomain=tipDomain.join('');
        if(tipDomain===domainCheck){
            this.urlsrc=this.domain+"/analytics/stacked.jsp?frameorigin=https://"+document.domain;
        }
    else{
    this.domain="https://"+document.domain;    
    }
        (this.messagepanel_iconId).innerHTML += '<span style="display:none" id="stackedNumber" >0</span>';
        this.messagepanel_iconId.style["pointer-events"] = "none";
        if (this.messagepanel_iconId.style.opacity >= 1 || this.messagepanel_iconId.style.opacity == "") {
            this.messagepanel_iconId.style.opacity = this.panelJson.panelIconOpacity||"0.2";
        }
        this.mics_iframeDiv = document.createElement("div");
        this.mics_iframeDiv.id = "mics_stacked_carpet";
        this.panelJson.iframePosition =='left' ? this.mics_iframeDiv.className = "micsPanelLeft": this.mics_iframeDiv.className = "micsPanelRight";
        this.mics_iframe = document.createElement("iframe");
        this.mics_iframe.id="micsiframe";
        this.mics_iframe.setAttribute("sandbox", "allow-scripts allow-same-origin");
        this.stacked_backdrop = document.createElement("div");
        this.stacked_backdrop.id = "mics_stacked_backdrop";
    (!(this.panelJson.backdropPaddingTop)&&(this.panelJson.backdropPaddingBottom))?(this.panelJson.backdropPaddingTop="0px"):(((this.panelJson.backdropPaddingTop)&&!(this.panelJson.backdropPaddingBottom))?(this.panelJson.backdropPaddingBottom="0px"):"");
    (!(this.panelJson.panelPaddingTop)&&(this.panelJson.panelPaddingBottom))?(this.panelJson.panelPaddingTop="0px"):(((this.panelJson.panelPaddingTop)&&!(this.panelJson.panelPaddingBottom))?(this.panelJson.panelPaddingBottom="0px"):"");
    this.stacked_backdrop.setAttribute("style","background:"+(this.panelJson.backdropColor||'#000')+";z-index:"+ (this.panelJson.backdropZindex||9999)+";height:"+('calc( 100vh - ('+ (this.panelJson.backdropPaddingTop + " + " + this.panelJson.backdropPaddingBottom) +'))'||'')+";top:"+(this.panelJson.backdropPaddingTop||'')+";bottom:"+(this.panelJson.backdropPaddingBottom||''));
    this.mics_iframeDiv.setAttribute("style","height:"+('calc( 100vh - ('+ (this.panelJson.panelPaddingTop + " + " + this.panelJson.panelPaddingBottom) +'))'||'')+";z-index:"+ (this.panelJson.panelZindex||99999)+";top:"+(this.panelJson.panelPaddingTop||'')+";bottom:"+(this.panelJson.panelPaddingBottom||''));
        this.stacked_backdrop.style.background=this.panelJson.backdropColor||"#000";        
        document.body.append(this.stacked_backdrop);
        document.body.append(this.mics_iframeDiv);
        this.mics_iframeDiv.append(this.mics_iframe);
        var stackedURI = window.location.protocol + "//" + window.location.hostname + (window.location.port ? ':' + window.location.port : '');
        var styleJson = this.styleJson || {};
        var handle = this;
        var loadSuccess = false;
        this.iconDisabled = true;
        var reloadTime = 5 * 60;
        var panelname=this.panelJson.panelTemplateName || "panel-template-primary";
        var reloadIFrame = function(reloadTime){
             setTimeout(function() {
                if (loadSuccess == false) {
                    handle.mics_iframe.src = handle.urlsrc || "/analytics/stacked.jsp";
                    reloadIFrame((reloadTime * 2) < 3600 ? (reloadTime * 2) : 3600);
                }
              }, reloadTime * 1000);
          }
        reloadIFrame(reloadTime);
        this.mics_iframe.onload = function(e) {
            handle.mics_iframe.contentWindow.postMessage({
                "type": "init",
                "serviceID": handle.serviceId,
                "orgID": handle.orgId,
                "url": stackedURI,
                "panelId": 1,
                "panelTemplateName": panelname,
                "styles": styleJson
              },handle.domain);
        };
  
        this.mics_iframe.src =handle.urlsrc || "/analytics/stacked.jsp";
        window.addEventListener("message", function(event, a, b) {
            if(event.data.emittype == 'messageboardMsgFromWms'){
                handle.mics_iframe.contentWindow.postMessage({ "emittype": "wmscallback", "msg": event.data.msg }, handle.domain);
            }
            if(event.data.emittype == 'messageboardServerupFromWms'){
                handle.mics_iframe.contentWindow.postMessage({ "emittype": "Bannerwmscallbackserver", "serverup": event.data.serverup }, handle.domain);
            }
            if (event.origin !=handle.domain) {
                    return;
            }
        if (event.data.panelId == 1) {
                switch (event.data.type) {
                    case "open":
                        handle.onclick(event.data);
                        break;
                    case "close":
                        handle.stacked_backdrop.click();
                        break;
                    case "start-tour":
                        //console.log("received in parent")
                        handle.startTour(event.data);
                    case "notification":
                        if (loadSuccess == false || handle.iconDisabled) {
                            handle.messagepanel_iconId.style["pointer-events"] = "all";
                            handle.messagepanel_iconId.style.opacity = "1";
                            loadSuccess = true;
                            handle.iconDisabled = false;
                            }
                        handle.updateNumber(event.data);
                        break;
                    case "save-flow":
                        
                        window.localStorage.setItem(event.data.flowID,JSON.stringify(event.data.flowdata));
                        break;
                    case "loadwalkthroughflow":
                        WalkthroughSDK.getInstance().loadFlow([event.data.flowID],'Service')
                        break;
                    case "reload":
                        loadSuccess = false;
                        handle.iconDisabled = true;
                        reloadIFrame(reloadTime);
                        handle.messagepanel_iconId.style["pointer-events"] = "none";
                        handle.messagepanel_iconId.style.opacity = this.panelJson.panelIconOpacity || "0.4";
                        break;
                  }
              }
       });
  
      this.messagepanel_iconId.addEventListener('click', function() {
                if (!handle.mics_iframe.src) {
                    handle.mics_iframe.src =handle.urlsrc || "/analytics/stacked.jsp";
                    }
          if(handle.stacked_backdrop.style.display!=='block'){
                handle.stacked_backdrop.style.display = 'block';
                handle.mics_iframeDiv.style.display = 'block';
                handle.updateNumber({
                    "value": {
                        "unviewedMessages": 0
                      }
                });
                handle.mics_iframe.contentWindow.postMessage({
                    "type": "focus"
                },handle.domain);}
          else{
        handle.stacked_backdrop.click();
          }
              });
  
      this.stacked_backdrop.addEventListener('click', function() {
                handle.stacked_backdrop.style.display = 'none';
                handle.mics_iframeDiv.style.display = 'none';
                handle.mics_iframe.contentWindow.postMessage({
                  "type": "backdrop"
                },handle.domain);
         }, false);
      
     
 
      this.updateNumber= function (data) {
            var no = data.value.unviewedMessages;
            var indicatorID=document.getElementById("stackedNumber");
            indicatorID.className=this.panelJson.messageIndicator==="number"?"micsnumber":"micsdot";
            (+no > 0)?(indicatorID.style.display = 'block') & (indicatorID.innerHTML = no):indicatorID.style.display = 'none';
            if(this.panelJson.messageIndicatorStyle){
              var indicatestyle=this.panelJson.messageIndicatorStyle;
              indicatestyle.backGround?indicatorID.style.background=indicatestyle.backGround:"";
              this.panelJson.messageIndicator==='number'?(indicatestyle.color?indicatorID.style.color=indicatestyle.color:""):"";
              indicatestyle.bottom?indicatorID.style.bottom=indicatestyle.bottom:"";
              indicatestyle.top?indicatorID.style.top=indicatestyle.top:"";
              indicatestyle.left?indicatorID.style.left=indicatestyle.left:"";
              indicatestyle.right?indicatorID.style.right=indicatestyle.right:"";
              indicatestyle.fontSize?indicatorID.style.fontSize=indicatestyle.fontSize:"";
              indicatestyle.borderRadius?indicatorID.style.borderRadius=indicatestyle.borderRadius:"";
            }
    };        
        this.onclick= function (data) {
            if(this.callback){
                return this.callback(data);
            }
            if(data.value.ctaType=='walkthrough')
            {
                this.startTour(data);
                return;
            }
            var link = data.value.cta;
            var a = document.createElement('a');                                                                                                        
            a.setAttribute("referrerpolicy", "no-referrer");
            a.href = link;
            a.target = "_blank";
            document.body.appendChild(a);
            a.click();
        },
        this.startTour=function (data) {
            WalkthroughSDK.getInstance().triggerFlow(data.value.cta,'messageboard',data.value.PID,'Service');
        }
    }
  };
//$Id$ 
class bannersdk{
    static instance=null
    constructor(domainID,orgID){
    this.orgID=orgID;
    this.serviceID=domainID.serviceid;
    this.url=domainID.inproductdomain;
    this.wmsenabled = true;
    this.pollingenabled = true;
    this.scope="Service";
    this.verification=false;
    this.verificationcontent={};
    this.createDivforIframe();
    this.postmessagelistener= VerificationMessageListener.initialiseListener();

    }

enablemicse(){
    this.scope="Enterprise";
}

setverifydata(message){
    this.verification=true;
    this.verificationcontent=message;
    this.drawTip(message);
}

initialize(){
    bannersdk.instance = this;
    var handle=this;
    function testFlexbox () {
        var f = 'flex';
        var fw = '-webkit-flex';
        var el = document.createElement('b');
        
	  try {
          el.style.display = fw;
          el.style.display = f;
          return !!(el.style.display === f || el.style.display === fw );
        } catch (err) {
            return false;
        }
	}

	function supportsCss(p) {
        var b = document.body || document.documentElement,
        s = b.style;
        
	    if (typeof s[p] == 'string') { return true; }
        
	    var v = ['Moz', 'webkit', 'Webkit', 'Khtml', 'O', 'ms'];
	    p = p.charAt(0).toUpperCase() + p.substr(1);
        
	    for (var i=0; i<v.length; i++) {
            if (typeof s[v[i] + p] == 'string') { return true; }
	    }

        
	    return false;
	}

    function checkForMobile(){
        var isMobile = false;
        if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent) 
        || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0,4))){ isMobile = true;}
        return isMobile;
    }
    
    if(!testFlexbox()||checkForMobile()||!supportsCss('transition')||!supportsCss('transform')){
        return;
    }
    var delay=(new Date().getTime()-localStorage.getItem("micsnotificationtime"+handle.serviceID))<30000?(new Date().getTime()-localStorage.getItem("micsnotificationtime"+handle.serviceID)):500; //No I18n
    localStorage.setItem("micsnotificationtime"+handle.serviceID,new Date().getTime());  //No I18n
    handle.timestamp=new Date().getTime();
    localStorage.setItem("micsTabSwitchTime",handle.timestamp);

    handle.urlsource="https://"+document.domain+"/mics";
    var tipDomain=handle.url.split('//')[1].replace("tipengine.","").split('.').reverse();
    var domainCheck=(document.domain).split('.').reverse();
    domainCheck=domainCheck.slice(0,tipDomain.length).join('')
    tipDomain=tipDomain.join('');
    if(tipDomain===domainCheck){
            handle.urlsource=handle.url;
        }
    else{
	    handle.url="https://"+document.domain;
    }
    this.timer=setInterval(function(){ handle.iframe.setAttribute("src",handle.urlsource+"/Notification?ORGID="+handle.orgID+"&ServiceID="+handle.serviceID+"&polling=true&frameorigin="+handle.domain +"&Feedback="+handle.version+"&Scope="+handle.scope); },this.failTimeout);
    setTimeout(function(){ handle.iframe.setAttribute("src",handle.urlsource+"/Notification?ORGID="+handle.orgID+"&ServiceID="+handle.serviceID+"&polling=true&frameorigin="+handle.domain +"&Feedback="+handle.version+"&Scope="+handle.scope); },delay);
        //comment1
}

createDivforIframe(){
    this.userData={};
    this.version=3;
    var tip=this;
    if (!window.location.origin) {
        window.location.origin = window.location.protocol + "//" + window.location.hostname + (window.location.port ? ':' + window.location.port: '');
    }
    this.domain=location.origin;
    this.failTimeout=7200000;
    this.displayTimeout=220;
    this.tipDiv=document.createElement("div");
    this.tipDiv.setAttribute("id","mics_tipDiv");
    this.backdrop=document.createElement("div");
    this.backdrop.setAttribute("id","micsbackdrop"); 
    this.backdrop.setAttribute("class","micshide");
    this.iframeDiv=document.createElement("div");
    this.iframe=document.createElement("iframe");
    this.iframe.setAttribute("sandbox","allow-scripts allow-same-origin");
    this.iframeDiv.setAttribute("style","position:absolute;top:100px;left:-30005%;display:none");
    this.iframeDiv.appendChild(this.iframe);
    this.tpDiv=document.createElement("div");
    this.tpDiv.setAttribute("id","mics_tpDiv");
    this.tpDiv.setAttribute("class","micshide");  
    this.tipDiv.setAttribute("class","micshide");
    document.body.prepend(this.iframeDiv,this.tipDiv,this.backdrop,this.tpDiv);
    var handle=this;
    this.userDataString="";
    this.timestamp=new Date().getTime();
    Object.keys(this.userData).forEach(function(d){ handle.userDataString+=("&"+d+"="+handle.userData[d]);  });
    window.addEventListener("message", function(event,a,b){
        if(event.origin===handle.url){
            if(event.data&&event.data!=="None"&&event.data.type!=="tabSwitch"){
                tip.drawTip(event.data);
            }
            else if(event.data.type==="tabSwitch"){
                if(!event.data.IsActive){
                    handle.tipDiv.setAttribute("class","micshide");
                    handle.emptyDiv(handle.tipDiv);
                }			    
            }
            if (typeof event.data === "string" && JSON.parse(event.data).Timeout && !(JSON.parse(event.data).PromotionID)) {
                handle.pollingenabled = false;
            }
        }
        if(event.data.type==="micsresize"){	
            Array.prototype.forEach.call(handle.tipDiv.getElementsByClassName("micsiframe"),function(d){ //No I18n
                d.setAttribute("style","width:"+event.data.width+";height:"+event.data.height);
            });
        }
        else if(event.data.type==="micsclose"){
            Array.prototype.forEach.call(handle.tipDiv.getElementsByClassName("micsclose"),function(d){ //No I18n
                d.click();
            });
        }
        else if(event.data.type==="micsclick"){
            handle.promotionClicked();
        }       
        
       if(sessionStorage.getItem("bannerverifydata")){
        handle.setverifydata(sessionStorage.getItem("bannerverifydata"))
        sessionStorage.removeItem("bannerverifydata");
       }
    });
    
    window.addEventListener("focus", function(event,a,b){
        if(handle.tipDiv.innerHTML===""){
            return;
        }
        var tipCheckLocal = function(){
            var time=localStorage.getItem("micsTabSwitchTime");
            if(handle.timestamp.toString()!==time){
                localStorage.setItem("micsTabSwitchTime",handle.timestamp);
                Array.prototype.forEach.call(handle.tipDiv.getElementsByClassName("micsiframe"),function(d){ //No I18n
                    if(handle.iframeSrc){
                        d.contentWindow.postMessage( {"type":"micsFocus"},handle.iframeSrc);
                    }
                });
            }
            if(handle.promotionID===sessionStorage.getItem("clickedNotificationID"+handle.serviceID+""+handle.scopeName)){
            time=localStorage.getItem("micsTabSwitchTime");
			return true;
		}
        else if(handle.promotionID===localStorage.getItem("micsnotificationid"+handle.serviceID)){
            handle.tipDiv.setAttribute("class","micshide");
            handle.emptyDiv(handle.tipDiv);
			return false;
        }
		else
		{
            return true;
		}
	}
	var tipCheckBackend = function(){
        if(handle.promotionID===sessionStorage.getItem("clickedNotificationID"+handle.serviceID+""+handle.scopeName) || handle.verification){
            return	
        }
		else{
            handle.iframe.contentWindow.postMessage( {"type":"tabSwitch","promotionID":handle.promotionID,"feedback":0,"scope":handle.scopeName} ,handle.url);
        }
	}
	var localCheck = tipCheckLocal();
	if(localCheck)
	{
        setTimeout(tipCheckBackend,5000);
	}
}); 
}

drawThirdParty(url,width,height,data){
    var handle=this;
    data=data?data:{};
    this.tpDiv.classList.remove("micshide");  //No I18n
    this.backdrop.classList.remove("micshide");  //No I18n
    this.backdrop.setAttribute("style",data.tpbackdropStyle?data.tpbackdropStyle:"");
    handle.emptyDiv(this.tpDiv);
    this.tpiframe=document.createElement("iframe");
    this.tpLoading=document.createElement("div");
    this.tpLoading.setAttribute("class",data.tploadingClass?data.tploadingClass:" micsloading");
    this.tpLoading.setAttribute("style",data.tploadingStyle?data.tploadingStyle:"");
    this.tpDiv.appendChild(this.tpLoading);
    this.tpDiv.appendChild(this.tpiframe);
    this.tpiframe.onload=function(){ if(handle.tpLoading.parentNode===handle.tpDiv){ handle.tpDiv.removeChild(handle.tpLoading); }  }
    this.tpiframe.setAttribute("src",url);
    this.tpiframe.setAttribute("sandbox","allow-forms allow-scripts");
    this.tpDiv.setAttribute("style",data.tpStyle?data.tpStyle:("width:"+width+"%;height:"+height+"%;top:"+(parseInt((100-height)/2))+"%;left:"+(parseInt((100-width)/2))+"%;padding:50px;"));
    this.tpiframe.setAttribute("style",data.tpiframe?data.tpiframeStyle:('width:100%;height:100%'));
    var close=document.createElement("span");close.setAttribute("class","mics_tpclx clx");
    close.setAttribute("style",data.tpcloseStyle?data.tpcloseStyle:"");
    this.tpDiv.insertBefore(close,this.tpDiv.childNodes[0]);
    close.addEventListener("click",function(){
        handle.tpDiv.setAttribute("class","micshide");
        handle.backdrop.setAttribute("class","micshide");
        handle.emptyDiv(handle.tpDiv);
	//comment2
    });
}

drawTip(data){
    clearInterval(this.timer);
    var tipData1=this.bannersdk_parseJSON(data);
    var tipData=this.bannersdk_parseJSON(tipData1.NDETAILS);
    if(tipData1.PromotionID==undefined||tipData1.PromotionID==''||tipData1.PromotionID==null){
        //no need to enter without drawTip
        return;
    }
    this.pid=tipData1.PromotionID;
    this.scopeName=tipData1.scope;
    this.zuid=tipData1.ZUID?tipData1.ZUID:0;
    var handle=this;
    if(handle.verification){ //Dev should note that => for verification checking alone
	if(handle.pid>-1){
	        return;
		}
        handle.emptyDiv(handle.tipDiv);
    }
    if(this.pid===localStorage.getItem("micsnotificationid"+handle.serviceID+""+handle.scopeName) && !handle.verification){
        handle.iframe.contentWindow.postMessage( {"promotionID":handle.pid,"feedback":4,"scope":handle.scopeName} ,handle.url);	 //No I18n
    }
    if(this.pid===localStorage.getItem("micsnotificationid"+handle.serviceID+""+handle.scopeName)||handle.tipDiv.innerHTML!==""||!tipData.type && !handle.verification){
        return;
    }
    if(!handle.verification){
    this.iframe.contentWindow.postMessage({"promotionID":this.pid,"feedback":2,"scope":handle.scopeName},this.url);  //No I18n
    }
    function getBgUrl(el) {
        var bg = "";
    	if (el.currentStyle) { // IE
    	    bg = el.currentStyle.backgroundImage;
    	} else if (document.defaultView && document.defaultView.getComputedStyle) { // Firefox
    	    bg = document.defaultView.getComputedStyle(el, "").backgroundImage;
    	} else { // try and get inline style
    	    bg = el.style.backgroundImage;
    	}
        if(bg == "none")
        {
            return "";
        }
        var backgroundUrl = bg.replace(/url\(['"]?(.*?)['"]?\)/i, "$1").split(",")[0];
        
        return backgroundUrl;
    }

    switch (tipData.type) {
        case "banner":
            handle.tipDiv.removeAttribute("style");
            handle.tipDiv.setAttribute("style", decodeURI(tipData.style));
            handle.tipDiv.setAttribute("class", tipData.className + " bannerhide");
            var test = document.createElement("img");
            test.addEventListener('load', function () { handle.drawBanner(tipData, handle, handle.pid); });
            test.addEventListener('error', function () { handle.drawBanner(tipData, handle, handle.pid); });
            test.setAttribute("src", getBgUrl(handle.tipDiv));
            break;

        case "customizedhtmlBanner":
            handle.drawCustomHTMLBanner(tipData,handle);
            break;

        case "htmlBanner":
            handle.drawHTMLBanner(tipData, handle);
            break;

	    case "customwebbanner":
	        handle.drawCustomHTMLBanner(tipData,handle);
	        break;
    
        default:
            // Handle default case if needed
            break;
    }	
    
}

drawCustomHTMLBanner(tipData, handle) {
    handle.promotionID = handle.pid;
    handle.scopenamefrombanner=handle.scopeName;
    handle.tipDiv.removeAttribute("style");
    handle.tipDiv.innerHTML = "";
    handle.tipDiv.classList.remove("micshide");

    var layoutDiv = document.createElement("div");
    layoutDiv.setAttribute("id", "micsshadowContainer");
    handle.tipDiv.appendChild(layoutDiv);

    var shadowdom = layoutDiv.attachShadow({ mode: "closed" });
    shadowdom.innerHTML = `<style>${tipData.css}</style>${tipData.html}`;
    var script = document.createElement('script');
    script.innerHTML = tipData.script;
    shadowdom.appendChild(script);
    try {
        micsShadowDomReference(shadowdom);
    }
    catch (err) {}


    var addMICSbannerClickListener = function (selector, callback) {
        Array.from(shadowdom.querySelectorAll(selector)).forEach(function (element) {
            var linkType = element.getAttribute("linkvalue");

	    if(linkType!='walkthrough' && linkType!='web url')
      		{
       	   	    var linkType = element.getAttribute("linktype");
      		}	   

            if(linkType=='walkthrough'){ 
                var flowID = element.getAttribute("linkvalue");
                WalkthroughSDK.getInstance().loadFlow([flowID],handle.scopenamefrombanner);
                    
                element.addEventListener('click',()=>{WalkthroughSDK.getInstance().triggerFlow(flowID,"banner",handle.promotionID,handle.scopenamefrombanner);
                handle.promotionClicked(); })
            }
            else{
            element.addEventListener("click", ()=> callback(element));
        }
        });
    };

    addMICSbannerClickListener(".cta_button", function (ctaButton) {
        var linkValue = ctaButton.getAttribute("linktype");

	    if(linkValue=='walkthrough' || linkValue=='web url')
      	    {
       		 linkValue = ctaButton.getAttribute("linkvalue");
            }	

        window.open(linkValue, "_blank");
        handle.promotionClicked();
        
    });

    addMICSbannerClickListener(".close", function () { handle.promotionClosed(); });
}

bannersdk_parseJSON(str){
    try {
        return JSON.parse(str);
    } catch (e) {
        return {};
    }
}

drawHTMLBanner(tipData, handle)
{
	this.promotionID = handle.pid;
    this.scopenamefrombanner=handle.scopeName;
	handle.tipDiv.removeAttribute("style");
	handle.tipDiv.innerHTML = "";
	handle.tipDiv.classList.remove("micshide");

	var layoutDiv = document.createElement("div");
    layoutDiv.setAttribute("id", "micsshadowContainer");
    handle.tipDiv.appendChild(layoutDiv);

    var shadowdom = layoutDiv;
	shadowdom = shadowdom.attachShadow({ mode: "closed" });
	shadowdom.innerHTML = "<style>"+tipData.css+"</style>"+tipData.html;

	var script = document.createElement('script');
	script.innerHTML = tipData.script;
	shadowdom.appendChild(script);
	activateScript(shadowdom);

	Array.prototype.forEach.call(shadowdom.querySelectorAll(".cta_button"),function(d){ //No I18n
        	d.addEventListener("click",function(event){
            		handle.promotionClicked();
        	});
	});

	Array.prototype.forEach.call(shadowdom.querySelectorAll(".close"),function(d){ //No I18n
        	d.addEventListener("click",function(event){
            		handle.promotionClosed();
			clearBanner(event);
        	});
	});
}

drawBanner(data,par,pid){
    var image=document.createElement("span");image.setAttribute("class","micsimage");
    var box=document.createElement("div");box.setAttribute("class","micsBox");
    var img=document.createElement("img");image.appendChild(img);
    var content=document.createElement("span");content.setAttribute("class","micscontent");
    var inner=document.createElement("span");inner.setAttribute("class","micsinner");
    var action=document.createElement("span");action.setAttribute("class","micsaction");
    var close=document.createElement("span");close.setAttribute("class",data.close.className?data.close.className:"micsclose");
    var toggle=document.createElement("span");toggle.setAttribute("class",data.hide.className?data.hide.className:"micstoggle");
    var iframeDiv=document.createElement("div");iframeDiv.setAttribute("class","micsiframeDiv");
    var iframe=document.createElement("iframe");iframe.setAttribute("class","micsiframe");
    iframeDiv.appendChild(iframe);
    var handle=this;
    this.promotionID=pid;
    this.scopenamefrombanner=handle.scopeName;
    this.iframeSrc = data.iframeSrc;
    toggle.addEventListener("click",function(e){
      		handle.tipDiv.classList.add("micshidden"); //No I18n
            handle.tipDiv.classList.add("micswrap"); //No I18n
      		e.stopPropagation();
      	  });
  	  handle.tipDiv.addEventListener("click",function(){
            if ( (" " + handle.tipDiv.className + " ").replace(/[\n\t]/g, " ").indexOf("micshidden") > -1 ){
                handle.tipDiv.classList.remove("micshidden"); //No I18n
	            setTimeout(function(){   handle.tipDiv.classList.remove("micswrap");   },handle.displayTimeout);
            }
        });
  	  close.addEventListener("click",function(){
	        if(data.iframeSrc){
                iframe.contentWindow.postMessage( {"type":"micsClose"} ,data.iframeSrc);
	        }
            handle.iframe.contentWindow.postMessage( {"promotionID":pid,"feedback":4,"scope":handle.scopenamefrombanner},handle.url);  //No I18n
            handle.tipDiv.classList.add("bannerhide");
            if(handle.wmsenabled){
                handle.pollingenabled = true;
                handle.iframe.contentWindow.postMessage({ "emittype": "Bannerwmspoll"},handle.url);
            }
	  setTimeout(function(){   handle.tipDiv.classList.add("micshide"); handle.emptyDiv(handle.tipDiv);   },handle.displayTimeout);
      	  handle.emptyDiv(handle.tpDiv);
	  //comment2
	  localStorage.setItem("micsnotificationid"+handle.serviceID+""+handle.scopenamefrombanner, pid);  //No I18n
    });
    var pdata=this.parseData(data.content,content,inner);
    var iframeScrolling=data.iframeScrolling?data.iframeScrolling:"auto";
    iframeDiv.setAttribute("style",data.iframeDivStyle);
    iframe.setAttribute("frameborder",0);iframe.setAttribute("marginwidth",0);
    iframe.setAttribute("marginheight",0);iframe.setAttribute("scrolling",iframeScrolling);
    function loadiframe(){
        if(data.iframeSrc){
            iframe.addEventListener("load",function(){   
                handle.tipDiv.setAttribute("class",data.className);
                iframe.contentWindow.postMessage( {"type":"userData","zuid":handle.zuid,"orgID":handle.orgID,"userData":handle.userData,"scope":handle.scopenamefrombanner} ,data.iframeSrc);
			});
            if(data.iframesdk){
                iframe.setAttribute("src",data.iframeSrc+((data.iframeSrc.indexOf('?')!=-1)?"&":"?")+"orgID="+handle.orgID+"&zuid="+handle.zuid+handle.userDataString);
            }
            else{
                iframe.setAttribute("src",data.iframeSrc);
            }
		}
        else{
            iframeDiv.setAttribute("style","display:none;");
            handle.tipDiv.setAttribute("class",data.className);
		}
    }
    img.setAttribute("style",decodeURI(data.image.style));
    iframe.setAttribute("style",data.iframeStyle);
    image.setAttribute("style",decodeURI(data.imageStyle));
    box.setAttribute("style",decodeURI(data.boxStyle));
    inner.setAttribute("style",decodeURI(data.innerStyle));
    content.setAttribute("style",decodeURI(data.contentStyle));
    action.setAttribute("style",decodeURI(data.actionStyle));
    close.setAttribute("style",decodeURI(data.close.style));
    toggle.setAttribute("style",decodeURI(data.hide.style));
    action.appendChild(toggle);
    action.appendChild(close);
    handle.emptyDiv(this.tipDiv);
    box.appendChild(image);
    content.appendChild(inner);
    content.appendChild(iframeDiv);
    box.appendChild(content);
    box.appendChild(action);
    this.tipDiv.appendChild(box);
    img.addEventListener('load', function() {    loadiframe();    });
      img.addEventListener('error', function() {        loadiframe();   });
      img.setAttribute("src",data.image.src);
      Array.prototype.forEach.call(content.getElementsByClassName("micsSameLink"),function(d){ //No I18n
        d.addEventListener("click",function(){
            handle.iframe.contentWindow.postMessage({"promotionID":pid,"feedback":3,"scope":handle.scopenamefrombanner},handle.url); //No I18n
            handle.drawThirdParty(this.getAttribute("url"),this.getAttribute("urlWidth"),this.getAttribute("urlHeight"),data.iframedata);
        });
    });
    Array.prototype.forEach.call(content.getElementsByClassName("micsNewLink"),function(d){ //No I18n
        d.addEventListener("click",function(){
            handle.promotionClicked();
        });
    });
}

bannerverification(){
    VerificationCompleteMessager.notifySuccess("banner");
}

promotionClicked(){
    var handle = this;
    if(handle.verification){
      handle.bannerverification();
      return;
    }
    handle.iframe.contentWindow.postMessage({"promotionID":this.promotionID,"feedback":3,"scope":handle.scopenamefrombanner},handle.url); //No I18n
    sessionStorage.setItem("clickedNotificationID"+handle.serviceID+""+handle.scopenamefrombanner,this.promotionID);
    localStorage.setItem("micsnotificationid"+handle.serviceID+""+handle.scopenamefrombanner,this.promotionID);
}

promotionClosed(){
    var handle = this;
    if(handle.verification){
       handle.bannerverification();
       handle.emptyDiv(handle.tipDiv);
       return;
    }
    handle.iframe.contentWindow.postMessage({"promotionID":this.promotionID,"feedback":4,"scope":handle.scopenamefrombanner},handle.url); //No I18n
    if(handle.wmsenabled){
        handle.pollingenabled = true;
        handle.iframe.contentWindow.postMessage({ "emittype": "Bannerwmspoll"},handle.url);
    }
    handle.emptyDiv(handle.tipDiv);
    //comment2
    localStorage.setItem("micsnotificationid"+handle.serviceID+""+handle.scopenamefrombanner,this.promotionID);
}

parseData(data,div,inner){
    var handle=this;
    function createElement(ele,className,dv){
        var element=document.createElement(ele);
        element.setAttribute("class",className);
        dv.appendChild(element);
        return element;
    }
    data.forEach(function(d){
        switch(d.type){
            case "link": //No I18n
            if(d.sdk){
                d.link=d.link+((d.link.indexOf('?')!=-1)?"&":"?")+"orgID="+handle.orgID+"&zuid="+handle.zuid+handle.userDataString;
            }
            if(d.check){
                var celem=createElement("a","micsSameLink micslink",inner);
                celem.setAttribute("url",d.link);    
                celem.setAttribute("urlheight",d.height?d.height:100); 
                celem.setAttribute("urlwidth",d.width?d.width:100);
                celem.innerText=d.text;
                celem.setAttribute("style",decodeURI(d.style));
            }
            else{
                var celem=createElement("a","micsNewLink micslink",inner);
              
                if(d.flowID){
                    WalkthroughSDK.getInstance().loadFlow(d.flowID,handle.scopenamefrombanner)
                    
                    celem.addEventListener('click',()=>{WalkthroughSDK.getInstance().triggerFlow(d.flowID,"banner",handle.promotionID,handle.scopenamefrombanner)})
                }  
                else{
                    celem.setAttribute("href",d.link);
                    celem.setAttribute("target","_blank"); 
                }                      
                    celem.innerText=d.text;
                    celem.setAttribute("style",decodeURI(d.style));
                }
                break;
                case "desc": //No I18n
                var celem=createElement("span","micsdesc",inner);  celem.innerText=d.text;   celem.setAttribute("style",decodeURI(d.style));
                break;
                case "header": //No I18n
                var celem=createElement("span","micsheader",div);  celem.innerText=d.text; celem.setAttribute("style",decodeURI(d.style));
                break;
            }
        });
    }   
    emptyDiv(node){
        while (node.hasChildNodes()) {
            node.removeChild(node.firstChild);
        }
    }
};



//$Id$
class VerificationMessageListener{
    static listener = null;
    
    constructor(){
        this.inproducttypevslistenerinstance ={"selfhelp": SelfHelpVerificationMessageListener,
                                               "banner":BannerVerificationMessageListener,
                                               "messageboard":MessageBoardVerificationMessageListener,
                                               "walkthrough":WalkthroughVerificationMessageListener
                                            };
        this.#seteventlistener();
        this.#notifyReferrer();
    }
    
    static initialiseListener()
    {    
         if(VerificationMessageListener.listener === null)  {
            VerificationMessageListener.listener  = new VerificationMessageListener();
         }
         return;
    }
    
    #seteventlistener(){
        var handle=this;
        window.addEventListener("message",function(payload)
         {       
                 if(payload.data.source==="micsinproduct" && payload.data.type != 'readytoverify'){
               var inproducttype = payload.data.type.toLowerCase();    /* Type = banner/messageboard/selfhelp/walkthrough */
               var instance = handle.inproducttypevslistenerinstance[inproducttype]
               instance.processMessage(payload.data.message);
           }
         });
    }
    
    #notifyReferrer(){
        if(document.referrer && document.referrer.includes("mics") && window.opener!=null){
            window.opener.postMessage(
                {source:"micsinproductsdk",type:'readytoverify'},document.referrer);
        
        }
    }
}


class SelfHelpVerificationMessageListener{

    static processMessage(message){
        if(selfhelpsdk.instance){
            var sdkinstance=selfhelpsdk.instance;
            sdkinstance.setverifydata(message);
            return
        }

        sessionStorage.setItem("selfhelpverifydata",JSON.stringify(message));
    }

}

class MessageBoardVerificationMessageListener{
    static processMessage(message){

    }
}

class BannerVerificationMessageListener{
    static processMessage(message){
        if(bannersdk.instance){
            var sdkinstance=bannersdk.instance;
            sdkinstance.setverifydata(message);
            return;
        }
        sessionStorage.setItem("bannerverifydata",JSON.stringify(message));
    }
}

class WalkthroughVerificationMessageListener{
    static processMessage(message){

    }
}



class VerificationCompleteMessager{

    static notifySuccess(inproducttype,msg={}){ 
    window.opener.postMessage({"type":'verify',"inproducttype":inproducttype,"source":"micsinproductsdk","message":msg}, document.referrer);
    }


}
//  $Id$
class Micssdktoserver{
    static instance=null;
    static callbackIdcounter=0;
    constructor(inproductconf, orgID) {
        this.orgID = orgID;
        this.domain = inproductconf.inproductdomain;
        this.serviceid = inproductconf.serviceid;
        this.mediumvsclass=new Map();
        this.mediumvsclass.set("banner",BannerAPI);
        this.mediumvsclass.set("messageboard",MessageboardAPI);
        this.mediumvsclass.set("walkthrough",WalkthroughAPI);
        this.mediumvsclass.set("selfhelp",SelfhelpAPI);
        this.callbacks={};
        this.apistack=[];
        this.Isinproductframeloaded=false;
        this.isCustomdomain=true;
        this.iframeWindow=this.#initializeframe();
        Micssdktoserver.instance=this;
        this.#inproductListener();
    }

    static getinstance(inproductconf, orgID, medium){
        if(Micssdktoserver.instance){
            return new (Micssdktoserver.instance.mediumvsclass.get((medium).toLowerCase()))();
        }
        new Micssdktoserver(inproductconf,orgID);
        return new (Micssdktoserver.instance.mediumvsclass.get((medium).toLowerCase()))();
    }

    static callApi(medium, api_type, endpoint, method, apiconfig, requestheaders, clientparams, onsuccess, onerror,async){
        let callbackId=-1;
        if(onsuccess||onerror){
            callbackId = Micssdktoserver.callbackIdcounter++;
            Micssdktoserver.instance.callbacks[callbackId] = {'onsuccess': onsuccess, 'onerror': onerror};
        }
        var params={};
        params["queryParam"]=Micssdktoserver.instance.getQueryParam(apiconfig.queryparams,clientparams);
        params["bodyParam"]=Micssdktoserver.instance.getBodyParam(apiconfig.bodyparams,clientparams);

        if(Micssdktoserver.instance.isCustomdomain){
            endpoint="/mics" + endpoint
        }

	var content={"data":{
            "medium":medium,
            "http_method":(method.toLowerCase()),
            "queryParam":params["queryParam"],
            "bodyParam":params["bodyParam"],
            "api":endpoint,
            "api_type":api_type,
            "callbackId":callbackId,
            "requestheaders":requestheaders,
            "async":async,
            "micsinproduct":true
        },"domain":Micssdktoserver.instance.domainUrl};

        if(Micssdktoserver.instance.Isinproductframeloaded){
	Micssdktoserver.makecalltoframe(content);
	}
	else{
        Micssdktoserver.instance.apistack.push(content);	
	}
    }
	
    static makecalltoframe(content){
	document.getElementById("micssdktoserverIframe").contentWindow.postMessage(content.data,content.domain);

	}


    #initializeframe() {
        var self=this;
        this.domainUrl = location.origin + "/mics/jsp/inproduct.jsp?frameorigin=" + location.origin;
        var domain = this.domain.split('//')[1].replace("tipengine.", "").split('.').reverse();
        var domainCheck = (location.hostname).split('.').reverse();
        domainCheck = domainCheck.slice(0, domain.length).join('');
        domain = domain.join('');
        if (domain = domainCheck) {
            this.domainUrl = this.domain + "/jsp/inproduct.jsp?frameorigin=" + location.origin;
            this.isCustomdomain=false;
        }
        this.iframewindow = document.createElement('iframe');
        this.iframewindow.setAttribute("src", this.domainUrl);
        this.iframewindow.setAttribute("style", "position: absolute; width:0; height:0; border:0");
        this.iframewindow.setAttribute("id", "micssdktoserverIframe")
        document.body.append(this.iframewindow);
        return this.iframewindow;
    }

    #inproductListener(){
        var handle=this;
        window.addEventListener('message',(event)=>{
        let data = event.data;
        if(data.type=="inproductresponse"){
            let callback = handle.callbacks[data.callbackId];
            data.callback_type=="success"?callback.onsuccess(data.response):callback.onerror(data.response);
            delete handle.callbacks[data.callbackId];
            }
	else if(data.type=="inproductiframeload"){
	    handle.Isinproductframeloaded = true;
	    var stacklength = handle.apistack.length;
            if(stacklength){
		for(let iterator=0; iterator < stacklength; iterator++){
		 Micssdktoserver.makecalltoframe(handle.apistack[iterator]);
		}
	     handle.apistack = [];
		}	    
	}
        })
    }
        
    getQueryParam(list, params){ 
        let queryparam="";
        for (let i = 0; i < list.length; i++)
        {		 
            if(params[list[i]] == undefined) {
                continue;
            }
            queryparam+= (queryparam == "")?  ("?" + list[i] + "=" + encodeURIComponent(params[list[i]])): ("&" + list[i] + "=" + encodeURIComponent(params[list[i]]));   
        }
        return queryparam;
    }

    getBodyParam(list,params){
        let bodyparam={}
        for (let i = 0; i < list.length; i++)
        {		 
            if(params[list[i]]) {
                    bodyparam[list[i]]=params[list[i]];
                }
            }
            return bodyparam;
        }
    }
    
    class WalkthroughAPI {
        constructor(){
            this.medium="walkthrough";
            this.apiconfig={
                "metrics":{
                    "queryparams":["promotionid","orgid","sessionstarttime","stepnumber","statuscode","errorcode","serviceid","action","walkthroughid","Scope"],
                    "bodyparams":[],
                    "endpoint":"/Walkthrough",
                    "requestheaders":new Map(),
                    "async":true
                    },
                "content":{
                    "queryparams":["serviceid","orgid","action","Scope"],
                    "bodyparams":["flowidlist"],
                    "endpoint":"/Walkthrough",
                    "requestheaders":new Map(),
                    "async":true
                    },
                "verifyflow":{
                    "queryparams":["flowidlist","status","action","serviceid","orgid"],
                    "bodyparams":[],
                    "endpoint":"/Walkthrough",
                    "requestheaders":new Map(),
                    "async":true
                },        
                "meta":{
                        
                    }
            };
        }
        sendMetric(params, httpmethod, onsuccess, onerror) {
            this.#triggerAPI("metrics", httpmethod, params, onsuccess, onerror);
         }
        postVerifyStatus(params, httpmethod, onsuccess, onerror){
            this.#triggerAPI("verifyflow", httpmethod, params, onsuccess, onerror);
         }
         getContent(params, httpmethod, onsuccess, onerror){
            this.#triggerAPI("content", httpmethod, params, onsuccess, onerror);
        }
         getMeta(params, httpmethod, onsuccess, onerror){
            this.#triggerAPI("meta", httpmethod, params, onsuccess, onerror);
         }
         #triggerAPI(api_type, httpmethod, params, onsuccess, onerror){
            Micssdktoserver.callApi(this.medium, api_type, this.apiconfig[api_type].endpoint, httpmethod, this.apiconfig[api_type],this.apiconfig[api_type].requestheaders, params, onsuccess, onerror, this.apiconfig[api_type].async);
         }
    }
    
    class SelfhelpAPI{
        constructor(){
            this.medium="selfhelp";
            this.apiconfig={
                "metrics":{
                    "queryparams":["serviceid","orgid", "action", "Scope"],
                    "bodyparams":[],
                    "endpoint":"/selfhelp",
                    "requestheaders":new Map(),
                    "async":true
                },
                "content":{
                },
                "meta":{
                    "queryparams":["serviceid","orgid", "action", "Scope"],
                    "bodyparams":[],
                    "endpoint":"/selfhelp",
                    "requestheaders":new Map(),
                    "async":true
		}
            }
        }
        sendMetric(params, httpmethod, onsuccess, onerror) {
            this.#triggerAPI("metrics", httpmethod, params, onsuccess, onerror);
         }
         getContent(params, httpmethod, onsuccess, onerror){
            this.#triggerAPI("content", httpmethod, params, onsuccess, onerror);
        }
        postVerifyStatus(params, httpmethod, onsuccess, onerror){
            this.#triggerAPI("verifyflow", httpmethod, params, onsuccess, onerror);
         }
         getMeta(params, httpmethod, onsuccess, onerror){
            this.#triggerAPI("meta", httpmethod, params, onsuccess, onerror);
         }
         #triggerAPI(api_type, httpmethod, params, onsuccess, onerror){
            Micssdktoserver.callApi(this.medium, api_type, this.apiconfig[api_type].endpoint, httpmethod, this.apiconfig[api_type],this.apiconfig[api_type].requestheaders, params, onsuccess, onerror, this.apiconfig[api_type].async);
         }
    }
    
    class BannerAPI{
        constructor(){
            this.medium="banner";
            this.apiconfig={
                "metrics":{
                    "queryparams":["ORGID","ServiceID","polling","frameorigin","Feedback"],
                    "bodyparams":[],
                    "endpoint":"/Notification",
                    "requestheaders":new Map(),
                    "async":true
                },
                "content":{

                },
                "meta":{

                }
            }
        }
        sendMetric(params, httpmethod, onsuccess, onerror) {
            this.#triggerAPI("metrics", httpmethod, params, onsuccess, onerror);
         }
         getContent(params, httpmethod, onsuccess, onerror){
            this.#triggerAPI("content", httpmethod, params, onsuccess, onerror);
        }
         getMeta(params, httpmethod, onsuccess, onerror){
            this.#triggerAPI("meta", httpmethod, params, onsuccess, onerror);
         }
         #triggerAPI(api_type, httpmethod, params, onsuccess, onerror){
            Micssdktoserver.callApi(this.medium, api_type, this.apiconfig[api_type].endpoint, httpmethod, this.apiconfig[api_type],this.apiconfig[api_type].requestheaders, params, onsuccess, onerror, this.apiconfig[api_type].async);
        }
    }

    class MessageboardAPI{
        constructor(){
            this.medium="messageboard";
            this.apiconfig={
                "metrics":{
                },
                "content":{
                    "queryparams":["serviceId","orgId","frameorigin"],
                    "bodyparams":[],
                    "endpoint":"/Stacked",
                    "requestheaders":new Map(),
                    "async":true

                },
                "meta":{
                    
                }
            }
        }
        sendMetric(params, httpmethod, onsuccess, onerror) {
            this.#triggerAPI("metrics", httpmethod, params, onsuccess, onerror);
         }
         getContent(params, httpmethod, onsuccess, onerror){
            this.#triggerAPI("content", httpmethod, params, onsuccess, onerror);
        }
         getMeta(params, httpmethod, onsuccess, onerror){
            this.#triggerAPI("meta", httpmethod, params, onsuccess, onerror);
         }
         #triggerAPI(api_type, httpmethod, params, onsuccess, onerror){
            Micssdktoserver.callApi(this.medium, api_type, this.apiconfig[api_type].endpoint, httpmethod, this.apiconfig[api_type],this.apiconfig[api_type].requestheaders, params, onsuccess, onerror, this.apiconfig[api_type].async);
         }
    }
       /*$Id$*/  
   class selfhelpsdk {
    static instance=null;
    constructor(inproduct,orgID) {
      if (selfhelpsdk.instance===null){
        selfhelpsdk.instance=this;
      }
      this.orgid=orgID;
      this.serviceid=inproduct.serviceid;
      this.inproductconf=inproduct;
      this.micssdktoserverInstance=null;
      this.walkthroughInstance=null;
      this.customplaceholder = '';
      this.instance=false;
      this.selftoggle = false;
      this.selfhelpmateriallist = [];
      this.searchdatalist=[];
      this.getallwalkthroughid=[];
      this.scope="Enterprise";
      this.stylereference={
        "backgroundcolor":"backgroundColor",
        "fontFamily":"fontFamily",
        "fontSize":"font-size",
        "fontWeight":"font-weight",
        "fontColor":"color",
        "boxShadow":"box-shadow",
        "borderTop":"border-top",
        "borderLeft":"border-left",
        "borderRight":"border-right",
        "borderBottom":"border-bottom",
        "height":"height",
        "width":"width",
        "iconColor":"color",
        "borderRadius":"borderRadius",
        "border":"border"
      };
      this.selfhelpcontents={
          "indicatortext":"Help Hub",
          "popupheader":"Help Hub",
          "searchbarplaceholder":"Search for material",
          "emptylist":"Currently, no material available for this page.",
         "searchnotfound":"No material found."
      };
      this.styleforDefaultplaceholder={
        "backgroundcolor":"rgb(255,122,89)",
        "fontColor":"#ffff",
        "fontSize":"14px",
        "fontFamily":"Puvi",
        "fontWeight":"700",
        "position":"right-center",
        "borderRadius":"",
        "width":"27px",
        "height":"120px",
      };
      this.styleforselfhelppopup={
        "home":{
          "backgroundcolor": "#ffffff",
          "fontFamily": "Puvi",
          "boxShadow":"rgba(0, 0, 0, 0.1) 0px 0px 10px 1px"
        },
        "topband": {
          "backgroundcolor": "rgb(255,122,89)",
          "fontColor": "#ffffff",
          "height":"50px",
          "fontSize": "16px",
          "fontFamily": "inherit",
          "fontWeight": "600",
          "boxShadow": "1px 0px 1px #bbc3ca",
          "borderBottom": "",
          "borderTop": "",
          "borderLeft": "",
          "borderRight": ""
        },
        "searchbar":{
          "iconColor":"#9e9e9e",
          "backgroundcolor":"white",
          "fontColor":"black",
          "borderRadius":"5px",
          "border":"1px solid #939191"
        },
        "closebutton": {
          "iconColor": "#ffffff",
          "iconSize":"16px"
        },
        "noitem":{
          "fontColor": "#353535",
          "fontSize": "15px",
          "fontFamily": "Puvi",
          "fontWeight": "300",
        },
        "listitem":{
          "fontColor": "#101010",
          "height":"",
          "fontSize": "16px",
          "fontFamily": "inherit",
          "fontWeight": "300",
          "backgroundcolor":"inherit"
        },
        "listitemhover":{
          "backgroundcolor":"#f0f4fb",
          "fontColor": "#426CC1"
        }
      },
      this.verification = false;
      this.verificationcontent={};
      this.postmessagelistener=VerificationMessageListener.initialiseListener();
    }

    enablemics(){
        this.scope="Service";
    }
  
    initialize() {
      var handle=this;
      handle.#checkverifydata(handle);
      handle.micssdktoserverInstance=Micssdktoserver.getinstance(this.inproductconf,this.orgid,"selfhelp");
      setTimeout(() => {
      handle.#getdatacallback(handle,"Enterprise");
      if(handle.scope===!"Enterprise"){ //now only get meta for micse
            handle.#getdatacallback(handle,"Service")
      }
      }, 2000);
      handle.walkthroughInstance= WalkthroughSDK.getInstance();
      handle.instance=true;
      const bodyelem = document.body;
      bodyelem.insertAdjacentHTML('afterend', ((this.customplaceholder?'':'<div id="selfhelpicon" class='+this.styleforDefaultplaceholder.position+'><div id="micsselfhelptoggler"style=background-color:'+this.styleforDefaultplaceholder.backgroundcolor+'><svg width="20px" height="20px" id="helphublogoinwidget" viewBox="0 0 281 246" fill="none"><path fill-rule="evenodd" clip-rule="evenodd" d="M0 21C0 9.40201 9.40202 0 21 0H259.538C271.136 0 280.538 9.40202 280.538 21V192.992C280.538 204.59 271.136 213.992 259.538 213.992H21C9.40204 213.992 0 204.59 0 192.992V21ZM134.397 91.334C134.397 101.063 129.14 108.949 122.654 108.949C116.168 108.949 110.91 101.063 110.91 91.334C110.91 81.6053 116.168 73.7188 122.654 73.7188C129.14 73.7188 134.397 81.6053 134.397 91.334ZM170.281 108.949C176.766 108.949 182.024 101.063 182.024 91.334C182.024 81.6053 176.766 73.7188 170.281 73.7188C163.795 73.7188 158.537 81.6053 158.537 91.334C158.537 101.063 163.795 108.949 170.281 108.949Z" fill="white"/><path d="M143.012 242.675C141.813 244.305 139.377 244.305 138.178 242.675L113.881 209.636C112.424 207.655 113.838 204.859 116.298 204.859H164.893C167.352 204.859 168.767 207.655 167.31 209.636L143.012 242.675Z" fill="white"/></svg><span id="textself">'+this.selfhelpcontents.indicatortext+'</span></div></div>')+
        '<div id="micsselfhelpContainer" class='+this.styleforDefaultplaceholder.position+'><div id="topbar"><div id="helphublogotextcontainer"><svg width="24px" height="24px" viewBox="0 0 281 246" fill="none"><path fill-rule="evenodd" clip-rule="evenodd" d="M0 21C0 9.40201 9.40202 0 21 0H259.538C271.136 0 280.538 9.40202 280.538 21V192.992C280.538 204.59 271.136 213.992 259.538 213.992H21C9.40204 213.992 0 204.59 0 192.992V21ZM134.397 91.334C134.397 101.063 129.14 108.949 122.654 108.949C116.168 108.949 110.91 101.063 110.91 91.334C110.91 81.6053 116.168 73.7188 122.654 73.7188C129.14 73.7188 134.397 81.6053 134.397 91.334ZM170.281 108.949C176.766 108.949 182.024 101.063 182.024 91.334C182.024 81.6053 176.766 73.7188 170.281 73.7188C163.795 73.7188 158.537 81.6053 158.537 91.334C158.537 101.063 163.795 108.949 170.281 108.949Z" fill="white"/><path d="M143.012 242.675C141.813 244.305 139.377 244.305 138.178 242.675L113.881 209.636C112.424 207.655 113.838 204.859 116.298 204.859H164.893C167.352 204.859 168.767 207.655 167.31 209.636L143.012 242.675Z" fill="white"/></svg><span id="text">'+this.selfhelpcontents.popupheader+'</span></div><svg id="micsselfhelpclosableIcon"  viewBox="-3 -3 30 30" width="20" height="20"   fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ><path d="M18 6L6 18M6 6l12 12"></path></svg></div><div id="walkthroughlistsearchbar" ><svg id="searchicon" fill="none" stroke="currentColor" viewBox="0 0 16 16"><path d="m14.48,12.18l-3.61-3.61s-.03-.02-.05-.03c.36-.71.58-1.49.58-2.34,0-2.87-2.33-5.2-5.2-5.2S1,3.33,1,6.2s2.33,5.2,5.2,5.2c.85,0,1.63-.22,2.34-.58.01.02.02.03.03.05l3.61,3.61c.32.32.73.47,1.15.47s.83-.16,1.15-.47c.63-.63.63-1.66,0-2.3ZM2,6.2c0-2.32,1.88-4.2,4.2-4.2s4.2,1.88,4.2,4.2-1.88,4.2-4.2,4.2-4.2-1.88-4.2-4.2Zm11.77,7.57c-.24.24-.64.24-.88,0l-3.49-3.5c.33-.26.62-.55.88-.88l3.5,3.49c.24.24.24.64,0,.88Z"></path></svg><input type="text" id="micsselfhelpsearchinput" autocomplete="off" placeholder="'+this.selfhelpcontents.searchbarplaceholder+'"></div><div id="walkthroughlistcontainer"></div></div>'));
      document.getElementById('micsselfhelptoggler').addEventListener('click', this.#showselfhelpPopup.bind(this));
      document.getElementById('micsselfhelpclosableIcon').addEventListener('click', this.#showselfhelpPopup.bind(this));
      document.getElementById('micsselfhelpsearchinput').addEventListener('keyup', function() {
      handle.#materialsearch(handle);
          });
      this.togglediv=document.getElementById('micsselfhelpContainer');
      this.#addListInWalkthrough();
      this.#urlchangeListner();
    }
    
    setStylefordefaultPlaceholder(stylefordefaultplaceholder={}){
        this.styleforDefaultplaceholder=this.#updatedefaultjson(this.styleforDefaultplaceholder,stylefordefaultplaceholder);
        if(this.instance){
          this.#applyplaceholderstyles();
        }  
    }
    setStyleforSelfhelpPopup(styleforselfhelppopup={}){
      this.styleforselfhelppopup=this.#updatedefaultjson(this.styleforselfhelppopup,styleforselfhelppopup);
      if(this.instance){
      this.#applypopupstyles();
      }
    }
    setSelfhelpContent(selfhelpcontents={}){
      this.selfhelpcontents=this.#updatedefaultjson(this.selfhelpcontents,selfhelpcontents);
    }
    
    changePlaceholder(indicatorID){
      var handle=this;
      handle.customplaceholder= document.getElementById(indicatorID);
      handle.customplaceholder?handle.customplaceholder.addEventListener('click',function(){
          handle.#showselfhelpPopup();
      }):'';
    }
  
    setverifydata(message){
        selfhelpsdk.instance.selfhelpmateriallist = message.meta;
        selfhelpsdk.instance.verificationcontent=message.content;
        selfhelpsdk.instance.verification  = true;
    }
    
    #checkverifydata(handle){
        if(sessionStorage.getItem("selfhelpverifydata")){
            var sessiondata=sessionStorage.getItem("selfhelpverifydata");
            sessiondata=JSON.parse(sessiondata);
            sessionStorage.removeItem("selfhelpverifydata");
            handle.setverifydata(sessiondata);
        }
    }
  
    #getdatacallback(handle,scope){
      handle.micssdktoserverInstance.getMeta({
      "orgid":handle.orgid,
      "serviceid":handle.serviceid,
      "action":"getTip",
      "Scope":scope
      },"get",
      function orgsuccess(xhttp){
        if(handle.verification){
          return
        }
        try{
            var parsingmeta = JSON.parse(xhttp);
            handle.selfhelpmateriallist = [...handle.selfhelpmateriallist, ...parsingmeta];
        }
        catch(e){

        }
        return true;
      },
      function orgerror(xhttp){ 
          setTimeout(handle.initialize(),30000);
          return false;
      });
    }
    
    #selfhelpurlmatch(url, pattern) { //Pattern matching algorithm
      let urlIndex = 0;
      let patternIndex = 0;
      let lastWildcardIndex = -1;
      let backtrackUrlIndex = -1;
      let nextToWildcardIndex = -1;
      let urlLength=url.length;
      let patternLength=pattern.length;
    
      while (urlIndex < urlLength) {
      if (patternIndex < patternLength && (pattern[patternIndex] === url[urlIndex])) {
      urlIndex++;
      patternIndex++;
      } else if (patternIndex < patternLength && pattern[patternIndex] === '*') {
      lastWildcardIndex = patternIndex;
      nextToWildcardIndex = ++patternIndex;
      backtrackUrlIndex = urlIndex;
      } else if (lastWildcardIndex === -1) {
      return false;
      } else {
      patternIndex = nextToWildcardIndex;
      urlIndex = ++backtrackUrlIndex;
      }
      }
      for (let i = patternIndex; i < patternLength; i++) {
      if (pattern[i] !== '*') {
      return false;
      }
      }
      return true; 
      }
  
    #urlchangeListner() {
          var handle = this;
          var originalPushState = history.pushState;
          var originalReplaceState = history.replaceState;
      
          history.pushState = function() {
              originalPushState.apply(history, arguments);
              handle.#hideselfhelpforurlchange(handle);
          };
      
          history.replaceState = function() {
              originalReplaceState.apply(history, arguments);
              handle.#hideselfhelpforurlchange(handle);
          };
      
          window.addEventListener('popstate', function(event) {
              handle.#hideselfhelpforurlchange(handle);
          });
      
          window.addEventListener('hashchange', function() {
              handle.#hideselfhelpforurlchange(handle);
          });
      }
      
    #hideselfhelpforurlchange(handle){
      if(!handle.selftoggle){
      return;
      }
      handle.#showselfhelpPopup();
      }
    
    #showselfhelpPopup() {
      this.selftoggle = !this.selftoggle;
      var setsearchempty = document.getElementById('micsselfhelpsearchinput').value;
      setsearchempty ? document.getElementById('micsselfhelpsearchinput').value='' : '';
      this.#createmateriallist();
    }
   
    #createmateriallist(){
      if (this.selftoggle) {
          this.#addListInWalkthrough(); 
          this.#applyplaceholderstyles();
          this.togglediv.style.display = 'block';
          if(!this.customplaceholder){
              document.getElementById("selfhelpicon").style.display='none';
          }
          this.#applypopupstyles();
          /*verifier call*/
          if(this.verification && document.referrer && this.#selfhelpurlmatch(location.href.replace(location.origin,""),this.selfhelpmateriallist[0].url)){
            VerificationCompleteMessager.notifySuccess("selfhelp"); 
            return
          }
          //metric collection selfhelp click("medium")
          return '';
      }
      if(!this.customplaceholder){
          document.getElementById("selfhelpicon").style.display='';
      }
      this.togglediv.style.display = 'none';
  
    } 
    
    
    #addListInWalkthrough() {
        var handle=this;
        var walkthroughlistid = document.getElementById('walkthroughlistcontainer');
        walkthroughlistid.innerHTML = ('<span style="margin:auto;text-align:center;font-size:'+handle.styleforselfhelppopup.noitem.fontSize+';font-family:'+handle.styleforselfhelppopup.noitem.fontFamily+';font-weight:'+handle.styleforselfhelppopup.noitem.fontWeight+';color:'+handle.styleforselfhelppopup.noitem.fontColor+'">'+handle.selfhelpcontents.emptylist+'</span>');
        var currenturl=location.href.replace(location.origin,"");
        handle.searchdatalist=[];
        handle.getallwalkthroughid={"Enterprise":[],"Service":[]};
        var selfhelpmanipulatedom='';
        for (var item of this.selfhelpmateriallist) {
          if(this.#selfhelpurlmatch(currenturl,item.url)){
              handle.searchdatalist=[...handle.searchdatalist,...item.panellist];
              }
            }
        // if need filter the dublicate walkthrough id's here.
        if(handle.searchdatalist.length){
        walkthroughlistid.innerHTML='';
        }
        for (var selfhelpmaterialList of handle.searchdatalist){
          for(var materialItem of selfhelpmaterialList.materiallist){
            selfhelpmanipulatedom += ('<div class="flowlist" scope="'+selfhelpmaterialList.Scope+'" panelId="'+selfhelpmaterialList.id+ '" materialId="'+materialItem.id+'" ><span >'+materialItem.displayname+'</span></div>');
            if(selfhelpmaterialList.id>-1){
                  handle.getallwalkthroughid[selfhelpmaterialList.Scope].push(materialItem.id);
                  }
               }
          }
	
        if(selfhelpmanipulatedom!==''){
        walkthroughlistid.innerHTML=selfhelpmanipulatedom;
        }  
        selfhelpmanipulatedom='';             
        handle.walkthroughInstance.loadFlow(handle.getallwalkthroughid["Service"],"Service");
        handle.walkthroughInstance.loadFlow(handle.getallwalkthroughid["Enterprise"],"Enterprise");
        handle.#setdynamicstyleforlist()
        handle.#addlistener(handle);
      }
    
      #addlistener(handle){
        var flowListElements=document.querySelectorAll('.flowlist');
        flowListElements?flowListElements.forEach(function (element) {
        element.addEventListener('click', function () {
              var panelID=element.getAttribute("panelId");
              var materialID=element.getAttribute("materialId");
              var scope=element.getAttribute("scope");
              handle.#showselfhelpPopup();
              if(panelID<=-1){
                  handle.verificationcontent[materialID].expiryTime = new Date().getTime() + 60000;
                  handle.walkthroughInstance.datamanager.WalkthroughData[materialID]=handle.verificationcontent[materialID];
              }
              handle.walkthroughInstance.triggerFlow(materialID,"selfhelp",panelID,scope);
         });
       }):'';
      }
      #applyplaceholderstyles(){
        var micsselfhelptoggler = document.querySelector("#micsselfhelptoggler");
        micsselfhelptoggler.style[this.stylereference.backgroundcolor]=this.styleforDefaultplaceholder.backgroundcolor;
        micsselfhelptoggler.style[this.stylereference.fontColor]=this.styleforDefaultplaceholder.fontColor;
        micsselfhelptoggler.style[this.stylereference.fontSize]=this.styleforDefaultplaceholder.fontSize;
        micsselfhelptoggler.style[this.stylereference.fontWeight]=this.styleforDefaultplaceholder.fontWeight;
        micsselfhelptoggler.style[this.stylereference.fontFamily]=this.styleforDefaultplaceholder.fontFamily;
        micsselfhelptoggler.style[this.stylereference.borderRadius]=this.styleforDefaultplaceholder.borderRadius;
        micsselfhelptoggler.style[this.stylereference.width]=this.styleforDefaultplaceholder.width;
        micsselfhelptoggler.style[this.stylereference.height]=this.styleforDefaultplaceholder.height;
      }
      
      #applypopupstyles(){
      
        var micsselfhelpContainer= document.querySelector("#micsselfhelpContainer");
        micsselfhelpContainer.style[this.stylereference.backgroundcolor]=this.styleforselfhelppopup.home.backgroundcolor;
        micsselfhelpContainer.style[this.stylereference.fontFamily]=this.styleforselfhelppopup.home.fontFamily;
        micsselfhelpContainer.style[this.stylereference.boxShadow]=this.styleforselfhelppopup.home.boxShadow;
      
        var topbar= document.querySelector("#micsselfhelpContainer > #topbar");
        topbar.style[this.stylereference.backgroundcolor]=this.styleforselfhelppopup.topband.backgroundcolor;
        topbar.style[this.stylereference.fontFamily]=this.styleforselfhelppopup.topband.fontFamily;
        topbar.style[this.stylereference.fontWeight]=this.styleforselfhelppopup.topband.fontWeight;
        topbar.style[this.stylereference.fontSize]=this.styleforselfhelppopup.topband.fontSize;
        topbar.style[this.stylereference.boxShadow]=this.styleforselfhelppopup.topband.boxShadow;
        topbar.style[this.stylereference.height]=this.styleforselfhelppopup.topband.height;
      
        var topbartext= document.querySelector("#micsselfhelpContainer > #topbar > #text");
        topbartext.style[this.stylereference.fontColor]=this.styleforselfhelppopup.topband.fontColor;
      
        var closeicon= document.querySelector("#micsselfhelpContainer > #topbar > #micsselfhelpclosableIcon");
        closeicon.style[this.stylereference.iconColor]=this.styleforselfhelppopup.closebutton.iconColor;
        closeicon.style[this.stylereference.iconSize]=this.styleforselfhelppopup.closebutton.iconSize;
      
        var searchbar= document.querySelector("#walkthroughlistsearchbar");
        searchbar.style[this.stylereference.backgroundcolor]=this.styleforselfhelppopup.searchbar.backgroundcolor;
        searchbar.style[this.stylereference.borderRadius]=this.styleforselfhelppopup.searchbar.borderRadius;
        searchbar.style[this.stylereference.border]=this.styleforselfhelppopup.searchbar.border;
        
        var searchicon= document.querySelector("#walkthroughlistsearchbar > #searchicon");
        searchicon.style[this.stylereference.iconSize]=this.styleforselfhelppopup.searchbar.iconSize;
        searchicon.style[this.stylereference.iconColor]=this.styleforselfhelppopup.searchbar.iconColor;
      
        var searchinput= document.querySelector("#walkthroughlistsearchbar > #micsselfhelpsearchinput");
        searchinput.style[this.stylereference.fontColor]=this.styleforselfhelppopup.searchbar.fontColor;
        this.#setdynamicstyleforlist()
      
      }
      
      #setdynamicstyleforlist(){
        var listitemhover= document.querySelectorAll(".flowlist");
        var handle=this;
        listitemhover.length?listitemhover.forEach(material => {
          material.onmouseover = function() {
              material.style[handle.stylereference.backgroundcolor] = handle.styleforselfhelppopup.listitemhover.backgroundcolor;
              material.style[handle.stylereference.fontColor] = handle.styleforselfhelppopup.listitemhover.fontColor;
          };
          material.onmouseout = function() {
              material.style[handle.stylereference.backgroundcolor] = handle.styleforselfhelppopup.listitem.backgroundcolor;
              material.style[handle.stylereference.fontColor] = handle.styleforselfhelppopup.listitem.fontColor;
          };
        material.style[this.stylereference.backgroundcolor]=this.styleforselfhelppopup.listitem.backgroundcolor;
        material.style[this.stylereference.fontColor]=this.styleforselfhelppopup.listitem.fontColor;
        material.style[this.stylereference.height]=this.styleforselfhelppopup.listitem.height;
        material.style[this.stylereference.fontSize]=this.styleforselfhelppopup.listitem.fontSize;
        material.style[this.stylereference.fontFamily]=this.styleforselfhelppopup.listitem.fontFamily;
        material.style[this.stylereference.fontWeight]=this.styleforselfhelppopup.listitem.fontWeight;
      }):"";
      }
    
    #updatedefaultjson(target, source) {
      for (const key in source) {
          if (source[key] instanceof Object && key in target) {
              Object.assign(source[key], this.#updatedefaultjson(target[key], source[key]));
          }
      }
      Object.assign(target || {}, source);
      return target;
    }
    
    
    #materialsearch(handle){
     var searchvalue=document.getElementById('micsselfhelpsearchinput').value.trim().toLowerCase();
     var selfhelpmanipulatedom='';
     if(searchvalue==='' && handle.selftoggle){
      handle.#createmateriallist();
      return;
      }
     var walkthroughlistid = document.getElementById('walkthroughlistcontainer');
     walkthroughlistid.innerHTML = ('<span style="margin:auto;text-align:center;font-size:'+handle.styleforselfhelppopup.noitem.fontSize+';font-family:'+handle.styleforselfhelppopup.noitem.fontFamily+';font-weight:'+handle.styleforselfhelppopup.noitem.fontWeight+';color:'+handle.styleforselfhelppopup.noitem.fontColor+'">'+handle.selfhelpcontents.emptylist+'</span>');
     handle.getallwalkthroughid={"Enterprise":[],"Service":[]};
     if(handle.searchdatalist.length){
            walkthroughlistid.innerHTML='';
            }
     for(var selfhelpmaterialList of handle.searchdatalist){
         for(var materialItem of selfhelpmaterialList.materiallist){
              if(materialItem.displayname.toLowerCase().includes(searchvalue)){
                      selfhelpmanipulatedom += ('<div class="flowlist" scope="'+selfhelpmaterialList.Scope+'" selfhelpId="'+selfhelpmaterialList.id+ '" materialId="'+materialItem.id+'" ><span >'+materialItem.displayname+'</span></div>');
                      if(selfhelpmaterialList.id>-1){
                          handle.getallwalkthroughid[selfhelpmaterialList.Scope].push(materialItem.id);
                          }
              }
         }
     }
	if(selfhelpmanipulatedom!==''){
	walkthroughlistid.innerHTML=selfhelpmanipulatedom;
        }
        selfhelpmanipulatedom='';
     handle.#setdynamicstyleforlist()
     if(handle.getallwalkthroughid["Enterprise"][0]==undefined && handle.getallwalkthroughid["Service"][0]==undefined){
       walkthroughlistid.innerHTML=('<span style="margin:auto;text-align:center;font-size:'+handle.styleforselfhelppopup.noitem.fontSize+';font-family:'+handle.styleforselfhelppopup.noitem.fontFamily+';font-weight:'+handle.styleforselfhelppopup.noitem.fontWeight+';color:'+handle.styleforselfhelppopup.noitem.fontColor+'">'+handle.selfhelpcontents.searchnotfound+'</span>');
     }
        handle.#addlistener(handle);
    }
    }
// //$Id$
// class WmsCallback {
//     constructor() { }
//     handleMessages(prd, msg) {
//         if (prd == 'MI' && msg["inproduct.messages"] == 'Banner' && msg.payload && msg.payload['mics.data']) {
//             this.handleServerStatus(true, msg);
//             window.postMessage({ emittype: 'bannerMsgFromWms', msg: msg }, "*");
//         }
//         else if (msg["inproduct.messages"] == "MessageBoard" && msg.payload && msg.payload['mics.pid']) {
//             window.postMessage({ emittype: 'messageboardMsgFromWms', msg: msg }, "*");
//         }
//     }
//     handleServerStatus(isUp, msg) {
//         window.postMessage({ emittype: 'bannerServerupFromWms', "serverup": isUp }, "*");
//         window.postMessage({ emittype: 'messageboardServerupFromWms', "serverup": isUp }, "*");
//     }
//     intialize() {
//         var self = this;
//         setTimeout(function () {
//             if (typeof (WebMessanger) !== 'undefined' && (getWmsConfig() & WMSSessionConfig.CROSS_PRD) == WMSSessionConfig.CROSS_PRD) {
//                 WebMessanger.subscribeToCrossProductMessages(function (prd, msg) {
//                     self.handleMessages(prd, msg);
//                 });
//                 WebMessanger.subscribeToServerUp(function (prd, msg) {
//                     setTimeout(function () { self.handleServerStatus(true, msg); }, 10000)
//                 });
//                 WebMessanger.subscribeToServerDown(function (prd, msg) {
//                     self.handleServerStatus(false, msg);
//                 });
//             }
//             else if (typeof (WmsLite) !== 'undefined') {
//                 WmsLite.subscribeToCrossProductMessages(function (prd, msg) {
//                     self.handleMessages(prd, msg);
//                 });
//                 WmsLite.subscribeToServerUp(function (prd, msg) {
//                     setTimeout(function () { self.handleServerStatus(true, msg); }, 10000)
//                 });
//                 WmsLite.subscribeToServerDown(function (prd, msg) {
//                     self.handleServerStatus(false, msg);
//                 });
//             }
//         }, 1000);
//     }
// }
// var wms = new WmsCallback();
// wms.intialize();//  $Id$
class WalkthroughLayoutManager {
    static instance = ''
    constructor() {
        this.ongoingStepLayout = ''   
    }

    createLayout(shadowdom,ongoingWalkthroughData){
        this.ongoingStepLayout = document.createElement('div');
        this.ongoingStepLayout.setAttribute("id", "walkthroughlayout");
        this.ongoingStepLayout.style.zIndex = 23657675643;
        this.ongoingStepLayout.style.position = "absolute";
        shadowdom.shadowRoot.append(this.ongoingStepLayout);

        var style = document.createElement('style')
        var commonscript=document.createElement('script');
        commonscript.innerHTML=ongoingWalkthroughData.commonScript;


        shadowdom.shadowRoot.append(commonscript);
        style.innerHTML =ongoingWalkthroughData.commonCss;
        shadowdom.shadowRoot.append(style)
    }


    showStep(ongoingStepData) {

        let ongoingStepCssSelector = ongoingStepData.meta.targetelementID;
        let targetElement= document.querySelector(ongoingStepCssSelector);
        targetElement.scrollIntoView({
            block: "center",
            inline: "nearest"
        });
        this.ongoingStepLayout.innerHTML = `<style>${ongoingStepData.css}</style>`+ongoingStepData.html;
        var script=document.createElement('script');
        script.innerHTML=ongoingStepData.script;
        this.ongoingStepLayout.append(script);
    
       this.addEventsForCurrentStep(targetElement);
       // this.observeDOMElementChange(element);

    }

    
    addEventsForCurrentStep( element) {
        var buttons = this.ongoingStepLayout.querySelectorAll("#buttoncontainer");
        if (buttons) {
            buttons.forEach((btn) => {
                var action = btn.getAttribute('goto_action');
                //for redirecting url
                switch (action) {
                    case 'web url':
                        btn.addEventListener('click', () => {
                            window.open(btn.getAttribute('goto_action_value'), '_blank');
                        })
                        break;

                    case "NextStep":
                        btn.addEventListener('click', (e) => {    
                            if (this.ongoingStepLayout.querySelectorAll('div [trigger_targetelement="true"')[0]) {
                                element.focus()
                                let event = new MouseEvent('click', {
                                    bubbles: true,
                                    cancelable: true,
                                    view: window
                                });
                                element.dispatchEvent(event);
                            }
                            WalkthroughSDK.getInstance().navigateToNextStep(e);
                        })
                        break;

                    case "PreviousStep":
                        btn.addEventListener('click', () => {
                            WalkthroughSDK.getInstance().navigateToPrevStep();
                        })
                        break;

                    case "Quit":
                        btn.addEventListener('click', () => {
                            WalkthroughSDK.getInstance().sendMetric({
                                'statusCode': 3
                            });
                            WalkthroughSDK.getInstance().endTour()
                        })


                }
            })
        }
    //    let element = document.querySelector(cssId)
    //     if (nextStepAction.target == "targetElement") {

    //         element.addEventListener('mousedown', (e) => WalkthroughSDK.getInstance().navigateToNextStep(e), {
    //             once: true
    //         });
    //     }

        //     //element.addEventListener('click',(event) => this.navigateToNextStep(event),true)
        // }
        // var ongoingStepElement = element || document.querySelector(cssId)
        // this.layoutTop = ongoingStepElement.getBoundingClientRect().top
        // this.layoutLeft = ongoingStepElement.getBoundingClientRect().left
        // this.positionCheckInterval ? clearInterval(this.positionCheckInterval) : ''
        // this.positionCheckInterval = setInterval(this.checkElementPostionChange(ongoingStepElement), 500)
    }





}//  $Id$
class WalkthroughUtility {
    constructor() {

    }
    static constructDynamicURL(flowurl, dynamicPath) {
        var regenaratorUrl = flowurl;
        var dynamicPatterns = flowurl.match(/{{(.*?)}}/g);
        if (dynamicPatterns) {
            dynamicPatterns = dynamicPatterns.map(value => value.slice(2, -2));
            dynamicPatterns.forEach(key => {
                regenaratorUrl = regenaratorUrl.replace(`{{${key}}}`, dynamicPath[key])
            });
        }
        return regenaratorUrl;
    }

    static findElement(cssID) {
        var element = this.getElementDOMObject(cssID)
        if (element != null) {
            return true;
        }
        return false;
    }

    static getElementDOMObject(cssID) {
        return document.querySelector(cssID);
    }

    static logger(message, type) {
        if (!WalkthroughSDK.getInstance().debugger) return;
        switch (type) {
            case 'log':
                console.log(message)
                break

            case 'group':
                console.group(message)
                break

            case 'groupEnd':
                console.groupEnd(message)
                break

            case 'warn':
                console.warn(message)
                break

            default:
                console.log(message)
        }
    }


    // static hasElementPositionChanged(ongoingStepElement, backdropCenterDiv) {
    //     let targetTop = ongoingStepElement.getBoundingClientRect().top
    //     let targetLeft = ongoingStepElement.getBoundingClientRect().left
    //     let elementTop = backdropCenterDiv.getBoundingClientRect().top
    //     let elementLeft = backdropCenterDiv.getBoundingClientRect().left
    //     if (targetTop == elementTop && targetLeft == elementLeft) {
    //         return false;
    //     }
    //     return true;
    // }

    static getCurrentUrlPath() {
        return window.location.href.replace(window.location.origin, '');
    }

    static urlCheck(stepurl) {
        var sdkInstance = WalkthroughSDK.getInstance();
        if (WalkthroughUtility.getCurrentUrlPath() == stepurl || (sdkInstance.WalkthroughValidator.urlPatternCheck && WalkthroughUtility.isUrlPatternMatch(WalkthroughUtility.getCurrentUrlPath(), sdkInstance.ongoingStepData.meta.layoutroute).isSuccess)) {
            return true;
        }
        return false;
    }

    static isUrlPatternMatch(url, url_w_pattern) {
        let isFailed = false, reason = "";
        if (!WalkthroughUtility.validateDynamicURLSyntax(url_w_pattern)) {
            return { isSuccess: false, reason: "Syntax is wrong!!" };
        }

        let startIndex = 0, endIndex = -1, counter = 0, diffs = [];
        while (counter < 100) {
            startIndex = 0;
            endIndex = url_w_pattern.search("{{");
            let str = "";
            if (endIndex > -1) {
                str = url_w_pattern.substring(startIndex, endIndex);
            } else if (url_w_pattern == "" || url.endsWith(url_w_pattern)) {
                return { isSuccess: true, reason: "URL is Matching!!" };
            } else {
                return { isSuccess: false, reason: "URL is Mismatching!!" };
            }
            if (str == "") {
                return { isSuccess: true, reason: "URL is Matching!!" };
            } else if (url.search(str) == -1) {
                return { isSuccess: false, reason: "URL mismatching!!" };
            } else {
                let start = url.search(str) + str.length;
                let end = url.length;
                url = url.substring(start, end);
                startIndex = url_w_pattern.search("}}") + 2;
                url_w_pattern = url_w_pattern.substring(startIndex, url_w_pattern.length);
                //console.log("URL check: sliced url" + url);
            }
            counter++;
        }
    }

    static validateDynamicURLSyntax(url) {
        let istrue = true, counter = 0;
        while (counter < 100) {
            let leftBraceIndx = url.search("{{");
            let rightBraceIndx = url.search("}}");
            //console.log("SYNTAX check: sliced url" + url);
            if (leftBraceIndx > -1 && rightBraceIndx > -1 && WalkthroughUtility.validateVariableName(url.substring(leftBraceIndx + 2, rightBraceIndx))) {
                url = url.slice(rightBraceIndx + 2, url.length);
                //console.log("SYNTAX check: sliced url" + url);
            } else if (leftBraceIndx == -1 && rightBraceIndx == -1) {
                return true;
            } else {
                return false;
            }
            counter++;
        }
    }

    static validateVariableName(name) {
        return name.match("^[^a-zA-Z_$]|[^\\w$]") == null;
    }
}//  $Id$ 
class WalkthroughValidator {
    constructor() {
        this.urlPatternCheck = false;
    }
    postRenderValidationInterval(stepurl, cssId, ongoingStepElement) {

        let flag = -1;
        let urlValidation = WalkthroughUtility.urlCheck(stepurl);
        if (urlValidation == true) {
            WalkthroughUtility.logger("url check passed");
            var elementValidation;
            try {
                elementValidation = WalkthroughUtility.findElement(cssId);
            } catch (error) {
                elementValidation = false;
            }

            if (elementValidation == true && ongoingStepElement == WalkthroughUtility.getElementDOMObject(cssId)) {
                flag = -1;
                WalkthroughUtility.logger("element check passed");
            } else if (elementValidation == true && ongoingStepElement != WalkthroughUtility.getElementDOMObject(cssId)) {
                flag = 3;
            } else if (elementValidation == false) {
                flag = 2;
                WalkthroughUtility.logger("VALIDATION FAILED,Element not found,....")
                console.groupEnd();
            }

        } else {
            flag = 1;
            WalkthroughUtility.logger("VALIDATION FAILED,USER NAVIGATED!......")
        }
        return flag;

    }

    preRenderValidationInterval(stepurl, cssId) {
        let flag = -1;
        let urlValidation = WalkthroughUtility.urlCheck(stepurl);
        if (urlValidation == true) {
            WalkthroughUtility.logger("url check passed");
            let elementValidation;
            try {
                elementValidation = WalkthroughUtility.findElement(cssId);
            } catch (error) {
                flag = 2;
            }
            if (elementValidation == true) {
                WalkthroughUtility.logger("Element found");
                WalkthroughUtility.logger("VALIDATION SUCCESSFUL.....");
                console.groupEnd()
            } else {
                WalkthroughUtility.logger("element check failed");
                flag = 2;
            }
        } else {
            WalkthroughUtility.logger("url check failed");
            flag = 1;
        }
        return flag;
    }





}//  $Id$
class WalkthroughDataManager {
    constructor(serviceId, orgID) {
        this.serviceId = serviceId;
        this.orgID = orgID;
        this.dataThreshold = 20;
        this.WalkthroughData = {}
    }


    removeExistingFlowID(flowlist) {
        flowlist = flowlist.splice(0, this.dataThreshold);
        let newflowlist = []
        for (let flowid of flowlist) {
    
            if (!this.WalkthroughData[flowid]) {
                newflowlist.push(flowid)
            } else {
                this.WalkthroughData[flowid].expiryTime = new Date().getTime() + 900000
            }
        }
        return newflowlist;

    }

    optimizeData(flowlist) {
        WalkthroughUtility.logger('incoming flowlist', flowlist)
        //remove Expired Flows
        this.removeExpiredFlows()
        WalkthroughUtility.logger('after removing expried flows', this.WalkthroughData)
        let newflowlist = this.removeExistingFlowID(flowlist);
        WalkthroughUtility.logger('after removing repeated flowids', newflowlist);
        let newFlowListlen = newflowlist.length;
        let existingFlowLen = Object.keys(this.WalkthroughData).length


        //if  incoming flow list plus already present data is > greater than threshold ,remove old flows
        if (existingFlowLen + newFlowListlen >= this.dataThreshold) {
            let noofflowsToBeRemoved = Object.keys(this.WalkthroughData).length + newFlowListlen - this.dataThreshold
            this.removeAboutToExpiryFlows(noofflowsToBeRemoved)
        }

        return newflowlist;

    }

    loadFlow(flowlist,scope) {
        let self = this;

        let newflowlist = this.optimizeData(flowlist);
        if (newflowlist.length == 0) {
            return;
        }

        function onsuccess(response) {
            let data = JSON.parse(response)
            self.setwalkthroughData(data,scope)
            //window.localStorage.setItem(flowlist,JSON.stringify(data))
        }

        function onerror() {
            WalkthroughUtility.logger(response)

        }
        WalkthroughSDK.getInstance().micssdktoserver.getContent({
            'serviceid': this.serviceId,
            'action': "load",
            "orgid":this.orgID,
            "flowidlist": newflowlist,
            "Scope":scope,
        }, "post", onsuccess, onerror)
    }

    removeExpiredFlows() {
        let currTime = new Date().getTime();
        for (var flow in this.WalkthroughData) {
            let flowexpiryTime = this.WalkthroughData[flow].expiryTime
            if (flowexpiryTime < currTime) {
                delete(this.WalkthroughData[flow])
            }
        }
    }

    setwalkthroughData(data,scope){
        for (let flowid in data) {
            this.WalkthroughData[flowid] =data[flowid];
            this.WalkthroughData[flowid].expiryTime = new Date().getTime() + 900000;
            this.WalkthroughData[flowid].scope=scope
        }
    }

    removeAboutToExpiryFlows(count) {
        var sortedFlow = Object.entries(this.WalkthroughData).sort(this.compareObj);
        //delete topmost flows which has expiry time 
        for (var i = count; i > 0; i--) {
            WalkthroughUtility.logger("deleting about to expiry flows", sortedFlow[i])
            delete(this.WalkthroughData[sortedFlow[i]])
        }

    }



    loadAndTriggerFlow(flowid, medium, PID,scope) {
        let self = this;
        function onsuccess(response) {
            let data = JSON.parse(response)
            self.setwalkthroughData(data,scope)
            WalkthroughSDK.getInstance().triggerFlow(flowid, medium, PID,scope);
        }

        function onerror() {
            WalkthroughUtility.logger(response)
        }

        WalkthroughSDK.getInstance().micssdktoserver.getContent({
            'serviceid': this.serviceId,
            'action': "load",
            "orgid":this.orgID,
            "flowidlist": flowid,
            "Scope":scope,
        }, "post", onsuccess, onerror)


    }


}//  $Id$
class WalkthroughSDK {
    static instance = ''
    constructor(serviceconf, orgid, dynamicPath) {
        this.dynamicPath = {}
        this.setDynamicPath(dynamicPath);
        this.serviceid = serviceconf.serviceid;
        this.orgid = orgid;
        this.inproductconf = serviceconf;
        this.tipdomain = serviceconf.inproductdomain
        this.shadowdom = null;
        this.ongoingWalkthroughData = "";
        this.ongoingStepElement = "";
        this.ongoingStepJSON = "";
        this.ongoingStepNumber;
        this.sessionStartTime;
        this.rePositionLayoutOnResizeref;
        this.rePositionLayoutOnScrollref;
        this.debugger = false;
        this.counter;
        this.flowID;
        this.urlcounter;
        this.validationInterval;
        this.micssdktoserver = Micssdktoserver.getinstance(this.inproductconf, this.orgid, "walkthrough");
        this.datamanager = new WalkthroughDataManager(this.serviceid, this.orgid);
        this.WalkthroughValidator = new WalkthroughValidator();
        this.WalkthroughLayoutManager = ''
        WalkthroughSDK.instance = this;
    }
    initialize() {
        this.checkActiveFlow() ? this.startTour(this.ongoingWalkthroughData) : ''
    }

    static getInstance() {
        return WalkthroughSDK.instance;
    }

    createShadowDom() {
        this.shadowdom = document.createElement('walkthrough-builder')
        this.shadowdom.setAttribute("id", "walkthrough")
        document.body.append(this.shadowdom)
        // this.shadowdom =  this.shadowdom.attachShadow({
        //      mode: "closed"
        //  })
        this.shadowdom.attachShadow({
            mode: "open"
        })
        this.WalkthroughLayoutManager = new WalkthroughLayoutManager();
        this.WalkthroughLayoutManager.createLayout(this.shadowdom, this.ongoingWalkthroughData);
    }

    startTour() {
        WalkthroughUtility.logger("starting the tour");
        this.ongoingStepNumber = 0;
        this.ongoingStepData = this.ongoingWalkthroughData.templates[this.ongoingStepNumber];
        this.isFlowStarted = true;
        this.createShadowDom();
        WalkthroughUtility.logger(`VALIDATING STEP ${this.ongoingStepNumber + 1} .....`, 'group')
        this.sessionStartTime = new Date().getTime()

        this.WalkthroughValidator.urlPatternCheck = (this.promotionId == "-1" || this.promotionId == "0") ? true : false;
        this.validationBeforeRender();

        // this.rePositionLayoutonScrollref = this.rePositionLayoutonScroll.bind(this);
        // this.rePositionLayoutOnResizeref = this.rePositionLayoutOnResize.bind(this);
        // window.addEventListener("resize", this.rePositionLayoutOnResizeref);
        // window.addEventListener("wheel", this.rePositionLayoutonScrollref);
    }


    navigateToNextStep(event) {
        event.stopPropagation();
        WalkthroughUtility.logger('triggering next flow');
        this.sendMetric({
            'statusCode': 2
        });
        if (this.validationInterval) {
            window.clearInterval(this.validationInterval);
        }
        // this.WalkthroughLayoutManager.destroyEvents('all');
        if (this.ongoingWalkthroughData.templates.length - 1 == this.ongoingStepNumber) {
            this.endTour();
            return;
        };
        //hide prev backdrop
        // this.WalkthroughLayoutManager.hideCurrentStep()
        //this.ongoingWalkthroughData.layoutjson[this.ongoingStepNumber + 1].layoutConfig.backdrop.type == "Overlay" ? '' : this.WalkthroughLayoutManager.hideBackDrop()
        this.ongoingStepNumber++;
        WalkthroughUtility.logger(`VALIDATING STEP ${this.ongoingStepNumber + 1} .....`, 'group')
        this.ongoingStepData = this.ongoingWalkthroughData.templates[this.ongoingStepNumber];
        this.validationBeforeRender();
    }


    navigateToPrevStep() {
        // this.WalkthroughLayoutManager.destroyEvents('all');
        this.ongoingStepNumber--;
        this.ongoingStepData = this.ongoingWalkthroughData.templates[this.ongoingStepNumber];
        this.validationBeforeRender();
    }


    showStep() {
        this.WalkthroughLayoutManager.showStep(this.ongoingStepData)
        // this.findLayoutposition()
        this.validationAfterRender();
    }


    endTour() {

        if (this.validationInterval) {
            window.clearInterval(this.validationInterval);
        }
        (this.promotionId == "-1" || this.promotionId == "0") ? ((this.ongoingWalkthroughData.templates.length - 1 == this.ongoingStepNumber) ? this.sendVerificationStatus("success") : this.sendVerificationStatus("failed")) : '';
        this.ongoingWalkthroughData = '';
        this.isFlowStarted = false;
        this.ongoingStepNumber = 0;
        this.shadowdom.remove()
        WalkthroughUtility.logger("Ending Tour")
        window.sessionStorage.removeItem("currentongoingWalkthroughDataGID")
        window.removeEventListener("resize", this.rePositionLayoutonResizeref);
        window.removeEventListener("wheel", this.rePositionLayoutonScrollref);
    }


    checkActiveFlow() {
        //for messageboard trigger and banner
        var currentFlowInfo = window.sessionStorage.getItem("currentongoingWalkthroughDataGID")
        if (currentFlowInfo == null) return false;
        let data = JSON.parse(currentFlowInfo)
        let flowid = data.flowID
        this.promotionId = data.PID
        this.flowID = flowid
        this.ongoingWalkthroughData = JSON.parse(window.sessionStorage.getItem(data.flowID));
        let ongoingwalkthrough={};
        ongoingwalkthrough[data.flowID]=this.ongoingWalkthroughData
        this.datamanager.setwalkthroughData(ongoingwalkthrough,data.scope)
        return true;
    }

    setDynamicPath(dynamicPath) {
        for (let key in dynamicPath) {
            this.dynamicPath[key] = dynamicPath[key]
        }
        sessionStorage.setItem("dynamicPath", JSON.stringify(this.dynamicPath));
    }


    validationAfterRender() {
        var self = this;
        this.counter = 0;
        if (this.validationInterval) {
            window.clearInterval(this.validationInterval);
        }
        var cssId = this.ongoingStepData.meta.targetelementID;
        let stepurl = this.ongoingStepData.meta.layoutroute;
        let ongoingStepElement = document.querySelector(cssId)
        stepurl = WalkthroughUtility.constructDynamicURL(stepurl, this.dynamicPath)
        this.validationInterval = window.setInterval(() => {
            self.counter++;
            let result = self.WalkthroughValidator.postRenderValidationInterval(stepurl, cssId, ongoingStepElement);
            switch (result) {
                case -1:
                    if (self.counter > 60) {
                        var state = window.confirm("Do you want to quit the flow?");
                        if (state) {
                            window.clearInterval(self.validationInterval);
                            self.endTour();
                            self.sendMetric({
                                'statusCode': 5,
                                'errorCode': 4
                            });
                            WalkthroughUtility.logger("VALIDATION STOPPED,QUITTED WALKTHROUGH......");
                            console.groupEnd();
                        } else {
                            self.counter = 0;
                        }
                    }
                    break;
                case 1:
                    self.sendMetric({
                        'statusCode': 5,
                        'errorCode': 3
                    });
                    self.endTour()
                    window.clearInterval(self.validationInterval);
                    self.validateURLInterval = ''
                    break;
                case 2:

                    self.sendMetric({
                        'statusCode': 5,
                        'errorCode': 5
                    });
                    self.endTour();
                    window.clearInterval(self.validationInterval);
                    break;
                case 3:
                    window.clearInterval(self.validationInterval);
                    self.showStep();
                    break;
            }
            //-1 = all case passed
            //1 = url failed
            //2 = element check failed 
            //3 =  element reference failed
        }, 1000)
    }


    validationBeforeRender() {
        this.ongoingStepData = this.ongoingWalkthroughData.templates[this.ongoingStepNumber];
        var self = this;
        var stepurl = this.ongoingStepData.meta.layoutroute;
        var cssId = this.ongoingStepData.meta.targetelementID;
        this.counter = 0;
        this.urlcounter = 0;
        var regenaratorUrl = WalkthroughUtility.constructDynamicURL(stepurl, this.dynamicPath);
        clearInterval(this.validationInterval)
        this.validationInterval = window.setInterval(() => {
            self.counter++;
            var result = self.WalkthroughValidator.preRenderValidationInterval(regenaratorUrl, cssId);
            //-1 -Element & Url  matched ,
            //1 -> url not matched ,
            //2 -> element not found for 1 minute, so ending tour 
            switch (result) {
                case -1: {
                    self.ongoingStepElement = WalkthroughUtility.getElementDOMObject(cssId);
                    self.sendMetric({
                        'statusCode': 1
                    });
                    window.clearInterval(self.validationInterval);
                    self.showStep();
                    break;
                }
                case 1: {
                    self.urlcounter++;
                    if (self.urlcounter > 5) { //Url not matched for 5 times, so ending tour
                        self.stopIntervel(self.validationInterval);
                        self.sendMetric({
                            'statusCode': 4,
                            'errorCode': 1
                        });
                        self.endTour();
                    }
                    break;
                }
                case 2: {
                    if (self.counter > 120) { //Element not found for 1 minute, so ending tour
                        self.sendMetric({
                            'statusCode': 4,
                            'errorCode': 2
                        });
                        self.stopIntervel(self.validationInterval);
                        self.endTour();
                    }
                }
            }
        }, 500)
    }

    stopIntervel(intervalID) {
        window.clearInterval(intervalID);
    }

    loadFlow(flowlist,scope) {
        this.datamanager.loadFlow(flowlist,scope)
    }

    triggerFlow(flowID, medium, promotionId,scope) {
        let flowdata = this.datamanager.WalkthroughData[flowID];
        
        if (!flowdata) {
            this.datamanager.loadAndTriggerFlow([flowID], medium, promotionId,scope);
            return;
        }
       
        let existingscope = this.datamanager.WalkthroughData[flowID].scope
        if(existingscope!=scope&&scope!=undefined){
            this.datamanager.loadAndTriggerFlow([flowID], medium, promotionId,scope);
            return;
        }
        this.promotionId = promotionId
        var url = flowdata.templates[0].meta.layoutroute;
        url = window.location.origin + WalkthroughUtility.constructDynamicURL(url, this.dynamicPath)
        if (medium == "selfhelp" && url == window.location.href) {
            this.ongoingWalkthroughData = flowdata;
            this.flowID = flowID;
            this.startTour(this.ongoingWalkthroughData)
            return;
        }

        var newWindow = window.open(url);
        let json = {
            flowID: flowID,
            PID: promotionId,
            scope:scope
        }
        newWindow.sessionStorage.setItem("currentongoingWalkthroughDataGID", JSON.stringify(json));
        newWindow.sessionStorage.setItem(flowID, JSON.stringify(flowdata))
    }

    sendMetric(data) {
        let metric = {
            'action': "metrics",
            'walkthroughid': this.flowID,
            'promotionid': this.promotionId,
            'orgid': this.orgid,
            'sessionstarttime': this.sessionStartTime,
            'stepnumber': this.ongoingStepNumber + 1,
            'statuscode': data.statusCode,
            'errorcode': data.errorCode ? data.errorCode : undefined,
            'serviceid': this.serviceid,
            'Scope':this.datamanager.WalkthroughData[this.flowID].scope
        }


        if (this.promotionId != "-1" && this.promotionId != "0") {
            this.micssdktoserver.sendMetric(metric, "post", () => { }, () => { });
        }

    }

    sendVerificationStatus(status) {
        let param = {
            "flowidlist": [this.flowID],
            "action": "updateWalkthroughStatus",
            "serviceid": this.serviceid,
            "orgid":this.orgid,
            "status": "Verified"

        }

        // function onsuccess() {
            let type = "verify";
            if(this.promotionId==0){
                type="preview";
            }
            window.opener ? window.opener.postMessage({ WalkthroughCallback: true, type: type, status: status }, "*") : ""
        // };

        // this.micssdktoserver.postVerifyStatus(param, "post", onsuccess, () => { });



    }


}

let micsWalkthroughConfig =  JSON.parse(window.sessionStorage.getItem("micsWalkthroughConfig"));
let micsconf;
let orgid;
if(!micsWalkthroughConfig){
    micsconf = {"inproductdomain":"https://tipengine.localzoho.com","serviceid":"457"}
    orgid = "662"
}
else{
     micsconf = {"inproductdomain":"https://tipengine.localzoho.com","serviceid":micsWalkthroughConfig.serviceid}
     orgid = micsWalkthroughConfig.orgid
}


var walkthroughSDK = new WalkthroughSDK(micsconf, orgid, { 'serviceName': 'mics', 'viewid': '311', 'domain': document.domain });
walkthroughSDK.initialize();
const selfHelp = new selfhelpsdk(micsconf,orgid);
selfHelp.setSelfhelpContent({});
selfHelp.setStyleforSelfhelpPopup({});
selfHelp.setStylefordefaultPlaceholder({});
selfHelp.initialize();






