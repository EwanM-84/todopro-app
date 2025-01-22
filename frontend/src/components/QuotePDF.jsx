import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 12,
  },
  header: {
    backgroundColor: '#DAA520',
    padding: 20,
    marginBottom: 20,
    borderRadius: 5,
  },
  headerContent: {
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 4,
  },
  headerText: {
    color: '#DAA520',
    textAlign: 'center',
    marginBottom: 5,
  },
  companyName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  tagline: {
    fontSize: 16,
    marginBottom: 10,
  },
  section: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#DAA520',
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  label: {
    width: '30%',
    color: '#DAA520',
    fontWeight: 'bold',
  },
  value: {
    flex: 1,
  },
  table: {
    marginTop: 10,
    marginBottom: 20,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#DAA520',
    padding: 8,
    color: 'white',
    fontWeight: 'bold',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#DAA520',
    padding: 8,
  },
  col1: { width: '40%' },
  col2: { width: '20%', textAlign: 'center' },
  col3: { width: '20%', textAlign: 'right' },
  col4: { width: '20%', textAlign: 'right' },
  financialSummary: {
    marginTop: 10,
    padding: 15,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DAA520',
    borderRadius: 4,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    color: '#DAA520',
    fontWeight: 'bold',
  },
  summaryValue: {
    textAlign: 'right',
    minWidth: '100px',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#DAA520',
  },
  totalLabel: {
    color: '#DAA520',
    fontWeight: 'bold',
    fontSize: 14,
  },
  totalValue: {
    color: '#DAA520',
    fontWeight: 'bold',
    fontSize: 14,
    textAlign: 'right',
    minWidth: '100px',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
    textAlign: 'center',
    color: '#666',
    fontSize: 10,
  },
  clientInfo: {
    fontSize: 12,
  },
  termsSection: {
    marginTop: 30,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#DAA520',
  },
  termsTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#DAA520',
    marginBottom: 10,
  },
  termsText: {
    fontSize: 10,
    color: '#444',
    marginBottom: 15,
    textAlign: 'justify',
  },
  termsList: {
    fontSize: 10,
    color: '#444',
    marginBottom: 5,
  },
});

const QuotePDF = ({ quote }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={[styles.headerText, styles.companyName]}>TODOPRO CANARIAS S.L</Text>
          <Text style={[styles.headerText, styles.tagline]}>Reliable Solutions for Construction Needs</Text>
          <Text style={styles.headerText}>Carretera General 10, La Camella</Text>
          <Text style={styles.headerText}>Arona, Santa Cruz de Tenerife 38627</Text>
          <Text style={styles.headerText}>Tel: +34 604 98 00 12 | Email: hola@todopro.es</Text>
          <Text style={styles.headerText}>Company S.L: B44751410</Text>
        </View>
      </View>

      {/* Client Information */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Client Information</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Name:</Text>
          <Text style={styles.value}>{quote.clientInfo?.name || 'N/A'}</Text>
        </View>
        {quote.clientInfo?.phone && (
          <View style={styles.row}>
            <Text style={styles.label}>Phone:</Text>
            <Text style={styles.value}>{quote.clientInfo.phone}</Text>
          </View>
        )}
        {quote.clientInfo?.email && (
          <View style={styles.row}>
            <Text style={styles.label}>Email:</Text>
            <Text style={styles.value}>{quote.clientInfo.email}</Text>
          </View>
        )}
        <View style={styles.row}>
          <Text style={styles.label}>Estimated Work Duration:</Text>
          <Text style={styles.value}>{quote.days} {quote.days > 1 ? 'days' : 'day'}</Text>
        </View>
      </View>

      {/* Equipment Details */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Pricing</Text>
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={styles.col1}>Product</Text>
            <Text style={styles.col2}>Meters</Text>
            <Text style={styles.col3}>Rate</Text>
            <Text style={styles.col4}>Total</Text>
          </View>
          {quote.selectedProducts?.map((product, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={styles.col1}>{product.name}</Text>
              <Text style={styles.col2}>{product.quantity}</Text>
              <Text style={styles.col3}>€{product.price.toFixed(2)}</Text>
              <Text style={styles.col4}>€{(product.price * product.quantity).toFixed(2)}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Notes */}
      {quote.notes && (
        <View style={[styles.section, { marginTop: 20 }]}>
          <Text style={styles.sectionTitle}>Notes</Text>
          <Text style={styles.clientInfo}>{quote.notes}</Text>
        </View>
      )}

      {/* Terms and Conditions */}
      <View style={styles.termsSection}>
        <Text style={styles.termsTitle}>GARANTÍA DE SERVICIOS Y PRODUCTOS</Text>
        <Text style={styles.termsText}>
          TODOPRO CANARIAS S.L. ofrece al Cliente una garantía integral de mano de obra por un periodo de dos años. Cada producto que instalamos cuenta con un periodo de garantía individual de hasta 30 años. Se proporcionará una certificación individual para cada producto al finalizar los trabajos, de acuerdo con las especificaciones del fabricante.
        </Text>

        <Text style={styles.termsTitle}>CONDICIONES DE PAGO</Text>
        <Text style={styles.termsList}>• 50% del importe total al inicio de los trabajos</Text>
        <Text style={styles.termsList}>• 50% restante a la finalización de los trabajos</Text>

        <Text style={styles.termsTitle}>VALIDEZ DE LA OFERTA</Text>
        <Text style={styles.termsText}>Esta oferta tiene una validez de 30 días naturales desde la fecha de emisión.</Text>

        <Text style={styles.termsTitle}>ACEPTACIÓN</Text>
        <Text style={styles.termsText}>
          La aceptación de este presupuesto implica la conformidad con todas las condiciones especificadas en el mismo. Para formalizar la aceptación, se requiere la firma del cliente y el pago inicial según las condiciones establecidas.
        </Text>
      </View>

      {/* Financial Summary */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Financial Summary</Text>
        <View style={styles.financialSummary}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal:</Text>
            <Text style={styles.summaryValue}>€{quote.subtotal?.toFixed(2) || '0.00'}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>VAT (7%):</Text>
            <Text style={styles.summaryValue}>€{(quote.subtotal * 0.07).toFixed(2) || '0.00'}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total:</Text>
            <Text style={styles.totalValue}>€{quote.finalTotal?.toFixed(2) || '0.00'}</Text>
          </View>
          <View style={[styles.summaryRow, { marginTop: 15, borderTopWidth: 1, borderTopColor: '#DAA520', paddingTop: 10 }]}>
            <Text style={[styles.summaryLabel, { fontSize: 13 }]}>Required Deposit (50%):</Text>
            <Text style={[styles.summaryValue, { fontSize: 13 }]}>€{(quote.finalTotal * 0.5).toFixed(2) || '0.00'}</Text>
          </View>
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text>Thank you for choosing TODOPRO CANARIAS S.L</Text>
        <Text>For any questions, please contact us at: Tel: +34 604 98 00 12 | Email: hola@todopro.es</Text>
      </View>
    </Page>
  </Document>
);

export default QuotePDF;
