'use client';
import { useMerchiCheckboutContext } from '../MerchiCheckoutProvider';
import { generatePublicInvoicePdf } from '../../actions/invoice';
import { useState } from 'react';
import { CgSpinner } from 'react-icons/cg';
import { FaFileInvoiceDollar } from 'react-icons/fa';

function ButtonInvoiceDownload() {
  const {
    alertErrorShow,
    classNameMerchiCheckoutButtonDownloadInvoice,
    invoice = {},
    urlApi,
  } = useMerchiCheckboutContext();
  const { unpaid } = invoice;
  const [loading, setLoading] = useState(false);
  async function generate(receipt?: boolean) {
    setLoading(true);
    try {
      await generatePublicInvoicePdf((urlApi as string), invoice, receipt);
      setLoading(false);
    } catch (e: any) {
      alertErrorShow(e.message);
      setLoading(false);
    }
  }
  return (
    <>
      {unpaid ? (
        <button
          className={classNameMerchiCheckoutButtonDownloadInvoice}
          disabled={loading}
          onClick={() => generate(false)}
        >
          {loading ? (
            <CgSpinner fontSize='1.1rem' className='animate_spin mr-2' />
          ) : (
            <FaFileInvoiceDollar fontSize='1.1rem' className='mr-2' />
          )}
          Download Invoice
        </button>
      ) : (
        <button
          className={classNameMerchiCheckoutButtonDownloadInvoice}
          disabled={loading}
          onClick={() => generate(true)}
        >
          {loading ? (
            <CgSpinner fontSize='1.1rem' className='animate_spin mr-2' />
          ) : (
            <FaFileInvoiceDollar fontSize='1.1rem' className='mr-2' />
          )}
          Download Receipt
        </button>
      )}
    </>
  );
}

export default ButtonInvoiceDownload;
