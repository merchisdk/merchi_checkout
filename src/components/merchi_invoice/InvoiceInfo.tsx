'use client';
import ButtonInvoiceDownload from './buttons/ButtonInvoiceDownload';

interface Props {
  alertErrorShow: (alert: any) => void;
  classNameMerchiInvoiceButtonDownloadInvoice: string;
  invoice: any;
}

function InvoiceInfo({
  alertErrorShow,
  classNameMerchiInvoiceButtonDownloadInvoice,
  invoice,
}: Props) {
  const { id, unpaid } = invoice;
  const paid = !unpaid;
  return (
    <div className='w-100 d-flex flex-column align-items-center'>
      <h5 className='container-invoice-heading mb-0'>Invoice #{id}</h5>
      {paid && (
        <>
          <p className='mt-0 mb-0'>Paid, thank you!</p>
        </>
      )}
      <p className='mt-2 mb-2'>Download your {paid ? 'receipt' : 'invoice'}.</p>
      <div className='d-block mt-1 mb-5'>
        <ButtonInvoiceDownload
          alertErrorShow={alertErrorShow}
          classNameMerchiInvoiceButtonDownloadInvoice={
            classNameMerchiInvoiceButtonDownloadInvoice
          }
          invoice={invoice}
        />
      </div>
    </div>
  );
}

export default InvoiceInfo;
