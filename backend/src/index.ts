import Express from "express";
import { assertEquals } from "./utils/assert";
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

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`)
})

app.post('/register', async (req, res) => {
  try {
    let newId = getRandomID();
    //Validate user data
    const [valid, Error] = validateUserData(req.body)
    if (!valid) {
      res.send({
        success: false,
        error: `${Error}`
      })
      return;
    }
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
      error: `${e.code ?? ""}: ${e.sqlMessage ?? ""}`
    })
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
          console.log({salt: result[0].passwordSalt})
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
    console.log(e)
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
    res.send({
      success: true
    })
  } catch(e) {
    console.log(e)
    res.send({
      success: false
    })
  }
})

app.post('/courses', async (req, res) => {
  try {
    let token = req.headers.token;
    let decoded = jwt.verify(token, process.env.PRIVATE_KEY);
    if (!decoded.data) throw new Error("No token")
    if (!req.body.courses) throw new Error("No courses")
    let result = await db
      .replaceInto('courses')
      .values(req.body.courses.map(e => {
        return {
          creator: decoded.data,
          courseid: e.courseid,
          title: e.title, description: e.description,
          time: e.time, duration: e.duration,
          repeating: e.repeating, repeatingTime: e.repeatingTime
        }
      }))
      .execute()
    res.send({
      success: true
    })
  } catch(e) {
    console.log(e)
    res.send({
      success: false
    })
  }
})

app.get('/courses', async (req, res) => {
  try {
    let token = req.headers.token;
    let decoded = jwt.verify(token, process.env.PRIVATE_KEY);
    if (!decoded.data) throw new Error("No token")
    let result = await db
      .selectFrom('courses')
      .selectAll()
      .where('creator', '=', decoded.data)
      .execute()
    res.send({
      success: true,
      data: result.map((e,i) => {
        return {
          title: e.title, time: e.time, 
          duration: e.duration, description: e.description, repeating: e.repeating, 
          repeatingTime: e.repeatingTime, 
          courseid: e.courseid
        }
      })
    })
  } catch(e) {
    console.log(e)
    res.send({
      success: false
    })
  }
})

app.delete('/courses', async (req, res) => {
  try {
    let token = req.headers.token;
    let decoded = jwt.verify(token, process.env.PRIVATE_KEY);
    if (!decoded.data) throw new Error("No token")
    if (!req.body.courseid) throw new Error("No courseid specified")
    let result = await db
      .deleteFrom('courses')
      .where('courseid', '=', req.body.courseid)
      .where('creator', '=', decoded.data)
      .execute()
    res.send({
      success: true
    })
  } catch(e) {
    console.log(e)
    res.send({
      success: false
    })
  }
})