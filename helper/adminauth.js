

const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

// hash passsword
exports. hash_password = async (password) => {
    return await bcrypt.hash(password,10)
}

// comapre password

exports. compare_password = async(password,hashpassword) =>{
    return await bcrypt.compare(password,hashpassword)
}



exports. admin_auth = async(req,res,next)=>{

    const token = req.body.token || req.query.token  || req.headers['token']
    if(!token){
        return res.status(400).json({
            success:false,
            message:"You are not a authenticate user"
        })
    }

    try {
        const decodetokenadmin = jwt.verify(token,process.env.JWTKEY)
        console.log("decodetoken--------------",decodetokenadmin);
        // res.user = decodetoken
        if(decodetokenadmin){
            return next();
          }else{
            return res.status(400).json({
                success:false,
                message:"Only Admin can access this"
            })
          }
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            success:false,
            message:"Invalid token"
        })
    }

}