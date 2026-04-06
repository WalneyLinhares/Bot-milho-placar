export function canRun(lastUpdate, diaAlvo = 4, force = false) {

    if (force) return true;

    const now = new Date();

    if (now.getUTCDate() < diaAlvo) return false;

    if (!lastUpdate) return true;

    const last = new Date(lastUpdate);

    if (isNaN(last.getTime())) return true;

    return !(
        last.getUTCMonth() === now.getUTCMonth() &&
        last.getUTCFullYear() === now.getUTCFullYear()
    );
}