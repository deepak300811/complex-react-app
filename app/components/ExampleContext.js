import React, { useReducer } from "react"
import Axios from "axios"
export const ExampleContext = React.createContext({
  FlashMessage: [],
  addFlashMessage: () => {},
  isLogin: false,
  setLoggedIn: function () {},
  setLoggedOut: () => {}
})

function ExampleContextProvider(props) {
  const initialState = {
    loggedIn: Boolean(localStorage.getItem("complexappToken")),
    FlashMessages: []
  }
  const ourReducer = (state, action) => {
    switch (action.type) {
      case "LOGIN":
        return { ...state, loggedIn: true }
      case "LOGOUT":
        return { ...state, loggedIn: false }
      case "FLASH_MESSAGES":
        return { ...state, FlashMessages: FlashMessages.concat(action.value) }
    }
  }
  const [state, dispatch] = useReducer(ourReducer, initialState)

  const addFlashMessages = props => {
    dispatch({ type: "FLASH_MESSAGES", value: props })
    /* setFlashMessages(prev => prev.concat(props)) */
  }
  async function handlerLogin(username, password) {
    await Axios.post("/login", { username, password })
      .then(res => {
        if (res.data) {
          console.log(res.data)
          localStorage.setItem("complexappToken", res.data.token)
          localStorage.setItem("complexappAvatar", res.data.avatar)
          localStorage.setItem("complexappUsername", res.data.username)
          dispatch({ type: "LOGIN" })
          /* setLogIn(true) */
        } else {
          console.log("Incorrect username/password!")
        }
      })
      .catch(error => {
        console.log("error result", error.response.data)
      })
  }

  const handleLogOut = () => {
    dispatch({ type: "LOGOUT" })
    /* setLogIn(false) */
    localStorage.removeItem("complexappToken")
    localStorage.removeItem("complexappAvatar")
    localStorage.removeItem("complexappUsername")
  }

  return (
    <ExampleContext.Provider
      value={{
        FlashMessage: state.FlashMessages,
        addFlashMessage: addFlashMessages,
        isLogin: state.loggedIn,
        setLoggedIn: handlerLogin,
        setLoggedOut: handleLogOut
      }}
    >
      {props.children}
    </ExampleContext.Provider>
  )
}

export default ExampleContextProvider
