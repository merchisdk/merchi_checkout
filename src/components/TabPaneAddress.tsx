'use client';
import FooterButtons from './FooterButtons';
import TabPane from './TabPane';
import TitleStep from './TitleStep';
import { FormAddresses } from './forms';
import { tabIdShipment } from './tabs_utils';
import { useMerchiCheckboutContext } from './MerchiCheckoutProvider';

function TabPaneAddress() {
  const { job } = useMerchiCheckboutContext();
  const formId = 'addresses-form-id';
  return (
    <TabPane tabId={tabIdShipment}>
      <TitleStep title='Address Delivery / Billing' />
      <FormAddresses formId={formId} />
      <FooterButtons forceDisabled={!job.shipment || false} formId={formId} />
    </TabPane>
  );
}

export default TabPaneAddress;
