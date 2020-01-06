const models = require('../models');




exports.statusUpdate = (req, res) => {
    if (!req.params.email) {
        return res.status(400).send({
            message: "E-mail ID required"
        });
    }
    models.users.findOneAndUpdate({ email: req.params.email }, { $set: { userStatus: req.params.value, updatedAt: Date.now() } }, { new: true },
        function (err, result) {
            if (err) {
                res.status(500).send({
                    message: "Some error occurred..",
                    error: err
                });
                return;
            }
            
            if (result) {

                res.send({ msg: "Status updated successfully" })
            } else {
                res.send({ error: "E-Mail not found" })

            }
        });
};
exports.resetPassword = (req, res) => {
    if (!req.params.email) {
        return res.status(400).send({
            message: "E-mail ID required"
        });
    }
    models.users.findOneAndUpdate({ email: req.params.email }, { $set: { password: "password123456", updatedAt: Date.now() } }, { new: true },
        function (err, result) {
            console.log(err, result)
            if (err) {
                res.status(500).send({
                    message: "Some error occurred..",
                    error: err
                });
                return;
            }
            
            if (result) {

                res.send({ msg: "Password reset successfully" })
            } else {
                res.send({ error: "E-Mail not found" })

            }
        });
};

// exports.userTypeUpdate = (req, res) => {
//     if (!req.body.email) {
//         return res.status(400).send({
//             message: "E-mail ID required"
//         });
//     }
//     users.findOneAndUpdate({ email: req.body.email }, { $set: { userType: req.body.userType, updatedAt: Date.now() } }, { new: true },
//         function (err, result) {
//             if (err) {
//                 res.status(500).send({
//                     message: "Some error occurred..",
//                     error: err
//                 });
//                 return;
//             }
//             if (result) {
//                 res.send({ msg: "User updated successfully" })
//             } else {
//                 res.send({ error: "E-Mail not found" })

//             }
//         });
// };
// exports.passwordReset = (req, res) => {
//     if (!req.params.email) {
//         return res.status(400).send({
//             message: "E-mail ID required"
//         });
//     }
//     users.findOneAndUpdate({ email: req.params.email }, { $set: { password: "password123", updatedAt: Date.now() } }, { new: true },
//         function (err, result) {
//             if (err) {
//                 res.status(500).send({
//                     message: "Some error occurred..",
//                     error: err
//                 });
//                 return;
//             }
//             if (result) {
//                 res.send({ msg: "Password Reset successsfully" })
//             } else {
//                 res.send({ error: "E-Mail not found" })

//             }
//         });



// exports.usersCount = (req, res) => {

//     users.aggregate([
    
//         {
//             $group: {
//             _id:  {
//                             "userStatus ": "$userStatus",
//                             "userType ": "$userType"
//                         }, 
//             count: {$sum: 1},
           
//           }
//         }
//     ],(err,result)=>{
//         console.log(result,err)
//         res.send(result)
//     })
// };
    // users.aggregate([
    
    //     {$group: {
    //         _id : {
    //             "userStatus ": "$userStatus",
    //             "userType ": "$userType"
    //         }, 
    //         count: {
    //           $sum: 1
    //         }
    //       }
    //     }
    // ],(err,result)=>{
    //     console.log(result,err)
    //     res.send(result)
    // })

// }


exports.getAllUsers = (req, res) => {
    models.users.find().exec((err, result)=>{
        res.send(result);
    });    
};