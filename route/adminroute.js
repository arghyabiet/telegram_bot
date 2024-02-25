const express = require('express')
const route = express.Router()
const admincontroller = require('../src/admincontroller')
const auth = require('../helper/adminauth')


route.post('/admin/add',admincontroller.add)
route.post('/admin/login',admincontroller.admin_login)
route.patch('/admin/user/block/unblock/:id',[auth.admin_auth],admincontroller.user_block_unblock)
route.delete('/admin/user/delete/:id',[auth.admin_auth],admincontroller.deleteuser)




module.exports = route