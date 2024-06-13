import { Formik, Form, ErrorMessage } from 'formik';
import { observer } from 'mobx-react-lite';
import { Button, Header } from 'semantic-ui-react';
import MyTextInput from '../../app/common/form/MyTextInput';
import { useStore } from '../../app/stores/store';
import * as Yup from 'yup';
import ValidationError from '../errors/ValidationError';

export default observer(function RegisterForm() {

    const { userStore } = useStore();

    return (
        <Formik
            initialValues={{ email: '', password: '', displayName: '', username: '', error: null }}
            onSubmit={(values, { setErrors }) => {
                return (
                    userStore.register(values).catch((error) => {
                        return setErrors({ error });
                    })
                )
            }}
            validationSchema={Yup.object({
                displayName: Yup.string().required(),
                username: Yup.string().required(),
                email: Yup.string().required().email(),
                password: Yup.string().required(),
            })}
        >
            {({ handleSubmit, isSubmitting, errors, isValid, dirty }) => {
                return (
                    <Form className="ui form error" onSubmit={handleSubmit} autoComplete='off'>
                        <Header as='h2' content='Sign up to Reactivities' color='teal' textAlign='center' />
                        <MyTextInput name='displayName' placeholder='Display Name' />
                        <MyTextInput name='username' placeholder='Username' />
                        <MyTextInput name='email' placeholder='Email' />
                        <MyTextInput name='password' placeholder='Password' type='password' />
                        <ErrorMessage name='error' render={() => <ValidationError errors={errors.error as unknown as string[]} />}/>
                        <Button
                            disabled={!isValid || !dirty || isSubmitting}
                            loading={isSubmitting}
                            positive
                            content='Register'
                            type='submit'
                            fluid
                        />
                    </Form>
                )
            }}
        </Formik>
    )
})