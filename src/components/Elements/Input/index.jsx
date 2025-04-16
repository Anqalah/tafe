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

// Atau jika menggunakan default export
// export default InputForm;
