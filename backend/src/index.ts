import Express from "express";
import { assertEquals } from "./utils/assert";
import { db } from "./DBConnection";

const cors = require('cors');
const dotenv = require('dotenv');
const getRandomValues = require('get-random-values');
const jwt = require('jsonwebtoken');

dotenv.config()

const app = Express();
const port = 8000

app.use(cors())
app.use(Express.json());

app.post('/register', async (req, res) => {
  try {
    let newId = getRandomID();
    let result = await db
      .insertInto('users')
      .values({
        id: newId,
        email: req.body.email,
        username: req.body.username,
        created_at: new Date(),
        passwordHash: req.body.password,
        passwordSalt: req.body.salt
      })
      .executeTakeFirstOrThrow()
    if (result.numInsertedOrUpdatedRows == 1n) {
      res.send({
        success: true,
        token: jwt.sign({
          data: newId
        }, process.env.PRIVATE_KEY, { expiresIn: '30d'})
      })
    }
  } catch (e) {
    res.send({
      success: false,
      error: `${e.code}: ${e.sqlMessage}`
    })
  }
})

app.post('/login', async (req, res) => {
  try {
    if (req.body.password === undefined) { //User asks for password salt
      let result = await db
        .selectFrom('users')
        .select('passwordSalt')
        .where('username', '=', req.body.username)
        .execute()
      if (result) {
          console.log({salt: result[0].passwordSalt})
          res.send({salt: result[0].passwordSalt})
      } else {
        result = await db
        .selectFrom('users')
        .select('passwordSalt')
        .where('email', '=', req.body.username)
        .execute();
        if (result) {
          res.send({salt: result[0].passwordSalt})
        } else {
          throw new Error("Could not find in the database.");
          //Could not be found in the database
        }
      }
    } else { // User wants to log in with username and passwordHash
      let result = await db
        .selectFrom('users')
        .select('id')
        .where('username', '=', req.body.username)
        .where('passwordHash', '=', req.body.password)
        .execute()
      if (result.length) {
        res.send({
          success: true
        })
      } else {
        result = await db
          .selectFrom('users')
          .select('id')
          .where('email', '=', req.body.username)
          .where('passwordHash', '=', req.body.password)
          .execute()
        if (result.length) {
          res.send({
            success: true
          })
        } else {
          throw new Error("Wrong password.");
          // Wrong password
        }
      }
    }
  } catch(e) {
    console.log(e)
    res.send({
      success: false
    })
  }
})

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`)
})

function getRandomID() {
  var array = new Uint8Array(8);
  getRandomValues(array);
  return array.join('');
}