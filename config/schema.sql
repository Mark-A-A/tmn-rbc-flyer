CREATE DATABASE virtual_flyer_db;
USE virtual_flyer_db;


CREATE TABLE users (
id int NOT NULL AUTO_INCREMENT,
first_name varchar(255) NOT NULL,
last_name varchar(255) NOT NULL,
email varchar(255) NOT NULL,
username varchar(255) NOT NULL,
password varchar(255) NOT NULL,
location varchar(255) NOT NULL,
student boolean DEFAULT 0 NOT NULL,
teacher boolean DEFAULT 0 NOT NULL,
createdDate timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
lastModified timestamp NOT NULL DEFAULT now() on update now()
authenticated boolean DEFAULT 0 NOT NULL

);

CREATE TABLE posts (
id int NOT NULL AUTO_INCREMENT,
first_name varchar(255) NOT NULL,
last_name varchar(255) NOT NULL,
username varchar(255) NOT NULL,
email varchar(255) NOT NULL,
password varchar(255) NOT NULL,
location varchar(255) NOT NULL,
student boolean DEFAULT 0 NOT NULL,
teacher boolean DEFAULT 0 NOT NULL,
createdDate timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
lastModified timestamp NOT NULL DEFAULT now() on update now()
authenticated boolean DEFAULT 0 NOT NULL

);


-- Events
-- Venues