set VMNAME="Elisa"
cd "C:\Program Files\Oracle\VirtualBox"
set rand9="abcdefghi"
::any 9 character string
set rand20="abdcefghijklmnopqrst" 
::any 20 character string
set rand8="abcdefgh"
::any 8 character string

VBoxManage setextradata %VMNAME% "VBoxInternal/Devices/pcbios/0/Config/DmiBIOSVendor" "American Megatrends Inc"
VBoxManage setextradata %VMNAME% "VBoxInternal/Devices/pcbios/0/Config/DmiBIOSVersion" "2.1.0"
VBoxManage setextradata %VMNAME% "VBoxInternal/Devices/pcbios/0/Config/DmiSystemVendor" "ASUSTek Computer"

VBoxManage setextradata %VMNAME% "VBoxInternal/Devices/pcbios/0/Config/DmiSystemSerial" %rand9%

VBoxManage setextradata %VMNAME% "VBoxInternal/Devices/ahci/0/Config/Port0/SerialNumber" %rand20%

VBoxManage setextradata %VMNAME% "VBoxInternal/Devices/ahci/0/Config/Port0/FirmwareRevision" %rand8%
VBoxManage setextradata %VMNAME% "VBoxInternal/Devices/ahci/0/Config/Port0/ModelNumber" "SEAGATE ST3750525AS"

VBoxManage startvm %VMNAME%