'use client';
import React from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useController } from 'react-hook-form';
import { useMerchiCheckboutContext } from '../MerchiCheckoutProvider';
import InputError from './InputError';

interface Option {
  label: string;
  value: string;
}

interface Props {
  control: any;
  label?: string;
  name: string;
  options: Option[];
  rules?: any;
}

function InputSelect({
  control,
  label,
  name,
  options,
  rules,
}: Props) {
  const {
    classNameMerchiCheckoutFormGroup,
    classNameMerchiCheckoutFormSelect,
  } = useMerchiCheckboutContext();
  const {
    field,
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
      <select
        {...field}
        className={`${classNameMerchiCheckoutFormSelect} ${invalid && ' is-invalid'}`}
      >
        {options.map((option, index) => (
          <option key={index + uuidv4()} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <InputError error={error} />
    </div>
  );
}

export default InputSelect;
