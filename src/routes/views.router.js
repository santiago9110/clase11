import express from "express";

const viewRouter=express.Router();


viewRouter.get("/",(req,res)=>{
    res.render("index");//le decimos que renderize indez, este lo busca en la carpeta views. sabe que es vies posque en la app.js se lo indicamos
})


export default viewRouter;