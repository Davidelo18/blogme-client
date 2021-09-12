import React, { useEffect, useRef, useState } from 'react';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';
import { FETCH_POSTS, GET_REPLIES } from '../core/graphql';
import { GET_POST_COMMENTS } from '../core/graphql';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBold, faItalic, faUnderline, faLink, faPhotoVideo, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import Modal from './Modal';

function CreatePost({label, postId, isReply}) {
    const [values, setValues] = useState({
        body: ''
    });

    // nowy post
    const [newPost, { postError }] = useMutation(NEW_POST, {
        variables: values,
        update(proxy, result) {
            const data = proxy.readQuery({ query: FETCH_POSTS });

            proxy.writeQuery({
                query: FETCH_POSTS,
                data: { getPosts: [result.data.createPost, ...data.getPosts] }
            });
            values.body = '';
        },
        onError(err) {
            console.error(err);
        }
    });

    // nowy komentarz
    const [newComment, { commentError }] = useMutation(NEW_COMMENT, {
        variables: { postId, body: values.body },
        update(proxy, result) {
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
                    getComments: [result.data.createComment, ...data.getComments]
                }
            });
            values.body = '';
        },
        onError(err) {
            console.error(err);
        }
    });

    // nowa odpowiedź
    const [newReply, { replyError }] = useMutation(NEW_REPLY, {
        variables: { commentId: postId, body: values.body },
        update(proxy, result) {
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
                    getReplies: [result.data.postReplyToComment, ...data.getReplies]
                }
            });
            values.body = '';
            alert("Twoja odpowiedź została dodana");
        },
        onError(err) {
            console.error(err);
        }
    });

    function newReplyCallback(e) {
        newReply();
        const parentComment = e.target.closest('.comment');
        parentComment.querySelectorAll('.comment__reply-button')[1].textContent = "Odpowiedz";
        parentComment.querySelector('.comment__reply-to').style.display = "none";
    }

    const onChange = (e) => {
        setValues({ ...values, [e.target.id]: e.target.innerHTML });
        const button = document.querySelector('.new-post__submit');

        e.target.innerText.trim() === '' ? button.disabled = true : button.disabled = false;
    };

    const onSubmit = (e) => {
        e.preventDefault();
        e.target.closest('.new-post').querySelector('.new-post__editor').innerHTML = '';
        document.getElementById('body').innerHTML = '';
        postId
            ? isReply ? newReplyCallback(e) : newComment()
            : newPost();
    }

    /* Edytor treści posta lub komentarza */

    // style pisania w edytorze
    const textStyle = {
        "bold": false,
        "italic": false,
        "underline": false,
        "spoiler": false
    }

    function setTextStyle(style, value) {
        textStyle[style] = value;
    }

    // zaznaczenie wybranej opcji
    function isSelected(btn) {
        const classes = btn.classList;
        if (classes.contains('selected')) {
            classes.remove('selected');
            return true;
        } else {
            classes.add('selected');
            return false;
        }
    }

    // pokazanie i ukrycie modala
    const ref = useRef();
    const [isShowModal, setIsShowModal] = useState(false);
    const [modalType, setModalType] = useState("");

    useEffect(() => {
        const ifClickedOut = (e) => {
            if(isShowModal && ref.current && !ref.current.contains(e.target)) {
                setIsShowModal(false);
            }
        };
        document.addEventListener("mousedown", ifClickedOut);

        return () => {
            document.removeEventListener("mousedown", ifClickedOut);
        }
    }, [isShowModal]);

    // funkcje do edycji tekstu
    const boldText = (e) => {
        const t = e.target;
        const editor = t.closest('.new-post').querySelector('.new-post__editor');

        isSelected(t) ? setTextStyle('bold', false) : setTextStyle('bold', true);
        editor.setAttribute('js-text-options', encodeURIComponent(JSON.stringify(textStyle)));
    }

    const italicText = (e) => {
        const t = e.target;
        const editor = t.closest('.new-post').querySelector('.new-post__editor');

        isSelected(t) ? setTextStyle('italic', false) : setTextStyle('italic', true);
        editor.setAttribute('js-text-options', encodeURIComponent(JSON.stringify(textStyle)));
    }

    const underlineText = (e) => {
        const t = e.target;
        const editor = t.closest('.new-post').querySelector('.new-post__editor');

        isSelected(t) ? setTextStyle('underline', false) : setTextStyle('underline', true);
        editor.setAttribute('js-text-options', encodeURIComponent(JSON.stringify(textStyle)));
    }

    const addLink = (e) => {
        //const t = e.target;
        //const editor = t.closest('.new-post').querySelector('.new-post__editor');

        setModalType('link');
        setIsShowModal(true);

        //editor.insertAdjacentHTML('beforeend', '<a href="#">Link</a>')
        onChange(e);
    }

    const addPhotoVideo = (e) => {
        //const t = e.target;
        //const editor = t.closest('.new-post').querySelector('.new-post__editor');

        setModalType('photo');
        setIsShowModal(true);

        //editor.insertAdjacentHTML('beforeend', '<img src="https://icon-library.com/images/64-x-64-icon/64-x-64-icon-3.jpg"/>')
        onChange(e);
    }

    const addSpoiler = (e) => {
        const t = e.target;
        const editor = t.closest('.new-post').querySelector('.new-post__editor');

        isSelected(t) ? setTextStyle('spoiler', false) : setTextStyle('spoiler', true);
        editor.setAttribute('js-text-options', encodeURIComponent(JSON.stringify(textStyle)));
    }

    return (
        <div className={isReply ? "new-post new-post--reply" : "new-post"}>
            <section className="new-post__content">
                <div className="new-post__toolbar">
                    <button className="new-post__toolbar-option new-post__toolbar-option--bold" onClick={boldText}><FontAwesomeIcon icon={faBold}/></button>
                    <button className="new-post__toolbar-option new-post__toolbar-option--italic" onClick={italicText}><FontAwesomeIcon icon={faItalic}/></button>
                    <button className="new-post__toolbar-option new-post__toolbar-option--underline" onClick={underlineText}><FontAwesomeIcon icon={faUnderline}/></button>
                    <button className="new-post__toolbar-option new-post__toolbar-option--link" onClick={addLink}><FontAwesomeIcon icon={faLink}/></button>
                    <button className="new-post__toolbar-option new-post__toolbar-option--photovideo" onClick={addPhotoVideo}><FontAwesomeIcon icon={faPhotoVideo}/></button>
                    <button className="new-post__toolbar-option new-post__toolbar-option--spoiler" onClick={addSpoiler}><FontAwesomeIcon icon={faEyeSlash}/></button>
                </div>
                <div className="new-post__editor" contentEditable="true" value={values.body} onInput={onChange} id="body" js-text-options={encodeURIComponent(JSON.stringify(textStyle))}></div>
            </section>
            <button className="new-post__submit" onClick={onSubmit}>{label}</button>
            {postError && (
                <div>{(postError.graphQLErrors[0].message)}</div>
            )}
            {commentError && (
                <div>{(commentError.graphQLErrors[0].message)}</div>
            )}
            {replyError && (
                <div>{(replyError.graphQLErrors[0].message)}</div>
            )}
            <Modal show={isShowModal} innerRef={ref} type={modalType} />
        </div>
    )
}

const NEW_POST = gql`
    mutation createPost($body: String!) {
        createPost(body: $body) {
            id
            body
            publishingTime
            username
            plusses {
                id
            }
            minusses {
                id
            }
            voteCount
        }
    }
`

const NEW_COMMENT = gql`
    mutation createComment($postId: ID! $body: String!) {
        createComment(postId: $postId body: $body) {
            id
            body
            publishingTime
            username
            plusses {
                id
            }
            minusses {
                id
            }
            voteCount
        }
    }
`

const NEW_REPLY = gql`
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

export default CreatePost;