'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import InputAcceptUserTermsAndConditions from './InputAcceptUserTermsAndConditions';
import { createNewCustomer } from '../../actions/customer';
import InputSelect from './InputSelect';
import InputText from './InputText';
import { useMerchiCheckboutContext } from '../../MerchiCheckoutProvider';
import { phoneOptions } from '../../utils';
import InputError from './InputError';

export const emailValidation = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]/i;

export function FormCustomerNew() {
  const {
    classNameMerchiCheckoutButtonPrimary,
    classNameMerchiCheckoutFormGroup,
    includeDomainSignup,
    nextTab,
    setCustomer,
    showUserTermsAndConditions,
  } = useMerchiCheckboutContext();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [acceptConditions, setAcceptConditions] = useState(true);

  const { control, handleSubmit, watch } = useForm({
    defaultValues: {
      emailAddresses: [{ emailAddress: '' }],
      name: '',
      phoneNumbers: [{ code: 'AU', number: '' }],
      registeredAsGuest: false,
    },
  });

  async function onSubmit(values: any) {
    setLoading(true);
    try {
      const r = await createNewCustomer({ ...values });
      if (r.ok) {
        const userJson = await r.json();
        setCustomer(userJson.user);
        if (!includeDomainSignup) {
          nextTab();
        }
        setLoading(false);
      } else {
        const error = await r.json();
        setError(error);
        setLoading(false);
      }
    } catch (e: any) {
      setError(e);
      setLoading(false);
    }
  }

  // Basic validation for phone. Checking that phone is a number. Can make more complex if we want.
  function validatePhone() {
    const phone = watch('phoneNumbers.0.number');
    if (isNaN(phone as any)) return 'Phone number must be a number';
    else return true;
  }
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <InputText
        control={control}
        label='Full Name'
        name='name'
        placeholder='John Smith'
        rules={{ required: 'Full name is required.' }}
      />
      <InputText
        control={control}
        label='Email'
        name='emailAddresses[0].emailAddress'
        placeholder='john@example.com'
        rules={{
          required: 'Email is required.',
          validate: emailValidation,
        }}
      />
      <div style={{ display: 'flex', gap: '1rem' }}>
        <div style={{ flexGrow: 1 }}>
          <InputSelect
            control={control}
            label='Country Code'
            name='phoneNumbers[0].code'
            options={phoneOptions}
          />
        </div>
        <div style={{ flexGrow: 1 }}>
          <InputText
            control={control}
            label='Phone Number'
            name='phoneNumbers[0].number'
            placeholder='0400 000 000'
            rules={{
              required: 'Phone number is required',
              validate: validatePhone,
            }}
            type='phone'
          />
        </div>
      </div>
      {showUserTermsAndConditions && (
        <div className={classNameMerchiCheckoutFormGroup}>
          <InputAcceptUserTermsAndConditions
            isChecked={acceptConditions}
            setIsChecked={setAcceptConditions}
          />
          {!acceptConditions && (
            <InputError
              error={{
                message:
                  'You must agree to the user profile terms and conditions to proceed.',
              }}
            />
          )}
        </div>
      )}
      <InputError error={error || {}} />
      <div className={classNameMerchiCheckoutFormGroup}>
        <button
          className={classNameMerchiCheckoutButtonPrimary}
          disabled={loading}
          type='submit'
        >
          {loading ? 'Loading...' : 'Submit'}
        </button>
      </div>
    </form>
  );
}

export default FormCustomerNew;
