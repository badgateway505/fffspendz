type RecordingBadgeProps = {
  active: boolean;
  label?: string;
};

export function RecordingBadge({ active, label = 'Recording' }: RecordingBadgeProps) {
  return (
    <div
      className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-semibold transition ${
        active
          ? 'bg-coral text-ink-900 shadow-lg shadow-coral/40'
          : 'bg-ink-700/70 text-ink-200'
      }`}
    >
      <span className="relative flex h-3.5 w-3.5 items-center justify-center">
        <span
          className={`absolute h-2 w-2 rounded-full ${
            active ? 'bg-white' : 'bg-ink-500'
          }`}
        />
        {active && <span className="recording-ring" />}
      </span>
      <span>{active ? label : 'Mic off'}</span>
    </div>
  );
}

export default RecordingBadge;
