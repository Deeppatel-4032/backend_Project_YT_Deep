const asncHandler = (reqHandler) => {
    (req, res, next) => {
        Promise.resolve(reqHandler(req, res, next)).catch((err) => next(err))
    }
}

export {asncHandler};













// try catch thi banavu chhe hayer order function no use karo chhe
// const asncHandler = () => () => {}

// const asncHandler = (fun) => async (req, res, next) => {
//     try {
//         await fun(req, res , next) 
//     } catch (error) {
//         res.status(err.code || 500).json({
//            success : false,
//            message : err.message
//         })
        
//     }
// }