import { Client, ClientStatus, Store, StoreStatus, Marketplace, InventoryItem, Order, OrderStatus, ReturnOrder, OperationNotification, SyncLog, Seller, SellerStatus } from "./types";

export const initialClients: Client[] = [
  {
    id: "CL-001",
    name: "Rajesh Kumar",
    businessName: "Aura Essentials",
    phone: "+91 98765 43210",
    email: "rajesh@auraessentials.com",
    gstNumber: "27AAAAA1111A1Z1",
    address: "Bandit Colony, MG Road",
    city: "Mumbai",
    state: "Maharashtra",
    pincode: "400001",
    agreementDate: "2025-01-15",
    status: ClientStatus.Active,
  },
  {
    id: "CL-002",
    name: "Ananya Sharma",
    businessName: "EcoThreads Apparel",
    phone: "+91 87654 32109",
    email: "ananya@ecothreads.in",
    gstNumber: "07BBBBB2222B2Z2",
    address: "Connaught Place, Block E",
    city: "New Delhi",
    state: "Delhi",
    pincode: "110001",
    agreementDate: "2025-02-10",
    status: ClientStatus.Active,
  },
  {
    id: "CL-003",
    name: "Vikram Reddy",
    businessName: "Reddy Electronics",
    phone: "+91 76543 21098",
    email: "contact@reddyelectronics.com",
    gstNumber: "36CCCCC3333C3Z3",
    address: "Madhapur, HITEC City",
    city: "Hyderabad",
    state: "Telangana",
    pincode: "500081",
    agreementDate: "2024-11-05",
    status: ClientStatus.Active,
  },
  {
    id: "CL-004",
    name: "Siddharth Bose",
    businessName: "Calcutta Culinary spices",
    phone: "+91 65432 10987",
    email: "sid@calcuttaculinary.co.in",
    gstNumber: "19DDDDD4444D4Z4",
    address: "Park Street, Flat 4B",
    city: "Kolkata",
    state: "West Bengal",
    pincode: "700016",
    agreementDate: "2025-03-01",
    status: ClientStatus.Inactive,
  },
  {
    id: "CL-005",
    name: "Meera Patel",
    businessName: "Nurture Organics",
    phone: "+91 99887 76655",
    email: "meera@nurtureorganics.org",
    gstNumber: "24EEEEE5555E5Z5",
    address: "C.G. Road, Navrangpura",
    city: "Ahmedabad",
    state: "Gujarat",
    pincode: "380009",
    agreementDate: "2024-09-18",
    status: ClientStatus.Active,
  },
  {
    id: "CL-006",
    name: "Aditya Nair",
    businessName: "SoleMates Footwear",
    phone: "+91 91234 56789",
    email: "aditya@solemates.co",
    gstNumber: "32FFFFF6666F6Z6",
    address: "M.G. Road, Ernakulam",
    city: "Kochi",
    state: "Kerala",
    pincode: "682011",
    agreementDate: "2025-04-12",
    status: ClientStatus.Suspended,
  },
  {
    id: "CL-007",
    name: "Karan Johar",
    businessName: "BollyGlam Boutique",
    phone: "+91 92345 67890",
    email: "karan@bollyglam.com",
    gstNumber: "27GGGGG7777G7Z7",
    address: "Andheri West, Link Road",
    city: "Mumbai",
    state: "Maharashtra",
    pincode: "400053",
    agreementDate: "2025-05-01",
    status: ClientStatus.Active,
  }
];

