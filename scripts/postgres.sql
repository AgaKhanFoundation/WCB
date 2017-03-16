CREATE TABLE "team" (
  "id" serial NOT NULL,
  "name" VARCHAR(255) NOT NULL UNIQUE,
  CONSTRAINT team_pk PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "participant" (
  "id" serial NOT NULL,
  "fbid" VARCHAR(255) NOT NULL UNIQUE,
  "team" integer NOT NULL,
  CONSTRAINT participant_pk PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "record" (
  "id" serial NOT NULL,
  "participant" integer NOT NULL,
  "date" DATE NOT NULL,
  "distance" integer NOT NULL,
  "source" integer NOT NULL,
  CONSTRAINT record_pk PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "source" (
  "id" serial NOT NULL,
  "name" VARCHAR(255) NOT NULL,
  CONSTRAINT source_pk PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "sponsor" (
  "id" serial NOT NULL,
  "name" VARCHAR(255) NOT NULL UNIQUE,
  CONSTRAINT sponsor_pk PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "sponsorship" (
  "id" serial NOT NULL,
  "participant" integer NOT NULL,
  "sponsor" integer NOT NULL,
  "donation" integer NOT NULL,
  CONSTRAINT sponsorship_pk PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "destinations" (
  "id" serial NOT NULL,
  "name" VARCHAR(255) NOT NULL UNIQUE,
  "distance" integer NOT NULL,
  CONSTRAINT destinations_pk PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "accomplishment" (
  "id" serial NOT NULL,
  "team" integer NOT NULL,
  "destination" integer NOT NULL,
  CONSTRAINT accomplishment_pk PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);




ALTER TABLE "participant" ADD CONSTRAINT "participant_fk0" FOREIGN KEY ("team") REFERENCES "team"("id");

ALTER TABLE "record" ADD CONSTRAINT "record_fk0" FOREIGN KEY ("participant") REFERENCES "participant"("id");
ALTER TABLE "record" ADD CONSTRAINT "record_fk1" FOREIGN KEY ("source") REFERENCES "source"("id");



ALTER TABLE "sponsorship" ADD CONSTRAINT "sponsorship_fk0" FOREIGN KEY ("participant") REFERENCES "participant"("id");
ALTER TABLE "sponsorship" ADD CONSTRAINT "sponsorship_fk1" FOREIGN KEY ("sponsor") REFERENCES "sponsor"("id");


ALTER TABLE "accomplishment" ADD CONSTRAINT "accomplishment_fk0" FOREIGN KEY ("team") REFERENCES "team"("id");
ALTER TABLE "accomplishment" ADD CONSTRAINT "accomplishment_fk1" FOREIGN KEY ("destination") REFERENCES "destinations"("id");

