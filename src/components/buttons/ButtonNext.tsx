'use client';
import { useMerchiCheckboutContext } from '../MerchiCheckoutProvider';
import { CgSpinner } from 'react-icons/cg';
import { FaArrowRight } from 'react-icons/fa';

interface Props {
  formId?: string;
  forceDisabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
}

function ButtonNext({ formId, forceDisabled, loading, onClick }: Props) {
  const {
    activeTabIndex,
    classNameMerchiCheckoutButtonPrimary,
    nextTab: next,
    tabs,
  } = useMerchiCheckboutContext();

  const nextTab = tabs[(activeTabIndex || 0) + 1];

  const handleButtonClick = onClick ? onClick : next;
  let disabled = nextTab && nextTab.disabled;
  if (![null, undefined].includes(forceDisabled as any)) {
    disabled = forceDisabled as boolean;
  }
  return (
    <button
      type={formId ? 'submit' : 'button'} // Set type to "submit" if formId is provided
      form={formId} // Associate this button with the form using formId
      className={classNameMerchiCheckoutButtonPrimary + ' btn-lg'}
      disabled={disabled || loading}
      onClick={!formId ? handleButtonClick : undefined}
    >
      {loading ? (
        <CgSpinner fontSize='1.1rem' className='animate_spin' />
      ) : (
        <FaArrowRight fontSize='1.1rem' />
      )}
    </button>
  );
}

export default ButtonNext;
