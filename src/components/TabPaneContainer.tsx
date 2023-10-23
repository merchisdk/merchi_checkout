import { useMerchiCheckboutContext } from './MerchiCheckoutProvider';

interface Props {
  children: any;
}

function TabPaneContainer({ children }: Props) {
  const { classNameMerchiCheckoutTabPaneContainer } =
    useMerchiCheckboutContext();
  return (
    <div className={classNameMerchiCheckoutTabPaneContainer}>{children}</div>
  );
}

export default TabPaneContainer;
