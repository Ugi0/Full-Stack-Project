import Express from "express";
import { db } from "./DBConnection";
import { getRandomID } from "./utils/getRandomID";
import { validateUserData } from "./utils/validateUserData";
import schedule from 'node-schedule'

const fs = require('fs')

const cors = require('cors');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');

const http = require('http');
const https = require('https');

const privateKey  = fs.readFileSync('../sslcert/server.key', 'utf8');
const certificate = fs.readFileSync('../sslcert/server.crt', 'utf8');

let credentials = {key: privateKey, cert: certificate};

dotenv.config()

const app = Express();

app.use(cors());
app.use(Express.json());

http.createServer(app).listen(8080);
https.createServer(credentials, app).listen(8443);

require('./routes/assignments')(app);
require('./routes/courses')(app);
require('./routes/events')(app);
require('./routes/exams')(app);
require('./routes/lectures')(app);
require('./routes/projects')(app);
require('./routes/viewelements')(app);
require('./routes/views')(app);
require('./routes/notes')(app);

schedule.scheduleJob('0 0 * * *', async () => { //Everyday at midnight check the note groups for if they need to be reset
  let result = await db //Get all viewelements that are of the type toDoList
      .selectFrom('viewelements')
      .selectAll()
      .where("type","=",3)
      .where("size","=",1)
      .execute()
  const resetGroup = async (title) => {
    await db.updateTable('notes')
          .set({
            checked: false
          })
          .where('body','=',title)
          .execute()
  }
 result.forEach(e => {
  e.data.split(";").filter(e => e === "").forEach(group => {
    if (group.split(":")[1] === "D") { //Run daily
      resetGroup(group.split(":")[0])
    } else if (group.split(":")[1] === "W" && (new Date()).getDay() === 1) { //Run if weekly and it's monday
      resetGroup(group.split(":")[0])
    } else if (group.split(":")[1] === "M" && (new Date()).getDate() === 1) { //Run if monthly and it's 1st day of the month
      resetGroup(group.split(":")[0])
    }
  })
 })
});

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
          error: `Someone is already registered with this ${key}.`
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

//TODO create some better initialization to show the views and different possible elements

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