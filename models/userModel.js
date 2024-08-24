const {createHmac, randomBytes} = require('crypto');
const {Schema, model} = require('mongoose');

const userSchema = new Schema({ //
    firstName:{
        type: String,
        required: true,
    },
    lastName:{
        type: String,
        required: true,
    },
    email:{
        type: String,
        required: true,
        unique: true,
    },
    salt:{
        type: String,
        required: false,
    },
    password:{
        type: String,
        required: true,
    },
    profileImageURL:{
        type: String,
        default: '/profile/defaultImage.png',
    },
    role:{
        type: String,
        required: true,
        enum: ['admin', 'user'],
        default: 'user',
    },
}, {timestamps: true});

userSchema.pre('save', function (next) {
    const user = this; //this refers to the current user object.
//this function hashes the password and assigns the salt to the user object.
    if(!user.isModified('password')) return next(); //if the password is not modified, then return from the function.

    const salt = randomBytes(32).toString('hex'); //generate a random salt, which is the secret key for each user of the application. the secret key is a combination of random 32 bytes.
    const hashedPassword = createHmac('sha256', salt) //creating hashed password using the sha256 algorithm with salt, as the key.
        .update(user.password)
        .digest('hex');

    this.salt = salt; //assign the salt to the user object.
    this.password = hashedPassword; //assign the hashed password to the user object.
    next();
});

userSchema.statics.authenticate = async function(email, password){
    const user = await this.findOne({email}); //find the user with the given email.
    if(!user) return null; //if the user is not found, return false.

    const salt = user.salt; //get the salt of the user.
    const hashedPassword = user.password; //get the hashed password of the user.

    const userProvidedHash = createHmac('sha256', salt)
        .update(password)
        .digest('hex');

    if(hashedPassword !== userProvidedHash) return null; // Invalid password

    const userWithoutSensitiveData = user.toObject();
    delete userWithoutSensitiveData.password;
    delete userWithoutSensitiveData.salt;

    return userWithoutSensitiveData;//return the user object without the password and salt.
};

const User = model('User', userSchema); //creating a model named 'user' with the userSchema.

module.exports = User; //export the userModel to be used in other files.
