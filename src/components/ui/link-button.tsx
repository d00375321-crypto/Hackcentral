import * as React from "react"
import Link from "next/link"

import { cn } from "@/lib/utils"
import { buttonVariants, type ButtonProps } from "@/components/ui/button"

interface LinkButtonProps extends ButtonProps {
  href: string
}

const LinkButton = React.forwardRef<
  HTMLAnchorElement,
  LinkButtonProps
>(({ className, variant, size, href, children, ...props }, ref) => {
  return (
    <Link
      href={href}
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      {...props}
    >
      {children}
    </Link>
  )
})
LinkButton.displayName = "LinkButton"

export { LinkButton }
