// جدا از splash-screen.tsx: این رشته در layout سرور استفاده می‌شود و
// نباید از یک ماژول "use client" import شود.

export const SPLASH_SESSION_KEY = "aiohoush-splash-shown";

/*
 * قبل از رندر بدنه اجرا می‌شود (در <head>): اسپلش فقط در اپ نصب‌شده و
 * فقط یک بار در هر بار باز کردن اپ نمایش داده شود؛ در غیر این صورت با
 * data-splash="off" پنهان می‌ماند تا حتی یک لحظه هم دیده نشود.
 */
export const splashGateScript = `(function(){try{
var d=document.documentElement;
var standalone=window.matchMedia("(display-mode: standalone)").matches||window.navigator.standalone===true;
if(!standalone||sessionStorage.getItem("${SPLASH_SESSION_KEY}")){d.setAttribute("data-splash","off");return;}
sessionStorage.setItem("${SPLASH_SESSION_KEY}","1");
}catch(e){document.documentElement.setAttribute("data-splash","off");}})();`;
