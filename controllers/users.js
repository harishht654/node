const models = require('../models');
exports.create = (req, res) => {
    if (!req.body.email) {
        return res.status(400).send({
            message: "Please fill all required fileds"
        });
    }
    const Users = new models.users(req.body);
    Users.save()
        .then(data => {
            var response = {
                msg: "Registred succssfully !",
                data: data
            }
            res.send(response);
        }).catch(err => {

            console.log(err.keyValue)
            res.status(500).send({
                message: req.body.email + " Email already exist, Please try with other email" || "Some error occurred while creating the User."
            });
        });
};

exports.emailCheck = (req, res) => {
    models.users.findOne({ email: req.params.email }).exec(function (err, result) {
        if (err) {
            res.status(500).send({
                message: "Some error occurred while creating the User.",
                error: err
            });
        }
        else {

            var data = {};
            if (result) {
                result = JSON.parse(JSON.stringify(result));
                delete result.password
                data.error = "Email is already available";
                data.result = result
            } else {
                data.msg = "Not available"
            }
            res.send(data);
        }
    });
};


exports.changePassword = (req, res) => {
    if(req.body.currentPassword.length>0 && req.body.currentPassword==req.body.password)  {
        return res.status(200).send({
            error: "Both password shouldn't be same"
        });
    }
    else if (!req.body.currentPassword) {
        return res.status(200).send({
            error: "Please enter the previous password"
        });
    }else if(!req.body.password){
        return res.status(200).send({
            error: "Please enter the password to be update"
        });
    }
    models.users.findOneAndUpdate({email:req.body.email,password:req.body.currentPassword}, { $set: { password: req.body.password,updatedAt:Date.now()}}, { new: true },
         function (err, result) {
        if (err) {
            res.status(500).send({
                message: "Some error occurred while creating the User.",
                error: err
            });
            return;
        }
        if(result){
            res.send({msg:"Password channged successfully"})
        }else{
            res.send({error:"Invalid old password"})

        }        
      });
};

exports.login = (req, res) => {
    models.users.findOne({ email: req.body.email,password: req.body.password }).exec(function (err, result) {
        if (err) {
            res.status(500).send({
                message: "Some error occurred.",
                error: err
            });
        }
        else {

            var data = {};
            if (result) {
                result = JSON.parse(JSON.stringify(result));
                delete result.password
                data.msg = "Login successfull.";
                data.result = result
            } else {
                data.error = "Login Failed"
            }
            res.send(data);
        }
    });
};