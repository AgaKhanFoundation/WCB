CREATE DATABASE wcb;
use wcb;

CREATE TABLE `team` (
  `id` INT NOT NULL,
  `name` VARCHAR(255) NOT NULL UNIQUE,
  PRIMARY KEY (`id`)
);

CREATE TABLE `participant` (
  `id` INT NOT NULL,
  `fbid` VARCHAR(255) NOT NULL UNIQUE,
  `team` INT NOT NULL,
  PRIMARY KEY (`id`)
);

CREATE TABLE `record` (
  `id` INT NOT NULL,
  `participant` INT NOT NULL,
  `date` DATE NOT NULL,
  `distance` INT NOT NULL,
  `source` INT NOT NULL,
  PRIMARY KEY (`id`)
);

CREATE TABLE `source` (
  `id` INT NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`id`)
);

CREATE TABLE `sponsor` (
  `id` INT NOT NULL,
  `name` VARCHAR(255) NOT NULL UNIQUE,
  PRIMARY KEY (`id`)
);

CREATE TABLE `sponsorship` (
  `id` INT NOT NULL,
  `participant` INT NOT NULL,
  `sponsor` INT NOT NULL,
  `donation` INT NOT NULL,
  PRIMARY KEY (`id`)
);

CREATE TABLE `destinations` (
  `id` INT NOT NULL,
  `name` VARCHAR(255) NOT NULL UNIQUE,
  `distance` INT NOT NULL,
  PRIMARY KEY (`id`)
);

CREATE TABLE `accomplishment` (
  `id` INT NOT NULL,
  `team` INT NOT NULL,
  `destination` INT NOT NULL,
  PRIMARY KEY (`id`)
);

ALTER TABLE `participant` ADD CONSTRAINT `participant_fk0` FOREIGN KEY (`team`) REFERENCES `team`(`id`);

ALTER TABLE `record` ADD CONSTRAINT `record_fk0` FOREIGN KEY (`participant`) REFERENCES `participant`(`id`);

ALTER TABLE `record` ADD CONSTRAINT `record_fk1` FOREIGN KEY (`source`) REFERENCES `source`(`id`);

ALTER TABLE `sponsorship` ADD CONSTRAINT `sponsorship_fk0` FOREIGN KEY (`participant`) REFERENCES `participant`(`id`);

ALTER TABLE `sponsorship` ADD CONSTRAINT `sponsorship_fk1` FOREIGN KEY (`sponsor`) REFERENCES `sponsor`(`id`);

ALTER TABLE `accomplishment` ADD CONSTRAINT `accomplishment_fk0` FOREIGN KEY (`team`) REFERENCES `team`(`id`);

ALTER TABLE `accomplishment` ADD CONSTRAINT `accomplishment_fk1` FOREIGN KEY (`destination`) REFERENCES `destinations`(`id`);
