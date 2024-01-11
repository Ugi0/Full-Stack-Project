import React from 'react'
import '../styles/Login.css'

export class Login extends React.Component {
    render() {
        return (
            <div className='LoginRoot'>
                <div className='inputBox'>
                    <div>
                        <label for="fname">Username</label>
                        <input type="text" id="fname" name="fname" />
                    </div>
                    <div>
                        <label for="lname">Password</label >
                        <input type="text" id="lname" name="lname" />
                    </div>
                    <div>
                        <input type="submit" value="Log in"></input>
                    </div>

                    <div>
                        <p>
                            Or haven't created an account yet?
                        </p>
                        <button>
                            Register
                        </button>
                    </div>
                </div>
            </div>
        ); 
    }
}
