function PrintUserName(username){
Sham_ins("[b]"+username+"[/b], ");
}
function pastequote(user,to_post){
if(window.getSelection){var content=window.getSelection().toString();}
else{var content=document.selection.createRange().text.toString();}
content = content.replace(/(\s*\r?\n\s*){2,}/gi,"\r\n");content = content.replace(/^\s+|\s+$/gi,"");content = content.replace(/(\ |\t){2,}/gi," ");
if(content){
Sham_ins("[q"+((user)?"="+user:"")+"]"+content+((to_post)?" [post="+to_post+"]»[/post]":"")+"[/q]\r\n");document.body.focus();
if (typeof (document.selection) != 'undefined') document.selection.empty();
}}
function setCaret() {
if (document.forms.vbform.message.createTextRange&&!is_opera){
document.forms.vbform.message.caretPos = document.selection.createRange().duplicate();
}}
function Sham_ins(textV,textObj){
if(!textObj){
if(!document.forms.vbform||typeof(document.forms.vbform.message)!='object') return;
textObj=document.forms.vbform.message;}
textV=textV.replace(/\[\?\]/g,'');
if (textV==''||!textObj) return;
var ver=8;
if(document.all && !window.opera){
    if (textObj.createTextRange&&textObj.caretPos){
        var caretPos=textObj.caretPos;
        caretPos.text=textV;
    }else{ textObj.value+= textV;}
}else{var brows=navigator.userAgent.toString();
    var scrollTop, scrollLeft;
    if (textObj.type=='TEXTAREA'&&textObj.scrollTop){
    scrollTop=textObj.scrollTop;scrollLeft=textObj.scrollLeft;}
    if(brows.search(/opera\/?(\d*.\d*)/i)!=-1) ver=RegExp.$1;
    if(textObj.selectionStart>=0&&ver>=8){
        if(textObj.textLength != 'undefined'){
            var selLength=textObj.textLength;
            var selStart=textObj.selectionStart;
            var selEnd=textObj.selectionEnd;
            if (selEnd==1||selEnd==2) selEnd=selLength;
            var s1=(textObj.value).substring(0,selStart);
            var s2=(textObj.value).substring(selEnd,selLength);
            textObj.value=s1+textV+s2;
            textObj.setSelectionRange(selStart+textV.length,selStart+textV.length);
            }
        if (typeof scrollTop != 'undefined'){
            textObj.scrollTop=scrollTop;textObj.scrollLeft=scrollLeft;}
           }
        else textObj.value+=textV;
    }
}
function get_e(e)
{return (e)?e:(window.event)?event:null}
function who_fired_event(e)
{e=get_e(e)
if(!e) return
var targ=(e.target)?e.target:(e.srcElement?e.srcElement:null)
if (targ&&targ.nodeType==3) targ=targ.parentNode;
return targ}
var seltxt;
function copysel() {
seltxt='';
if (window.getSelection&&!window.opera) seltxt = window.getSelection();
else if (document.getSelection) seltxt=document.getSelection();
else if (document.selection) seltxt=document.selection.createRange().text;
}
function sham_quote()
{
this.nik='';this.postn='';
this.is_sel_started=false;
this.insert_over=false;
this.mouse_down=false;
var timetodis=1200; 
var settm;
document.write('<div onmouseout="obj_sham.settm=setTimeout(\'hide_insert()\','+timetodis+');obj_sham.insert_over=false" onmousedown="obj_sham.insert_cite()" onmouseover="clearTimeout(obj_sham.settm);obj_sham.insert_over=true;copysel()" class="button" id="quote_div" style="z-index:1000;cursor:pointer;position:absolute;visibility:hidden"><b>Цитировать</b></div>');
this.is_valid_tag=function(evt)
{evt=get_e(evt);
var targ=who_fired_event(evt);
if (targ&&targ.tagName!='TEXTAREA'&&targ.tagName!='A'&&targ.tagName!='IMG'&&(targ.tagName!='INPUT'&&targ.type!='TEXT'&&targ.type!='PASSWORD')) return true;
  else return false;}
  
this.paste_to_textarea=function(evt)
{
this.mouse_down=false;
if (!this.is_sel_started) return;
else this.is_sel_started=false;
evt=get_e(evt);
if(seltxt!=''&&this.is_valid_tag(evt)&&typeof(document.forms.vbform) != 'undefined' && typeof(document.forms.vbform.message) != 'undefined')
 {
  var coords=getMouseCoords(evt);
  var iw=document.getElementById('quote_div');
  iw.style.left=(coords[0]-80)+'px';
  iw.style.top=(coords[1]+11)+'px';
  iw.style.visibility='visible';
  this.settm=setTimeout(this.hide_insert,timetodis);
 }
}
this.insert_cite=function()
{
var podstav = seltxt.toString().replace(/(\r?\n\s*){2,}/gi,'\r\n').replace(/^\s+|\s+$/gi,'').replace(/(\ |\t)+/gi,' ');if(podstav){
Sham_ins('[q'+((this.nik)?'='+this.nik:'')+']'+podstav+((this.postn)?" [post="+this.postn+"]»[/post]":"")+'[/q]\r\n');}this.insert_over=false;this.hide_insert();}
this.hide_insert=function()
{if (!this.insert_over) 
{
var iw=document.getElementById('quote_div');iw.style.left=-100+'px';iw.style.top=-100+'px'}}
}
function hide_insert() {obj_sham.hide_insert()}
function getMouseCoords(e) {
 var posx=0;var posy=0;e=get_e(e);
 if (e.pageX||e.pageY){posx = e.pageX;posy = e.pageY}
  else if (e.clientX||e.clientY)
    {posx=e.clientX+document.body.scrollLeft+document.documentElement.scrollLeft;
     posy=e.clientY+document.body.scrollTop+document.documentElement.scrollTop;}
     return [posx,posy]}
