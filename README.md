<!-- markdownlint-configure-file {
  "MD013": {
    "code_blocks": false,
    "tables": false
  },
  "MD033": false,
  "MD041": false
} -->

<div align="center">

# **Bank transactions**<br />
![Github][github.badge] ![Node.JS][nodejs.badge] ![TypeScript][typeScript.badge] ![Fastify][Fastify.badge] ![SQLite][SQLite.badge] ![Vitest][Vitest.badge]
----
<br />

<table>
<tr>
<td align="center">
This repository hosts a REST API project that uses several technologies in order to study and implement efficient, maintainable and reliable code.
</td>
</tr>
</table>
<br />

[Summary](#summary) •
[Solution](#solution) •
[Requirements](#requirements) •
[Quickstart](#quickstart) •
[API Endpoint Reference](#api-endpoint-reference) •
[Test](#test) 

</div>

## **Summary**

This repository contains a REST API project that allows you to store and retrieve transaction data from a database. The project used TypeScript for efficient and reliable code, Zod for data validation, Knex as ORM solution and Fastify as web framewor. Vitest with Supertest were used to test the application. For additional details, please continue reading.

## **Solution**

In this project, I had the opportunity to work with a variety of tools and technologies to develop high-quality code.
First and foremost, I utilized TypeScript to write efficient and reliable code. It allowed me to catch errors before runtime, which saved a lot of time and improved the overall quality of my code.

In addition, I used Zod to perform data validation in my project. Zod is a lightweight and powerful data validation library that allows you to define data schemas with ease. With Zod, I was able to ensure that my data was correct and free from errors, which helped prevent bugs and improve the reliability of my application.

To interact with my database, I used Knex, an ORM (Object-Relational Mapping) solution. Knex is a flexible and intuitive library that makes it easy to build SQL queries and perform database operations. It allowed me to abstract away the underlying SQL and work with a higher-level interface, which made my code more concise and easier to read.

For my web framework, I chose Fastify. Fastify is a highly performant and low overhead framework that is perfect for building fast and efficient web applications.

Finally, I used Vitest, a testing framework, along with the Supertest package, to write comprehensive end to end tests for my application. Vitest allowed me to write tests in a clear and concise way, and Supertest made it easy to perform HTTP requests and assertions. Together, they helped me ensure that my application was working as expected.

In addition, the build package for this project was created using the tsup package. Tsup is a zero-config TypeScript bundler that allows for easy and efficient bundling of TypeScript projects. It helped to streamline the build process and make it easier to deploy the application.

Overall, this project was a great learning experience that allowed me to work with a variety of powerful tools and technologies. I hope that my work here can be useful to others and inspire them to explore these tools further. 

## **Requirements**

- Node.JS: 18.14.0
    - NPM Package: 9.3.1

## **Quickstart**

Below are the step-by-step instructions for running the project and accessing the endpoints specified throughout this document:

1. Create a `.env` file with NODE_ENV and DATABASE_URL environment variable (check the example file ([.env.example])
2. Install npm packages:<br />
    + `npm install`
3. Run the command tsup to transpile the TypeScript code to JavaScript. This will generate the JavaScript files in the ./build directory:<br />
    + `node run build`
4. Once the transpilation is complete, to start the server and access the endpoints, run the following code:<br />
    + `node ./build/server.js`

<br />

## **API Endpoint Reference**

This REST API has only a few routes, as I said, the main objective was to study the power of this stack, so the endpoints are as follows:

1. **Create Transaction**

   <details>
   <summary><u>Request</u></summary>

   >
   > ``` POST /transactions ```
   >
   > Body (JSON Object):
   >
   > | Property | Value |
   > | :---: | ------ |
   > | title | Transaction description |
   > | amount | Amount of transaction |
   > | type | Transaction type (credit / debit) |
   >
   > Body example:
   > ```javascript 
   > {"title": "Example transaction", "amount": 100, "type": "credit" }  
   > ```

   </details>

   <details>
   <summary><u>Response</u></summary>

   > | Code | Body | Cookie |
   > | :---: | :------:  | :------: |
   > | 201 | None | SessionId cookie|

   </details>

2. **Get list of transactions**

   <details>
   <summary><u>Request</u></summary>

   >
   > ``` GET /transactions ```
   >
   > Cookie
   >
   > ```text
   > sessionId=<sessionCode>; Path=<accepted path>; Expires=<expiration date>;
   > ```

   </details>

   <details>
   <summary><u>Response</u></summary>

   > | Code | Body | Cookie |
   > | :---: | :------:  | :------: |
   > | 200 | A JSON object with a 'transactions' property that contains a list of transaction objects | SessionId cookie|

   </details>

3. **Get a specific transaction**

   <details>
   <summary><u>Request</u></summary>

   >
   > ``` GET /transactions/:id ```
   >
   > Route Parameter (:id): The ID of a valid transaction (e.g., eac8e6b4-7ffa-4974-a987-a713e02bde88)
   >
   > Cookie
   >
   > ```text
   > sessionId=<sessionCode>; Path=<accepted path>; Expires=<expiration date>;
   > ``` 

   </details>

   <details>
   <summary><u>Response</u></summary>

   > | Code | Body | Cookie |
   > | :---: | :------:  | :------: |
   > | 200 | A JSON object with a 'transaction' property that contains only specific transaction object | SessionId cookie|

   </details>

4. **Get transaction's summarize**

   <details>
   <summary><u>Request</u></summary>

   >
   > ``` GET /transactions/summary ```
   >
   > Cookie
   >
   > ```text
   > sessionId=<sessionCode>; Path=<accepted path>; Expires=<expiration date>;
   > ```

   </details>

   <details>
   <summary><u>Response</u></summary>

   > | Code | Body | Cookie |
   > | :--: | :------:  | :------: |
   > | 200  | JSON object with 'summary' property indicating total transactions created, accounting for debit/credit | SessionId cookie|

   </details>
<br />

> **Warning** <br />
*This API uses cookies to maintain a kind of session and recognize the user. To access persistent transactions, pass the cookie created during the creation of the first transaction. This mechanism restricts user access to only their own transactions.

## **Test**

To run tests, use the following command:

`npm run test`

> **Warning** <br />
> To run tests, it is mandatory to create a .env.test file in the root directory that will be used alongside vittest. Please refer to the example for constructing this environment variables file ([.env.test.example])

[github.badge]: https://img.shields.io/badge/GitHub-181717.svg?style=for-the-badge&logo=GitHub&logoColor=white
[nodejs.badge]: https://img.shields.io/badge/Node.js-339933.svg?style=for-the-badge&logo=nodedotjs&logoColor=white
[typeScript.badge]: https://img.shields.io/badge/TypeScript-3178C6.svg?style=for-the-badge&logo=TypeScript&logoColor=white
[Fastify.badge]: https://img.shields.io/badge/fastify-202020?style=for-the-badge&logo=fastify&logoColor=white
[SQLite.badge]: https://img.shields.io/badge/SQLite-003B57.svg?style=for-the-badge&logo=SQLite&logoColor=white
[Vitest.badge]: https://img.shields.io/badge/Vitest-6E9F18.svg?style=for-the-badge&logo=Vitest&logoColor=white
[.env.example]: .env.example
[.env.test.example]: .env.test.example