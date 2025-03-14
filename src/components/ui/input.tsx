
import * as React from "react"

import { cn } from "@/lib/utils"

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  fileUploadLabel?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, fileUploadLabel, ...props }, ref) => {
    if (type === "file") {
      return (
        <div className="relative">
          <input
            type={type}
            className="absolute inset-0 opacity-0 w-full h-full cursor-pointer z-10"
            ref={ref}
            {...props}
          />
          <div className={cn(
            "flex h-11 w-full rounded-lg border border-input bg-background px-4 py-2 text-sm ring-offset-background transition-all duration-200 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-within:border-primary focus-within:ring-1 focus-within:ring-primary disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer",
            className
          )}>
            <span className="flex items-center overflow-hidden whitespace-nowrap overflow-ellipsis">
              {fileUploadLabel || "Choose file..."}
            </span>
          </div>
        </div>
      )
    }

    return (
      <input
        type={type}
        className={cn(
          "flex h-11 w-full rounded-lg border border-input bg-background px-4 py-2 text-base ring-offset-background transition-all duration-200 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
