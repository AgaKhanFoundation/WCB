
DROP TABLE IF EXISTS "notification_registration";
CREATE TABLE `notification_registration` (`id` INTEGER NOT NULL UNIQUE PRIMARY KEY, `fbid` VARCHAR(255) UNIQUE, `fcmToken` VARCHAR(255));
