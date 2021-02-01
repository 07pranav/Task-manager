const express = require('express')
require('./db/mongoose')
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')

const app = express()
    // const port = process.env.PORT || 3000
const port = process.env.PORT

app.use(express.json())
app.use(taskRouter)
app.use(userRouter)


app.listen(port, () => {
    console.log('Server is up on port ' + port)
})






//Using middleware
// app.use((req, res, next) => {
//     if (req.method === 'GET') {
//         res.send('Get requests are disabled')
//     } else {
//         next()
//     }
// })

// app.use((req, res, next) => {
//     res.status(503).send('Site is Currently Down.')
// })

// File upload in express
// const multer = require('multer')
// const upload = multer({
//     dest: 'images',
//     limits: {
//         fileSize: 1000000
//     },
//     fileFilter(req, file, cb) {
//         // if (!file.originalname.endsWith('.pdf')) {
//         //     return cb(new Error('Please upload a pdf'))
//         // }
//         if (!file.originalname.match(/\.(doc|docx)$/)) {
//             return cb(new Error('Please upload a Word document'))
//         }

//         //   cb(new Error('File must be a PDF')) 
//         cb(undefined, true)
//             //   cb(undefined, false) 
//     }
// })

// app.post('/upload', upload.single('upload'), (req, res) => {
//     res.send()
// }, (error, req, res, next) => {
//     res.status(400).send({ error: error.message })
// })








// const bcrypt = require(('bcryptjs'))
// const jwt = require('jsonwebtoken')

// const Task = require('./models/tasks')
// const User = require('./models/user')

// How populate works
// const main = async() => {
//     // const task = await Task.findById('60128d51e773747b6c8d2793')
//     // await task.populate('owner').execPopulate()
//     // console.log(task.owner)

//     const user = await User.findById('60128a084b96e663fcdd9c86')
//     await user.populate('tasks').execPopulate()
//     console.log(user.tasks)

// }
// main()