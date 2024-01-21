import React from 'react'
import '../styles/Login.css'
import environment from '../environment.js';
import Cookies from 'universal-cookie';
import bcrypt from 'bcryptjs'
import { Navigate } from 'react-router-dom';

export class Register extends React.Component {
    constructor(props) {
        super(props)
        this.state = { username: "", email: "", password: "", passwordCheck: "", redirect: false, redirectLocation: '/', errorMessage: ""}
    }

    // Handle changing the values of the inputs and save to state
    handleInputChange = (event) => {
        const { name, value } = event.target;
        this.setState({
          [name]: value,
        });
        event.preventDefault();
      };

    // Handle submitting the form
    handleSubmit = async (event) => {
        event.preventDefault();
        const [valid, Error] = validate(this.state);
        if (!valid) { //Inputs are not valid, display an error to the user
            console.log(Error)
            this.setState({
                errorMessage: Error
            })
        }
        else {
            const salt = bcrypt.genSaltSync(10)
            const hashedPassword = bcrypt.hashSync(this.state.password, salt)
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: this.state.username,
                    email: this.state.email,
                    password: hashedPassword,
                    salt: salt
                })
            };
            const response = await fetch(`http://${environment.BackendLocation}:${environment.BackendPort}/register`, requestOptions)
                .catch(error => {
                    console.log(error)
                });
            if (response) {
                let responseJSON = await response.json()
                if (responseJSON.success) { //User was created successfully
                    const cookies = new Cookies();
                    cookies.set( //Set auth token, expiry in a month
                        "token", responseJSON.token, { path: '/', maxAge: 60*60*24*30 }
                    )
                    this.setState({ //Make window redirect
                        redirect: true
                    })
                } else {
                    this.setState({
                        errorMessage: responseJSON.error
                    })
                }
            }
        }
    }

    renderRedirect() {
        if (this.state.redirect) {
            return <Navigate to={this.state.redirectLocation} />
        }
    }

    routeChange = () => {
        this.setState({
            redirectLocation: "/login",
            redirect: true
        })
    }

    renderError() {
        if (this.state.errorMessage !== "") {
            return <div className='errorMessage'>
                <p>
                    {this.state.errorMessage}
                </p>
            </div>
        }
    }

    render() {
        return (
            <div className='LoginRoot'>
                <form onSubmit={this.handleSubmit} className='inputBox' autoComplete="off">
                    <div>
                        <h1>
                            WELCOME
                        </h1>
                    </div>
                    <div>
                        <p>Username</p>
                        <input type="text" id="username" name="username" value={ this.state.username } onChange={this.handleInputChange} />
                    </div>
                    <div>
                        <p>Email</p>
                        <input type="text" id="email" name="email" value={ this.state.email } onChange={this.handleInputChange} />
                    </div>
                    <div>
                        <p>Password</p>
                        <input type="password" id="password" name="password" value={ this.state.password } onChange={this.handleInputChange} />
                    </div>
                    <div>
                        <p>Type the same password again</p>
                        <input type="password" id="passwordCheck" name="passwordCheck" value={ this.state.passwordCheck } onChange={this.handleInputChange} />
                    </div>
                    <div>
                        <input type="submit" value="Register"  className='loginButton'/>
                    </div>
                    {this.renderError()}
                    <div className='registerDiv'>  
                        <p> Already got an account?</p>
                        <button onClick={this.routeChange}>
                            Log in
                        </button>
                    </div>
                </form>
                {this.renderRedirect()}
            </div>
        ); 
    }
}

function validate(state) {
    if (state.redirect) {
        return [false, ""]
    }
    // eslint-disable-next-line no-useless-escape
    let regexp = new RegExp(".{8,}?.*[0-9]"); //Regex to test for at least 8 characters, one letter and one number
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
        return [false, "Password has to be at least 8 characters and include a number."];
    }
    if (!(state.password === state.passwordCheck)) { //Passwords not equal
        return [false, "Passwords don't match"];
    }
    else {
        return [true, ""];
    }
}