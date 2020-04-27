import React, { useState, Fragment } from 'react';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import Input from '@material-ui/core/Input';
import InputAdornment from '@material-ui/core/InputAdornment';
import InputLabel from '@material-ui/core/InputLabel';
import CheckIcon from '@material-ui/icons/Check';

import './emailFieldStyle.scss';
import { emailRegExp } from '../../../constants/common';

export interface IEmailField {
}

const EmailField = (props: IEmailField) => {
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
            if (emailRegExp.test(value)) {
                setError(false);
                setErrorText('');
                setShowCheck(true);
            } else {
                setError(true);
                setErrorText('Ошибка в адресе электронной почты. Пример правильного формата: email@domain.com');
                setShowCheck(false);
            }
        } else {
            setError(true);
            setErrorText('E-mail обязателен для заполнения');
            setShowCheck(false);
        }
    }

    return (
        <div className="field-wrapper">
            <FormControl className="email-form">
                <InputLabel htmlFor="email-field">E-mail</InputLabel>
                <Input
                    className="email-field"
                    endAdornment={
                        <InputAdornment position="end">
                            {showCheck ?
                                <CheckIcon className="check-icon" /> :
                                <Fragment />
                            }
                        </InputAdornment>
                    }
                    error={error}
                    id="email-field"
                    onBlur={event => handleBlur()}
                    onChange={event => handleChange(event)}
                    placeholder="email@domain.com"
                    value={value.trim()}
                />
                {error ?
                    <FormHelperText className="email-error">{errorText}</FormHelperText> :
                    <div className="empty-field"></div>
                }
            </FormControl>
        </div>
    )
}

export default EmailField;