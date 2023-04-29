import { Link } from "react-router-dom";

function Error(props){
    return (
        <div className="container">
            <h1 className="error-title">{props.title}</h1>
            <p className="error-message">{props.message}</p>
            <Link className="error-link" to="/">Go back to homepage</Link>
        </div>
    );
}

export default Error;