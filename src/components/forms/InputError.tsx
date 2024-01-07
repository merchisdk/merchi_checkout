'use client';

import { useMerchiCheckboutContext } from "../MerchiCheckoutProvider";

interface InputErrorProps {
  error?: {
    message?: string;
  };
}

const InputError: React.FC<InputErrorProps> = ({ error }) => {
  const { classNameMerchiCheckoutInputError } = useMerchiCheckboutContext();
  if (!error || !error.message) {
    return null;
  }

  return (
    <div className={classNameMerchiCheckoutInputError}>
      {error.message}
    </div>
  );
};

export default InputError;
