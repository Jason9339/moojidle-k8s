# Express Server

## Set-up instruction

### for the first time

1. `npm i`
2. set your `.env` file according to `.env.example`
3. make sure you load the schema and seed to mongoDB
4. `npm run dev`

### after init set up

1. `npm run dev`

## Testing

### Quick Commands

```bash
# 執行所有測試（一次性）
npm test

# 執行測試並持續監聽文件變化
npm run test:watch

# 執行測試並顯示覆蓋率報告
npm run test:coverage

# 啟動 UI 界面查看測試結果
npm run test:ui
```

### Documentation

For detailed testing documentation and guidelines, please see:
- **[📚 Testing Documentation](./docs/testing/README.md)** - Complete testing guide
- **[⚡ Quick Start Testing](./docs/testing/TESTING_QUICKSTART.md)** - 5-minute guide to add tests for new features

## File Structure

```
backend
├── src
│   ├── controllers
│   │   └── example_controller.js
│   ├── routes
│   │   └── example_route.js
│   ├── services
│   │   └── example_service.js
│   └── database.js
├── docs/testing          # Testing documentation
├── tests/                # Test files
├── README.md
├── jsconfig.json
├── main.js
├── package-lock.json
├── package.json
└── .env.example
```
