function Out-FileForce {
PARAM($path)
PROCESS
{
    if(Test-Path $path)
    {
        Out-File -inputObject $_ -append -filepath $path -Encoding UTF8
    }
    else
    {
        new-item -force -path $path -type file
        Out-File -inputObject $_ -append -filepath $path -Encoding UTF8
    }
}
}

Function GetHashes ($file, $dlls) {
    $out_dlls = @()
    $old_hashes = @()
    $new_hashes = @()
    $dlls_in_log = @()
    $dlls_in_log += $dlls
    for ($i = 0; $i -lt $dlls_in_log.length; $i++) {
        $dlls_in_log[$i] = $dlls_in_log[$i].Replace($env:SystemRoot, '\SystemRoot')
    } #This strings are searched in sfc log file
    for ($i = 0; $i -lt $dlls_in_log.length; $i++) {
        #sfc log mangles dll file names, so I extract only parent folder and dll name
        $string = $dlls_in_log[$i]
        $dll_file = Split-Path -Path $string -Leaf
        $folder = Split-Path -Path $string -Parent
        $folder = Split-Path -Path $folder -Leaf
        $string = $folder + "\" + $dll_file
        $found_hash = 0
        Select-String -Path $file -Pattern "^.*Hashes for file member.*\\$([regex]::Escape($string))\sdo not match actual file.*$" -Context 0, 1 | 
        Foreach-Object {
            if ($_.Context.PostContext.length -gt 0) {
                Write-Host $_.Context.PostContext[0]
                $found = $_.Context.PostContext[0] -match "^.*Found: {\w:\d+ \w:(?<newh>.*)} Expected: {\w:\d+ \w:(?<oldh>.*)}.*$"
                if ($found -AND ($found_hash -le 1)) {
                    if ($found_hash -eq 1) {
                        Write-Host "Warning: more than one match for single file $($dlls_in_log[$i]). Skipping it"
                        $found_hash ++
                    } else {
                        $old_hashes += $Matches.oldh
                        $new_hashes += $Matches.newh
                        $out_dlls += $dlls[$i]
                        $found_hash ++
                    }
                }
            }
        }
    }
    Write-Host "Hashes to forge:"
    for ($i = 0; $i -lt $out_dlls.length; $i++) {
        Write-Host $out_dlls[$i]
        Write-Host $old_hashes[$i]
        Write-Host $new_hashes[$i]
        Write-Host "-------"
    }
    $output = $out_dlls, $old_hashes, $new_hashes
    return $output
}

Function PatchManifestFiles ($dlls, $old_hashes, $new_hashes) {
    #Chamging hashes in manifest files does not work on sfc
    #sfc also checks hashes of manifest files themselves and I could not find where those hashes are stored
    #but sfc will fail to check dll hashes when manifest files are corrupted
    Write-Host "Patching manifest files - replacing hashes"
    $DesktopPath = [Environment]::GetFolderPath("Desktop")
    for ($i = 0; $i -lt $dlls.length; $i++) {
        $folder = Split-Path -Path $dlls[$i] -Parent
        $folder = Split-Path -Path $folder -Leaf
        $files = @()
        Get-ChildItem -Path ($env:SystemRoot+"\winsxs") -Filter ($folder+".manifest") -Recurse -ErrorAction SilentlyContinue -Force | % {
             $files += $_.FullName
        }
        if ($files.length -gt 0) {
            Write-Host "Found manifest files for"
            Write-Host $dlls[$i]
            Write-Host $old_hashes[$i]
            Write-Host $new_hashes[$i]
            Write-Host "are:"
        } else {
            Write-Host "No manifest files found for "
            Write-Host $dlls[$i]
        }
        for ($f = 0; $f -lt $files.length; $f++) {
            Write-Host $files[$f]
            $backup = $files[$f] + ".backup"
            $continue = $TRUE
            Try { [io.file]::OpenWrite($files[$f]).close() }
            Catch { 
                Write-Warning "Unable to access `"$($files[$f])`", skipping this manifest" 
                $continue = $FALSE
            }
            Try { [io.file]::OpenWrite($backup).close() }
            Catch { 
                Write-Warning "Unable to access `"$backup`", skipping this manifest" 
                $continue = $FALSE
            }
            if ($continue) {
                $string = $old_hashes[$i]
                $new_string = $new_hashes[$i]
                #$out_folder = Split-Path -Path $files[$f] -Parent
                #$out_folder = Split-Path -Path $out_folder -Leaf
                #$outfile = $DesktopPath + "\" + $out_folder + "\" + (Split-Path -Path $files[$f] -Leaf) 
                $content = Get-Content -Path $files[$f]
                if (-NOT (Test-Path $backup)) {
                    Copy-Item $files[$f] -Destination $backup
                }
                Remove-Item -Path $files[$f] -Force
                $content |  % {
                $_ -Replace "^(.*)<dsig:DigestValue(.*)>$([regex]::Escape($string))</dsig:DigestValue>(.*)$", `
                    "`${1}<dsig:DigestValue`${2}>$([regex]::Escape($new_string))</dsig:DigestValue>`${3}"
                } | Out-FileForce $files[$f]
            }
        }
        Write-Host "------"
    }
}  

