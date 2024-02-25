
const User = require('../model/user');
const Admin = require('../model/admin');
const jwt = require('jsonwebtoken')
const { hash_password, compare_password } = require('../helper/adminauth');



exports.add = async (req, res) => {
    //console.log("req-----------------",req);
    console.log("req-----------------", req.body);
    try {
        const { adminname, email, password } = req.body

        const hashpassword = await hash_password(password)

        const admindata = await new Admin({
            adminname: adminname,
            email: email,
            password: hashpassword
        }).save()
        console.log("user--", admindata);
        return res.status(200).json({
            success: true,
            message: "Admin Created Successfully",
            data: admindata
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Admin Not created",
        })
    }
}


exports.admin_login = async (req, res) => {

    try {

        const { email, password } = req.body

        const admin = await Admin.findOne({ email })
        if (!admin) {
            return res.status(400).json({
                success: false,
                message: "Email Id not matched"
            })
        }

        const secure_password = await compare_password(password, admin.password)
        if (!secure_password) {
            return res.status(400).json({
                success: false,
                message: "Password not matched"
            })
        }

        const token = jwt.sign({
            _id: admin.id,
            user_name: admin.adminname,

        }, process.env.JWTKEY, { expiresIn: "1hr" })
        return res.status(200).json({
            success: true,
            message: "Admin Login Successfully",
            data: {
                _id: admin.id,
                user_name: admin.adminname,
        
            },
            token: token
        })

    } catch (error) {
        console.log(error)
        return res.status(400).json({
            success: false,
            message: "Error while login "
        })

    }

}


// block unblock
exports.user_block_unblock = async (req, res) => {
    try {
        const block_user = await User.findById({ _id: req.params.id })

        console.log("block-user-----------", block_user);

        if (block_user.status == 1) {
            block_user.status = 0
            block_user.save()
            return res.status(200).send({
                success: true,
                message: "User blocked Successfully by Admin",
                data: block_user
            })
        } else if (block_user.status == 0) {
            block_user.status = 1
            block_user.save()
            return res.status(200).send({
                success: true,
                message: "User Unblocked Successfully by Admin",
                data: block_user
            })

        }
    } catch (error) {
        console.log(error);
        return res.status(400).send({
            success: false,
            message: "User Id not found",

            //    error:error.message
        })
    }
}

// delete 
exports.deleteuser = async (req, res) => {

    try {
        const deleteuser = await User.findByIdAndDelete({ _id: req.params.id })
        return res.status(200).json({
            success: true,
            message: "User deleted by admin successfully",

        })

    } catch (error) {
        console.log(error);
        return res.status(400).json({
            success: false,
            message: "Error while doing user delete by admin "
        })
    }
}
