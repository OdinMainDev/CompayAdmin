import type { JSX } from "react";
  
export const formatTimestampWithTime = (
    timestamp: unknown,
    locale: string = 'en-US'
): JSX.Element => {
  if (timestamp === null || timestamp === undefined) return <span>-</span>;
  
  try {
    let date: Date;
    
    if (typeof timestamp === 'number') {
      date = timestamp < 10000000000 
        ? new Date(timestamp * 1000)
        : new Date(timestamp);
    } else if (typeof timestamp === 'string') {
      const num = Number(timestamp);
      if (!isNaN(num) && timestamp.trim() !== '') {
        date = num < 10000000000 
          ? new Date(num * 1000)
          : new Date(num);
      } else {
        date = new Date(timestamp);
      }
    } else {
      return <span>-</span>;
    }
    
    if (isNaN(date.getTime())) {
      return <span className="text-danger">Invalid date</span>;
    }
    
    return (
      <span title={date.toISOString()}>
        {date.toLocaleDateString(locale)}
        <br />
        <small className="text-muted">
          {date.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' })}
        </small>
      </span>
    );
  } catch (error) {
    return <span className="text-danger">Invalid date</span>;
  }
};