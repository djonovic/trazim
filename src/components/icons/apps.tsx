import type { SVGProps } from "react";
import {
  siInstagram,
  siViber,
  siWhatsapp,
  type SimpleIcon,
} from "simple-icons";
import { cn } from "@/lib/utils";

type IconProps = SVGProps<SVGSVGElement>;

/** Official brand marks from Simple Icons (CC0), in the brand colour. */
function BrandIcon({
  icon,
  className,
  ...props
}: IconProps & { icon: SimpleIcon }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill={`#${icon.hex}`}
      aria-hidden
      className={cn("shrink-0", className)}
      {...props}
    >
      <path d={icon.path} />
    </svg>
  );
}

export function ViberIcon(props: IconProps) {
  return <BrandIcon icon={siViber} {...props} />;
}

export function WhatsAppIcon(props: IconProps) {
  return <BrandIcon icon={siWhatsapp} {...props} />;
}

export function InstagramIcon(props: IconProps) {
  return <BrandIcon icon={siInstagram} {...props} />;
}
