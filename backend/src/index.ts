import Express from "express";
import { db } from "./DBConnection";
import { getRandomID } from "./utils/getRandomID";
import { validateUserData } from "./utils/validateUserData";

const cors = require('cors');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');

dotenv.config()

const app = Express();
const port = 8080

app.use(cors())
app.use(Express.json());

require('./routes/assignments')(app);
require('./routes/courses')(app);
require('./routes/events')(app);
require('./routes/exams')(app);
require('./routes/lectures')(app);
require('./routes/projects')(app);
require('./routes/viewelements')(app);
require('./routes/views')(app);

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`)
})

app.post('/register', async (req, res) => {
  try {
    let newId = getRandomID();
    //Validate user data
    const [valid, error] = validateUserData(req.body)
    if (!valid) throw new Error(error);
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
    if (result.numInsertedOrUpdatedRows === 1n) {
      initialize(newId);
      res.send({
        success: true,
        token: jwt.sign({
          data: newId.toString()
        }, process.env.PRIVATE_KEY, { expiresIn: '30d'})
      })
    }
  } catch (e) {
    if (e.code === "ER_DUP_ENTRY") {
      const regex = /[^ ]*$/;
      let dupKey = regex.exec(e.sqlMessage)
      if (dupKey !== null) {
        let s = dupKey[0];
        const key = s.slice(s.indexOf(".")+1, -1);
        res.send({
          success: false,
          error: `Someone is already registered with this ${key}`
        })
        return;
      }
    }
    res.send({
      success: false,
      error: `${e}`
    });
  }
})

app.post('/login', async (req, res) => {
  try {
    if (!req.body.password) { //User asks for password salt
      let result = await db
        .selectFrom('users')
        .select('passwordSalt')
        .where((eb) => eb.or([
            eb('username', '=', req.body.username),
            eb('email', '=', req.body.username)
          ]))
        .execute()
      if (result) {
          res.send({salt: result[0].passwordSalt})
      } else {
          throw new Error("Could not find in the database.");
          //Could not be found in the database
        }
    } else { // User wants to log in with username and passwordHash
      let result = await db
        .selectFrom('users')
        .select('id')
        .where((eb) => eb.or([
          eb('username', '=', req.body.username),
          eb('email', '=', req.body.username)
          ]))
        .where('passwordHash', '=', req.body.password)
        .execute()
      if (result.length) {
        res.send({
          success: true,
          token: jwt.sign({
            data: result[0].id
          }, process.env.PRIVATE_KEY, { expiresIn: '30d'})
        })
      } else 
          throw new Error("Wrong password.");
          // Wrong password
        }
  } catch(e) {
    console.log(e.message)
    res.send({
      success: false
    })
  }
})

app.get('/verifyToken', async (req, res) => {
  try {
    let token = req.headers.token;
    let decoded = jwt.verify(token, process.env.PRIVATE_KEY);
    if (!decoded.data) throw new Error("No token")
    let result = await db
        .selectFrom('users')
        .select('id')
        .where('id', '=', decoded.data)
        .execute()
    if (result.length === 0) throw new Error("User not found")
    res.send({
      success: true
    })
  } catch(e) {
    if (e.message === 'connect ETIMEDOUT') {
      res.send({
        success: 'TIMEDOUT'
      })
    } else {
      res.send({
        success: false
      })
    }
  }
})

const initialize = (id) => {
  const createMainPage = async () => {
    const view = {
      id: getRandomID(), title: "_mainpage", 
      creator: id
    }
    await db
      .insertInto('views')
      .values(view)
      .execute()
  }
  createMainPage();
}