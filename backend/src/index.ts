import Express from "express";
import { assertEquals } from "./utils/assert";
import { db } from "./DBConnection";

const cors = require('cors');
const dotenv = require('dotenv');
const getRandomValues = require('get-random-values');

dotenv.config()

const app = Express();
const port = 8000

app.use(cors())
app.use(Express.json());

app.post('/register', async (req, res) => {
  try {
    let result = await db
      .insertInto('users')
      .values({
        id: getRandomID(),
        email: req.body.email,
        username: req.body.username,
        created_at: new Date(),
        passwordHash: req.body.password
      })
      .executeTakeFirstOrThrow()
    if (result.numInsertedOrUpdatedRows == 1n) {
      res.send({
        result: "success",
        message: "Redirect"
      })
    }
  } catch (e) {
    console.log(e.code)
    console.log(e.sqlMessage)
    console.log({
      result: "failure",
      error: `${e.code}: ${e.sqlMessage}`
    })
    res.send({
      result: "failure",
      error: `${e.code}: ${e.sqlMessage}`
    })
  }
})

app.get('/login', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`)
})

function getRandomID() {
  var array = new Uint8Array(8);
  getRandomValues(array);
  return array.join('');
}