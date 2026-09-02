'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import InputAcceptUserTermsAndConditions from './InputAcceptUserTermsAndConditions';
import { createNewCustomer } from '../../actions/customer';
import InputSelect from './InputSelect';
import InputText from './InputText';
import { useMerchiCheckboutContext } from '../MerchiCheckoutProvider';
import { phoneOptions } from '../../utils';
import InputError from './InputError';

export const emailValidation = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]/i;

export function FormWhatsappCustomer() {
  const {
    classNameMerchiCheckoutButtonPrimary,
    classNameMerchiCheckoutFormGroup,
    includeDomainSignup,
    job,
    nextTab,
    setCustomer,
    showUserTermsAndConditions,
    urlApi,
  } = useMerchiCheckboutContext();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [acceptConditions, setAcceptConditions] = useState(true);

  const { control, handleSubmit, watch } = useForm({
    defaultValues: {
      emailAddresses: [{ emailAddress: '' }],
      name: '',
      phoneNumbers: [{ code: 'AU', number: '' }],
    },
  });

  async function onSubmit(values: any) {
    if (showUserTermsAndConditions && !acceptConditions) {
      return;
    }
    setLoading(true);
    try {
      const r = await createNewCustomer((urlApi as string), {
        ...values,
        registeredUnderDomains: job?.domain?.id
          ? [{ id: job.domain.id }]
          : job?.product?.domain?.id
            ? [{ id: job.product.domain.id }]
            : undefined,
      });
      if (r.ok) {
        const userJson = await r.json();
        const client = userJson.user;
        setCustomer(client, { sendWhatsapp: true });
        if (!includeDomainSignup) {
          nextTab();
        }
        setLoading(false);
      } else {
        const err = await r.json();
        setError(err);
        setLoading(false);
      }
    } catch (e: any) {
      setError(e);
      setLoading(false);
    }
  }

  function validatePhone() {
    const phone = watch('phoneNumbers.0.number');
    if (!phone) return 'WhatsApp number is required';
    if (isNaN(phone as any)) return 'Phone number must be a number';
    return true;
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
            label='WhatsApp Number'
            name='phoneNumbers[0].number'
            placeholder='0400 000 000'
            rules={{
              required: 'WhatsApp number is required',
              validate: validatePhone,
            }}
            type='phone'
          />
        </div>
      </div>
      <p className='text-muted small'>
        By continuing, you agree to receive order updates via WhatsApp at this
        number.
      </p>
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
          {loading ? 'Loading...' : 'Continue with WhatsApp'}
        </button>
      </div>
    </form>
  );
}

export default FormWhatsappCustomer;
