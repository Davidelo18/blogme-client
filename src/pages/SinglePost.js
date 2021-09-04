import gql from 'graphql-tag';
import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import Post from '../components/Post';
import Comment from '../components/Comment';
import { GET_POST_COMMENTS } from '../core/graphql';
import CreatePost from '../components/CreatePost';

function SinglePost(props) {
    const postId = props.match.params.postId;

    const { data: { getOnePost } = {}} = useQuery(FETCH_SINGLE_POST, {
        variables: {
          postId
        }
    });

    const { loading, data: { getComments } = {}} = useQuery(GET_POST_COMMENTS, {
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
        postMarkup = (
            <React.Fragment>
                <Post post={getOnePost}/>
                <section className="comments-section">
                    <h2 className="comments-section__title">Komentarze</h2>
                    <CreatePost label="Dodaj komentarz" postId={postId}/>
                    {loading ? (
                        <div>Ładowanie komentarzy</div>
                    ) : (
                        getComments.length > 0 ? (getComments.map(comment => (
                            <Comment key={comment.id} comment={comment} postId={postId}/>
                        ))) : (
                            <p>Brak komentarzy</p>
                        )
                    )}


                </section>
            </React.Fragment>
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
`;

export default SinglePost;