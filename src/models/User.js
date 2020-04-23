const mongoose=require ('mongoose');
const {Schema,model} = mongoose;
const bcrypt = require('bcryptjs');

const UserSchema=new Schema({
	name: {type:String,required:true},
	email:{type:String,required:true},
	password:{type:String,required:true},
	date:{type:Date,defaul:Date.now}
});

UserSchema.methods.encryptPassword= async (password)=>{
	const salt=await bcrypt.genSalt(10);
	const hash=bcrypt.hash(password,salt);
	return hash;
};

//Scope
UserSchema.methods.matchPassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

module.exports = model("User", UserSchema);