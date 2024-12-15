CREATE TABLE `contact_messages` (
	`id` integer PRIMARY KEY NOT NULL,
	`email` text,
	`message` text,
	`location` text,
	`created_at` text DEFAULT (current_timestamp) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `radio` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text,
	`price` integer,
	`description` text,
	`features` text,
	`caracteristics` text,
	`images` text,
	`public` integer DEFAULT false,
	`is_sold` integer DEFAULT false,
	`sold_at` text DEFAULT '',
	`created_at` text DEFAULT (current_timestamp) NOT NULL
);
