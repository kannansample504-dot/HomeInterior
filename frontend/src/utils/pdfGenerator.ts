import jsPDF from 'jspdf';
import type { EstimateResult } from '../types';

const ROOM_LABELS: Record<string, string> = {
  living_room: 'Living Room',
  bedroom: 'Bedroom',
  kitchen: 'Kitchen',
  bathroom: 'Bathroom',
  dining_room: 'Dining Room',
  home_office: 'Home Office',
};

function formatINR(amount: number): string {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
}

export function generateEstimatePDF(result: EstimateResult, meta: {
  propertyType: string;
  style: string;
  name?: string;
  email?: string;
}) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  let y = 20;

  // Header
  doc.setFillColor(0, 74, 198); // primary color
  doc.rect(0, 0, pageWidth, 40, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text('Home Interior', 20, 18);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Interior Design Cost Estimate', 20, 28);
  doc.text(`Date: ${new Date().toLocaleDateString('en-IN')}`, pageWidth - 20, 18, { align: 'right' });
  doc.text(`Ref: HI-${Date.now().toString(36).toUpperCase()}`, pageWidth - 20, 28, { align: 'right' });

  y = 55;
  doc.setTextColor(19, 27, 46); // on-surface

  // Project Details
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Project Details', 20, y);
  y += 10;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  const details = [
    `Property Type: ${meta.propertyType}`,
    `Design Style: ${meta.style.replace(/_/g, ' ')}`,
    `Pricing Tier: ${result.tier}`,
    meta.name ? `Client: ${meta.name}` : '',
    meta.email ? `Email: ${meta.email}` : '',
  ].filter(Boolean);
  details.forEach(d => { doc.text(d, 20, y); y += 7; });

  y += 5;

  // Room Breakdown Table
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Room-wise Cost Breakdown', 20, y);
  y += 10;

  // Table header
  doc.setFillColor(234, 237, 255); // surface-container
  doc.rect(20, y - 5, pageWidth - 40, 10, 'F');
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('Room', 25, y);
  doc.text('Count', 80, y);
  doc.text('Area (sqft)', 100, y);
  doc.text('Rate/sqft', 130, y);
  doc.text('Cost', 165, y, { align: 'right' });
  y += 10;

  // Table rows
  doc.setFont('helvetica', 'normal');
  result.breakdown.forEach(room => {
    doc.text(ROOM_LABELS[room.room_type] || room.room_type, 25, y);
    doc.text(String(room.count), 85, y);
    doc.text(String(room.area_sqft), 105, y);
    doc.text(formatINR(room.price_per_sqft), 130, y);
    doc.text(formatINR(room.room_cost), 165, y, { align: 'right' });
    y += 8;
  });

  y += 5;

  // Totals
  doc.setDrawColor(200, 200, 220);
  doc.line(20, y, pageWidth - 20, y);
  y += 10;

  const totals = [
    ['Material Cost', formatINR(result.material_cost)],
    [`Labour (${result.labour_percent}%)`, formatINR(result.labour_cost)],
    ['Subtotal', formatINR(result.subtotal)],
    [`GST (${result.gst_percent}%)`, formatINR(result.gst_amount)],
  ];

  doc.setFontSize(10);
  totals.forEach(([label, value]) => {
    doc.setFont('helvetica', 'normal');
    doc.text(label, 110, y);
    doc.text(value, 165, y, { align: 'right' });
    y += 8;
  });

  y += 3;
  doc.setFillColor(0, 74, 198);
  doc.rect(100, y - 6, pageWidth - 120, 14, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Grand Total', 110, y + 3);
  doc.text(formatINR(result.grand_total), 165, y + 3, { align: 'right' });

  // Footer
  doc.setTextColor(100, 100, 120);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  const footerY = doc.internal.pageSize.getHeight() - 15;
  doc.text('Home Interior | hello@homeinterior.in | +91 98765 43210', pageWidth / 2, footerY, { align: 'center' });
  doc.text('This is a computer-generated estimate. Actual costs may vary.', pageWidth / 2, footerY + 5, { align: 'center' });

  doc.save(`HomeInterior_Estimate_${new Date().toISOString().split('T')[0]}.pdf`);
}
