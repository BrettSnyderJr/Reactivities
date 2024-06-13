import { PaginatedResult } from './../models/pagination';
import { Photo, Profile, UserActivity } from './../models/profile';
import { ActivityFormValues } from './../models/activity';
import { UserFormValues } from './../models/user';
import { store } from './../stores/store';
import axios, { AxiosError, AxiosHeaders, AxiosResponse } from 'axios';
import { toast } from 'react-toastify';
import { Activity } from '../models/activity';
import { User } from '../models/user';
import { router } from '../router/Routes';

const sleep = (delay: number) => {
    return new Promise((resolve) => {
        setTimeout(resolve, delay);
    })
}

axios.defaults.baseURL = import.meta.env.VITE_API_URL;

axios.interceptors.request.use((config) => {

    const token = store.commonStore.token;

    //if (token && config.headers) config.headers.Authorization = `Bearer ${token}`;
    if (token && config.headers) {
        (config.headers as AxiosHeaders).set('Authorization', `Bearer ${token}`);
    }

    //console.log(config);

    return config;
});

axios.interceptors.response.use(async response => {

    // For testing requests - helps observe things like loading functionality
    if (import.meta.env.DEV) {
        await sleep(1000);
    }

    const pagination = response.headers['pagination'];

    if (pagination) {
        response.data = new PaginatedResult(response.data, JSON.parse(pagination));
        return response as AxiosResponse<PaginatedResult<unknown>>;
    }

    return response;

    // Non async way of using
    // return sleep(1000).then(() => {
    //     return response;
    // }).catch((error) => {
    //     console.log(error);
    //     return Promise.reject(error);
    // })

}, (error: AxiosError) => {

    // if (!error.response) {
    //     return Promise.reject(error);
    // }

    //console.log(error);

    const { data, status, config } = error.response as AxiosResponse;

    //console.log(error.response);

    switch (status) {
        case 400:

            //toast.error('bad request');

            if (typeof (data) === 'string') {
                toast.error(data);
            }

            // Handles bad guid
            if (config.method === 'get' && Object.prototype.hasOwnProperty.call(data.errors, 'id')) {
                router.navigate('/not-found');
            }

            if (data.errors) {

                const modalStateErrors = [];

                for (const key in data.errors) {
                    if (data.errors[key]) {
                        //console.log(data.errors[key]);
                        modalStateErrors.push(data.errors[key]);
                    }
                }

                throw modalStateErrors.flat();
            }

            break;

        case 401:
            toast.error('unauthorized');
            break;

        case 404:
            //toast.error('not found');
            router.navigate('/not-found');
            break;

        case 500:
            //toast.error('server error');
            store.commonStore.setServerError(data);
            router.navigate('/server-error');
            break;
    }

    return Promise.reject(error);
})

const responseBody = <T> (response: AxiosResponse<T>) => response.data;

const requests = {
    get: <T> (url: string) => axios.get<T>(url).then(responseBody),
    post: <T> (url: string, body: object) => axios.post<T>(url, body).then(responseBody),
    put: <T> (url: string, body: object) => axios.put<T>(url, body).then(responseBody),
    delete: <T> (url: string) => axios.delete<T>(url).then(responseBody),
}

const Activities = {
    list: (params: URLSearchParams) => axios
        .get<PaginatedResult<Activity[]>>('/activities', { params })
        .then(responseBody),
    details: (id: string) => requests.get<Activity>(`/activities/${id}`),
    create: (activity: ActivityFormValues) => requests.post<void>('/activities', activity),
    update: (activity: ActivityFormValues) => requests.put<void>(`/activities/${activity.id}`, activity),
    delete: (id: string) => requests.delete<void>(`/activities/${id}`),
    attend: (id: string) => requests.post<void>(`/activities/${id}/attend`, {})
}

const Account = {
    current: () => requests.get<User>('/account'),
    login: (user: UserFormValues) => requests.post<User>('/account/login', user),
    register: (user: UserFormValues) => requests.post<User>('/account/register', user)
}

const Profiles = {
    get: (username: string) => requests.get<Profile>(`/profiles/${username}`),
    uploadPhoto: (file: Blob) => {
        const formData = new FormData();
        formData.append('File', file);
        return axios.post<Photo>('photos', formData, {
            headers: {'Content-type':'multipart/form-data'}
        })
    },
    setMainPhoto: (id: string) => requests.post(`/photos/${id}/setMain`, {}),
    deletePhoto: (id: string) => requests.delete(`/photos/${id}`),
    updateProfile: (profile: Partial<Profile>) => requests.put(`/profiles`, profile),
    updateFollowing: (username: string) => requests.post(`/follow/${username}`, {}),
    listFollowings: (username: string, predicate: string) => requests.get<Profile[]>(`/follow/${username}?predicate=${predicate}`),
    listActivities: (username: string, predicate: string) => requests.get<UserActivity[]>(`/profiles/${username}/activities?predicate=${predicate}`),

}

const agent = {
    Activities,
    Account,
    Profiles
}

export default agent;