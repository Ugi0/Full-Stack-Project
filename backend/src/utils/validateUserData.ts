export function validateUserData(request) {
        let passwordReg = new RegExp("^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$"); //Regex to test for at least 8 characters, one letter and one number
        let usernameLengthReg = new RegExp(".{3,}");
        let emailReg = new RegExp("^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$")
        if (!usernameLengthReg.test(request.username)) { //Username at least 3 characters long
            return [false, "Username needs to be at least 3 characters long."];
        }
        if (!emailReg.test(request.email)) { // Standard email validation regex
            return [false, "This is not an actual email"];
        }
        if (!passwordReg.test(request.password)) { //Passwords doesn't pass the requirements
            return [false, "Password has to be at least 8 characters and include a number."];
        }
        else {
            return [true, ""];
        }
    }