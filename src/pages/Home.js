import React from 'react'
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import Header from '../components/Header';
import Post from '../components/Post';

function Home() {
    const { loading, data: { getPosts: posts } = {} } = useQuery(FETCH_POSTS);

    return (
        <React.Fragment>
            <Header/>
            <main className="main main--posts">
                {loading ? (
                    <h1>Ładowanie postów...</h1>
                ) : (
                    posts && posts.map(post => (
                        <Post key={post.id} post={post}></Post>
                    ))
                )}
            </main>
        </React.Fragment>
    );
}

//document.getElementsByTagName('body')[0].classList.add('dark');

const FETCH_POSTS = gql`
    {
        getPosts {
            id
            username
            body
            publishingTime
            voteCount
        }
    }
`;

export default Home;
