export const formatHours = (hours: number): string => {
    const absoluteHours = Math.floor(hours);
    const minutes = Math.round((hours - absoluteHours) * 60);
    const hoursStr = absoluteHours > 0 ? `${absoluteHours}h ` : '';
    const minutesStr = minutes > 0 ? `${minutes}m` : '';
  
    return hoursStr + minutesStr;
  };