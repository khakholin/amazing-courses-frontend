import React, { Fragment } from 'react';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import IconButton from '@material-ui/core/IconButton';
import Input from '@material-ui/core/Input';
import InputAdornment from '@material-ui/core/InputAdornment';
import InputLabel from '@material-ui/core/InputLabel';
import CheckIcon from '@material-ui/icons/Check';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';

import { defaultTranslation } from '../../../constants/translation';
import { IErrorFormat, IPasswordFormat } from '../../../types/inputPropsFormats';

import './confirmPasswordFieldStyle.scss';

export interface IConfirmPasswordFieldd {
    error: IErrorFormat;
    passworBlur: () => void;
    password: IPasswordFormat;
    passwordChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    passwordShowClick: () => void;
}

const ConfirmPasswordField = (props: IConfirmPasswordFieldd) => {
    return (
        <div className="field-wrapper">
            <FormControl className="confirm-password-form">
                <InputLabel htmlFor="confirm-password-field">{defaultTranslation.passwordAgain}</InputLabel>
                <Input
                    endAdornment={
                        <InputAdornment position="end">
                            <IconButton
                                aria-label="toggle password visibility"
                                onClick={props.passwordShowClick}
                            >
                                {props.password.show ? <Visibility /> : <VisibilityOff />}
                            </IconButton>
                            {props.error.showCheck ?
                                <CheckIcon className="check-icon" /> :
                                <Fragment />
                            }
                        </InputAdornment>
                    }
                    error={props.error.status}
                    id="confirm-password-field"
                    onBlur={() => props.passworBlur()}
                    onChange={event => props.passwordChange(event)}
                    placeholder={defaultTranslation.passwordPlaceholder}
                    type={props.password.show ? 'text' : 'password'}
                    value={props.password.value}
                />
                {props.error.status ?
                    <FormHelperText className="confirm-password-error">{props.error.text}</FormHelperText> :
                    <div className="empty-field"></div>
                }
            </FormControl>
        </div>
    )
}

export default ConfirmPasswordField;