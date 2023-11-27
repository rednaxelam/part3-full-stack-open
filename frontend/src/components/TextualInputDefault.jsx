const handleTextualInputDefault = (setter) => {
  return e => setter(e.target.value);
}

const TextualInputDefault = ({label, type, nameID, state, setter}) => {
  const handleTextualInput = handleTextualInputDefault(setter);

  return (
    <>
      <label htmlFor={nameID}>{label}:</label>
      <input type={type} name={nameID} id={nameID} value={state} onInput={handleTextualInput}/>
      <br />
    </>
  )
}

export default TextualInputDefault