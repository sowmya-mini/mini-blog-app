import { Component } from 'react'
import Cookies from 'js-cookie'
import './index.css'

class Login extends Component {
    state = {
        userName: "",
        password: "",
        signUpUserName: '',
        signUpPassword: '',
        showSignUp: false,
        loginMessage: '',
        signUpMessage: ''
    }

    /**
     * LIFECYCLE METHOD: componentDidMount
     * Runs automatically after the component is rendered on the screen.
     * Checks if a user is already authenticated by looking for 'jwt_token' in cookies:
     * - If token exists: immediately redirects user to the home page ('/') so logged-in users can't see the login page.
     * - If no token exists: allows the user to stay on the login page.
     */
    /**
 * LIFECYCLE METHOD: componentDidMount
 * 
 * If an authenticated user tries to open the login page (/login) and 
 * their jwtToken exists (!== undefined), history.replace('/') will 
 * always send them straight to the Home page (/).
 */
    componentDidMount = () => {
        const jwtToken = Cookies.get('jwt_token')
        if (jwtToken !== undefined) {
            const { history } = this.props
            history.replace('/')
        }
    }

    /**
     * INPUT HANDLER: onChangeUserName
     * Updates 'userName' in state on every keypress in the login username input.
     * Clears any existing login error message as the user starts typing again.
     */
    onChangeUserName = event => {
        this.setState({ userName: event.target.value, loginMessage: '' })
    }

    /**
     * INPUT HANDLER: onChangePassword
     * Updates 'password' in state on every keypress in the login password input.
     * Clears any existing login error message as the user starts typing again.
     */
    onChangePassword = event => {
        this.setState({ password: event.target.value, loginMessage: '' })
    }

    /**
     * INPUT HANDLER: onChangeSignupUserName
     * Updates 'signUpUserName' in state as the user types into the signup username field.
     */
    onChangeSignupUserName = event => {
        this.setState({ signUpUserName: event.target.value })
    }

    /**
     * UI TOGGLE HANDLER: toggleSignupPopup
     * Switches the view between the Login form and the Signup form by flipping 'showSignUp'.
     * Also resets 'signUpMessage' so old messages don't persist when switching views.
     */
    toggleSignupPopup = () => {
        this.setState(prevState => ({
            showSignUp: !prevState.showSignUp,
            signUpMessage: '' // reset message when toggling
        }))
    }

    /**
     * INPUT HANDLER: onChangeSignupPassword
     * Updates 'signUpPassword' in state as the user types into the signup password field.
     */
    onChangeSignupPassword = event => {
        this.setState({ signUpPassword: event.target.value })
    }

    /**
     * AUTHENTICATION HELPER: onSubmitSuccess
     * Called when the backend returns a successful login response.
     * - Saves the returned JWT token to browser cookies with a 30-day expiration.
     * - Uses react-router's history.replace('/') to navigate the user to Home without adding Login to browser history.
     * @param {string} jwtToken - Authentication token returned from server
     */
    onSubmitSuccess = jwtToken => {
        Cookies.set('jwt_token', jwtToken, { expires: 30 })
        const { history } = this.props
        history.replace('/')
    }

    /**
     * AUTHENTICATION HELPER: onSubmitFailure
     * Updates 'loginMessage' in state to display backend error details to the user (e.g., "Invalid Password").
     * @param {string} errMsg - Error message received from backend or network error
     */
    onSubmitFailure = errMsg => {
        this.setState({ loginMessage: errMsg })
    }

