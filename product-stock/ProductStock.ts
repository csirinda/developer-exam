interface InventoryProduct {
  id: string;
  name: string;
  costPrice: number;
  sellingPrice: number;
  stockQuantity: number;
  category: "A" | "B" | "C";
}

class InventoryManager {
  private products: InventoryProduct[] = [];
  private discountRules: Record<string, number> = {
    A: 0.05,
    B: 0.03,
    C: 0.01,
  };
  private taxRate: number = 0.08;

  constructor(initialProducts: InventoryProduct[]) {
    this.products = initialProducts;
  }

  public addProduct(product: InventoryProduct): void {
    // แก้Bug: ไม่ตรวจสอบว่าสินค้าซ้ำกันหรือไม่
    // ไม่สามารถเพิ่มสินค้า id เดิมได้
    const existingProduct = this.products.find((p) => p.id === product.id);

    if (existingProduct) {
      throw new Error(`Product with ID ${product.id} already exists`);
    }
    this.products.push(product);
  }

  public updateStock(productId: string, newQuantity: number): void {
    const productIndex = this.products.findIndex((p) => p.id === productId);
    if (productIndex === -1) {
      // เช็คกรณีไม่พบข้อมูลสินค้า
      throw new Error(`Product with ID ${productId} not found`);
    }
    if (newQuantity <= 0) {
      // เช็คจำนวนต้องเป็นบวก
      throw new Error("Quantity must be greater than 0");
    }
    this.products[productIndex].stockQuantity = newQuantity;
  }

  // แก้Bug: ไม่ตรวจสอบว่า soldQuantity เกิน stockQuantity หรือไม่
  // แยกฟังก์ชันการตรวจสอบออกมาเลย เพราะมีการใช้งานซ้ำซ้อน
  private validateSale(
    soldQuantity: number,
    productId: string
  ): InventoryProduct {
    const product = this.getProductById(productId);
    if (!product) {
      throw new Error(`Product with ID ${productId} not found`);
    }

    if (soldQuantity <= 0) {
      throw new Error("Sold quantity must be greater than 0");
    }

    if (soldQuantity > product.stockQuantity) {
      throw new Error(
        `Insufficient stock. Available: ${product.stockQuantity}, Requested: ${soldQuantity}`
      );
    }

    return product;
  }
  // แยกฟังก์ชันคำนวณส่วนลดออกมาเลย เพราะมีการใช้งานซ้ำซ้อน
  private calculateDiscountedPrice(product: InventoryProduct): number {
    return product.sellingPrice * (1 - this.getDiscount(product.category));
  }

  public calculateRevenue(soldQuantity: number, productId: string): number {
    // คำนวณรายได้รวมภาษี
    const product = this.validateSale(soldQuantity, productId);
    const discountedPrice = this.calculateDiscountedPrice(product);
    const subtotal = discountedPrice * soldQuantity;
    const taxAmount = subtotal * this.taxRate;
    return subtotal + taxAmount;
  }

  public calculateProfit(soldQuantity: number, productId: string): number {
    // คำนวณกำไรหลังหักต้นทุน
    const product = this.validateSale(soldQuantity, productId);
    const revenue = this.calculateRevenue(soldQuantity, productId);
    const totalCost = product.costPrice * soldQuantity;
    return revenue - totalCost;
  }

  private getProductById(id: string): InventoryProduct | undefined {
    return this.products.find((p) => p.id === id);
  }

  private getDiscount(category: string): number {
    return this.discountRules[category] || 0;
  }

  public restock(productId: string, additionalQuantity: number): void {
    const productIndex = this.products.findIndex((p) => p.id === productId);
    if (productIndex !== -1 && additionalQuantity > 0) {
      // แก้Bug: ไม่ตรวจสอบว่า additionalQuantity เป็นจำนวนเต็มบวกหรือไม่
      this.products[productIndex].stockQuantity += additionalQuantity;
    }
  }

  public getLowStockProducts(threshold: number): InventoryProduct[] {
    return this.products.filter((p) => p.stockQuantity <= threshold);
  }
}

// Usage example
const inventory = new InventoryManager([
  {
    id: "P001",
    name: "Laptop",
    costPrice: 800,
    sellingPrice: 1200,
    stockQuantity: 50,
    category: "A",
  },
  {
    id: "P002",
    name: "Smartphone",
    costPrice: 300,
    sellingPrice: 600,
    stockQuantity: 100,
    category: "B",
  },
]);

inventory.addProduct({
  id: "P003",
  name: "Tablet",
  costPrice: 250,
  sellingPrice: 400,
  stockQuantity: 75,
  category: "C",
});

console.log(inventory.calculateRevenue(5, "P001"));
console.log(inventory.calculateProfit(5, "P001"));

inventory.updateStock("P001", 40);
console.log(inventory.getLowStockProducts(50));

inventory.restock("P002", 20);
console.log(inventory.getLowStockProducts(50));