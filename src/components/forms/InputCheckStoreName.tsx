'use client';
import { useState } from 'react';
import { debounce } from 'lodash';
import { useController } from 'react-hook-form';
import { PiCloudBold, PiCloudCheckBold, PiCloudXBold } from 'react-icons/pi';
import { checkStoreName } from '../../actions/domain';
import { useMerchiCheckboutContext } from '../MerchiCheckoutProvider';

function replaceSpecialChars(str: string) {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/([^\w]+|\s+)/g, '-')
    .replace(/\-\-+/g, '-')
    .replace(/(^-+|-+$)/, '').toLowerCase();
}

interface Props {
  control: any;
  errors: any;
}

function InputCheckStoreName({ control, errors }: Props) {
  const {
    field: { ref, value, ...inputProps },
    fieldState: { invalid }
  } = useController({
    name: 'subDomain',
    control,
    defaultValue: ""
  });
  const {
    classNameMerchiCheckoutFormGroup,
    classNameMerchiCheckoutFormInput,
  } = useMerchiCheckboutContext();
  const [checkingName, setCheckingName] = useState(false);
  const [available, setAvailable] = useState(false);
  const [neutral, setNeutral] = useState(true);
  async function checkName() {
    try {
      const response: any = await checkStoreName(value || '');
      if (response.ok) {
        setAvailable(true);
      } else {
        setAvailable(false);
      }
      setCheckingName(false);
      setNeutral(false);
    } catch (e) {
      setCheckingName(false);
      setNeutral(false);
      setAvailable(false);
    }
  }
  const style = {
    fontSize: '0.75rem',
    fontWeight: 600,
  };

  // UI for domain indication. Needs proper logic.
  const colorIndication = () => {
    if (checkingName) return 'text-muted';
    if (available) return 'text-success';
    if (neutral) return 'text-muted';
    return 'text-danger';
  };

  // UI for domain indication. Needs proper logic.
  const iconIndication = () => {
    if (checkingName) return <PiCloudBold className='text-muted animation-blink' />;
    if (available) return <PiCloudCheckBold className='text-success' />;
    if (neutral) return <PiCloudBold className='text-muted' />;
    return <PiCloudXBold className='text-danger' />;
  };

  function NotificationDomainValid() {
    return (
      <div
        className='d-flex align-items-center'
        style={{ margin: '-1.25rem 0 0.5rem 0' }}
      >
        <span style={style} className='ml-2 font-italic'>
          Store url:
        </span>
        <span
          style={style}
          className={`ml-2 font-italic mr-1 ${colorIndication()}`}
        >
          {value !== '' ? value : 'your-store'}.{process.env.NEXT_PUBLIC_FRONTEND_URL_DISPLAY}{' '}
        </span>
        {iconIndication()}
      </div>
    );
  }
  const debouncedCheckName = debounce(checkName, 1000);
  return (
    <>
      <div className={classNameMerchiCheckoutFormGroup}>
        <input
          className={`${classNameMerchiCheckoutFormInput} ${invalid && ' is-invalid'}`}
          type='text'
          placeholder='Store name'
          {...inputProps}
          onChange={(e) => {
            setCheckingName(true);
            inputProps.onChange(replaceSpecialChars(e.target.value));
            debouncedCheckName();
          }}
        />
        {(errors as any).subDomain && (
          <div className='text-danger' style={{ display: 'block' }}>
            {errors.subDomain.message}
          </div>
        )}
      </div>
      <NotificationDomainValid />
    </>
  );
}

export default InputCheckStoreName;
