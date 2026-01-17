
export const Input = ({name, label,type='text', placeholder="Veuillez renseigner le champ", required=true, value, setValue}) => {


  return (
    <div className='form-control w-full'>
        <label className='label'>
            <span className='label-text'>{label}</span>
        </label>
        <input 
            name={name}
            type={type}
            placeholder={placeholder}
            className='input input-bordered w-full'
            value={value}
            onChange={(e) => setValue(e)}
            required={required}
        />
        {type==='password' ? (<p className='text-xs opacity-70 mb-5'>Le mot de passe doit contenir au moins 6 caractères.</p>) : <></>}
    </div>
  )
}
