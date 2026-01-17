export const Input = ({
  name,
  label,
  type = 'text',
  id,
  placeholder = "Veuillez renseigner le champ",
  required = true,
  value,
  setValue,
  leftIcon: LeftIcon
}) => {

  return (
    <div className='form-control w-full'>
      <label className='label' htmlFor={id}>
        <span className='label-text font-medium'>{label}</span>
      </label>

      <label className={`input input-bordered flex items-center gap-2 w-full ${type === 'password' ? 'mb-1' : ''}`}>
        
        {LeftIcon && (
          <LeftIcon className="size-5 opacity-50 shrink-0" /> 
        )}
        
        <input
          name={name}
          type={type}
          placeholder={placeholder}
          className='grow bg-transparent focus:outline-none'
          value={value}
          onChange={(e) => setValue(e)}
          required={required}
          id={id}
        />
      </label>

      {type === 'password' && (
        <p className='text-xs opacity-70 mt-1 mb-4'>
          Le mot de passe doit contenir au moins 6 caractères.
        </p>
      )}
    </div>
  )
}