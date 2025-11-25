import React, { useEffect } from 'react';
import './Message.css';

const Message = ({ message, onClose }) => {
    useEffect(() => {
        if (message.show) {
            const timer = setTimeout(() => {
                onClose();
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [message.show, onClose]);

    if (!message.show) return null;

    return (
        <div className={`message message-${message.type}`}>
            <span>{message.text}</span>
            <button className="message-close" onClick={onClose}>×</button>
        </div>
    );
};

export default Message;

