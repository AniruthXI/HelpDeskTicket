// src/components/ui/Button.jsx
export const Button = ({ children, variant = 'primary', ...props }) => {
    const variants = {
      primary: 'bg-blue-500 hover:bg-blue-600 text-white',
      secondary: 'bg-gray-500 hover:bg-gray-600 text-white',
      danger: 'bg-red-500 hover:bg-red-600 text-white'
    };
  
    return (
      <button
        className={`px-4 py-2 rounded-md transition-colors ${variants[variant]}`}
        {...props}
      >
        {children}
      </button>
    );
  };