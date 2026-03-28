// Helper to parse "30 mins" or "1 hour" into numeric minutes
export const parseDurationInMinutes = (durationStr: string): number => {
  const num = parseInt(durationStr.match(/\d+/)?.at(0) || "30");
  if (durationStr.toLowerCase().includes("hour") || durationStr.toLowerCase().includes("hr")) {
    return num * 60;
  }
  return num;
};

// Helper to format Date into 12-hour string (e.g., 5:30 PM)
export const formatTime = (date: Date): string => {
  return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true });
};

// Calculate a full schedule for an event's today_tasks
export const calculateEventSchedule = (event: any) => {
  if (!event.plan || !event.plan.today_tasks) return [];

  // Use the stored generatedAt as a persistent scheduling anchor
  // Fallback to Now only if it's a legacy plan without the timestamp
  let cumulativeTime = event.plan.generatedAt ? new Date(event.plan.generatedAt) : new Date();
  
  const completedIds = event.completedTasks || [];
  
  return event.plan.today_tasks.map((task: any, i: number) => {
    const taskId = `task-${event.id}-${i}`;
    const duration = parseDurationInMinutes(task.estimated_time);
    const startTime = new Date(cumulativeTime.getTime());
    const endTime = new Date(startTime.getTime() + duration * 60000);
    
    const timeSlotStr = `${formatTime(startTime)} – ${formatTime(endTime)}`;
    cumulativeTime = endTime;

    return {
      ...task,
      id: taskId,
      eventId: event.id,
      eventName: event.name,
      isCompleted: completedIds.includes(taskId),
      startTime: formatTime(startTime),
      endTime: formatTime(endTime),
      timeSlot: timeSlotStr,
    };
  });
};
