import React from 'react';
import { Page, Text, View, Document, StyleSheet, Font, Image } from '@react-pdf/renderer';

// Register custom fonts if needed
Font.register({
  family: 'Brush Script MT',
  src: 'https://db.onlinewebfonts.com/t/33bc06ea126d3ff79886277122f1f510.ttf',
});

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 12,
  },
  header: {
    marginBottom: 20,
    borderBottom: '1 solid #DAA520',
    paddingBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#DAA520',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
  },
  section: {
    marginTop: 20,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#DAA520',
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  label: {
    width: '30%',
    color: '#DAA520',
    fontWeight: 'medium',
  },
  value: {
    width: '70%',
    color: '#333',
  },
  table: {
    marginTop: 10,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#DAA520',
    padding: 8,
    color: 'white',
    fontWeight: 'medium',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottom: '1 solid #eee',
    padding: 8,
  },
  col1: { width: '40%' },
  col2: { width: '20%', textAlign: 'center' },
  col3: { width: '20%', textAlign: 'right' },
  col4: { width: '20%', textAlign: 'right' },
  summary: {
    marginTop: 20,
    backgroundColor: '#f9f9f9',
    padding: 10,
    borderRadius: 4,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
    paddingTop: 5,
    borderTop: '1 solid #DAA520',
    fontWeight: 'bold',
    color: '#DAA520',
  },
  signatureSection: {
    marginTop: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  signature: {
    width: '45%',
    alignItems: 'center',
  },
  signatureLine: {
    width: '100%',
    borderBottom: '1 solid #DAA520',
    marginTop: 60,
    marginBottom: 5,
  },
  terms: {
    marginTop: 40,
    fontSize: 10,
    color: '#666',
  },
  termsTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#DAA520',
    marginBottom: 10,
  },
  termsSection: {
    marginBottom: 15,
  },
  termsSectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#DAA520',
    marginBottom: 5,
  },
  brushScript: {
    fontFamily: 'Brush Script MT',
    fontSize: 24,
    color: '#DAA520',
    transform: 'rotate(-6deg)',
  },
});

const ContractPDF = ({ quote }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>CONTRACT</Text>
        <Text style={styles.subtitle}>Generated on {new Date().toLocaleDateString('en-GB')}</Text>
      </View>

      {/* Client Information */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Client Information</Text>
        <View style={[styles.row, { backgroundColor: '#DAA520', opacity: 0.1, padding: 10, borderRadius: 4 }]}>
          <View style={{ width: '50%' }}>
            <View style={styles.row}>
              <Text style={styles.label}>Name:</Text>
              <Text style={styles.value}>{quote.clientInfo?.name || 'N/A'}</Text>
            </View>
            {quote.clientInfo?.address && (
              <View style={styles.row}>
                <Text style={styles.label}>Address:</Text>
                <Text style={styles.value}>{quote.clientInfo.address}</Text>
              </View>
            )}
            {quote.clientInfo?.phone && (
              <View style={styles.row}>
                <Text style={styles.label}>Phone:</Text>
                <Text style={styles.value}>{quote.clientInfo.phone}</Text>
              </View>
            )}
          </View>
          <View style={{ width: '50%' }}>
            {quote.clientInfo?.email && (
              <View style={styles.row}>
                <Text style={styles.label}>Email:</Text>
                <Text style={styles.value}>{quote.clientInfo.email}</Text>
              </View>
            )}
            {quote.clientInfo?.dieNie && (
              <View style={styles.row}>
                <Text style={styles.label}>DIE/NIE:</Text>
                <Text style={styles.value}>{quote.clientInfo.dieNie}</Text>
              </View>
            )}
            <View style={styles.row}>
              <Text style={styles.label}>Duration:</Text>
              <Text style={styles.value}>{quote.days} {quote.days > 1 ? 'days' : 'day'}</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Products */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Products Selected</Text>
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={styles.col1}>Product</Text>
            <Text style={styles.col2}>Meters</Text>
            <Text style={styles.col3}>Price</Text>
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

      {/* Financial Summary */}
      <View style={styles.summary}>
        <Text style={styles.sectionTitle}>Summary</Text>
        <View style={styles.summaryRow}>
          <Text>Subtotal</Text>
          <Text>€{quote.subtotal?.toFixed(2) || '0.00'}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text>VAT (7%)</Text>
          <Text>€{quote.vat?.toFixed(2) || '0.00'}</Text>
        </View>
        <View style={styles.totalRow}>
          <Text>Total</Text>
          <Text>€{quote.finalTotal?.toFixed(2) || '0.00'}</Text>
        </View>
        <View style={[styles.summaryRow, { marginTop: 10 }]}>
          <Text>Required Deposit (50%)</Text>
          <Text>€{(quote.finalTotal * 0.5)?.toFixed(2) || '0.00'}</Text>
        </View>
      </View>

      {/* Signature Section */}
      <View style={styles.signatureSection}>
        <View style={styles.signature}>
          <Text>Cliente:</Text>
          <View style={styles.signatureLine} />
          <Text>{quote.clientInfo?.name || ''}</Text>
        </View>
        <View style={styles.signature}>
          <Text>Todopro:</Text>
          <Text style={styles.brushScript}>Emmanuel Lara</Text>
          <View style={styles.signatureLine} />
          <Text>Emmanuel Lara</Text>
        </View>
      </View>

      {/* Terms and Conditions */}
      <View style={styles.terms}>
        <Text style={styles.termsTitle}>CONDICIONES GENERALES DE LA CONTRATACIÓN</Text>
        
        <View style={styles.termsSection}>
          <Text style={styles.termsSectionTitle}>I.- APLICABILIDAD DE LAS CONDICIONES GENERALES</Text>
          <Text>ALCANCE. Las presentes Condiciones Generales de Contratación (en adelante las (CCGG) regirán las relaciones contractuales de TODOPRO CANARIAS S.L. (en adelante el Prestador) con sus clientes...</Text>
        </View>

        <View style={styles.termsSection}>
          <Text style={styles.termsSectionTitle}>II.- MODIFICACIONES O AMPLIACIONES DEL OBJETO DEL CONTRATO</Text>
          <Text>Si durante la vigencia del presente Contrato, el Cliente y/o el Prestador del Servicio consideraran oportuno modificar y/o ampliar la prestación del Servicio...</Text>
        </View>

        <View style={styles.termsSection}>
          <Text style={styles.termsSectionTitle}>III.- FORMA DE LA PRESTACIÓN DEL SERVICIO</Text>
          <Text>La prestación del Servicio se realizará por el Prestador atendiendo a las directrices del Cliente, tal y como quedará plasmado en la hoja de pedido.</Text>
        </View>

        <View style={styles.termsSection}>
          <Text style={styles.termsSectionTitle}>IV.- OBLIGACIONES DEL PRESTADOR</Text>
          <Text>El PRESTADOR se compromete a realizar la prestación del Servicio de forma diligente y conforme a los usos y costumbres profesionales propios del sector de su actividad...</Text>
        </View>

        <View style={styles.termsSection}>
          <Text style={styles.termsSectionTitle}>V.-OBLIGACIONES DEL CLIENTE</Text>
          <Text>El Cliente se compromete a informar o hacer entrega al Prestador de toda la información útil y/o relevante para la correcta ejecución de la prestación del Servicio...</Text>
        </View>
      </View>
    </Page>
  </Document>
);

export default ContractPDF;
