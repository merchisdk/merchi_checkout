import * as React from 'react';
import { currencyMap } from '../currency';

interface Props {
  btnText?: string;
  className?: string;
  invoice: any;
  loading: boolean;
}

export function ButtonPayInvoice(
  {
    btnText,
    className,
    invoice,
    loading,
  }: Props) {
  return (
    <>
      <button
        className={className}
        disabled={loading}
        type='submit'
      >
        {loading ?
            <span>Loading...</span>
          : btnText ?
            btnText
          :
            <>
              <span>Pay {currencyMap[invoice.currency]}
              {invoice.totalCost}<small> / inc tax</small></span>
            </>
        }
      </button>
    </>
  );
}

export default ButtonPayInvoice;
