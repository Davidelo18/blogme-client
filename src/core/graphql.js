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

export const GET_REPLIES = gql`
    query($commentId: ID!){
        getReplies(commentId: $commentId){
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

export const GET_USER_INFO = gql`
    query($username: String!){
        getUserInfo(username: $username){
            username
            email
            timeCreated
            avatar
            info {
                name
                surname
                birthDate
                aboutMe
                facebook
                instagram
                youtube
                website
            }
            options {
                nightTheme
                canReceiveMessages
            }
        }
    }
`;

export const NEW_MESSAGE = gql`
    subscription newMessage {
        newMessage {
            id
            body
            sendFrom
            sendTo
            sendingTime
        }
    }
`;