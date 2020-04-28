import React, { Fragment } from 'react';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import Input from '@material-ui/core/Input';
import InputAdornment from '@material-ui/core/InputAdornment';
import InputLabel from '@material-ui/core/InputLabel';
import CheckIcon from '@material-ui/icons/Check';

import { defaultTranslation } from '../../../constants/translation';
import { IErrorFormat } from '../../../types/inputPropsFormats';

import './emailFieldStyle.scss';

export interface IEmailField {
    error: IErrorFormat;
    emailBlur: () => void;
    emailChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    value: string;
}

const EmailField = (props: IEmailField) => {
    return (
        <div className="field-wrapper">
            <FormControl className="email-form">
                <InputLabel htmlFor="email-field">{defaultTranslation.email}</InputLabel>
                <Input
                    className="email-field"
                    endAdornment={
                        <InputAdornment position="end">
                            {props.error.showCheck ?
                                <CheckIcon className="check-icon" /> :
                                <Fragment />
                            }
                        </InputAdornment>
                    }
                    error={props.error.status}
                    id="email-field"
                    onBlur={() => props.emailBlur()}
                    onChange={event => props.emailChange(event)}
                    placeholder="email@domain.com"
                    value={props.value.trim()}
                />
                {props.error.status ?
                    <FormHelperText className="email-error">{props.error.text}</FormHelperText> :
                    <div className="empty-field"></div>
                }
            </FormControl>
        </div>
    )
}

export default EmailField;