const swaggerAutogen = require('swagger-autogen')()

const outputFile = './src/swagger.json'
const endpointsFiles = [
    './src/routes/userRoutes.js',
    './src/routes/credentialsRoutes.js',
    './src/routes/folderRoutes.js'
]

const doc = {
    info: {
        version: "1.0.0",
        title: "EncryptPass"
    },
    host: "localhost:3005",
    basePath: "/",
    schemes: ['http'],
    consumes: ['application/json'],
    produces: ['application/json'],
    tags: [
        {
            "name": "User",
        },
        {
            "name" : "Credentials"
        },
        {
            "name": "Folder"
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
        },
        Credentials: {
            title: "Google",
            url: "https://www.google.com.br/",
            password: "password",
            login: "jose@email.com",
            folderId: "6237a07d0c3f8033d777160e"
        },
        Folder: {
            title: "Séries",
            description: "Pasta para séries Netflix"
        }
    }
}

swaggerAutogen(outputFile, endpointsFiles, doc)
