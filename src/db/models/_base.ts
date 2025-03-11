import { text, timestamp, uuid } from "drizzle-orm/pg-core";

export const BaseColumns = {
	id: uuid().defaultRandom().primaryKey(),
	createdAt: timestamp().notNull().defaultNow(),
	updatedAt: timestamp()
		.notNull()
		.$onUpdate(() => new Date()),
};

export const BaseColumnsWithAuth = {
	...BaseColumns,
	userId: text().notNull(),
};
