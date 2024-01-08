'use client';
import { useForm } from 'react-hook-form';
import { useMerchiCheckboutContext } from '../MerchiCheckoutProvider';
import InputError from './InputError';
import { tryReturningCustomerEmail } from '../../actions/customer';
import { useState } from 'react';

const emailValidation = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]/i;

function FormReturningCustomer() {
  const {
    classNameMerchiCheckoutFormGroup,
    classNameMerchiCheckoutFormInput,
    classNameMerchiCheckoutButtonPrimary,
    includeDomainSignup,
    nextTab,
    setCustomer,
    urlApi,
  } = useMerchiCheckboutContext();
  const hookForm = useForm({ defaultValues: { emailAddress: '' } });
  const {
    handleSubmit,
    formState: { errors },
    getValues,
    register,
  } = hookForm;
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  async function submit() {
    setLoading(true);
    const values = getValues();
    try {
      const r = await tryReturningCustomerEmail(
        (urlApi as string),
        values.emailAddress
      );
      if (r.ok) {
        const customer = await r.json();
        setCustomer({
          emailAddresses: [{emailAddress: values.emailAddress}],
          id: customer.user_id,
          hasStore: customer.has_store,
        });
        if (!includeDomainSignup || customer.has_store) {
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
  return (
    <form onSubmit={handleSubmit(submit)}>
      <div className={classNameMerchiCheckoutFormGroup}>
        <input
          className={classNameMerchiCheckoutFormInput}
          placeholder='info@example.com'
          type='email'
          {...register('emailAddress', {
            required: 'Email address required',
            pattern: {
              value: emailValidation,
              message: 'Invalid email address'
            }
          })}
        />
        <small>
          If you are a returning customer please use the same email
          which you used previously.
        </small>
        <InputError error={errors.emailAddress} />
        {error && <InputError error={error} />}
      </div>
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

export default FormReturningCustomer;
