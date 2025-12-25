
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Order, OrderItem } from '@/types/order';
import { ShippingAddress } from '@/types/order';
import { CartItem } from '@/contexts/CartContext';

// Helper function to ensure we get a standardized item format for the invoice
const formatInvoiceItems = (items: CartItem[] | OrderItem[]): { name: string; quantity: number; price: number; total: number }[] => {
  return items.map(item => ({
    name: item.product.name,
    quantity: item.quantity,
    price: item.product.price,
    total: item.product.price * item.quantity
  }));
};

export const generateInvoicePDF = (
  orderId: string,
  orderDate: string,
  items: CartItem[] | OrderItem[],
  shippingAddress: ShippingAddress,
  subtotal: number,
  shippingCost: number,
  total: number,
  paymentMethod: string
) => {
  const doc = new jsPDF();
  
  // Format items to ensure consistent structure
  const formattedItems = formatInvoiceItems(items);
  
  // Add company logo/header
  doc.setFontSize(20);
  doc.setTextColor(44, 62, 80);
  doc.text('SkinAura', 105, 20, { align: 'center' });
  
  // Invoice title
  doc.setFontSize(16);
  doc.text('INVOICE', 105, 30, { align: 'center' });
  
  // Invoice details
  doc.setFontSize(10);
  doc.text(`Invoice #: INV-${orderId}`, 15, 40);
  doc.text(`Date: ${orderDate}`, 15, 45);
  
  // Customer information
  doc.setFontSize(12);
  doc.text('Bill To:', 15, 55);
  doc.setFontSize(10);
  doc.text(shippingAddress.fullName, 15, 60);
  doc.text(shippingAddress.addressLine1, 15, 65);
  
  let customerInfoHeight = 70;
  if (shippingAddress.addressLine2) {
    doc.text(shippingAddress.addressLine2, 15, customerInfoHeight);
    customerInfoHeight += 5;
  }
  
  doc.text(`${shippingAddress.city}, ${shippingAddress.state} - ${shippingAddress.zipCode}`, 15, customerInfoHeight);
  customerInfoHeight += 5;
  doc.text(`Phone: ${shippingAddress.phoneNumber}`, 15, customerInfoHeight);
  
  // Order items
  const tableStartY = customerInfoHeight + 5;
  
  const itemRows = formattedItems.map(item => [
    item.name,
    `${item.quantity}`,
    `₹${item.price.toFixed(2)}`,
    `₹${item.total.toFixed(2)}`
  ]);
  
  autoTable(doc, {
    startY: tableStartY,
    head: [['Item', 'Quantity', 'Price', 'Total']],
    body: itemRows,
    theme: 'striped',
    headStyles: {
      fillColor: [44, 62, 80],
      textColor: [255, 255, 255]
    }
  });
  
  // Summary
  const finalY = (doc as any).lastAutoTable.finalY + 10;
  
  doc.text('Summary', 140, finalY);
  doc.text(`Subtotal:`, 140, finalY + 7);
  doc.text(`₹${subtotal.toFixed(2)}`, 180, finalY + 7, { align: 'right' });
  doc.text(`Shipping:`, 140, finalY + 14);
  doc.text(`₹${shippingCost.toFixed(2)}`, 180, finalY + 14, { align: 'right' });
  
  // Total
  doc.setFontSize(12);
  doc.setFont(undefined, 'bold');
  doc.text(`Total:`, 140, finalY + 24);
  doc.text(`₹${total.toFixed(2)}`, 180, finalY + 24, { align: 'right' });
  
  // Payment method
  doc.setFontSize(10);
  doc.setFont(undefined, 'normal');
  doc.text(`Payment Method: ${paymentMethod}`, 15, finalY + 35);
  
  // Footer
  doc.setFontSize(9);
  doc.setTextColor(100, 100, 100);
  doc.text('Thank you for shopping with SkinAura!', 105, finalY + 50, { align: 'center' });
  
  return doc;
};
