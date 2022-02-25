import React, { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { useParams } from 'react-router-dom';
import { Grid } from 'semantic-ui-react';
import ProfileContent from './ProfileContent';
import ProfileHeader from './ProfileHeader';
import { useStore } from '../../app/stores/store';
import LoadingComponent from '../../app/layout/LoadingComponent';

const ProfilePage = function () {
    
    const { username } = useParams<{ username: string }>();
    const { profileStore } = useStore();
    const { loadingProfile, loadProfile, profile } = profileStore;

    useEffect(() => { 

        loadProfile(username);

    }, [loadProfile, username])
    
    if (loadingProfile) return <LoadingComponent content='Loading Profile...' />

    //console.log(profile);

    return (
        <Grid.Column width={16}>

            {
                profile &&
                <>
                    <ProfileHeader profile={profile} />
                    <ProfileContent profile={profile} />
                </>
            }

        </Grid.Column>
    );
};

export default observer(ProfilePage);