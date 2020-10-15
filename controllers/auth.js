const {response} = require('express');
const bcrypt = require('bcryptjs');
const Usuario = require('../models/Usuario');
const {generarJWT} = require('../helpers/jwt');

const createUser = async (req, res = response) => {

    const { email, password} = req.body;

    try {
        let usuario = await Usuario.findOne({ email });

        if(usuario){
            return res.status(400).json({
                ok: false,
                msg: 'El email ya esta en uso'
            })
        }

        usuario = new Usuario(req.body);

        // Encriptar contraseña
        const salt = bcrypt.genSaltSync(); //10 por defecto
        usuario.password = bcrypt.hashSync(password, salt);

        await usuario.save();

        // Generar JWT
        const token = await generarJWT(usuario.id, usuario.name);
    
        res.status(201).json({
            ok: true,
            uid: usuario.id,
            name: usuario.name,
            token
        })
    } catch (err){
        console.log(err);
        res.status(500).json({
            ok:false,
            msg: 'Por favor hable con el administrador'
        })
    }
}

const loginUser = async (req, res = response) => {

    const { email, password} = req.body;
    try {

        const usuario = await Usuario.findOne({ email });

        if( !usuario ){
            return res.status(400).json({
                ok: false,
                msg: 'El (email) o password no son correctos'
            })
        }

        // Confirmar los password
        const validPassword = bcrypt.compareSync( password, usuario.password );

        if(!validPassword){ 
            return res.status(400).json({
                ok: false,
                msg: 'El email o (password) no son correctos'
            })
        }

        // Generar JWT
        const token = await generarJWT(usuario.id, usuario.name);

        res.status(200).json({
            ok: true,
            id: usuario.id,
            name: usuario.name,
            token
        })
 
    } catch (err) {
        console.log(err);
        res.status(500).json({
            ok:false,
            msg: 'Por favor hable con el administrador'
        })
    }
}

const revalidateToken = async (req, res = response) => {

    const { uid, name } = req;
    const token = await generarJWT(uid, name);
    
    res.json({
        ok: true,
        uid,
        name,
        token
    })
}

module.exports = {
    createUser,
    loginUser,
    revalidateToken
}