'use client'

import { Card, CardContent } from '@/components/ui/card'
import { ArrowUp2, ArrowDown2, Icon } from 'iconsax-react'

export interface DashboardCardTrend {
  value:    string
  positive: boolean
}

interface DashboardCardProps {
  icon:    Icon
  label:   string
  value:   string
  helper?: string
  trend?:  DashboardCardTrend
}

export default function DashboardCard({ icon: IconCmp, label, value, helper, trend }: DashboardCardProps) {
  return (
    <Card className="bg-card border border-border hover:border-primary/40 hover:shadow-md transition-all">
      <CardContent className="pt-6 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center">
            <IconCmp size={20} color="currentColor" className="text-primary" />
          </div>
          {trend && (
            <span
              className={`flex items-center gap-0.5 text-xs font-semibold ${
                trend.positive ? 'text-primary' : 'text-destructive'
              }`}
            >
              {trend.positive
                ? <ArrowUp2 size={12} color="currentColor" />
                : <ArrowDown2 size={12} color="currentColor" />}
              {trend.value}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-0.5">
          <span className="text-2xl font-bold text-foreground leading-none">{value}</span>
          <span className="text-sm text-muted-foreground">{label}</span>
        </div>

        {helper && (
          <p className="text-xs text-muted-foreground/80 leading-relaxed">{helper}</p>
        )}
      </CardContent>
    </Card>
  )
}