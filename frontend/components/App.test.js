// Write your tests here
import React from "react"
import AppFunctional from "./AppFunctional"
import '@testing-library/jest-dom/extend-expect'
import { render, screen, waitFor } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import server from "../../backend/mock-server"

describe('Extra 5 tests', () => {
  beforeAll(() => { server.listen() })
  afterAll(() => { server.close() })

  let userInput
  let user

  beforeEach(() => {
    render(<AppFunctional />)
    
    user = userEvent.setup()
    userInput = screen.getByPlaceholderText('type email')
  })

  test('Input shows typed email', async () => {
    await user.type(userInput, 'josevazquez@gmail.com')

    expect(userInput).toHaveValue('josevazquez@gmail.com')
  })

  test('the button shows up and input ', () => {
    expect(screen.getByTestId('submitform')).toBeVisible()
  })

  test('Reset button appears', () => {
    expect(document.querySelector("#reset")).toBeVisible()
  })

  test('Direction buttons appear', () => {
    expect(document.querySelector("#left")).toBeVisible()
    expect(document.querySelector("#up")).toBeVisible()
    expect(document.querySelector("#down")).toBeVisible()
    expect(document.querySelector("#right")).toBeVisible()

  })
  test('B is visible', () => {
    expect(screen.getByText('B')).toBeVisible()
  })
})



