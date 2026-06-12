import { Construction } from 'lucide-react';

interface Props {
  title: string;
  description?: string;
}

export default function PlaceholderPage({ title, description }: Props) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
      <div className="w-16 h-16 rounded-2xl bg-[var(--gold-dim)] flex items-center justify-center mb-4">
        <Construction className="w-8 h-8 text-[var(--gold)]" />
      </div>
      <h2 className="text-xl font-bold text-pri">{title}</h2>
      {description && <p className="text-sm text-sec mt-2 max-w-md">{description}</p>}
    </div>
  );
}
