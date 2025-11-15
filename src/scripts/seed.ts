import "dotenv/config";
import { dbConfig } from "../config/db.config";
import { Category } from "../entity/category.entity";
import { Product } from "../entity/product.entity";
import { UsersEntity } from "../entity/user.entity";
import { CartEntity } from "../entity/cart.entity";

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

    // Define fish images data
    const imagesData = [
      {
        id: 1,
        name: "fish1.jpg",
        url: "https://freshwateraquatica.org/products/golden-algae-eater",
      },
      {
        id: 2,
        name: "fish2.jpg",
        url: "https://freshwateraquatica.org/products/hillstream-loach",
      },
      {
        id: 3,
        name: "fish3.jpg",
        url: "https://freshwateraquatica.org/products/tank-cleaner-fish-sucker-fish-pleco-black",
      },
      {
        id: 4,
        name: "fish4.jpg",
        url: "https://freshwateraquatica.org/cdn/shop/files/suckerpleco.png?v=1741858187&width=533",
      },
      {
        id: 5,
        name: "fish5.jpg",
        url: "https://freshwateraquatica.org/cdn/shop/products/shortfin-abino-small.jpg?v=1693571135&width=533",
      },
      {
        id: 6,
        name: "fish6.jpg",
        url: "https://freshwateraquatica.org/cdn/shop/files/albinosucker.png?v=1741858318",
      },
      {
        id: 7,
        name: "fish7.jpg",
        url: "https://freshwateraquatica.org/cdn/shop/products/Panda-Garra-7_1024x1024_1cbd90ff-269b-4889-a264-d7fbcce8b4f9.jpg?v=1693569363&width=533",
      },
      {
        id: 8,
        name: "fish8.jpg",
        url: "https://freshwateraquatica.org/cdn/shop/products/Screenshot_243.png?v=1693570237&width=533",
      },
      {
        id: 9,
        name: "fish9.jpg",
        url: "https://freshwateraquatica.org/cdn/shop/products/albinocory.png?v=1693571132",
      },
      {
        id: 10,
        name: "fish10.jpg",
        url: "https://freshwateraquatica.org/cdn/shop/products/CORYDORAPEPPERfreshwateraquatica_1.png?v=1693570214&width=533",
      },
    ];

    // Seed Products from images data
    console.log("Seeding products...");

    // Define products with image URLs from imagesData
    const productsData = [
      {
        name: "Cá Neon Tetra Đỏ",
        image: imagesData[0].url,
        description:
          "Cá Neon Tetra màu đỏ tươi sáng, rất năng động và dễ chăm sóc. Phù hợp cho hồ cá cộng đồng.",
        categoryName: "Cá Neon",
        price: 150000,
        quantity: 25,
      },
      {
        name: "Cá Bảy Màu Dumbo",
        image: imagesData[1].url,
        description:
          "Cá Bảy Màu Dumbo với màu sắc rực rỡ, cá cảnh rất đẹp và nổi bật trong hồ.",
        categoryName: "Cá Bảy Màu",
        price: 200000,
        quantity: 15,
      },
      {
        name: "Cá Ali Thái",
        image: imagesData[2].url,
        description:
          "Cá Ali Thái với thân hình thon dài, màu sắc đẹp mắt. Phù hợp cho hồ cá thủy sinh.",
        categoryName: "Cá Ali Thái",
        price: 180000,
        quantity: 20,
      },
      {
        name: "Cá Lóc Phao Hoa",
        image: imagesData[3].url,
        description:
          "Cá Lóc Phao Hoa với hoa văn đẹp mắt, cá cảnh rất được yêu thích.",
        categoryName: "Cá Dĩa",
        price: 250000,
        quantity: 12,
      },
      {
        name: "Cá Lóc Trân Châu Ngũ Sắc",
        image: imagesData[4].url,
        description:
          "Cá Lóc Trân Châu với 5 màu sắc khác nhau, rất quý hiếm và đẹp.",
        categoryName: "Cá Dĩa",
        price: 350000,
        quantity: 8,
      },
      {
        name: "Chép Koi Cao Cấp",
        image: imagesData[5].url,
        description:
          "Chép Koi cao cấp với màu sắc và hoa văn tinh tế. Phù hợp cho hồ cá ngoài trời.",
        categoryName: "Cá Dĩa",
        price: 500000,
        quantity: 5,
      },
      {
        name: "Chép Koi Nhật Bản",
        image: imagesData[6].url,
        description:
          "Chép Koi nhập khẩu từ Nhật Bản, chất lượng cao cấp.",
        categoryName: "Cá Dĩa",
        price: 450000,
        quantity: 6,
      },
      {
        name: "Chép Koi F1",
        image: imagesData[7].url,
        description:
          "Chép Koi F1 lai tạo, màu sắc đẹp và giá cả phải chăng.",
        categoryName: "Cá Dĩa",
        price: 300000,
        quantity: 10,
      },
      {
        name: "Chép Nam Dương",
        image: imagesData[8].url,
        description:
          "Chép Nam Dương với màu sắc rực rỡ, cá cảnh dễ nuôi.",
        categoryName: "Cá Dĩa",
        price: 280000,
        quantity: 15,
      },
      {
        name: "Cá Kim Cương Đỏ",
        image: imagesData[9].url,
        description:
          "Cá Kim Cương Đỏ với màu đỏ rực rỡ như kim cương.",
        categoryName: "Cá Thần Tiên",
        price: 400000,
        quantity: 10,
      },
      {
        name: "Cá Kim Cương Đỏ Short Body",
        image: imagesData[0].url,
        description:
          "Cá Kim Cương Đỏ thân ngắn, dễ nuôi hơn và giá rẻ hơn.",
        categoryName: "Cá Thần Tiên",
        price: 320000,
        quantity: 18,
      },
      {
        name: "Cá Kim Cương Xanh",
        image: imagesData[1].url,
        description:
          "Cá Kim Cương Xanh với màu xanh sapphire đẹp mắt.",
        categoryName: "Cá Thần Tiên",
        price: 380000,
        quantity: 12,
      },
      {
        name: "Cá Lóc Cầu Vòng Cao Cấp",
        image: imagesData[2].url,
        description:
          "Cá Lóc Cầu Vòng cao cấp với hoa văn cầu vòng đẹp mắt.",
        categoryName: "Cá Dĩa",
        price: 600000,
        quantity: 4,
      },
      {
        name: "Cá Lóc Hoa Tiên Cá Đầy",
        image: imagesData[3].url,
        description: "Cá Lóc Hoa Tiên với hoa văn cầu vòng đầy đặn.",
        categoryName: "Cá Dĩa",
        price: 420000,
        quantity: 8,
      },
      {
        name: "Cá Lóc Rồng Đỏ",
        image: imagesData[4].url,
        description: "Cá Lóc Rồng Đỏ với hoa văn rồng phượng hoàng.",
        categoryName: "Cá Phượng Hoàng",
        price: 550000,
        quantity: 6,
      },
      {
        name: "Cá Lóc Tiểu Hoàng Đế",
        image: imagesData[5].url,
        description: "Cá Lóc Tiểu Hoàng Đế với màu sắc hoàng gia.",
        categoryName: "Cá Phượng Hoàng",
        price: 480000,
        quantity: 7,
      },
      {
        name: "Cá Lóc Trân Châu",
        image: imagesData[6].url,
        description:
          "Cá Lóc Trân Châu với các chấm trân châu đẹp mắt.",
        categoryName: "Cá Dĩa",
        price: 360000,
        quantity: 11,
      },
      {
        name: "Rêu Bích Cao Cấp",
        image: imagesData[7].url,
        description:
          "Rêu bích nhập khẩu cao cấp cho hồ cá thủy sinh.",
        categoryName: "Tép Thuỷ Sinh",
        price: 150000,
        quantity: 30,
      },
      {
        name: "Demo Product 1",
        image: imagesData[8].url,
        description: "Sản phẩm demo 1 để test hệ thống.",
        categoryName: "Cá Neon",
        price: 100000,
        quantity: 20,
      },
      {
        name: "Demo Product 2",
        image: imagesData[9].url,
        description: "Sản phẩm demo 2 để test hệ thống.",
        categoryName: "Cá Bảy Màu",
        price: 120000,
        quantity: 22,
      },
      {
        name: "Demo Product 3",
        image: imagesData[0].url,
        description: "Sản phẩm demo 3 để test hệ thống.",
        categoryName: "Cá Ali Thái",
        price: 130000,
        quantity: 25,
      },
    ];

    for (const productData of productsData) {
      const existingProduct = await productRepo.findOne({
        where: { name: productData.name },
      });

      if (!existingProduct) {
        // Find category by name
        const category =
          categories.find(
            (c) => c.name === productData.categoryName
          ) ||
          categories[Math.floor(Math.random() * categories.length)];

        // Create product with local image
        const product = productRepo.create({
          name: productData.name,
          price: productData.price,
          image: productData.image,
          description: productData.description,
          quantity: productData.quantity,
          storage: true,
          category: category,
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
    console.log(`   - Products: ${productsData.length}`);
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
