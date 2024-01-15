import React from 'react';
import '../styles/Login.css'
import environment from '../environment.js';
import Cookies from 'universal-cookie';
import bcrypt from 'bcryptjs'
import { Navigate } from 'react-router-dom';

export class Login extends React.Component {
    constructor(props) {
        super(props)
        this.state = { username: "", password: "", redirect: false }
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
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: this.state.username
            })
        };
        let response = await fetch(`http://${environment.BackendLocation}:${environment.BackendPort}/login`, requestOptions)
                .catch(error => {console.log(error)});
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
            if (response) {
                let responseJSON = await response.json()
                if (responseJSON.success) {
                    this.setState({ //Make window redirect
                        redirect: true
                    })
                }
            }
        }
    }

    renderRedirect() {
        if (this.state.redirect) {
            return <Navigate to='/' />
        }
    }

    render() {
        const cookies = new Cookies();
        const token = cookies.get('token');
        //TODO Check for token validity, then redirect
        return (
            <div className='LoginRoot'>
                <form onSubmit={this.handleSubmit} className='inputBox' autoComplete="off">
                    <div>
                        <label>Username</label>
                        <input type="text" id="username" name="username" value={ this.state.username } onChange={this.handleInputChange} />
                    </div>
                    <div>
                        <label>Password</label >
                        <input type="password" name="password" value={ this.state.password } onChange={this.handleInputChange} />
                    </div>
                    <div>
                        <input type="submit" value="Log in" />
                    </div>

                    <div>
                        <p>
                            Or haven't created an account yet?
                        </p>
                        <button>
                            Register
                        </button>
                        {this.renderRedirect()}
                    </div>
                </form>
            </div>
        ); 
    }
}