import Express from "express";
import { assertEquals } from "./utils/assert";
import { db } from "./DBConnection";
import { getRandomID } from "./utils/getRandomID";
import { validateUserData } from "./utils/validateUserData";
import { fromStatus, toStatus } from "./utils/toStatus";
import { fromPriority, toPriority } from "./utils/toPriority";

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

app.post('/courses', async (req, res) => {
  try {
    let token = req.headers.token;
    let decoded = jwt.verify(token, process.env.PRIVATE_KEY);
    if (!decoded.data) throw new Error("No token")
    if (!req.body.course) throw new Error("No course")
    const newID = req.body.course.id ?? getRandomID();
    const data = req.body.course;
    const course = {
      creator: decoded.data,
      id: newID,
      title: data.title, description: data.description,
      time: data.time, duration: data.duration,
      repeating: data.repeating, repeatingTime: data.repeatingTime
    }
    await db
      .insertInto('courses')
      .values(course)
      .onDuplicateKeyUpdate(course)
      .execute()
    res.send({
      success: true,
      id: newID.toString()
    })
  } catch(e) {
    console.log(e.message)
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
          id: e.id
        }
      })
    })
  } catch(e) {
    console.log(e.message)
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
    if (!req.body.id) throw new Error("No id specified")
    let result = await db
      .deleteFrom('courses')
      .where('id', '=', req.body.id)
      .where('creator', '=', decoded.data)
      .execute()
    if (result[0].numDeletedRows === 0n) throw new Error("No course with that id found")
    res.send({
      success: true
    })
  } catch(e) {
    console.log(e.message)
    res.send({
      success: false
    })
  }
})

app.get('/views', async (req, res) => {
  try {
    let token = req.headers.token;
    let decoded = jwt.verify(token, process.env.PRIVATE_KEY);
    if (!decoded.data) throw new Error("No token")
    let result = await db
      .selectFrom('views')
      .selectAll()
      .where('creator', '=', decoded.data)
      .execute()
    res.send({
      success: true,
      data: result.map((e,i) => {
        return {
          title: e.title, id: e.id
        }
      })
    })
  } catch(e) {
    console.log(e.message)
    res.send({
      success: false
    })
  }
})

app.post('/views', async (req, res) => {
  try {
    let token = req.headers.token;
    let decoded = jwt.verify(token, process.env.PRIVATE_KEY);
    if (!decoded.data) throw new Error("No token")
    if (!req.body.view) throw new Error("No views")
    const newID = req.body.view.id ?? getRandomID();
    const data = req.body.view;
    const view = {
      id: newID, title: data.title, 
      creator: decoded.data
    }
    await db
      .insertInto('views')
      .values(view)
      .onDuplicateKeyUpdate(view)
      .execute()
    res.send({
      success: true,
      id: newID.toString()
    })
  } catch(e) {
    console.log(e.message)
    res.send({
      success: false
    })
  }
})

app.delete('/views', async (req, res) => {
  try {
    let token = req.headers.token;
    let decoded = jwt.verify(token, process.env.PRIVATE_KEY);
    if (!decoded.data) throw new Error("No token")
    if (!req.body.id) throw new Error("No id for view specified")
    await db
      .deleteFrom('views')
      .where('id', '=', req.body.id)
      .where('creator', '=', decoded.data)
      .execute()
    res.send({
      success: true
    })
  } catch(e) {
    console.log(e.message)
    res.send({
      success: false
    })
  }
})

app.get('/viewelements', async (req, res) => {
  try {
    let token = req.headers.token;
    let decoded = jwt.verify(token, process.env.PRIVATE_KEY);
    if (!decoded.data) throw new Error("No token")
    let result = await db
      .selectFrom('viewelements')
      .selectAll()
      .where('creator', '=', decoded.data)
      .execute()
    res.send({
      success: true,
      data: result.map((e,i) => {
        return {
          hostid: e.hostid, id: e.id,
          type: e.type,
          width: e.width, height: e.height,
          x: e.x, y: e.y,
          data: e.data
        }
      })
    })
  } catch(e) {
    if (e.sqlMessage === "Unknown column 'creator' in 'where clause'") return;
    console.log(e.message)
    res.send({
      success: false
    })
  }
})

