'use client'

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface ChartData {
  date: string
  hours: number
}

export function WeeklyChart({ data }: { data: ChartData[] }) {
  return (
    <Card className="col-span-4 shadow-sm border-slate-200 dark:border-slate-800 dark:bg-slate-950">
      <CardHeader>
        <CardTitle className="text-slate-900 dark:text-white">Weekly Study Trend</CardTitle>
        <CardDescription>Your focused study hours over the last 7 days.</CardDescription>
      </CardHeader>
      <CardContent className="pl-0 pb-4">
        <div className="h-[300px] w-full mt-4 pr-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" opacity={0.2} />
              <XAxis 
                dataKey="date" 
                stroke="#64748b" 
                fontSize={12} 
                tickLine={false} 
                axisLine={false} 
                dy={10}
              />
              <YAxis 
                stroke="#64748b" 
                fontSize={12} 
                tickLine={false} 
                axisLine={false} 
                tickFormatter={(value) => `${value}h`}
              />
              <Tooltip 
                cursor={{ fill: 'rgba(148, 163, 184, 0.1)' }}
                contentStyle={{ borderRadius: '8px', border: 'none', backgroundColor: '#1e293b', color: '#fff' }}
                // FIX: Changed 'value: number' to 'value: any' to satisfy TypeScript
                formatter={(value: any) => [`${value} hours`, 'Studied']}
              />
              <Bar 
                dataKey="hours" 
                fill="#3b82f6" 
                radius={[4, 4, 0, 0]} 
                barSize={40}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}