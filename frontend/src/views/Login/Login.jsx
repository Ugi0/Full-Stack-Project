import React, { useState } from 'react';
import './Login.css'
import myConfig from '../../config.js';
import Cookies from 'universal-cookie';
import { Navigate } from 'react-router-dom';

var bcrypt = require('bcryptjs');

function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [redirect, setRedirect] = useState(false);
    const [redirectLocation, setRedirectLocation] = useState("/");
    const [errorMessage, setErrorMessage] = useState("");

    // Handle submitting the form. Meaning sending to the backend for checking
    const handleSubmit = async (event) => {
        event.preventDefault();
        const [valid, Error] = validate({username, password, redirect});
        if (!valid) { //Inputs are not valid, display an error to the user
            setErrorMessage(Error);
        }
        else {
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: username
                })
            };
            let response = await fetch(`${myConfig.http}://${myConfig.BackendLocation}:${myConfig.BackendPort}/login`, requestOptions)
                    .catch(error => {
                        console.log(error)
                    });
            if (response.ok) {
                let responseJSON = await response.json()
                const requestOptions = {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        username: username,
                        password: bcrypt.hashSync(password, responseJSON.salt)
                    })
                }
                response = await fetch(`${myConfig.http}://${myConfig.BackendLocation}:${myConfig.BackendPort}/login`, requestOptions)
                    .catch(error => {
                        console.log(error)
                    })
                if (response) {
                    let responseJSON = await response.json()
                    if (responseJSON.success) {
                        setRedirect(true)
                        const cookies = new Cookies();
                        cookies.set( //Set auth token, expiry in a month
                            "token", responseJSON.token, { path: '/', maxAge: 60*60*24*30 }
                        )
                    } else {
                        setErrorMessage("Either username or password is wrong.")
                    }
                }
            }
        }
    }

    const routeChange = () => {
        setRedirectLocation("/register");
        setRedirect(true);
    }

    const renderRedirect = () => {
        if (redirect) {
            return <Navigate to={redirectLocation} />
        }
    }

    const renderError = () => {
        if (errorMessage !== "") {
            return <div className='errorMessage'>
                <p>
                    {errorMessage}
                </p>
            </div>
        }
    }

    const cookies = new Cookies();
    if (cookies.get('token')) {
        const requestOptions = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json', 'token': cookies.get('token') }
        }
        fetch(`${myConfig.http}://${myConfig.BackendLocation}:${myConfig.BackendPort}/verifyToken`, requestOptions).then((res) => {
            res.json().then(e => {
                if (e.success) { //User already has a valid token
                    setRedirect(true)
                    }
                })
            }).catch(e => {
                console.log("Could not connect to backend")
            })
    }
    return (
        <div className='LoginRoot'>
            <form onSubmit={handleSubmit} className='inputBox' autoComplete="off">
                <div className='title'>
                    <h1>WELCOME</h1> 
                    <h1>BACK</h1> 
                </div>
                <div>
                    <p>Username</p>
                    <input type="text" id="username" name="username" value={ username } onChange={(e) => setUsername(e.target.value)} data-testid="Username" />
                </div>
                <div>
                    <p>Password</p >
                    <input type="password" name="password" value={ password } onChange={(e) => setPassword(e.target.value)} data-testid="Password" />
                </div>
                <div>
                    <input type="submit" value="Log in" className='loginButton' data-testid="SubmitButton" />
                </div>
                {renderError()}
                <div className='registerDiv'>
                    <p>
                        Or haven't created an account yet?
                    </p>
                    <button onClick={routeChange} data-testid="RegisterButton">
                        Register
                    </button>
                </div>
            </form>
            {renderRedirect()}
        </div>
    ); 
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

export default Login;