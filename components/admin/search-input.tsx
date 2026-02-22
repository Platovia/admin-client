"use client"

import { useEffect, useState, useCallback } from "react"
import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { Search, X } from "lucide-react"
import { Input } from "@/components/ui/input"

interface SearchInputProps {
  placeholder?: string
  paramName?: string
}

export function SearchInput({ placeholder = "Search...", paramName = "search" }: SearchInputProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [value, setValue] = useState(searchParams.get(paramName) || "")

  useEffect(() => {
    setValue(searchParams.get(paramName) || "")
  }, [searchParams, paramName])

  const updateSearch = useCallback(
    (search: string) => {
      const params = new URLSearchParams(searchParams.toString())
      if (search) {
        params.set(paramName, search)
      } else {
        params.delete(paramName)
      }
      params.delete("page") // Reset to page 1 on new search
      router.push(`${pathname}?${params.toString()}`)
    },
    [router, pathname, searchParams, paramName]
  )

  useEffect(() => {
    const timeout = setTimeout(() => {
      const current = searchParams.get(paramName) || ""
      if (value !== current) {
        updateSearch(value)
      }
    }, 300)
    return () => clearTimeout(timeout)
  }, [value, updateSearch, searchParams, paramName])

  return (
    <div className="relative w-full max-w-sm">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder={placeholder}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="pl-9 pr-8"
      />
      {value && (
        <button
          onClick={() => {
            setValue("")
            updateSearch("")
          }}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  )
}
