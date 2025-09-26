import { Checkbox } from '@/chadcn/components/ui/checkbox';
import { Label } from '@/chadcn/components/ui/label';
import { CheckboxProps } from '@radix-ui/react-checkbox';
import { ReactNode } from 'react';

type Props = CheckboxProps & {
  title: string;
  description: string;
  icon?: ReactNode;
};

export function CheckboxButtonCard({ icon, title, description, ...inputProps }: Props) {
  return (
    <Label
      className={`
        hover:bg-accent/50
        bg-secondary
        flex items-start gap-3 rounded-lg border p-3
        has-[[aria-checked=true]]:border-primary
        has-[[aria-checked=true]]:bg-primary/10
        dark:has-[[aria-checked=true]]:border-primary
        dark:has-[[aria-checked=true]]:bg-primary/20
      `}
    >
      <Checkbox {...inputProps} />

      <div className="grid gap-2 font-normal">
        {icon}
        <p className="text-sm leading-none font-medium text-foreground">{title}</p>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </Label>
  );
}
