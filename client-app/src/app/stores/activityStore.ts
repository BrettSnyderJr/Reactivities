import { makeAutoObservable, runInAction } from 'mobx';
import agent from '../api/agent';
import { Activity } from '../models/activity';

export default class ActivityStore {

    activityRegistry = new Map <string, Activity> ();
    selectedActivity: Activity | undefined = undefined;
    editMode = false
    loading = false;
    loadingInitial = false;

    constructor() {
        makeAutoObservable(this)
    }

    get activitiesByDate() {
        return Array.from(this.activityRegistry.values()).sort((a, b) =>
            Date.parse(a.date) - Date.parse(b.date));
    }

    // Arrow function auto binds this keyword to class
    // Easier to use in this case

    // Loads activities into memory
    loadActivities = async () => {

        this.setLoadingInitial(true);

        try {

            const activities = await agent.Activities.list();

            // Just getting a simple date
            activities.forEach(activity => {
                this.setActivity(activity);
            })

            this.setLoadingInitial(false);

        } catch (error) {
            console.log(error);
            this.setLoadingInitial(false);
        }
    }

    loadActivity = async (id: string) => {

        let activity = this.getActivity(id);
        
        // If activity already in memory return it
        // else fetch from api
        if (activity) {

            this.selectedActivity = activity;

            return activity;

        } else {

            this.setLoadingInitial(true);

            try {

                activity = await agent.Activities.details(id);
                this.setActivity(activity);

                runInAction(() => {
                    this.selectedActivity = activity;
                })
                
                this.setLoadingInitial(false);

                return activity;

            } catch (error) {
                console.log(error);
                this.setLoadingInitial(false);
            }
        }
    }

    createActivity = async (activity: Activity) => {
        
        this.loading = true;

        try {

            await agent.Activities.create(activity);

            runInAction(() => {
                
                this.activityRegistry.set(activity.id, activity);
                this.selectedActivity = activity;
                this.editMode = false;
                this.loading = false;
            })

        } catch (error) {
            console.log(error);
            runInAction(() => {
                this.loading = false;
            })
        }
    }

    updateActivity = async (activity: Activity) => {
        
        this.loading = true;

        try {

            await agent.Activities.update(activity);

            runInAction(() => {
                
                this.activityRegistry.set(activity.id, activity);
                this.selectedActivity = activity;
                this.editMode = false;
                this.loading = false;
            })

        } catch (error) {
            console.log(error);
            runInAction(() => {
                this.loading = false;
            })
        }
    }

    deleteActivity = async (id: string) => {

        this.loading = true;

        try {

            await agent.Activities.delete(id);

            runInAction(() => {
                
                this.activityRegistry.delete(id);
                this.loading = false;
            })

        } catch (error) {
            console.log(error);
            runInAction(() => {
                this.loading = false;
            })
        }
    }

    setLoadingInitial = (state: boolean) => {
        this.loadingInitial = state;
    }

    // Helper method
    private setActivity = (activity: Activity) => {

        activity.date = activity.date.split('T')[0];
        this.activityRegistry.set(activity.id, activity);
    }

    // Helper method
    private getActivity = (id: string) => {
        return this.activityRegistry.get(id);
    }
}