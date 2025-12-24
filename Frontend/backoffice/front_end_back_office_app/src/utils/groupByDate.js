export const groupActivitiesByDay = (activities) => {
  const groups = activities.reduce((acc, activity) => {
    const date = new Date(activity.action.date);
    const dayKey = date.toDateString();

    if (!acc[dayKey]) acc[dayKey] = [];

    acc[dayKey].push(activity);
    return acc;
  }, {});

 
  return Object.fromEntries(
    Object.entries(groups).sort(
      ([dayA], [dayB]) =>
        new Date(dayB) - new Date(dayA)
    )
  );
};
