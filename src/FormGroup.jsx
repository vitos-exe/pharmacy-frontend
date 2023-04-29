function FormGroup(props){
    const field = props.field;
    var type = ['email', 'password'].includes(field) ? field : 'text'; 

    if (props.field === 'confirm-password'){
        type = 'password';
    }

    function changeField(e){
        props.changeState(prevState => {
            prevState[field] = e.target.value;
            return prevState;
        })
    }

    return (
        <div className="form-group">
            <label htmlFor={field}>{field[0].toUpperCase() + field.slice(1)}</label>
            <input type={type} id={field} name={field} required={props.required ? 'r' : ''} onChange={changeField}/>
        </div>
    ); 
}

export default FormGroup;