export const initialStores: Store[] = [
  {
    id: "ST-101",
    storeName: "Aura Essentials Amazon",
    clientName: "Aura Essentials",
    marketplace: "Amazon",
    storeId: "AZ-AURA-ESS-99",
    launchDate: "2025-01-20",
    status: StoreStatus.Active,
    performanceScore: 92,
  },
  {
    id: "ST-102",
    storeName: "Aura Essentials Shopify",
    clientName: "Aura Essentials",
    marketplace: "Shopify",
    storeId: "SH-AURA-E",
    launchDate: "2025-01-25",
    status: StoreStatus.Active,
    performanceScore: 88,
  },
  {
    id: "ST-103",
    storeName: "EcoThreads Flipkart",
    clientName: "EcoThreads Apparel",
    marketplace: "Flipkart",
    storeId: "FK-ECO-THREADS-01",
    launchDate: "2025-02-15",
    status: StoreStatus.Active,
    performanceScore: 78,
  },
  {
    id: "ST-104",
    storeName: "Reddy Electronics Amazon",
    clientName: "Reddy Electronics",
    marketplace: "Amazon",
    storeId: "AZ-REDDY-ELEC",
    launchDate: "2024-11-15",
    status: StoreStatus.Active,
    performanceScore: 95,
  },
  {
    id: "ST-105",
    storeName: "Nurture Organics Shopify",
    clientName: "Nurture Organics",
    marketplace: "Shopify",
    storeId: "SH-NURTURE-ORG",
    launchDate: "2024-10-01",
    status: StoreStatus.Active,
    performanceScore: 84,
  },
  {
    id: "ST-106",
    storeName: "Calcutta Culinary eBay",
    clientName: "Calcutta Culinary spices",
    marketplace: "eBay",
    storeId: "EB-CALCUTTA-CUL",
    launchDate: "2025-03-05",
    status: StoreStatus.Inactive,
    performanceScore: 50,
  },
  {
    id: "ST-107",
    storeName: "SoleMates Myntra",
    clientName: "SoleMates Footwear",
    marketplace: "Myntra",
    storeId: "MYN-SOLEMATES",
    launchDate: "2025-04-15",
    status: StoreStatus.Suspended,
    performanceScore: 42,
  },
  {
    id: "ST-108",
    storeName: "BollyGlam Nykaa Fashion",
    clientName: "BollyGlam Boutique",
    marketplace: "Nykaa",
    storeId: "NY-BOLLYGLAM",
    launchDate: "2025-05-10",
    status: StoreStatus.UnderReview,
    performanceScore: 71,
  }
];

export const initialMarketplaces: Marketplace[] = [
  {
    name: "Amazon",
    storeLinked: 42,
    loginStatus: "Connected",
    lastSync: "2 mins ago",
    healthScore: 98,
    revenue: 425000,
    orderVolume: 2450,
  },
  {
    name: "Shopify",
    storeLinked: 58,
    loginStatus: "Connected",
    lastSync: "1 min ago",
    healthScore: 99,
    revenue: 350000,
    orderVolume: 1890,
  },
  {
    name: "Flipkart",
    storeLinked: 25,
    loginStatus: "Connected",
    lastSync: "10 mins ago",
    healthScore: 94,
    revenue: 215000,
    orderVolume: 1120,
  },
  {
    name: "Myntra",
    storeLinked: 12,
    loginStatus: "Re-auth Required",
    lastSync: "2 hours ago",
    healthScore: 85,
    revenue: 120000,
    orderVolume: 580,
  },
  {
    name: "eBay",
    storeLinked: 8,
    loginStatus: "Connected",
    lastSync: "45 mins ago",
    healthScore: 92,
    revenue: 45000,
    orderVolume: 310,
  },
  {
    name: "Nykaa",
    storeLinked: 15,
    loginStatus: "Connected",
    lastSync: "5 mins ago",
    healthScore: 96,
    revenue: 185000,
    orderVolume: 920,
  }
];

export const initialInventory: InventoryItem[] = [
  {
    sku: "AURA-FE-01",
    productName: "Organic Lavender Facial Serum (30ml)",
    category: "Beauty & Cosmetics",
    storeName: "Aura Essentials Amazon",
    currentStock: 450,
    reservedStock: 35,
    availableStock: 415,
    costPrice: 280,
    sellingPrice: 899,
    inventoryValue: 126000,
  },
  {
    sku: "AURA-FE-02",
    productName: "De-Tan Tea Tree Tonic (100ml)",
    category: "Beauty & Cosmetics",
    storeName: "Aura Essentials Shopify",
    currentStock: 18,
    reservedStock: 4,
    availableStock: 14,
    costPrice: 120,
    sellingPrice: 450,
    inventoryValue: 2160,
  },
  {
    sku: "ECO-TE-M1",
    productName: "Bamboo Fiber Men's Tee L - Green",
    category: "Apparel & Fashion",
    storeName: "EcoThreads Flipkart",
    currentStock: 120,
    reservedStock: 25,
    availableStock: 95,
    costPrice: 310,
    sellingPrice: 999,
    inventoryValue: 37200,
  },
  {
    sku: "RED-HP-001",
    productName: "ActiveNoise ANC Wireless Headphones",
    category: "Consumer Electronics",
    storeName: "Reddy Electronics Amazon",
    currentStock: 80,
    reservedStock: 12,
    availableStock: 68,
    costPrice: 1800,
    sellingPrice: 4999,
    inventoryValue: 144000,
  },
  {
    sku: "RED-CB-92",
    productName: "Reddy USB-C Power Adapter (65W)",
    category: "Consumer Electronics",
    storeName: "Reddy Electronics Amazon",
    currentStock: 4,
    reservedStock: 0,
    availableStock: 4,
    costPrice: 450,
    sellingPrice: 1299,
    inventoryValue: 1800,
  },
  {
    sku: "NUR-HON-50",
    productName: "Raw Wildflower Honey (500g Glass)",
    category: "Food & Groceries",
    storeName: "Nurture Organics Shopify",
    currentStock: 210,
    reservedStock: 40,
    availableStock: 170,
    costPrice: 140,
    sellingPrice: 399,
    inventoryValue: 29400,
  },
  {
    sku: "NUR-ALM-1K",
    productName: "Premium California Almonds (1kg Pack)",
    category: "Food & Groceries",
    storeName: "Nurture Organics Shopify",
    currentStock: 0,
    reservedStock: 0,
    availableStock: 0,
    costPrice: 450,
    sellingPrice: 1099,
    inventoryValue: 0,
  },
  {
    sku: "CUL-GAR-01",
    productName: "Calcutta Signature Garam Masala (100g)",
    category: "Food & Groceries",
    storeName: "Calcutta Culinary eBay",
    currentStock: 85,
    reservedStock: 2,
    availableStock: 83,
    costPrice: 45,
    sellingPrice: 180,
    inventoryValue: 3825,
  }
];

