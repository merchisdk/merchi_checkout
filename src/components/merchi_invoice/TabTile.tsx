'use client';

interface Props {
  children: any;
  defaultValue: string;
  name: string;
  activeStyle: boolean;
  setTab: (value: any) => void;
}

export default function TabTile({ children, defaultValue, name, activeStyle, setTab }: Props) {
  return (
    <div
      className='cursor-pointer'
      onClick={() => setTab(name)}
    >
      <input
        style={{display: 'none'}}
        type='radio'
        name={name}
        onChange={() => false}
        checked={name === defaultValue}
      />
      <div className={`radio-tile  ${activeStyle && 'radio-tile-active'}`}>
        {children}
      </div>
    </div>
  );
}
