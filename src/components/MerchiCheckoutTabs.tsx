import * as React from 'react';
import { MerchiCheckoutTab } from './types';
import { useMerchiCheckboutContext } from './MerchiCheckoutProvider';

interface PropsTab {
  index: number;
  tab: MerchiCheckoutTab;
}

function Tab({ index, tab }: PropsTab) {
  const {
    activeTabIndex,
    classNameMerchiCheckoutTab,
    classNameMerchiCheckoutTabButton,
    setActiveTabIndex,
  } = useMerchiCheckboutContext();
  const { disabled, title } = tab;
  const classActive = activeTabIndex === index ? 'active' : '';
  return (
    <div className={classNameMerchiCheckoutTab}>
      <button
        disabled={disabled}
        className={`${classNameMerchiCheckoutTabButton} ${classActive}`}
        style={{ cursor: disabled ? 'not-allowed' : 'pointer' }}
        onClick={() => {
          if (!disabled) {
            setActiveTabIndex(index);
          }
        }}
      >
        {index + 1}
      </button>
      <small className='text-muted'>{title}</small>
    </div>
  );
}

export default function MerchiCheckoutTabs() {
  const { classNameMerchiCheckoutTabsContainer, tabs } =
    useMerchiCheckboutContext();
  return (
    <div className={classNameMerchiCheckoutTabsContainer}>
      {tabs.map((t: MerchiCheckoutTab, i: number) => (
        <Tab key={`${i}-tab-id`} index={i} tab={t} />
      ))}
    </div>
  );
}
