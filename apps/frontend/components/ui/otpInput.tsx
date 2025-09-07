import * as React from "react"
import { cn } from "@/lib/utils"
import { Input } from "./input" // your existing Input

interface OtpInputProps {
  length?: number
  value: string
  onChange: (value: string) => void
  className?: string
}

export function OtpInput({ length = 6, value, onChange, className }: OtpInputProps) {
  const inputsRef = React.useRef<Array<HTMLInputElement | null>>([])
  const handleChange = (val: string, idx: number) => {
    const digit = val.replace(/\D/g, "")
  

    if (val === "") {
      const newValue =
        value.substring(0, idx) + "" + value.substring(idx + 1)
      onChange(newValue)
      return
    }
    if (!digit) return
  
    const newValue =
      value.substring(0, idx) + digit + value.substring(idx + 1)
    onChange(newValue)
  
    if (digit && idx < length - 1) {
      inputsRef.current[idx + 1]?.focus()
    }
  }
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, idx: number) => {
    if (e.key === "Backspace" && !value[idx] && idx > 0) {
      inputsRef.current[idx - 1]?.focus()
    }
  }

  return (
    <div className={cn("flex gap-2", className)}>
      {Array.from({ length }).map((_, idx) => (
        <Input
  key={idx}
  ref={(el) => {
    inputsRef.current[idx] = el
  }}
  type="text"
  inputMode="numeric"
  maxLength={1}
  value={value[idx] || ""}
  onChange={(e) => handleChange(e.target.value, idx)}
  onKeyDown={(e) => handleKeyDown(e, idx)}
  className="w-10 h-12 text-center text-lg font-medium"
/>
      ))}
    </div>
  )
}
