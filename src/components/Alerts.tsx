'use client';
import { useEffect } from 'react';
import { useMerchiCheckboutContext } from './MerchiCheckoutProvider'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCheckCircle,
  faExclamationCircle,
  faExclamationTriangle,
  faInfoCircle,
  faTimes,
} from '@fortawesome/free-solid-svg-icons';

interface PropsAlertSmall {
  alertType?: string;
  close: () => void;
  delay?: number;
  title: string;
  message: string;
}

interface IconsMapType {
  [key: string]: any;
}

const iconsMap: IconsMapType = {
  danger: faExclamationCircle,
  info: faInfoCircle,
  success: faCheckCircle,
  warning: faExclamationTriangle,
};

function AlertSmall({
  alertType = 'error',
  close,
  delay = 5000,
  message,
  title,
}: PropsAlertSmall) {
  const {
    classNameMerchiCheckoutAlert,
    classNameMerchiCheckoutAlertError,
    classNameMerchiCheckoutAlertSuccess,
  } = useMerchiCheckboutContext();
  function setTimer() {
    setTimeout(close, delay);
  }
  useEffect(() => {
    if (!['danger', 'error'].includes(alertType)) { 
      setTimer();
    }
  }, [message]);
  const classNameAlertType = alertType === 'error'
    ? classNameMerchiCheckoutAlertError
    : classNameMerchiCheckoutAlertSuccess;
  return (
    <div
      className={`${classNameMerchiCheckoutAlert} ${classNameAlertType}`}
    >
      <div style={{display: 'flex', justifyContent: 'space-between'}}>
        <FontAwesomeIcon
          className='alert-icon'
          icon={iconsMap[alertType]}
        />
        <div className='alert-text'>
          <span
            className='alert-title'
            data-notify='title'
          >
            {title}
          </span>
          {' '}
          <span data-notify='message'>
            {message}
          </span>
        </div>
        <div onClick={close}>
          <FontAwesomeIcon icon={faTimes} />
        </div>
      </div>
    </div>
  );
}

function Alerts() {
  const {
    alerts,
    alertClose,
    classNameMerchiCheckoutAlertsContainer,
  } = useMerchiCheckboutContext();;
  return (
    <div className={classNameMerchiCheckoutAlertsContainer}>
      {
        alerts.map((alert: any, index: number) =>
          <AlertSmall
            key={`alert-index-key-${index}`}
            close={() => alertClose(index)}
            {...alert}
          />
        )
      }
    </div>
  );
}

export default Alerts;
    