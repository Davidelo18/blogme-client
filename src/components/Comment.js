import React, { useContext } from 'react';
import moment from 'moment';
import 'moment/locale/pl';
import ReactHtmlParser from 'react-html-parser';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { AuthContext } from '../core/auth';
import gql from 'graphql-tag';
import { GET_POST_COMMENTS, GET_REPLIES } from '../core/graphql';
import CreatePost from './CreatePost';
import Replies from './Replies';

function Comment({ comment: { id, username, body, publishingTime, plusses, minusses, voteCount }, postId, isReply}) {
    const { user } = useContext(AuthContext);

    moment.locale('pl');

    const now = moment();
    let commentDate;

    if (moment(publishingTime).diff(now, 'days') >= 1) {
        commentDate = moment(publishingTime).fromNow();
    } else {
        commentDate = moment(publishingTime).format("D MMMM YYYY | H:mm:ss");
    }

    const [plusComment] = useMutation(PLUS_COMMENT, {
        variables: { commentId: id }
    });

    const [minusComment] = useMutation(MINUS_COMMENT, {
        variables: { commentId: id }
    });

    const [deleteComment] = useMutation(DELETE_COMMENT, {
        update(proxy) {
            if (!isReply) {
                const data = proxy.readQuery({
                    query: GET_POST_COMMENTS,
                    variables: {
                        postId
                    }
                });

                proxy.writeQuery({
                    query: GET_POST_COMMENTS,
                    variables: {
                        postId
                    },
                    data: {
                        getComments: data.getComments.filter(p => p.id !== id)
                    }
                });
            } else {
                const data = proxy.readQuery({
                    query: GET_REPLIES,
                    variables: {
                        commentId: postId
                    }
                });

                proxy.writeQuery({
                    query: GET_REPLIES,
                    variables: {
                        commentId: postId
                    },
                    data: {
                        getReplies: data.getReplies.filter(p => p.id !== id)
                    }
                });
            }
        },
        variables: { commentId: id }
    });

    function deleteCommentCallback() {
        if (window.confirm("Czy na pewno chcesz usunąć ten komentarz?")) {
            deleteComment();
            if (getReplies.length > 0) {
                getReplies.forEach(reply => {
                    deleteComment({
                        variables: {
                            commentId: reply.id
                        }
                    });
                });
            }
        }
    }

    const { data: { getReplies } = {} } = useQuery(GET_REPLIES, {
        variables: { commentId: id }
    });

    function getRepliesCallback(event) {
        const t = event.target;
        const repliesContainer = t.closest('.comment').querySelector('.comment__replies');
        let replyContainerStyle = repliesContainer.style.display;

        if (replyContainerStyle === "none") {
            repliesContainer.style.display = "block"
            t.innerText = "Ukryj odpowiedzi";
        } else {
            repliesContainer.style.display = "none";
            t.innerText = `Pokaż odpowiedzi (${getReplies && getReplies.length})`;
        }
    }

    function replyToCommentCallback(event) {
        const t = event.target;
        const replyEditor = event.target.closest('.comment').querySelector('.comment__reply-to');
        let replyDisplayStyle = replyEditor.style.display;

        if (replyDisplayStyle === "none") {
            replyEditor.style.display = "block"
            t.innerText = "Anuluj odpowiedź";
        } else {
            if (window.confirm("Czy na pewno chcesz anulować swoją odpowiedź?")) {
                replyEditor.style.display = "none";
                t.innerText = "Odpowiedz";
            }
        }
    }

    return (
        <article className={`comment ${user.username === username && "comment--own"} ${isReply && "comment--reply"}`} key={id}>
            <section className="comment__header">
                <div className="comment__info">
                    <div className="comment__user">{username}</div>
                    <div className="comment__date">{commentDate}</div>
                </div>
            </section>
            <section className="comment__body">{ReactHtmlParser(body)}</section>
            <section className="comment__footer">
                <div className="comment__vote">
                    <span className={(voteCount >= 0) ? "comment__vote-result comment__vote-result--positive" : "comment__vote-result comment__vote-result--negative"}>{voteCount}</span>
                    {user.username !== username && (
                        <React.Fragment>
                            <button user={user} onClick={plusComment} id="plusBtn" className={
                                plusses.find(plus => plus.username === user.username)
                                    ? "comment__vote-button comment__vote-button--plus voted"
                                    : "comment__vote-button comment__vote-button--plus"
                            }>+</button>
                            <button user={user} onClick={minusComment} id="minusBtn" className={
                                minusses.find(minus => minus.username === user.username)
                                    ? "comment__vote-button comment__vote-button--minus voted"
                                    : "comment__vote-button comment__vote-button--minus"
                            }>-</button>
                        </React.Fragment>
                    )}
                </div>
                <div className="comment__replies-buttons">
                    {user && user.username === username && (
                        <button className="comment__delete" onClick={() => deleteCommentCallback()}><FontAwesomeIcon icon={faTrash} /></button>
                    )}
                    <button className={`comment__reply-button ${(getReplies && getReplies.length <= 0) && "comment__reply-button--disabled"}`} onClick={(e) => getRepliesCallback(e)} disabled={(getReplies && getReplies.length <= 0) ? true : false}>
                        {`${(getReplies && getReplies.length > 0) ? `Pokaż odpowiedzi (${getReplies.length})` : "Brak odpowiedzi"}`}
                    </button>
                    <button className="comment__reply-button" onClick={(e) => replyToCommentCallback(e)}>Odpowiedz</button>
                </div>
            </section>
            <section className="comment__reply-to" style={{display: "none"}}>
                <CreatePost label="Odpowiedz" postId={id} isReply/>
            </section>
            <section className="comment__replies" style={{display: "none"}}>
                <Replies commentId={id} />
            </section>
        </article>
    )
}

const PLUS_COMMENT = gql`
    mutation plusComment($commentId: ID!){
        plusComment(commentId: $commentId){
            id
            plusses {
                id username
            }
            minusses {
                id username
            }
            voteCount
        }
    }
`

const MINUS_COMMENT = gql`
    mutation minusComment($commentId: ID!){
        minusComment(commentId: $commentId){
            id
            plusses {
                id username
            }
            minusses {
                id username
            }
            voteCount
        }
    }
`

const DELETE_COMMENT = gql`
    mutation deleteComment($commentId: ID!){
        deleteComment(commentId: $commentId)
    }
`

export default Comment;