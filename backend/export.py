import sqlite3
import csv

def export_table(db_name, table_name, csv_name):
    # Kết nối vào database
    conn = sqlite3.connect(db_name)
    cursor = conn.cursor()
    
    # Lấy toàn bộ dữ liệu từ bảng
    cursor.execute(f"SELECT * FROM {table_name}")
    
    # Tạo và ghi ra file CSV
    with open(csv_name, 'w', newline='', encoding='utf-8') as f:
        writer = csv.writer(f)
        writer.writerow([i[0] for i in cursor.description]) # Ghi dòng tiêu đề
        writer.writerows(cursor.fetchall())                 # Ghi toàn bộ dữ liệu
        
    conn.close()
    print(f"Đã xuất thành công: {csv_name}")

# Thực thi hàm cho 2 bảng
export_table('metro_madrid.db', 'Tram', 'Tram.csv')
export_table('metro_madrid.db', 'Ket_Noi', 'Ket_Noi.csv')