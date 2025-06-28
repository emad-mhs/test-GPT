import {
  Tooltip,
  XAxis,
  ResponsiveContainer,
  LineChart,
  Line,
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

export const LineVariant = ({ data }: Props) => {
  return (
    <ResponsiveContainer width='100%' height={350}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray='3 3' />
        <XAxis
          axisLine={false}
          tickLine={false}
          dataKey='date'
          tickFormatter={value => format(value, 'dd MMM')}
          style={{ fontSize: '12px' }}
          tickMargin={16}
        />
        <Tooltip content={<CustomTooltip />} />
        <Line
          dot={false}
          dataKey='outgoing'
          stroke='#3b82f6'
          strokeWidth={2}
          className='drop-shadow-xs'
        />
        <Line
          dot={false}
          dataKey='incoming'
          stroke='#f43f5e'
          strokeWidth={2}
          className='drop-shadow-xs'
        />
      </LineChart>
    </ResponsiveContainer>
  );
};
