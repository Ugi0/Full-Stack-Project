const jwt = require('jsonwebtoken');
import { db } from "../DBConnection";
import { getRandomID } from "../utils/getRandomID";

module.exports = function(app) {

app.get('/viewelements/:uid', async (req, res) => {
    try {
        let token = req.headers.token;
        let decoded = jwt.verify(token, process.env.PRIVATE_KEY);
        if (!decoded.data) throw new Error("No token")
        if (!req.params.uid) throw new Error("No view id given");
        let result = await db
        .selectFrom('viewelements')
        .selectAll()
        .where('hostid', '=', req.params.uid)
        .where('creator', '=', decoded.data)
        .execute()
        res.send({
        success: true,
        data: result.map((e,i) => {
            return {
            hostid: e.hostid, id: e.id,
            type: e.type, size:e.size,
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
        if (!req.body.viewelement) throw new Error("No element specified")
        const newID = req.body.viewelement.id ?? getRandomID();
        const data = req.body.viewelement;
        const viewelement = {
        creator: decoded.data, 
        hostid: data.hostid, id: newID,
        type: data.type, size: data.size,
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
        let result = await db
        .deleteFrom('viewelements')
        .where('id', '=', req.body.id)
        .where('creator', '=', decoded.data)
        .execute()
        if (result[0].numDeletedRows === 0n) throw new Error("No viewelement with that id found")
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