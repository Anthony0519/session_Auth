exports.isLoggedIn = async (req,res,next) =>{
    if (!req.session.user) {
        return res.status(401).json({
            message:"not authorized to perform this action"
        })
    }
    next()
}