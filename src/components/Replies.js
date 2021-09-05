import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import Comment from "./Comment";

function Replies({commentId}) {
    const { loading, data: { getReplies } = {} } = useQuery(GET_REPLIES, {
        variables: { commentId }
    });

    return (
        <React.Fragment>
            {loading ? (
                <div>Ładowanie odpowiedzi</div>
            ) : (
                getReplies && getReplies.map(reply => (
                    <Comment key={reply.id} comment={reply} postId={commentId} isReply />
                ))
            )}
        </React.Fragment>
    )
}

const GET_REPLIES = gql`
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

export default Replies;