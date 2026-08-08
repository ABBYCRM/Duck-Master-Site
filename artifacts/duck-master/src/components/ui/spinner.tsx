import { cn } from '@/lib/utils';
import { Loader2Icon, type LucideProps } from 'lucide-react';

// Use LucideProps directly so the spread is type-compatible with Loader2Icon,
// avoiding false positives from duplicate @types/react versions in the monorepo.
function Spinner({ className, ...props }: LucideProps) {
  return (
    <Loader2Icon
      role="status"
      aria-label="Loading"
      className={cn('size-4 animate-spin', className)}
      {...props}
    />
  );
}

export { Spinner };
