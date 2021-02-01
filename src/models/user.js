const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Task = require('./tasks')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid')
            }
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 7,
        validate(value) {
            if (value.toLowerCase().includes('password')) {
                throw new Error('Password cannot contain "password"')
            }
        }

    },
    age: {
        type: Number,
        default: 0, // if no age provided then marked as 0
        validate(value) {
            if (value < 0) {
                throw new Error('Age must be a positive number')
            }
        }
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
    avatar: {
        type: Buffer
    }
}, {
    timestamps: true
})

userSchema.virtual('tasks', {
    ref: 'Task',
    localField: '_id', // local data is stored
    foreignField: 'owner' // name of field on other thing i.e Task
})

userSchema.methods.generateAuthToken = async function() {
    // userschema methods for methods on insatnce nd indiviudal users

    const user = this
    const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET)

    user.tokens = user.tokens.concat({ token })
    await user.save()

    return token
}

// userSchema.methods.getPublicProfile = function() {
//     const user = this
//     const userObject = user.toObject()

//     delete userObject.password
//     delete userObject.tokens

//     return userObject
// }

userSchema.methods.toJSON = function() {
    const user = this
    const userObject = user.toObject()

    delete userObject.password
    delete userObject.tokens
    delete userObject.avatar

    return userObject
}




userSchema.statics.findByCredentials = async(email, password) => {
    // methods on User model
    const user = await User.findOne({ email })

    if (!user) {
        throw new Error('Unable to Log In')
    }

    const isMatch = await bcrypt.compare(password, user.password) // plain text password , the hASH , 2 arguments

    if (!isMatch) {
        throw new Error('Unable to Log In')
    }

    return user
}

// Hash the plain text password b4 saving
// The function itself checks if the password has been
// altered. If the password has been altered, the plain text password is overwritten with a
// hashed version.
// below is a middleware
userSchema.pre('save', async function(next) {
    const user = this

    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }

    next()

})

// delete user tasks when user is deleted // middleware

userSchema.pre('remove', async function(next) {
    const user = this
        // Deleteing multiple tasks using just owner field
    await Task.deleteMany({ owner: user._id })

    next()
})

const User = mongoose.model('User', userSchema)

// const name = new User({
//     name: '  Pranav  ',
//     email: 'mike@gmail.com    ',
//     password: 'phone098!'
// })

// // const me = new User({
// //     name: 'Pranav',
// //     age: 'anc'
// // })

// name.save().then(() => {
//     console.log(name)
// }).catch((error) => {
//     console.log('Error!', error)
// })

module.exports = User