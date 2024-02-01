import React from 'react';
import '../styles/Login.css'
import environment from '../environment.js';
import Cookies from 'universal-cookie';
import bcrypt from 'bcryptjs'
import { Navigate } from 'react-router-dom';

export class Login extends React.Component {
    constructor(props) {
        super(props)
        this.state = { username: "", password: "", redirect: false, redirectLocation: "/", errorMessage: "" }
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
            this.setState({
                errorMessage: Error
            })
        }
        else {
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: this.state.username
                })
            };
            let response = await fetch(`http://${environment.BackendLocation}:${environment.BackendPort}/login`, requestOptions)
                    .catch(error => {
                        console.log(error)
                    });
            if (response.ok) {
                let responseJSON = await response.json()
                const requestOptions = {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        username: this.state.username,
                        password: bcrypt.hashSync(this.state.password, responseJSON.salt)
                    })
                }
                response = await fetch(`http://${environment.BackendLocation}:${environment.BackendPort}/login`, requestOptions)
                    .catch(error => {
                        console.log(error)
                    })
                if (response) {
                    let responseJSON = await response.json()
                    if (responseJSON.success) {
                        this.setState({ //Make window redirect
                            redirect: true
                        });
                        const cookies = new Cookies();
                        cookies.set( //Set auth token, expiry in a month
                            "token", responseJSON.token, { path: '/', maxAge: 60*60*24*30 }
                        )
                    } else {
                        this.setState({
                            errorMessage: "Either username or password is wrong."
                        })
                    }
                }
            }
        }
    }

    routeChange = () => {
        this.setState({
            redirectLocation: "/register",
            redirect: true
        })
    }

    renderRedirect() {
        if (this.state.redirect) {
            return <Navigate to={this.state.redirectLocation} />
        }
    }

    renderError = () => {
        if (this.state.errorMessage !== "") {
            return <div className='errorMessage'>
                <p>
                    {this.state.errorMessage}
                </p>
            </div>
        }
    }

    render() {
        const cookies = new Cookies();
        if (cookies.get('token')) {
            const requestOptions = {
                method: 'GET',
                headers: { 'Content-Type': 'application/json', 'token': cookies.get('token') }
            }
            fetch(`http://${environment.BackendLocation}:${environment.BackendPort}/verifyToken`, requestOptions).then((res) => {
                res.json().then(e => {
                    if (e.success) { //User already has a valid token
                        this.setState({ //Make window redirect
                            redirect: true
                            })
                        }
                    })
                }).catch(e => {
                    console.log("Could not connect to backend")
                })
        }
        return (
            <div className='LoginRoot'>
                <form onSubmit={this.handleSubmit} className='inputBox' autoComplete="off">
                    <div className='title'>
                        <h1>WELCOME</h1> 
                        <h1>BACK</h1> 
                    </div>
                    <div>
                        <p>Username</p>
                        <input type="text" id="username" name="username" value={ this.state.username } onChange={this.handleInputChange} data-testid="Username" />
                    </div>
                    <div>
                        <p>Password</p >
                        <input type="password" name="password" value={ this.state.password } onChange={this.handleInputChange} data-testid="Password" />
                    </div>
                    <div>
                        <input type="submit" value="Log in" className='loginButton' data-testid="SubmitButton" />
                    </div>
                    {this.renderError()}
                    <div className='registerDiv'>
                        <p>
                            Or haven't created an account yet?
                        </p>
                        <button onClick={this.routeChange} data-testid="RegisterButton">
                            Register
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
    if (!state.username) { //Username empty
        return [false, "Username can't be empty"];
    }
    if (!state.password) { //Password empty
        return [false, "Password can't be empty"];
    }
    else {
        return [true, ""];
    }
}