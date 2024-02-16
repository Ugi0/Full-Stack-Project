const jwt = require('jsonwebtoken');
import { db } from "../DBConnection";
import { getRandomID } from "../utils/getRandomID";

module.exports = function(app) {

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
        let result = await db
        .deleteFrom('views')
        .where('id', '=', req.body.id)
        .where('creator', '=', decoded.data)
        .execute()
        if (result[0].numDeletedRows === 0n) throw new Error("No view with that id found")
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


}