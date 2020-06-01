import React from 'react';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import PersonIcon from '@material-ui/icons/Person';
import Tooltip from '@material-ui/core/Tooltip';

import appHistory from '../../../modules/app/appHistory';
import { removeCookie } from '../../../utils/operationsWithCookie';

import './headerStyle.scss';
import { useLocalStorage } from '../../../hooks/useLocalStorage';

export interface IHeaderComponent {
    login?: boolean;
}

const Header = (props: IHeaderComponent) => {
    // eslint-disable-next-line
    const [currentMenuItem, setCurrentMenuItem] = useLocalStorage('profileMenuItem', 'MyProfile');

    const onExitClick = () => {
        setCurrentMenuItem('MyProfile')
        removeCookie('auth');
        appHistory.push('/login');
    }

    const onMyProfileClick = () => {
        setCurrentMenuItem('MyProfile')
        appHistory.push('/pesonal-account');
    }

    return (
        <header className="header">
            <div className="header__empty-field"></div>
            <div className="header-logo">
                <div className="header-logo-icon">
                    <div className="header-logo-icon__text">>_</div>
                </div>
                <div className="header-logo__dash">|</div>
                <div className="header-logo__text">amazing courses</div>
            </div>
            {
                !props.login ?
                    <div className="header__buttons-block">
                        <Tooltip title="Мой профиль">
                            <PersonIcon
                                className="header__button header__button_primary"
                                onClick={() => onMyProfileClick()}
                            />
                        </Tooltip>
                        <Tooltip title="Выйти">
                            <ExitToAppIcon
                                className="header__button"
                                onClick={() => onExitClick()}
                            />
                        </Tooltip>
                    </div>
                    : <div className="header__empty-field"></div>
            }
        </header>
    );
};

export default Header;