export const initialOrders: Order[] = [
  {
    id: "ORD-99301",
    orderDate: "2026-06-17",
    customerName: "Sanjay Singhania",
    product: "Organic Lavender Facial Serum",
    quantity: 1,
    marketplace: "Amazon",
    store: "Aura Essentials Amazon",
    status: OrderStatus.New,
    courier: "Delhivery",
    trackingNumber: "TRK-90081122",
    revenue: 899,
  },
  {
    id: "ORD-99302",
    orderDate: "2026-06-17",
    customerName: "Pooja Hegde",
    product: "Bamboo Fiber Men's Tee L - Green",
    quantity: 2,
    marketplace: "Flipkart",
    store: "EcoThreads Flipkart",
    status: OrderStatus.Processing,
    courier: "BlueDart",
    trackingNumber: "TRK-22334411",
    revenue: 1998,
  },
  {
    id: "ORD-99303",
    orderDate: "2026-06-16",
    customerName: "Rohan Mehra",
    product: "ActiveNoise ANC Wireless Headphones",
    quantity: 1,
    marketplace: "Amazon",
    store: "Reddy Electronics Amazon",
    status: OrderStatus.Packed,
    courier: "Amazon Logistics",
    trackingNumber: "AMZ-998811",
    revenue: 4999,
  },
  {
    id: "ORD-99304",
    orderDate: "2026-06-15",
    customerName: "Nisha Patel",
    product: "Raw Wildflower Honey",
    quantity: 3,
    marketplace: "Shopify",
    store: "Nurture Organics Shopify",
    status: OrderStatus.Shipped,
    courier: "XpressBees",
    trackingNumber: "XPB-556677",
    revenue: 1197,
  },
  {
    id: "ORD-99305",
    orderDate: "2026-06-14",
    customerName: "Vikram Malhotra",
    product: "De-Tan Tea Tree Tonic (100ml)",
    quantity: 1,
    marketplace: "Shopify",
    store: "Aura Essentials Shopify",
    status: OrderStatus.Delivered,
    courier: "Delhivery",
    trackingNumber: "DLH-778899",
    revenue: 450,
  },
  {
    id: "ORD-99306",
    orderDate: "2026-06-13",
    customerName: "Amit Shah",
    product: "Organic Lavender Facial Serum",
    quantity: 1,
    marketplace: "Amazon",
    store: "Aura Essentials Amazon",
    status: OrderStatus.Cancelled,
    courier: "Delhivery",
    trackingNumber: "DLH-112233",
    revenue: 899,
  },
  {
    id: "ORD-99307",
    orderDate: "2026-06-12",
    customerName: "Sunita Roy",
    product: "Bamboo Fiber Men's Tee L - Green",
    quantity: 1,
    marketplace: "Flipkart",
    store: "EcoThreads Flipkart",
    status: OrderStatus.Returned,
    courier: "Shadowfax",
    trackingNumber: "SFX-554433",
    revenue: 999,
  },
  {
    id: "ORD-99308",
    orderDate: "2026-06-11",
    customerName: "Rahul Dravid",
    product: "ActiveNoise ANC Wireless Headphones",
    quantity: 1,
    marketplace: "Amazon",
    store: "Reddy Electronics Amazon",
    status: OrderStatus.RTO,
    courier: "Delhivery",
    trackingNumber: "DLH-445566",
    revenue: 4999,
  },
  {
    id: "ORD-99309",
    orderDate: "2026-06-16",
    customerName: "Kriti Sanon",
    product: "Organic Lavender Facial Serum",
    quantity: 2,
    marketplace: "Amazon",
    store: "Aura Essentials Amazon",
    status: OrderStatus.Delivered,
    courier: "Amazon Logistics",
    trackingNumber: "AMZ-882211",
    revenue: 1798,
  },
  {
    id: "ORD-99310",
    orderDate: "2026-06-15",
    customerName: "Dhruv Rathee",
    product: "Reddy USB-C Power Adapter (65W)",
    quantity: 1,
    marketplace: "Amazon",
    store: "Reddy Electronics Amazon",
    status: OrderStatus.Delivered,
    courier: "Delhivery",
    trackingNumber: "DLH-229988",
    revenue: 1299,
  }
];

