import * as React from "react";

import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "custom-gradient-border flex h-10 w-full rounded-md border-2 border-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };

// import * as React from "react";

// import { cn } from "@/lib/utils";

// const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
//   ({ className, type, ...props }, ref) => {
//     return (
//       <div className="relative">
//         <div className="p-0.5 relative z-20 rounded-lg bg-gradient-to-r from-[#f97316] via-[#e11d48] to-[#3e45cb]">
//           <input
//             type={type}
//             className={cn(
//               "relative z-30 flex h-9 w-full rounded-md dark:border-input bg-background px-3 py-1 text-base transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
//               className
//             )}
//             ref={ref}
//             {...props}
//           />
//         </div>
//       </div>
//     );
//   }
// );
// Input.displayName = "Input";

// export { Input };
