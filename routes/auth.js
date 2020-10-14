/*
    Rutas de usuario/auth
    host + /api/auth
*/

const { Router } = require('express');
const { check } = require('express-validator')
const { validarCampos } = require('../middlewares/validar-campos');
const { createUser, loginUser, revalidateToken } = require('../controllers/auth');
const { validarJWT } = require('../middlewares/validar-jwt');
const router = Router();

router.post(
    '/new', 
    [ // Middlewares
        check('name', 'El nombre es obligatrio').not().isEmpty(),
        check('email', 'El email es obligatrio').isEmail(),
        check('password', 'La contraseña debe de ser de al menos 6 caracteres').isLength({min: 6}),
        validarCampos,
    ], 
    createUser
);

router.post('/',
    [
        check('email', 'El email es obligatrio').isEmail(),
        check('password', 'La contraseña debe de ser de al menos 6 caracteres').isLength({min: 6}),
        validarCampos,
    ],
    loginUser
);

router.get('/renew', validarJWT, revalidateToken);




module.exports = router;