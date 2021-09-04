import React, { useState } from 'react';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';
import { FETCH_POSTS } from '../core/graphql';
import { GET_POST_COMMENTS } from '../core/graphql';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBold, faItalic, faUnderline, faLink, faPhotoVideo, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

function CreatePost({label, postId, isReply}) {
    const [values, setValues] = useState({
        body: ''
    });

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

    const onChange = (e) => {
        setValues({ ...values, [e.target.id]: e.target.innerHTML });
        const button = document.querySelector('.new-post__submit');

        e.target.innerText.trim() === '' ? button.disabled = true : button.disabled = false;
    };

    const onSubmit = (e) => {
        e.preventDefault();
        document.getElementById('body').innerHTML = '';
        postId ? newComment() : newPost();
    }

    const boldText = () => {
        console.log(484378);
    }

    const italicText = () => {
        console.log(484378);
    }

    const underlineText = () => {
        console.log(484378);
    }

    const addLink = () => {
        console.log(484378);
    }

    const addPhotoVideo = () => {
        console.log(484378);
    }

    const addSpoiler = () => {
        console.log(484378);
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
                <div className="new-post__editor" contentEditable="true" value={values.body} onInput={onChange} id="body"></div>
            </section>
            <button className="new-post__submit" onClick={onSubmit}>{label}</button>
            {postError && (
                <div>{(postError.graphQLErrors[0].message)}</div>
            )}
            {commentError && (
                <div>{(commentError.graphQLErrors[0].message)}</div>
            )}
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

export default CreatePost;