CREATE TABLE "memories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL,
	"lane_id" uuid NOT NULL,
	"title" text NOT NULL,
	"date" timestamp NOT NULL,
	"image" text NOT NULL,
	"description" text
);
--> statement-breakpoint
CREATE TABLE "memory_lanes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL,
	"user_id" text NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"visibility" varchar DEFAULT 'private' NOT NULL
);
--> statement-breakpoint
ALTER TABLE "memories" ADD CONSTRAINT "memories_lane_id_memory_lanes_id_fk" FOREIGN KEY ("lane_id") REFERENCES "public"."memory_lanes"("id") ON DELETE cascade ON UPDATE no action;