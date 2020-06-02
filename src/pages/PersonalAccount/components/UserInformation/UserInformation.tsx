import React, { useState, useEffect } from 'react';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import ListItemText from '@material-ui/core/ListItemText';
import Select from '@material-ui/core/Select';
import Checkbox from '@material-ui/core/Checkbox';

import { IUserProfileResponse } from '../../../../types/responseTypes';

import './userInformationStyle.scss';
import { appRequest } from '../../../../modules/app/appRequest';

export interface IUserInformationProps {
    user: IUserProfileResponse | undefined;
}

const UserInformation = (props: IUserInformationProps) => {
    //запросы на монтировании:
    // 1. Полный список курсов на сайте
    // 2. Список курсов пользователя по его имени/email
    // 3. После каждого нажатия чекбокса уходит POST с удалением/добавление курса,
    //    при этом прогресс курса, если он удален, не сбрасывается, прогресс должен
    //    храниться в БД всегда, доступ к курсу может быть восстановлен

    useEffect(() => {
        appRequest('/api/course/list', 'GET')
            .then(response => {
                setCourseList(response.data)
            });
    }, [])

    const [courseList, setCourseList] = useState([]);
    const [personName, setPersonName] = useState<string[]>([]);

    const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        setPersonName(event.target.value as string[]);
    };

    return (
        <div className="user-information-component">
            Логин: {props.user?.username}
            <br></br>
            email: {props.user?.email}
            <br></br>
            Имя: {props.user?.realName}
            <br></br>
            Фамилия: {props.user?.realSurname}
            <br></br>
            Школа: {props.user?.school}
            <br></br>
            Университет: {props.user?.university}
            <br></br>
            Место работы: {props.user?.workPlace}
            <FormControl className='user-information-component__multiselect'>
                <InputLabel id="demo-mutiple-checkbox-label">Доступные курсы</InputLabel>
                <Select
                    labelId="demo-mutiple-checkbox-label"
                    id="demo-mutiple-checkbox"
                    multiple
                    value={personName}
                    onChange={handleChange}
                    input={<Input />}
                    renderValue={(selected: any) => selected.length > 1 ? (selected[0] + ', +' + (selected.length - 1)) : selected[0]}
                >
                    {courseList.map((name) => (
                        <MenuItem key={name} value={name}>
                            <Checkbox checked={personName.indexOf(name) > -1} />
                            <ListItemText primary={name} />
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </div>
    );
};

export default UserInformation;
