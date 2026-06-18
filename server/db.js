import sqlite3 from 'sqlite3'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const dbPath = path.resolve(__dirname, 'gst_invoice.db')

// Initialize SQLite database
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database', err.message)
  } else {
    console.log('✅ Connected to SQLite database.')
    initTables()
  }
})

// Wrapper for async queries
export const dbQuery = (query, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(query, params, (err, rows) => {
      if (err) reject(err)
      resolve(rows)
    })
  })
}

export const dbRun = (query, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(query, params, function (err) {
      if (err) reject(err)
      resolve(this)
    })
  })
}

function initTables() {
  db.serialize(() => {
    // Enable Foreign Keys
    db.run('PRAGMA foreign_keys = ON;')

    // Companies (Seller)
    db.run(`CREATE TABLE IF NOT EXISTS companies (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      gstin TEXT NOT NULL UNIQUE,
      address TEXT NOT NULL,
      state_code TEXT NOT NULL
    )`)

    // Clients (Buyer)
    db.run(`CREATE TABLE IF NOT EXISTS clients (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      gstin TEXT NOT NULL UNIQUE,
      address TEXT NOT NULL,
      state_code TEXT NOT NULL
    )`)

    // Invoices
    db.run(`CREATE TABLE IF NOT EXISTS invoices (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      invoice_number TEXT NOT NULL UNIQUE,
      date TEXT NOT NULL,
      client_id INTEGER,
      total_taxable_value REAL DEFAULT 0,
      total_cgst REAL DEFAULT 0,
      total_sgst REAL DEFAULT 0,
      total_igst REAL DEFAULT 0,
      grand_total REAL DEFAULT 0,
      FOREIGN KEY (client_id) REFERENCES clients(id)
    )`)

    // Invoice Items
    db.run(`CREATE TABLE IF NOT EXISTS invoice_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      invoice_id INTEGER,
      description TEXT NOT NULL,
      hsn_code TEXT NOT NULL,
      quantity INTEGER NOT NULL,
      unit_price REAL NOT NULL,
      gst_rate REAL NOT NULL,
      taxable_amount REAL NOT NULL,
      cgst_amount REAL DEFAULT 0,
      sgst_amount REAL DEFAULT 0,
      igst_amount REAL DEFAULT 0,
      FOREIGN KEY (invoice_id) REFERENCES invoices(id) ON DELETE CASCADE
    )`)

    // Insert mock data if tables are empty
    db.get('SELECT COUNT(*) as count FROM companies', (err, row) => {
      if (row.count === 0) {
        db.run(`INSERT INTO companies (name, gstin, address, state_code) 
                VALUES ('BUSY Infotech Pvt. Ltd.', '07AABCB1234C1Z5', 'New Delhi, Delhi 110001', '07')`)
      }
    })

    db.get('SELECT COUNT(*) as count FROM clients', (err, row) => {
      if (row.count === 0) {
        db.run(`INSERT INTO clients (name, gstin, address, state_code) 
                VALUES ('Acme Corp Delhi', '07ACMEB5678D1Z2', 'Connaught Place, Delhi', '07'),
                       ('TechTonic Mumbai', '27TECHT9876E1Z9', 'Andheri East, Mumbai, Maharashtra', '27')`)
      }
    })
  })
}

export default db
