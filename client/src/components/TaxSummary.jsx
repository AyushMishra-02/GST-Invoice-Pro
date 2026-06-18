import React from 'react'

export default function TaxSummary({ preview }) {
  if (!preview) {
    return (
      <div>
        <h2>Tax Summary</h2>
        <p style={{color: 'var(--text-secondary)', fontSize: '0.9rem'}}>
          Fill out the invoice details to see live GST calculations.
        </p>
      </div>
    )
  }

  const { totals } = preview
  
  // Format currency
  const formatINR = (amount) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount)
  }

  return (
    <div>
      <h2>Tax Summary</h2>
      
      <div style={{display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>
        <div className="summary-row">
          <span>Taxable Value</span>
          <span>{formatINR(totals.totalTaxableValue)}</span>
        </div>
        
        {totals.totalCGST > 0 && (
          <div className="summary-row">
            <span>CGST</span>
            <span>{formatINR(totals.totalCGST)}</span>
          </div>
        )}
        
        {totals.totalSGST > 0 && (
          <div className="summary-row">
            <span>SGST</span>
            <span>{formatINR(totals.totalSGST)}</span>
          </div>
        )}
        
        {totals.totalIGST > 0 && (
          <div className="summary-row">
            <span>IGST</span>
            <span>{formatINR(totals.totalIGST)}</span>
          </div>
        )}
        
        <div className="summary-row total">
          <span>Grand Total</span>
          <span>{formatINR(totals.grandTotal)}</span>
        </div>
      </div>
      
      <div style={{marginTop: '2rem', padding: '1rem', backgroundColor: '#f1f5f9', borderRadius: '8px', fontSize: '0.85rem', color: 'var(--text-secondary)'}}>
        <strong>GST Logic Applied:</strong><br/>
        {totals.totalIGST > 0 
          ? "Inter-state supply detected. IGST applied at full rate." 
          : "Intra-state supply detected. CGST & SGST applied equally."}
      </div>
    </div>
  )
}
