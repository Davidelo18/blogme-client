import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';

function Messanger() {
    const { loading, data: { getUsers: users } = {}} = useQuery(GET_USERS);

    const $searchInput = document.querySelector('.messanger__search-input');
    if ($searchInput) {
        $searchInput.addEventListener('input', (e) => {
            let searchValue = e.target.value;
            const $userNamesDiv = document.querySelectorAll('.messanger__user-name');
            $userNamesDiv.forEach(div => {
                const name = div.textContent;
                if (name.indexOf(searchValue) === -1) {
                    div.parentNode.classList.add('hide');
                } else {
                    div.parentNode.classList.remove('hide');
                }
            });
        });
    }

    return (
        <section className="messanger">
            <div className="messanger__users">
                <div className="messanger__search">
                    <label className="messanger__search-label"><input className="messanger__search-input" type="text" placeholder="Wyszukaj użytkownika" /></label>
                </div>
                <div className="messanger__users-container">
                    {loading ? (
                        <div>Ładowanie...</div>
                    ) : (users && users.map(user => (
                        (user.options.canReceiveMessages &&
                            <div tabIndex="0" className="messanger__user-btn" key={user.id}>
                                <div className="messanger__user-avatar"><img src={user.avatar} alt={`avatar użytkownika ${user.username}`} /></div>
                                <div className="messanger__user-name">{user.username}</div>
                            </div>)
                    )))}
                </div>
            </div>
            <div className="messanger__chat"></div>
        </section>
    );
}

const GET_USERS = gql`
    {
        getUsers {
            id
            username
            avatar
            options {
                canReceiveMessages
            }
        }
    }
`;

export default Messanger;