    /**
     * FORM SUBMIT HANDLER: onSubmitLoginForm
     * Handles the submit event for the login form:
     * 1. Prevents default page refresh (`event.preventDefault()`).
     * 2. Clears old login error messages.
     * 3. Sends a POST request with credentials to the backend endpoint `/api/login`.
     * 4. Triggers `onSubmitSuccess` if valid, or `onSubmitFailure` if credentials fail or network errors occur.
     */
    onSubmitLoginForm = async event => {
        event.preventDefault();
        // Clear old login messages before making request
        this.setState({ loginMessage: '' });
        const { userName, password } = this.state;
        const userDetails = { userName, password };
        const url = "http://localhost:5000/api/login";
        const options = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userDetails)
        };
        try {
            const response = await fetch(url, options);
            const data = await response.json();
            //console.log(data);
            // console.log(response);
            if (data.success) {
                // alert(data.message)
                this.setState({ loginMessage: '' });
                this.onSubmitSuccess(data.jwt_token)
            }
            else {
                // alert(data.message)
                // Call onSubmitFailure with the server's error message 
                this.onSubmitFailure(data.message || 'Login failed');
            }
        } catch (err) {
            console.log("Fetch error:", err.message)
            this.setState({ loginMessage: 'Unable to connect to server. Please try again later.' });
        }
    };

    /**
     * FORM SUBMIT HANDLER: onSubmitSignUpForm
     * Handles registration for new users:
     * 1. Prevents default form submit reload.
     * 2. Sends POST request with new user details to `/api/register`.
     * 3. Displays success or failure response message in state (`signUpMessage`).
     */
    onSubmitSignUpForm = async event => {
        event.preventDefault()
        const { signUpUserName, signUpPassword } = this.state
        const userDetails = { userName: signUpUserName, password: signUpPassword }
        const url = "http://localhost:5000/api/register"
        const options = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userDetails)
        };
        try {
            const response = await fetch(url, options);
            const data = await response.json()
            if (data.success) {
                alert(data.message);
                this.setState({ signUpMessage: "You have registered successfully! Please login." })
            }
            else {
                alert(data.message);
                this.setState({ signUpMessage: data.message });
            }
        }
        catch (err) {
            console.log("Fetch error:", err.message)
        }
    }

    renderLoginForm = () => {
        const { userName, password, loginMessage } = this.state
        return (
            <div className="login-bg-container">
                <h1 className="login-title">Let's Blog </h1>
                <h2>A Little Bit of Everything</h2>
                <form className="login-form" onSubmit={this.onSubmitLoginForm}>
                    <label htmlFor="username">USERNAME</label>
                    <input id="username" type="text" placeholder="Username" value={userName} onChange={this.onChangeUserName} />
                    <label htmlFor="password">PASSWORD</label>
                    <input id="password" type="password" placeholder="Password" value={password} onChange={this.onChangePassword} />
                    <div className="login-buttons">
                        <button type="submit" className="login-btn">Login</button>
                        <button type="button" className="login-btn signup-btn" onClick={this.toggleSignupPopup}>Sign up</button>
                    </div>
                </form>
                {loginMessage ? (
                    <div className="signup-message">
                        <p>{loginMessage}</p>
                    </div>
                ) : null}
            </div>
        )
    }

    renderSignUpForm = () => {
        const { signUpUserName, signUpPassword, signUpMessage } = this.state
        return (
            <div className="login-bg-container">
                <h2 className="sign-up-title">Sign Up</h2>
                <form className="login-form" onSubmit={this.onSubmitSignUpForm}>
                    <label htmlFor="signup-username">USERNAME</label>
                    <input id="signup-username" type="text" placeholder="Enter username" value={signUpUserName} onChange={this.onChangeSignupUserName} />
                    <label htmlFor="signup-password">PASSWORD</label>
                    <input id="signup-password" type="password" placeholder="Enter password" value={signUpPassword} onChange={this.onChangeSignupPassword} />
                    <div className="login-buttons">
                        <button type="submit" className="login-btn signup-btn">Register</button>
                        <button type="button" className="login-btn" onClick={this.toggleSignupPopup}>Cancel</button>
                    </div>
                </form>
                {signUpMessage ? (
                    <div className="signup-message">
                        <p>{signUpMessage}</p>
                        {signUpMessage.includes("successfully") ? (
                            <button className="back-login-btn" onClick={this.toggleSignupPopup}>
                                Back to Login
                            </button>
                        ) : null}
                    </div>
                ) : null}
            </div>
        )
    }

    render() {
        return (

            <div>
                {this.state.showSignUp ? this.renderSignUpForm() : this.renderLoginForm()}
            </div>

        )
    }
}

export default Login