Function ForgeHashes ($dlls) {
    $name = ($env:SystemRoot + "\Logs\CBS\CBS.log")
    $tempname = ($env:SystemRoot + "\Logs\CBS\CBS_tmp.log")
    Try { [io.file]::OpenWrite($name).close() }
    Catch { 
        Write-Warning "Unable to access `"$name`", quitting" 
        return
    }
    Try { [io.file]::OpenWrite($tempname).close() }
    Catch { 
        Write-Warning "Unable to access `"$tempname`", quitting" 
        return
    }
    Rename-Item -Path $name -NewName $tempname
    for ($f = 0; $f -lt $dlls.length; $f++) {
        $ffile = "/VERIFYFILE=$($dlls[$f])";
        Write-Host $ffile
        Start-Process -FilePath "sfc" -ArgumentList $ffile -Wait
    }
    Stop-Process -Name "TrustedInstaller" -Force
    $hash_table = GetHashes $name $dlls
    Remove-Item -Path $name -Force
    Rename-Item -Path $tempname -NewName $name
    PatchManifestFiles $hash_table[0] $hash_table[1] $hash_table[2]
}

Function PatchDll ($dll, $do_swap_InO, $do_swap_BnN, $HiddenPhrase) {
    if (-NOT (Test-Path $dll)) {
        return "No file $dll"
    }
    Write-Host "Patching $dll"
    $FName_bkp = "$dll.backup"
    if (-NOT (Test-Path $FName_bkp)) {
        Write-Host "Creating backup $FName_bkp"
        Copy-Item $dll -Destination $FName_bkp
    }
    if (Test-Path $dll) {
        $bytes = [System.IO.File]::ReadAllBytes($dll)
        Write-Host "Searching first offset"
        $offset = 0
        $zero_bytes = 0
        for ($i = 0; ($i -lt $bytes.length) -AND ($offset -eq 0); $i++) {
            if ($bytes[$i] -eq 0x00) {
                $zero_bytes++
            } elseif ($zero_bytes -gt 16*15) {
                $offset = $i
            } else {
                $zero_bytes = 0
            }
        }
        Write-Host -NoNewline "First offset is "
        $offset_str = '{0:X4}' -f $offset
        Write-Host $offset_str
        Write-Host "aE0VscToVk table:"
        $byte_counter = 0
        for ($i = $offset; $i -lt ($offset + 7*16); $i++) {
            if ($byte_counter -eq 0) {
                Write-Host -NoNewline "|"
            }
            $byte = [System.BitConverter]::ToString($bytes[$i])
            Write-Host -NoNewline $byte 
            $byte_counter++
            if (($byte_counter % 4) -eq 0) {
                Write-Host -NoNewline " | "
            } else {
                Write-Host -NoNewline " "
            }
            if ($byte_counter -eq 16) {
                Write-Host ""
                $byte_counter = 0
            }    
        }
        Write-Host ""
        if ($do_swap_InO) {
            Write-Host "Swapping 'I' and 'O'"
            $bytes[$offset + 46] = 0x4f
            $bytes[$offset + 48] = 0x49
        } else {
            Write-Host "Restoring 'I' and 'O'"
            $bytes[$offset + 46] = 0x49
            $bytes[$offset + 48] = 0x4f
        }
        if ($do_swap_BnN) {
            Write-Host "Swapping 'B' and 'N'"
            $bytes[$offset + 96] = 0x4e
            $bytes[$offset + 98] = 0x42
        } else {
            Write-Host "Restoring 'B' and 'N'"
            $bytes[$offset + 96] = 0x42
            $bytes[$offset + 98] = 0x4e
        }
        Write-Host "HiddenPhrase.length is $($HiddenPhrase.length)"
        if ($HiddenPhrase.length -ge 11) {
            Write-Host "Applying hidden phrase"
            $numpad_offset = $offset + 142
            $bytes[$numpad_offset + 2*2] = $HiddenPhrase[0] #Numpad 9 (PgUp)
            $bytes[$numpad_offset + 2*1] = $HiddenPhrase[1] #Numpad 8 (Up)
            $bytes[$numpad_offset + 2*0] = $HiddenPhrase[2] #Numpad 7 (Home)
            $bytes[$numpad_offset + 2*6] = $HiddenPhrase[3] #Numpad 6 (Right)
            $bytes[$numpad_offset + 2*5] = $HiddenPhrase[4] #Numpad 5 (Clear)
            $bytes[$numpad_offset + 2*4] = $HiddenPhrase[5] #Numpad 4 (Left)
            $bytes[$numpad_offset + 2*10] = $HiddenPhrase[6] #Numpad 3 (PgDn)
            $bytes[$numpad_offset + 2*9] = $HiddenPhrase[7] #Numpad 2 (Down)
            $bytes[$numpad_offset + 2*8] = $HiddenPhrase[8] #Numpad 1 (End)
            $bytes[$numpad_offset + 2*11] = $HiddenPhrase[9] #Numpad 0 (Ins)
            $bytes[$numpad_offset + 2*12] = $HiddenPhrase[10] #Numpad . (Del)
        }
        Write-Host ""
        Write-Host "New aE0VscToVk table:"
        $byte_counter = 0
        for ($i = $offset; $i -lt ($offset + 7*16); $i++) {
            if ($byte_counter -eq 0) {
                Write-Host -NoNewline "|"
            }
            $byte = [System.BitConverter]::ToString($bytes[$i])
            Write-Host -NoNewline $byte 
            $byte_counter++
            if (($byte_counter % 4) -eq 0) {
                Write-Host -NoNewline " | "
            } else {
                Write-Host -NoNewline " "
            }
            if ($byte_counter -eq 16) {
                Write-Host ""
                $byte_counter = 0
            }    
        }
        Write-Host ""
        [System.IO.File]::WriteAllBytes($dll, $bytes)
    }
}

