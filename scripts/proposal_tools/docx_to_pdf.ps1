$raceDir = Join-Path (Split-Path -Parent $PSScriptRoot) "race"
$docxItem = Get-ChildItem -Path $raceDir -Filter "*.docx" | Where-Object { $_.Length -gt 1000000 } | Select-Object -First 1

if (-not $docxItem) {
    Write-Error "DOCX not found in $raceDir!"
    exit 1
}

$docxPath = $docxItem.FullName
$pdfPath = [System.IO.Path]::ChangeExtension($docxPath, ".pdf")

Write-Output "Found DOCX: $($docxItem.Name) ($($docxItem.Length) bytes)"

$word = New-Object -ComObject Word.Application
$word.Visible = $false
$word.DisplayAlerts = 0

try {
    $doc = $word.Documents.Open($docxPath)
    $doc.SaveAs2($pdfPath, 17) # 17 = wdFormatPDF
    $pages = $doc.ComputeStatistics(2) # 2 = wdStatisticPages
    $words = $doc.ComputeStatistics(0) # 0 = wdStatisticWords
    Write-Output "PDF generated: $pdfPath"
    Write-Output "Official Word Stats: Total Pages = $pages, Total Words = $words"
    $doc.Close($false)
} catch {
    Write-Error "Error: $_"
} finally {
    $word.Quit()
    [System.Runtime.Interopservices.Marshal]::ReleaseComObject($word) | Out-Null
}
