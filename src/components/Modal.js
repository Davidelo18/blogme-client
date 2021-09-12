import React from 'react';

function Modal({show, innerRef, type}) {

    const onSubmit = (e) => {
        e.preventDefault();
    }

    switch(type) {
        case 'link':
            return (
                <div className={`modal${show ? " visible" : ""}`} ref={innerRef}>
                    <form onSubmit={onSubmit}>
                        <label htmlFor="url">Odnośnik</label>
                        <input type="text" id="url" />
                        <label htmlFor="name">Opis odnośnika (opcjonalnie)</label>
                        <input type="text" id="name" />
                        <button type="submit">Wstaw link</button>
                    </form>
                </div>
            )
        case 'photo':
            return (
                <div className={`modal${show ? " visible" : ""}`} ref={innerRef}>Photo</div>
            )
        default:
            return (
                <div className={`modal${show ? " visible" : ""}`} ref={innerRef}></div>
            )
    }
}

export default Modal;