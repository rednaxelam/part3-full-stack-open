const ErrorMessage = ({textContent}) => {
  if (textContent === null) return <></>;
  else {
    return (
    <div className="error-message">
      {textContent}
    </div>
    )
  } 
}

export default ErrorMessage