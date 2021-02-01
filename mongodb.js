// // CRUD create read update delete

// const { MongoClient, ObjectID } = require('mongodb')

// const connectionURL = 'mongodb://127.0.0.1:27017'
// const databaseName = 'task-manager'

// MongoClient.connect(connectionURL, { useNewUrlParser: true, useUnifiedTopology: true }, (error, client) => {
//     if (error) {
//         return console.log('Unable to connect to database')
//     }
//     const db = client.db(databaseName)

//     // db.collection('users').updateOne({
//     //         _id: new ObjectID("600011d5f160f334d04a6a23")
//     //     },
//     //     // {
//     //     //     $set: {
//     //     //         name: 'Mike'
//     //     //     }
//     //     {
//     //         $inc: {
//     //             age: 1
//     //         }
//     //     }
//     // ).then((result) => {
//     //     console.log(result)
//     // }).catch(() => {
//     //     console.log(error)
//     // })
//     // db.collection('tasks').updateMany({
//     //     completed: false
//     // }, {
//     //     $set: {
//     //         completed: true
//     //     }
//     // }).then((result) => {
//     //     console.log(result.modifiedCount)
//     // }).catch((error) => {
//     //     console.log(error)
//     // })

//     // db.collection('users').deleteMany({
//     //     age: 21
//     // }).then((result) => {
//     //     console.log(result)
//     // }).catch((error) => {
//     //     console.log(error)
//     // })

//     // db.collection('tasks').deleteOne({
//     //     description: "Clean the house"
//     // }).then((result) => {
//     //     console.log(result)
//     // }).catch((error) => {
//     //     console.log(error)
//     // })
// })