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
import CreateIcon from '@material-ui/icons/Create';

import { IErrorFormat, IPasswordFormat, IFieldFormat } from '../../../types/inputPropsFormats';

import './inputFieldStyle.scss';
import Tooltip from '@material-ui/core/Tooltip';

export interface IInputField {
    disabled?: boolean;
    enterClick?: () => void | null;
    error: IErrorFormat;
    field: IFieldFormat;
    handleChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    onEditClick?: () => void;
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
                    disabled={props.disabled}
                    onKeyUp={(e) => { if (e.keyCode === 13 && props?.enterClick) { props?.enterClick() } }}
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
                            {props.disabled ?
                                <Tooltip title="Изменить адрес электронной почты">
                                    <CreateIcon
                                        className="edit-icon"
                                        onClick={() => props.onEditClick()}
                                    />
                                </Tooltip>
                                : <Fragment />
                            }
                            {(props.error.showCheck && !props.disabled) ?
                                <CheckIcon className="check-icon" />
                                : <Fragment />
                            }
                        </InputAdornment>
                    }
                    error={props.error.status}
                    id={inputId}
                    onChange={event => props.handleChange(event)}
                    placeholder={props.field.placeholder}
                    type={(props.field.name === 'password' || props.field.name === 'confirm-password') ? (props.value.show ? 'text' : 'password') : 'text'}
                    value={
                        (
                            props.field.name === 'password' ||
                            props.field.name === 'confirm-password'
                        ) ? props.value.value :
                            (
                                (props.field.name === 'school' ||
                                    props.field.name === 'university' ||
                                    props.field.name === 'workPlace' ||
                                    props.field.name === 'courseName' ||
                                    props.field.name === 'courseFolder'
                                ) ? props.value :
                                    props.value.trim()
                            )
                    }
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