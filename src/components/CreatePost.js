import React, { useState } from 'react';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';
import { FETCH_POSTS } from '../core/graphql';

function CreatePost() {
    const [values, setValues] = useState({
        body: ''
    });

    const [newPost, { error }] = useMutation(NEW_POST, {
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
    })

    const onChange = (e) => {
        setValues({ ...values, [e.target.id]: e.target.innerHTML });
        const button = document.querySelector('.new-post__submit');

        e.target.innerText.trim() === '' ? button.disabled = true : button.disabled = false;
    };

    const onSubmit = (e) => {
        e.preventDefault();
        document.getElementById('body').innerHTML = '';
        newPost();
    }

    return (
        <div className="new-post">
            <div className="new-post__editor" contentEditable="true" value={values.body} onInput={onChange} id="body"></div>
            <button className="new-post__submit" onClick={onSubmit}>Bloguj!</button>
            {error && (
                <div>{(error.graphQLErrors[0].message)}</div>
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

export default CreatePost;