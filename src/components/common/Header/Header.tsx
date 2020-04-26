import React from 'react';

import './headerStyle.scss';

export interface IHeaderComponent {
}

const Header = (props: IHeaderComponent) => {
    return (
        <header className="header">
            <div className="header-logo">
                <div className="header-icon">
                    <div className="header-icon__text">>_</div>
                </div>
                <div className="header-logo__dash">|</div>
                <div className="header-logo__text">fatykhov course</div>
            </div>
        </header>
    );
};

export default Header;
