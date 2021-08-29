import React, { useContext } from 'react';
import moment from 'moment';
import 'moment/locale/pl';
import ReactHtmlParser from 'react-html-parser';
import { useMutation } from '@apollo/react-hooks';
import { AuthContext } from '../core/auth';
import gql from 'graphql-tag';

function Comment({ comment: { id, username, body, publishingTime, plusses, minusses, voteCount } }) {
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
                    <button className="comment__reply-button" onClick={alert("wait for this")}>Pokaż odpowiedzi</button>
                    <button className="comment__reply-button" onClick={alert("wait for this")}>Odpowiedz</button>
                </div>
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

export default Comment;