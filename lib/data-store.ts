import AsyncStorage from "@react-native-async-storage/async-storage";

export interface Strain {
  id: string;
  name: string;
  type: "Indica" | "Sativa" | "Hybrid";
  thcRange: string;
  cbdRange: string;
  lineage: string[];
  terpenes: string[];
  medicalUses: string[];
  flavorProfile: string[];
  description: string;
  breeder: string;
  floweringTime: string;
  archived: boolean;
  imageColor: string;
}

export interface Product {
  id: string;
  name: string;
  strainId: string;
  strainName: string;
  category: "Flower" | "Oil" | "Edible" | "Tincture" | "Seed" | "Clone";
  price: number;
  unit: string;
  description: string;
  inStock: boolean;
  thc: string;
  cbd: string;
  imageColor: string;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  category: string;
  readTime: string;
  comments: Comment[];
}

export interface Comment {
  id: string;
  author: string;
  content: string;
  date: string;
}

export interface CartItem {
  productId: string;
  quantity: number;
}

export interface Order {
  id: string;
  items: { product: Product; quantity: number }[];
  total: number;
  status: "Processing" | "Shipped" | "Delivered";
  date: string;
  trackingNumber?: string;
  shippingAddress: string;
}

const CART_KEY = "@blueflame_cart";
const ORDERS_KEY = "@blueflame_orders";
const FORUM_KEY = "@blueflame_forum";

const STRAIN_COLORS = ["#1E3A5F", "#2D1B4E", "#1B4332", "#4A1C2D", "#3D2B1F", "#1B3A4B"];

export const SEED_STRAINS: Strain[] = [
  {
    id: "s1", name: "Durban Flame", type: "Sativa",
    thcRange: "18-22%", cbdRange: "0.5-1%",
    lineage: ["Durban Poison", "Blue Dream"],
    terpenes: ["Limonene", "Myrcene", "Terpinolene"],
    medicalUses: ["Chronic Pain", "Depression", "Fatigue"],
    flavorProfile: ["Citrus", "Sweet", "Earthy"],
    description: "A powerful South African sativa cross that preserves the energizing landrace genetics of Durban Poison with added complexity from Blue Dream. Known for its uplifting cerebral effects and exceptional terpene production.",
    breeder: "Blue Flame Genetics", floweringTime: "9-11 weeks",
    archived: false, imageColor: STRAIN_COLORS[0],
  },
  {
    id: "s2", name: "Cape Kush", type: "Indica",
    thcRange: "20-25%", cbdRange: "1-2%",
    lineage: ["OG Kush", "Swazi Gold"],
    terpenes: ["Caryophyllene", "Linalool", "Myrcene"],
    medicalUses: ["Insomnia", "Anxiety", "Muscle Spasms"],
    flavorProfile: ["Pine", "Earthy", "Spice"],
    description: "A deeply relaxing indica that bridges Western genetics with African heritage. Cape Kush delivers a heavy body stone with remarkable medicinal properties for pain and sleep disorders.",
    breeder: "Blue Flame Genetics", floweringTime: "8-9 weeks",
    archived: false, imageColor: STRAIN_COLORS[1],
  },
  {
    id: "s3", name: "Highveld Haze", type: "Sativa",
    thcRange: "16-20%", cbdRange: "2-4%",
    lineage: ["Malawi Gold", "Haze"],
    terpenes: ["Pinene", "Limonene", "Ocimene"],
    medicalUses: ["PTSD", "Appetite Loss", "Nausea"],
    flavorProfile: ["Tropical", "Herbal", "Citrus"],
    description: "A stabilized cross preserving the legendary Malawi Gold landrace genetics with classic Haze potency. This strain represents years of selective breeding to create a reliable medical-grade sativa.",
    breeder: "Blue Flame Genetics", floweringTime: "10-12 weeks",
    archived: false, imageColor: STRAIN_COLORS[2],
  },
  {
    id: "s4", name: "Table Mountain", type: "Hybrid",
    thcRange: "19-23%", cbdRange: "1-3%",
    lineage: ["Girl Scout Cookies", "Durban Poison", "Swazi Gold"],
    terpenes: ["Caryophyllene", "Limonene", "Humulene"],
    medicalUses: ["Chronic Pain", "Inflammation", "Stress"],
    flavorProfile: ["Sweet", "Mint", "Earthy"],
    description: "A three-way cross producing a perfectly balanced hybrid. Table Mountain offers the best of both worlds with potent medical benefits and a complex terpene profile that delights the palate.",
    breeder: "Blue Flame Genetics", floweringTime: "8-10 weeks",
    archived: false, imageColor: STRAIN_COLORS[3],
  },
  {
    id: "s5", name: "Karoo Purple", type: "Indica",
    thcRange: "22-26%", cbdRange: "0.5-1.5%",
    lineage: ["Granddaddy Purple", "African Buzz"],
    terpenes: ["Myrcene", "Linalool", "Caryophyllene"],
    medicalUses: ["Insomnia", "Chronic Pain", "Muscle Relaxation"],
    flavorProfile: ["Grape", "Berry", "Lavender"],
    description: "Our most potent indica offering, Karoo Purple showcases stunning purple phenotypes with exceptional resin production. A connoisseur-grade strain bred for maximum therapeutic value.",
    breeder: "Blue Flame Genetics", floweringTime: "7-9 weeks",
    archived: false, imageColor: STRAIN_COLORS[4],
  },
  {
    id: "s6", name: "Zulu Thunder", type: "Hybrid",
    thcRange: "17-21%", cbdRange: "3-6%",
    lineage: ["ACDC", "Durban Poison"],
    terpenes: ["Myrcene", "Pinene", "Bisabolol"],
    medicalUses: ["Epilepsy", "Anxiety", "Inflammation", "Pain"],
    flavorProfile: ["Earthy", "Pine", "Herbal"],
    description: "A high-CBD hybrid specifically bred for patients requiring balanced cannabinoid ratios. Zulu Thunder provides significant relief without overwhelming psychoactive effects.",
    breeder: "Blue Flame Genetics", floweringTime: "9-10 weeks",
    archived: true, imageColor: STRAIN_COLORS[5],
  },
];

