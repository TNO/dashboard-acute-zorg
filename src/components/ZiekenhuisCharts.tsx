import React, { FC } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";
import { Stapeldrukte } from "../interfaces/sehform";

type stapeldrukteData = { label: string, stapeldrukte: Stapeldrukte, color?: string }

interface Props {
  stapeldrukteDatas: stapeldrukteData[]
}
export const StapeldrukteChart: FC<Props> = ({ stapeldrukteDatas }: Props) => {

  const walvisHours = [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 0, 1, 2, 3, 4, 5, 6]
  let data: any[] = []
  walvisHours.forEach( i => {
    const hour = stapeldrukteDatas[0].stapeldrukte[i].hour

    const d: any = {}
    stapeldrukteDatas.forEach(({ label, stapeldrukte }) => {
      d[label] = stapeldrukte[i].value
    })

    data.push({
      "hour": hour,
      ...d
    })
  })

  const xKey = 'hour'
  const labels = stapeldrukteDatas.map(stapeldrukteData => stapeldrukteData.label)
  const colors = stapeldrukteDatas.map(stapeldrukteData => stapeldrukteData.color || 'black')
  return (
    <ResponsiveContainer width="90%" height={175}>
      <LineChart
        className="bg-white w-full"
        data={data}
      >
        <XAxis dataKey={xKey} />
        <YAxis domain={[0, 'auto']} />
        <Tooltip formatter={(value: number) => value.toFixed(2)} />
        <Legend
          layout="horizontal"
          verticalAlign="bottom"
          align="left"
        />

        {labels.map((_, index) => {
          return <Line
            key={index}
            type="monotone"
            dataKey={labels[index]} stroke={colors[index]} animationDuration={400}
          />
        })}

      </LineChart>
    </ResponsiveContainer>
  );
}