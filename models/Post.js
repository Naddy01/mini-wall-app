const mongoose  = require('mongoose')
const Schema = mongoose.Schema
const postSchema = new Schema({
    userId:{
        type: String,
        required: true
    },
    username:{
        type: String,
        required: true,
        min: 3,
        max: 256
    },
    title:{
        type: String,
        required: true,
        min:3,
        max: 256
    },
    text:{
        type: String,
        required: true
    },
    hashtag:{
        type: String,
        max: 256
        
    },
    likes: {
            type: Array,
            default: [],
            required: true       
     },
     likesCount:
     {
        type: Number,
        default: 0,
        required: true
     },
    comments: [
        {
            userId: {
                type: String,
                required: true
            },
            /*user:{
                type: String,
                required: true,
                min: 3,
                max: 256
            },*/
            text:{
                type:String,
                required: true,
                min:3,
                max:1024

             },
            date: {
                type:Date,
                default:Date.now
             }
            
        }
    ],
    date:{
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('posts', postSchema)

    