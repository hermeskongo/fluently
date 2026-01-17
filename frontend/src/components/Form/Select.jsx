export const Select = ({name, value, label, id, onChange, defaultValue, options = []}) => {
  return (
    <div className='form-control my-2'>
        <label htmlFor={id} className='label'>
            <span className="label-text">{label}</span>    
        </label>  
        <select 
            value={value}
            name={name}
            className="select select-bordered w-full"
            onChange={onChange}
            id={id}
        >
            <option value="" disabled> 
                {defaultValue}
            </option>
            
            {options.map((option, idx) => (
                <option key={`${option}-${idx}`} value={option.toLowerCase()}>
                    {option}
                </option>
            ))}
        </select>
    </div>
  )
}