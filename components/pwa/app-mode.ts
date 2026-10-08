export const appModeScript = `(function(){try{
var standalone=window.matchMedia("(display-mode: standalone)").matches||window.navigator.standalone===true;
if(!standalone)return;
var d=document.documentElement;
d.setAttribute("data-app","standalone");
var content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no";
function lock(create){var list=document.querySelectorAll('meta[name="viewport"]');if(!list.length&&create){var m=document.createElement("meta");m.name="viewport";document.head.appendChild(m);list=[m];}for(var i=0;i<list.length;i++)if(list[i].content!==content)list[i].content=content;}
lock(false);
document.addEventListener("DOMContentLoaded",function(){lock(true);new MutationObserver(function(){lock(false);}).observe(document.head,{childList:true,subtree:true,attributes:true,attributeFilter:["content"]});});
var block=function(e){e.preventDefault();};
document.addEventListener("gesturestart",block,{passive:false});
document.addEventListener("gesturechange",block,{passive:false});
document.addEventListener("touchmove",function(e){if(e.touches&&e.touches.length>1)e.preventDefault();},{passive:false});
}catch(e){}})();`;
