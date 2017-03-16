CREATE TABLE team (
  id integer PRIMARY KEY AUTOINCREMENT,
  name string
);

CREATE TABLE participant (
  id integer PRIMARY KEY AUTOINCREMENT,
  fbid string,
  team integer
);

CREATE TABLE record (
  id integer PRIMARY KEY AUTOINCREMENT,
  participant integer,
  date date,
  distance integer,
  source integer
);

CREATE TABLE source (
  id integer PRIMARY KEY AUTOINCREMENT,
  name string
);

CREATE TABLE sponsor (
  id integer PRIMARY KEY AUTOINCREMENT,
  name string
);

CREATE TABLE sponsorship (
  id integer PRIMARY KEY AUTOINCREMENT,
  participant integer,
  sponsor integer,
  donation integer
);

CREATE TABLE destinations (
  id integer PRIMARY KEY AUTOINCREMENT,
  name string,
  distance integer
);

CREATE TABLE accomplishment (
  id integer PRIMARY KEY AUTOINCREMENT,
  team integer,
  destination integer
);

