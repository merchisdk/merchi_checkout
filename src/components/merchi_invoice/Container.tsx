'use client';
import { IconPaymentSSL } from './icons';

interface Props {
  children: any;
  description: string;
}

export default function Container({ children, description }: Props) {
  return (
    <div className='m-auto text-center'>
      <div className='m-auto pt-2' style={{ maxWidth: 400 }}>
        <div>
          <p className='d-block mb-3'>{description}</p>
          {children}
        </div>
        <IconPaymentSSL />
      </div>
    </div>
  );
}
