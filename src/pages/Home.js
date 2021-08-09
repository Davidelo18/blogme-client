import React from 'react'
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import Post from '../components/Post';
import CreatePost from '../components/CreatePost';

function Home() {
    const { loading, data: { getPosts: posts } = {} } = useQuery(FETCH_POSTS);

    return (
        <React.Fragment>
            <main className="main">
                <CreatePost/>
                <section className="posts-container">
                    {loading ? (
                        <section className="post__loading">
                            <div className="pencil"></div>
                            <div className="text" id="loadingText">Wczytywanie postów</div>
                        </section>
                    ) : (
                        posts && posts.map(post => (
                            <Post key={post.id} post={post}></Post>
                        ))
                    )}
                </section>
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
