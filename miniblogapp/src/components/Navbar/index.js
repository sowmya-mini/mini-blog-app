import { Component } from 'react'
import { FaSearch,FaEdit  } from "react-icons/fa"
import { TbLogout } from "react-icons/tb";
import { Link, withRouter } from 'react-router-dom'
import Cookies from 'js-cookie'
import './index.css'


/**
 * COMPONENT: Navbar 
 * 
 * Renders the top navigation bar across protected pages.
 * Because Navbar is placed manually inside layout views (e.g., <Navbar />) 
 * rather than directly inside a <Route component={...} /> in App.js, 
 * React Router DOES NOT pass router props (history, location, match) automatically. 
 * 
 * To fix this, we wrap the class export with 'withRouter', which explicitly injects 
 * the 'history' object into this.props.
 */
class Navbar extends Component {
    onLogout = () => {
        Cookies.remove('jwt_token')
        const { history } = this.props
        history.push('/login')
    }

    render() {
        const { searchInput, onChangeSearchInput } = this.props
        return (
            <div className="nav-bg-container">
                <Link className="nav-logo-container" to="/">
                    <h2>Lets Blog</h2>
                    <p>A Little Bit of Everything</p>
                </Link>
                <div className="nav-search-container">
                    <input 
                        type="search" 
                        placeholder="Search Posts..." 
                        onChange={e => onChangeSearchInput(e.target.value)} 
                        value={searchInput}
                    />
                    <FaSearch />
                </div>
                <div className="nav-actions-container">
                    <Link to="/new-post">
                        <button type="button" className="create-post-btn">+ New Post</button>
                        <button type="button" className="create-post-btn-xs" ><FaEdit size={22}/></button>
                    </Link>
                    <button type="button" className="logout-btn" onClick={this.onLogout}>Logout</button>
                    <button type="button" className="logout-btn-xs" onClick={this.onLogout}><TbLogout size={24}/></button>
                </div>
            </div>
        )
    }
}

export default withRouter(Navbar)