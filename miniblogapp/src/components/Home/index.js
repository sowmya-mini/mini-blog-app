import { Component } from 'react'
import Cookies from 'js-cookie'
import Navbar from '../Navbar'
import { MdDelete } from "react-icons/md"
import { Link } from 'react-router-dom'
import './index.css'

// This ensures categories remain visible even if we delete the post, the category remines visible
// Default array of categories used for filtering posts. 
// Kept outside the component so it doesn't get re-created on every render.
const ALL_CATEGORIES = [
    "All",
    "Food & Recipes",
    "Pets & Fun",
    "Entertainment",
    "Thoughts",
    "Life & Stories"
]

class Home extends Component {
    state = {
        blogPosts: [],
        activeCategory: ALL_CATEGORIES[0],
        searchInput: '',
        expandPostId: null,
        isLoading: true
    }

    /**
     * LIFECYCLE METHOD: componentDidMount
     * Executes immediately after the component mounts to the DOM.
     * Checks for a valid JWT token in cookies for route protection:
     * - If no token exists: redirects the unauthenticated user to the /login route.
     * - If a token exists: initiates the API request to fetch all posts.
     */
    componentDidMount = () => {
        const jwtToken = Cookies.get('jwt_token')
        if (jwtToken === undefined) {
            const { history } = this.props
            history.replace('/login')
        } else {
            this.getBlogPosts()
        }
    }


    /**
         * API CALL: getBlogPosts
         * Fetches all blog posts from the backend server.
         * Sends the JWT token in the Authorization header for authentication.
         * On success: stores fetched posts in state and sets isLoading to false.
         */
    getBlogPosts = async () => {
        const jwtToken = Cookies.get('jwt_token')
        const url = 'http://localhost:5000/api/posts'
        const options = {
            method: 'GET',
            headers: { Authorization: `Bearer ${jwtToken}` }
        }
        const response = await fetch(url, options)
        if (response.ok) {
            const fetchedData = await response.json()
            this.setState({ blogPosts: fetchedData, isLoading: false })
        } else {
            console.log('Failed to fetch posts')
        }
    }


    /**
     * STATE HANDLER: setActiveCategory
     * Updates the activeCategory state when a user clicks on a category button.
     * @param {string} category - The name of the selected category (e.g., "Food & Recipes")
     */
    setActiveCategory = category => {
        this.setState({ activeCategory: category })
    }


    /**
     * STATE HANDLER: onChangeSearchInput
     * Callback passed to the Navbar component to capture user input from the search bar.
     * Updates the searchInput state in real-time as the user types.
     * @param {string} searchInput - The updated string from the search input field
     */
    onChangeSearchInput = searchInput => {
        this.setState({ searchInput })
    }


