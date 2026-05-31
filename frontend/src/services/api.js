export const getStations = async () => {
    try {
        const response = await fetch(`http://localhost:3000/api/stations`);
        const data = await response.json();
        
        // MÁY PHIÊN DỊCH: Đổi tên biến từ Database sang chuẩn của Frontend
        return data.map(station => ({
            id: station.node_id,           // Đổi node_id thành id
            name: station.stop_name,       // Đổi stop_name thành name
            lat: station.stop_lat,         // Đổi stop_lat thành lat
            lon: station.stop_lon,         // Đổi stop_lon thành lon
            status: station.status
        }));
    } catch (error) {
        console.error("Lỗi getStations:", error);
        return [];
    }
};

export const getRoute = async (start, end, mode, time) => {
    try {
        // Lần này là Backtick xịn 100% để biến tự động nội suy thành số
        const response = await fetch(`http://localhost:3000/api/routing?start=${start}&end=${end}&mode=${mode}&time=${time}`);
        const data = await response.json();
        return data;
    } catch (error) {
        return { status: "error", message: error.message };
    }
};