export const initialReturns: ReturnOrder[] = [
  {
    id: "RET-801",
    orderId: "ORD-99307",
    storeName: "EcoThreads Flipkart",
    marketplace: "Flipkart",
    productName: "Bamboo Fiber Men's Tee L - Green",
    returnReason: "Size discrepancy - Too small",
    type: "Return",
    refundStatus: "Refunded",
    date: "2026-06-15",
  },
  {
    id: "RET-802",
    orderId: "ORD-99308",
    storeName: "Reddy Electronics Amazon",
    marketplace: "Amazon",
    productName: "ActiveNoise ANC Wireless Headphones",
    returnReason: "Customer unavailable - Multiple attempts failed",
    type: "RTO",
    refundStatus: "Pending",
    date: "2026-06-14",
  }
];

export const initialNotifications: OperationNotification[] = [
  {
    id: "NT-001",
    type: "Low Stock",
    message: "De-Tan Tea Tree Tonic (100ml) is low in stock (14 units available in Aura Essentials Shopify).",
    timestamp: "10 mins ago",
    read: false,
    severity: "warning",
  },
  {
    id: "NT-002",
    type: "Delayed Order",
    message: "Order ORD-99304 has exceeded packing SLA. Outstanding for 48+ hours.",
    timestamp: "42 mins ago",
    read: false,
    severity: "warning",
  },
  {
    id: "NT-003",
    type: "Store Suspension",
    message: "SoleMates Myntra store ST-107 has been flagged for suspension due to delivery delays.",
    timestamp: "3 hours ago",
    read: true,
    severity: "critical",
  },
  {
    id: "NT-004",
    type: "Failed Sync",
    message: "Google Sheets OAuth sync failed for Inventory ledger: Request rate limits exceeded.",
    timestamp: "1 day ago",
    read: true,
    severity: "critical",
  }
];

export const initialSyncLogs: SyncLog[] = [
  {
    id: "LOG-001",
    timestamp: "2026-06-17 07:15:22",
    type: "Google Sheets",
    sheetName: "Orders Ledger",
    status: "Success",
    recordsProcessed: 142,
    details: "Successfully fully-synchronized dynamic columns into Postgres Core.",
    errorCount: 0,
  },
  {
    id: "LOG-002",
    timestamp: "2026-06-17 07:10:00",
    type: "API Webhook",
    status: "Success",
    recordsProcessed: 18,
    details: "Amazon Order Dispatch event trigger.",
    errorCount: 0,
  },
  {
    id: "LOG-003",
    timestamp: "2026-06-16 23:45:10",
    type: "Google Sheets",
    sheetName: "Inventory Master",
    status: "Failed",
    recordsProcessed: 0,
    details: "Read Permission Denied. Check Google Services account credentials.",
    errorCount: 1,
  },
  {
    id: "LOG-004",
    timestamp: "2026-06-16 18:30:00",
    type: "REST Client",
    status: "Retrying",
    recordsProcessed: 0,
    details: "Sync partial queue. Failed connection attempt 2 of 5. Hub connection timed out.",
    errorCount: 12,
  }
];

