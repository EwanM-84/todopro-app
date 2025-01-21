import React from 'react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import ContractPDF from './ContractPDF';

const ContractPreview = ({ quote, onClose }) => {
  if (!quote) return null;

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-start border-b border-[#DAA520] pb-4">
        <div>
          <h2 className="text-2xl font-bold text-[#DAA520]">CONTRACT</h2>
          <p className="text-gray-600 mt-1">Generated on {new Date().toLocaleDateString('en-GB')}</p>
        </div>
        <div className="flex items-center space-x-4">
          <PDFDownloadLink
            document={<ContractPDF quote={quote} />}
            fileName={`contract-${quote.id}.pdf`}
            className="text-[#DAA520] hover:text-[#B8860B] transition-colors"
          >
            {({ blob, url, loading, error }) =>
              loading ? 'Generating PDF...' : 'Download Contract'
            }
          </PDFDownloadLink>
          <button
            onClick={onClose}
            className="text-[#DAA520] hover:text-[#B8860B] transition-colors text-2xl"
          >
            ×
          </button>
        </div>
      </div>

      {/* Client Information */}
      <div className="bg-gradient-to-r from-[#DAA520]/10 to-transparent p-4 rounded-lg mt-6">
        <h3 className="text-xl font-bold text-[#DAA520] mb-3">Client Information</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-[#DAA520] font-medium">Name</p>
            <p className="text-gray-800">{quote.clientInfo?.name || 'N/A'}</p>
          </div>
          {quote.clientInfo?.address && (
            <div>
              <p className="text-[#DAA520] font-medium">Address</p>
              <p className="text-gray-800">{quote.clientInfo.address}</p>
            </div>
          )}
          {quote.clientInfo?.phone && (
            <div>
              <p className="text-[#DAA520] font-medium">Phone</p>
              <p className="text-gray-800">{quote.clientInfo.phone}</p>
            </div>
          )}
          {quote.clientInfo?.email && (
            <div>
              <p className="text-[#DAA520] font-medium">Email</p>
              <p className="text-gray-800">{quote.clientInfo.email}</p>
            </div>
          )}
          {quote.clientInfo?.dieNie && (
            <div>
              <p className="text-[#DAA520] font-medium">DIE/NIE</p>
              <p className="text-gray-800">{quote.clientInfo.dieNie}</p>
            </div>
          )}
          <div>
            <p className="text-[#DAA520] font-medium">Rental Period</p>
            <p className="text-gray-800">{quote.days} {quote.days > 1 ? 'days' : 'day'}</p>
          </div>
        </div>
      </div>

      {/* Products */}
      <div className="mt-6">
        <h3 className="text-xl font-bold text-[#DAA520] mb-4">Products Selected</h3>
        <div className="overflow-hidden rounded-lg border border-[#DAA520]">
          {/* Header */}
          <div className="bg-[#DAA520] text-white grid grid-cols-4 gap-4 px-4 py-2 font-medium">
            <div>Product</div>
            <div className="text-center">Meters</div>
            <div className="text-right">Price</div>
            <div className="text-right">Total</div>
          </div>
          {/* Products List */}
          <div className="divide-y divide-[#DAA520]/20">
            {quote.selectedProducts?.map((product, index) => (
              <div 
                key={index}
                className="grid grid-cols-4 gap-4 px-4 py-3 hover:bg-[#DAA520]/5 transition-colors"
              >
                <div className="font-medium text-gray-800">{product.name}</div>
                <div className="text-center text-gray-600">{product.quantity}</div>
                <div className="text-right text-gray-600">€{product.price.toFixed(2)}</div>
                <div className="text-right font-medium text-[#DAA520]">
                  €{(product.price * product.quantity).toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Financial Summary */}
      <div className="bg-gradient-to-r from-[#DAA520]/10 to-transparent p-4 rounded-lg mt-6">
        <h3 className="text-xl font-bold text-[#DAA520] mb-3">Summary</h3>
        <div className="space-y-2">
          <div className="flex justify-between text-gray-600">
            <span>Subtotal</span>
            <span>€{quote.subtotal?.toFixed(2) || '0.00'}</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>VAT (7%)</span>
            <span>€{quote.vat?.toFixed(2) || '0.00'}</span>
          </div>
          <div className="flex justify-between text-xl font-bold">
            <span className="text-[#DAA520]">Total</span>
            <span className="text-[#DAA520]">€{quote.finalTotal?.toFixed(2) || '0.00'}</span>
          </div>
          <div className="flex justify-between text-gray-600 pt-2 border-t border-[#DAA520]/20">
            <span>Required Deposit (50%)</span>
            <span>€{(quote.finalTotal * 0.5)?.toFixed(2) || '0.00'}</span>
          </div>
        </div>
      </div>

      {/* Signature Section */}
      <div className="mt-8 p-6 bg-gradient-to-r from-[#DAA520]/10 to-transparent rounded-lg">
        <div className="grid grid-cols-2 gap-20 px-20">
          <div className="text-center">
            <p className="text-lg font-semibold mb-2">Cliente:</p>
            <div className="h-24"></div>
            <div className="border-b-2 border-[#DAA520]"></div>
            <p className="mt-2 text-gray-700">{quote.clientInfo?.name || ''}</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-semibold mb-2">Todopro:</p>
            <div className="h-24 flex items-center justify-center">
              <p style={{ fontFamily: 'Brush Script MT, cursive' }} className="text-5xl text-[#DAA520] transform -rotate-6">Emmanuel Lara</p>
            </div>
            <div className="border-b-2 border-[#DAA520]"></div>
            <p className="mt-2 text-gray-700">Emmanuel Lara</p>
          </div>
        </div>
      </div>

      {/* Terms and Conditions */}
      <div className="mt-8 p-6 bg-gradient-to-r from-[#DAA520]/10 to-transparent rounded-lg">
        <h2 className="text-2xl font-bold text-[#DAA520] mb-6">CONDICIONES GENERALES DE LA CONTRATACIÓN</h2>
        
        <h3 className="text-lg font-bold text-[#DAA520] mb-3">I.- APLICABILIDAD DE LAS CONDICIONES GENERALES</h3>
        <p className="text-gray-700 mb-4 text-justify">
          ALCANCE. Las presentes Condiciones Generales de Contratación (en adelante las (CCGG) regirán las relaciones contractuales de TODOPRO CANARIAS S.L. (en adelante el Prestador) con sus clientes, derivadas de la venta o suministro de productos, ejecución de obras y/o reparaciones (en adelante Servicios), por los contratos que suscriban, o por pedidos que el Cliente le curse y que el Prestador acepte.
        </p>
        <p className="text-gray-700 mb-4 text-justify">
          Por trabajo/s se entenderán la/s venta/s o suministro/s de bienes o productos, así como la ejecución de obras o servicios que incluya suministro de materiales, como pueden ser la instalación, puesta en marca, mantenimiento o reparación de bienes o productos en general.
        </p>
        <p className="text-gray-700 mb-4 text-justify">
          Las CCGG serán parte integran de todos aquellos contratos o pedidos aceptados por el Prestador. El Cliente acepta, sin reserva alguna, la incorporación al contrato de las CCGG al formular el servicio/pedido, habiendo tenido oportunidad real de conocer de manera completa su contenido.
        </p>
        <p className="text-gray-700 mb-6 text-justify">
          Las condiciones contractuales establecidas a través del presente condicionado serán de obligatoria observancia para las partes intervinientes en todo aquello que no conste específicamente acordado en el pedido.
        </p>

        <h3 className="text-lg font-bold text-[#DAA520] mb-3">II.- MODIFICACIONES O AMPLIACIONES DEL OBJETO DEL CONTRATO</h3>
        <p className="text-gray-700 mb-4 text-justify">
          Si durante la vigencia del presente Contrato, el Cliente y/o el Prestador del Servicio consideraran oportuno modificar y/o ampliar la prestación del Servicio, ambas Partes deberán negociar el alcance de dichas modificaciones o ampliaciones, plasmándolo por escrito y quedando incorporados como anexos al presente Contrato.
        </p>
        <p className="text-gray-700 mb-6 text-justify">
          En el caso que ambas Partes no se pusieran de acuerdo sobre dichas modificaciones o ampliaciones, cualquiera de las Partes podrá resolver el presente Contrato.
        </p>

        <h3 className="text-lg font-bold text-[#DAA520] mb-3">III.- FORMA DE LA PRESTACIÓN DEL SERVICIO</h3>
        <p className="text-gray-700 mb-6 text-justify">
          La prestación del Servicio se realizará por el Prestador atendiendo a las directrices del Cliente, tal y como quedará plasmado en la hoja de pedido.
        </p>

        <h3 className="text-lg font-bold text-[#DAA520] mb-3">IV.- OBLIGACIONES DEL PRESTADOR</h3>
        <p className="text-gray-700 mb-4 text-justify">
          El PRESTADOR se compromete a realizar la prestación del Servicio de forma diligente y conforme a los usos y costumbres profesionales propios del sector de su actividad.
        </p>
        <p className="text-gray-700 mb-4 text-justify">
          Igualmente, el Prestador se compromete a realizar la prestación del Servicio dentro de las fechas y/o plazos e instrucciones acordados con el Cliente, quedando el plazo máximo para la finalización del contrato dentro de los SESENTA (60) días laborables desde que se abone el primer pago.
        </p>
        <p className="text-gray-700 mb-6 text-justify">
          El Prestador utilizará, para la realización o prestación del Servicio, los medios materiales adecuados y, en su caso, su propio personal o a quien designe a tal efecto y a su costa, quienes realizarán sus funciones utilizando los materiales más adecuados y, siguiendo las instrucciones emitidas por éste en consonancia con las obligaciones que sume por el presente Contrato frente al Cliente.
        </p>

        <h3 className="text-lg font-bold text-[#DAA520] mb-3">V.-OBLIGACIONES DEL CLIENTE</h3>
        <p className="text-gray-700 mb-4 text-justify">
          El Cliente se compromete a informar o hacer entrega al Prestador de toda la información útil y/o relevante para la correcta ejecución de la prestación del Servicio. Asimismo, el Cliente se compromete a colaborar con el Prestador durante la prestación del Servicio, no oponiendo impedimentos a la ejecución de los trabajos.
        </p>
        <p className="text-gray-700 mb-6 text-justify">
          El Cliente se obliga a pagar el precio tal y como resulta del presente Contrato.
        </p>

        <h3 className="text-lg font-bold text-[#DAA520] mb-3">VI.- PRECIO Y FORMA DE PAGO</h3>
        <p className="text-gray-700 mb-6 text-justify">
          El precio a pagar será el establecido en el Pedido. El Cliente satisfará el pago del CINCUENTA POR CIENTO (50%) a la firma del Contrato y CINUENTA POR CIENTO (50%) a la finalización de los trabajos, sin incluir los impuestos que pudieran derivar de esta operación.
        </p>

        <h3 className="text-lg font-bold text-[#DAA520] mb-3">VII.- INTERESES DE DEMORA</h3>
        <p className="text-gray-700 mb-4 text-justify">
          El retraso en el pago de la remuneración establecida en el Contrato dará lugar a un incremento del precio equivalente a los intereses de demora generados por el retraso en el pago. El tipo de interés de demora será igual al tipo de interés de referencia o refinanciación semestral del Banco Central Europeo en vigor a 1 de enero para el primer semestre del año correspondiente, y a 1 de julio para el segundo semestre del año correspondiente.
        </p>
        <p className="text-gray-700 mb-6 text-justify">
          Los intereses de demora serán exigibles automáticamente a partir de la fecha de pago fijada en la Estipulación anterior, sin necesidad alguna de aviso del vencimiento ni intimidación alguna por parte del Prestador. El devengo de dichos intereses no afectará al ejercicio de cualquier acción que pueda corresponderle al Prestador derivada del incumplimiento de pago.
        </p>

        <h3 className="text-lg font-bold text-[#DAA520] mb-3">VIII.- CAUSAS DE RESOLUCIÓN</h3>
        <p className="text-gray-700 mb-4 text-justify">
          Será causa de resolución del Contrato cuando el Prestador deje de prestar el Servicio o parte del mismo que forma parte del objeto de este Contrato, esto es, cuando no se desarrolle la actividad regularmente o con los medios materiales y personales adecuados o necesarios. Asimismo, se entenderá causa de resolución, cualquier impedimento que haga que el prestador no pueda acceder al lugar de trabajo.
        </p>
        <p className="text-gray-700 mb-4 text-justify">
          En caso de resolución unilateral del contrato por parte del Cliente sin causa justificada, éste deberá abonar el CIEN POR CIEN (100 %) del precio pactado, así como una posible indemnización por daños y perjuicios si ejercita su voluntad sin respetar el preaviso de UN MES aquí establecido.
        </p>
        <p className="text-gray-700 mb-6 text-justify">
          Cuando se resuelva el Contrato por voluntad del Prestador, éste deberá facilitar al Cliente todo documento, elemento, bien, material, y /o producción que hubiese podido resultar de su actividad de prestación del Servicio hasta ese momento.
        </p>

        <h3 className="text-lg font-bold text-[#DAA520] mb-3">IX.-DERECHO DE DESISTIMIENTO</h3>
        <p className="text-gray-700 mb-6 text-justify">
          Salvo las excepciones previstas en el artículo 103 de la Ley sobre Condiciones Generales de la Contratación, el consumidor y usuario tendrá derecho a desistir del contrato durante un periodo de 14 días naturales sin indicar el motivo y sin incurrir en ningún coste distinto de los previstos en los artículos 107.2 y 108 de la misma Ley.
        </p>

        <h3 className="text-lg font-bold text-[#DAA520] mb-3">X.- GARANTÍA DE LOS SERVICIOS Y PRODUCTOS</h3>
        <p className="text-gray-700 mb-6 text-justify">
          TODOPRO CANARIAS S.L. ofrece al Cliente una garantía limitada por un periodo de dos años por la ejecución de los trabajos contratados y finalizados, siendo la garantía de los productos aplicados PROPERLA la que corresponda a cada una de los productos.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-4 mt-6 pt-4 border-t border-[#DAA520]/20">
        <button
          onClick={onClose}
          className="px-6 py-2 border border-[#DAA520] text-[#DAA520] rounded-lg hover:bg-[#DAA520] hover:text-white transition-colors"
        >
          Back
        </button>
      </div>
    </div>
  );
};

export default ContractPreview;
