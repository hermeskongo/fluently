import {boolean, pgTable, text, uuid, varchar} from "drizzle-orm/pg-core";
import {timestamps} from "./drizzle-helpers.js";

export const usersTable = pgTable("users", {
    id: uuid('id').defaultRandom().primaryKey(),
    firstname: varchar('firstname', {length: 100}).notNull(),
    lastname: varchar('lastname', {length: 100}).notNull(),
    email: varchar('email', {length: 255}).notNull().unique(),
    password: varchar('password').notNull(),
    bio: varchar('bio', {length: 255}),
    picture: text('picture').default(""),
    nativeLanguage: varchar({length: 25}).default(""),
    learningLanguage: varchar({length: 25}).default(""),
    isOnboarded: boolean().notNull().default(false),
    ...timestamps
})