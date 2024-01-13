import Express from "express";
import { DBConnection, users } from "./DBConnection";
import { createPool } from "mysql2"
import { MySql2PoolQueryRunner } from "ts-sql-query/queryRunners/MySql2PoolQueryRunner";
import { CustomBooleanTypeAdapter } from "ts-sql-query/TypeAdapter";
import { ConsoleLogQueryRunner } from "ts-sql-query/queryRunners/ConsoleLogQueryRunner";
import { uuidValueSourceType } from "ts-sql-query/utils/symbols";


const cors = require('cors');
const dotenv = require('dotenv');
const getRandomValues = require('get-random-values');

dotenv.config()

const app = Express();
const port = 8000

const pool = createPool({
  connectionLimit: 10,
  host: process.env.DATABASE_LOCATION,
  user: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: 'TestDB'
})

let connection;

connection = new DBConnection(new ConsoleLogQueryRunner(new MySql2PoolQueryRunner(pool)))

app.use(cors())
app.use(Express.json());

app.post('/register', async (req, res) => {
  console.log(req.body);
  res.send({message: 'Hello World!'})
  await connection.beginTransaction()
let i = await connection.insertInto(users)
    .set({
      id: getRandomID(),
      email: "someemail",
      username: "someusername",
      created_at: new Date(),
      passwordHash: "SOMEHASH"
    })
    .returningLastInsertedId()
    .executeInsertOne()
    .then(e => console.log(e))
  //console.log(JSON.parse(req.body));
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