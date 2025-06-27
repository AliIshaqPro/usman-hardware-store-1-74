
import jsPDF from 'jspdf';

interface Customer {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  type: string;
  address?: string;
  city?: string;
  status: string;
  creditLimit: number;
  currentBalance: number;
  totalPurchases: number;
  lastPurchase?: string;
}

export const generateAllCustomersPDF = (customers: Customer[]) => {
  const doc = new jsPDF();
  let yPos = 20;

  // Header with company branding
  doc.setFillColor(59, 130, 246);
  doc.rect(0, 0, 210, 25, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.text('ALL CUSTOMERS REPORT', 20, 16);
  
  yPos = 40;

  // Summary Section
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(16);
  doc.setTextColor(59, 130, 246);
  doc.text('SUMMARY', 20, yPos);
  
  yPos += 10;
  doc.setDrawColor(59, 130, 246);
  doc.line(20, yPos, 190, yPos);
  yPos += 15;

  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text(`Total Customers: ${customers.length}`, 20, yPos);
  yPos += 8;
  
  const activeCustomers = customers.filter(c => c.status === 'active' || !c.status).length;
  doc.text(`Active Customers: ${activeCustomers}`, 20, yPos);
  yPos += 8;
  
  const totalDues = customers.reduce((sum, c) => sum + (c.currentBalance || 0), 0);
  doc.text(`Total Outstanding: PKR ${totalDues.toLocaleString()}`, 20, yPos);
  yPos += 8;
  
  const totalPurchases = customers.reduce((sum, c) => sum + (c.totalPurchases || 0), 0);
  doc.text(`Total Purchases: PKR ${totalPurchases.toLocaleString()}`, 20, yPos);
  yPos += 20;

  // Customer Details Section
  doc.setFontSize(16);
  doc.setTextColor(34, 197, 94);
  doc.text('CUSTOMER DETAILS', 20, yPos);
  
  yPos += 10;
  doc.setDrawColor(34, 197, 94);
  doc.line(20, yPos, 190, yPos);
  yPos += 15;

  customers.forEach((customer, index) => {
    // Check if we need a new page
    if (yPos > 250) {
      doc.addPage();
      yPos = 20;
    }

    // Customer header
    doc.setFillColor(248, 250, 252);
    doc.rect(20, yPos - 5, 170, 12, 'F');
    
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(`${index + 1}. ${customer.name}`, 25, yPos + 3);
    doc.text(`Type: ${customer.type}`, 130, yPos + 3);
    yPos += 15;

    // Customer details
    doc.setFontSize(10);
    
    if (customer.phone) {
      doc.text(`Phone: ${customer.phone}`, 25, yPos);
      yPos += 6;
    }
    
    if (customer.email) {
      doc.text(`Email: ${customer.email}`, 25, yPos);
      yPos += 6;
    }
    
    if (customer.address) {
      doc.text(`Address: ${customer.address}`, 25, yPos);
      yPos += 6;
    }
    
    if (customer.city) {
      doc.text(`City: ${customer.city}`, 25, yPos);
      yPos += 6;
    }

    // Financial information
    doc.text(`Credit Limit: PKR ${customer.creditLimit?.toLocaleString() || '0'}`, 25, yPos);
    yPos += 6;
    doc.text(`Current Balance: PKR ${customer.currentBalance?.toLocaleString() || '0'}`, 25, yPos);
    yPos += 6;
    doc.text(`Total Purchases: PKR ${customer.totalPurchases?.toLocaleString() || '0'}`, 25, yPos);
    yPos += 6;
    
    if (customer.lastPurchase) {
      doc.text(`Last Purchase: ${customer.lastPurchase}`, 25, yPos);
      yPos += 6;
    }

    doc.text(`Status: ${customer.status || 'active'}`, 25, yPos);
    yPos += 15;
  });

  // Footer
  const pageCount = (doc as any).internal.pages.length - 1;
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(128, 128, 128);
    doc.text(`Generated on: ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}`, 20, 285);
    doc.text(`Page ${i} of ${pageCount}`, 160, 285);
    doc.text('All Customers Report - IMS', 20, 290);
  }

  // Download the PDF
  const fileName = `All_Customers_Report_${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(fileName);
};
