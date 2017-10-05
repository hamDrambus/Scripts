  
 // Change Path to  vkb  folder (below) _if necessary_, for example, to "/vkb/" - child of root directory 
 // ИзменИте путь к папке vkb (см. ниже) _если нужно_, например, на "/vkb/" (то есть, папка vkb в корневом каталоге)
 
 //    same can be done in HTML file via parameter   vkb_Path  (see readme_e.htm)
 //    то же самое можно сделать, задав в HTML файле параметр  vkb_Path (см. readme_r.htm)

if (typeof vkb_Path == 'undefined') 

    vkb_Path = "vkb/";   // Folder  vkb  - under a folder with a Keyboard's page
                         // Папка   vkb  - под-каталог того каталога, где лежит страница с Клавиатурой

 // Виртуальная Клавиатура: русский и украинский. Павел Городянский (см. http://RusWin.net/scrdoc_r.htm)
  
  
 //  *************** file is in Cyrillic windows-1251 encoding     ********************
 //  *************** этот файл - в кодировке Cyrillic windows-1251 ********************
 // 
 //  Therefore encoding MUST be specified in the HTML file which loads this .js
 //  Поэтому кодировка должна быть указана в том HTML файле, который загружает данный .js
 //
 //  It should be specified the following way (а именно, вот так указана):
 // 
 //  <script type='text/javascript' src='vkb/vkb_load.js' charset='windows-1251'></script>
 //

/* Cyrillic Virtual (on-screen) keyboard - Russian and Ukrainian:  vkb_load.js file
   Copyright (c) 2005  Paul Gorodyansky
  
  Implementation: http://Kbd.RusWin.net (http://ourworld.compuserve.com/homepages/PaulGor/onscreen.htm)
     or Russian interface version: 
  http://Klava.RusWin.net (http://ourworld.compuserve.com/homepages/PaulGor/screen_r.htm)

  Author's site - "Cyrillic (Russian): instructions for Windows and Internet": 
  http://ourworld.compuserve.com/homepages/PaulGor/
  ( same as http://RusWin.net )
*/   

vkb_JSwasLoaded = true;
var vkb_Netscape, vkb_MSIE, vkb_Opera, vkb_Unknown, vkb_NN1, vkb_NN2, vkb_Ffox=false, vkb_n, vkb_Br = "0";
var vkb_Win, vkb_Mac, vkb_Other, vkb_NetscapeVer, vkb_MSIEVer, vkb_OperaVer=0, vkb_strOperaPos, vkb_NetscapeOK;

vkb_Netscape = navigator.appName == "Netscape"; vkb_MSIE = navigator.appName == "Microsoft Internet Explorer";
vkb_Opera = navigator.userAgent.indexOf("Opera") > -1; vkb_Unknown = !(vkb_Netscape || vkb_MSIE || vkb_Opera);
vkb_NetscapeOK = false;

vkb_Win = navigator.userAgent.indexOf("Win") > -1; vkb_Mac = navigator.userAgent.indexOf("Mac") > -1; vkb_Other = !(vkb_Win || vkb_Mac);
if(vkb_Netscape) {
  vkb_NetscapeVer = parseFloat(navigator.appVersion);
  if (vkb_NetscapeVer>4) {
    vkb_n = navigator.userAgent;
    if (vkb_n.indexOf("Netscape/") != -1) {vkb_NN1 = vkb_n.substr(vkb_n.indexOf("Netscape/")+9); vkb_NN1 = parseFloat(vkb_NN1); }
    vkb_NN1 = vkb_n.substr(vkb_n.indexOf("rv:")+3); vkb_NN1 = parseFloat(vkb_NN1); if (vkb_NN1 >= "1.3") vkb_NetscapeOK = true;
  }
  if (vkb_NetscapeOK) { vkb_Br="NN"; if (vkb_n.indexOf("Firefox") != -1) vkb_Ffox = true; }
}
else if(vkb_MSIE) {
  vkb_n = navigator.userAgent; vkb_MSIEVer = vkb_n.substr(vkb_n.indexOf("MSIE ")+("MSIE ").length, 4);
  vkb_MSIEVer = parseFloat(vkb_MSIEVer); 
  if(vkb_Opera) {
    vkb_strOperaPos = vkb_n.indexOf("Opera/"); // "Opera ", "Opera/"
    if (vkb_strOperaPos == -1) vkb_OperaVer = vkb_n.substr(vkb_n.indexOf("Opera ")+("Opera ").length, 4);
    else vkb_OperaVer = vkb_n.substr(vkb_strOperaPos + ("Opera/").length, 4);    
    vkb_OperaVer = parseFloat(vkb_OperaVer);
  }
  else vkb_Br = "IE";
}
else if(vkb_Opera) {  // Opera as "Opera"
  vkb_n = navigator.userAgent; vkb_strOperaPos = vkb_n.indexOf("Opera/"); // "Opera " or "Opera/"
  if (vkb_strOperaPos == -1) vkb_OperaVer = vkb_n.substr(vkb_n.indexOf("Opera ")+("Opera ").length, 4);
  else vkb_OperaVer = vkb_n.substr(vkb_strOperaPos + ("Opera/").length, 4);
  vkb_OperaVer = parseFloat(vkb_OperaVer);
}


// parameter defaults:
if (typeof vkb_InterfaceLanguage == 'undefined')  vkb_InterfaceLanguage = "R";
if (typeof vkb_KbdVariant == 'undefined') vkb_KbdVariant = "0";
if (typeof vkb_Variant == 'undefined') vkb_Variant = 2;
if (typeof vkb_Fix == 'undefined') vkb_Fix = false;

