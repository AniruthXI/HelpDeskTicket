// src/components/ui/Input.jsx
export const Input = ({ label, error, className = '', ...props }) => {
  return (
    <div className="w-full space-y-2">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <input
        className={`
          w-full px-4 py-2.5 
          bg-gray-50
          border border-gray-300 
          rounded-lg
          text-gray-900 
          placeholder:text-gray-400
          focus:border-blue-500 focus:ring-1 focus:ring-blue-500
          disabled:opacity-50 disabled:cursor-not-allowed
          transition-colors
          ${className}
        `}
        {...props}
      />
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};