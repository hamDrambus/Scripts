Modification to force printing . instead of , upon presseing NumPad Del on russian layout.
Two windows' dlls are modified as in 
http://www.cdmail.ru/faq/win2000/question1978.html and
http://forum.oszone.net/thread-184710.html

modification: , to . in place, correspoding to "NumPad Delete" (14th from the end of names and symbols block) 
(goes smth like ...Enter NumPad Delete, NumPad Enter...[end of names' block]...A B ...& % ^... , , • • • ...[end of symbol block])
Address in 32bit versoin is ~0C60 in 64bit the structure is similar       The symbol to change ^ to dot (2C->2E)
(change via hiew demo)

Modfied Dlls to: windows/system32 (32 bit), windows/SysWOW64 (64bit), winsxs/(search KBDRU) - the last folder is for cached dlls

_Modifyed_ dlls and sites are provided in this folder
