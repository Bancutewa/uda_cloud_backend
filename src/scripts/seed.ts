import "dotenv/config";
import { dbConfig } from "../config/db.config";
import { Category } from "../entity/category.entity";
import { Product } from "../entity/product.entity";
import { UsersEntity } from "../entity/user.entity";
import { CartEntity } from "../entity/cart.entity";
import * as fs from "fs";
import * as path from "path";

interface FishImage {
  id: number;
  name: string;
  url: string;
}

interface FishImagesData {
  images: FishImage[];
}

async function seedDatabase() {
  try {
    // Initialize database connection
    await dbConfig.initialize();
    console.log("Database connection established");

    // Get repositories
    const categoryRepo = dbConfig.getRepository(Category);
    const productRepo = dbConfig.getRepository(Product);
    const userRepo = dbConfig.getRepository(UsersEntity);
    const cartRepo = dbConfig.getRepository(CartEntity);

    // Clear existing data (optional - uncomment if you want to reset)
    // console.log("Clearing existing data...");
    // await productRepo.clear();
    // await categoryRepo.clear();
    // await cartRepo.clear();
    // await userRepo.clear();

    // Seed Categories
    console.log("Seeding categories...");
    const categoriesData = [
      "Cá Neon",
      "Cá Dĩa",
      "Cá Thần Tiên",
      "Cá Chuột",
      "Cá Phượng Hoàng",
      "Cá Ali Thái",
      "Cá Bảy Màu",
      "Cá Cầu Vòng",
      "Tép Thuỷ Sinh",
      "Lau Kiếng, Vệ Sinh Hồ",
      "Thức Ăn Cá",
    ];

    const categories: Category[] = [];
    for (const categoryName of categoriesData) {
      let category = await categoryRepo.findOne({
        where: { name: categoryName },
      });
      if (!category) {
        category = categoryRepo.create({ name: categoryName });
        await categoryRepo.save(category);
        console.log(`Created category: ${categoryName}`);
      }
      categories.push(category);
    }

    // Load fish images data
    console.log("Loading fish images data...");
    const fishImagesPath = path.join(
      __dirname,
      "../../../../mysql/fishimages.json"
    );
    const fishImagesData: FishImagesData = JSON.parse(
      fs.readFileSync(fishImagesPath, "utf-8")
    );

    // Seed Products from fish images
    console.log("Seeding products...");

    // Define meaningful fish names for each image
    const fishNames = [
      "Cá Neon Tetra Đỏ",
      "Cá Algae Eater Vàng",
      "Cá Pleco Đen",
      "Cá Pleco Trắng",
      "Cá Corydora Albino",
      "Cá Pleco Albino",
      "Cá Garra Panda",
      "Cá Corydora Pepper",
      "Cá Corydora Albino Hồng",
      "Cá Corydora Panda",
    ];

    const fishDescriptions = [
      "Cá Neon Tetra màu đỏ tươi sáng, rất năng động và dễ chăm sóc. Phù hợp cho hồ cá cộng đồng.",
      "Cá Algae Eater vàng chuyên ăn tảo, giúp giữ hồ cá luôn sạch sẽ. Thích hợp cho hồ cá mới.",
      "Cá Pleco đen với thân hình mạnh mẽ, chuyên ăn thức ăn thừa và tảo. Cá cảnh dễ nuôi.",
      "Cá Pleco trắng với màu sắc nổi bật, rất hiếm và đẹp. Thích hợp cho hồ cá show.",
      "Cá Corydora Albino màu trắng hồng, rất hiền hòa và dễ sinh sản. Lý tưởng cho hồ cá nhỏ.",
      "Cá Pleco Albino màu trắng tinh khôi, rất quý hiếm. Giúp vệ sinh hồ cá tự nhiên.",
      "Cá Garra Panda với màu đen trắng tương phản, rất độc đáo. Thích hợp cho hồ cá châu Á.",
      "Cá Corydora Pepper với màu nâu đỏ đặc trưng, cá nền hoàn hảo cho hồ cá nhỏ.",
      "Cá Corydora Albino Hồng với màu hồng đặc trưng, rất xinh đẹp. Thích hợp cho hồ cá thủy sinh.",
      "Cá Corydora Panda với hoa văn đen trắng, cá cảnh rất được yêu thích.",
    ];

    // Assign specific categories to different fish types
    const categoryAssignments = [
      categories.find((c) => c.name === "Cá Neon"), // Neon Tetra -> Cá Neon category
      categories.find((c) => c.name === "Lau Kiếng, Vệ Sinh Hồ"), // Algae Eater -> Lau Kiếng category
      categories.find((c) => c.name === "Lau Kiếng, Vệ Sinh Hồ"), // Pleco Đen -> Lau Kiếng category
      categories.find((c) => c.name === "Lau Kiếng, Vệ Sinh Hồ"), // Pleco Trắng -> Lau Kiếng category
      categories.find((c) => c.name === "Cá Chuột"), // Corydora Albino -> Cá Chuột category
      categories.find((c) => c.name === "Lau Kiếng, Vệ Sinh Hồ"), // Pleco Albino -> Lau Kiếng category
      categories.find((c) => c.name === "Cá Dĩa"), // Garra Panda -> Cá Dĩa category
      categories.find((c) => c.name === "Cá Chuột"), // Corydora Pepper -> Cá Chuột category
      categories.find((c) => c.name === "Cá Chuột"), // Corydora Albino -> Cá Chuột category
      categories.find((c) => c.name === "Cá Chuột"), // Corydora Panda -> Cá Chuột category
    ];

    for (let i = 0; i < fishImagesData.images.length; i++) {
      const fishImage = fishImagesData.images[i];
      const existingProduct = await productRepo.findOne({
        where: { name: fishNames[i] },
      });

      if (!existingProduct) {
        // Create product with meaningful data
        const product = productRepo.create({
          name: fishNames[i],
          price: Math.floor(Math.random() * 500000) + 50000, // Random price between 50k-550k VND
          image: fishImage.url,
          description: fishDescriptions[i],
          quantity: Math.floor(Math.random() * 50) + 10, // Random quantity 10-60
          storage: true,
          category:
            categoryAssignments[i] ||
            categories[Math.floor(Math.random() * categories.length)], // Use assigned category or random
        });

        await productRepo.save(product);
        console.log(`Created product: ${product.name}`);
      }
    }

    // Seed sample users
    console.log("Seeding users...");
    const usersData = [
      {
        name: "Admin User",
        email: "admin@example.com",
        username: "admin",
        password: "admin123", // Note: In production, this should be hashed
        role: "admin",
        address: "123 Admin Street, City",
        phone: "0123456789",
      },
      {
        name: "John Doe",
        email: "john@example.com",
        username: "johndoe",
        password: "password123", // Note: In production, this should be hashed
        role: "user",
        address: "456 User Avenue, City",
        phone: "0987654321",
      },
      {
        name: "Jane Smith",
        email: "jane@example.com",
        username: "janesmith",
        password: "password123", // Note: In production, this should be hashed
        role: "user",
        address: "789 Customer Road, City",
        phone: "0555666777",
      },
    ];

    const users: UsersEntity[] = [];
    for (const userData of usersData) {
      let user = await userRepo.findOne({
        where: { username: userData.username },
      });
      if (!user) {
        user = userRepo.create(userData);
        await userRepo.save(user);
        console.log(`Created user: ${userData.username}`);

        // Create cart for each user
        const cart = cartRepo.create({
          user: user,
          complete: false,
        });
        await cartRepo.save(cart);
        console.log(`Created cart for user: ${userData.username}`);
      }
      users.push(user);
    }

    console.log("\n✅ Database seeding completed successfully!");
    console.log(`📊 Summary:`);
    console.log(`   - Categories: ${categories.length}`);
    console.log(`   - Products: ${fishImagesData.images.length}`);
    console.log(`   - Users: ${users.length}`);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  } finally {
    await dbConfig.destroy();
    process.exit(0);
  }
}

// Run seeding
seedDatabase();
