export const getStations = async () => {
    try {
        const response = await fetch(`http://localhost:3000/api/stations`);
        return await response.json();
    } catch (error) {
        return [];
    }
};

export const getRoute = async (start, end, mode) => {
    try {
        const response = await fetch(`http://localhost:3000/api/routing?start=${start}&end=${end}&mode=${mode}`);
        const data = await response.json();
        return data;
    } catch (error) {
        return { status: "error", message: error.message };
    }
};