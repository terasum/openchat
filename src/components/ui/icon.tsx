import { ComponentPropsWithoutRef, RefAttributes, forwardRef } from "react";
export interface IconProps
  extends ComponentPropsWithoutRef<"svg">,
    RefAttributes<SVGSVGElement> {
  src: string;
  className?: string;
}

import { cn } from "@/lib/utils";

export type Icon = React.ForwardRefExoticComponent<IconProps>;

export const Icon = forwardRef(
  (props: IconProps, ref: React.ForwardedRef<HTMLImageElement>) => {
    return <img ref={ref} src={props.src} className={cn(props.className)} />;
  }
);
