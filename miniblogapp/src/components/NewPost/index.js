import { Component } from 'react'
import Cookies from 'js-cookie'
import Navbar from '../Navbar'
import './index.css'

const ALL_CATEGORIES = [
    "Food & Recipes",
    "Pets & Fun",
    "Entertainment",
    "Thoughts",
    "Life & Stories"
]

class NewPost extends Component {
    state = {
        title: '',
        content: '',
        author: '',
        category: ALL_CATEGORIES[0],
        errorMessage: '' // new state for error
    }

    onSubmitPost = async (event) => {
        event.preventDefault()
        const { title, content, author, category } = this.state
        const jwtToken = Cookies.get('jwt_token')
        // const url = "http://localhost:5000/api/posts"
        // Replaced local port 5000 backend server with OnRender server for production deployment so render is now backend server
        const url = "https://mini-blog-app-server.onrender.com/api/posts"
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${jwtToken}`
            },
            body: JSON.stringify({ title, content, author, category })
        }

        const response = await fetch(url,options)

        if (response.ok) {
            const newPost = await response.json()
            console.log("Post created:", newPost)
            const { history } = this.props
            history.push('/')
        } else {
            const errorData = await response.json()
            this.setState({ errorMessage: errorData.message || "Failed to create post" })
        }
    }

    render() {
        const { errorMessage } = this.state
        return (
            <>
                <Navbar />
                <div className="new-post-container">
                    <h2>Create New Post</h2>
                    {errorMessage && (
                        <p className="error-message">{errorMessage}</p>
                    )}
                    <form onSubmit={this.onSubmitPost}>
                        <input
                            type="text"
                            placeholder="Title"
                            value={this.state.title}
                            onChange={e => this.setState({ title: e.target.value })}
                        />
                        <textarea
                            placeholder="Content"
                            value={this.state.content}
                            onChange={e => this.setState({ content: e.target.value })}
                        />
                        <input
                            type="text"
                            placeholder="Author"
                            value={this.state.author}
                            onChange={e => this.setState({ author: e.target.value })}
                        />
                        <select
                            value={this.state.category}
                            onChange={e => this.setState({ category: e.target.value })}
                        >
                            {ALL_CATEGORIES.map(category => (
                                <option key={category} value={category}>{category}</option>
                            ))}
                        </select>
                        <button type="submit">Publish</button>
                    </form>
                </div>
            </>
        )
    }
}

export default NewPost
