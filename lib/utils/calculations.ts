/**
 * Financial calculation utilities for trading system
 */

/**
 * Calculate profit/loss in absolute value
 * @param entryPrice - Entry/buy price
 * @param exitPrice - Exit/sell price
 * @param quantity - Number of shares
 * @returns Absolute P&L
 */
export function calculatePnL(
  entryPrice: number,
  exitPrice: number,
  quantity: number
): number {
  return (exitPrice - entryPrice) * quantity;
}

/**
 * Calculate profit/loss percentage
 * @param entryPrice - Entry/buy price
 * @param exitPrice - Exit/sell price
 * @returns P&L percentage
 */
export function calculatePnLPercent(entryPrice: number, exitPrice: number): number {
  if (entryPrice === 0) return 0;
  return ((exitPrice - entryPrice) / entryPrice) * 100;
}

/**
 * Calculate unrealized P&L for current position
 * @param entryPrice - Entry/buy price
 * @param currentPrice - Current market price
 * @param quantity - Number of shares
 * @returns Unrealized P&L
 */
export function calculateUnrealizedPnL(
  entryPrice: number,
  currentPrice: number,
  quantity: number
): number {
  return calculatePnL(entryPrice, currentPrice, quantity);
}

/**
 * Calculate position value
 * @param price - Current price
 * @param quantity - Number of shares
 * @returns Position value
 */
export function calculatePositionValue(price: number, quantity: number): number {
  return price * quantity;
}

/**
 * Calculate average entry price
 * @param trades - Array of trades with price and quantity
 * @returns Average entry price
 */
export function calculateAveragePrice(
  trades: Array<{ price: number; quantity: number }>
): number {
  if (trades.length === 0) return 0;

  const totalValue = trades.reduce((sum, trade) => sum + trade.price * trade.quantity, 0);
  const totalQuantity = trades.reduce((sum, trade) => sum + trade.quantity, 0);

  return totalQuantity === 0 ? 0 : totalValue / totalQuantity;
}

/**
 * Calculate Sharpe Ratio (annualized)
 * @param returns - Array of period returns (in decimal, e.g., 0.05 for 5%)
 * @param riskFreeRate - Risk-free rate (annual, default 0.02 for 2%)
 * @returns Sharpe ratio
 */
export function calculateSharpeRatio(
  returns: number[],
  riskFreeRate: number = 0.02
): number {
  if (returns.length === 0) return 0;

  const avgReturn = returns.reduce((sum, r) => sum + r, 0) / returns.length;
  const variance =
    returns.reduce((sum, r) => sum + Math.pow(r - avgReturn, 2), 0) / returns.length;
  const stdDev = Math.sqrt(variance);

  if (stdDev === 0) return 0;

  // Annualize: assuming daily returns, multiply by sqrt(252)
  const annualizedReturn = avgReturn * 252;
  const annualizedStdDev = stdDev * Math.sqrt(252);
  const excessReturn = annualizedReturn - riskFreeRate;

  return excessReturn / annualizedStdDev;
}

/**
 * Calculate Maximum Drawdown
 * @param equityCurve - Array of portfolio values over time
 * @returns Maximum drawdown percentage
 */
export function calculateMaxDrawdown(equityCurve: number[]): number {
  if (equityCurve.length === 0) return 0;

  let maxDrawdown = 0;
  let peak = equityCurve[0];

  for (const value of equityCurve) {
    if (value > peak) {
      peak = value;
    }
    const drawdown = ((peak - value) / peak) * 100;
    if (drawdown > maxDrawdown) {
      maxDrawdown = drawdown;
    }
  }

  return maxDrawdown;
}

/**
 * Calculate win rate
 * @param trades - Array of trades with P&L
 * @returns Win rate percentage (0-100)
 */
export function calculateWinRate(trades: Array<{ pnl: number }>): number {
  if (trades.length === 0) return 0;

  const winningTrades = trades.filter((trade) => trade.pnl > 0).length;
  return (winningTrades / trades.length) * 100;
}

/**
 * Calculate average win and average loss
 * @param trades - Array of trades with P&L
 * @returns Object with avgWin and avgLoss
 */