app.post('/viewelements', async (req, res) => {
  try {
    let token = req.headers.token;
    let decoded = jwt.verify(token, process.env.PRIVATE_KEY);
    if (!decoded.data) throw new Error("No token")
    if (req.body.viewelement) throw new Error("No elements specified")
    const newID = req.body.viewelement.id ?? getRandomID();
    const data = req.body.viewelement;
    const viewelement = {
      creator: decoded.data, 
      hostid: data.hostid, id: newID,
      type: data.type,
      width: data.width, height: data.height,
      x: data.x, y: data.y,
      data: data.data
    }
    await db
      .insertInto('viewelements')
      .values(viewelement)
      .onDuplicateKeyUpdate(viewelement)
      .execute()
    res.send({
      success: true,
      id: newID.toString()
    })
  } catch(e) {
    console.log(e.message)
    res.send({
      success: false
    })
  }
})

app.delete('/viewelements', async (req, res) => {
  try {
    let token = req.headers.token;
    let decoded = jwt.verify(token, process.env.PRIVATE_KEY);
    if (!decoded.data) throw new Error("No token")
    await db
      .deleteFrom('viewelements')
      .where('id', '=', req.body.id)
      .where('creator', '=', decoded.data)
      .execute()
    res.send({
      success: true
    })
  } catch(e) {
    console.log(e.message)
    res.send({
      success: false
    })
  }
})

app.get('/assignments', async (req, res) => {
  try {
    let token = req.headers.token;
    let decoded = jwt.verify(token, process.env.PRIVATE_KEY);
    if (!decoded.data) throw new Error("No token")
    let result = await db
      .selectFrom('assignments')
      .selectAll()
      .where('creator', '=', decoded.data)
      .execute()
    res.send({
      success: true,
      data: result.map((e,i) => {
        return {
          id: e.id, course: e.course,
          priority: toPriority(e.priority),
          title: e.title,
          description: e.description,
          status: toStatus(e.status),
          time: e.time,
          grade: e.grade
        }
      })
    })
  } catch(e) {
    console.log(e.message)
    res.send({
      success: false
    })
  }
})

app.post('/assignments', async (req, res) => {
  try {
    let token = req.headers.token;
    let decoded = jwt.verify(token, process.env.PRIVATE_KEY);
    if (!decoded.data) throw new Error("No token")
    if (!req.body.assignment) throw new Error("No assignments specified")
    const newID = req.body.assignment.id ?? getRandomID();
    const data = req.body.assignment;
    const assignment = {
      creator: decoded.data,
      priority: fromPriority(data.priority),
      title: data.title,
      description: data.description,
      id: newID, course: data.course,
      status: fromStatus(data.status),
      time: data.time,
      grade: data.grade
    }
    await db
      .insertInto('assignments')
      .values(assignment)
      .onDuplicateKeyUpdate(assignment)
      .execute()
    res.send({
      success: true,
      id: newID.toString()
    })
  } catch(e) {
    console.log(e.message)
    res.send({
      success: false
    })
  }
})

app.delete('/assignments', async (req, res) => {
  try {
    let token = req.headers.token;
    let decoded = jwt.verify(token, process.env.PRIVATE_KEY);
    if (!decoded.data) throw new Error("No token")
    await db
      .deleteFrom('assignments')
      .where('id', '=', req.body.id)
      .where('creator', '=', decoded.data)
      .execute()
    res.send({
      success: true
    })
  } catch(e) {
    console.log(e.message)
    res.send({
      success: false
    })
  }
})

app.get('/events', async (req, res) => {
  try {
    let token = req.headers.token;
    let decoded = jwt.verify(token, process.env.PRIVATE_KEY);
    if (!decoded.data) throw new Error("No token")
    let result = await db
      .selectFrom('events')
      .selectAll()
      .where('creator', '=', decoded.data)
      .execute()
    res.send({
      success: true,
      data: result.map((e,i) => {
        return {
          id: e.id, time: e.time,
          title: e.title, description: e.description
        }
      })
    })
  } catch(e) {
    console.log(e.message)
    res.send({
      success: false
    })
  }
})

app.post('/events', async (req, res) => {
  try {
    let token = req.headers.token;
    let decoded = jwt.verify(token, process.env.PRIVATE_KEY);
    if (!decoded.data) throw new Error("No token")
    if (!req.body.event) throw new Error("No events specified")
    const newID = req.body.event.id ?? getRandomID();
    const data = req.body.event;
    const event = {
      creator: decoded.data,
      id: newID,
      time: data.time,
      title: data.title,
      description: data.description
    }
    await db
      .insertInto('events')
      .values(event)
      .onDuplicateKeyUpdate(event)
      .execute()
    res.send({
      success: true,
      id: newID.toString()
    })
  } catch(e) {
    console.log(e.message)
    res.send({
      success: false
    })
  }
})

