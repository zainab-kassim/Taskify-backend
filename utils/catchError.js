// Function to handle try and catch errors
function handleAsyncErr(fn) {
    return async function (req, res) {
        try {
            await fn(req, res);
        } catch (err) {
            console.error("Error occurred:", (err).message);
            
        }
    };
}


module.exports=handleAsyncErr;