// Seed Sellers state List
export const initialSellers: Seller[] = [
  {
    id: "SEL-001",
    sellerName: "Aura Retail Ventures",
    companyName: "Aura Essentials",
    email: "retail@auraessentials.com",
    phone: "+91 98765 00000",
    status: SellerStatus.Active,
    joinedDate: "2025-01-15",
    storeCount: 2
  },
  {
    id: "SEL-002",
    sellerName: "EcoThreads Trade",
    companyName: "EcoThreads Apparel",
    email: "trade@ecothreads.in",
    phone: "+91 87654 00000",
    status: SellerStatus.Active,
    joinedDate: "2025-02-10",
    storeCount: 1
  }
];

// Seed to complete 100 Clients
const firstNames = ["Rajesh", "Ananya", "Vikram", "Siddharth", "Meera", "Aditya", "Karan", "Pooja", "Arjun", "Neha", "Rohan", "Sunita", "Amit", "Kriti", "Rahul", "Preeti", "Sanjay", "Deepika", "Kunal", "Sneha"];
const lastNames = ["Kumar", "Sharma", "Reddy", "Bose", "Patel", "Nair", "Johar", "Gupta", "Mehta", "Singh", "Roy", "Malhotra", "Sen", "Verma", "Joshi", "Iyer", "Chawla", "Das", "Rao", "Bhasin"];
const cities = ["Mumbai", "New Delhi", "Hyderabad", "Kolkata", "Ahmedabad", "Kochi", "Bangalore", "Chennai", "Pune", "Jaipur"];
const states = ["Maharashtra", "Delhi", "Telangana", "West Bengal", "Gujarat", "Kerala", "Karnataka", "Tamil Nadu", "Maharashtra", "Rajasthan"];
const categories = ["Beauty & Cosmetics", "Apparel & Fashion", "Consumer Electronics", "Food & Groceries", "Home & Kitchen", "Fitness & Sports"];

while (initialClients.length < 100) {
  const i = initialClients.length + 1;
  const fName = firstNames[i % firstNames.length];
  const lName = lastNames[i % lastNames.length];
  const bName = `${fName} ${lName} Corp`;
  initialClients.push({
    id: `CL-${String(i).padStart(3, '0')}`,
    name: `${fName} ${lName}`,
    businessName: bName,
    phone: `+91 ${7000000000 + (i * 57211) % 299999999}`,
    email: `${fName.toLowerCase()}.${lName.toLowerCase()}${i}@example.com`,
    gstNumber: `${String((i * 17) % 35 + 1).padStart(2, '0')}AAAAA${1000 + i}A1Z1`,
    address: `${20 + i}, Commercial Block, Sector ${i % 15 + 1}`,
    city: cities[i % cities.length],
    state: states[i % states.length],
    pincode: String(400000 + (i * 123) % 9999),
    agreementDate: `2025-01-${String((i % 28) + 1).padStart(2, '0')}`,
    status: i % 15 === 0 ? ClientStatus.Suspended : (i % 12 === 0 ? ClientStatus.Inactive : ClientStatus.Active)
  });
}

// Seed to complete 150 Sellers
while (initialSellers.length < 150) {
  const i = initialSellers.length + 1;
  const clientRef = initialClients[i % initialClients.length];
  initialSellers.push({
    id: `SEL-${String(i).padStart(3, '0')}`,
    sellerName: `${clientRef.businessName} Seller Node`,
    companyName: clientRef.businessName,
    email: `seller.${clientRef.email.split('@')[0]}@ops-node.com`,
    phone: clientRef.phone,
    status: i % 18 === 0 ? SellerStatus.Suspended : (i % 22 === 0 ? SellerStatus.Pending : SellerStatus.Active),
    joinedDate: clientRef.agreementDate,
    storeCount: Math.floor(i * 3) % 4 + 1
  });
}

// Seed to complete 300 Stores
const marketplacesList = ["Amazon", "Shopify", "Flipkart", "Myntra", "eBay", "Nykaa"];
while (initialStores.length < 300) {
  const i = initialStores.length + 1;
  const clientRef = initialClients[i % initialClients.length];
  const market = marketplacesList[i % marketplacesList.length];
  initialStores.push({
    id: `ST-${100 + i}`,
    storeName: `${clientRef.businessName} ${market} Store`,
    clientName: clientRef.businessName,
    marketplace: market,
    storeId: `${market.substring(0,2).toUpperCase()}-${clientRef.businessName.substring(0,4).toUpperCase()}-${i}`,
    launchDate: clientRef.agreementDate,
    status: i % 25 === 0 ? StoreStatus.Suspended : (i % 20 === 0 ? StoreStatus.Inactive : StoreStatus.Active),
    performanceScore: 60 + (i * 13) % 41
  });
}

