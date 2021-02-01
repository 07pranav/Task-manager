const { response } = require('express');
const express = require('express');
const auth = require('../middleware/auth');
const router = new express.Router();
const User = require('../models/user')
const multer = require('multer')
const sharp = require('sharp')
const { sendWelcomeEmail, sendCancelationEmail } = require('../emails/account')

router.post('/users', async(req, res) => {
    // signup route
    const user = new User(req.body)
        // promise comes back from user.save that will be used using await
    try {
        await user.save() // now if promise comes then only below code will run
        sendWelcomeEmail(user.email, user.name)
        const token = await user.generateAuthToken() // generationg token for saved user
        res.status(201).send({ user, token })
    } catch (e) {
        res.status(400).send(e)
    }
})

router.post('/users/login', async(req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
            // res.send(user)// only sending user
            // res.send({ user: user.getPublicProfile(), token }) // sending object with 2 propoerties
        res.send({ user, token })
    } catch (e) {
        res.status(400).send()
    }
})



router.post('/users/logout', auth, async(req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter(token => {
            // to filter out specific tokens i.e to logout from particular device
            return token.token !== req.token
                // token object has 2 properties token and object as v seen in postman
        })
        await req.user.save()

        res.send()
    } catch (e) {
        res.status(500).send()
    }
})

router.post('/users/logoutAll', auth, async(req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.send()
    } catch (e) {
        res.status(500).send()
    }
})


router.get('/users/me', auth, async(req, res) => {
    res.send(req.user)
        // try {
        //     const users = await User.find({})
        //     res.send(users)
        // } catch (e) {
        //     res.status(500).send()
        // }
})



// patch is used for updating
router.patch('/users/me', auth, async(req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'password', 'age']
    const isValidOperation = updates.every((update) => {
        return allowedUpdates.includes(update)
    })

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid Updates!' })
    }

    try {
        // const user = await User.findById(req.params.id)

        updates.forEach((update) => {
            req.user[update] = req.body[update] // for values nd keys updating in the updates array
        })
        await req.user.save()
            // const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
        res.send(req.user)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.delete('/users/me', auth, async(req, res) => {
    try {
        // const user = await User.findByIdAndDelete(req.user._id)
        // if (!user) {
        //     return res.status(404).send()
        // }
        // req.user._id is d id of d user we fetched as v used auth nd we hv can get user from req.user and it has propertty

        await req.user.remove()
        sendCancelationEmail(req.user.email, req.user.name)
        res.send(req.user) // delete successfully
    } catch (e) {
        res.status(500).send()
    }
})

const upload = multer({
    // dest: 'avatars',
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('Please upload an image'))
        }

        cb(undefined, true)
    }
})

// this route is used for both creating and updating d avatar
// router.post('/users/me/avatar', auth, upload.single('avatar'), async(req, res) => {
//     req.user.avatar = req.file.buffer
//     await req.user.save()
//     res.send()
// }, (error, req, res, next) => {
//     res.status(400).send({ error: error.message })
// })

router.post('/users/me/avatar', auth, upload.single('avatar'), async(req, res) => {

    const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer()
    req.user.avatar = buffer
    await req.user.save()
    res.send()
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message })
})

router.delete('/users/me/avatar', auth, async(req, res) => {
    req.user.avatar = undefined
    await req.user.save()
    res.send()
})

router.get('/users/:id/avatar', async(req, res) => {
    try {
        // lukin for image by user id
        const user = await User.findById(req.params.id)

        if (!user || !user.avatar) {
            throw new Error()
        }

        res.set('Content-type', 'image/png')
        res.send(user.avatar)

    } catch (e) {
        res.status(400).send()
    }
})

module.exports = router