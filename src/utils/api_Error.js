
class API_Error extends Error {
    constructor(
        message = "Something went worng",
        statusCode,
        errors = [],
        statck = ""
    ) {
        super(message)
        this.statusCode = statusCode,
        this.message = message,
        this.success = false,
        this.data = null,
        this.errors = errors
    
        if (statck) {
            this.statck = statck
        }
        else{
            Error.captureStackTrace(this, this.constructor)
        }

    }
}

export {API_Error}