// Seed to complete 1000 items in Inventory
const productPrefixes = ["Organic", "Premium", "Direct-source", "Eco-friendly", "Handcrafted", "Smart-core", "Ultra-light", "Signature", "Classic", "Deluxe"];
const productNouns = ["Face Wash", "Linen Shirt", "Blender 3000", "Spiced Chai Pack", "Running Shoes", "Wireless Mouse", "Soy Candle", "Dri-fit Tee", "Protein Bar", "Moisturizer Cream"];
while (initialInventory.length < 1000) {
  const i = initialInventory.length + 1;
  const pref = productPrefixes[i % productPrefixes.length];
  const noun = productNouns[i % productNouns.length];
  const prodName = `${pref} ${noun} (v${i % 5 + 1})`;
  const cost = 50 + (i * 17) % 500;
  const sell = Math.round(cost * (1.5 + (i % 3) * 0.4));
  const currentStock = (i % 35 === 0) ? 0 : ((i % 12 === 0) ? Math.floor(Math.random() * 8) + 1 : 50 + (i * 43) % 450);
  const reserved = Math.floor(currentStock * 0.1);
  const storeRef = initialStores[i % initialStores.length];
  initialInventory.push({
    sku: `SKU-${100000 + i}`,
    productName: prodName,
    category: categories[i % categories.length],
    storeName: storeRef.storeName,
    currentStock,
    reservedStock: reserved,
    availableStock: Math.max(0, currentStock - reserved),
    costPrice: cost,
    sellingPrice: sell,
    inventoryValue: currentStock * cost
  });
}

// Seed to complete 5000 orders
const statusDistribution = [
  OrderStatus.Delivered, OrderStatus.Delivered, OrderStatus.Delivered, OrderStatus.Delivered, OrderStatus.Delivered,
  OrderStatus.Shipped, OrderStatus.Shipped, OrderStatus.Shipped,
  OrderStatus.Packed, OrderStatus.Packed,
  OrderStatus.Processing, OrderStatus.Processing,
  OrderStatus.New, OrderStatus.New,
  OrderStatus.Cancelled, OrderStatus.Returned, OrderStatus.RTO
];
const couriersList = ["Delhivery", "BlueDart", "Amazon Logistics", "XpressBees", "Shadowfax"];

while (initialOrders.length < 5000) {
  const i = initialOrders.length + 1;
  const fName = firstNames[i % firstNames.length];
  const lName = lastNames[i % lastNames.length];
  const prodRef = initialInventory[i % initialInventory.length];
  const qty = (i % 7 === 0) ? 2 : 1;
  const revenue = prodRef.sellingPrice * qty;
  const storeRef = initialStores[i % initialStores.length];
  const orderStatus = statusDistribution[i % statusDistribution.length];

  const dateObj = new Date();
  dateObj.setDate(dateObj.getDate() - (i % 30));
  const dateStr = dateObj.toISOString().split("T")[0];

  initialOrders.push({
    id: `ORD-${900000 + i}`,
    orderDate: dateStr,
    customerName: `${fName} ${lName}`,
    product: prodRef.productName,
    quantity: qty,
    marketplace: storeRef.marketplace,
    store: storeRef.storeName,
    status: orderStatus,
    courier: couriersList[i % couriersList.length],
    trackingNumber: `TRK-${100000000 + (i * 29311) % 899999999}`,
    revenue
  });
}

// Seed Returns to match return/RTO rate
const returnReasons = ["Size discrepancy - Too small", "Defective product", "Wrong color received", "Late delivery, no longer needed", "Packaging damaged on arrival", "Customer unavailable - Multiple attempts failed"];
while (initialReturns.length < 500) {
  const i = initialReturns.length + 1;
  const returnOrders = initialOrders.filter(o => o.status === OrderStatus.Returned || o.status === OrderStatus.RTO);
  const ord = returnOrders[i % returnOrders.length] || initialOrders[i % initialOrders.length];
  initialReturns.push({
    id: `RET-${1000 + i}`,
    orderId: ord.id,
    storeName: ord.store,
    marketplace: ord.marketplace,
    productName: ord.product,
    returnReason: returnReasons[i % returnReasons.length],
    type: ord.status === OrderStatus.RTO ? "RTO" : "Return",
    refundStatus: i % 3 === 0 ? "Refunded" : (i % 3 === 1 ? "Pending" : "Rejected"),
    date: ord.orderDate
  });
}
