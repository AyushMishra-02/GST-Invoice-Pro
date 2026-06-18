import React from 'react'

export default function InvoiceForm({ formData, setFormData, companies, clients }) {
  const handleItemChange = (index, field, value) => {
    const newItems = [...formData.items]
    newItems[index][field] = value
    setFormData({ ...formData, items: newItems })
  }

  const addItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { id: Date.now(), description: '', hsn_code: '', quantity: 1, unit_price: 0, gst_rate: 18 }]
    })
  }

  const removeItem = (index) => {
    if (formData.items.length === 1) return
    const newItems = formData.items.filter((_, i) => i !== index)
    setFormData({ ...formData, items: newItems })
  }

  return (
    <div>
      <h2>Invoice Details</h2>
      <div style={{display: 'flex', gap: '1rem', marginBottom: '1.5rem'}}>
        <div className="form-group" style={{flex: 1}}>
          <label>Invoice Number</label>
          <input 
            type="text" 
            className="form-control" 
            value={formData.invoice_number} 
            onChange={e => setFormData({...formData, invoice_number: e.target.value})} 
          />
        </div>
        <div className="form-group" style={{flex: 1}}>
          <label>Date</label>
          <input 
            type="date" 
            className="form-control" 
            value={formData.date} 
            onChange={e => setFormData({...formData, date: e.target.value})} 
          />
        </div>
      </div>

      <div style={{display: 'flex', gap: '1rem', marginBottom: '2rem'}}>
        <div className="form-group" style={{flex: 1}}>
          <label>Seller (Company)</label>
          <select 
            className="form-control" 
            value={formData.seller_id} 
            onChange={e => setFormData({...formData, seller_id: e.target.value})}
          >
            <option value="">Select Seller</option>
            {companies.map(c => <option key={c.id} value={c.id}>{c.name} ({c.state_code})</option>)}
          </select>
        </div>
        <div className="form-group" style={{flex: 1}}>
          <label>Billed To (Client)</label>
          <select 
            className="form-control" 
            value={formData.client_id} 
            onChange={e => setFormData({...formData, client_id: e.target.value})}
          >
            <option value="">Select Client</option>
            {clients.map(c => <option key={c.id} value={c.id}>{c.name} ({c.state_code})</option>)}
          </select>
        </div>
      </div>

      <h2>Line Items</h2>
      <table className="items-table">
        <thead>
          <tr>
            <th style={{width: '35%'}}>Description</th>
            <th style={{width: '15%'}}>HSN</th>
            <th style={{width: '10%'}}>Qty</th>
            <th style={{width: '15%'}}>Rate (₹)</th>
            <th style={{width: '15%'}}>GST %</th>
            <th style={{width: '10%'}}></th>
          </tr>
        </thead>
        <tbody>
          {formData.items.map((item, index) => (
            <tr key={item.id}>
              <td>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="Item Name" 
                  value={item.description} 
                  onChange={e => handleItemChange(index, 'description', e.target.value)} 
                />
              </td>
              <td>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="1234" 
                  value={item.hsn_code} 
                  onChange={e => handleItemChange(index, 'hsn_code', e.target.value)} 
                />
              </td>
              <td>
                <input 
                  type="number" 
                  className="form-control" 
                  min="1" 
                  value={item.quantity} 
                  onChange={e => handleItemChange(index, 'quantity', parseInt(e.target.value) || 0)} 
                />
              </td>
              <td>
                <input 
                  type="number" 
                  className="form-control" 
                  min="0" 
                  value={item.unit_price} 
                  onChange={e => handleItemChange(index, 'unit_price', parseFloat(e.target.value) || 0)} 
                />
              </td>
              <td>
                <select 
                  className="form-control" 
                  value={item.gst_rate} 
                  onChange={e => handleItemChange(index, 'gst_rate', parseFloat(e.target.value))}
                >
                  <option value="0">0%</option>
                  <option value="5">5%</option>
                  <option value="12">12%</option>
                  <option value="18">18%</option>
                  <option value="28">28%</option>
                </select>
              </td>
              <td style={{textAlign: 'center', verticalAlign: 'middle'}}>
                <button 
                  type="button" 
                  className="btn btn-danger" 
                  onClick={() => removeItem(index)}
                  disabled={formData.items.length === 1}
                >
                  &times;
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      <button type="button" className="btn btn-outline" onClick={addItem}>
        + Add Item
      </button>
    </div>
  )
}
