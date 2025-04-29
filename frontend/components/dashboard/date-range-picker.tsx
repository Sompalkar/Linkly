"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"

type DateRange = {
  from: Date | undefined
  to: Date | undefined
}

type DateRangePickerProps = {
  onRangeChange?: (range: { startDate?: string; endDate?: string }) => void
}

export function DateRangePicker({ onRangeChange }: DateRangePickerProps) {
  const [date, setDate] = useState<DateRange>({
    from: undefined,
    to: undefined,
  })
  const [isOpen, setIsOpen] = useState(false)

  const handleSelect = (range: DateRange) => {
    setDate(range)

    if (range.from && range.to && onRangeChange) {
      onRangeChange({
        startDate: format(range.from, "yyyy-MM-dd"),
        endDate: format(range.to, "yyyy-MM-dd"),
      })
    }
  }

  const handleApply = () => {
    setIsOpen(false)

    if (date.from && date.to && onRangeChange) {
      onRangeChange({
        startDate: format(date.from, "yyyy-MM-dd"),
        endDate: format(date.to, "yyyy-MM-dd"),
      })
    }
  }

  const handleClear = () => {
    setDate({ from: undefined, to: undefined })
    if (onRangeChange) {
      onRangeChange({ startDate: undefined, endDate: undefined })
    }
  }

  // Predefined date ranges
  const setLastWeek = () => {
    const today = new Date()
    const lastWeek = new Date(today)
    lastWeek.setDate(today.getDate() - 7)

    const range = { from: lastWeek, to: today }
    setDate(range)

    if (onRangeChange) {
      onRangeChange({
        startDate: format(lastWeek, "yyyy-MM-dd"),
        endDate: format(today, "yyyy-MM-dd"),
      })
    }
  }

  const setLastMonth = () => {
    const today = new Date()
    const lastMonth = new Date(today)
    lastMonth.setMonth(today.getMonth() - 1)

    const range = { from: lastMonth, to: today }
    setDate(range)

    if (onRangeChange) {
      onRangeChange({
        startDate: format(lastMonth, "yyyy-MM-dd"),
        endDate: format(today, "yyyy-MM-dd"),
      })
    }
  }

  return (
    <div className="flex items-center space-x-2">
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn("justify-start text-left font-normal", !date.from && "text-muted-foreground")}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date.from ? (
              date.to ? (
                <>
                  {format(date.from, "MMM d, yyyy")} - {format(date.to, "MMM d, yyyy")}
                </>
              ) : (
                format(date.from, "MMM d, yyyy")
              )
            ) : (
              <span>Select date range</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <div className="p-3 border-b">
            <div className="flex justify-between items-center">
              <h3 className="font-medium">Select date range</h3>
              <Button variant="ghost" size="sm" onClick={handleClear}>
                Clear
              </Button>
            </div>
            <div className="flex gap-2 mt-2">
              <Button variant="outline" size="sm" onClick={setLastWeek}>
                Last 7 days
              </Button>
              <Button variant="outline" size="sm" onClick={setLastMonth}>
                Last 30 days
              </Button>
            </div>
          </div>
          <Calendar
            mode="range"
            selected={date}
            onSelect={(range: any) => handleSelect(range)}
            numberOfMonths={2}
            defaultMonth={new Date()}
          />
          <div className="p-3 border-t flex justify-end">
            <Button size="sm" onClick={handleApply}>
              Apply
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
