import React, { useState, Fragment } from 'react';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import Input from '@material-ui/core/Input';
import InputAdornment from '@material-ui/core/InputAdornment';
import InputLabel from '@material-ui/core/InputLabel';
import CheckIcon from '@material-ui/icons/Check';

import './loginFieldStyle.scss';

export interface ILoginField {
}

const LoginField = (props: ILoginField) => {
    const [error, setError] = useState(false);
    const [errorText, setErrorText] = useState('');
    const [value, setValue] = useState('');
    const [showCheck, setShowCheck] = useState(false);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setError(false);
        setErrorText('');
        setValue(event.target.value);
        setShowCheck(false);
    };

    const handleBlur = () => {
        if (value.length) {
            if (value.length < 5) {
                setError(true);
                setErrorText('Минимальная длина логина - 5 символов');
                setShowCheck(false);
            } else {
                setError(false);
                setErrorText('');
                setShowCheck(true);
            }
        } else {
            setError(true);
            setErrorText('Логин обязателен для заполнения');
            setShowCheck(false);
        }
    }
    return (
        <div className="field-wrapper">
            <FormControl className="login-form">
                <InputLabel htmlFor="password-field">Ваш логин</InputLabel>
                <Input
                    className="login-field"
                    endAdornment={
                        <InputAdornment position="end">
                            {showCheck ?
                                <CheckIcon className="password__check-icon" /> :
                                <Fragment />
                            }
                        </InputAdornment>
                    }
                    error={error}
                    id="standard-adornment-weight"
                    onBlur={event => handleBlur()}
                    onChange={event => handleChange(event)}
                    placeholder="AmazingPotato"
                    value={value.trim()}
                />
                {error ?
                    <FormHelperText className="login-error">{errorText}</FormHelperText> :
                    <div className="empty-field"></div>
                }
            </FormControl>
        </div>
    )
}

export default LoginField;