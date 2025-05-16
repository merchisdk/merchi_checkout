'use client';
import React from 'react';
import Cookies from 'js-cookie';
import { useMerchiCheckboutContext } from './MerchiCheckoutProvider';
import { tabIdComplete } from '../tabs_utils';
import FooterButtons from './FooterButtons';
import TitleStep from './TitleStep';
import TabPane from './TabPane';

function TabPaneNewDomain() {
  const { domain, setDomain } = useMerchiCheckboutContext();
  const activeSession = Cookies.get('session_token');
  return (
    <TabPane tabId={tabIdComplete}>
      <TitleStep title='Store - Domain Name' />
      <div className='w-100'>
        <div className='my-4'>
          {domain
            ? <p>
                {`Congratulations! ${domain.domain} has been successfuly created and is ready for you to start selling!`}
              </p>
            : <p>
                Create your free <a href='/pricing'>Merchi Seller Store</a> where you can sell your customised products
                once {`they're`} ready.
              </p>
          }
        </div>
        <div className='create-new-domain-form-container'>

        </div>
      </div>
      <FooterButtons />
    </TabPane>
  );
}

export default TabPaneNewDomain;
