import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';

const Input = forwardRef(
  ({
    id,
    label,
    type = 'text',
    error,
    className = '',
    ...props
  }, ref) => {
    const errorStyles = 'border-red-500 focus:border-red-500 focus:ring-red-200';
    const baseStyles = 'block w-full px-4 py-2.5 border border-slate-300 rounded-lg shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-primary sm:text-sm transition-all duration-300';

    const combinedClassName = [baseStyles, error ? errorStyles : '', className].join(' ');

    return (
      <div>
        {label && (
          <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
            {label} 
          </label>
        )}
        <input id={id} type={type} ref={ref} className={combinedClassName} {...props} />
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';

Input.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string,
  type: PropTypes.string,
  error: PropTypes.string,
  className: PropTypes.string,
};

export default Input;