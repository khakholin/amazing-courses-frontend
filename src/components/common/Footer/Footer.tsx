import React from 'react';

import './footerStyle.scss';

export interface IFooterComponent {
}

const Footer = (props: IFooterComponent) => {
    return (
        <footer className="footer">
            <div className="footer-wrapper">
                <div className="footer-text">© 2016-{new Date().getFullYear()} Intabia</div>
            </div>
        </footer>
    );
};

export default Footer;
