import type { ComponentPropsWithoutRef } from "react";

type ContainerProps = ComponentPropsWithoutRef<"div">;

/** Centres content at the site max-width with responsive side gutters. */
export function Container({ className = "", ...props }: ContainerProps) {
  return (
    <div
      className={`mx-auto w-full max-w-site px-gutter ${className}`}
      {...props}
    />
  );
}
