// The same sunrise equation the app uses (NOAA), trimmed to what the site needs:
// how long the sun is up on a given day at a given place.

const rad = (degrees: number) => (degrees * Math.PI) / 180;

/** Hours of daylight on `date` (any time that day, UTC) at a latitude and longitude. */
export function dayLength(date: Date, latitude: number, longitude: number): number {
    const julianDay = date.getTime() / 86_400_000 + 2_440_587.5;
    const n = Math.round(julianDay - 2_451_545 + longitude / 360);
    const meanNoon = n - longitude / 360;
    const m = (357.5291 + 0.98560028 * meanNoon) % 360;
    const center = 1.9148 * Math.sin(rad(m)) + 0.02 * Math.sin(rad(2 * m)) + 0.0003 * Math.sin(rad(3 * m));
    const eclipticLongitude = (m + center + 180 + 102.9372) % 360;
    const declination = Math.asin(Math.sin(rad(eclipticLongitude)) * Math.sin(rad(23.4397)));
    const phi = rad(latitude);
    const cosHourAngle = (Math.sin(rad(-0.833)) - Math.sin(phi) * Math.sin(declination)) / (Math.cos(phi) * Math.cos(declination));
    if (cosHourAngle > 1) return 0;
    if (cosHourAngle < -1) return 24;
    return (2 * Math.acos(cosHourAngle) * 180) / Math.PI / 15;
}

/** "10h 43m". */
export function hoursAndMinutes(hours: number): string {
    const minutes = Math.round(hours * 60);
    return `${Math.floor(minutes / 60)}h ${minutes % 60}m`;
}

/** "−3m 32s" or "+2m 13s", from a change in hours. */
export function change(hours: number): string {
    const seconds = Math.round(hours * 3600);
    const sign = seconds > 0 ? '+' : seconds < 0 ? '−' : '±';
    const abs = Math.abs(seconds);
    return abs >= 60 ? `${sign}${Math.floor(abs / 60)}m ${abs % 60}s` : `${sign}${abs}s`;
}
