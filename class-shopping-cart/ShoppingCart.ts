//คำอธิบาย Bug ที่เกิดขึ้นและการแก้ไข อยู่ใน file DESCRIPTION.md
interface Product {
  id: string;
  name: string;
  price: number;
}

//เพิ่มฟิลด์ discount
interface CartItem extends Product {
  quantity: number;
  discount?: number; // ถ้ามี เก็บส่วนลดเป็น %
}

class ShoppingCart {
  private items: CartItem[] = [];
  private taxRate: number = 0.07;

  // เพิ่มการตรวจสอบ quantity>0, price >0
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

  //เพิ่ม Method สำหรับการเพิ่ม-ลด-ลบ จำนวนสินค้า(quantity)ในตะกร้า
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

  // เพิ่ม Error Handling กรณีไม่พบสินค้าที่จะลบ
  public removeItem(itemId: string): void {
    const initialLength = this.items.length;
    this.items = this.items.filter((item) => item.id !== itemId);
    //ตรวจสอบว่ามีการลบสินค้าจริงหรือไม่
    if (this.items.length === initialLength) {
      throw new Error(`Item with ID ${itemId} not found`);
    }
  }

  //เพิ่มการคำนวณส่วนลดของสินค้าแต่ละชิ้น
  private calculateItemDiscount(item: CartItem): number {
    return item.discount ? item.price * (item.discount / 100) : 0;
  }

  //เพิ่มการคำนวณกรณีมีส่วนลด
  public calculateSubtotal(): number {
    return this.items.reduce((sum, item) => {
      const discount = this.calculateItemDiscount(item);
      const discountedPrice = item.price - discount;
      return sum + discountedPrice * item.quantity;
    }, 0);
  }

  public calculateTax(subtotal: number): number {
    return subtotal * this.taxRate;
  }

  public calculateTotal(): number {
    const subtotal = this.calculateSubtotal();
    const tax = this.calculateTax(subtotal);

    // ใช้ toFixed() และแปลงกลับเป็นตัวเลข
    return Number((subtotal + tax).toFixed(2));
  }

  public getCartSummary(): string {
    // เพิ่มการตรวจสอบตะกร้าว่าง
    if (this.items.length === 0) {
      return "Cart is empty";
    }
    const subtotal = this.calculateSubtotal();
    const tax = this.calculateTax(subtotal);
    const total = this.calculateTotal();

    return `Subtotal: $${subtotal.toFixed(2)}, Tax: $${tax.toFixed(
      2
    )}, Total: $${total.toFixed(2)}`;
  }

  // ตรวจสอบ input, เก็บ discount แยก
  public applyDiscount(discountPercentage: number): void {
    if (discountPercentage < 0 || discountPercentage > 100) {
      throw new Error("Discount must be between 0 and 100");
    }
    this.items.forEach((item) => {
      item.discount = discountPercentage;
    });
  }  
}

// Usage example
const cart = new ShoppingCart();

cart.addItem({ id: "1", name: "Laptop", price: 999.99 }, 1);
cart.addItem({ id: "2", name: "T-Shirt", price: 19.99 }, 2);
console.log(cart);

console.log(cart.getCartSummary());

cart.applyDiscount(10); // Apply 10% discount
console.log(cart.getCartSummary());