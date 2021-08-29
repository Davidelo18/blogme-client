import React, { useState } from 'react';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';
import { GET_POST_COMMENTS } from '../core/graphql';

function CreateComment({postId}) {
    const [values, setValues] = useState({
        postId,
        body: ''
    });

    const [newcomment, { error }] = useMutation(NEW_COMMENT, {
        variables: values,
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
        newcomment();
    };

    return (
        <div className="new-post">
            <div className="new-post__editor" contentEditable="true" value={values.body} onInput={onChange} id="body"></div>
            <button className="new-post__submit" onClick={onSubmit}>Dodaj komentarz!</button>
            {error && (
                <div>{(error.graphQLErrors[0].message)}</div>
            )}
        </div>
    )
}

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

export default CreateComment;