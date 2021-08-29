import gql from "graphql-tag";

export const FETCH_POSTS = gql`
{
    getPosts {
        id
        username
        body
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
}`;

export const GET_POST_COMMENTS = gql`
    query($postId: ID!){
        getComments(postId: $postId){
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
`;