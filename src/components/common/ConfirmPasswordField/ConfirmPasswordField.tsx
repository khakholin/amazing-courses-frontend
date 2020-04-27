import React, { useState, Fragment } from 'react';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import IconButton from '@material-ui/core/IconButton';
import Input from '@material-ui/core/Input';
import InputAdornment from '@material-ui/core/InputAdornment';
import InputLabel from '@material-ui/core/InputLabel';
import CheckIcon from '@material-ui/icons/Check';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';

import './confirmPasswordFieldStyle.scss';

export interface IConfirmPasswordFieldd {
}

const ConfirmPasswordField = (props: IConfirmPasswordFieldd) => {
    const [error, setError] = useState(false);
    const [errorText, setErrorText] = useState('');
    const [field, setField] = useState({ value: '', show: false });
    const [showCheck, setShowCheck] = useState(false);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setError(false);
        setErrorText('');
        setField({ ...field, value: event.target.value });
        setShowCheck(false);
    };

    const handleBlur = () => {
        if (field.value.length) {
            for (let i = 0; i < field.value.length; i++) {
                if (field.value[i] === ' ') {
                    setError(true);
                    setErrorText('Пароль может содержать только буквы, цифры и спец. символы (кроме пробела) и состоять из 6 символов или более');
                    setShowCheck(false);
                    return
                }
            }
            if (field.value.length < 6) {
                setError(true);
                setErrorText('Слишком простой пароль — введено менее 6 символов');
                setShowCheck(false);
            } else {
                setError(false);
                setErrorText('');
                setShowCheck(true);
            }
        } else {
            setError(true);
            setErrorText('Пароль обязателен для заполнения');
            setShowCheck(false);
        }
    }

    const handleClickShowPassword = () => {
        setField({ ...field, show: !field.show });
        const el = document.getElementById('password-field') as HTMLInputElement;
        el.focus()
        el.selectionStart = field.value.length;
    };


    return (
        <div className="field-wrapper">
            <FormControl className="password-form">
                <InputLabel htmlFor="password-field">Подтвердите пароль</InputLabel>
                <Input
                    endAdornment={
                        <InputAdornment position="end">
                            <IconButton
                                aria-label="toggle password visibility"
                                onClick={handleClickShowPassword}
                            >
                                {field.show ? <Visibility /> : <VisibilityOff />}
                            </IconButton>
                            {showCheck ?
                                <CheckIcon className="check-icon" /> :
                                <Fragment />
                            }
                        </InputAdornment>
                    }
                    error={error}
                    id="password-field"
                    onBlur={event => handleBlur()}
                    onChange={event => handleChange(event)}
                    placeholder="StrongPassword1234"
                    type={field.show ? 'text' : 'password'}
                    value={field.value}
                />
                {error ?
                    <FormHelperText className="password-error">{errorText}</FormHelperText> :
                    <div className="empty-field_password"></div>
                }
            </FormControl>
        </div>
    )
}

export default ConfirmPasswordField;