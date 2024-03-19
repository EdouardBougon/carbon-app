import { ChangeEvent, FC } from 'react';
import { TokensOverlap } from 'components/common/tokensOverlap';
import { Activity, ActivityAction } from 'libs/queries/extApi/activity';
import { NewTabLink } from 'libs/routing';
import { cn, getLowestBits, shortAddress, tokenAmount } from 'utils/helpers';
import { getExplorerLink } from 'utils/blockExplorer';
import { ReactComponent as IconCheck } from 'assets/icons/check.svg';
import { ReactComponent as IconPause } from 'assets/icons/pause.svg';
import { ReactComponent as IconEdit } from 'assets/icons/edit.svg';
import { ReactComponent as IconArrowDown } from 'assets/icons/arrowDown.svg';
import { ReactComponent as IconWithdraw } from 'assets/icons/withdraw.svg';
import { ReactComponent as IconDeposit } from 'assets/icons/deposit.svg';
import { ReactComponent as IconDelete } from 'assets/icons/delete.svg';
import { ReactComponent as IconTransfer } from 'assets/icons/transfer.svg';
import { ReactComponent as IconLink } from 'assets/icons/link.svg';
import { ReactComponent as IconChevronLeft } from 'assets/icons/chevron-left.svg';
import {
  activityActionName,
  activityDateFormatter,
  activityDescription,
  activityKey,
  budgetColor,
} from './utils';
import { usePagination } from 'hooks/useList';
import { SafeDecimal } from 'libs/safedecimal';
import { Token } from 'libs/tokens';
import { ActivityListProps } from './ActivityList';
import style from './ActivityTable.module.css';

const thStyle = cn(
  'text-start font-weight-400 py-16',
  'first:pl-24',
  'last:pr-24 last:text-end'
);
const tdFirstLine = cn(
  'pt-12 align-bottom whitespace-nowrap',
  'first:pl-24',
  'last:pr-24 last:text-end'
);
const tdSecondLine = cn(
  'pb-12 align-top whitespace-nowrap',
  'last:pr-24 last:text-end'
);

export const ActivityTable: FC<ActivityListProps> = (props) => {
  const { activities, hideIds = false } = props;
  return (
    <table className={cn('w-full border-collapse', style.table)}>
      <thead>
        <tr className="border-y border-background-800 font-mono text-14 text-white/60">
          {!hideIds && <th className={thStyle}>ID</th>}
          <th className={thStyle} colSpan={2}>
            Action
          </th>
          <th className={thStyle}>Buy Budget</th>
          <th className={thStyle}>Sell Budget</th>
          <th className={thStyle}>Date</th>
        </tr>
      </thead>
      <tbody>
        {activities.map((activity, i) => (
          <ActivityRow
            key={activityKey(activity, i)}
            activity={activity}
            hideIds={hideIds}
            index={i}
          />
        ))}
      </tbody>
      <tfoot>
        <ActivityPaginator />
      </tfoot>
    </table>
  );
};

interface ActivityRowProps {
  activity: Activity;
  hideIds: boolean;
  index: number;
}
const ActivityRow: FC<ActivityRowProps> = ({ activity, hideIds, index }) => {
  const { strategy, changes } = activity;
  const { base, quote } = strategy;
  return (
    <>
      <tr className="text-14" style={{ animationDelay: `${index * 50}ms` }}>
        {!hideIds && (
          <td rowSpan={2} className="py-12 first:pl-24">
            <ActivityId activity={activity} size={14} />
          </td>
        )}
        <td rowSpan={2} className="py-12 first:px-24">
          <ActivityIcon activity={activity} size={32} />
        </td>
        <td className={cn(tdFirstLine, 'font-weight-500')}>
          {activityActionName[activity.action]}
        </td>
        <td className={tdFirstLine}>
          {tokenAmount(strategy.buy.budget, quote)}
        </td>
        <td className={tdFirstLine}>
          {tokenAmount(strategy.sell.budget, base)}
        </td>
        <td className={cn(tdFirstLine, 'font-mono')}>
          {activityDateFormatter.format(activity.date)}
        </td>
      </tr>
      <tr
        className="font-mono text-12 text-white/60"
        style={{ animationDelay: `${index * 50}ms` }}
      >
        {/* ID */}
        {/* Action Icon */}
        <td className={tdSecondLine}>
          <p className="whitespace-normal">{activityDescription(activity)}</p>
        </td>
        <td className={tdSecondLine}>
          <BudgetChange budget={changes?.buy?.budget} token={quote} />
        </td>
        <td className={tdSecondLine}>
          <BudgetChange budget={changes?.sell?.budget} token={base} />
        </td>
        <td className={tdSecondLine}>
          <p className="flex justify-end gap-8 align-bottom">
            {shortAddress(activity.txHash)}
            <TransactionLink txHash={activity.txHash} className="h-14" />
          </p>
        </td>
      </tr>
    </>
  );
};