app.delete('/events', async (req, res) => {
  try {
    let token = req.headers.token;
    let decoded = jwt.verify(token, process.env.PRIVATE_KEY);
    if (!decoded.data) throw new Error("No token")
    await db
      .deleteFrom('events')
      .where('id', '=', req.body.id)
      .where('creator', '=', decoded.data)
      .execute()
    res.send({
      success: true
    })
  } catch(e) {
    console.log(e.message)
    res.send({
      success: false
    })
  }
})

app.get('/exams', async (req, res) => {
  try {
    let token = req.headers.token;
    let decoded = jwt.verify(token, process.env.PRIVATE_KEY);
    if (!decoded.data) throw new Error("No token")
    let result = await db
      .selectFrom('exams')
      .selectAll()
      .where('creator', '=', decoded.data)
      .execute()
    res.send({
      success: true,
      data: result.map((e,i) => {
        return {
          id: e.id, time: e.time,
          title: e.title, description: e.description,
          course: e.course
        }
      })
    })
  } catch(e) {
    console.log(e.message)
    res.send({
      success: false
    })
  }
})

app.post('/exams', async (req, res) => {
  try {
    let token = req.headers.token;
    let decoded = jwt.verify(token, process.env.PRIVATE_KEY);
    if (!decoded.data) throw new Error("No token")
    if (!req.body.exam) throw new Error("No exams specified")
    const newID = req.body.exam.id ?? getRandomID();
    const data = req.body.exam;
    const exam = {
      creator: decoded.data, 
      id: newID, time: data.time,
      title: data.title, description: data.description,
      course: data.course
    }
    await db
      .insertInto('exams')
      .values(exam)
      .onDuplicateKeyUpdate(exam)
      .execute()
    res.send({
      success: true,
      id: newID.toString()
    })
  } catch(e) {
    console.log(e.message)
    res.send({
      success: false
    })
  }
})

app.delete('/exams', async (req, res) => {
  try {
    let token = req.headers.token;
    let decoded = jwt.verify(token, process.env.PRIVATE_KEY);
    if (!decoded.data) throw new Error("No token")
    await db
      .deleteFrom('exams')
      .where('id', '=', req.body.id)
      .where('creator', '=', decoded.data)
      .execute()
    res.send({
      success: true
    })
  } catch(e) {
    console.log(e.message)
    res.send({
      success: false
    })
  }
})

app.get('/projects', async (req, res) => {
  try {
    let token = req.headers.token;
    let decoded = jwt.verify(token, process.env.PRIVATE_KEY);
    if (!decoded.data) throw new Error("No token")
    let result = await db
      .selectFrom('projects')
      .selectAll()
      .where('creator', '=', decoded.data)
      .execute()
    res.send({
      success: true,
      data: result.map((e,i) => {
        return {
          id: e.id, time: e.time,
          status: toStatus(e.status), type: e.type,
          priority: toPriority(e.priority),
          title: e.title, description: e.description,
          data: e.data
        }
      })
    })
  } catch(e) {
    console.log(e.message)
    res.send({
      success: false
    })
  }
})

app.post('/projects', async (req, res) => {
  try {
    let token = req.headers.token;
    let decoded = jwt.verify(token, process.env.PRIVATE_KEY);
    if (!decoded.data) throw new Error("No token")
    if (!req.body.project) throw new Error("No project specified")
    const newID = req.body.project.id ?? getRandomID();
    const data = req.body.project;
    const project = {
      creator: decoded.data,
      id: newID, time: data.time,
      status: fromStatus(data.status), type: data.type,
      priority: fromPriority(data.priority),
      title: data.title, description: data.description,
      data: data.data
    }
    await db
      .insertInto('projects')
      .values(project)
      .onDuplicateKeyUpdate(project)
      .execute()
    res.send({
      success: true,
      id: newID.toString()
    })
  } catch(e) {
    console.log(e.message)
    res.send({
      success: false
    })
  }
})

app.delete('/projects', async (req, res) => {
  try {
    let token = req.headers.token;
    let decoded = jwt.verify(token, process.env.PRIVATE_KEY);
    if (!decoded.data) throw new Error("No token")
    await db
      .deleteFrom('projects')
      .where('id', '=', req.body.id)
      .where('creator', '=', decoded.data)
      .execute()
    res.send({
      success: true
    })
  } catch(e) {
    console.log(e.message)
    res.send({
      success: false
    })
  }
})