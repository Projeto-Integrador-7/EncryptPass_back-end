const swaggerAutogen = require('swagger-autogen')()

const outputFile = './src/swagger.json'
const endpointsFiles = ['./src/routes/userRoutes.js']

const doc = {
    info: {
        version: "1.0.0",
        title: "EncryptPass"
    },
    host: "localhost:3005",
    basePath: "/",
    schemes: ['http', 'https'],
    consumes: ['application/json'],
    produces: ['application/json'],
    securityDefinitions: {
        authorization:{
            type: "oauth",
            in: "header",       // can be "header", "query" or "cookie"
            name: "Authorization",  // name of the header, query parameter or cookie
        }
    },
    tags: [
        {
            "name": "User",
        }
    ],
    definitions: {
        User: {
            name: "José",
            email: "jose@email.com",
            password: "password",
            passwordReminder: true,
            passwordReminderTip: "Some tip",
            phoneNumber: "34 99999-9999"
        }
    }
}

swaggerAutogen(outputFile, endpointsFiles, doc)
