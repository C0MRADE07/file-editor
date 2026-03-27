$input = "File_Editor.css"
$output = "File_Editor_New.css"
$content = Get-Content $input
$newContent = @()
foreach ($line in $content) {
    if ($line -match "font-mono") {
        $newContent += $line
        $newContent += ""
        $newContent += "    /* TYPOGRAPHY SCALE (DRASTIC) */"
        $newContent += "    --fs-xs: 14px;"
        $newContent += "    --fs-sm: 16px;"
        $newContent += "    --fs-base: 18px;"
        $newContent += "    --fs-lg: 24px;"
        $newContent += "    --fs-xl: 36px;"
        $newContent += "    --fs-xxl: 64px;"
    } else {
        $newContent += $line
    }
}
$newContent | Set-Content $output
Move-Item -Force $output $input