    /**
     * API CALL / STATE HANDLER: onDeletePost
     * Sends a DELETE request to the backend for a specific post ID.
     * On HTTP 200 OK: dynamically removes the deleted post from the local blogPosts state array
     * without needing to refetch all posts from the server.
     * @param {string} id - The unique database ID (_id) of the post to delete
     */
    onDeletePost = async (id) => {
        const jwtToken = Cookies.get('jwt_token')
        const url = `http://localhost:5000/api/posts/${id}`
        const options = {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${jwtToken}` }
        }
        const response = await fetch(url, options)
        if (response.ok) {
            this.setState(prevState => ({
                blogPosts: prevState.blogPosts.filter(post => post._id !== id)
            }))
        } else {
            console.log('Failed to delete post')
        }
    }


    /**
     * UI TOGGLE HANDLER: toggleReadMe
     * Toggles the "Read More" / "Show Less" state for post content preview.
     * - If the clicked post is already expanded: resets expandPostId to null (collapses it).
     * - If a new post is clicked: sets expandPostId to that post's ID (expands it).
     * @param {string} id - The unique database ID (_id) of the target post
     */
    toggleReadMe = (id) => {
        this.setState(prevState => ({
            expandPostId: prevState.expandPostId === id ? null : id
        }))
    }

    // Computes filtered list dynamically on every render
    /**
     * COMPUTED HELPER METHOD: getFilteredPosts
     * Dynamically filters the master list (blogPosts) on every re-render.
     * Evaluates both conditions simultaneously:
     * 1. Category Filter: Checks if post matches activeCategory or if "All" is selected.
     * 2. Search Filter: Checks if searchInput matches title, author, or category (case-insensitive).
     * @returns {Array} Array of posts that satisfy both search and category criteria.
     */
    getFilteredPosts = () => {
        const { blogPosts, activeCategory, searchInput } = this.state
        return blogPosts.filter(post => {
            const matchesCategory = activeCategory === 'All' || post.category === activeCategory
            const matchesSearch =
                post.title.toLowerCase().includes(searchInput.toLowerCase()) ||
                post.author.toLowerCase().includes(searchInput.toLowerCase()) ||
                post.category.toLowerCase().includes(searchInput.toLowerCase())
            return matchesCategory && matchesSearch
        })
    }

    render() {
        const { activeCategory, expandPostId, isLoading, searchInput } = this.state

        // Execute the computed filter logic on render
        const filteredPosts = this.getFilteredPosts()

        return (
            <>
                <Navbar
                    searchInput={searchInput}
                    onChangeSearchInput={this.onChangeSearchInput}
                />
                <div className="home-bg-container">
                    <h1>Welcome to Let's Blog!</h1>
                    <p className="home-title">A Little Bit of Everything.</p>
                    <div className="category-container">
                        <h3>CATEGORY</h3>
                        <div className="category-options">
                            {ALL_CATEGORIES.map(category => (
                                <p
                                    key={category}
                                    onClick={() => this.setActiveCategory(category)}
                                    className={activeCategory === category ? 'category-btn active' : 'category-btn'}
                                >
                                    {category}
                                </p>
                            ))}
                        </div>
                    </div>
                    <div className="posts-grid">
                        {isLoading ? (
                            <p className="loading-text">Loading posts...</p>
                        ) : filteredPosts.length > 0 ? (
                            filteredPosts.map(post => (
                                <div key={post._id} className="post-card">
                                    <h4 className="post-category">{post.category}</h4>
                                    <h3 className="post-title">{post.title}</h3>
                                    <div className="author-date-section">
                                        <p className="post-author">By {post.author}</p>
                                        <p className="post-date">{new Date(post.createdAt).toLocaleDateString()}</p>
                                    </div>
                                    {/* 
                                This <p> block shows a short preview of the blog post content.
                                 - post.content.length > 100 → checks if the content has more than 100 characters.
                                   - If true → take the first 50 characters using slice(0, 50) and add "..." at the end.
                                   - If false → show the full content without cutting it.
                                    - slice(0, 50) → means "start at index 0 and return characters up to index 50" (first 50 characters).
                                    - The ternary operator (? :) is used so that short posts don’t get an unnecessary "..." added.
                                  - Example:
                                */}
                                    <p className="post-content">
                                        {expandPostId === post._id
                                            ? post.content
                                            : post.content.length > 100
                                                ? post.content.slice(0, 50) + "..."
                                                : post.content}
                                    </p>
                                    <div className="card-actions-section">
                                        <button className="read-more-btn" onClick={() => this.toggleReadMe(post._id)}>
                                            {expandPostId === post._id ? "Show Less" : "Read More →"}
                                        </button>
                                        <button className="card-delete-btn" onClick={() => this.onDeletePost(post._id)}>
                                            <MdDelete size={24} />
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="no-posts-container">
                                <p>No posts available in this category.</p>
                                <Link to="/new-post">
                                    <button type="button" className="create-post-btn">
                                        + Create New Post
                                    </button>
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </>
        )
    }
}

export default Home
