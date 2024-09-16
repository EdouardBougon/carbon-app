import {
  activityActionName,
  activityDescription,
} from 'components/activity/utils';
import {
  FloatTooltip,
  FloatTooltipContent,
  FloatTooltipTrigger,
} from 'components/common/tooltip/FloatTooltip';
import { endOfWeek, isSameDay, isSameWeek, startOfWeek } from 'date-fns';
import { ScaleBand, ScaleLinear } from 'libs/d3';
import { Activity } from 'libs/queries/extApi/activity';
import { SafeDecimal } from 'libs/safedecimal';
import { FC, ReactNode } from 'react';

interface Indicator {
  x: number;
  y: number;
  label: string;
  activities: Activity[];
}

const formatter = new Intl.DateTimeFormat();

const displayDay = (date: Date) => formatter.format(date);
const displayWeek = (date: Date) =>
  formatter.formatRange(startOfWeek(date), endOfWeek(date));

const groupByIndicators = (activities: Activity[], domain: string[]) => {
  const points = domain.map((d) => new Date(Number(d) * 1000));
  const operations: Record<number, Indicator> = {};
  const trades: Record<number, Indicator> = {};
  const isSame = points.length > 60 ? isSameWeek : isSameDay;
  const getLabel = points.length > 60 ? displayWeek : displayDay;
  for (const activity of activities) {
    const key = (() => {
      const clostest = points.find((point) => isSame(point, activity.date));
      return (clostest ?? points.at(-1)!).getTime() / 1000;
    })();
    const action = activity.action;
    const list = action === 'buy' || action === 'sell' ? trades : operations;
    list[key] ||= {
      x: key,
      y: 0,
      label: getLabel(activity.date),
      activities: [],
    };
    list[key].activities.push(activity);
  }
  for (const indicator of Object.values(trades)) {
    const sum = indicator.activities.reduce((acc, activity) => {
      const { buy, sell } = activity.changes!;
      if (!buy?.budget || !sell?.budget) return acc;
      const price = new SafeDecimal(buy.budget).div(sell.budget);
      return acc.add(price);
    }, new SafeDecimal(0));
    indicator.y = sum.div(indicator.activities.length).abs().toNumber();
  }
  return {
    operations: Object.values(operations),
    trades: Object.values(trades),
  };
};

export type ChartPrices<T = string> = {
  buy: { min: T; max: T };
  sell: { min: T; max: T };
};

export type OnPriceUpdates = (props: ChartPrices) => void;

export interface D3ChartIndicatorsProps {
  xScale: ScaleBand<string>;
  yScale: ScaleLinear<number, number>;
  boundHeight: number;
  activities: Activity[];
}

export const D3ChartIndicators = (props: D3ChartIndicatorsProps) => {
  const { xScale, yScale, boundHeight: height, activities } = props;
  const { operations, trades } = groupByIndicators(activities, xScale.domain());
  return (
    <>
      {operations.map((indicator, i) => {
        const { x } = indicator;
        return (
          <IndicatorTooltip key={i} indicator={indicator}>
            <g transform={`translate(${xScale(x.toString())},${height - 10})`}>
              <rect
                className="transformBox-fill origin-center rotate-45"
                x={xScale.bandwidth() / 2 - 4}
                y={xScale.bandwidth() / 2 - 4}
                width={8}
                height={8}
                fill="white"
                stroke="black"
              />
            </g>
          </IndicatorTooltip>
        );
      })}
      {trades.map((indicator, i) => {
        const { x, y } = indicator;
        return (
          <IndicatorTooltip key={i} indicator={indicator}>
            <g transform={`translate(${xScale(x.toString())},${yScale(y)})`}>
              <circle
                cx={xScale.bandwidth() / 2}
                cy={xScale.bandwidth() / 2}
                r={5}
                fill="white"
                stroke="black"
              />
            </g>
          </IndicatorTooltip>
        );
      })}
    </>
  );
};

interface TooltipProps {
  indicator: Indicator;
  children: ReactNode;
}
const IndicatorTooltip: FC<TooltipProps> = (props) => {
  const { indicator, children } = props;
  return (
    <FloatTooltip>
      <FloatTooltipTrigger>{children}</FloatTooltipTrigger>
      <FloatTooltipContent className="bg-background-800 max-h-[300px] max-w-[250px] overflow-auto rounded p-16">
        <h4 className="text-12 font-weight-500 mb-10">
          Date: {indicator.label}
        </h4>
        <ul className="flex list-disc flex-col gap-10 ps-16">
          {indicator.activities.map((activity, j) => (
            <li key={j} className="text-12 text-white/80">
              <b>{activityActionName[activity.action]}</b>:&nbsp;
              {activityDescription(activity)}
            </li>
          ))}
        </ul>
      </FloatTooltipContent>
    </FloatTooltip>
  );
};
