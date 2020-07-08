import React, { useState, useContext } from "react"
import Page from "./Page"
import Axios from "axios"
import { withRouter } from "react-router-dom"
import { ExampleContext } from "./ExampleContext"
function CreatePost(props) {
  const exampleContext = useContext(ExampleContext)
  const [title, setTitle] = useState()
  const [body, setBody] = useState()
  async function submitHandler(e) {
    e.preventDefault()
    await Axios.post("/create-post", {
      title,
      body,
      token: localStorage.getItem("complexappToken")
    })
      .then(res => {
        props.history.push(`/post/${res.data}`)
        console.log("Post created successfully", res)
        exampleContext.addFlashMessage(
          "You have successfully created your post!"
        )
      })
      .catch(error => {
        console.log(error)
      })
  }
  return (
    <Page title="Create New Post">
      <form onSubmit={submitHandler}>
        <div className="form-group">
          <label htmlFor="post-title" className="text-muted mb-1">
            <small>Title</small>
          </label>
          <input
            onChange={e => setTitle(e.target.value)}
            autoFocus
            name="title"
            id="post-title"
            className="form-control form-control-lg form-control-title"
            type="text"
            placeholder=""
            autoComplete="off"
          />
        </div>

        <div className="form-group">
          <label htmlFor="post-body" className="text-muted mb-1 d-block">
            <small>Body Content</small>
          </label>
          <textarea
            onChange={e => setBody(e.target.value)}
            name="body"
            id="post-body"
            className="body-content tall-textarea form-control"
            type="text"
          ></textarea>
        </div>

        <button className="btn btn-primary">Save New Post</button>
      </form>
    </Page>
  )
}

export default withRouter(CreatePost)
