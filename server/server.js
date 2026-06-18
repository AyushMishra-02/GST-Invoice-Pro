import express from 'express'
import cors from 'cors'
import { dbQuery, dbRun } from './db.js'
import { calculateGST } from './utils/gstCalculator.js'
import { generateInvoicePDF } from './utils/pdfGenerator.js'

const app = express()
app.use(cors())
app.use(express.json())

// ─── API ROUTES ────────────────────────────────────────────────────────────

app.get('/api/companies', async (req, res) => {
  try {
    const companies = await dbQuery('SELECT * FROM companies')
    res.json(companies)
  } catch (err) { res.status(500).json({ error: err.message }) }
})

app.get('/api/clients', async (req, res) => {
  try {
    const clients = await dbQuery('SELECT * FROM clients')
    res.json(clients)
  } catch (err) { res.status(500).json({ error: err.message }) }
})

app.post('/api/invoices/validate', async (req, res) => {
  try {
    const { seller_id, client_id, items } = req.body
    
    const [seller] = await dbQuery('SELECT * FROM companies WHERE id = ?', [seller_id])
    const [client] = await dbQuery('SELECT * FROM clients WHERE id = ?', [client_id])
    
    if (!seller || !client) return res.status(400).json({ error: 'Invalid seller or client' })
    if (!items || items.length === 0) return res.status(400).json({ error: 'Items are required' })

    const calculated = calculateGST(seller.state_code, client.state_code, items)
    res.json(calculated)
  } catch (err) { res.status(500).json({ error: err.message }) }
})

app.post('/api/invoices', async (req, res) => {
  try {
    const { invoice_number, date, seller_id, client_id, items } = req.body
    
    const [seller] = await dbQuery('SELECT * FROM companies WHERE id = ?', [seller_id])
    const [client] = await dbQuery('SELECT * FROM clients WHERE id = ?', [client_id])
    
    if (!seller || !client) return res.status(400).json({ error: 'Invalid seller or client' })
    
    const { items: processedItems, totals } = calculateGST(seller.state_code, client.state_code, items)

    // Save invoice
    const result = await dbRun(
      `INSERT INTO invoices (invoice_number, date, client_id, total_taxable_value, total_cgst, total_sgst, total_igst, grand_total) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [invoice_number, date, client_id, totals.totalTaxableValue, totals.totalCGST, totals.totalSGST, totals.totalIGST, totals.grandTotal]
    )
    const invoiceId = result.lastID

    // Save items
    for (const item of processedItems) {
      await dbRun(
        `INSERT INTO invoice_items (invoice_id, description, hsn_code, quantity, unit_price, gst_rate, taxable_amount, cgst_amount, sgst_amount, igst_amount)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [invoiceId, item.description, item.hsn_code, item.quantity, item.unit_price, item.gst_rate, item.taxable_amount, item.cgst_amount, item.sgst_amount, item.igst_amount]
      )
    }

    res.status(201).json({ message: 'Invoice generated successfully', id: invoiceId })
  } catch (err) {
    if (err.message.includes('UNIQUE constraint failed')) {
      return res.status(400).json({ error: 'Invoice number already exists' })
    }
    res.status(500).json({ error: err.message })
  }
})

app.get('/api/invoices/:id/pdf', async (req, res) => {
  try {
    const { id } = req.params
    const [invoice] = await dbQuery('SELECT * FROM invoices WHERE id = ?', [id])
    if (!invoice) return res.status(404).json({ error: 'Invoice not found' })

    const [client] = await dbQuery('SELECT * FROM clients WHERE id = ?', [invoice.client_id])
    const items = await dbQuery('SELECT * FROM invoice_items WHERE invoice_id = ?', [id])
    
    // We assume the first company is the seller for simplicity
    const [seller] = await dbQuery('SELECT * FROM companies LIMIT 1')

    const pdfStream = await generateInvoicePDF(seller, client, invoice, items)
    
    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader('Content-Disposition', `attachment; filename="Invoice_${invoice.invoice_number}.pdf"`)
    
    pdfStream.pipe(res)
  } catch (err) { res.status(500).json({ error: err.message }) }
})

const PORT = 5001
app.listen(PORT, () => {
  console.log(`🚀 GST Backend running on http://localhost:${PORT}`)
})
