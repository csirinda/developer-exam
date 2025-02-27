# โจทย์

การออกแบบ ER Diagram สำหรับระบบการจัดการสต็อกสินค้า

## รายละเอียด
สมมติว่าคุณกำลังพัฒนาเว็บไซต์ร้านค้าออนไลน์ขนาดใหญ่ ที่ต้องจัดการข้อมูลสินค้า ลูกค้า การสั่งซื้อ และการจัดส่งสินค้า คุณต้องออกแบบโครงสร้างฐานข้อมูลที่เหมาะสมสำหรับระบบนี้ โดยพิจารณาจากความสัมพันธ์ระหว่างข้อมูลต่างๆ และความต้องการในการค้นหาข้อมูลในอนาคต

## ข้อมูลที่ต้องเก็บในระบบ

### ข้อมูลสินค้า
- รหัสสินค้า (Unique Identifier)
- ชื่อสินค้า
- รายละเอียดสินค้า
- ราคา
- หมวดหมู่สินค้า
- ปริมาณในสต็อก

### ข้อมูลลูกค้า
- รหัสลูกค้า (Unique Identifier)
- ชื่อ-นามสกุล
- อีเมล
- ที่อยู่
- เบอร์โทรศัพท์

### ข้อมูลการสั่งซื้อ
- เลขที่ใบสั่งซื้อ (Unique Identifier)
- วันที่สั่งซื้อ
- รหัสลูกค้า
- สถานะการสั่งซื้อ (e.g., Pending, Shipped, Delivered)

### ข้อมูลรายการสั่งซื้อ
- รหัสสินค้า
- เลขที่ใบสั่งซื้อ
- จำนวน

### ข้อมูลการจัดส่ง
- เลขที่จัดส่ง (Unique Identifier)
- เลขที่ใบสั่งซื้อ
- วันที่จัดส่ง
- สถานะการจัดส่ง (e.g., Processing, Shipped, Delivered)

## คำถาม
ออกแบบ ER Diagram แบบ Relational Database ที่เหมาะสมสำหรับระบบนี้ โดยระบุ:
1. ตารางต่างๆ ที่ควรจะมีในฐานข้อมูล
2. ฟิลด์สำคัญในแต่ละตาราง
3. ความสัมพันธ์ระหว่างตารางต่างๆ
4. อธิบายเหตุผลในการออกแบบดังกล่าว
