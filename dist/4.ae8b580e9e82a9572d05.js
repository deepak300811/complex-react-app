(window.webpackJsonp=window.webpackJsonp||[]).push([[4],{215:function(e,t,a){"use strict";a.r(t);var o=a(0),l=a.n(o),n=a(8),s=a(2),c=a.n(s),r=a(4),m=a(14),u=a(6);t.default=Object(r.g)((function(e){const[t,a]=Object(o.useState)(),[s,r]=Object(o.useState)(),p=Object(o.useContext)(m.a),b=Object(o.useContext)(u.a);return l.a.createElement(n.a,{title:"Create New Post"},l.a.createElement("form",{onSubmit:async function(a){a.preventDefault();try{const a=await c.a.post("/create-post",{title:t,body:s,token:b.user.token});p({type:"FLASH_MESSAGES",value:"Congrats, you successfuly created a post!"}),e.history.push("/post/"+a.data),console.log("New post was created.")}catch(a){console.log("There was a problem.")}}},l.a.createElement("div",{className:"form-group"},l.a.createElement("label",{htmlFor:"post-title",className:"text-muted mb-1"},l.a.createElement("small",null,"Title")),l.a.createElement("input",{onChange:e=>a(e.target.value),autoFocus:!0,name:"title",id:"post-title",className:"form-control form-control-lg form-control-title",type:"text",placeholder:"",autoComplete:"off"})),l.a.createElement("div",{className:"form-group"},l.a.createElement("label",{htmlFor:"post-body",className:"text-muted mb-1 d-block"},l.a.createElement("small",null,"Body Content")),l.a.createElement("textarea",{onChange:e=>r(e.target.value),name:"body",id:"post-body",className:"body-content tall-textarea form-control",type:"text"})),l.a.createElement("button",{className:"btn btn-primary"},"Save New Post")))}))}}]);