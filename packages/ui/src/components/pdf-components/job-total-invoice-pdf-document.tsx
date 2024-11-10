'use client'

import { Document, Image, Link, Page, StyleSheet, Text, View } from '@react-pdf/renderer';
import { format } from 'date-fns';
import React from 'react';
import { createTw } from "react-pdf-tailwind";
import { ColorFullPDFIcon } from '../../icons/colorfull-pdf-icons';
import { calculateInvoiceSummary } from '../../lib/jobUtils';
import { Org } from '../../models/orgModels';
import { PaymentStatus } from '../../models/stripeModels';
import { DeliveryJobTotal } from '../../models/totalModels';

const tw = createTw({});

const styles = StyleSheet.create({
  page: tw("p-12 bg-white"),
  header: tw("flex flex-row items-center justify-between mb-6"),
  logo: tw("w-24 h-24"),
  documentTitle: tw("text-2xl font-bold text-gray-800"),
  sectionTitle: tw("text-lg font-semibold text-gray-700 mt-4 mb-2"),
  divider: tw("border-b-2 border-gray-300 border-solid my-4"),
  text: tw("text-sm text-gray-800"),
  totalList: tw("grow"),
  summaryItem: tw("flex flex-row justify-between p-2 text-sm border-t border-gray-300"),
  summaryLabel: tw("text-gray-700 text-sm"),
  summaryValue: tw("text-gray-900 font-semibold"),
  detailSection: tw("mt-6"),
  detailItem: tw("p-2"),
  detailLabel: tw("font-bold"),
  detailValue: tw("ml-2"),
  footer: tw("flex justify-between items-center text-gray-600 mt-10 p-4"),
  footerText: tw("text-sm"),
  grandTotal: tw("text-lg font-bold"),
  rowBorder: tw("border-t border-gray-300"),
  headerInfo: tw("text-xs text-gray-600"),
  tableHeader: tw("flex flex-row justify-between text-gray-700 bg-gray-100 p-2"),
  tableCellHeader: tw("flex-1 text-center font-bold text-sm"),
  tableRow: tw("flex flex-row justify-between p-2"),
  tableCell: tw("flex-1 text-center text-sm"),
  summarySection: tw("mt-4"),
  boldText: tw("font-bold"),
  linkStyle: tw("text-blue-600 underline text-sm"),
  customFooter: tw("flex flex-row justify-around items-center"),
  customFooterText: tw("text-sm text-gray-500"),
  additionalInfoSection: tw("mt-4"),
  additionalInfoText: tw("text-sm text-gray-700"),
  bold: tw("text-gray-900 font-bold"),
});

interface JobTotalInvoicePDFProps {
  jobTotals: DeliveryJobTotal[];
  org?: Org;
}

export const JobTotalInvoicePDFDocument: React.FC<JobTotalInvoicePDFProps> = ({ jobTotals, org }) => {
  const currentDateFormatted = format(new Date(), 'MM/dd/yyyy');

  // Inside your component or function where you need these values
  const {
    taxRate,
    sumDeliveryFeesTotal,
    subsidyTotal,
    sumOfDeliveryFeeTaxes,
    sumOfUnder50Overages
  } = calculateInvoiceSummary(jobTotals ?? []);

  const subsidyForOrgIncludingUnder50Overages = subsidyTotal + sumOfUnder50Overages;
  const total = sumDeliveryFeesTotal + sumOfDeliveryFeeTaxes + subsidyForOrgIncludingUnder50Overages;
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          {org?.brand_image_url && <Image src={org.brand_image_url} style={styles.logo} />}
          <Text style={styles.documentTitle}>{org?.name} Invoice</Text>
          <ColorFullPDFIcon />
        </View>
        <Text style={styles.text}>Date: {currentDateFormatted}</Text>
        <View style={styles.divider} />

        <Text style={styles.sectionTitle}>Job Totals</Text>
        <View style={styles.tableHeader}>
          <Text style={styles.tableCellHeader}>Date</Text>
          <Text style={styles.tableCellHeader}>Orders</Text>
          <Text style={styles.tableCellHeader}>Delivery Fee</Text>
          <Text style={styles.tableCellHeader}>Order Subsidy Amount</Text>
          <Text style={styles.tableCellHeader}>Payment Status</Text>
        </View>
        {jobTotals.map((jobTotal, index) => (
          <View key={index} style={styles.tableRow}>
            <Text style={styles.tableCell}>{format(new Date(jobTotal?.created_at ?? ''), 'MM/dd/yyyy')}</Text>
            <Text style={styles.tableCell}>{jobTotal.num_orders}</Text>
            <Text style={styles.tableCell}>
              ${(Number(jobTotal?.delivery_fee?.toFixed(2) ?? 0) + Number(jobTotal?.delivery_fee?.toFixed(2) ?? 0) * (taxRate / 100)).toFixed(2)}
            </Text>
              <Text style={styles.tableCell}>
              ${((Number(jobTotal?.subsidy_total ?? 0) + Number(jobTotal.sum_under_50_overages))).toFixed(2)}
            </Text>
            <Text style={[styles.tableCell, { color: getStatusColor(jobTotal.payment_status) }]}>
              {jobTotal.payment_status}
            </Text>
          </View>
        ))}

        <View style={styles.divider} />
        <Text style={styles.sectionTitle}>Summary</Text>
        <View style={styles.summarySection}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Subsidy Total:</Text>
            <Text style={styles.summaryValue}>${subsidyForOrgIncludingUnder50Overages.toFixed(2)}</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Delivery Fees Total:</Text>
            <Text style={styles.summaryValue}>${(sumDeliveryFeesTotal + sumOfDeliveryFeeTaxes).toFixed(2)}</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Tax Rate:</Text>
            <Text style={styles.summaryValue}>{taxRate}%</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={[styles.summaryLabel, styles.bold]}>Grand Total:</Text>
            <Text style={[styles.summaryValue, styles.bold]}>${total?.toFixed(2) ?? 0}</Text>
          </View>
        </View>

        {/* Additional Information Section */}
        <View style={styles.additionalInfoSection}>
          <Text style={styles.sectionTitle}>Additional Information</Text>
          <Text style={styles.additionalInfoText}>
            For more details about your transactions or services, please visit our website or contact our support team.
          </Text>
          <Link src="https://www.colorfull.ai" style={styles.linkStyle}>
            www.colorfull.ai
          </Link>
        </View>

        {/* Custom Footer */}
        <View style={[styles.footer, styles.customFooter]}>
          <Text style={styles.customFooterText}>Colorfull Inc. All rights reserved.</Text>
          <Text style={styles.customFooterText}>Contact Us: help@colorfull.ai</Text>
        </View>
      </Page>
    </Document>
  );
};

function getStatusColor(status?: PaymentStatus) {
  switch (status) {
    case PaymentStatus.PAID:
      return 'green';
    case PaymentStatus.UNPAID:
      return 'red';
    case PaymentStatus.FAILED:
      return 'orange';
    default:
      return 'gray'; // Default color for undefined or other statuses
  }
}