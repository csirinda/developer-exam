จาก Class ShoppingCart นี้จงค้นหาและอธิบาย Bug ที่เกิดขึ้นอย่างละเอียด และให้ทำการแก้ไขโค๊ดในส่วนที่เป็น Bug ภายใน class นี้ให้ทำงานให้ถูกต้องนี้

1. ชื่อ type Product ซ้ำกับ ไฟล์ productStock การแก้ไข: เปลี่ยนชื่อ interface ใน productStock เพื่อให้สื่อความหมายชัดเจน

2. การเรียกใช้ addItem เรียกใช้ผิดวิธี เพราะ addItem(item: Product, quantity: number) ต้องการ 2 พารามิเตอร์ คือ item,quantity ส่วนitemที่อ้างอิง type จาก Product เก็บข้อมูล3อย่าง ได้แก่ id,name,price การแก้ไข:cart.addItem({ id: '1', name: 'Laptop', price: 999.99, quantity: 1 }); => cart.addItem({ id: "1", name: "Laptop", price: 999.99 }, 1);

3.Method addItem ไม่มีการจัดการกับค่าติดลบของราคาและจำนวน ซึ่งจะทำให้การคำนวณเกิดค่าติดลบได้ การแก้ไข:เพิ่มการตรวจสอบ quantity>0, price >0 หากพบให้แสดง error และหยุดการทำงาน ดังนี้ 

 public addItem(item: Product, quantity: number): void {
    if (quantity <= 0) {
      throw new Error("Quantity must be greater than 0");
    }
    if (item.price < 0) {
      throw new Error("Price cannot be negative");
    }

    const existingItemIndex = this.items.findIndex((i) => i.id === item.id);
    if (existingItemIndex !== -1) {
      this.items[existingItemIndex].quantity += quantity;
    } else {
      this.items.push({ ...item, quantity });
    }
  }

4.Method removeItem ไม่มีการจัดการกรณีใส่ id ที่ไม่อยู่ในระบบ ทำให้ระบบไม่รู้ได้ว่าเกิดข้อผิดพลาด การแก้ไข: เพิ่ม Error Handling กรณีไม่พบสินค้าที่จะลบ ดังนี้

public removeItem(itemId: string): void {
    const initialLength = this.items.length;
    this.items = this.items.filter((item) => item.id !== itemId);
    //ตรวจสอบว่ามีการลบสินค้าจริงหรือไม่
    if (this.items.length === initialLength) {
      throw new Error(`Item with ID ${itemId} not found`);
    }
  }


5.ในการใช้งาน ShoppingCart เมื่อเพิ่มสินค้าเข้าตระกร้าแล้ว นอกจากการลบสินค้าออก ผู้ใช้งานจะต้องสามารถเพิ่มและลด จำนวนสินค้าด้วย การแก้ไข: เพิ่ม Method updateQuantity ที่สามารถเพิ่ม-ลด และ เรียกใช้removeItemเพื่อเอาสินค้าออกได้ ดังนี้ 

public updateQuantity(itemId: string, quantity: number): void {
    if (quantity <= 0) {
      this.removeItem(itemId);
      return;
    }

    const item = this.items.find((i) => i.id === itemId);
    if (!item) {
      throw new Error(`Item with ID ${itemId} not found`);
    }
    item.quantity = quantity;
  }

6.ควรมีการคำนวณราคาส่วนลดของสินค้าแต่ละชิ้นสินค้าแต่ละชิ้น กรณีแต่ละชิ้นมีส่วนลดไม่เท่ากัน ก่อนไปคำนวณราคารวม การแก้ไข: เพิ่ม Method calculateItemDiscount ดังนี้

private calculateItemDiscount(item: CartItem): number {
    return item.discount ? item.price * (item.discount / 100) : 0;
  }


7.calculateSubtotal เนื่องจากมีการปรับโครงสร้าง โดยการเพิ่ม discount จึงต้องเรียกใช้ calculateItemDiscount เพื่อคำนวณราคาของสินค้าแต่ละชนิด ก่อนจะคำนวณราคารวม การแก้ไข : เพิ่มการคำนวณกรณีมีส่วนลด ดังนี้

 public calculateSubtotal(): number {
    return this.items.reduce((sum, item) => {
      const discount = this.calculateItemDiscount(item);
      const discountedPrice = item.price - discount;
      return sum + discountedPrice * item.quantity;
    }, 0);
  }

8. Method  applyDiscount ไม่มีการจัดการในกรณี ค่าinput ติดลบ หรือ มากกว่า 100 ทำให้การคำนวณเกิดข้อผิดพลาดได้ การแก้ไข : ตรวจสอบ input ดังนี้
   
public applyDiscount(discountPercentage: number): void {
    if (discountPercentage < 0 || discountPercentage > 100) {
      throw new Error("Discount must be between 0 and 100");
    }
    this.items.forEach((item) => {
      item.discount = discountPercentage;
    });
  }  

9.  Method  applyDiscount ควรเก็บข้อมูล ราคาจริง และ ส่วนลดแยกจากกัน เพื่อให้โค้ดสามารถนำไปใช้ต่อได้ง่าย เช่น หากต้องการเปลี่ยนแปลงส่วนลดในภายหลัง ก็สามารถทำได้โดยไม่กระทบต่อราคาเดิมของสินค้า การแก้ไข: เพิ่มฟิลด์ discount ลงใน ใน CartItem interface ดังนี้
   
interface CartItem extends Product {
  quantity: number;
  discount?: number; // ถ้ามีส่วนลด เก็บส่วนลดเป็น %
} หมายเหตุ: การแก้ไขโครงงสร้างนี้ อาจส่งผลกระทบต่อการทำงานของระบบในภาพรวม และอาจต้องมีการปรับปรุงส่วนอื่นๆ เพิ่ม

10.  Method calculateTotal ใช้ Math.floor() เพื่อปัดเศษลง วิธีนี้อาจทำให้เกิดความไม่แม่นยำในการคำนวณ เนื่องจากการปัดเศษลงทุกครั้งอาจทำให้ยอดรวมต่ำกว่าความเป็นจริง การแก้ไข :ใช้ toFixed() และแปลงกลับเป็นตัวเลข ดังนี้

public calculateTotal(): number {
    const subtotal = this.calculateSubtotal();
    const tax = this.calculateTax(subtotal);

    // ใช้ toFixed() และแปลงกลับเป็นตัวเลข
    return Number((subtotal + tax).toFixed(2));
  }
