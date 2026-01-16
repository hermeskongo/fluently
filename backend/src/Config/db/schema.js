import {boolean, pgEnum, pgTable, serial, text, timestamp, uuid, varchar} from "drizzle-orm/pg-core";
import {timestamps} from "./drizzle-helpers.js";
import {relations} from "drizzle-orm";

export const friendshipStatusEnum  = pgEnum('friendship_status', [
    'accepted',
    'pending',
    'rejected'
])

export const usersTable = pgTable("users", {
    id: uuid('id').defaultRandom().primaryKey(),
    firstname: varchar('firstname', {length: 100}).notNull(),
    lastname: varchar('lastname', {length: 100}).notNull(),
    email: varchar('email', {length: 255}).notNull().unique(),
    password: varchar('password').notNull(),
    bio: varchar('bio', {length: 255}),
    picture: text('picture').default(""),
    nativeLanguage: varchar('native_language', {length: 25}).default(""),
    learningLanguage: varchar('learning_language',{length: 25}).default(""),
    location: varchar({length: 30}).default(""),
    isOnboarded: boolean().notNull().default(false),
    ...timestamps
})

export const friendshipsTable = pgTable('friendships', {
    // ID global de la table
    id: serial().primaryKey(),

    // ID de l'utilisateur qui initie l'amitié
    user_id: uuid().notNull().references(() => usersTable.id, {onDelete: "cascade"}),

    // ID de l'ami
    friend_id: uuid().notNull().references(() => usersTable.id, {onDelete: "cascade"}),

    // "pending" | "rejected" | "accepted" |
    status: friendshipStatusEnum('status').notNull().default('pending'),

    created_at: timestamp().defaultNow().notNull(),
    accepted_at: timestamp()
})




// =============== LES DIFFERENTES RELATIONS ===============


export const usersRelations = relations(usersTable, ({many}) => ({
    sentFriendRequests: many(friendshipsTable, {relationName: "sentFriendRequests"}),
    receivedFriendRequests: many(friendshipsTable, {relationName: "receivedFriendRequests"})
}))

export const friendshipsRelations = relations(friendshipsTable, ({ one }) => ({
    user: one(usersTable, {
        fields: [friendshipsTable.user_id],
        references: [usersTable.id],
        relationName: 'sentFriendRequests'
    }),

    // L'ami (qui a reçu la demande)
    friend: one(usersTable, {
        fields: [friendshipsTable.friend_id],
        references: [usersTable.id],
        relationName: 'receivedFriendRequests'
    })
}))