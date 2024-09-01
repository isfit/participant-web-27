export function checkErrorField (label: string, errorFields: string[]) {
  console.log(label, errorFields);
  return (
    <p style={{color: "red", fontWeight: "bold"}}>
      {errorFields.includes(label) ? '*' : ''}
    </p>
    );
}

export default checkErrorField;