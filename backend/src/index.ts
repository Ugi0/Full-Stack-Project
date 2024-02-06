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
    await db
      .replaceInto('courses')
      .values(req.body.courses.map(e => {
        return {
          creator: decoded.data,
          id: e.courseid,
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
          courseid: e.id
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
    await db
      .deleteFrom('courses')
      .where('id', '=', req.body.courseid)
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
    console.log(e)
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
    if (!req.body.views) throw new Error("No views")
    await db
      .replaceInto('views')
      .values(req.body.views.map(e => {
        return {
          id: e.id, title: e.title, creator: decoded.data
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
    console.log(e)
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
    console.log(e)
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
    if (req.body.elements) throw new Error("No elements specified")
    await db
      .replaceInto('viewelements')
      .values(req.body.views.map(e => {
        return {
          creator: decoded.data, 
          hostid: e.hostid, id: e.id,
          type: e.type,
          width: e.width, height: e.height,
          x: e.x, y: e.y,
          data: e.data
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
    console.log(e)
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
          id: e.id, course: e.id,
          status: e.status, type: e.type,
          priority: e.priority, duedate: e.duedate,
          grade: e.grade
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

app.post('/assignments', async (req, res) => {
  try {
    let token = req.headers.token;
    let decoded = jwt.verify(token, process.env.PRIVATE_KEY);
    if (!decoded.data) throw new Error("No token")
    if (!req.body.assignments) throw new Error("No assignments specified")
    await db
      .replaceInto('viewelements')
      .values(req.body.views.map(e => {
        return {
          creator: decoded.data, 
          hostid: e.hostid, id: e.id,
          type: e.type,
          width: e.width, height: e.height,
          x: e.x, y: e.y,
          data: e.data
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
    console.log(e)
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
    console.log(e)
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
    if (!req.body.events) throw new Error("No events specified")
    await db
      .replaceInto('events')
      .values(req.body.views.map(e => {
        return {
          creator: decoded.data, 
          id: e.id,
          hostid: e.hostid,
          icon: e.icon, title: e.title,
          body: e.body, checked: e.checked
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
    console.log(e)
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
    console.log(e)
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
    if (!req.body.exams) throw new Error("No exams specified")
    await db
      .replaceInto('exams')
      .values(req.body.views.map(e => {
        return {
          creator: decoded.data, 
          id: e.id, time: e.time,
          title: e.title, description: e.description,
          course: e.course
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
    console.log(e)
    res.send({
      success: false
    })
  }
})