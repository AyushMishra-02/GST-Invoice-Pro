export const calculateGST = (sellerStateCode, buyerStateCode, items) => {
  const isInterState = sellerStateCode !== buyerStateCode
  
  let totalTaxableValue = 0
  let totalCGST = 0
  let totalSGST = 0
  let totalIGST = 0

  const processedItems = items.map(item => {
    const amount = item.quantity * item.unit_price
    totalTaxableValue += amount

    let cgstAmount = 0
    let sgstAmount = 0
    let igstAmount = 0

    if (isInterState) {
      // IGST applies (100% of GST rate)
      igstAmount = amount * (item.gst_rate / 100)
      totalIGST += igstAmount
    } else {
      // CGST + SGST apply (50% each of GST rate)
      const halfRate = item.gst_rate / 2
      cgstAmount = amount * (halfRate / 100)
      sgstAmount = amount * (halfRate / 100)
      totalCGST += cgstAmount
      totalSGST += sgstAmount
    }

    return {
      ...item,
      taxable_amount: amount,
      cgst_amount: cgstAmount,
      sgst_amount: sgstAmount,
      igst_amount: igstAmount
    }
  })

  const grandTotal = totalTaxableValue + totalCGST + totalSGST + totalIGST

  return {
    items: processedItems,
    totals: {
      totalTaxableValue,
      totalCGST,
      totalSGST,
      totalIGST,
      grandTotal
    }
  }
}
