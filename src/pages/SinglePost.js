import gql from 'graphql-tag';
import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import Post from '../components/Post';

function SinglePost(props) {
    const postId = props.match.params.postId;

    const { data: { getOnePost } = {}} = useQuery(FETCH_SINGLE_POST, {
        variables: {
          postId
        }
      });

    let postMarkup;
    if (!getOnePost) {
        postMarkup = (
            <section className="post__loading">
                <div className="pencil"></div>
                <div className="text" id="loadingText">Ładowanie posta</div>
            </section>
    )} else {
        const { id, body, publishingTime, username, plusses, minusses, voteCount } = getOnePost;

        postMarkup = (
            <Post post={getOnePost}/>
        )
    }

    return (
        <React.Fragment>
            <main className="main">
                {postMarkup}
            </main>
        </React.Fragment>
    );
}

const FETCH_SINGLE_POST = gql`
    query($postId: ID!){
        getOnePost(postId: $postId){
            id
            body
            publishingTime
            username
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

export default SinglePost;