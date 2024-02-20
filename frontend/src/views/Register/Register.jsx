import React, { useState } from 'react'
import '../Login/Login.css'
import myConfig from '../../config.js';
import Cookies from 'universal-cookie';
import bcrypt from 'bcryptjs'
import { Navigate } from 'react-router-dom';

function Register() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordCheck, setPasswordCheck] = useState("");
    const [redirect, setRedirect] = useState(false);
    const [redirectLocation, setRedirectLocation] = useState("/");
    const [errorMessage, setErrorMessage] = useState("");

    // Handle submitting the form
    const handleSubmit = async (event) => {
        event.preventDefault();
        const [valid, Error] = validate({username, email, password, passwordCheck, redirect});
        if (!valid) { //Inputs are not valid, display an error to the user
            setErrorMessage(Error);
        }
        else {
            const salt = bcrypt.genSaltSync(10)
            const hashedPassword = bcrypt.hashSync(password, salt)
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: username,
                    email: email,
                    password: hashedPassword,
                    salt: salt
                })
            };
            const response = await fetch(`http://${myConfig.BackendLocation}:${myConfig.BackendPort}/register`, requestOptions)
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
                    setRedirect(true);
                } else {
                    setErrorMessage(responseJSON.error);
                }
            }
        }
    }

    const renderRedirect = () => {
        if (redirect) {
            return <Navigate to={redirectLocation} />
        }
    }

    const routeChange = () => {
        setRedirectLocation('/login');
        setRedirect(true)
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

    return (
        <div className='LoginRoot'>
            <form onSubmit={handleSubmit} className='inputBox' autoComplete="off">
                <div>
                    <h1>
                        WELCOME
                    </h1>
                </div>
                <div>
                    <p>Username</p>
                    <input type="text" id="username" name="username" value={ username } onChange={(e) => setUsername(e.target.value) } />
                </div>
                <div>
                    <p>Email</p>
                    <input type="text" id="email" name="email" value={ email } onChange={(e) => setEmail(e.target.value) } />
                </div>
                <div>
                    <p>Password</p>
                    <input type="password" id="password" name="password" value={ password } onChange={(e) => setPassword(e.target.value) } />
                </div>
                <div>
                    <p>Type the same password again</p>
                    <input type="password" id="passwordCheck" name="passwordCheck" value={ passwordCheck } onChange={(e) => setPasswordCheck(e.target.value) } />
                </div>
                <div>
                    <input type="submit" value="Register"  className='loginButton'/>
                </div>
                {renderError()}
                <div className='registerDiv'>  
                    <p> Already got an account?</p>
                    <button onClick={routeChange}>
                        Log in
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

export default Register;