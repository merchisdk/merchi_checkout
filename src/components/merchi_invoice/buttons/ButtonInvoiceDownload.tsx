'use client';
import { generatePublicInvoicePdf } from '../actions/invoice';
import { useState } from 'react';
import { CgSpinner } from 'react-icons/cg';
import { FaFileInvoiceDollar } from 'react-icons/fa';

interface Props {
  alertErrorShow: (message: string) => void;
  classNameMerchiInvoiceButtonDownloadInvoice?: string;
  invoice: any;
}

function ButtonInvoiceDownload({
  alertErrorShow,
  classNameMerchiInvoiceButtonDownloadInvoice,
  invoice,
}: Props) {
  const { unpaid } = invoice;
  const [loading, setLoading] = useState(false);
  // const icon = loading ? faCircleNotch : faFileInvoiceDollar;
  async function generateInvoice(receipt?: boolean) {
    setLoading(true);
    try {
      await generatePublicInvoicePdf(invoice, receipt);
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
          className={
            classNameMerchiInvoiceButtonDownloadInvoice + ' btn btn-lg'
          }
          disabled={loading}
          onClick={() => generateInvoice(false)}
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
          className={
            classNameMerchiInvoiceButtonDownloadInvoice + ' btn btn-lg'
          }
          disabled={loading}
          onClick={() => generateInvoice(true)}
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
