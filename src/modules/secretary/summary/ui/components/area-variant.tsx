import {
  Tooltip,
  XAxis,
  AreaChart,
  Area,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import { format } from 'date-fns';

import { CustomTooltip } from './custom-tooltip';

type Props = {
  data: {
    date: Date | null;
    outgoing: number;
    incoming: number;
  }[];
};

export const AreaVariant = ({ data }: Props) => {
  return (
    <ResponsiveContainer width='100%' height={350}>
      <AreaChart data={data}>
        <CartesianGrid strokeDasharray='3 3' />
        <defs>
          <linearGradient id='outgoing' x1='0' y1='0' x2='0' y2='1'>
            <stop offset='2%' stopColor='#3d82f6' stopOpacity={0.8} />
            <stop offset='98%' stopColor='#3d82f6' stopOpacity={0} />
          </linearGradient>
          <linearGradient id='incoming' x1='0' y1='0' x2='0' y2='1'>
            <stop offset='2%' stopColor='#f43f5e' stopOpacity={0.8} />
            <stop offset='98%' stopColor='#f43f5e' stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis
          axisLine={false}
          tickLine={false}
          dataKey='date'
          tickFormatter={value => format(value, 'dd MMM')}
          style={{ fontSize: '12px' }}
          tickMargin={16}
        />
        <Tooltip content={<CustomTooltip />} />
        <Area
          type='monotone'
          dataKey='outgoing'
          stackId='outgoing'
          strokeWidth={2}
          stroke='#3d82f6'
          fill='url(#outgoing)'
          className='drop-shadow-xs'
        />
        <Area
          type='monotone'
          dataKey='incoming'
          stackId='incoming'
          strokeWidth={2}
          stroke='#f43f5e'
          fill='url(#incoming)'
          className='drop-shadow-xs'
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};
