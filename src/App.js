import React, { useState, useEffect } from 'react'
import BlogForm from './components/BlogForm'
import Blogs from './components/Blogs'
import Toggleable from './components/Toggleable'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      const blogs = await blogService.getAll()
      blogs.sort((a, b) => b.likes - a.likes)
      setBlogs(blogs)
    }
    fetchData()
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (e) => {
    e.preventDefault()
    try {
      const user = await loginService.login({ username, password })

      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUsername('')
      setPassword('')
      setUser(user)
    } catch (err) {
      setErrorMessage(err.response.data.error)
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const handleLogout = async (e) => {
    e.preventDefault()
    setUser(null)
    setUsername('')
    setPassword('')
    // Reset the token as well
    blogService.setToken(null)
    window.localStorage.clear()
  }

  const handleBlogLike = async (blog) => {
    try {
      const newBlog = await blogService.update(blog.id, blog)
      // Update the local copy of blogs with the updated blod
      const tempBlogs = [...blogs]
      // Find the blog being changed
      const blogToChange = tempBlogs.find((blog) => blog.id === newBlog.id)
      // Find the index, then change that specific blog
      tempBlogs[tempBlogs.indexOf(blogToChange)] = newBlog
      // Sort the new array
      tempBlogs.sort((a, b) => b.likes - a.likes)
      setBlogs(tempBlogs)
    } catch (err) {
      console.log(err)
    }
  }

  const handleBlogDelete = async (blogToDelete) => {
    if (user.username !== blogToDelete.user.username) {
      setErrorMessage('You must be the author to delete this!')
      setTimeout(() => {
        setErrorMessage('')
      }, 5000)
      return
    }
    if (window.confirm(`Are you sure you want to delete ${blogToDelete.title}? This process cannot be undone`)) {
      try {
        const id = blogToDelete.id
        await blogService.del(id)
        const tempBlogs = blogs.filter((blog) => blog.id !== id)
        setBlogs(tempBlogs)
      } catch (err) {
        console.log(err)
      }
    } else {
      return
    }
  }

  const handleNewBlog = async (newBlog) => {
    try {
      const res = await blogService.create(newBlog)
      setBlogs(blogs.concat(res))
      setErrorMessage(`${res.title} was successfully created`)
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    } catch (err) {
      setErrorMessage(err.response.data.error)
    }
  }

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        <label htmlFor='Username'>Username</label>
        <input id='username' type='text' value={username} onChange={({ target }) => setUsername(target.value)} name='Username' />
      </div>
      <div>
        <label htmlFor='Password'>Password</label>
        <input id='password' type='text' value={password} onChange={({ target }) => setPassword(target.value)} name='Password' />
      </div>
      <button id='login-button' type='submit'>Login</button>
    </form>
  )

  return (
    <div>
      <h2>Blogs</h2>
      <h3 className='errorMessage' >{errorMessage}</h3>
      {!user ? (
        <Toggleable buttonLabel={'Login'}>{loginForm()}</Toggleable>
      ) : (
        <div>
          <p>
            {user.name} logged-in <button onClick={handleLogout}>logout</button>
          </p>
          <Toggleable buttonLabel={'New Blog'}>
            <BlogForm handleBlog={handleNewBlog} />
          </Toggleable>
        </div>
      )}
      <Blogs blogs={blogs} handleBlogLike={handleBlogLike} handleBlogDelete={handleBlogDelete} />
    </div>
  )
}

export default App
