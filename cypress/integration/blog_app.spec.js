import { checkPropTypes } from 'prop-types'

describe('Blog app', function () {
  beforeEach(function () {
    cy.request('POST', 'http://localhost:3003/api/test/reset')
    const user = {
      name: 'brandon',
      username: 'root',
      password: 'password'
    }
    cy.request('POST', 'http://localhost:3003/api/users/', user)
    cy.request('POST', 'http://localhost:3003/api/users/', { name: 'test', username: 'test', password: 'password' })
    cy.visit('http://localhost:3000')
  })
  it('Login form is shown', function () {
    cy.contains('Login').click()
    cy.contains('Username')
    cy.contains('Password')
  })

  describe('Login', function () {
    it('succeeds with correct credentials', function () {
      // Opens login form
      cy.contains('Login').click()
      // Fills in information
      cy.get('#username')
        .type('root')
      cy.get('#password')
        .type('password')
      // Presses log in button
      cy.get('#login-button')
        .click()
      // Ensures the user is logged in
      cy.contains('brandon logged-in')
    })

    it('fails with wrong credentials', function () {
      // Opens login form
      cy.contains('Login').click()
      // Fills in information
      cy.get('#username')
        .type('root')
      cy.get('#password')
        .type('wrongpassword')
      cy.get('#login-button')
        .click()
      cy.get('.errorMessage').contains('invalid username or password')
    })
  })

  describe('When logged in', function () {
    beforeEach(function () {
      // Login user
      cy.login({ username: 'root', password: 'password' })
    })

    it('A blog can be created', function () {
      // Opens blog form
      cy.contains('New Blog').click()
      // Fills in blog information
      cy.get('#title')
        .type('This is a test')
      cy.get('#author')
        .type('Brandon Lim')
      cy.get('#url')
        .type('facebook.com/william.ok.5')
      cy.get('#new-blog-btn').click()
      // Finds the newly created blog
      cy.contains('This is a test')
    })
  })

  describe('Manipulation of a blog', function () {
    beforeEach(function () {
      // Login User
      cy.login({ username: 'root', password: 'password' })
      cy.createBlog({ author: 'nodnarb', url: 'test', title: 'hello world1' })
    })

    it('Blog successfully recieves a like', function () {
      cy.contains('view').click()
      cy.get('.btn-like').click()
      cy.get('.btn-like').click()
      cy.contains('2')
    })

    it('Blog can be deleted', function () {
      cy.contains('view').click()
      cy.get('#delete-blog').click()
      cy.contains('hello world1, nodnarb').should('not.exist')
    })

    it('Blog cannot be deleted by wrong user', function () {
      cy.contains('logout').click()
      cy.login({ username: 'test', password: 'password' })
      cy.contains('view').click()
      cy.contains('Remove').click()
      cy.contains('You must be the author to delete this!')
    })
    it('Blogs are sorted by likes', function () {
      // Creates more blogs
      cy.createBlog({ author: 'nodnarb', url: 'test', title: 'hello world2' })
      cy.createBlog({ author: 'nodnarb', url: 'test', title: 'hello world3' })

      // Adds 3 likes to the second blog
      cy.contains('hello world2')
        .contains('view').click()
      cy.contains('like').click().click().click()

      // Adds 2 likes to third blog
      cy.contains('hello world3')
        .contains('view').click()
      cy.contains('hello world3')
        .contains('like').click().click()

      // Checks if the blogs are sorted by likes
      cy.get('.blog-container').first().contains('hello world2')
      cy.get('.blog-container').last().contains('hello world1')
    })
  })

})