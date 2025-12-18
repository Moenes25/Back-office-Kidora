export const groupActivitiesByDay = (activities) => {
  return activities.reduce((groups, activity) => {
    const day = new Date(activity.action.date).toDateString();

    if (!groups[day]) {
      groups[day] = [];
    }

    groups[day].push(activity);
    return groups;
  }, {});
};
