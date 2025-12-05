// SECTION: props
interface TextInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

// SECTION: rendering
export function TextInput({ value, onChange, placeholder, disabled }: TextInputProps) {
  // SECTION: events
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <input
      type="text"
      value={value}
      onChange={handleChange}
      placeholder={placeholder || 'Type your expense...'}
      disabled={disabled}
      className="w-full rounded-xl border border-white/10 bg-ink-900/40 px-4 py-3 text-ink-200 placeholder:text-ink-500 focus:border-mint/50 focus:outline-none focus:ring-2 focus:ring-mint/20 disabled:opacity-50 disabled:cursor-not-allowed"
    />
  );
}

