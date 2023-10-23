'use client';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { CgSpinner } from 'react-icons/cg';
import { useMerchiCheckboutContext } from '../MerchiCheckoutProvider';
import { addressInOneLine } from '../utils';
import { currencyTaxAndCost } from '../currency';

function ShipmentPrice({ shipment }: any) {
  const { shipmentMethod, taxType } = shipment;
  const { currency } = shipmentMethod;
  return (
    <div>
      {!!shipment.cost && (
        <small className='font-weight-bold'>
          {currencyTaxAndCost(currency, taxType, shipment.cost)}
        </small>
      )}
    </div>
  );
}

interface PropsPickupInfo {
  originAddress: any;
}

function PickupInfo({ originAddress }: PropsPickupInfo) {
  return <small>Pick up from: {addressInOneLine(originAddress)}</small>;
}

interface PropsShipmentOptionInfo {
  shipment: any;
}

function ShipmentOptionInfo({ shipment }: PropsShipmentOptionInfo) {
  const { name, shipmentMethod, transportCompanyName } = shipment;
  const { originAddress, pickUp } = shipmentMethod;
  return (
    <div className='shipment-option-info'>
      {!name ? (
        <>
          {!!transportCompanyName && (
            <p className='mb-0'>{shipmentMethod.name}</p>
          )}
          {pickUp ? (
            <PickupInfo originAddress={originAddress} />
          ) : (
            <small>{transportCompanyName}</small>
          )}
        </>
      ) : (
        <>
          <p className='m-0'>{name}</p>
          {pickUp && <PickupInfo originAddress={originAddress} />}
        </>
      )}
      <ShipmentPrice shipment={shipment} />
    </div>
  );
}

interface PropsListItemShipmentQuoteOption {
  doSelect: () => void;
  shipment: any;
  isSelected: boolean;
}

function ListItemShipmentQuoteOption({
  doSelect,
  isSelected,
  shipment,
}: PropsListItemShipmentQuoteOption) {
  const { classNameMerchiCheckoutListGroupItem } = useMerchiCheckboutContext();
  return (
    <div
      className={`${classNameMerchiCheckoutListGroupItem} ${
        isSelected ? 'active' : ''
      }`}
      style={{ cursor: 'pointer' }}
      onClick={doSelect}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <ShipmentOptionInfo shipment={shipment} />
        <div>
          {isSelected && <FontAwesomeIcon color='white' icon={faCheck} />}
        </div>
      </div>
    </div>
  );
}

function ListItemLoading() {
  const { classNameMerchiCheckoutListGroupItemLoader } =
    useMerchiCheckboutContext();
  return (
    <div
      className={
        classNameMerchiCheckoutListGroupItemLoader +
        ' d-flex align-items-center'
      }
    >
      <CgSpinner fontSize='1.5rem' className='animate_spin' />
    </div>
  );
}

function ListItemNoOptions() {
  const { classNameMerchiCheckoutListGroupItem } = useMerchiCheckboutContext();
  return (
    <div className={classNameMerchiCheckoutListGroupItem}>
      <div className='merchi_monster_shipment_option_not_found' />
      <small className='text-muted shipment-option-checkout-form'>
        Enter your address to select a shipment option
      </small>
    </div>
  );
}

interface Props {
  doSelectShipmentOption: (option: any) => void;
  loading: boolean;
  selectedOption?: any;
  shipmentOptions: Array<any>;
}

function ListShipmentQuoteOptions({
  doSelectShipmentOption,
  loading,
  selectedOption,
  shipmentOptions,
}: Props) {
  const { classNameMerchiCheckoutListGroup } = useMerchiCheckboutContext();
  const index = selectedOption
    ? shipmentOptions
        .map((s: any) => s.shipment)
        .findIndex((item: any) => item.id === (selectedOption as any).id)
    : null;
  return (
    <div className={classNameMerchiCheckoutListGroup}>
      {loading ? (
        <ListItemLoading />
      ) : shipmentOptions.length ? (
        shipmentOptions.map((s: any, i: number) => (
          <ListItemShipmentQuoteOption
            doSelect={() => doSelectShipmentOption(s.shipment)}
            isSelected={index === i}
            shipment={s.shipment}
            key={`${i}-option`}
          />
        ))
      ) : (
        <ListItemNoOptions />
      )}
    </div>
  );
}

export default ListShipmentQuoteOptions;
