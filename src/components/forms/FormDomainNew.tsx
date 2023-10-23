'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { createDomainStore } from '../actions/domain';
import InputCheckStoreName from './InputCheckStoreName';
import InputError from './InputError';
import InputSelect from './InputSelect';
import InputFileUpload from './InputFileUpload';
import { isoCountries } from '../utils';
import { useMerchiCheckboutContext } from '../MerchiCheckoutProvider';

const countryOptions = Object.keys(isoCountries).map((key) => ({
  value: key,
  label: isoCountries[key],
}));

export default function FormDomainNew() {
  const {
    classNameMerchiCheckoutButtonPrimary,
    classNameMerchiCheckoutFormGroup,
    job,
    nextTab,
  } = useMerchiCheckboutContext();
  const { client } = job;
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const hookForm = useForm({
    defaultValues: {
      country: 'AU',
      logo: {},
      subDomain: '',
    },
  });
  const { control, formState: { errors }, handleSubmit } = hookForm;
  async function onSubmit(values: any) {
    setLoading(true);
    try {
      const r = await createDomainStore({ ...values }, client);
      if (r.ok) {
        nextTab();
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
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className='text-center text-muted mb-4'>
        <h3>Store details</h3>
      </div>
      <div className='d-flex flex-column' style={{ gap: '0.75rem' }}>
        <InputCheckStoreName
          control={control}
          errors={errors}
        />
        <InputSelect
          control={control}
          name='country'
          options={countryOptions}
        />
        <InputFileUpload
          control={control}
          name='logo.id'
          placeholder='Upload Store Logo'
          rules={{required: 'A store logo is required.'}}
        />
      </div>
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
