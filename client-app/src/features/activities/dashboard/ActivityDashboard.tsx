import { observer } from 'mobx-react-lite';
import React from 'react';
import { Grid } from 'semantic-ui-react';
import { useStore } from '../../../app/stores/store';
import ActivityDetails from '../details/ActivityDetails';
import ActivityForm from '../form/ActivityForm';
import ActivityList from './ActivityList';

const ActivityDashboard = function() {

    const { activityStore } = useStore();
    const { selectedActivity, editMode } = activityStore;
    
    return (
        <Grid>
            <Grid.Column width='10'>
                <ActivityList />
            </Grid.Column>

            <Grid.Column width='6'>

                {
                    // Anything to the right of && will execute so long as left value is not null or undefined
                    selectedActivity && !editMode && <ActivityDetails />
                }

                {
                    editMode && <ActivityForm />
                }
            </Grid.Column>
        </Grid>
    )
}

export default observer(ActivityDashboard);