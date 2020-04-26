import React from 'react';

import './footerStyle.scss';

export interface IFooterComponent {
}

const Footer = (props: IFooterComponent) => {
    return (
        <footer className="footer">
            <div className="footer-wrapper">
                <div className="footer-text">{(new Date().getFullYear() === 2020 ? '© ' : '© 2020-') + new Date().getFullYear()} Fatykhov Timur</div>
            </div>
        </footer>
    );
};

export default Footer;
