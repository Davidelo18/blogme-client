import React from 'react'
import { useQuery } from '@apollo/react-hooks';
import { Transition } from 'semantic-ui-react';
import Post from '../components/Post';
import CreatePost from '../components/CreatePost';
import { FETCH_POSTS } from '../core/graphql';

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
                        <Transition.Group>
                            {posts && posts.map(post => (
                                <Post key={post.id} post={post}></Post>
                            ))}
                        </Transition.Group>
                    )}
                </section>
            </main>
        </React.Fragment>
    );
}

//document.getElementsByTagName('body')[0].classList.add('dark');

export default Home;
