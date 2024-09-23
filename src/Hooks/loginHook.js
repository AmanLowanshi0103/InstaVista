const loginHook=async (LoginData)=>
{
    const Response= await fetch("http://localhost:4000/api/instavista/loginuser",{
        method:"POST",
        headers:{
          "Content-Type":"application/json"
        },
        body:JSON.stringify(LoginData)
      })
      const Res= await Response.json();
      return Res;
}

export default loginHook;