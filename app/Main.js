import React, { useContext } from "react"
import ReactDOM from "react-dom"
import Header from "./components/Header"
import HomeGuest from "./components/HomeGuest"
import Footer from "./components/Footer"
import About from "./components/About"
import Terms from "./components/Terms"
import Home from "./components/Home"
import CreatePost from "./components/CreatePost"
import FlashMessage from "./components/FlashMessages"
import ViewSinglePost from "./components/ViewSinglePost"
import ExampleContextProvider, {
  ExampleContext
} from "./components/ExampleContext"
import { BrowserRouter, Switch, Route } from "react-router-dom"
import Axios from "axios"
Axios.defaults.baseURL = "http://localhost:8080"
function Main() {
  const { isLogin } = useContext(ExampleContext)
  return (
    <BrowserRouter>
      <FlashMessage />
      <Header />
      <Switch>
        <Route path="/" exact>
          {isLogin ? <Home /> : <HomeGuest />}
        </Route>
        <Route path="/post/:id">
          <ViewSinglePost />
        </Route>
        <Route path="/create-post">
          <CreatePost />
        </Route>
        <Route path="/about-us" exact>
          <About />
        </Route>
        <Route path="/terms" exact>
          <Terms />
        </Route>
      </Switch>
      <Footer />
    </BrowserRouter>
  )
}

ReactDOM.render(
  <ExampleContextProvider>
    <Main />
  </ExampleContextProvider>,
  document.querySelector("#app")
)
/* if (module.hot) {
  module.hot.accept()
} */
