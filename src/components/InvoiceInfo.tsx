'use client';
import { useMerchiCheckboutContext } from './MerchiCheckoutProvider';
import ButtonInvoiceDownload from './buttons/ButtonInvoiceDownload';

function InvoiceInfo() {
  const { invoice } = useMerchiCheckboutContext();
  const { id, unpaid } = invoice;
  const paid = !unpaid;
  return (
    <div className='w-100 d-flex flex-column align-items-center pt-3'>
      <h5 className='container-invoice-heading mb-0'>Invoice #{id}</h5>
      {paid && (
        <>
          <p className='mt-0 mb-0'>Paid, thank you!</p>
        </>
      )}
      <p className='mt-2 mb-2'>Download your {paid ? 'receipt' : 'invoice'}.</p>
      <div className='d-block mt-1'>
        <ButtonInvoiceDownload />
      </div>
    </div>
  );
}

export default InvoiceInfo;
