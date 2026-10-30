$docxItem = Get-ChildItem -Path "c:\Users\alexl\Desktop\Programs\Hand-In-Hand\race" -Filter "*.docx" | Where-Object { $_.Length -gt 1000000 } | Select-Object -First 1

$word = New-Object -ComObject Word.Application
$word.Visible = $false
$doc = $word.Documents.Open($docxItem.FullName)

# WdStatistic Enum:
# wdStatisticWords = 0
# wdStatisticLines = 1
# wdStatisticPages = 2
# wdStatisticCharacters = 3
# wdStatisticParagraphs = 4
# wdStatisticCharactersWithSpaces = 5
# wdStatisticFarEastCharacters = 6

Write-Output "Pages:                  $($doc.ComputeStatistics(2))"
Write-Output "Paragraphs:             $($doc.ComputeStatistics(4))"
Write-Output "Lines:                  $($doc.ComputeStatistics(1))"
Write-Output "Words:                  $($doc.ComputeStatistics(0))"
Write-Output "Characters (no spaces): $($doc.ComputeStatistics(3))"
Write-Output "Characters (w/ spaces): $($doc.ComputeStatistics(5))"
Write-Output "Far East Characters:    $($doc.ComputeStatistics(6))"

$doc.Close($false)
$word.Quit()
