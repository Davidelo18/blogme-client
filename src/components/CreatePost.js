import React, { useState } from 'react';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';
import { FETCH_POSTS, GET_REPLIES } from '../core/graphql';
import { GET_POST_COMMENTS } from '../core/graphql';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import '@ckeditor/ckeditor5-build-classic/build/translations/pl';

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

    const onChange = (data) => {
        setValues({ ...values, body: data });
        const button = document.querySelector('.new-post__submit');
        data === '' ? button.disabled = true : button.disabled = false;
    };

    const onSubmit = (e) => {
        e.preventDefault();
        //document.getElementById('body').innerHTML = '';
        postId
            ? isReply ? newReplyCallback(e) : newComment()
            : newPost();
    }

    return (
        <div className={isReply ? "new-post new-post--reply" : "new-post"}>
            <section className="new-post__content">
                <CKEditor editor={ClassicEditor}
                    config={{
                        language: 'pl',
                        toolbar: ['heading', '|', 'bold', 'italic', 'blockQuote', 'link']
                    }}
                    onChange={ ( event, editor ) => {
                        const data = editor.getData();
                        onChange(data);
                    } }
                />
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