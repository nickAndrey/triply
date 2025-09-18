export function DividerWithText({ text }: { text: string }) {
  return (
    <div className="relative my-6">
      <hr />
      <span className="absolute left-1/2 -translate-x-1/2 -top-3 bg-card px-2 text-sm text-card-foreground">
        {text}
      </span>
    </div>
  );
}
