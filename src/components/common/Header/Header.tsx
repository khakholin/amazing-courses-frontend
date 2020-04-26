import React from 'react';

import './headerStyle.scss';

export interface IHeaderComponent {
}

const Header = (props: IHeaderComponent) => {
    return (
        <header className="header">
            <div className="header-text">
                <span className="header-text__first">fatykhov</span>
                <span className="header-text__second">course</span>
            </div>
        </header>
    );
};

export default Header;
