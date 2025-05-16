'use client';
import React from 'react';
import { useMerchiCheckboutContext } from './MerchiCheckoutProvider';

interface Props {
  title: string;
}

function TitleStep({ title }: Props) {
  const { 
    activeTabIndex, 
    tabs,
    classNameMerchiCheckoutSubtitle
  } = useMerchiCheckboutContext();
  return (
    <div className='modal-merchi-checkout_steps-heading'>
      <small className='text-muted'>
        Step {activeTabIndex + 1}/{tabs.length}
      </small>
      <h5 className={`pb-0 mb-0 ${classNameMerchiCheckoutSubtitle}`}>{title}</h5>
    </div>
  );
}

export default TitleStep;