var obj_sham=new sham_quote();
document.onmousedown = function(evt){if(typeof obj_sham == 'object'&&obj_sham.is_valid_tag(evt)) obj_sham.mouse_down=true;}
document.onmousemove = function(){if(typeof obj_sham == 'object'&&obj_sham.mouse_down&&!obj_sham.is_sel_started) {obj_sham.is_sel_started=true;obj_sham.mouse_down=false;}}
document.onmouseup = function(evt){if(typeof obj_sham == 'object') obj_sham.paste_to_textarea(evt);}
document.body.onload = function(evt){
if (typeof(document.forms.vbform) != 'undefined' && typeof(document.forms.vbform.message) != 'undefined'){
document.forms.vbform.message.onselect = setCaret;
document.forms.vbform.message.onclick = setCaret;
document.forms.vbform.message.onkeyup = setCaret;}}
document.write('<div class="thead" id="smile_sham_menu" style="display:none"><center><table border="0" cellspacing="0" cellpadding="0"><tr><td><a href="javascript:Sham_ins(\' :) \')"><img src="images/smilies/new/smile.gif" alt=":)" title="Smile" border="0"/></a></td><td><a href="javascript:Sham_ins(\' :o \')"><img src="images/smilies/new/shock.gif" alt=":o" title="Shock" border="0"/></a></td><td><a href="javascript:Sham_ins(\' :( \')"><img src="images/smilies/new/sad.gif" alt=":(" title="Sad" border="0"/></a></td><td><a href="javascript:Sham_ins(\' :sorry: \')"><img src="images/smilies/new/sorry.gif" alt=":sorry:" title="Sorry" border="0"/></a></td><td><a href="javascript:Sham_ins(\' :lol: \')"><img src="images/smilies/2009/lol.gif" alt=":lol:" title="Lol" border="0"/></a></td></tr><tr><td><a href="javascript:Sham_ins(\' :cool: \')"><img src="images/smilies/2009/cool.gif" alt=":cool:" title="Cool" border="0"/></a></td><td><a href="javascript:Sham_ins(\' :search: \')"><img src="images/smilies/new/search.gif" alt=":search:" title="Search" border="0"/></a></td><td><a href="javascript:Sham_ins(\' :read: \')"><img src="images/smilies/new/read.gif" alt=":read:" title="Read" border="0"/></a></td><td><a href="javascript:Sham_ins(\' :laugh: \')"><img src="images/smilies/new/laugh.gif" alt=":laugh:" title="Laugh" border="0"/></a></td>  <td><a href="javascript:Sham_ins(\' :biggrin: \')"><img src="images/smilies/2009/biggrin.gif" alt=":biggrin:" title="Biggrin" border="0"/></a></td></tr><tr><td><a href="javascript:Sham_ins(\' :beta: \')"><img src="images/smilies/new/beta.gif" alt=":beta:" title="Beta" border="0"/></a></td><td> <a href="javascript:Sham_ins(\' :clapping: \')"><img src="images/smilies/new/clapping.gif" alt=":clapping:" title="Clapping" border="0"/></a></td><td><a href="javascript:Sham_ins(\' :closed-to \')"><img src="images/smilies/new/closed-topic.gif" alt=":closed-to" title="Closed Topic" border="0"/></a></td><td><a href="javascript:Sham_ins(\' :unsure: \')"><img src="images/smilies/new/unsure.gif" alt=":unsure:" title="Unsure" border="0"/></a></td><td><a href="javascript:Sham_ins(\' :cry: \')"><img src="images/smilies/new/cry.gif" alt=":cry:" title="Cry" border="0"/></a></td></tr><tr><td><a href="javascript:Sham_ins(\' :tongue: \')"><img src="images/smilies/2009/tongue.gif" alt=":tongue:" title="Tongue" border="0"/></a></td><td><a href="javascript:Sham_ins(\' :tomato2: \')"><img src="images/smilies/new/tomato2.gif" alt=":tomato2:" title="Tomato2" border="0"/></a></td><td> <a href="javascript:Sham_ins(\' :yahoo: \')"><img src="images/smilies/new/yahoo.gif" alt=":yahoo:" title="Yahoo" border="0"/></a></td><td><a href="javascript:Sham_ins(\' :yes: \')"><img src="images/smilies/new/yes.gif" alt=":yes:" title="Yes" border="0"/></a></td><td> <a href="javascript:Sham_ins(\' :not-me: \')"><img src="images/smilies/new/not-me.gif" alt=":not-me:" title="Not Me" border="0"/></a></td></tr><tr><td><a href="javascript:Sham_ins(\' :drug: \')"><img src="images/smilies/new/drug.gif" alt=":drug:" title="Drug" border="0"/></a></td><td> <a href="javascript:Sham_ins(\' :dont-know \')"><img src="images/smilies/new/dont-know.gif" alt=":dont-know" title="Dont Know" border="0"/></a></td><td> <a href="javascript:Sham_ins(\' :happy: \')"><img src="images/smilies/new/happy.gif" alt=":happy:" title="Happy" border="0"/></a></td><td><a href="javascript:Sham_ins(\' :up \')"><img src="images/smilies/2009/good.gif" alt=":up" title="Good" border="0"/></a></td><td><a href="javascript:Sham_ins(\' :jester: \')"><img src="images/smilies/new/jester.gif" alt=":jester:" title="Jester" border="0"/></a></td></tr><tr><td><a href="javascript:Sham_ins(\' :kiss: \')"><img src="images/smilies/2009/kiss.gif" alt=":kiss:" title="Kiss" border="0"/></a></td><td> <a href="javascript:Sham_ins(\' :help: \')"><img src="images/smilies/new/help.gif" alt=":help:" title="Help" border="0"/></a></td><td><a href="javascript:Sham_ins(\' :lazy: \')"><img src="images/smilies/new/lazy.gif" alt=":lazy:" title="Lazy" border="0"/></a></td><td colspan="2"> <a href="javascript:Sham_ins(\' :oszone: \')"><img src="images/smilies/oszone.gif" alt=":oszone:" title="Oszone" border="0"/></a></td></tr><tr><td colspan="5">[<a href="javascript:open_smilie_window(smiliewindow_x, smiliewindow_y, 0, \'17\')" title="Показать все смайлики"><b>Все смайлики</b></a>]</td></tr></table></center></div>');document.write('<div class="thead" id="smile_sham_menu" style="display:none"><center><table border="0" cellspacing="0" cellpadding="0"><tr><td align="center"><a href="javascript:Sham_ins(\' :) \')"><img src="images/smilies/new/smile.gif" alt=":)" title="Smile" border="0"/></a></td><td align="center"><a href="javascript:Sham_ins(\' :o \')"><img src="images/smilies/new/shock.gif" alt=":o" title="Shock" border="0"/></a></td> <td align="center"><a href="javascript:Sham_ins(\' :( \')"><img src="images/smilies/new/sad.gif" alt=":(" title="Sad" border="0"/></a></td><td align="center"><a href="javascript:Sham_ins(\' :sorry: \')"><img src="images/smilies/new/sorry.gif" alt=":sorry:" title="Sorry" border="0"/></a></td>  <td align="center"><a href="javascript:Sham_ins(\' :lol: \')"><img src="images/smilies/2009/lol.gif" alt=":lol:" title="Lol" border="0"/></a></td></tr><tr><td align="center"><a href="javascript:Sham_ins(\' :cool: \')"><img src="images/smilies/2009/cool.gif" alt=":cool:" title="Cool" border="0"/></a></td><td align="center"><a href="javascript:Sham_ins(\' :search: \')"><img src="images/smilies/new/search.gif" alt=":search:" title="Search" border="0"/></a></td><td align="center"><a href="javascript:Sham_ins(\' :read: \')"><img src="images/smilies/new/read.gif" alt=":read:" title="Read" border="0"/></a></td><td align="center"><a href="javascript:Sham_ins(\' :laugh: \')"><img src="images/smilies/new/laugh.gif" alt=":laugh:" title="Laugh" border="0"/></a></td><td align="center"><a href="javascript:Sham_ins(\' :biggrin: \')"><img src="images/smilies/2009/biggrin.gif" alt=":biggrin:" title="Biggrin" border="0"/></a></td></tr><tr><td align="center"><a href="javascript:Sham_ins(\' :beta: \')"><img src="images/smilies/new/beta.gif" alt=":beta:" title="Beta" border="0"/></a></td><td align="center"> <a href="javascript:Sham_ins(\' :clapping: \')"><img src="images/smilies/new/clapping.gif" alt=":clapping:" title="Clapping" border="0"/></a></td><td align="center"><a href="javascript:Sham_ins(\' :closed-to \')"><img src="images/smilies/new/closed-topic.gif" alt=":closed-to" title="Closed Topic" border="0"/></a></td><td align="center"><a href="javascript:Sham_ins(\' :unsure: \')"><img src="images/smilies/new/unsure.gif" alt=":unsure:" title="Unsure" border="0"/></a></td><td align="center"><a href="javascript:Sham_ins(\' :cry: \')"><img src="images/smilies/new/cry.gif" alt=":cry:" title="Cry" border="0"/></a></td></tr><tr><td align="center"><a href="javascript:Sham_ins(\' :tongue: \')"><img src="images/smilies/2009/tongue.gif" alt=":tongue:" title="Tongue" border="0"/></a></td><td align="center"><a href="javascript:Sham_ins(\' :tomato2: \')"><img src="images/smilies/new/tomato2.gif" alt=":tomato2:" title="Tomato2" border="0"/></a></td><td align="center"> <a href="javascript:Sham_ins(\' :yahoo: \')"><img src="images/smilies/new/yahoo.gif" alt=":yahoo:" title="Yahoo" border="0"/></a></td><td align="center"><a href="javascript:Sham_ins(\' :yes: \')"><img src="images/smilies/new/yes.gif" alt=":yes:" title="Yes" border="0"/></a></td><td align="center"> <a href="javascript:Sham_ins(\' :not-me: \')"><img src="images/smilies/new/not-me.gif" alt=":not-me:" title="Not Me" border="0"/></a></td></tr><tr><td align="center"><a href="javascript:Sham_ins(\' :drug: \')"><img src="images/smilies/new/drug.gif" alt=":drug:" title="Drug" border="0"/></a></td><td align="center"> <a href="javascript:Sham_ins(\' :dont-know \')"><img src="images/smilies/new/dont-know.gif" alt=":dont-know" title="Dont Know" border="0"/></a></td><td align="center"> <a href="javascript:Sham_ins(\' :happy: \')"><img src="images/smilies/new/happy.gif" alt=":happy:" title="Happy" border="0"/></a></td><td align="center"><a href="javascript:Sham_ins(\' :up \')"><img src="images/smilies/2009/good.gif" alt=":up" title="Good" border="0"/></a></td><td align="center"><a href="javascript:Sham_ins(\' :jester: \')"><img src="images/smilies/new/jester.gif" alt=":jester:" title="Jester" border="0"/></a></td></tr><tr><td align="center"><a href="javascript:Sham_ins(\' :kiss: \')"><img src="images/smilies/2009/kiss.gif" alt=":kiss:" title="Kiss" border="0"/></a></td><td align="center"> <a href="javascript:Sham_ins(\' :help: \')"><img src="images/smilies/new/help.gif" alt=":help:" title="Help" border="0"/></a></td><td align="center"><a href="javascript:Sham_ins(\' :lazy: \')"><img src="images/smilies/new/lazy.gif" alt=":lazy:" title="Lazy" border="0"/></a></td><td colspan="2" align="center"> <a href="javascript:Sham_ins(\' :oszone: \')"><img src="images/smilies/oszone.gif" alt=":oszone:" title="Oszone" border="0"/></a></td></tr><tr><td colspan="5" align="center">[<a href="javascript:open_smilie_window(smiliewindow_x, smiliewindow_y, 0, \'17\')" title="Показать все смайлики"><b>Все смайлики</b></a>]</td></tr></table></center></div>');