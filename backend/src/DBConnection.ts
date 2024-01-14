import {ColumnType,Generated,Insertable,JSONColumnType,Selectable,Updateable} from 'kysely'
import { Kysely, MysqlDialect } from 'kysely'
import { createPool } from "mysql2"

export interface Database {
    users: UsersTable
  }

interface UsersTable {
    id: string
    email: string
    username: string
    created_at: Date
    passwordHash: string
}

const dialect = new MysqlDialect({ 
    pool: async () => createPool({
        host: process.env.DATABASE_LOCATION,
        user: process.env.DATABASE_USERNAME,
        password: process.env.DATABASE_PASSWORD,
        database: 'TestDB'
    })
})

export const db = new Kysely<Database>({
    dialect,
})