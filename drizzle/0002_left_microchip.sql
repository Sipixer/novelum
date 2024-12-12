PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_radio` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text,
	`price` integer,
	`description` text,
	`features` text,
	`caracteristics` text,
	`images` text
);
--> statement-breakpoint
INSERT INTO `__new_radio`("id", "name", "price", "description", "features", "caracteristics", "images") SELECT "id", "name", "price", "description", "features", "caracteristics", "images" FROM `radio`;--> statement-breakpoint
DROP TABLE `radio`;--> statement-breakpoint
ALTER TABLE `__new_radio` RENAME TO `radio`;--> statement-breakpoint
PRAGMA foreign_keys=ON;