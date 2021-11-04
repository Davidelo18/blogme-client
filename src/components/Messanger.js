import React, { useEffect, useState, useContext } from 'react';
import moment from 'moment';
import 'moment/locale/pl';
import { useQuery, useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { useLazyQuery, useSubscription } from '@apollo/client';
import { AuthContext } from '../core/auth';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowCircleRight } from '@fortawesome/free-solid-svg-icons';
import { GET_USER_INFO } from '../core/graphql';

function Messanger() {
    const { user } = useContext(AuthContext);
    moment.locale('pl');

    const { data: { getUserInfo } = {} } = useQuery(GET_USER_INFO, {
        variables: {
            username: user.username
        }
    });

    if (getUserInfo) {
        if (!getUserInfo.options.canReceiveMessages) {
            const $messanger = document.querySelector('.messanger');
            if ($messanger) $messanger.innerHTML = '<p class="error">Masz zablokowane prywatne wiadomości. Odblokuj jeśli chcesz rozmawiać z innymi użytkownikami.</p>';
        }
    }

    const { loading, data: { getUsers: users } = {} } = useQuery(GET_USERS);
    const [selectedUser, setSelectedUser] = useState(null);

    // Wyszukiwarka użytkowników
    const $searchInput = document.querySelector('.messanger__search-input');
    if ($searchInput) {
        $searchInput.addEventListener('input', (e) => {
            let searchValue = e.target.value;
            const $userNamesDiv = document.querySelectorAll('.messanger__user-name');
            $userNamesDiv.forEach(div => {
                const name = div.textContent;
                if (name.indexOf(searchValue) === -1) {
                    div.parentNode.classList.add('hide');
                } else {
                    div.parentNode.classList.remove('hide');
                }
            });
        });
    }

    // Scrollowanie do dołu w komunikatorze
    function scrollToDown() {
        const $messagesDiv = document.querySelector('.messanger__messages');
        $messagesDiv.scrollTop = $messagesDiv.scrollHeight;
    }

    // Pobranie wiadomości
    const [getMessages, { data: messagesData }] = useLazyQuery(GET_MESSAGES, {
        onCompleted: () => {
            scrollToDown();
        },
        fetchPolicy: "cache-and-network"
    });

    function callbackSetSelectedUser(e, username) {
        setSelectedUser(username);
        setValues({ ...values, [e.target.id]: username });

        const $usersDiv = document.querySelectorAll('.messanger__user-btn');
        $usersDiv.forEach(div => { div.classList.remove('selected') });
        e.target.classList.add('selected');
        document.querySelector('.messanger__chat').classList.add('message-on');
        document.querySelector('.js-addressUserName').textContent = username;
    }

    // Nasłuchiwanie wiadomości
    const { data: messageSub, error: messageSubError } = useSubscription(NEW_MESSAGE);

    useEffect(() => {
        if (messageSubError) console.log(messageSubError);

        if (messageSub) {
            const message = messageSub.newMessage;
            getMessages({ variables: { messagesFrom: message.sendFrom } });
        }
    }, [messageSubError, messageSub, getMessages])

    // Przycisk powrotu do wybierania użytkownika do rozmowy
    const $backToUsersBtn = document.querySelector('.js-backToUsers');
    $backToUsersBtn && $backToUsersBtn.addEventListener('click', () => {
        document.querySelectorAll('.messanger__user-btn').forEach(div => { div.classList.remove('selected') });
        document.querySelector('.messanger__chat').classList.remove('message-on');
        setSelectedUser(null);
    })

    useEffect(() => {
        if (selectedUser) {
            getMessages({ variables: { messagesFrom: selectedUser } });
        }
    }, [selectedUser, getMessages, messageSub]);

    // Pokaż czas wysłania wiadomości
    function showTime(e) {
        e.target.closest('.messanger__message').querySelector('.messanger__message-time').classList.toggle('show');
    }

    // Wysyłanie wiadomości
    const [values, setValues] = useState({
        body: '',
        sendTo: ''
    });

    const [sendMessage] = useMutation(SEND_MESSAGE, {
        update(proxy, result) {
            const data = proxy.readQuery({
                query: GET_MESSAGES,
                variables: {
                    messagesFrom: values.sendTo
                }
            });
            proxy.writeQuery({
                query: GET_MESSAGES,
                variables: {
                    messagesFrom: values.sendTo
                },
                data: {
                    getMessages: [...data.getMessages, result.data.sendMessage]
                }
            });
        },
        onCompleted: () => {
            scrollToDown();
        },
        variables: values
    });

    const onChange = (e) => {
        setValues({ ...values, [e.target.name]: e.target.value });
    };

    const onSubmit = (e) => {
        e.preventDefault();
        e.target.querySelector('.messanger__type-input').value = "";
        sendMessage();
    };

    return (
        <section className="messanger">
            <div className="messanger__users">
                <div className="messanger__search">
                    <label className="messanger__search-label"><input className="messanger__search-input" type="text" placeholder="Wyszukaj użytkownika" /></label>
                </div>
                <div className="messanger__users-container">
                    {loading ? (
                        <div>Ładowanie...</div>
                    ) : (users && users.map(u => (
                        ((u.options.canReceiveMessages && u.username !== user.username) &&
                            <div tabIndex="0" className="messanger__user-btn" key={u.id} id="sendTo" onClick={(e) => callbackSetSelectedUser(e, u.username)}>
                                <div className="messanger__user-avatar"><img src={u.avatar} alt={`avatar użytkownika ${u.username}`} /></div>
                                <div className="messanger__user-name">{u.username}</div>
                            </div>)
                    )))}
                </div>
            </div>
            <div className="messanger__chat">
                <div className="messanger__chat-empty">
                    <p>Wybierz osobę do rozmawiania!</p>
                </div>
                <div className="messanger__chat-header">
                    <button className="js-backToUsers"><FontAwesomeIcon icon={faArrowLeft} /></button>
                    <span className="js-addressUserName"></span>
                </div>
                <div className="messanger__messages">
                    {messagesData && messagesData.getMessages.length > 0 && (
                        messagesData.getMessages.map(message => (
                            <div key={message.id} className={`messanger__message${message.sendFrom === user.username ? ' messanger__message--own' : ''}`}>
                                <p className={`messanger__message-text${message.sendFrom === user.username ? ' messanger__message-text--own' : ''}`} onClick={(e) => showTime(e)}>{message.body}</p>
                                <span className="messanger__message-time">{moment(message.sendingTime).format("D.MM.YYYY | H:mm:ss")}</span>
                            </div>
                        ))
                    )}
                </div>
                <div className="messanger__type">
                    <form onSubmit={onSubmit}>
                        <label className="messanger__type-label"><input className="messanger__type-input" name="body" onChange={onChange} type="text" placeholder="Wiadomość..."></input></label>
                        <button className="messanger__button"><FontAwesomeIcon icon={faArrowCircleRight} /></button>
                    </form>
                </div>
            </div>
        </section>
    );
}

const GET_USERS = gql`
    {
        getUsers {
            id
            username
            avatar
            options {
                canReceiveMessages
            }
        }
    }
`;

const GET_MESSAGES = gql`
    query($messagesFrom: String!) {
        getMessages(messagesFrom: $messagesFrom) {
            id
            body
            sendFrom
            sendTo
            sendingTime
        }
    }
`;

const SEND_MESSAGE = gql`
    mutation sendMessage($body: String! $sendTo: String!) {
        sendMessage(body: $body sendTo: $sendTo) {
            id
            body
            sendFrom
            sendTo
            sendingTime
        }
    }
`;

const NEW_MESSAGE = gql`
    subscription newMessage {
        newMessage {
            id
            body
            sendFrom
            sendTo
            sendingTime
        }
    }
`;

export default Messanger;