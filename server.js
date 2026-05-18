const dotenv= require("dotenv")
dotenv.config();

const app= require("./src/app")


let port=process.env.PORT;
app.listen(port,()=>{
    console.log(`server is running on port ${port}`)
})