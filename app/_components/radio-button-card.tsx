import { Label } from '@/chadcn/components/ui/label';
import { RadioGroupItem } from '@/chadcn/components/ui/radio-group';
import { RadioGroupItemProps } from '@radix-ui/react-radio-group';
import { ReactNode } from 'react';

type Props = RadioGroupItemProps & {
  title: string;
  description: string;
  icon?: ReactNode;
};

export function RadioButtonCard({ icon, title, description, ...inputProps }: Props) {
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
      <RadioGroupItem {...inputProps} />

      <div className="grid gap-2 font-normal">
        {icon}
        <p className="text-sm leading-none font-medium text-foreground">{title}</p>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </Label>
  );
}