export const SEED_PRODUCTS: Product[] = [
  // Durban Flame (s1)
  { id: "p1", name: "Durban Flame - Premium Flower", strainId: "s1", strainName: "Durban Flame", category: "Flower", price: 350, unit: "3.5g", description: "Hand-trimmed, slow-cured premium flower. Lab-tested for potency and purity. Energizing sativa-dominant effects ideal for daytime use.", inStock: true, thc: "20%", cbd: "0.8%", imageColor: "#1E3A5F" },
  { id: "p1_oil", name: "Durban Flame - Full Spectrum Oil", strainId: "s1", strainName: "Durban Flame", category: "Oil", price: 880, unit: "30ml", description: "CO2-extracted full spectrum oil preserving the uplifting terpene profile. Ideal for sublingual dosing with energising effects.", inStock: true, thc: "20%", cbd: "0.8%", imageColor: "#1E3A5F" },
  { id: "p1_edible", name: "Durban Flame - Energy Gummies", strainId: "s1", strainName: "Durban Flame", category: "Edible", price: 300, unit: "10 pack", description: "Citrus-flavoured gummies dosed at 10mg each. Crafted with Durban Flame distillate for a focused, uplifting experience.", inStock: true, thc: "20%", cbd: "0.8%", imageColor: "#1E3A5F" },
  { id: "p1_tincture", name: "Durban Flame - Daytime Tincture", strainId: "s1", strainName: "Durban Flame", category: "Tincture", price: 680, unit: "30ml", description: "Alcohol-based tincture with precise dosing dropper. Fast-acting sublingual formula designed for morning and afternoon use.", inStock: true, thc: "20%", cbd: "0.8%", imageColor: "#1E3A5F" },
  { id: "p1_seed", name: "Durban Flame - Feminized Seeds", strainId: "s1", strainName: "Durban Flame", category: "Seed", price: 550, unit: "5 seeds", description: "F5 stabilized feminized seeds. Consistent phenotype expression guaranteed with vigorous growth traits.", inStock: true, thc: "18-22%", cbd: "0.5-1%", imageColor: "#1E3A5F" },
  { id: "p1_clone", name: "Durban Flame - Verified Clone", strainId: "s1", strainName: "Durban Flame", category: "Clone", price: 220, unit: "1 clone", description: "Healthy rooted clone from our verified Durban Flame mother plant. Ready for transplant with established root system.", inStock: true, thc: "18-22%", cbd: "0.5-1%", imageColor: "#1E3A5F" },

  // Cape Kush (s2)
  { id: "p2_flower", name: "Cape Kush - Premium Flower", strainId: "s2", strainName: "Cape Kush", category: "Flower", price: 380, unit: "3.5g", description: "Dense, resinous buds with a rich pine and spice aroma. Slow-cured for maximum terpene retention and smooth combustion.", inStock: true, thc: "22%", cbd: "1.5%", imageColor: "#2D1B4E" },
  { id: "p2", name: "Cape Kush - Full Spectrum Oil", strainId: "s2", strainName: "Cape Kush", category: "Oil", price: 850, unit: "30ml", description: "CO2-extracted full spectrum oil. Ideal for sublingual use or incorporation into edibles. Deep relaxation effects.", inStock: true, thc: "22%", cbd: "1.5%", imageColor: "#2D1B4E" },
  { id: "p2_edible", name: "Cape Kush - Sleep Gummies", strainId: "s2", strainName: "Cape Kush", category: "Edible", price: 320, unit: "10 pack", description: "Night-time gummies infused with Cape Kush extract and natural melatonin. 10mg THC per piece for restful sleep.", inStock: true, thc: "22%", cbd: "1.5%", imageColor: "#2D1B4E" },
  { id: "p2_tincture", name: "Cape Kush - Night Tincture", strainId: "s2", strainName: "Cape Kush", category: "Tincture", price: 700, unit: "30ml", description: "Calming tincture formulated for evening use. Precise dropper dosing for muscle relaxation and deep sleep support.", inStock: true, thc: "22%", cbd: "1.5%", imageColor: "#2D1B4E" },
  { id: "p2_seed", name: "Cape Kush - Feminized Seeds", strainId: "s2", strainName: "Cape Kush", category: "Seed", price: 520, unit: "5 seeds", description: "Feminized seeds from our stabilized Cape Kush line. Compact growth habit, ideal for indoor cultivation.", inStock: true, thc: "20-25%", cbd: "1-2%", imageColor: "#2D1B4E" },
  { id: "p8", name: "Cape Kush - Verified Clone", strainId: "s2", strainName: "Cape Kush", category: "Clone", price: 200, unit: "1 clone", description: "Healthy rooted clone from verified mother plant. Ready for transplant with vigorous indica growth pattern.", inStock: true, thc: "20-25%", cbd: "1-2%", imageColor: "#2D1B4E" },

  // Highveld Haze (s3)
  { id: "p3_flower", name: "Highveld Haze - Premium Flower", strainId: "s3", strainName: "Highveld Haze", category: "Flower", price: 340, unit: "3.5g", description: "Airy, trichome-covered buds with tropical and herbal aromatics. A true sativa experience with African landrace heritage.", inStock: true, thc: "18%", cbd: "3%", imageColor: "#1B4332" },
  { id: "p3_oil", name: "Highveld Haze - Balanced Oil", strainId: "s3", strainName: "Highveld Haze", category: "Oil", price: 820, unit: "30ml", description: "Balanced THC:CBD oil extracted from Highveld Haze flower. Excellent for patients seeking moderate psychoactive effects with therapeutic CBD.", inStock: true, thc: "18%", cbd: "3%", imageColor: "#1B4332" },
  { id: "p3_edible", name: "Highveld Haze - Wellness Gummies", strainId: "s3", strainName: "Highveld Haze", category: "Edible", price: 290, unit: "10 pack", description: "Tropical-flavoured gummies with a balanced cannabinoid profile. 8mg THC and 2mg CBD per piece for gentle, uplifting effects.", inStock: true, thc: "18%", cbd: "3%", imageColor: "#1B4332" },
  { id: "p3", name: "Highveld Haze - Tincture", strainId: "s3", strainName: "Highveld Haze", category: "Tincture", price: 650, unit: "30ml", description: "Alcohol-based tincture with precise dosing dropper. Fast-acting sublingual formula with balanced cannabinoid ratio.", inStock: true, thc: "18%", cbd: "3%", imageColor: "#1B4332" },
  { id: "p3_seed", name: "Highveld Haze - Feminized Seeds", strainId: "s3", strainName: "Highveld Haze", category: "Seed", price: 600, unit: "5 seeds", description: "Feminized seeds from our Malawi Gold x Haze cross. Tall growth habit requiring longer flowering but rewarding with exceptional yields.", inStock: true, thc: "16-20%", cbd: "2-4%", imageColor: "#1B4332" },
  { id: "p3_clone", name: "Highveld Haze - Verified Clone", strainId: "s3", strainName: "Highveld Haze", category: "Clone", price: 230, unit: "1 clone", description: "Rooted clone from our elite Highveld Haze mother. Selected for vigour, terpene expression, and consistent CBD production.", inStock: true, thc: "16-20%", cbd: "2-4%", imageColor: "#1B4332" },

  // Table Mountain (s4)
  { id: "p4_flower", name: "Table Mountain - Premium Flower", strainId: "s4", strainName: "Table Mountain", category: "Flower", price: 370, unit: "3.5g", description: "Beautifully balanced hybrid flower with sweet mint and earthy notes. Dense, frosty buds ideal for all-day medicinal use.", inStock: true, thc: "21%", cbd: "2%", imageColor: "#4A1C2D" },
  { id: "p4_oil", name: "Table Mountain - Hybrid Oil", strainId: "s4", strainName: "Table Mountain", category: "Oil", price: 860, unit: "30ml", description: "Full spectrum oil from our flagship hybrid. Versatile effects suitable for pain management, stress relief, and inflammation.", inStock: true, thc: "21%", cbd: "2%", imageColor: "#4A1C2D" },
  { id: "p4", name: "Table Mountain - Edible Gummies", strainId: "s4", strainName: "Table Mountain", category: "Edible", price: 280, unit: "10 pack", description: "Precisely dosed gummies, 10mg per piece. Lab-tested for consistency with a sweet mint flavour profile.", inStock: true, thc: "21%", cbd: "2%", imageColor: "#4A1C2D" },
  { id: "p4_tincture", name: "Table Mountain - Balance Tincture", strainId: "s4", strainName: "Table Mountain", category: "Tincture", price: 690, unit: "30ml", description: "Balanced hybrid tincture suitable for any time of day. Provides steady relief without excessive sedation or stimulation.", inStock: true, thc: "21%", cbd: "2%", imageColor: "#4A1C2D" },
  { id: "p4_seed", name: "Table Mountain - Feminized Seeds", strainId: "s4", strainName: "Table Mountain", category: "Seed", price: 580, unit: "5 seeds", description: "Three-way cross feminized seeds producing uniform hybrid plants. Medium height with exceptional resin production.", inStock: true, thc: "19-23%", cbd: "1-3%", imageColor: "#4A1C2D" },
  { id: "p4_clone", name: "Table Mountain - Verified Clone", strainId: "s4", strainName: "Table Mountain", category: "Clone", price: 210, unit: "1 clone", description: "Elite clone from our Table Mountain mother plant. Produces reliable hybrid effects with outstanding terpene complexity.", inStock: true, thc: "19-23%", cbd: "1-3%", imageColor: "#4A1C2D" },

  // Karoo Purple (s5)
  { id: "p5", name: "Karoo Purple - Premium Flower", strainId: "s5", strainName: "Karoo Purple", category: "Flower", price: 420, unit: "3.5g", description: "Ultra-premium small batch flower with stunning purple hues. Our highest potency offering with grape and berry aromatics.", inStock: true, thc: "24%", cbd: "1%", imageColor: "#3D2B1F" },
  { id: "p5_oil", name: "Karoo Purple - Potent Oil", strainId: "s5", strainName: "Karoo Purple", category: "Oil", price: 920, unit: "30ml", description: "High-potency CO2 oil from our strongest indica. Recommended for experienced patients with significant pain or insomnia conditions.", inStock: true, thc: "24%", cbd: "1%", imageColor: "#3D2B1F" },
  { id: "p5_edible", name: "Karoo Purple - Berry Gummies", strainId: "s5", strainName: "Karoo Purple", category: "Edible", price: 340, unit: "10 pack", description: "Berry-flavoured gummies at 12mg per piece. Crafted with Karoo Purple distillate for deep relaxation and sleep support.", inStock: true, thc: "24%", cbd: "1%", imageColor: "#3D2B1F" },
  { id: "p5_tincture", name: "Karoo Purple - Deep Sleep Tincture", strainId: "s5", strainName: "Karoo Purple", category: "Tincture", price: 760, unit: "30ml", description: "Our strongest indica tincture, formulated for patients with severe insomnia. Precise dropper for controlled dosing before bed.", inStock: true, thc: "24%", cbd: "1%", imageColor: "#3D2B1F" },
  { id: "p5_seed", name: "Karoo Purple - Feminized Seeds", strainId: "s5", strainName: "Karoo Purple", category: "Seed", price: 620, unit: "5 seeds", description: "Premium feminized seeds producing beautiful purple phenotypes. Compact plants with exceptional resin coverage and potency.", inStock: true, thc: "22-26%", cbd: "0.5-1.5%", imageColor: "#3D2B1F" },
  { id: "p5_clone", name: "Karoo Purple - Verified Clone", strainId: "s5", strainName: "Karoo Purple", category: "Clone", price: 250, unit: "1 clone", description: "Clone from our champion Karoo Purple mother. Guaranteed purple expression with top-shelf resin production.", inStock: true, thc: "22-26%", cbd: "0.5-1.5%", imageColor: "#3D2B1F" },

  // Zulu Thunder (s6)
  { id: "p6_flower", name: "Zulu Thunder - CBD Flower", strainId: "s6", strainName: "Zulu Thunder", category: "Flower", price: 300, unit: "3.5g", description: "High-CBD flower with gentle effects. Ideal for patients seeking therapeutic benefits without strong psychoactive impact.", inStock: true, thc: "5%", cbd: "15%", imageColor: "#1B3A4B" },
  { id: "p6_oil", name: "Zulu Thunder - CBD Oil", strainId: "s6", strainName: "Zulu Thunder", category: "Oil", price: 900, unit: "30ml", description: "High-CBD full spectrum oil with a 3:1 CBD to THC ratio. Excellent for inflammation, anxiety, and seizure management.", inStock: true, thc: "5%", cbd: "15%", imageColor: "#1B3A4B" },
  { id: "p6_edible", name: "Zulu Thunder - CBD Gummies", strainId: "s6", strainName: "Zulu Thunder", category: "Edible", price: 260, unit: "10 pack", description: "CBD-dominant gummies with 20mg CBD and 5mg THC per piece. Herbal pine flavour for calm, clear-headed relief.", inStock: true, thc: "5%", cbd: "15%", imageColor: "#1B3A4B" },
  { id: "p7", name: "Zulu Thunder - CBD Tincture", strainId: "s6", strainName: "Zulu Thunder", category: "Tincture", price: 750, unit: "30ml", description: "High-CBD tincture for therapeutic use. Minimal psychoactive effects, ideal for daily wellness and seizure management.", inStock: true, thc: "5%", cbd: "15%", imageColor: "#1B3A4B" },
  { id: "p6_seed", name: "Zulu Thunder - Feminized Seeds", strainId: "s6", strainName: "Zulu Thunder", category: "Seed", price: 500, unit: "5 seeds", description: "CBD-dominant feminized seeds. Reliable high-CBD expression across phenotypes, bred for medical consistency.", inStock: true, thc: "17-21%", cbd: "3-6%", imageColor: "#1B3A4B" },
  { id: "p6_clone", name: "Zulu Thunder - Verified Clone", strainId: "s6", strainName: "Zulu Thunder", category: "Clone", price: 190, unit: "1 clone", description: "Clone from our CBD-rich Zulu Thunder mother. Selected for maximum CBD production and balanced growth pattern.", inStock: true, thc: "17-21%", cbd: "3-6%", imageColor: "#1B3A4B" },
];

