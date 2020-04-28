import React, { Fragment } from 'react';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import Input from '@material-ui/core/Input';
import InputAdornment from '@material-ui/core/InputAdornment';
import InputLabel from '@material-ui/core/InputLabel';
import CheckIcon from '@material-ui/icons/Check';

import { defaultTranslation } from '../../../constants/translation';
import { IErrorFormat } from '../../../types/inputPropsFormats';

import './loginFieldStyle.scss';

export interface ILoginField {
    error: IErrorFormat;
    loginBlur: () => void;
    loginChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    value: string;
}

const LoginField = (props: ILoginField) => {
    return (
        <div className="field-wrapper">
            <FormControl className="login-form">
                <InputLabel htmlFor="password-field">{defaultTranslation.login}</InputLabel>
                <Input
                    className="login-field"
                    endAdornment={
                        <InputAdornment position="end">
                            {props.error.showCheck ?
                                <CheckIcon className="check-icon" /> :
                                <Fragment />
                            }
                        </InputAdornment>
                    }
                    error={props.error.status}
                    id="login-field"
                    onBlur={() => props.loginBlur()}
                    onChange={event => props.loginChange(event)}
                    placeholder={defaultTranslation.loginPlaceholder}
                    value={props.value.trim()}
                />
                {props.error ?
                    <FormHelperText className="login-error">{props.error.text}</FormHelperText> :
                    <div className="empty-field"></div>
                }
            </FormControl>
        </div>
    )
}

export default LoginField;