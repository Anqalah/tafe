// Pastikan menggunakan ekspor yang benar
export const InputForm = ({
  label,
  type,
  placeholder,
  name,
  value,
  onChange,
}) => (
  <div className="mb-4">
    <label className="block text-gray-700 text-sm font-bold mb-2">
      {label}
    </label>
    <input
      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      type={type}
      placeholder={placeholder}
      name={name}
      value={value}
      onChange={onChange} // Perhatikan huruf besar 'C' di onChange
    />
  </div>
);

export const TextareaForm = ({ label, rows = 3, ...props }) => {
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-[#2A4365]">
          {label}
        </label>
      )}
      <textarea
        {...props}
        rows={rows}
        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-[#2A4365] transition-all"
      />
    </div>
  );
};

export const SelectForm = ({ label, options, ...props }) => {
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-[#2A4365]">
          {label}
        </label>
      )}
      <select
        {...props}
        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-[#2A4365] transition-all"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};
