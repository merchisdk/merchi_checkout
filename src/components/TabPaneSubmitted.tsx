'use client';
import Cookies from 'js-cookie';
import { useMerchiCheckboutContext } from './MerchiCheckoutProvider';
import { tabIdComplete } from './tabs_utils';
import TitleStep from './TitleStep';
import TabPane from './TabPane';
import InvoiceInfo from './InvoiceInfo';

function TabPaneSubmitted() {
  const {
    classNameMerchiCheckoutButtonPrimary,
    classNameMerchiCheckoutButtonPrimaryBlock,
    classNameMerchiCheckoutButtonSecondary,
    classNameMerchiCheckoutButtonSecondaryBlock,
    invoice,
    isBuyRequest,
    isProductEmbedForm,
    job,
    messageSuccessBuyRequest,
    messageSuccessQuoteRequest,
  } = useMerchiCheckboutContext();
  const activeSession = Cookies.get('session_token');
  const msg = isBuyRequest
    ? messageSuccessBuyRequest
    : messageSuccessQuoteRequest;
  return (
    <TabPane tabId={tabIdComplete}>
      <TitleStep
        title={`Thank You - ${isBuyRequest ? 'Received' : 'Submitted'}`}
      />
      {!!(isBuyRequest && invoice) && <InvoiceInfo />}
      <div className='d-flex justify-content-center'>
        <div className='w-100'>
          <div className='py-3'>
            <p>{msg}</p>
          </div>
          <div className='d-none d-sm-flex justify-content-between'>
            {isProductEmbedForm ? (
              <a
                className={classNameMerchiCheckoutButtonPrimary}
                href={`${window.location}`}
              >
                Done!
              </a>
            ) : (
              <>
                <a
                  className={classNameMerchiCheckoutButtonSecondary}
                  href='/customisable-merchandise'
                >
                  View More Merch
                </a>
                {!!(activeSession && job.id && !isBuyRequest) && (
                  <a
                    className={classNameMerchiCheckoutButtonPrimary}
                    href={`${process.env.NEXT_PUBLIC_FRONTEND_URL}jobs/${job.id}/`}
                  >
                    View Job
                  </a>
                )}
              </>
            )}
          </div>
          <div className='d-sm-none'>
            {isProductEmbedForm ? (
              <a
                className={classNameMerchiCheckoutButtonPrimaryBlock}
                href={`${window.location}`}
              >
                Done!
              </a>
            ) : (
              <>
                <a
                  className={classNameMerchiCheckoutButtonPrimaryBlock}
                  href='/customisable-merchandise'
                >
                  View More Merch
                </a>
                {!!(activeSession && job.id && !isBuyRequest) && (
                  <a
                    className={classNameMerchiCheckoutButtonSecondaryBlock}
                    href={`${process.env.NEXT_PUBLIC_FRONTEND_URL}jobs/${job.id}/`}
                  >
                    View Job
                  </a>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </TabPane>
  );
}

export default TabPaneSubmitted;
