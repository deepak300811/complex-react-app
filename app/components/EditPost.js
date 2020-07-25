import React, { useEffect, useContext } from "react"
import Page from "./Page"
import Axios from "axios"
import { useImmerReducer } from "use-immer"
import { useParams, withRouter } from "react-router-dom"
import LoadingDotsIcon from "./LoadingDotsIcon"
import StateContext from "../StateContext"
import DispatchContext from "../DispatchContext"
import { Link } from "react-router-dom"
import NotFound from "./NotFound"

function EditPost(props) {
  const appState = useContext(StateContext)
  const appDispatch = useContext(DispatchContext)

  const originalState = {
    title: {
      value: "",
      hasErrors: false,
      message: ""
    },
    body: {
      value: "",
      hasErrors: false,
      message: ""
    },
    isFetching: true,
    isSaving: false,
    id: useParams().id,
    notFound: false,
    sendCount: 0
  }
  function ourReducer(draft, action) {
    switch (action.type) {
      case "FETCH_COMPLETE":
        draft.title.value = action.value.title
        draft.body.value = action.value.body
        draft.isFetching = false
        return
      case "TITLE_CHANGE":
        draft.title.hasErrors = false
        draft.title.value = action.value
        return
      case "BODY_CHANGE":
        draft.body.hasErrors = false
        draft.body.value = action.value
        return
      case "SUBMIT_REQUEST":
        if (!draft.title.hasErrors && !draft.body.hasErrors) {
          draft.sendCount++
        }
        return
      case "SAVE_REQUEST_START":
        draft.isSaving = true
        return
      case "SAVE_REQUEST_FINISH":
        draft.isSaving = false
        return
      case "TITLE_RULES":
        if (!action.value.trim()) {
          draft.title.hasErrors = true
          draft.title.message = "Please provide a suitable title."
        }
        return
      case "BODY_RULES":
        if (!action.value.trim()) {
          draft.body.hasErrors = true
          draft.body.message = "Please provide a suitable body."
        }
        return
      case "NOT_FOUND":
        draft.notFound = true
        return
    }
  }

  function submitHandler(e) {
    e.preventDefault()
    dispatch({ type: "TITLE_RULES", value: state.title.value })
    dispatch({ type: "BODY_RULES", value: state.body.value })
    dispatch({ type: "SUBMIT_REQUEST" })
  }
  const [state, dispatch] = useImmerReducer(ourReducer, originalState)
  useEffect(() => {
    const ourRequest = Axios.CancelToken.source()
    async function fetchPost() {
      await Axios.get(`/post/${state.id}`, { cancelToken: ourRequest.token })
        .then(response => {
          console.log("SinglePost=", response.data)
          if (response.data) {
            dispatch({ type: "FETCH_COMPLETE", value: response.data })
            if (appState.user.username !== response.data.author.username) {
              appDispatch({
                type: "FLASH_MESSAGES",
                value: "You do not have permission to edit this post."
              })
              props.history.push("/")
            }
          } else {
            dispatch({ type: "NOT_FOUND" })
          }
        })
        .catch(error => {
          console.log("error=", error)
        })
    }
    fetchPost()
    return () => {
      ourRequest.cancel()
    }
  }, [])

  useEffect(() => {
    if (state.sendCount) {
      dispatch({ type: "SAVE_REQUEST_START" })
      const ourRequest = Axios.CancelToken.source()
      async function fetchPost() {
        await Axios.post(
          `/post/${state.id}/edit`,
          {
            title: state.title.value,
            body: state.body.value,
            token: appState.user.token
          },
          { cancelToken: ourRequest.token }
        )
          .then(response => {
            console.log("SinglePost=", response.data)
            dispatch({ type: "SAVE_REQUEST_FINISH" })
            appDispatch({
              type: "FLASH_MESSAGES",
              value: "Post successfully saved!"
            })
          })
          .catch(error => {
            console.log("error=", error)
          })
      }
      fetchPost()
      return () => {
        ourRequest.cancel()
      }
    }
  }, [state.sendCount])
  if (state.notFound) {
    return <NotFound />
  }
  if (state.isFetching)
    return (
      <Page title={"..."}>
        <LoadingDotsIcon />
      </Page>
    )
  return (
    <Page title="Edit Post">
      <Link className="small font-weight-bold" to={`/post/${state.id}`}>
        &laquo;Back to Post Premalink
      </Link>
      <form className="mt-3" onSubmit={submitHandler}>
        <div className="form-group">
          <label htmlFor="post-title" className="text-muted mb-1">
            <small>Title</small>
          </label>
          <input
            onBlur={e =>
              dispatch({ type: "TITLE_RULES", value: e.target.value })
            }
            onChange={e =>
              dispatch({ type: "TITLE_CHANGE", value: e.target.value })
            }
            value={state.title.value}
            autoFocus
            name="title"
            id="post-title"
            className="form-control form-control-lg form-control-title"
            type="text"
            placeholder=""
            autoComplete="off"
          />
          {state.title.hasErrors && (
            <div className="alert alert-danger small liveValidateMessage">
              {state.title.message}
            </div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="post-body" className="text-muted mb-1 d-block">
            <small>Body Content</small>
          </label>
          <textarea
            onBlur={e =>
              dispatch({ type: "BODY_RULES", value: e.target.value })
            }
            onChange={e =>
              dispatch({ type: "BODY_CHANGE", value: e.target.value })
            }
            value={state.body.value}
            name="body"
            id="post-body"
            className="body-content tall-textarea form-control"
            type="text"
          ></textarea>
          {state.body.hasErrors && (
            <div className="alert alert-danger small liveValidateMessage">
              {state.body.message}
            </div>
          )}
        </div>

        <button className="btn btn-primary" disabled={state.isSaving}>
          {state.isSaving ? <span>Saving...</span> : <span>Save Updates</span>}
        </button>
      </form>
    </Page>
  )
}

export default withRouter(EditPost)
