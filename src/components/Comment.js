import React, { useContext, useState } from 'react';
import moment from 'moment';
import 'moment/locale/pl';
import ReactHtmlParser from 'react-html-parser';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { useMutation } from '@apollo/react-hooks';
import { AuthContext } from '../core/auth';
import gql from 'graphql-tag';
import { GET_POST_COMMENTS } from '../core/graphql';
import CreatePost from './CreatePost';

function Comment({ comment: { id, username, body, publishingTime, plusses, minusses, voteCount }, postId}) {
    const { user } = useContext(AuthContext);

    const [values, setValues] = useState({
        replyBody: ''
    });

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
        },
        variables: { commentId: id }
    });

    function deleteCommentCallback() {
        if (window.confirm("Czy na pewno chcesz usunąć ten komentarz?")) {
            deleteComment();
        }
    }

    const [postReplyToComment] = useMutation(REPLY_TO_COMMENT, {
        variables: { commentId: id, body: values.replyBody }
    });

    function replyToCommentCallback() {
        console.log(this);
    }

    return (
        <article className={user.username === username ? "comment comment--own" : "comment"} key={id}>
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
                    <button className="comment__reply-button">Pokaż odpowiedzi</button>
                    <button className="comment__reply-button" onClick={() => replyToCommentCallback()}>Odpowiedz</button>
                </div>
            </section>
            <section className="comment__reply-to" style={{display: "none"}}>
                <CreatePost label="Odpowiedz" postId={id} isReply/>
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

const GET_REPLIES = gql`
    query($commentId: ID!){
        getReplies(commentId: $commentId){
            id
            body
            username
            publishingTime
            plusses {
                id
                username
            }
            minusses {
                id
                username
            }
            voteCount
        }
    }
`;

const REPLY_TO_COMMENT = gql`
    mutation postReplyToComment($commentId: ID!, $body: String!){
        postReplyToComment(commentId: $commentId, body: $body) {
            id
            body
            username
            publishingTime
            plusses {
                id
                username
            }
            minusses {
                id
                username
            }
            voteCount
        }
    }
`

export default Comment;