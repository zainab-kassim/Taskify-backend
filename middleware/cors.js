const cors= require('cors');
// CORS setup
const corsOptions = {
    origin: '*', // Replace with your client's origin if needed
    optionsSuccessStatus: 200, // For legacy browsers
  };
  
module.exports=cors(corsOptions)