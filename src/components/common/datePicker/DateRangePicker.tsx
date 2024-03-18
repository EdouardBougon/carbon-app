import { Button } from 'components/common/button';
import { Calendar, CalendarProps } from 'components/common/calendar';
import { DropdownMenu, MenuButtonProps } from 'components/common/dropdownMenu';
import { subDays, isSameDay, subMonths, startOfDay, endOfDay } from 'date-fns';
import { Dispatch, memo, useRef, useState } from 'react';
import { DateRange } from 'react-day-picker';
import { ReactComponent as CalendarIcon } from 'assets/icons/calendar.svg';
import { ReactComponent as ChevronIcon } from 'assets/icons/chevron.svg';
import { fromUnixUTC, toUnixUTC } from 'components/simulator/utils';
import { cn } from 'utils/helpers';

export const datePickerPresets: DatePickerPreset[] = [
  { label: 'Last 7 days', days: 6 },
  { label: 'Last 30 days', days: 29 },
  { label: 'Last 90 days', days: 89 },
  { label: 'Last 365 days', days: 364 },
];

export type DatePickerPreset = {
  label: string;
  days: number;
};

interface Props {
  /** Value used to be reset to when user click on reset */
  defaultStart?: number | string;
  /** Value used to be reset to when user click on reset */
  defaultEnd?: number | string;
  /** Current start value */
  start?: number | string;
  /** Current end value */
  end?: number | string;
  onConfirm: (props: { start?: string; end?: string }) => void;
  setIsOpen: Dispatch<boolean>;
  presets: DatePickerPreset[];
  options?: Omit<CalendarProps, 'mode' | 'selected' | 'onSelect'>;
  required?: boolean;
  form?: string;
}

export const DateRangePicker = memo((props: Omit<Props, 'setIsOpen'>) => {
  const [isOpen, setIsOpen] = useState(false);
  const startDate = dateFormatter.format(fromUnixUTC(props.start));
  const endDate = dateFormatter.format(fromUnixUTC(props.end));

  const hasDates = !!(props.start && props.end);
  const Trigger = (attr: MenuButtonProps) => (
    <button
      {...attr}
      type="button"
      aria-label="Pick date range"
      className={cn(
        'flex items-center gap-8 rounded-full border-2 border-background-800 px-12 py-8 text-12',
        'hover:border-background-700 hover:bg-background-800',
        'active:border-background-600'
      )}
      data-testid="date-picker-button"
    >
      <CalendarIcon className="h-14 w-14 text-primary" />
      <span
        className="justify-self-end text-white/60"
        data-testid="simulation-dates"
      >
        {hasDates ? `${startDate} – ${endDate}` : 'Select Date range'}
      </span>
      <ChevronIcon
        className={cn('h-12 w-12 text-white/80 transition-transform', {
          'rotate-180': isOpen,
        })}
      />
    </button>
  );

  return (
    <DropdownMenu
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      placement="bottom-start"
      strategy="fixed"
      aria-expanded={isOpen}
      button={Trigger}
    >
      <Content {...props} setIsOpen={setIsOpen} />
    </DropdownMenu>
  );
});

const getDefaultDateRange = (
  start?: number | string,
  end?: number | string
): DateRange | undefined => {
  if (!start || !end) return undefined;
  return {
    from: fromUnixUTC(start),
    to: fromUnixUTC(end),
  };
};

/** Transform date into YYYY-MM-DD */
const toDateInput = (date?: Date) => date?.toISOString().split('T')[0] ?? '';

const Content = (props: Props) => {
  const startRef = useRef<HTMLInputElement>(null);
  const endRef = useRef<HTMLInputElement>(null);
  const now = new Date();
  const baseDate = getDefaultDateRange(
    props.start ?? props.defaultStart,
    props.end ?? props.defaultEnd
  );
  const [date, setDate] = useState(baseDate);
  const hasDates = !!(date?.from && date?.to);
  const selectedPreset = props.presets.find((p) => {
    if (!hasDates) return false;
    const from = subDays(now, p.days);
    return isSameDay(from, date?.from!) && isSameDay(date?.to!, now);
  });

  const handlePreset = (days: number) => {
    setDate({
      from: subDays(now, days),
      to: now,
    });
  };

  const onConfirm = () => {
    if (props.required && !hasDates) return;
    const from = date!.from ?? startOfDay(date!.to!);
    const to = date!.to ?? endOfDay(date!.from!);
    startRef.current!.value = toDateInput(from);
    endRef.current!.value = toDateInput(to);
    props.onConfirm({
      start: toUnixUTC(from),
      end: toUnixUTC(to!),
    });
    props.setIsOpen(false);
  };

  const onReset = () => {
    setDate(getDefaultDateRange(props.defaultStart, props.defaultEnd));
  };

  return (
    <div className="flex flex-col gap-20 p-20">
      <div className="flex gap-30">
        <div
          role="radiogroup"
          aria-label="presets"
          className="flex w-[200px] flex-col gap-5"
        >
          {props.presets.map(({ label, days }) => (
            <button
              type="button"
              role="radio"
              key={days}
              className="box-border rounded-8 border-2 border-transparent bg-clip-padding py-8 px-30 text-start text-14 font-weight-500 hover:border-background-700 [&[aria-checked=true]]:bg-black"
              onClick={() => handlePreset(days)}
              aria-checked={selectedPreset?.days === days}
              data-testid="date-picker-button"
            >
              {label}
            </button>
          ))}
        </div>
        <Calendar
          defaultMonth={subMonths(date?.to ?? new Date(), 1)}
          numberOfMonths={2}
          {...props.options}
          mode="range"
          selected={date}
          onSelect={setDate}
        />
      </div>
      <footer className="flex justify-end gap-16">
        <input
          ref={startRef}
          form={props.form}
          name="start"
          type="date"
          hidden
          defaultValue={toDateInput(date?.from)}
        />
        <input
          ref={endRef}
          form={props.form}
          name="end"
          type="date"
          hidden
          defaultValue={toDateInput(date?.to)}
        />
        <Button
          type="button"
          variant="black"
          size="sm"
          className="col-span-2 justify-self-start"
          onClick={onReset}
        >
          Reset
        </Button>
        <Button
          form={props.form}
          type="button"
          disabled={props.required && !hasDates}
          size="sm"
          className="col-span-2 justify-self-end"
          data-testid="date-picker-confirm"
          onClick={onConfirm}
        >
          Confirm
        </Button>
      </footer>
    </div>
  );
};

const dateFormatter = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: 'long',
  day: '2-digit',
});

interface DatePickerButtonProps {
  start?: Date;
  end?: Date;
}

export const DatePickerButton = memo(
  ({ start, end }: DatePickerButtonProps) => {
    const startDate = dateFormatter.format(start);
    const endDate = dateFormatter.format(end);

    const hasDates = !!(start && end);

    return (
      <>
        <CalendarIcon className="h-14 w-14 text-primary" />
        <span
          className="justify-self-end text-white/60"
          data-testid="simulation-dates"
        >
          {hasDates ? `${startDate} – ${endDate}` : 'Select Date range'}
        </span>
        <ChevronIcon className="h-12 w-12 rotate-180 text-white/80" />
      </>
    );
  }
);
