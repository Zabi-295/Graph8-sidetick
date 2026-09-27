Set FSO = CreateObject("Scripting.FileSystemObject")
Set WshShell = CreateObject("WScript.Shell")

' Terminate any existing background electron processes cleanly
On Error Resume Next
WshShell.Run "taskkill /f /im electron.exe", 0, True

' Clear lockfiles
Appdata = WshShell.ExpandEnvironmentStrings("%APPDATA%")
Lock1 = Appdata & "\Graph8Sidekick\SingletonLock"
Lock2 = Appdata & "\Graph8Sidekick\lockfile"
If FSO.FileExists(Lock1) Then FSO.DeleteFile Lock1, True
If FSO.FileExists(Lock2) Then FSO.DeleteFile Lock2, True

' Resolve script folder path with Unicode/short-name safety
ScriptFolder = FSO.GetParentFolderName(WScript.ScriptFullName)
If InStr(ScriptFolder, "?") > 0 Or Not FSO.FolderExists(ScriptFolder) Then
    ScriptFolder = "C:\Users\jahan\OneDrive\AD0F~1\GRAPH8~2"
End If

WshShell.CurrentDirectory = ScriptFolder
WshShell.Run """" & ScriptFolder & "\Launch Graph8 Sidekick.bat""", 0, False

Set WshShell = Nothing
Set FSO = Nothing
