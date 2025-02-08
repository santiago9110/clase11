const socket=io();//creamos la conexion con el servidor


const getUserName= async()=>{
  const{value:username} = await  Swal.fire({
        title:"ingrese su nbombre de usuario",
        input:"text",
        inputabl:"este nombre se utiliza en el chat",
        allowOutsideClick:false,
        inputValidator:(username)=>{
            if(!username){
                return "debe ingresar un nombre de usuario"
            };
        }
    })
return username;
}


const showNewuserConnected=(username)=>{
    Swal.fire({
        toast:true,
        position:"top-end",
        icon:"succes",
        title:`${username} conectado/a`,
        showConfirmButton:false,
        timer:2000
    });
}

const main=async()=>{
    const username=await getUserName();

    //luego de recibir el nombre de usuario lo enviamo al servidor
    socket.emit("new user connected",username);

    socket.on("chat history",(messages)=>{
        const chatBox=document.getElementById("chatBox");
        messages.forEach(({username,message})=> {
            chatBox.innerHTML+=`<p>${username}-${message}</p>`;
        });
    })

    socket.on("new user",(username)=>{
        showNewuserConnected(username);
    })
    //Formulario
    const  formChat=document.getElementById("formChat");
    const inputChat=document.getElementById("inputChat");

    formChat.addEventListener("submit",(e)=>{
        e.preventDefault();

        const message=inputChat.value;
        inputChat.value="";

        socket.emit("message",{username,message});
    })
  
    socket.on("broadcast new message",({username,message})=>{
        const chatBox=document.getElementById("chatBox");
        chatBox.innerHTML+=`<p>${username}-${message}</p>`;
        console.log(username,message);
    })
}

main();