/**
 * FinFlow Dark Design System Components
 *
 * Modern fintech UI components inspired by Robinhood/Webull.
 * Mobile-first, gesture-friendly, with bold typography and
 * color-coded profit/loss indicators.
 */

// Navigation
export { BottomTabNavigator } from './BottomTabNavigator';
export type { TabItem, BottomTabNavigatorProps } from './BottomTabNavigator';

// Stock Display
export { StockCard } from './StockCard';
export type { StockData, StockCardProps } from './StockCard';

// Hero Sections
export { ProfitLossHero } from './ProfitLossHero';
export type { ProfitLossHeroProps } from './ProfitLossHero';

// Trading Actions
export {
  TradeButton,
  BuyButton,
  SellButton,
  TradeButtonGroup,
} from './TradeButton';
export type {
  TradeAction,
  TradeButtonProps,
  TradeButtonGroupProps,
} from './TradeButton';

// Interactive Components
export { PullToRefresh } from './PullToRefresh';
export { FilterChips } from './FilterChips';
export type { FilterValue } from './FilterChips';
export { SearchBar } from './SearchBar';
export { ChartModal } from './ChartModal';
