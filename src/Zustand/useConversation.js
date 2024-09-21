import {create} from 'zustand'

const useConversation=create((set)=>(
{
    selectedConverstion:null,
    setSelectedConversation:(selectedConverstion)=>set({selectedConverstion}),
    messages:[],
    setMessages:(messages)=>set({messages}),
}))