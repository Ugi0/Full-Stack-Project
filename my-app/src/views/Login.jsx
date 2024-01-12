import React from 'react';
import '../styles/Login.css'

export class Login extends React.Component {
    constructor(props) {
        super(props)
        this.state = { username: "", password: "" }
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
    handleSubmit = (event) => {
        console.log(this.state);
        event.preventDefault();
    }

    render() {
        return (
            <div className='LoginRoot'>
                <form onSubmit={this.handleSubmit} className='inputBox' autocomplete="off">
                    <div>
                        <label>Username</label>
                        <input type="text" id="username" name="username" value={ this.state.username } onChange={this.handleInputChange} />
                    </div>
                    <div>
                        <label>Password</label >
                        <input type="text" id="password" name="password" value={ this.state.password } onChange={this.handleInputChange} />
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
                    </div>
                </form>
            </div>
        ); 
    }
}