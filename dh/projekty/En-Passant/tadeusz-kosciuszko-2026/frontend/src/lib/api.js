export async function getData(endpoint) {
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}${endpoint}`);
    if (!response.ok) throw new Error('Błąd API');
    return await response.json();
}