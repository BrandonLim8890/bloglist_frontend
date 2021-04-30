import React, { useState } from 'react'
import PropTypes from 'prop-types'

const BlogForm = ({ handleBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    handleBlog({ title, author, url })
    setTitle('')
    setAuthor('')
    setUrl('')
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor='Title'>Title</label>
        <input id='title' type='text' value={title} onChange={({ target }) => setTitle(target.value)} name='Title' required />
      </div>
      <div>
        <label htmlFor='Author'>Author</label>
        <input id='author' type='text' value={author} onChange={({ target }) => setAuthor(target.value)} name='Author' required />
      </div>
      <div>
        <label htmlFor='URL'>URL</label>
        <input id='url' type='text' value={url} onChange={({ target }) => setUrl(target.value)} name='URL' required />
      </div>
      <button id='new-blog-btn' type='submit'>Create</button>
    </form>
  )
}

BlogForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired
}

export default BlogForm