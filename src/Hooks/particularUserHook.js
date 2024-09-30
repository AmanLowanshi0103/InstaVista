const particularUserHooks =async(PostedByuserId)=>
{
    const response = await fetch(
        `http://localhost:4000/api/instavista/getaparticularUserData`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body:JSON.stringify({PostedByuserId})
        }
      );
      const res = await response.json();
      return res;
}

export default particularUserHooks;