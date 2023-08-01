# Northcoders News

## Project Overview
News - Back End is a straightforward web API that enables users to read, post, and comment on news articles. It was developed to complement the News Front End project. This project was created as part of the Northcoders web development bootcamp, serving as a portfolio piece to showcase proficiency in full stack development using Node.js and React.

### Installation
To run the API locally, you'll need to have the following software installed:
Node.js (v14.15.4 or later) PostgreSQL (v12 or later)

To install the API:
- clone this repository to your local machine;
- navigate to the root directory of the project in your terminal;
- run npm install to install the project's dependencies;
- create a local PostgreSQL database for the API to use;
- create two environment files .env.development and env.test in the root directory of the project, and add the necessary environment variables   to connect to the development and test databases, respectively (see the "Env files" section for more details);

Run npm run seed to seed the development database with some initial data Run npm test to run the project's tests and ensure everything is working as expected Run npm start to start the API and make it available on http://localhost:9090

#### .env Files

Your first job will be add files in order to successfully connect to the two databases locally

- create an env.test file in the root directory of the project
- create an env.development file in the root directory of the project
- add PGDATABASE=<database_name_here> and replace the values for each environment variable with the corresponding values for your local set up
- save your changes;
  
With these environment variables set up, you should be able to run the project locally and connect to the two databases.

>**Hint**: Make sure to add this files to your "gitignore" file as this ensures that sensitive information like passwords and host URLs are not accidentally exposed.
Endpoints

##### The API has the following endpoints:

- GET /api/topics: Retrieve a list of topics 
- GET /api/articles: Retrieve a list of articles 
- GET /api/articles/:article_id: Retrieve an article by its ID 
- GET /api/articles/:article_id/comments: Retrieve a list of comments for an article 
- POST /api/articles/:article_id/comments: Post a new comment to an article 
- PATCH /api/articles/:article_id: Update an article's vote count 
- DELETE /api/comments/:comment_id: Delete a comment

Each endpoint has been designed to handle various possible errors and send appropriate HTTP status codes to the client.

For more information on each endpoint please see the endpoints.json file.

Using NC News
A working example of this demo is published [here](https://newsbackend.inna.codes/api)

Author
Inna Chtej - Northcoders Student

