"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DateRangePicker } from "@/components/dashboard/date-range-picker"
import { Search, X } from "lucide-react"

type LinksFilterProps = {
  onFilterChange?: (filters: {
    search?: string
    status?: string
    dateRange?: { startDate?: string; endDate?: string }
  }) => void
}

export function LinksFilter({ onFilterChange }: LinksFilterProps) {
  const [search, setSearch] = useState("")
  const [status, setStatus] = useState<string>("")
  const [dateRange, setDateRange] = useState<{
    startDate?: string
    endDate?: string
  }>({})
  const [isFiltersVisible, setIsFiltersVisible] = useState(false)

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value)
    if (onFilterChange) {
      onFilterChange({
        search: e.target.value,
        status,
        dateRange,
      })
    }
  }

  const handleStatusChange = (value: string) => {
    setStatus(value)
    if (onFilterChange) {
      onFilterChange({
        search,
        status: value,
        dateRange,
      })
    }
  }

  const handleDateRangeChange = (range: { startDate?: string; endDate?: string }) => {
    setDateRange(range)
    if (onFilterChange) {
      onFilterChange({
        search,
        status,
        dateRange: range,
      })
    }
  }

  const clearFilters = () => {
    setSearch("")
    setStatus("")
    setDateRange({})
    if (onFilterChange) {
      onFilterChange({})
    }
  }

  const hasActiveFilters = search || status || dateRange.startDate || dateRange.endDate

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search links..." value={search} onChange={handleSearchChange} className="pl-10" />
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setIsFiltersVisible(!isFiltersVisible)}
            className="whitespace-nowrap"
          >
            {isFiltersVisible ? "Hide Filters" : "Show Filters"}
          </Button>
          {hasActiveFilters && (
            <Button variant="ghost" onClick={clearFilters} className="whitespace-nowrap">
              <X className="h-4 w-4 mr-1" />
              Clear Filters
            </Button>
          )}
        </div>
      </div>

      {isFiltersVisible && (
        <div className="flex flex-col md:flex-row gap-4 p-4 border rounded-lg bg-muted/30">
          <div className="flex-1">
            <label className="text-sm font-medium mb-2 block">Status</label>
            <Select value={status} onValueChange={handleStatusChange}>
              <SelectTrigger>
                <SelectValue placeholder="All statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex-1">
            <label className="text-sm font-medium mb-2 block">Created Date</label>
            <DateRangePicker onRangeChange={handleDateRangeChange} />
          </div>
        </div>
      )}
    </div>
  )
}