interface ActivityIdProps {
  activity: Activity;
  size: number;
}
export const ActivityId: FC<ActivityIdProps> = ({ activity, size }) => {
  const { id, base, quote } = activity.strategy;
  const space = size >= 14 ? 8 : 4;
  return (
    <span
      className={`inline-flex items-center gap-${space} rounded-full bg-background-800 p-${space}`}
    >
      <span className={`text-${size}`}>{getLowestBits(id)}</span>
      <TokensOverlap tokens={[base, quote]} size={size + 2} />
    </span>
  );
};

interface ActivityIconProps {
  activity: Activity;
  size: number;
  className?: string;
}
export const ActivityIcon: FC<ActivityIconProps> = (props) => {
  const { activity, className, size } = props;
  const classes = cn(
    'grid place-items-center rounded-full',
    iconColor(activity.action),
    `h-${size} w-${size}`,
    className
  );
  return (
    <div className={classes}>
      <ActionIcon action={activity.action} size={size - 16} />
    </div>
  );
};

interface TransactionLinkProps {
  txHash: string;
  className: string;
}
export const TransactionLink: FC<TransactionLinkProps> = (props) => {
  const { txHash, className } = props;
  return (
    <NewTabLink
      aria-label="See transaction on block explorer"
      to={getExplorerLink('tx', txHash)}
    >
      <IconLink className={cn('text-primary', className)} />
    </NewTabLink>
  );
};

interface BudgetChangeProps {
  budget?: string;
  token: Token;
}
export const BudgetChange: FC<BudgetChangeProps> = ({ budget, token }) => {
  if (!budget) return '...';
  const value = new SafeDecimal(budget);
  const text = value.isNegative()
    ? tokenAmount(budget, token)
    : `+${tokenAmount(budget, token)}`;
  return <p className={budgetColor(budget)}>{text}</p>;
};

const ActivityPaginator = () => {
  const {
    limit,
    offset,
    currentPage,
    maxPage,
    setLimit,
    firstPage,
    lastPage,
    previousPage,
    nextPage,
  } = usePagination();

  const changeLimit = (e: ChangeEvent<HTMLSelectElement>) => {
    setLimit(Number(e.target.value));
  };

  return (
    <tr className="border-t border-background-800 text-14 text-white/80">
      <td className="px-24 py-16" colSpan={3}>
        <div className="flex items-center gap-8">
          <label>Show results</label>
          <select
            className="rounded-full border-2 border-background-800 bg-background-900 px-12 py-8"
            name="limit"
            onChange={changeLimit}
            value={limit}
          >
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="30">30</option>
            <option value="40">40</option>
            <option value="50">50</option>
          </select>
        </div>
      </td>
      <td className="px-24 py-16 text-end" colSpan={3}>
        <div role="group" className="flex justify-end gap-8 font-mono">
          <button
            onClick={firstPage}
            disabled={!offset}
            aria-label="First page"
            className="disabled:opacity-50"
          >
            First
          </button>
          <button
            onClick={previousPage}
            disabled={!offset}
            aria-label="Previous page"
            className="p-8 disabled:opacity-50"
          >
            <IconChevronLeft className="h-12" />
          </button>
          <p
            className="flex gap-8 rounded-full border-2 border-background-800 px-12 py-8"
            aria-label="page position"
          >
            <span className="text-white">{currentPage}</span>
            <span role="separator">/</span>
            <span className="text-white">{maxPage}</span>
          </p>
          <button
            onClick={nextPage}
            disabled={currentPage === maxPage}
            aria-label="Next page"
            className="p-8 disabled:opacity-50"
          >
            <IconChevronLeft className="h-12 rotate-180" />
          </button>
          <button
            onClick={lastPage}
            disabled={currentPage === maxPage}
            aria-label="Last page"
            className="disabled:opacity-50"
          >
            Last
          </button>
        </div>
      </td>
    </tr>
  );
};

interface ActionIconProps {
  action: ActivityAction;
  size: string | number;
}
const iconColor = (action: ActivityAction) => {
  if (action === 'buy') return `bg-buy/10 text-buy`;
  if (action === 'sell') return `bg-sell/10 text-sell`;
  if (action === 'create') return `bg-success/10 text-success`;
  if (action === 'delete') return `bg-error/10 text-error`;
  return `bg-white/10 text-white`;
};

const ActionIcon: FC<ActionIconProps> = ({ action, size }) => {
  const className = `h-${size} w-${size}`;
  if (action === 'create') return <IconCheck className={className} />;
  if (action === 'transfer') return <IconTransfer className={className} />;
  if (action === 'edit') return <IconEdit className={className} />;
  if (action === 'delete') return <IconDelete className={className} />;
  if (action === 'pause') return <IconPause className={className} />;
  if (action === 'deposit') return <IconDeposit className={className} />;
  if (action === 'withdraw') return <IconWithdraw className={className} />;
  if (action === 'buy')
    return <IconArrowDown className={cn('rotate-[-60deg]', className)} />;
  return <IconArrowDown className={cn('rotate-[-120deg]', className)} />;
};
