export const SPLASH_SESSION_KEY = "aiohoush-splash-shown";

export const splashGateScript = `(function(){try{
var d=document.documentElement;
var standalone=window.matchMedia("(display-mode: standalone)").matches||window.navigator.standalone===true;
if(!standalone||sessionStorage.getItem("${SPLASH_SESSION_KEY}")){d.setAttribute("data-splash","off");return;}
sessionStorage.setItem("${SPLASH_SESSION_KEY}","1");
}catch(e){document.documentElement.setAttribute("data-splash","off");}})();`;
