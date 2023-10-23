'use client';
import { useController } from 'react-hook-form';
import { useMerchiCheckboutContext } from '../../MerchiCheckoutProvider';
import InputError from './InputError';

interface Props {
  control: any;
  label?: string;
  name: string;
  placeholder: string;
  type?: string;
  onChange?: (event: any) => void; 
  rules?: Record<string, any>;
}

function InputText({
  control,
  label,
  name,
  placeholder,
  type = 'text',
  onChange,
  rules,
}: Props) {
  const {
    classNameMerchiCheckoutFormGroup,
    classNameMerchiCheckoutFormInput,
  } = useMerchiCheckboutContext();
  const {
    field: { ref, ...inputProps },
    fieldState: { error, invalid }
  } = useController({
    name,
    control,
    rules,
    defaultValue: '',
  });

  return (
    <div className={classNameMerchiCheckoutFormGroup}>
      {label && <label>{label}</label>}
      <input
        className={`${classNameMerchiCheckoutFormInput} ${invalid && ' is-invalid'}`}
        type={type}
        placeholder={placeholder}
        {...inputProps}
        onChange={(e) => {
          if (onChange) onChange(e);  // Check if custom onChange was provided
          inputProps.onChange(e);  // Default RHF onChange
        }}
      />
      <InputError error={error} />
    </div>
  );
}

export default InputText;
