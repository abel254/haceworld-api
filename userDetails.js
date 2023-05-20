const mongoose = require('mongoose')
const { stringify } = require('querystring')

const UserDetailsSchema = new mongoose.Schema(
    {
        firstname: String,
        lastname:String,
        email:{type: String, unique:true},
        password:String,
    },
    {
        collection: 'UserInfo',
    }
)

mongoose.model('UserInfo', UserDetailsSchema)