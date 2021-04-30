import React, { useState } from 'react'
const Blog = ({ blog, handleBlogLike, handleBlogDelete }) => {
  const [visibility, setVisibility] = useState(false)

  const toggleVisibility = () => {
    setVisibility(!visibility)
  }

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
    paddingBottom: 5
  }

  return (
    <div style={blogStyle} className='blog-container' >
      {blog.title}, {blog.author}
      <button className='btn-visibility' onClick={toggleVisibility}>view</button>
      {visibility && (
        <div>
          <p className='url' >{blog.url}</p>
          <p>
            {blog.likes} <button className='btn-like' onClick={() => handleBlogLike({ ...blog, likes: blog.likes + 1 })}>like</button>
          </p>
          <p className='user' >{blog.user.username}</p>
          <button id="delete-blog" onClick={() => handleBlogDelete(blog)}>Remove</button>
        </div>
      )}
    </div>
  )
}

export default Blog