export const SEED_BLOG_POSTS: BlogPost[] = [
  {
    id: "b1", title: "Preserving South African Landrace Genetics",
    excerpt: "How Blue Flame is working to document and preserve the unique cannabis genetics indigenous to Southern Africa.",
    content: "South Africa has a rich history of cannabis cultivation dating back centuries. The landrace varieties found across the region — from Durban Poison to Swazi Gold to Malawi Gold — represent irreplaceable genetic diversity.\n\nAt Blue Flame, we believe preserving these genetics is not just a business imperative but a cultural responsibility. Our breeding program focuses on:\n\n1. Collection and Documentation: We work with traditional growers to source authentic landrace seeds, documenting their origins, traditional uses, and growing characteristics.\n\n2. Stabilization: Through careful selection over multiple generations (typically F4-F6), we stabilize desirable traits while maintaining genetic integrity.\n\n3. Cross-breeding: We strategically cross landrace genetics with proven international cultivars to create novel therapeutic varieties.\n\n4. Seed Banking: Every strain in our program is preserved in our climate-controlled seed vault, ensuring these genetics survive for future generations.\n\nOur work represents a bridge between traditional South African cannabis culture and modern medical science.",
    author: "Dr. Thabo Ndlovu", date: "2025-12-15", category: "Genetics", readTime: "5 min", comments: [],
  },
  {
    id: "b2", title: "Understanding Terpene Profiles in Medical Cannabis",
    excerpt: "A deep dive into how terpene profiles influence the therapeutic effects of different cannabis strains.",
    content: "Terpenes are the aromatic compounds that give cannabis its distinctive smell and flavour. But beyond sensory experience, terpenes play a crucial role in the therapeutic effects of cannabis through what's known as the entourage effect.\n\nKey terpenes and their effects:\n\nMyrcene: The most common terpene in cannabis, myrcene has sedative and muscle-relaxing properties. Strains high in myrcene tend to produce body-heavy effects.\n\nLimonene: Found in citrus-forward strains, limonene has been shown to have anti-anxiety and mood-elevating properties.\n\nCaryophyllene: Unique among terpenes, caryophyllene directly activates CB2 receptors. It has powerful anti-inflammatory properties.\n\nLinalool: Also found in lavender, linalool contributes to sedative effects and has shown promise in treating anxiety and depression.\n\nAt Blue Flame, we test every batch for full terpene profiles, ensuring patients can make informed decisions about their medicine.",
    author: "Sarah van der Merwe", date: "2025-11-28", category: "Education", readTime: "7 min", comments: [],
  },
  {
    id: "b3", title: "Cultivation Standards: From Soil to Medicine",
    excerpt: "Our rigorous cultivation protocols that ensure every product meets medical-grade quality standards.",
    content: "At Blue Flame, cultivation is a science. Our growing protocols are designed to produce consistent, clean, potent medicine that patients can rely on.\n\nGrowing Environment:\nWe use a hybrid indoor/greenhouse approach that leverages South Africa's exceptional natural light while maintaining environmental control. Temperature, humidity, and light cycles are monitored and adjusted in real-time.\n\nSoil & Nutrition:\nOur living soil program builds biological diversity in the root zone. We use organic amendments, compost teas, and beneficial microorganisms to create a thriving soil ecosystem.\n\nIPM (Integrated Pest Management):\nWe never use synthetic pesticides. Our IPM program relies on beneficial insects, companion planting, and environmental controls to manage pests.\n\nHarvesting & Curing:\nEach plant is hand-harvested at peak maturity, determined by trichome analysis. Our slow-cure process takes 4-6 weeks, preserving terpenes and ensuring a smooth, flavourful experience.\n\nTesting:\nEvery batch is tested by independent laboratories for cannabinoid content, terpene profiles, pesticide residues, heavy metals, and microbial contamination.",
    author: "Johan Botha", date: "2025-11-10", category: "Cultivation", readTime: "6 min", comments: [],
  },
  {
    id: "b4", title: "The Future of Cannabis Medicine in South Africa",
    excerpt: "Exploring the evolving regulatory landscape and what it means for medical cannabis patients.",
    content: "South Africa's cannabis landscape has evolved dramatically since the landmark Constitutional Court ruling in 2018. As the regulatory framework continues to develop, the opportunities for medical cannabis are expanding.\n\nCurrent State:\nThe Cannabis for Private Purposes Act has provided a framework for personal use, while SAHPRA (South African Health Products Regulatory Authority) oversees medical cannabis licensing.\n\nMedical Access:\nPatients can access cannabis-based medicines through registered healthcare practitioners. The system is still developing, but access is improving with each regulatory update.\n\nBlue Flame's Role:\nAs a licensed cultivator and private members club, we operate within the established legal framework. Our membership model ensures compliance while providing members with access to premium, lab-tested products.\n\nLooking Ahead:\nThe global trend toward cannabis legalisation is clear. South Africa is positioned to become a major player in the international cannabis market, and Blue Flame is committed to being at the forefront of this evolution.",
    author: "Dr. Thabo Ndlovu", date: "2025-10-22", category: "Industry", readTime: "8 min", comments: [],
  },
];

export async function getCart(): Promise<CartItem[]> {
  const stored = await AsyncStorage.getItem(CART_KEY);
  return stored ? JSON.parse(stored) : [];
}

export async function saveCart(cart: CartItem[]): Promise<void> {
  await AsyncStorage.setItem(CART_KEY, JSON.stringify(cart));
}

export async function getOrders(): Promise<Order[]> {
  const stored = await AsyncStorage.getItem(ORDERS_KEY);
  return stored ? JSON.parse(stored) : [];
}

export async function saveOrders(orders: Order[]): Promise<void> {
  await AsyncStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
}

export async function getForumComments(postId: string): Promise<Comment[]> {
  const stored = await AsyncStorage.getItem(`${FORUM_KEY}_${postId}`);
  return stored ? JSON.parse(stored) : [];
}

export async function saveForumComment(postId: string, comment: Comment): Promise<void> {
  const comments = await getForumComments(postId);
  comments.push(comment);
  await AsyncStorage.setItem(`${FORUM_KEY}_${postId}`, JSON.stringify(comments));
}
