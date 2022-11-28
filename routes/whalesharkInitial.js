const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const userModel = require('../models/userModel')


let router = express()

router.post('/user/registration', async (req, res) => {
    try {
        var { role, userName, name, phone, email, password } = req.body;

        if (role == undefined || role == null) {
            res.status(200).json
                (
                    {
                        status: false,
                        msg: "Role is not given"
                    }
                )
            return
        }

        if (userName == undefined || userName == null) {
            res.status(200).json
                (
                    {
                        status: false,
                        msg: "User Name is not given"
                    }
                )
            return
        }
        if (name == undefined || name == null) {
            res.status(200).json
                (
                    {
                        status: false,
                        msg: "Name is not given"
                    }
                )
            return
        }

        if (phone == undefined || phone == null) {
            res.status(200).json
                (
                    {
                        status: false,
                        msg: "Phone number is already given "
                    }
                )
            return
        }
        if (email == undefined || email == null) {
            res.status(200).json
                (
                    {
                        status: false,
                        msg: "Email is not given"
                    }
                )
            return
        }
        if (password == undefined || password == null) {
            res.status(200).json
                (
                    {
                        status: false,
                        msg: "Password is not given"
                    }
                )
            return
        }

       
        var phoneNumExists = await userModel.findOne({ phonenum: phone })//datbase:from body

        if (phoneNumExists != null || phoneNumExists != undefined) {
            res.status(200).json({
                status: false,
                msg: "phone number already exists"
            })
            return;
        }

        var encpass = await bcrypt.hash(password, 10)

        var users = new userModel()
        users.role = role;
        users.username = userName;
        users.name = name;
        users.phonenum = phone;
        users.emailid = email;
        users.password = encpass;

        await users.save()

        res.status(200).json({
            status: true,
            output: users
        })
        return
    }
    catch (e) {
        console.log(e)
    }
})

router.post('/login', async (req, res) => {
    try {
        var { phone, password } = req.body;

        if (phone == undefined || password == null) {
            res.status(200).json
                (
                    {
                        status: false,
                        msg: "Phone number is not given"

                    }
                )
            return
        }

        if (password == undefined || password == null) {
            res.status(200).json
                (
                    {
                        status: false,
                        msg: "Password is not given"

                    }
                )
            return
        }
        var userexists = await userModel.findOne({ phonenum: phone })

        if (userexists == null || userexists == undefined) {
            res.status(200).json({
                status: false,
                msg: "invalid credentials"
            })
            return;
        }

        if(await bcrypt.compare(password,userexists.password)) {
            var token =jwt.sign({ user:userexists }, "Test")
            var tokenData = new tokenModel()
            tokenData.userId = userexists._id
            tokenData.token = token

            await tokenData.save()

            res.status(200).json({
                status:true,
                token:token,
                msg:"Login Successful"

            })
            return;
        }
        else {
            res.status(200).json({
                status: false,
                msg: "invalid credentials"
            })
            return;
        }

    }
    catch (e) {
        console.log(e)
    }
    router.post('/token', async (req, res) => {   //token validation
        try {
            var { token } = req.body
            if (token == undefined || token == null) {
                res.status(200).json
                    (
                        {
                            status: false,
                            msg: "Token is invalid"
                        }
                    )
                return
            }
    
            var tokenexists = await tokenModel.findOne({ token: token })//database:body
    
            if (tokenexists == null || tokenexists == undefined) {
                res.status(200).json({
                    status: false,
                    msg: "token doesnt match"
                })
                return;
            }
            else {
                res.status(200).json({
                    status: true,
                    msg: "token do exist"
                })
                return;
            }
    
        }
        catch (e) {
            console.log(e)
        }
    })
    router.post('/gettoken', async (req, res) => {
        try {
            var { get_token } = req.body;
            if (get_token == null || get_token == undefined) {
                res.status(200).json({
                    status: false,
                    msg: "did not get token "
                })
                return;
    
            }
    
            var tokenexists = await tokenModel.findOne({ token: get_token, status: "Active" }).populate("userId")
            if (tokenexists == null || tokenexists == undefined) {
                res.status(200).json({
                    status: false,
                    msg: "token doesn't exist in database "
                })
                return;
            }
            else {
    
                res.status(200).json({
                    status: true,
                    msg: "userdata do exist",
                    userData: tokenexists
    
                })
                return;
            }
        }
        catch (e) {
            console.log(e)
        }
    })
})
router.post('/verifytoken/middleware', async (req, res) => {
    try {
        var { token } = req.body;
        if (token == null || token == undefined) {
            res.status(200).json({
                status: false,
                msg: "did not get token "
            })
            return;

        }
        var userr = jwt.verify(token, "Test")
        console.log(userr)
        return;
    }
    catch (e) {
        console.log(e)
    }
})
router.post('/user/profile', async (req, res) => {
    try {
        var { token } = req.body;
        if (token == null || token == undefined) {
            res.status(200).json({
                status: false,
                msg: "did not get token "
            })
            return;

        }
        else{
            var userr = jwt.verify(token, "Test")
        console.log(userr)
        res.status(200).json({
            status: true,
            data: userr
        })
        return;
        }
        
    }
    catch (e) {
        console.log(e)
    }
})
router.post('/verifytoken/middleware', async (req, res) => {
    try {
        var { token } = req.body;
        if (token == null || token == undefined) {
            res.status(200).json({
                status: false,
                msg: "did not get token "
            })
            return;

        }
        var userr = jwt.verify(token, "Test")
        console.log(userr)
        return;
    }
    catch (e) {
        console.log(e)
    }
})

router.post('/user/profile/withtoken', userAuth,async (req, res) => {
    try {
        var { token } = req.body;
        if (token == null || token == undefined) {
            res.status(200).json({
                status: false,
                msg: "did not get token "
            })
            return;

        }
        else{
            var userr = jwt.verify(token, "Test")
        console.log(userr)
        res.status(200).json({
            status: true,
            data: userr
        })
        return;
        }
        
    }
    catch (e) {
        console.log(e)
    }
})


router.post('/user/edit/new', async (req, res) => { 
    try {
         var{ role, userName, name, phone, email,id}= req.body
        
            
         if(id==null||id==undefined){
            res.status(200).json
               (
                   {
                           status: true,
                           msg: "id is not given"
                   }
               )
               return;
           }

           var userExists=await userModel.findOne({_id:id})
            if(userExists==null||userExists==undefined){
             res.status(200).json
                (
                    {
                            status: false,
                            msg: "User not found"
                    }
                )
                return
            }
            if(role!=null||role!=undefined){
                userExists.role=role
             }
            if(userName!=null||userName!=undefined){
               userExists.username=userName
            }
            if(name!=null||name!=undefined){
                userExists.name=name
             }
               if(phone!=null||phone!=undefined){
                userExists.phonenum=phone
               }
               if(email!=null||email!=undefined){
                userExists.emailid=email
               }
               await userExists.save()

               res.status(200).json
                       (
                           {
                               status: true,
                               output: userExists
                           }
                       )
                   return
            }
        catch (e) {
            console.log(e)
        }
    })

module.exports = router