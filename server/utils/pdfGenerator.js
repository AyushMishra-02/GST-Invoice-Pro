import PDFDocument from 'pdfkit'

export const generateInvoicePDF = (seller, client, invoice, items) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50 })
      
      generateHeader(doc, seller)
      generateCustomerInformation(doc, client, invoice)
      generateInvoiceTable(doc, items, invoice)
      generateFooter(doc)

      doc.end()
      resolve(doc)
    } catch (err) {
      reject(err)
    }
  })
}

function generateHeader(doc, seller) {
  doc
    .fillColor('#444444')
    .fontSize(20)
    .text(seller.name, 50, 57)
    .fontSize(10)
    .text(seller.address, 50, 80)
    .text(`GSTIN: ${seller.gstin}`, 50, 95)
    .text(`State Code: ${seller.state_code}`, 50, 110)
    .fontSize(20)
    .text('TAX INVOICE', 400, 57, { align: 'right' })
    .moveDown()
}

function generateCustomerInformation(doc, client, invoice) {
  doc
    .fillColor('#444444')
    .fontSize(10)
    .text('Invoice Number:', 50, 160)
    .font('Helvetica-Bold')
    .text(invoice.invoice_number, 150, 160)
    .font('Helvetica')
    .text('Invoice Date:', 50, 175)
    .text(invoice.date, 150, 175)
    
    .text('Billed To:', 300, 160)
    .font('Helvetica-Bold')
    .text(client.name, 400, 160)
    .font('Helvetica')
    .text(client.address, 400, 175)
    .text(`GSTIN: ${client.gstin}`, 400, 190)
    .text(`State Code: ${client.state_code}`, 400, 205)
    .moveDown()
}

function generateInvoiceTable(doc, items, invoice) {
  let i
  const invoiceTableTop = 250

  doc.font('Helvetica-Bold')
  generateTableRow(
    doc,
    invoiceTableTop,
    'Item',
    'HSN',
    'Qty',
    'Rate',
    'Taxable',
    'CGST',
    'SGST',
    'IGST',
    'Total'
  )
  generateHr(doc, invoiceTableTop + 20)
  doc.font('Helvetica')

  let y = invoiceTableTop + 30
  
  items.forEach((item, index) => {
    const itemTotal = item.taxable_amount + item.cgst_amount + item.sgst_amount + item.igst_amount
    
    generateTableRow(
      doc,
      y,
      item.description,
      item.hsn_code,
      item.quantity,
      item.unit_price.toFixed(2),
      item.taxable_amount.toFixed(2),
      item.cgst_amount.toFixed(2),
      item.sgst_amount.toFixed(2),
      item.igst_amount.toFixed(2),
      itemTotal.toFixed(2)
    )
    generateHr(doc, y + 20)
    y += 30
  })

  // Totals
  doc.font('Helvetica-Bold')
  y += 10
  generateTableRow(
    doc,
    y,
    '',
    '',
    '',
    'TOTAL',
    invoice.total_taxable_value.toFixed(2),
    invoice.total_cgst.toFixed(2),
    invoice.total_sgst.toFixed(2),
    invoice.total_igst.toFixed(2),
    invoice.grand_total.toFixed(2)
  )
}

function generateFooter(doc) {
  doc
    .fontSize(10)
    .text(
      'This is a computer generated invoice and does not require a physical signature.',
      50,
      700,
      { align: 'center', width: 500 }
    )
}

function generateTableRow(doc, y, item, hsn, qty, rate, taxable, cgst, sgst, igst, total) {
  doc
    .fontSize(9)
    .text(item, 50, y, { width: 130 })
    .text(hsn, 180, y, { width: 40, align: 'center' })
    .text(qty, 220, y, { width: 30, align: 'center' })
    .text(rate, 250, y, { width: 50, align: 'right' })
    .text(taxable, 300, y, { width: 50, align: 'right' })
    .text(cgst, 350, y, { width: 40, align: 'right' })
    .text(sgst, 390, y, { width: 40, align: 'right' })
    .text(igst, 430, y, { width: 40, align: 'right' })
    .text(total, 470, y, { width: 70, align: 'right' })
}

function generateHr(doc, y) {
  doc
    .strokeColor('#aaaaaa')
    .lineWidth(1)
    .moveTo(50, y)
    .lineTo(550, y)
    .stroke()
}
