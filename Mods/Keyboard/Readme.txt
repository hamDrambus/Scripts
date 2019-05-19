This readme briefly describes how windows keyboard layouts work, how to modify them and what to google for more details.
===============================================================================================================
All keyboard layouts are defined by kbd*.dll files stored in Windows/System32/ and Windows/SystemWOW64/ and also in cache (later about it). These dlls were compiled using <kbd.h> header which includes useful definitions. Extremely useful source files which were used for compilation of several layouts are presented in github.com/microsoft/Windows-driver-samples/blob/master/input/layout/ (link last checked on 13.05.2019). In principle, any layout can be created compiling a proper source file and then adding the dll to registry and system directories. The documentation is quite unclear, however, and experimentation will be required. But it's not fun at all to simply compile required layout, is it? Real ~~nerds~~ men modify .dll using hex editor when they want to swap a couple keys for already existing layouts. (It may be impossible to transfer dll compiled on one machine to another as planned for my prank, so quick dll modification using powershell script may be quicker, as target machine may not have compiler at all). So read further.

Basically, the kbd source file corresponds to the dll and consists of several blocks (in order of .dll):

1) Some header, followed by quite a few 0 bytes.

2) Virtual Scan Code to Virtual Key conversion table. It is not a table per se, but an ordered array of key
virtual code where index corresponds to physical key on the keyboard. For example first entry is a none key, second - escape key, third - number 1 key and so on. Easy to identify in hex editor by Q.W.E.R.T.Y. where . is a 0x00 byte.

3) Then goes aE0VscToVk which is table of special keys as I understand. It in NOT separated from previous block by 0 bytes, but it does end in four 0x00 bytes.

4) aE1VscToVk - no idea what for, followed by six 0x00 bytes.

5) aVkToBits - converts virtual keys to shift bits. These bits will be appended to other vitual keys and based on them modification of key output value will be applyed. The keys are separated in groups based on the amount of shift states. For example, most keys have 2 shift states: lower and upper case. Some layouts may have Ctrl+Alt+key = some_character. I guess it is possible to reassign shift key to some other vitual key using this aVkToBits, but this is for really nasty pranks. This block is followed by 6 0x00 bytes.

6) CharModifiers - translates bits defined in 5) to combination index. This combination index is later used for tables of vitual key to character correspondence. Ends in 10 0x00 bytes.

7) Finally aVkToWch2[], aVkToWch3[] and aVkToWch4[] follow. These are tables of converting virtual keyt code into characted depending on modification state. Here keys are grouped by their total number of states.

8) aVkToWcharTable - stracture, holding pointers to all tables aVktoWch above, specifing thier dimensions and size.

9) key names

10) struct contaning popinters to all data defined above in single place, followerd by function returning it.
===============================================================================================================
It is quite easy to change default behaviour in "simple way", that is not changing the size of any of above structures and whole dll, by simply replacing/swapping entries. While in theory it is not impossible to make arbitrary changes (in the limits of what windows suppors at all) in dll using hex editor, pointers and fileds contaning sizes will be invalidated (actually from what I can see, no element contains its size implicitly. That is when defining some table/struct, compiler will not create some type of header for it and will simply write bytes as they are written in c). If pointers are fixed manually (mind that there is some offset address value for all pointers compared to the value shown in the hex editor) I believe it is possible to modify dll without compiler. Which is basically writing in machine code. The trickiest part I imagine is to find where there is a pointer and where are commands in the last funciton.

So all in all, the simple changes are:
1) Swap/change completely any keys on the keyboard (excluding NUMPAD), without chaning its number of states (logic).
2) Change Shift/Ctrl/Alt key
3) Change operations of NUMPAD

Changes requiring compilation:
1) Transfering key from one aVkToWch to another (which means changing its number of states). It is increasing the number of key states that is problematic.
2) Adding dead keys (keys not resulting in output directly, but modifying output of the next key, like '^'+'A' will print an a with hat above it).

Impossible changes:
1) Major changes in numpad logic that disable NUM key or something similar. NUMPAD definitions are exception, because aE1VscToVk contains correspondence of key to operation virtual key (HOME, DELETE, ARROWS), but not NUMPAD_0, _1 and so on. This correspondence is hidden, but it can be tweaked nontheless.
===============================================================================================================
Supposing there is a program which modifies .dll as required (or it is done by hand), it is not enough to simply modify .dll lying in System32. There exist Windows File Protection service (google its behaviour), which prevents unauthorised modification of dlls and in an attempt to do so, it will load old dlls from cache or, if cache was changed as well, from RAM. In order to bypass that, WFP shoud be disabled (temprorary of course). To do so on win7 or 10:
	regedit. In HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Winlogon create/edit REG_DWORD (32bit) SFCDisable entry to value 2. Value meanings:
1 – disabled, prompt at boot to re-enable
2 – disabled at next boot only, no prompt to re-enable
4 – enabled, with popups disabled
ffffff9d – for completely disabled
0 – Enabled  
	Reboot is required.
After reboot, modify dll for 32 and 64 bit versions as well as cache (search by name in explorer). Reboot again (might be necessary to set SFCDisable back to 0).

sfc utility will detect corrupted dlls. Their hashes are stored in SysRoot/winsxs/Manifests. Hashes are stored for cached (copied) dlls only in SysRoot/winsxs which located in folders called something like "wow64_microsoft-windows-i..onal-keyboard-kbdus_31bf3856ad364e35_6.1.7601.17514_none_e72ccbf15f92e33c". There are no separate manifests for dlls in System32 or SysWOW64 because the dlls there should be the same as cached ones. Manifests also have copy in Backup folder.

The powershell script changes hash values in the manifests to the new ones using log outup of sfc located in Windows/Logs/CBS/CBS.log. The issue is that sfc also checks correctnes of manifest files themselves using thier hash, which location I could not find. Even though replacing hashes does not fool sfc it does prevent dll names showing in the output (though their can be tracked as manifest names correspond to dll locations). sfc cannot repair dlls if they are repaced in all locations.

TODO: find where hashes for manifest files are located and replace them via script to fully trick sfc. Or modify sfc binary code to never detect corrupted files (poor variant)
===============================================================================================================
Sources:
	<kbd.h> comments.
	github.com/microsoft/Windows-driver-samples/blob/master/input/layout/ it is VERY usefull to compare .dll code with source file for US keyboard (simpliest one), I copied those files into ./layouts/ just to be on the safe side.
	Search for 'Windows changing keyboard layout', 'Windows File Protection service', 'Windows keyboard layout dll' 