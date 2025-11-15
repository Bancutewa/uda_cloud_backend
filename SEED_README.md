# Database Seeding

This project includes a database seeding script to populate initial data.

## Usage

To seed the database with initial data, run:

```bash
npm run seed
```

## What gets seeded

### Categories (11 total)
- Cá Neon, Cá Dĩa, Cá Thần Tiên, Cá Chuột, Cá Phượng Hoàng
- Cá Ali Thái, Cá Bảy Màu, Cá Cầu Vòng, Tép Thuỷ Sinh
- Lau Kiếng/Vệ Sinh Hồ, Thức Ăn Cá

### Products (10 total)
Products are created from `mysql/fishimages.json` with meaningful Vietnamese names:

1. **Cá Neon Tetra Đỏ** - Neon Tetra category
2. **Cá Algae Eater Vàng** - Lau Kiếng category  
3. **Cá Pleco Đen** - Lau Kiếng category
4. **Cá Pleco Trắng** - Lau Kiếng category
5. **Cá Corydora Albino** - Cá Chuột category
6. **Cá Pleco Albino** - Lau Kiếng category
7. **Cá Garra Panda** - Cá Dĩa category
8. **Cá Corydora Pepper** - Cá Chuột category
9. **Cá Corydora Albino Hồng** - Cá Chuột category
10. **Cá Corydora Panda** - Cá Chuột category

Each product includes:
- Realistic Vietnamese name and description
- Random price (50k-550k VND)
- Random quantity (10-60 units)
- Images from freshwateraquatica.org
- Appropriate category assignment

### Users (3 total)
- **Admin**: username: `admin`, password: `admin123`
- **John Doe**: username: `johndoe`, password: `password123`  
- **Jane Smith**: username: `janesmith`, password: `password123`

Each user gets an associated shopping cart.

## Notes

- The script checks for existing data and only creates new records
- Passwords are stored in plain text for development purposes
- In production, implement proper password hashing
- Images are sourced from external URLs (freshwateraquatica.org)
- Categories are intelligently assigned based on fish types

## File Structure

```
backend/
├── src/scripts/
│   └── seed.ts          # Main seeding script
├── mysql/
│   └── fishimages.json  # Product image data source
└── .env                 # Database configuration
```
