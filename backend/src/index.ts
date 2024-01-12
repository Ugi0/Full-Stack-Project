import Express from "express";
const cors = require('cors');

const app = Express();
const port = 8000

app.use(cors())
app.use(Express.json());

app.post('/register', (req, res) => {
  console.log(req.body)
  //console.log(JSON.parse(req.body));
  res.send({message: 'Hello World!'})
})

app.get('/login', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`)
})