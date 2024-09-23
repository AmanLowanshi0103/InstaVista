const signUpHook=async(SignUpData)=>
{
    const { email, fullname, username, password } = SignUpData;
    const Response = await fetch(
        "http://localhost:4000/api/instavista/createuser",
        {
          method: "Post",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            Email: email,
            FullName: fullname,
            UserName: username,
            Password: password,
          }),
        }
      );
      const data = await Response.json();
      return data
}

export default signUpHook;