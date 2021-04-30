import React from 'react'
import Blog from './Blog'

const Blogs = ({ blogs, handleBlogLike, handleBlogDelete }) => (
  <div>
    { blogs.map(blog => (
      <Blog key={blog.id} blog={blog} handleBlogLike={handleBlogLike} handleBlogDelete={handleBlogDelete} />
    )) }
  </div>
)

export default Blogs