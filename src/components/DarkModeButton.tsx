import { useDarkMode } from "../hooks/useDarkMode";

const DarkModeButton: React.FC = () => {
  const { isDarkMode, toggle } = useDarkMode();

  return (
    <button
      className="inline-flex rounded bg-gray-700 py-2 px-4 font-bold text-white hover:bg-gray-500 dark:bg-gray-400 dark:text-gray-700 dark:hover:bg-gray-300"
      onClick={() => toggle()}
    >
      {isDarkMode && (
        <svg
          className="h-6 w-6 text-gray-700"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      )}
      {!isDarkMode && (
        <svg
          className="h-6 w-6 text-white"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          strokeWidth="2"
          stroke="currentColor"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path stroke="none" d="M0 0h24v24H0z" />
          <circle cx="12" cy="12" r="4" />
          <path d="M3 12h1M12 3v1M20 12h1M12 20v1M5.6 5.6l.7 .7M18.4 5.6l-.7 .7M17.7 17.7l.7 .7M6.3 17.7l-.7 .7" />
        </svg>
      )}
      <span>{isDarkMode ? "Light" : "Dark"} Mode</span>
    </button>
  );
};

export default DarkModeButton;
