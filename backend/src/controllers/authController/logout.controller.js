

 const logoutUser = (req, res) => {
    try{
        res.clearCookie("token");
        return res.status(200).json({
            message: "logout successful",
            status: true
        })
    } catch (error) {
        return res.status(500).json({
            message: "internal server error",
            status: false
        })
    }

}


export default logoutUser;