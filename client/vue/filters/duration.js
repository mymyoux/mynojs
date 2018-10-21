import moment from 'moment';
import momentDurationFormatSetup from 'moment-duration-format';

export function duration(milliseconds)
{
    if (milliseconds <= 60000)
    {
        return moment.duration(milliseconds/1000 | 0, "seconds").format("hh.:mm:ss [s]");
    }
    else if (milliseconds <= 60000*60)
    {
        return moment.duration(milliseconds/1000 | 0, "seconds").format("hh.:mm:ss [m]");
    }
    else if (milliseconds <= 60000*60*24)
    {
        return moment.duration(milliseconds/1000 | 0, "seconds").format("hh.:mm:ss [h]");
    }
    else 
    {
      return moment.duration(milliseconds/1000 | 0, "seconds").format();
    }
}
