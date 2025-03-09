Here’s a **MongoDB (Mongoose) schema** that supports **dynamic fields**, including:  
- **Color-based image changes**  
- **Customizable products with mockup images**  
- **Categories, tags, sizes, and other key properties**  

---

### **Product Schema (Mongoose)**
```javascript
const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  categories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }],
  tags: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tag' }],
  sizes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Size' }],
  colors: [
    {
      colorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Color', required: true },
      images: [{ type: String }] // Different images based on color
    }
  ],
  price: {
    basePrice: { type: Number, required: true },
    discountedPrice: { type: Number },
    currency: { type: String, default: 'USD' }
  },
  inventory: {
    stock: { type: Number, default: 0 },
    lowStockThreshold: { type: Number, default: 5 },
    isInStock: { type: Boolean, default: true }
  },
  customizable: {
    isCustomizable: { type: Boolean, default: false },
    mockupImages: [{ type: String }] // Custom mockup images
  },
  images: [{ type: String }], // General product images
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Product', ProductSchema);
```

---

### **Other Related Schemas**
#### **Category Schema**
```javascript
const CategorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  parentCategory: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', default: null },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Category', CategorySchema);
```

#### **Tag Schema**
```javascript
const TagSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true }
});

module.exports = mongoose.model('Tag', TagSchema);
```

#### **Size Schema**
```javascript
const SizeSchema = new mongoose.Schema({
  label: { type: String, required: true }, // e.g., S, M, L, XL
  value: { type: String } // e.g., Small, Medium, Large
});

module.exports = mongoose.model('Size', SizeSchema);
```

#### **Color Schema**
```javascript
const ColorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  hexCode: { type: String, required: true }
});

module.exports = mongoose.model('Color', ColorSchema);
```

---

### **Key Features of This Schema:**
✅ **Dynamic Color-Based Images** – Each color has its own set of images.  
✅ **Customizable Products** – Admin can upload mockup images.  
✅ **Category, Tag, and Size Management** – Products can belong to multiple categories, tags, and sizes.  
✅ **Stock Management** – Tracks inventory with a low stock threshold.  
✅ **Pricing System** – Supports base and discounted prices.  

Let me know if you need any modifications! 🚀