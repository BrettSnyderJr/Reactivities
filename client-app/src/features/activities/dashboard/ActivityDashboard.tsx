import { observer } from 'mobx-react-lite';
import React, { useEffect } from 'react';
import { Grid } from 'semantic-ui-react';
import LoadingComponent from '../../../app/layout/LoadingComponent';
import { useStore } from '../../../app/stores/store';
import ActivityFilters from './ActivityFilters';
import ActivityList from './ActivityList';

const ActivityDashboard = function() {

    const { activityStore } = useStore();
    const { loadActivities, activityRegistry, loadingInitial } = activityStore;

    //console.log(`Dashboard Rendered: Initial load = ${loadingInitial}`);

    useEffect(() => {

        // No need to re-fetch if we have them in memory
        if (activityRegistry.size <= 1) loadActivities();
        
    }, [activityRegistry.size, loadActivities]);

    if(loadingInitial) return <LoadingComponent />
    
    return (
        <Grid>
            <Grid.Column width='10'>
                <ActivityList />
            </Grid.Column>

            <Grid.Column width='6'>
                <ActivityFilters />
            </Grid.Column>
        </Grid>
    )
}

export default observer(ActivityDashboard);