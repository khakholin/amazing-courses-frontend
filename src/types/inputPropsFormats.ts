export interface IErrorFormat {
    showCheck: boolean;
    status: boolean;
    text: string;
}

export interface IFieldFormat {
    name: string;
    title: string;
    placeholder: string;
}

export interface IPasswordFormat {
    value: string;
    show: boolean;
}

export interface IUserCoursesData {
    totalNumOfLectures: number;
    totalTime: number;
    courses: ICourseData[];
}

export interface ICourseData {
    _id?: string;
    courseFolder: string;
    courseLectures: ILectureData[];
    courseName: string;
    courseTime: number;
    numOfLectures: number;
}

export interface ILectureData {
    accessDate: string;
    additionalMaterials: { materialTitle: string; materialLink: string }[];
    lectureTime: number;
    lectureTitle: string;
}
