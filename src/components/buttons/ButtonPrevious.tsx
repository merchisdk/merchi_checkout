'use client';
import React from 'react';
import { useMerchiCheckboutContext } from '../MerchiCheckoutProvider';
import { FaArrowLeft } from 'react-icons/fa';

interface Props {
  buttonText?: string;
  onClick?: () => void;
}

function ButtonPrevious({ buttonText = 'Back', onClick }: Props) {
  const {
    activeTabIndex,
    classNameMerchiCheckoutButtonPrimary,
    setActiveTabIndex,
    toggleMerchiCheckout,
  } = useMerchiCheckboutContext();
  return (
    <button
      className={classNameMerchiCheckoutButtonPrimary + ' btn-lg'}
      onClick={
        onClick
          ? onClick
          : () => {
              if (activeTabIndex) {
                setActiveTabIndex((activeTabIndex || 0) - 1);
              } else {
                toggleMerchiCheckout();
              }
            }
      }
    >
      <FaArrowLeft fontSize='1.1rem' />
      <span style={{ marginLeft: '0.5rem' }}>{buttonText}</span>
    </button>
  );
}

export default ButtonPrevious;
