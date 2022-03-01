import { observer } from 'mobx-react-lite';
import React, { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import { Grid, Loader } from 'semantic-ui-react';
import LoadingComponent from '../../../app/layout/LoadingComponent';
import { PagingParams } from '../../../app/models/pagination';
import { useStore } from '../../../app/stores/store';
import ActivityFilters from './ActivityFilters';
import ActivityList from './ActivityList';
import ActivityListItemPlaceholder from './ActivityListItemPlaceholder';

const ActivityDashboard = function() {

    const { activityStore } = useStore();
    const { loadActivities, activityRegistry, loadingInitial, setPagingParams, pagination } = activityStore;
    const [loadingNext, setLoadingNext] = useState(false);

    //console.log(`Dashboard Rendered: Initial load = ${loadingInitial}`);

    function handleGetNext(){ 

        setLoadingNext(true);
        setPagingParams(new PagingParams(pagination!.currentPage + 1));
        loadActivities().then(() => setLoadingNext(false));
    }

    useEffect(() => {

        // No need to re-fetch if we have them in memory
        if (activityRegistry.size <= 1) loadActivities();
        
    }, [activityRegistry.size, loadActivities]);

    // if(loadingInitial && !loadingNext) return <LoadingComponent content='Loading Activities' />
    
    return (
        <Grid>
            <Grid.Column width='10'>

                {loadingInitial && !loadingNext ? (

                    <>
                        <ActivityListItemPlaceholder />
                        <ActivityListItemPlaceholder />
                    </>

                ):(
                        
                    <InfiniteScroll
                        pageStart={0}
                        loadMore={handleGetNext}
                        hasMore={!loadingNext && !!pagination && pagination.currentPage < pagination.totalPages}
                        initialLoad={false}
                    >
                        <ActivityList />
                    </InfiniteScroll>
                )}
                               
                {/* <Button
                    floated='right'
                    content='More...'
                    positive
                    onClick={handleGetNext}
                    loading={loadingNext}
                    disabled={pagination?.totalPages === pagination?.currentPage}
                /> */}

            </Grid.Column>

            <Grid.Column width='6'>
                <ActivityFilters />
            </Grid.Column>

            <Grid.Column width='10'>
                <Loader active={loadingNext} />
            </Grid.Column>

        </Grid>
    )
}

export default observer(ActivityDashboard);