const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const userModel = require('../models/userModel')
const tokenModel = require('../models/tokenModel')
const waterModel = require('../models/waterModel')
const userAuth = require('../middleware/userAuth')
const adminAuth = require('../middleware/adminAuth')

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


router.post('/user/edit/new',userAuth, async (req, res) => { 
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
    router.post('/in/net',userAuth, async (req, res) => {
        try {
            var { type,photo,length,gender,location,description,boatNo,boatOwner,docs} = req.body;
    
            if (type == undefined || type== null) {
                res.status(200).json
                    (
                        {
                            status: false,
                            msg: "type is not given"
    
                        }
                    )
                return
            }

            if (type!="inNet") {
                res.status(200).json
                    (
                        {
                            status: false,
                            msg: "type given is not inNet"
    
                        }
                    )
                return
            }
    
            // if (photo == undefined || photo == null) {
            //     res.status(200).json
            //         (
            //             {
            //                 status: false,
            //                 msg: "Photo is not given"
    
            //             }
            //         )
            //     return
            // }
            if (length == undefined || length == null) {
                res.status(200).json
                    (
                        {
                            status: false,
                            msg: "length is not given"
    
                        }
                    )
                return
            }
            if (gender == undefined || gender == null) {
                res.status(200).json
                    (
                        {
                            status: false,
                            msg: "gender is not given"
    
                        }
                    )
                return
            }
    
            if (location == undefined || location == null) {
                res.status(200).json
                    (
                        {
                            status: false,
                            msg: "Location is not given"
    
                        }
                    )
                return
            }
            if (description == undefined || description == null) {
                res.status(200).json
                    (
                        {
                            status: false,
                            msg: "Description is not given"
    
                        }
                    )
                return
            }
            if (boatNo == undefined || boatNo== null) {
                res.status(200).json
                    (
                        {
                            status: false,
                            msg: "boat number is not given or invalid"
    
                        }
                    )
                return
            }
            
            if (boatOwner == undefined || boatOwner == null) {
                res.status(200).json
                    (
                        {
                            status: false,
                            msg: "Boat Owner is not given or invalid"
    
                        }
                    )
                return
            }

            // if (docs == undefined || docs == null) {
            //     res.status(200).json
            //         (
            //             {
            //                 status: false,
            //                 msg: "doc is not given or invalid type"
    
            //             }
            //         )
            //     return
            // }
           
            var inNet = new waterModel()

           inNet.animalType=type,
           inNet.photo=photo,
           inNet.animalLength=length,
           inNet.gender=gender,
           inNet.description=description,
           inNet.location=location,
           inNet.boatNo= boatNo,
           inNet.boatOwner= boatOwner,
           inNet.document=docs
           
            await inNet.save()
    
            res.status(200).json({
    
                status: true,
                output: inNet
    
            })
            return
    
        }
        catch (e) {
            console.log(e)
        }
    })
    router.post('/inNet/edit',userAuth, async (req, res) => { 
        try {
             var{ id,type,photo,length,gender,location,description,boatNo,boatOwner,docs}= req.body
            
                
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
    
               var animalExists=await waterModel.findOne({_id:id})
                if(animalExists==null||animalExists==undefined){
                 res.status(200).json
                    (
                        {
                                status: false,
                                msg: "id not found"
                        }
                    )
                    return
                }
                if(type!=null||type!=undefined){
                    animalExists.animaltype=type
                 }
                if(photo!=null||photo!=undefined){
                   animalExists.photo=photo
                }
                if(length!=null||length!=undefined){
                    animalExists.animalLength=length
                 }
                 if(gender!=null||gender!=undefined){
                    animalExists.gender=gender
                   }
                 if(location!=null||location!=undefined){
                    animalExists.location=location
                   }
                if(description!=null||description!=undefined){
                    animalExists.description=description
                }
                if(boatNo!=null||boatNo!=undefined){
                    animalExists.boatNo=boatNo
                }
                if(boatOwner!=null||boatOwner!=undefined){
                    animalExists.boatOwner=boatOwner
                } 
                if(docs!=null||docs!=undefined){
                    animalExists.document=docs
                }

                   await animalExists.save()
    
                   res.status(200).json
                           (
                               {
                                   status: true,
                                   output: animalExists
                               }
                           )
                       return
                }
            catch (e) {
                console.log(e)
            }
        })
    router.post('/natural/water',userAuth, async (req, res) => {
        try {
            var { type,photo,length,gender,healthStatus,location,description,boatNo,boatOwner,docs} = req.body;
    
            if (type == undefined || type== null) {
                res.status(200).json
                    (
                        {
                            status: false,
                            msg: "type is not given"
    
                        }
                    )
                return
            }

            if (type!="naturalWater") {
                res.status(200).json
                    (
                        {
                            status: false,
                            msg: "type given is not naturalWater"
    
                        }
                    )
                return
            }
    
            // if (photo == undefined || photo == null) {
            //     res.status(200).json
            //         (
            //             {
            //                 status: false,
            //                 msg: "Photo is not given"
    
            //             }
            //         )
            //     return
            // }
            if (length == undefined || length == null) {
                res.status(200).json
                    (
                        {
                            status: false,
                            msg: "length is not given"
    
                        }
                    )
                return
            }
            if (gender == undefined || gender == null) {
                res.status(200).json
                    (
                        {
                            status: false,
                            msg: "gender is not given"
    
                        }
                    )
                return
            }
            
            if (healthStatus == undefined || healthStatus == null) {
                res.status(200).json
                    (
                        {
                            status: false,
                            msg: "Status of health is not given"
    
                        }
                    )
                return
            }
            if (location == undefined || location == null) {
                res.status(200).json
                    (
                        {
                            status: false,
                            msg: "Location is not given"
    
                        }
                    )
                return
            }
            if (description == undefined || description == null) {
                res.status(200).json
                    (
                        {
                            status: false,
                            msg: "Description is not given"
    
                        }
                    )
                return
            }
            if (boatNo == undefined || boatNo== null) {
                res.status(200).json
                    (
                        {
                            status: false,
                            msg: "boat number is not given or invalid"
    
                        }
                    )
                return
            }
            
            if (boatOwner == undefined || boatOwner == null) {
                res.status(200).json
                    (
                        {
                            status: false,
                            msg: "Boat Owner is not given or invalid"
    
                        }
                    )
                return
            }

            // if (docs == undefined || docs == null) {
            //     res.status(200).json
            //         (
            //             {
            //                 status: false,
            //                 msg: "doc is not given or invalid type"
    
            //             }
            //         )
            //     return
            // }
           
            var NWater = new waterModel()

           NWater.animaltype=type,
           NWater.photo=photo,
           NWater.animalLength=length,
           NWater.gender=gender,
           NWater.healthStatus=healthStatus,
           NWater.location=location,
           NWater.description=description,
           NWater.boatNo= boatNo,
           NWater.boatOwner= boatOwner,
           NWater.document=docs
           
            await NWater.save()
    
            res.status(200).json({
    
                status: true,
                output: NWater
    
            })
            return
    
        }
        catch (e) {
            console.log(e)
        }
    })
    router.post('/natural/water/edit',userAuth, async (req, res) => { 
        try {
             var{ id,type,photo,length,gender,healthStatus, location,description,boatNo,boatOwner,docs}= req.body
            
                
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
    
               var animalExists=await waterModel.findOne({_id:id})
                if(animalExists==null||animalExists==undefined){
                 res.status(200).json
                    (
                        {
                                status: false,
                                msg: "id not found"
                        }
                    )
                    return
                }
                if(type!=null||type!=undefined){
                    animalExists.animaltype=type
                 }
                if(photo!=null||photo!=undefined){
                   animalExists.photo=photo
                }
                if(length!=null||length!=undefined){
                    animalExists.animalLength=length
                 }
                 if(gender!=null||gender!=undefined){
                    animalExists.gender=gender
                   }
                   if(healthStatus!=null||healthStatus!=undefined){
                    animalExists.healthStatus=healthStatus
                   }
                 if(location!=null||location!=undefined){
                    animalExists.location=location
                   }
                if(description!=null||description!=undefined){
                    animalExists.description=description
                }
                if(boatNo!=null||boatNo!=undefined){
                    animalExists.boatNo=boatNo
                }
                if(boatOwner!=null||boatOwner!=undefined){
                    animalExists.boatOwner=boatOwner
                } 
                if(docs!=null||docs!=undefined){
                    animalExists.document=docs
                }

                   await animalExists.save()
    
                   res.status(200).json
                           (
                               {
                                   status: true,
                                   output: animalExists
                               }
                           )
                       return
                }
            catch (e) {
                console.log(e)
            }
        })
router.post('/animal/list',userAuth, async (req, res) => { 
    
            try {
                var displayList = await waterModel.find({status: "Active" })
                
                res.status(200).json
                        (
                            {
                                status: true,
                                output:displayList
                            }
                        )
                    return
            }
            catch (e) {
                console.log(e)
            }
        })
 router.post('/animal/list/view',userAuth, async (req, res) => { 
    
            try {
                
                var{animalId}=req.body
               
                var animalView= await waterModel.findOne({status:"Active",_id:animalId}).populate("usersId")
               
                res.status(200).json
                        (
                            {
                                status: true,
                                output:animalView
                            }
                        )
                    return
            }
            catch (e) {
                console.log(e)
            }
        })
        router.post('/animal/delete',userAuth, async (req, res) => { 
    
            try {
                var {id} = req.body;
                var animalDelete = await waterModel.findOne({_id: id })
                animalDelete.status="Delete"
                await animalDelete.save()
                res.status(200).json
                        (
                            {
                                status: true,
                                msg:"Animal data Deleted"
                            }
                        )
                    return
            }
            catch (e) {
                console.log(e)
            }
        })
module.exports = router