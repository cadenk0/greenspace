/**
 * storage.ts
 *
 * Defines an interface and implementation for storing and retrieving data
 * from integrated database.
 */
import { users, activities, type User, type InsertUser, type Activity, type InsertActivity } from "@shared/schema";
import { db } from "./db";
import { eq, desc, sql } from "drizzle-orm";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  createActivity(activity: InsertActivity & { userId: number, points: number }): Promise<Activity>;
  getUserActivities(userId: number): Promise<Activity[]>;
  getLeaderboard(): Promise<User[]>;
  incrementGreenScore(userId: number, points: number): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async createActivity(activity: InsertActivity & { userId: number, points: number }): Promise<Activity> {
    const [newActivity] = await db.insert(activities).values(activity).returning();
    return newActivity;
  }

  async getUserActivities(userId: number): Promise<Activity[]> {
    return db.select().from(activities).where(eq(activities.userId, userId)).orderBy(desc(activities.createdAt));
  }

  async getAllActivities(): Promise<Activity[]> {
    return db.select().from(activities).orderBy(desc(activities.createdAt));
  }

  async getLeaderboard(): Promise<User[]> {
    return db.select().from(users).orderBy(desc(users.greenScore)).limit(50);
  }

  async incrementGreenScore(userId: number, points: number): Promise<void> {
    await db
      .update(users)
      .set({ greenScore: sql`${users.greenScore} + ${points}` })
      .where(eq(users.id, userId));
  }
}

export const storage = new DatabaseStorage();
