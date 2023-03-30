import {
    Router
} from 'express'
import userModel from '../../dao/models/users.model.js'
import passport from 'passport';
import { createHash, isValidPassword } from '../../utils.js';

const router = Router()

router.post('/register', passport.authenticate('register', { failureRedirect: 'fail-register' }), async (req, res) => {
    res.send({status: 'success', message: 'user Registered'})
})

router.get('/fail-register', async (req, res) => {
    res.send({status: 'error', message: 'register failed'})
})


router.post('/login', passport.authenticate('login', { failureRedirect: 'fail-login' }), async (req, res) => {
    if (!req.user) return res.status(400)
        .send({ status: 'error', message: 'Invalid credentials' });

    req.session.user = {
        first_name: req.user.first_name,
        last_name: req.user.last_name,
        name: `${req.user.first_name} ${req.user.last_name}`,
        age: req.user.age,
        email: req.user.email,
        rol: req.user.rol
    }

    res.send({ status: 'success', message: 'login success' });
});

router.get('/fail-login', async (req, res) => {
    res.send({status: 'error', message: 'login failed'})
})

router.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) return res.status(500).send({
            status: 'error',
            error: "couldn't logout"
        })
        res.redirect('/login')
    })
})

router.get('/github', passport.authenticate('github', {scope: ['user:email']}), async (req, res) => {
    res.send({ status: 'success', message: 'user registered' })
})

router.get('/github-callback', passport.authenticate('github', { failureRedirect: '/login' }), (req, res) => {
    req.session.user = req.user
    res.redirect('/products')
})

export default router