var vkb_HelpPos1, vkb_HelpPos2, vkb_PrevClickShift=false;
if (vkb_Variant < 3)
{
  vkb_HelpPos1=80; vkb_HelpPos2=50;
  if (vkb_Fix) document.write("<div id='vkb_Layer' style='VISIBILITY: hidden;'></div>");
  else  document.write("<div id='vkb_Layer' style='VISIBILITY: hidden; WIDTH: 500px; POSITION: absolute; right: 100px; top: 100px;'></div>");
}
else {vkb_HelpPos1=-70; vkb_HelpPos2=315;}


var vkb_JSnonUSwasLoaded = false, vkb_showWrongBrowserOnce=false, vkb_isInitDone = false;
var vkb_PicTagLay, vkb_PicTag, vkb_CyrFromKbd, vkb_MsgButtonStr,
    vkb_KbdPhysical, vkb_KbdVariantNumber, vkb_curImage, vkb_fName, vkb_WrongBr, vkb_ShowKbdVariantsMenu;
var vkb_KbdVariantNonDefault=false; // no parameter 
var vkb_buildHTMLlater=false, vkb_UseVirtKbd=false;

var vkb_txtType=0; var vkb_keySwitch = ""; var vkb_numInputTypeTextFields=0; var vkb_numInputFields=0;
var vkb_radioSwitchKbd0, vkb_radioSwitchKbd1, vkb_SlayoutsItem, vkb_FlayoutsItem, vkb_LatinItem, vkb_KeyboardsItem;
var vkb_txtControl = null;
var vkb_1st=true;

function vkb_loadJs(obj, jsFileName)
{
  var script1 = document.createElement('script');
  script1.type = 'text/javascript'; script1.charset = 'windows-1251'; script1.src = jsFileName;
  obj.appendChild(script1);
}
function vkb_loadHeadCss(obj, cssFileName)
{
  var link1 = document.createElement('link');
  link1.type = "text/css"; link1.rel = "stylesheet"; link1.href = cssFileName;
  obj.appendChild(link1);
}
function vkb_createHeadStyle(obj, stHTML)
{
  var style1 = document.createElement('style');
  style1.type = "text/css"; style1.innerHTML=stHTML;
  obj.appendChild(style1);
}

var vkb_headObj = document.getElementsByTagName('head')[0]; 
if (vkb_Ffox) {
   var stHTML=".vkb_IEbutton  {color: #000000;background-color: #b5c9e2;}"+
   "\n.vkb_IEbutton2 {color: #000000;background-color: #b5c9e2;}"+
   "\n.vkb_IEbutton3 {margin-bottom: -1em; color: #000000; background-color: #b5c9e2;}"+
   "\n.vkb_button2{color: #000000;font-size: 10px;font-family: verdana, monospace;background-color: #999900;}"+
   "\n.vkb_short{MARGIN-BOTTOM: 0px;}\n.vkb_short1{MARGIN-BOTTOM: 0px; MARGIN-TOP: 5px;}"+
   "\n.vkb_tip {font: 12px Arial,Helvetica,sans-serif;border:solid 1px #666666;width:210px;padding:3px;z-index:100;"+
   "position:absolute;visibility:hidden;color:#000000;top:20px;left:90px;background-color:#ffffcc;}";
   if (vkb_Fix) stHTML= stHTML + "\nbody > div#vkb_Layer {position: fixed; right: 20px; top: 10px;}";
   vkb_createHeadStyle(vkb_headObj, stHTML); 
}
else
{
 vkb_loadHeadCss(vkb_headObj, vkb_Path+"vkb.css"); if (vkb_Br=="IE" && !vkb_Opera) vkb_loadHeadCss(vkb_headObj, vkb_Path+"vkb_ie.css");
 vkb_loadHeadCss(vkb_headObj, vkb_Path+"vkb_tip.css"); if (vkb_Fix) {vkb_loadHeadCss(vkb_headObj, vkb_Path+"vkbfix.css"); if (vkb_Br=="IE" && !vkb_Opera) vkb_loadHeadCss(vkb_headObj, vkb_Path+"vkbfixie.css");}
} 

function vkb_start()
{
  if(vkb_1st)
  {
    var mDiv_WaitMsg = document.getElementById("vkb_tempDiv");
    var tHTML="<TABLE width=320 bgColor=#b5c9e2 border=2><TBODY><TR><TD width='100%'><BR><BR>";
    var tMsg = (vkb_InterfaceLanguage == 'E') ?
      "<CENTER>Please wait, it's loading...<BR><BR><SMALL>(happens only first time)</SMALL></CENTER><BR><BR>&nbsp;</TD></TR></TBODY></TABLE>"
     :
      "<CENTER>Подождите, идет загрузка...<BR><BR><SMALL>(только первый раз надо ждать)</SMALL></CENTER><BR><BR>&nbsp;</TD></TR></TBODY></TABLE>";

    tHTML = tHTML + tMsg;
    mDiv_WaitMsg.innerHTML = tHTML; mDiv_WaitMsg.style.visibility="visible";  
    var vkb_headobj = document.getElementsByTagName('head')[0]; 

    vkb_loadJs(vkb_headobj, vkb_Path+"vkb_one.js");
  }
  else vkb_showKbd();
}
document.write("<div id='vkb_tempDiv' style='VISIBILITY: hidden; WIDTH: 500px; POSITION: absolute; right: 100px; top: 100px;' ></div>");
var tmpdm ="<div id='vkb_divMouse' style='visibility:hidden;'>"; //  right: 10px; top: 100px;
if (vkb_Variant == 1) tmpdm = tmpdm + "layout";
tmpdm = tmpdm + "</div>"; document.write(tmpdm);


//