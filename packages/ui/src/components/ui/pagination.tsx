import React from "react";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react"

import { cn } from '../../lib/utils';
import { ButtonProps, buttonVariants } from "./button"

const Pagination = ({ className, ...props }: React.ComponentProps<"nav">) => (
  <nav
    role="navigation"
    aria-label="pagination"
    className={cn("mx-auto flex w-full justify-center", className)}
    {...props}
  />
)
Pagination.displayName = "Pagination"

type PaginationContentProps = React.ComponentProps<"ul">;


const PaginationContentFunction = (
  { className, ...props }: PaginationContentProps,
  ref: React.Ref<HTMLUListElement>
) => {
  return (
    <ul
      ref={ref}
      className={cn("flex flex-row items-center gap-1", className)}
      {...props}
    />
  );
};

const PaginationContent: React.ForwardRefExoticComponent<PaginationContentProps & React.RefAttributes<HTMLUListElement>> = React.forwardRef(PaginationContentFunction);
PaginationContent.displayName = "PaginationContent";

type PaginationItemProps = React.ComponentProps<"li">;

// Define the component function with explicit types for props and ref
const PaginationItemFunction: React.ForwardRefRenderFunction<HTMLLIElement, PaginationItemProps> = (
  { className, ...props },
  ref
) => (
  <li ref={ref} className={cn("", className)} {...props} />
);

// Now use React.forwardRef with the explicitly typed function
const PaginationItem: React.ForwardRefExoticComponent<PaginationItemProps & React.RefAttributes<HTMLLIElement>> = React.forwardRef(PaginationItemFunction);
PaginationItem.displayName = "PaginationItem";

type PaginationLinkProps = {
  isActive?: boolean
} & Pick<ButtonProps, "size"> &
  React.ComponentProps<"a">

const PaginationLink = ({
  className,
  isActive,
  size = "icon",
  ...props
}: PaginationLinkProps) => (
  <a
    aria-current={isActive ? "page" : undefined}
    className={cn(
      buttonVariants({
        variant: isActive ? "outline" : "ghost",
        size,
      }),
      className
    )}
    {...props}
  />
)
PaginationLink.displayName = "PaginationLink"

const PaginationPrevious = ({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>) => (
  <PaginationLink
    aria-label="Go to previous page"
    size="default"
    className={cn("gap-1 pl-2.5", className)}
    {...props}
  >
    <ChevronLeft className="h-4 w-4" />
    <span>Previous</span>
  </PaginationLink>
)
PaginationPrevious.displayName = "PaginationPrevious"

const PaginationNext = ({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>) => (
  <PaginationLink
    aria-label="Go to next page"
    size="default"
    className={cn("gap-1 pr-2.5", className)}
    {...props}
  >
    <span>Next</span>
    <ChevronRight className="h-4 w-4" />
  </PaginationLink>
)
PaginationNext.displayName = "PaginationNext"

const PaginationEllipsis = ({
  className,
  ...props
}: React.ComponentProps<"span">) => (
  <span
    aria-hidden
    className={cn("flex h-9 w-9 items-center justify-center", className)}
    {...props}
  >
    <MoreHorizontal className="h-4 w-4" />
    <span className="sr-only">More pages</span>
  </span>
)
PaginationEllipsis.displayName = "PaginationEllipsis"

export {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
}