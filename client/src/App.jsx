import { useState, useEffect } from 'react'
import axios from 'axios'
import InvoiceForm from './components/InvoiceForm'
import TaxSummary from './components/TaxSummary'

function App() {
  const [companies, setCompanies] = useState([])
  const [clients, setClients] = useState([])
  
  const [formData, setFormData] = useState({
    invoice_number: `INV-${Math.floor(Math.random() * 10000)}`,
    date: new Date().toISOString().split('T')[0],
    seller_id: '',
    client_id: '',
    items: [{ id: 1, description: '', hsn_code: '', quantity: 1, unit_price: 0, gst_rate: 18 }]
  })
  
  const [preview, setPreview] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Fetch companies and clients on load
    const fetchData = async () => {
      try {
        const [compRes, cliRes] = await Promise.all([
          axios.get('/api/companies'),
          axios.get('/api/clients')
        ])
        setCompanies(compRes.data)
        setClients(cliRes.data)
        if (compRes.data.length > 0) setFormData(f => ({ ...f, seller_id: compRes.data[0].id }))
      } catch (err) {
        console.error("Failed to fetch initial data", err)
      }
    }
    fetchData()
  }, [])

  // Auto-validate/preview when form changes (if valid)
  useEffect(() => {
    if (formData.seller_id && formData.client_id && formData.items.length > 0 && formData.items[0].description) {
      axios.post('/api/invoices/validate', formData)
        .then(res => setPreview(res.data))
        .catch(err => console.error("Validation error", err))
    } else {
      setPreview(null)
    }
  }, [formData])

  const handleGenerateInvoice = async () => {
    if (!formData.seller_id || !formData.client_id) return alert('Select Seller and Client')
    
    setLoading(true)
    try {
      const res = await axios.post('/api/invoices', formData)
      const invoiceId = res.data.id
      
      // Download PDF
      window.open(`/api/invoices/${invoiceId}/pdf`, '_blank')
      
      // Reset form
      setFormData(prev => ({
        ...prev,
        invoice_number: `INV-${Math.floor(Math.random() * 10000)}`,
        items: [{ id: Date.now(), description: '', hsn_code: '', quantity: 1, unit_price: 0, gst_rate: 18 }]
      }))
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to generate invoice')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="app-container">
      <div className="header">
        <div>
          <h1>GST Invoice Generator</h1>
          <p style={{color: 'var(--text-secondary)', margin: 0}}>Create B2B tax-compliant invoices instantly.</p>
        </div>
        <button 
          className="btn btn-primary" 
          onClick={handleGenerateInvoice}
          disabled={loading || !preview}
        >
          {loading ? 'Generating...' : 'Generate & Download PDF'}
        </button>
      </div>

      <div className="grid-layout">
        <div className="panel">
          <InvoiceForm 
            formData={formData} 
            setFormData={setFormData} 
            companies={companies} 
            clients={clients} 
          />
        </div>
        
        <div className="panel" style={{position: 'sticky', top: '2rem'}}>
          <TaxSummary preview={preview} />
        </div>
      </div>
    </div>
  )
}

export default App
