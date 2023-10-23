'use client';

import { useMerchiCheckboutContext } from "./MerchiCheckoutProvider";
import { MerchiCheckoutTab } from './types';

interface Props {
  children: any;
  tabId?: string;
}

function TabPane({children, tabId}: Props) {
  const {
    activeTabIndex,
    classNameMerchiCheckoutTabPane,
    tabs,
  } = useMerchiCheckboutContext();
  const index = tabs.findIndex((t: MerchiCheckoutTab) => t.id === tabId);
  return (
    <div className={`${classNameMerchiCheckoutTabPane} ${activeTabIndex === index && 'active'}`}>
      {children}
    </div>
  );
}

export default TabPane;
