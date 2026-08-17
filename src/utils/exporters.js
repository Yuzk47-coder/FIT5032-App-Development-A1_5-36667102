function downloadBlob(filename, blob) {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}

function csvCell(value) {
  const text = String(value ?? '')
  return `"${text.replaceAll('"', '""')}"`
}

export function downloadCsv(filename, columns, rows) {
  const header = columns.map((column) => csvCell(column.label)).join(',')
  const lines = rows.map((row) => columns.map((column) => csvCell(column.value(row))).join(','))
  const blob = new Blob(['\uFEFF' + [header, ...lines].join('\n')], { type: 'text/csv;charset=utf-8' })
  downloadBlob(filename, blob)
}

function ascii(value) {
  return String(value ?? '')
    .replaceAll('—', '-')
    .replaceAll('–', '-')
    .replaceAll('’', "'")
    .replaceAll('“', '"')
    .replaceAll('”', '"')
    .replace(/[^\x20-\x7E]/g, '?')
}

function pdfEscape(value) {
  return ascii(value).replaceAll('\\', '\\\\').replaceAll('(', '\\(').replaceAll(')', '\\)')
}

function wrapLine(text, width = 105) {
  const words = ascii(text).split(/\s+/)
  const lines = []
  let line = ''
  for (const word of words) {
    if (!line) line = word
    else if ((line + ' ' + word).length <= width) line += ' ' + word
    else { lines.push(line); line = word }
  }
  if (line) lines.push(line)
  return lines.length ? lines : ['']
}

// Minimal standards-compliant PDF generator: text-only, dependency-free and fully client-side.
export function downloadPdf(filename, title, columns, rows) {
  const tableLines = []
  const heading = columns.map((c) => c.label).join(' | ')
  tableLines.push(...wrapLine(heading))
  tableLines.push('-'.repeat(Math.min(105, heading.length || 30)))
  rows.forEach((row) => {
    const value = columns.map((c) => c.value(row)).join(' | ')
    tableLines.push(...wrapLine(value))
  })

  const pages = []
  const perPage = 48
  for (let i = 0; i < tableLines.length; i += perPage) pages.push(tableLines.slice(i, i + perPage))
  if (!pages.length) pages.push(['No records.'])

  const objects = []
  const addObject = (body) => { objects.push(body); return objects.length }
  const catalogId = addObject('')
  const pagesId = addObject('')
  const fontId = addObject('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>')
  const pageIds = []

  pages.forEach((lines, index) => {
    const content = [
      'BT',
      '/F1 16 Tf',
      '50 800 Td',
      `(${pdfEscape(title)}) Tj`,
      '/F1 9 Tf',
      '0 -24 Td',
      '12 TL',
      ...lines.flatMap((line) => [`(${pdfEscape(line)}) Tj`, 'T*']),
      `(${pdfEscape(`Page ${index + 1} of ${pages.length}`)}) Tj`,
      'ET'
    ].join('\n')
    const contentId = addObject(`<< /Length ${content.length} >>\nstream\n${content}\nendstream`)
    const pageId = addObject(`<< /Type /Page /Parent ${pagesId} 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 ${fontId} 0 R >> >> /Contents ${contentId} 0 R >>`)
    pageIds.push(pageId)
  })

  objects[catalogId - 1] = `<< /Type /Catalog /Pages ${pagesId} 0 R >>`
  objects[pagesId - 1] = `<< /Type /Pages /Kids [${pageIds.map((id) => `${id} 0 R`).join(' ')}] /Count ${pageIds.length} >>`

  let pdf = '%PDF-1.4\n'
  const offsets = [0]
  objects.forEach((body, index) => {
    offsets[index + 1] = pdf.length
    pdf += `${index + 1} 0 obj\n${body}\nendobj\n`
  })
  const xrefOffset = pdf.length
  pdf += `xref\n0 ${objects.length + 1}\n`
  pdf += '0000000000 65535 f \n'
  offsets.slice(1).forEach((offset) => { pdf += `${String(offset).padStart(10, '0')} 00000 n \n` })
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root ${catalogId} 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`

  downloadBlob(filename, new Blob([pdf], { type: 'application/pdf' }))
}
