const express = require("express")
const app = express()

app.use(express.urlencoded({ extended: true }))
app.post("/api/tracker", (req, res) => {
  console.log("body ", req.body)
  res.send("ok")
})

app.listen(8888, () => {
  console.log("server is running at http://localhost:8888")
})
