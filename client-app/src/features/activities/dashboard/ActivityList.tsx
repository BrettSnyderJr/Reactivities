import { observer } from 'mobx-react-lite';
import { Fragment } from 'react';
import { Header } from 'semantic-ui-react';
import { useStore } from '../../../app/stores/store';
import ActivityListItem from './ActivityListItem';

const ActivityList = function () {
    
    const { activityStore } = useStore();
    const { groupedActivities } = activityStore;

    return (
        <>
            {
                groupedActivities.map(([group, activities]) => {
                    return(
                        <Fragment key={group}>
                            <Header sub color='teal'>
                                {group}
                            </Header>
                            {
                                activities.map((activity) => {
                                    return (
                                        <ActivityListItem key={activity.id} activity={activity} />
                                    )
                                })
                            }
                        </Fragment>
                    )
                })
            }
        </>     
    )
}

export default observer(ActivityList);