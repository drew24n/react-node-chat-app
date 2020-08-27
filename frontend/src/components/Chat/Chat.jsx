import React, {useEffect} from "react";
import * as queryString from "query-string";
import io from "socket.io-client";
import {setMessageAction, setMessagesAction} from "../../redux/chatReducer";
import {useDispatch, useSelector} from "react-redux";
import style from "./Chat.module.scss";
import {Input} from "./Input/Input";
import {Messages} from "./Messages/Messages";
import {Header} from "./Header/Header";
import {setNameAction, setRoomAction} from "../../redux/loginReducer";

export const socket = io('localhost:5000')

export const Chat = ({location}) => {
    const dispatch = useDispatch()
    const chatState = useSelector(state => state.chat)

    useEffect(() => {
        const {name, room} = queryString.parse(location.search)
        socket.emit('join', {name, room}, () => {
        })
        return () => {
            dispatch(setNameAction(''))
            dispatch(setRoomAction(''))
            socket.emit('disconnect')
            socket.off()
        }
    }, [location.search, dispatch])

    useEffect(() => {
        socket.on('message', message => dispatch(setMessagesAction(message)))
    }, [dispatch])

    return (
        <div className={style.container}>
            <Header/>
            <Messages messages={chatState.messages}/>
            <Input message={chatState.message} socket={socket} setMessage={setMessageAction} dispatch={dispatch}/>
        </div>
    )
}