export function calculateAvgWinLoss(
  trades: Array<{ pnl: number }>
): { avgWin: number; avgLoss: number } {
  const winningTrades = trades.filter((trade) => trade.pnl > 0);
  const losingTrades = trades.filter((trade) => trade.pnl < 0);

  const avgWin =
    winningTrades.length > 0
      ? winningTrades.reduce((sum, trade) => sum + trade.pnl, 0) / winningTrades.length
      : 0;

  const avgLoss =
    losingTrades.length > 0
      ? losingTrades.reduce((sum, trade) => sum + trade.pnl, 0) / losingTrades.length
      : 0;

  return { avgWin, avgLoss };
}

/**
 * Calculate profit factor
 * @param trades - Array of trades with P&L
 * @returns Profit factor (gross profit / gross loss)
 */
export function calculateProfitFactor(trades: Array<{ pnl: number }>): number {
  const grossProfit = trades
    .filter((trade) => trade.pnl > 0)
    .reduce((sum, trade) => sum + trade.pnl, 0);

  const grossLoss = Math.abs(
    trades.filter((trade) => trade.pnl < 0).reduce((sum, trade) => sum + trade.pnl, 0)
  );

  return grossLoss === 0 ? (grossProfit > 0 ? Infinity : 0) : grossProfit / grossLoss;
}

/**
 * Calculate total return percentage
 * @param initialValue - Starting portfolio value
 * @param finalValue - Ending portfolio value
 * @returns Total return percentage
 */
export function calculateTotalReturn(initialValue: number, finalValue: number): number {
  if (initialValue === 0) return 0;
  return ((finalValue - initialValue) / initialValue) * 100;
}

/**
 * Calculate annualized return
 * @param totalReturn - Total return percentage
 * @param days - Number of days
 * @returns Annualized return percentage
 */
export function calculateAnnualizedReturn(totalReturn: number, days: number): number {
  if (days === 0) return 0;
  const years = days / 365;
  return (Math.pow(1 + totalReturn / 100, 1 / years) - 1) * 100;
}

/**
 * Calculate risk-reward ratio
 * @param targetProfit - Target profit
 * @param potentialLoss - Potential loss (stop loss)
 * @returns Risk-reward ratio
 */
export function calculateRiskRewardRatio(
  targetProfit: number,
  potentialLoss: number
): number {
  if (potentialLoss === 0) return 0;
  return targetProfit / Math.abs(potentialLoss);
}

/**
 * Calculate stop loss price
 * @param entryPrice - Entry price
 * @param stopLossPercent - Stop loss percentage (e.g., 5 for 5%)
 * @returns Stop loss price
 */
export function calculateStopLossPrice(
  entryPrice: number,
  stopLossPercent: number
): number {
  return entryPrice * (1 - stopLossPercent / 100);
}

/**
 * Calculate take profit price
 * @param entryPrice - Entry price
 * @param takeProfitPercent - Take profit percentage (e.g., 10 for 10%)
 * @returns Take profit price
 */
export function calculateTakeProfitPrice(
  entryPrice: number,
  takeProfitPercent: number
): number {
  return entryPrice * (1 + takeProfitPercent / 100);
}

/**
 * Calculate position size based on risk
 * @param accountBalance - Total account balance
 * @param riskPercent - Risk percentage per trade (e.g., 2 for 2%)
 * @param entryPrice - Entry price
 * @param stopLossPrice - Stop loss price
 * @returns Recommended position size (quantity)
 */
export function calculatePositionSize(
  accountBalance: number,
  riskPercent: number,
  entryPrice: number,
  stopLossPrice: number
): number {
  const riskAmount = accountBalance * (riskPercent / 100);
  const riskPerShare = Math.abs(entryPrice - stopLossPrice);

  if (riskPerShare === 0) return 0;

  return Math.floor(riskAmount / riskPerShare);
}

/**
 * Calculate holding period in days
 * @param entryDate - Entry date
 * @param exitDate - Exit date
 * @returns Number of days
 */
export function calculateHoldingPeriod(entryDate: Date, exitDate: Date): number {
  const diffTime = Math.abs(exitDate.getTime() - entryDate.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}
