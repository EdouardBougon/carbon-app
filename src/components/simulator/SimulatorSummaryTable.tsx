import { ReactComponent as Arrow } from 'assets/icons/arrow-round.svg';
import { SimulatorResultSearch } from 'libs/routing';
import { prettifyNumber } from 'utils/helpers';
import { Token } from 'libs/tokens';

interface Props {
  summaryData: Pick<
    SimulatorResultSearch,
    'sellMin' | 'sellMax' | 'buyMin' | 'buyMax' | 'buyBudget' | 'sellBudget'
  >;
  baseToken: Token;
  quoteToken: Token;
}

export const SimulatorSummaryTable = ({
  baseToken,
  quoteToken,
  summaryData,
}: Props) => {
  const sellMin = prettifyNumber(summaryData.sellMin, { abbreviate: true });
  const sellMax = prettifyNumber(summaryData.sellMax, { abbreviate: true });
  const buyMin = prettifyNumber(summaryData.buyMin, { abbreviate: true });
  const buyMax = prettifyNumber(summaryData.buyMax, { abbreviate: true });
  const baseBudget = prettifyNumber(summaryData.sellBudget, {
    abbreviate: true,
  });
  const quoteBudget = prettifyNumber(summaryData.buyBudget, {
    abbreviate: true,
  });
  const baseBudgetFormatted = prettifyNumber(baseBudget, { abbreviate: true });
  const quoteBudgetFormatted = prettifyNumber(quoteBudget, {
    abbreviate: true,
  });
  const baseSymbol = baseToken.symbol;
  const quoteSymbol = quoteToken.symbol;

  return (
    <table className="grid grid-cols-[auto,auto] grid-rows-4 items-center justify-evenly gap-6 md:grid-cols-[auto,auto,auto,auto] md:grid-rows-2">
      <Arrow className="h-16 w-16 text-green" />
      {buyMin}-{buyMax} {baseSymbol} per {quoteSymbol}
      <span className="text-white/40">|</span>
      {quoteBudgetFormatted} {quoteSymbol}
      <Arrow className="h-16 w-16 -rotate-90 text-red" />
      {sellMin}-{sellMax} {baseSymbol} per {quoteSymbol}
      <span className="text-white/40">|</span>
      {baseBudgetFormatted} {baseSymbol}
    </table>
  );
};
