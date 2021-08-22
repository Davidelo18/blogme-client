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