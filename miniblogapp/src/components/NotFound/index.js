import {Link} from 'react-router-dom'
import './index.css'



/**
 * COMPONENT: NotFound
 * 
 * Renders a fallback 404 page for any undefined or broken URL path.
 * Since this component is directly attached to a <Route component={NotFound} /> in App.js,
 * React Router automatically injects the 'history', 'location', and 'match' props directly into it.
 * No 'withRouter' HOC wrapper is required here.
 */
const NotFound = (props) => {
    const { history } = props

    /**
     * EVENT HANDLER: onClickGoBack
     * Uses react-router's history.goBack() method to navigate 
     * the user back to the previous page in their browser history stack.
     * goBack() is a built-in method provided by React Router's history object.
     */
    const onClickGoBack = () => {
        history.goBack()
    }
    return (
            <div className="notfound-bg-container">
                <h1>Page Not Found</h1>
                <h2>Oops! Looks like you've taken a wrong turn. </h2>
                <p>The page you are looking for doesn't exist.Don't worry, you can easily find your way back.</p>
                <div className="action-buttons">
                    <Link to="/">
                        <button type="button">Go to Home</button>
                    </Link>
                    <button type="button" onClick={onClickGoBack}>Go Back to Previous Page</button>
                </div>
            </div>
    )
}
export default NotFound