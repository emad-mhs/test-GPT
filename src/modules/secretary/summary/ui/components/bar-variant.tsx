import {
  Tooltip,
  XAxis,
  ResponsiveContainer,
  BarChart,
  Bar,
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

export const BarVariant = ({ data }: Props) => {
  return (
    <ResponsiveContainer width='100%' height={350}>
      <BarChart data={data}>
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
        <Bar dataKey='outgoing' fill='#3b82f6' className='drop-shadow-xs' />
        <Bar dataKey='incoming' fill='#f43f5e' className='drop-shadow-xs' />
      </BarChart>
    </ResponsiveContainer>
  );
};
