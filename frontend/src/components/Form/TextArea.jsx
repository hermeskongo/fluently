
export const TextArea = ({name, id,label, placeholder="Veuillez renseigner le champ", required=true, value, setValue}) => {

  return (
    <div className='form-control w-full'>
        <label className='label' htmlFor={id}>
            <span className='label-text'>{label}</span>
        </label>
        <textarea 
            name={name}
            placeholder={placeholder}
            value={value}
            className='textarea w-full min-h-[100px] max-h-[300px]'
            onChange={(e) => setValue(e)}
            required={required}
            wrap='hard'
            id={id}
        />
    </div>
  )
}
