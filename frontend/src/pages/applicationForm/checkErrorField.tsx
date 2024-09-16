export function checkErrorField (label: string, errorFields: string[]) {
  return (
    <p style={{color: "red", fontWeight: "bold"}}>
      {errorFields.includes(label) ? '*' : ''}
    </p>
    );
}

export default checkErrorField;