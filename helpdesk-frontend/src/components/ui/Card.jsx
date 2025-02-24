// src/components/ui/Card.jsx
export const Card = ({ children, className = '', ...props }) => {
    return (
      <div
        className={`bg-white rounded-lg shadow-md p-4 ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  };