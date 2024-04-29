export const errorHelper = (statusCode,message)=>{
    const error = new Error(message);
    error.statusCode = statusCode;
    return error;
}

export const sanitizeUser = (userObj) =>{
    const user = userObj.toObject();
    delete user.password;
    delete user.privateKey;
    delete user.createdAt;
    delete user.updatedAt;
    delete user.orders;
    return user;
}

