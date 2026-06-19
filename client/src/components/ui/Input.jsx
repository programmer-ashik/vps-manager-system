export default function Input({ label, className = "", ...props }) {
  return (
    <div className='space-y-1.5'>
      {label && (
        <label className='text-neutral-700 dark:text-neutral-200'>
          {label}
        </label>
      )}
      <input
        className={`w-full bg-neutral-50 dark:bg-neutral-900 border border-neutral-700 p-3 rounded-xl text-neutral-700 dark:text-neutral-200 cursor-pointer hover:border-cyan-500 transition-all ${className}`}
        {...props}
      />
    </div>
  );
}
