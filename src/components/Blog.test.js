import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import Blog from './Blog'
import BlogForm from './BlogForm'

test('renders content', () => {
  const blog = {
    author: 'Nodnarb',
    user: { username: 'root' },
    url: 'facebook.com',
    title: 'This is just a test'
  }

  const component = render(
    <Blog blog={blog} />
  )

  expect(component.container).toHaveTextContent('Nodnarb')
  expect(component.container).toHaveTextContent('This is just a test')
  expect(component.container).not.toHaveTextContent('root')
  expect(component.container).not.toHaveTextContent('facebook.com')
})

test('makes sure the button displays information', () => {
  const blog = {
    author: 'Nodnarb',
    user: { username: 'root' },
    url: 'facebook.com',
    likes: 2,
    title: 'This is just a test'
  }

  const mockHandler = jest.fn()

  const component = render(
    <Blog blog={blog} handleBlogLike={mockHandler} />
  )

  const button = component.container.querySelector('.btn-visibility')

  fireEvent.click(button)

  expect(component.container.querySelector('user')).toBeDefined()
  expect(component.container).toHaveTextContent('2')
  expect(component.container).toHaveTextContent('root')
  expect(component.container).toHaveTextContent('facebook.com')

})

test('like button is functional', () => {
  const blog = {
    author: 'Nodnarb',
    user: { username: 'root' },
    url: 'facebook.com',
    likes: 2,
    title: 'This is just a test'
  }

  const mockHandler = jest.fn()

  const component = render(
    <Blog blog={blog} handleBlogLike={mockHandler} />
  )

  fireEvent.click(component.container.querySelector('.btn-visibility'))
  const likeButton = component.container.querySelector('.btn-like')
  fireEvent.click(likeButton)
  fireEvent.click(likeButton)

  // There should be 2 calls to the handler.
  expect(mockHandler.mock.calls).toHaveLength(2)
})

test('adding a new blog is functional', () => {
  const blog = {
    author: 'Nodnarb',
    url: 'facebook.com',
    title: 'This is just a test',
  }

  const mockHandler = jest.fn()

  const component = render(
    <BlogForm handleBlog={mockHandler} />
  )

  const title = component.container.querySelector('#title')
  fireEvent.change(title, {
    target: { value: blog.title }
  })
  const url = component.container.querySelector('#url')
  fireEvent.change(url, {
    target: { value: blog.url }
  })
  const author = component.container.querySelector('#author')
  fireEvent.change(author, {
    target: { value: blog.author }
  })

  fireEvent.click(component.container.querySelector('#submit'))

  expect(mockHandler.mock.calls[0][0]).toEqual(blog)
})