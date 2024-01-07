'use client';
import { useMerchiCheckboutContext } from '../MerchiCheckoutProvider';

interface Props {
  isChecked: boolean;
  setIsChecked: (isChecked: boolean) => void;
}

function InputAcceptUserTermsAndConditions({ isChecked, setIsChecked }: Props) {
  const {
    classNameMerchiCheckoutFormCheckbox,
    classNameMerchiCheckoutFormGroupCheckbox,
    classNameMerchiCheckoutFormLabelCheckbox,
  } = useMerchiCheckboutContext();
  return (
    <div
      onClick={
        () => setIsChecked(!isChecked)
      }
      className={classNameMerchiCheckoutFormGroupCheckbox}
    >
      <label className={classNameMerchiCheckoutFormLabelCheckbox}>
        <input
          className={classNameMerchiCheckoutFormCheckbox}
          defaultChecked={isChecked}
          type='checkbox'
        />
        {' '}
        <span style={{ fontSize: '14px' }} className='text-muted'>
          I agree to the user profile{' '}
          <a href='/terms-and-conditions/user/'
            target='_blank'
          >
            terms &amp; conditions
          </a>.
        </span>
      </label>
    </div>
  );
}

export default InputAcceptUserTermsAndConditions;
