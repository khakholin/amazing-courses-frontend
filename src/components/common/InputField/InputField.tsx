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

import { IErrorFormat, IPasswordFormat, IFieldFormat } from '../../../types/inputPropsFormats';

import './inputFieldStyle.scss';

export interface IInputField {
    error: IErrorFormat;
    field: IFieldFormat;
    handleBlur: () => void;
    handleChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    passwordShowClick?: () => void;
    value: string | IPasswordFormat;
}

const InputField = (props: any) => {
    const inputId = props.field.name + '-field';

    return (
        <div className="field-wrapper">
            <FormControl className="input-form">
                <InputLabel htmlFor={inputId}>{props.field.title}</InputLabel>
                <Input
                    endAdornment={
                        <InputAdornment position="end">
                            {(props.field.name === 'password' || props.field.name === 'confirm-password') ?
                                <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={props.passwordShowClick}
                                >
                                    {props.value.show ? <Visibility /> : <VisibilityOff />}
                                </IconButton> :
                                <Fragment />
                            }
                            {props.error.showCheck ?
                                <CheckIcon className="check-icon" /> :
                                <Fragment />
                            }
                        </InputAdornment>
                    }
                    error={props.error.status}
                    id={inputId}
                    onBlur={() => props.handleBlur()}
                    onChange={event => props.handleChange(event)}
                    placeholder={props.field.placeholder}
                    type={(props.field.name === 'password' || props.field.name === 'confirm-password') ? (props.value.show ? 'text' : 'password') : 'text'}
                    value={(props.field.name === 'password' || props.field.name === 'confirm-password') ? props.value.value : props.value.trim()}
                />
                {props.error.status ?
                    <FormHelperText className="input-error">{props.error.text}</FormHelperText> :
                    <div className="empty-field"></div>
                }
            </FormControl>
        </div>
    )
}

export default InputField;