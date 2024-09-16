import React,{ createContext, useContext, useReducer } from "react"

const PostStateContext=createContext();
const PostDispatchContext=createContext();

const reducer=(state,action)=>
{
    switch(action.type)
    {

    }
}

export const PostProvider=({children})=>
{
    const [state,dispatch]=useReducer(reducer,[])
    return (
        <PostDispatchContext.Provider value={dispatch}>
            <PostStateContext.Provider value={state}>
                {children}
            </PostStateContext.Provider>
        </PostDispatchContext.Provider>
    )
}
export const usePost=()=>useContext(PostStateContext);
export const useDispatchPost=()=>useContext(PostDispatchContext);

