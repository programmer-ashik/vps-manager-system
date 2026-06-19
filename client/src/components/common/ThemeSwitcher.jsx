import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { toggleMode, setAccent } from "../../features/theme/themeSlice";

export default function ThemeSwitcher() {
  const dispatch = useAppDispatch();
  const { mode, accent } = useAppSelector((s) => s.theme);

  return (
    <div className='flex items-center gap-2'>
      <button
        className='px-3 py-1.5 rounded-md bg-accent-500 text-white hover:bg-accent-600 transition-colors focus:outline-none focus:ring-2 focus:ring-accent-500 focus:ring-offset-2 dark:focus:ring-offset-neutral-900 text-sm font-medium'
        onClick={() => dispatch(toggleMode())}
        aria-label={`Switch to ${mode === "dark" ? "light" : "dark"} mode`}
      >
        {mode === "dark" ? "☀️" : "🌙"}
      </button>
      <select
        className='bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 px-2 py-1.5 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-accent-500 focus:ring-offset-2 dark:focus:ring-offset-neutral-900 text-neutral-900 dark:text-neutral-100'
        value={accent}
        onChange={(e) => dispatch(setAccent(e.target.value))}
        aria-label='Select accent color'
      >
        <option value='blue'>Blue</option>
        <option value='emerald'>Emerald</option>
        <option value='violet'>Violet</option>
      </select>
    </div>
  );
}
