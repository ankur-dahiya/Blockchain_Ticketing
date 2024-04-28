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

export const cookieExtractor = (req)=>{
    let token = null;
    if (req && req.cookies) { //to access req.cookies cookie-parser middleware is needed
        token = req.cookies['jwt']; //jwt is cookie name
    }
    // for testing purpose only
    // token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0Y2UxNTRmMGNiODc2ODUwMTNiYmEwOSIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTY5MTMwMDA3M30.WzDfgpTZHQhNH57RZSt22Z_hKu63xxwqSJcmqqgu2HE";
    return token;
};

