# Troika!

A small Nodejs / socket.io / Angular (1.8) website for running games of Troika.

## Installation

* Setup a database - this was developed with PostgreSQL but most SQL flavors should work.
* Copy `.env.example` to `.env` and add your credentials.
* You'll need `sass` to build assets; if it's globally installed run `yarn sass` or `npm run sass` to compile.
* Run `yarn start` or `npm start` to start up the webserver.