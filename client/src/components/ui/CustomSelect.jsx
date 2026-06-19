import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Controller } from "react-hook-form";

const CustomSelect = ({
  name,
  control,
  options,
  label,
  multi = false,
  value,
  onChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target))
        setIsOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isFormControlled = !!control;

  return (
    <div className='relative w-full' ref={containerRef}>
      <label className='block text-sm font-medium mb-1 text-neutral-700 dark:text-neutral-200'>
        {label}
      </label>

      {isFormControlled ? (
        <Controller
          name={name}
          control={control}
          render={({ field: { onChange: formOnChange, value: formValue } }) => (
            <SelectUI
              options={options}
              value={formValue}
              onChange={formOnChange}
              multi={multi}
              isOpen={isOpen}
              setIsOpen={setIsOpen}
            />
          )}
        />
      ) : (
        <SelectUI
          options={options}
          value={value}
          onChange={onChange}
          multi={multi}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
        />
      )}
    </div>
  );
};

const SelectUI = ({ options, value, onChange, multi, isOpen, setIsOpen }) => {
  const safeValue = multi ? (Array.isArray(value) ? value : []) : value;
  const isSelected = (val) =>
    multi ? safeValue.includes(val) : safeValue === val;

  const toggle = (val) => {
    if (multi) {
      const newValue = isSelected(val)
        ? safeValue.filter((i) => i !== val)
        : [...safeValue, val];
      onChange(newValue);
      console.log("New Selected Values:", newValue);
    } else {
      onChange(val);
      setIsOpen(false);
    }
  };

  const getDisplayLabel = (val) => {
    const opt = options.find((o) => o.value === val);
    return opt ? opt.label : val;
  };

  return (
    <div className='relative'>
      <div
        className='w-full bg-neutral-50 dark:bg-neutral-900 border border-neutral-700 p-3 rounded-xl text-neutral-900 dark:text-white cursor-pointer hover:border-cyan-500 transition-all'
        onClick={() => setIsOpen(!isOpen)}
      >
        {multi
          ? safeValue.length > 0
            ? safeValue.map(getDisplayLabel).join(", ")
            : "Select servers..."
          : getDisplayLabel(safeValue) || "Select server..."}
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.ul
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className='absolute z-50 w-full bg-white dark:bg-neutral-900 border border-neutral-700 mt-2 rounded-xl shadow-2xl overflow-hidden max-h-60 overflow-y-auto'
          >
            {options.map((opt) => (
              <li
                key={opt.value}
                className={`p-3 cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-800 ${
                  isSelected(opt.value)
                    ? "text-cyan-500 bg-neutral-100 dark:bg-neutral-800"
                    : "text-neutral-900 dark:text-white"
                }`}
                onClick={() => toggle(opt.value)}
              >
                {opt.label}
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CustomSelect;
