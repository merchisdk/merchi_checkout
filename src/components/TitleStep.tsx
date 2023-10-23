'use client';
import { useMerchiCheckboutContext } from './MerchiCheckoutProvider';

interface Props {
  title: string;
}

function TitleStep({ title }: Props) {
  const { activeTabIndex, tabs } = useMerchiCheckboutContext();
  return (
    <div className='modal_merchi-checkout_steps-heading'>
      <small className='text-muted'>
        Step {activeTabIndex + 1}/{tabs.length}
      </small>
      <h5 className='pb-0 mb-0 checkout-step-heading'>{title}</h5>
    </div>
  );
}

export default TitleStep;
