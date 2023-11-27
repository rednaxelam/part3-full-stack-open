const SuccessMessage = ({textContent}) => {
  if (textContent === null) return <></>;
  else {
    return (
    <div className="success-message">
      {textContent}
    </div>
    )
  } 
}

export default SuccessMessage