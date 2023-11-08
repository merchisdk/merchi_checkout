'use client';
import { useMerchiCheckboutContext } from '../MerchiCheckoutProvider';
import { FaArrowLeft } from 'react-icons/fa';

interface Props {
  buttonText?: string;
  onClick?: () => void;
}

function ButtonPrevious({ buttonText = '', onClick }: Props) {
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
      {buttonText}
      <FaArrowLeft fontSize='1.1rem' />
    </button>
  );
}

export default ButtonPrevious;