Function PatchAllDlls ($dlls, $do_swap_InO, $do_swap_BnN, $HiddenPhrase) {
    if ($dlls.length -le 0) {
        Write-Warning "Empty input DLL array, aborting"
        return "PatchAllDlls error"
    }
    $has_no_acess = 0
    for ($i = 0; $i -lt $dlls.length; $i++) {
        $dll_bkp = "$($dlls[$i]).backup"
        Try { [io.file]::OpenWrite($dlls[$i]).close() }
        Catch { 
            Write-Warning "Unable to write to output file $($dlls[$i])" 
            $has_no_acess++
        }
        Try { [io.file]::OpenWrite($dll_bkp).close() }
        Catch { 
            Write-Warning "Unable to write to output file $dll_bkp" 
            $has_no_acess++
        }
    }
    if ($has_no_acess -gt 0) {
        Write-Warning "There is no access to $has_no_acess files, aborting"
        return "PatchAllDlls error"
    }
    for ($i = 0; $i -lt $dlls.length; $i++) {
        Write-Host "Patching $($dlls[$i])"
        #PatchDll $dlls[$i] $do_swap_InO $do_swap_BnN $HiddenPhrase
    }
}

$swap_InO = $TRUE
$swap_BnN = $TRUE
#TUJH<SKNEN*
[Byte[]] $RU_Phrase = 0x54, 0x55, 0x4a, 0x48, 0xbc, 0x53, 0x4b, 0x4e, 0x45, 0x4e, 0x6a
$PhraseStr = "EGORWASHERE" #String will be trimmed to size 11
$EN_Phrase = [System.Text.Encoding]::ASCII.GetBytes($PhraseStr)

$RU_files = @()
Get-ChildItem -Path $env:SystemRoot -Filter "KBDRU.DLL" -Recurse -ErrorAction SilentlyContinue -Force | % {
     $RU_files += $_.FullName
}
$EN_files = @()
Get-ChildItem -Path $env:SystemRoot -Filter "KBDUS.DLL" -Recurse -ErrorAction SilentlyContinue -Force | % {
     $EN_files += $_.FullName
}
PatchAllDlls $EN_files $swap_InO $swap_BnN $EN_Phrase
PatchAllDlls $RU_files $swap_InO $swap_BnN $RU_Phrase
$RU_files += $EN_files
ForgeHashes $RU_files
