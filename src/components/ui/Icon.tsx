import {
  Armchair,
  CalendarHeart,
  Camera,
  Clock,
  Crown,
  Flower2,
  Gem,
  Hammer,
  Handshake,
  Heart,
  Lamp,
  Leaf,
  Palette,
  ShieldCheck,
  Sparkles,
  Star,
  Tent,
  Truck,
  type LucideIcon,
  type LucideProps,
} from 'lucide-react';
import type { IconName } from '../../types/site';

/** Maps icon names used in siteData.ts to icon components (keeps the bundle small). */
const icons: Record<IconName, LucideIcon> = {
  crown: Crown,
  flower: Flower2,
  sparkles: Sparkles,
  lamp: Lamp,
  gem: Gem,
  heart: Heart,
  palette: Palette,
  truck: Truck,
  hammer: Hammer,
  shieldCheck: ShieldCheck,
  clock: Clock,
  star: Star,
  tent: Tent,
  armchair: Armchair,
  camera: Camera,
  calendar: CalendarHeart,
  handshake: Handshake,
  leaf: Leaf,
};

export function Icon({ name, ...props }: { name: IconName } & LucideProps) {
  const Component = icons[name] ?? Sparkles;
  return <Component aria-hidden="true" {...props} />;
}
