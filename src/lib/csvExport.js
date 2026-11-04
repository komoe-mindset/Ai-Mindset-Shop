/**
 * Utility to generate and trigger real browser CSV file downloads.
 * Uses UTF-8 BOM so Myanmar Unicode and spreadsheet characters open correctly in Excel and Google Sheets.
 */

export function downloadProductsCSV(products) {
  const headers = ['Product ID', 'Name', 'Category', 'Price (Ks)', 'Stock', 'Status'];
  const rows = products.map((p) => [
    p.id,
    `"${(p.name || '').replace(/"/g, '""')}"`,
    `"${(p.category || '').replace(/"/g, '""')}"`,
    p.priceKs,
    p.stock,
    p.stock > 0 ? (p.stock < 10 ? 'Low Stock' : 'In Stock') : 'Out of Stock',
  ]);

  const csvContent =
    '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');

  triggerDownload(csvContent, `AiMindset_Products_${new Date().toISOString().slice(0, 10)}.csv`);
}

export function downloadOrdersCSV(orders) {
  const headers = [
    'Order ID',
    'Customer Name',
    'Phone',
    'Address',
    'Items Summary',
    'Delivery Fee (Ks)',
    'Total (Ks)',
    'Payment Method',
    'Status',
    'Date Placed',
  ];

  const rows = orders.map((o) => {
    const itemsSummary = o.items.map((i) => `${i.quantity}x ${i.name}`).join('; ');
    return [
      o.id,
      `"${(o.customerName || '').replace(/"/g, '""')}"`,
      `"${(o.phone || '').replace(/"/g, '""')}"`,
      `"${(o.address || '').replace(/"/g, '""')}"`,
      `"${itemsSummary.replace(/"/g, '""')}"`,
      o.deliveryFeeKs || 0,
      o.totalKs,
      `"${(o.paymentMethod || 'Cash on Delivery').replace(/"/g, '""')}"`,
      o.status,
      `"${new Date(o.createdAt).toISOString()}"`,
    ];
  });

  const csvContent =
    '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');

  triggerDownload(csvContent, `AiMindset_Orders_${new Date().toISOString().slice(0, 10)}.csv`);
}

function triggerDownload(content, filename) {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
