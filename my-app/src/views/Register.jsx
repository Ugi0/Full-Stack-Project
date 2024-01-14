import React from 'react'
import '../styles/Login.css'
import environment from '../environment.js';


export class Register extends React.Component {
    constructor(props) {
        super(props)
        this.state = { username: "", email: "", password: "", passwordCheck: "" }
    }

    // Handle changing the values of the inputs and save to state
    handleInputChange = (event) => {
        const { name, value } = event.target;
        this.setState({
          [name]: value,
        });
        event.preventDefault();
      };

    // Handle submitting the form. Meaning sending to the backend for checking
    handleSubmit = async (event) => {
        event.preventDefault();
        const [valid, Error] = validate(this.state);
        if (!valid) { //Inputs are not valid, display an error to the user
            console.log(Error)
        }
        else {
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: this.state.username,
                    email: this.state.email,
                    password: this.state.password
                })
            };
            const response = await fetch(`http://${environment.BackendLocation}:${environment.BackendPort}/register`, requestOptions)
                .catch(error => {
                    console.log(error)
                });
            if (response) {
                let responseJSON = await response.json()
                if (responseJSON.result === 'success') {
                    console.log("Success");
                } else {
                    console.log("Failure");
                    console.log(responseJSON.error);
                }
            }
        }
    }

    render() {
        return (
            <div className='LoginRoot'>
                <form onSubmit={this.handleSubmit} className='inputBox' autoComplete="off">
                    <div>
                        <label>Username</label>
                        <input type="text" id="username" name="username" value={ this.state.username } onChange={this.handleInputChange} />
                    </div>
                    <div>
                        <label>email</label>
                        <input type="text" id="email" name="email" value={ this.state.email } onChange={this.handleInputChange} />
                    </div>
                    <div>
                        <label>Password</label >
                        <input type="password" id="password" name="password" value={ this.state.password } onChange={this.handleInputChange} />
                    </div>
                    <div>
                        <label>Type the same password again</label >
                        <input type="password" id="passwordCheck" name="passwordCheck" value={ this.state.passwordCheck } onChange={this.handleInputChange} />
                    </div>
                    <div>
                        <input type="submit" value="Register" />
                    </div>

                </form>
            </div>
        ); 
    }
}

function validate(state) {
    // eslint-disable-next-line no-useless-escape
    let regexp = new RegExp("^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$"); //Regex to test for at least 8 characters, one letter and one number
    if (!state.username) { //Username empty
        return [false, "Username can't be empty"];
    }
    if (!state.email) { //Email empty
        return [false, "Email can't be empty"];
    }
    if (!state.password) { //Password empty
        return [false, "Password can't be empty"];
    }
    if (!regexp.test(state.password)) { //Passwords doesn't pass the requirements
        return [false, "Password doesn't pass the requirements. At least 8 characters, a letter and a number is needed."];
    }
    if (!(state.password === state.passwordCheck)) { //Passwords not equal
        return [false, "Passwords don't match"];
    }
    else {
        return [true, ""];
    }
}