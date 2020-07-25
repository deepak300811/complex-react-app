import React, { useState, useEffect, useContext } from "react"
import Page from "./Page"
import Axios from "axios"
import { useImmerReducer } from "use-immer"
import { CSSTransition } from "react-transition-group"
import DispatchContext from "../DispatchContext"

function HomeGuest() {
  const appDispatch = useContext(DispatchContext)
  const initialState = {
    username: {
      value: "",
      hasErrors: false,
      message: "",
      isUnique: false,
      checkCount: 0
    },
    email: {
      value: "",
      hasErrors: false,
      message: "",
      isUnique: false,
      checkCount: 0
    },
    password: { value: "", hasErrors: false, message: "" },
    submitCount: 0
  }

  const [state, dispatch] = useImmerReducer(ourReducer, initialState)
  function ourReducer(draft, action) {
    switch (action.type) {
      case "USERNAME_IMMIDIATELY":
        draft.username.hasErrors = false
        draft.username.value = action.value
        if (draft.username.value.length > 30) {
          draft.username.hasErrors = true
          draft.username.message = "Username cannot exceed 30 characters."
        }
        if (
          draft.username.value &&
          !/^([a-zA-Z0-9]+)$/.test(draft.username.value)
        ) {
          draft.username.hasErrors = true
          draft.username.message =
            "Username can only contain letters and numbers."
        }
        return
      case "USERNAME_AFTER_DELAY":
        if (draft.username.value.length < 3) {
          draft.username.hasErrors = true
          draft.username.message = "Username must be atleast 3 characters."
        }
        if (!draft.username.hasErrors && !action.noRequest) {
          draft.username.checkCount++
        }
        return
      case "USERNAME_UNIQUE_RESULTS":
        if (action.value) {
          draft.username.hasErrors = true
          draft.username.isUnique = false
          draft.username.message = "This username is already taken."
        } else {
          draft.username.isUnique = true
        }
        return
      case "EMAIL_IMMIDIATELY":
        draft.email.hasErrors = false
        draft.email.value = action.value
        return
      case "EMAIL_AFTER_DELAY":
        if (!/^\S+@\S+$/.test(draft.email.value)) {
          draft.email.hasErrors = true
          draft.email.message = "You must provide a valid email address."
        }
        if (!draft.email.hasErrors && !action.noRequest) {
          draft.email.checkCount++
        }
        return
      case "EMAIL_UNIQUE_RESULTS":
        if (action.value) {
          draft.email.hasErrors = true
          draft.email.isUnique = false
          draft.email.message = "This email is already being used."
        } else {
          draft.email.isUnique = true
        }
        return
      case "PASSWORD_IMMIDIATELY":
        draft.password.hasErrors = false
        draft.password.value = action.value
        return
      case "PASSWORD_AFTER_DELAY":
        if (draft.password.value.length < 12) {
          draft.password.hasErrors = true
          draft.password.message = "Password must be atleast 12 characters."
        }
        if (draft.password.value.length > 50) {
          draft.password.hasErrors = true
          draft.password.message = "Password cannot exceed 50 characters."
        }
        return
      case "SUBMIT_FORM":
        if (
          !draft.username.hasErrors &&
          !draft.password.hasErrors &&
          !draft.email.hasErrors &&
          draft.username.isUnique &&
          draft.email.isUnique
        ) {
          draft.submitCount++
        }
        return
    }
  }

  useEffect(() => {
    if (state.username.value) {
      const delay = setTimeout(
        () => dispatch({ type: "USERNAME_AFTER_DELAY" }),
        900
      )
      return () => clearTimeout(delay)
    }
  }, [state.username.value])

  useEffect(() => {
    if (state.username.checkCount) {
      const ourRequest = Axios.CancelToken.source()
      async function fetchResults() {
        await Axios.post(
          "/doesUsernameExist",
          { username: state.username.value },
          { cancelToken: ourRequest.token }
        )
          .then(response => {
            console.log(response.data)
            dispatch({ type: "USERNAME_UNIQUE_RESULTS", value: response.data })
          })
          .catch(error => {
            console.log(error)
          })
      }
      fetchResults()
      return () => ourRequest.cancel()
    }
  }, [state.username.checkCount])

  useEffect(() => {
    if (state.email.value) {
      const delay = setTimeout(
        () => dispatch({ type: "EMAIL_AFTER_DELAY" }),
        900
      )
      return () => clearTimeout(delay)
    }
  }, [state.email.value])

  useEffect(() => {
    if (state.password.value) {
      const delay = setTimeout(
        () => dispatch({ type: "PASSWORD_AFTER_DELAY" }),
        900
      )
      return () => clearTimeout(delay)
    }
  }, [state.password.value])

  useEffect(() => {
    if (state.email.checkCount) {
      const ourRequest = Axios.CancelToken.source()
      async function fetchResults() {
        await Axios.post(
          "/doesEmailExist",
          { email: state.email.value },
          { cancelToken: ourRequest.token }
        )
          .then(response => {
            console.log(response.data)
            dispatch({ type: "EMAIL_UNIQUE_RESULTS", value: response.data })
          })
          .catch(error => {
            console.log(error)
          })
      }
      fetchResults()
      return () => ourRequest.cancel()
    }
  }, [state.email.checkCount])

  useEffect(() => {
    if (state.submitCount) {
      const ourRequest = Axios.CancelToken.source()
      async function fetchResults() {
        await Axios.post(
          "/register",
          {
            username: state.username.value,
            email: state.email.value,
            password: state.password.value
          },
          { cancelToken: ourRequest.token }
        )
          .then(response => {
            console.log(response.data)
            appDispatch({ type: "LOGIN", data: response.data })
            appDispatch({
              type: "FLASH_MESSAGES",
              value: "Congrats! Welcome to your new account."
            })
          })
          .catch(error => {
            console.log(error)
          })
      }
      fetchResults()
      return () => ourRequest.cancel()
    }
  }, [state.submitCount])

  async function handleSubmit(e) {
    e.preventDefault()
    dispatch({ type: "USERNAME_IMMIDIATELY", value: state.username.value })
    dispatch({
      type: "USERNAME_AFTER_DELAY",
      value: state.username.value,
      noRequest: true
    })

    dispatch({ type: "EMAIL_IMMIDIATELY", value: state.email.value })
    dispatch({
      type: "EMAIL_AFTER_DELAY",
      value: state.email.value,
      noRequest: true
    })

    dispatch({ type: "PASSWORD_IMMIDIATELY", value: state.password.value })
    dispatch({ type: "PASSWORD_AFTER_DELAY", value: state.password.value })
    dispatch({ type: "SUBMIT_FORM" })
  }

  return (
    <Page title="Welcome!" wide={true}>
      <div className="row align-items-center">
        <div className="col-lg-7 py-3 py-md-5">
          <h1 className="display-3">Remember Writing?</h1>
          <p className="lead text-muted">
            Are you sick of short tweets and impersonal &ldquo;shared&rdquo;
            posts that are reminiscent of the late 90&rsquo;s email forwards? We
            believe getting back to actually writing is the key to enjoying the
            internet again.
          </p>
        </div>
        <div className="col-lg-5 pl-lg-5 pb-3 py-lg-5">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="username-register" className="text-muted mb-1">
                <small>Username</small>
              </label>
              <input
                onChange={e =>
                  dispatch({
                    type: "USERNAME_IMMIDIATELY",
                    value: e.target.value
                  })
                }
                id="username-register"
                name="username"
                className="form-control"
                type="text"
                placeholder="Pick a username"
                autoComplete="off"
              />
              <CSSTransition
                in={state.username.hasErrors}
                timeout={330}
                classNames="liveValidateMessage"
                unmountOnExit
              >
                <div className="alert alert-danger small liveValidateMessage">
                  {state.username.message}
                </div>
              </CSSTransition>
            </div>
            <div className="form-group">
              <label htmlFor="email-register" className="text-muted mb-1">
                <small>Email</small>
              </label>
              <input
                onChange={e =>
                  dispatch({ type: "EMAIL_IMMIDIATELY", value: e.target.value })
                }
                id="email-register"
                name="email"
                className="form-control"
                type="text"
                placeholder="you@example.com"
                autoComplete="off"
              />
              <CSSTransition
                in={state.email.hasErrors}
                timeout={330}
                classNames="liveValidateMessage"
                unmountOnExit
              >
                <div className="alert alert-danger small liveValidateMessage">
                  {state.email.message}
                </div>
              </CSSTransition>
            </div>
            <div className="form-group">
              <label htmlFor="password-register" className="text-muted mb-1">
                <small>Password</small>
              </label>
              <input
                onChange={e =>
                  dispatch({
                    type: "PASSWORD_IMMIDIATELY",
                    value: e.target.value
                  })
                }
                id="password-register"
                name="password"
                className="form-control"
                type="password"
                placeholder="Create a password"
              />
              <CSSTransition
                in={state.password.hasErrors}
                timeout={330}
                classNames="liveValidateMessage"
                unmountOnExit
              >
                <div className="alert alert-danger small liveValidateMessage">
                  {state.password.message}
                </div>
              </CSSTransition>
            </div>
            <button
              type="submit"
              className="py-3 mt-4 btn btn-lg btn-success btn-block"
            >
              Sign up for ComplexApp
            </button>
          </form>
        </div>
      </div>
    </Page>
  )
}

export default HomeGuest
