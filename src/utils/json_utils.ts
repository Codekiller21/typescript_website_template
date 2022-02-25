/**
 * Parses a json fetch request to a specific type
 * Note: Will not check types and will not have functions
 * @param url Url to fetch
 * @returns The json object as that type
 */
export async function fetchJson<T>(url: string): Promise<T> {
    const r = await fetch(url);
    if (!r.ok) {
        throw r.statusText;
    }
    return (await r.json()) as T;
}

export function parseJson<T>(obj: string): T {
    return JSON.parse(obj) as T;
}
