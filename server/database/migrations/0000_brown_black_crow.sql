CREATE TABLE `upvotes` (
	`github_id` text NOT NULL,
	`github_login` text NOT NULL,
	`proposal_slug` text NOT NULL,
	`created_at` integer NOT NULL,
	PRIMARY KEY(`github_id`, `proposal_slug`)
);
