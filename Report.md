# 第四次作业报告

**姓名：** 郭逸晨  
**学号：** <学号>  
**作业名称：** React 商城系统

---

## 1. 组员分工

| 姓名 | 学号 | 分工与产出 | 贡献占比 |
|------|------|-----------|---------|
| 郭逸晨（组长） | <学号> | **项目基础框架搭建与核心架构重构。** 负责全局路由规划与初始化；设计并封装了 Service 接口层与 `ServiceContext` 全局状态注入，实现 UI 层与数据逻辑解耦；重构了数据存储安全，实现按用户名隔离购物车与订单数据；完成全站 hooks 依赖项与 ESLint 规范化修复，优化构建流程；统筹项目集成与报告撰写。 | 20% |
| 谢德钧 | <学号> | **商城前台首屏展示与分类检索开发。** 负责商城首页核心模块（包括轮播图、实时检索框、热门商品列表等）的开发；设计并实现分类页面的“侧边分类栏+右侧商品网格”的双向交互版式；设计并封装了全站复用的 `ProductCard` 商品卡片组件，实现向商品详情的过渡跳转。 | 20% |
| 曹晋豪 | <学号> | **订单系统与模拟支付链路开发。** 负责创建订单页的开发，实现收货人信息收集、结算商品列表渲染与费用实时核算；设计并实现 `PayPage` 支付模拟，包含支付成功状态流转及倒计时重定向；开发 `OrderDetailPage`，通过状态映射机展示待支付、已支付、已发货等多态订单详情。 | 20% |
| 彭新然 | <学号> | **用户认证中心与后台商品管理系统开发。** 开发了前台登录注册表单与“我的”个人中心页面；实现了后台管理登录入口与独立的 admin 身份安全路由拦截守卫；使用 Ant Design 组件库开发了后台商品管理面板，包含 Table 分页列表、Modal 弹窗表单、以及商品的新增、修改、状态开关及删除等完整 CRUD 交互。 | 20% |
| 杨丰竹 | <学号> | **购物车、商品详情交互与全站响应式布局优化。** 负责商品详情页的路径数据读取、库存判定加购、以及直接购买结算通道开发；实现了购物车内商品多选、全选联动、数量微调与异步结算过渡；主导了全站移动端与网页桌面端的响应式媒体查询适配，设计开发了桌面端顶部双级导航组件 `DesktopHeader`，并实现跨 Tab 购物车数量同步。 | 20% |


---

## 2. 项目结构

项目结构与组件拆分说明：

```
App（根组件，含 <Outlet /> 渲染子路由）
├── HomePage           ← 商城主页面（搜索框、轮播图、热门商品）
├── CategoryPage       ← 商品分类页
├── LoginPage          ← 用户登录/注册页
├── DetailPage         ← 商品详情页
├── CreateOrderPage    ← 创建订单页
├── PayPage            ← 支付页面
├── OrderListPage      ← 订单列表页
├── OrderDetailPage    ← 订单详情页
├── AdminLoginPage     ← 后台登录页
└── AdminProductPage   ← 后台商品管理页
```

各页面/组件职责说明：

| 页面/组件 | 职责 |
|-----------|------|
| App | 根组件，全局布局容器，包含路由 Outlet 和底部导航 BottomNav。 |
| HomePage | 商城首页，包含搜索、轮播图展示、热门商品展示。 |
| LoginPage | 用户登录与注册页面，用于前台用户认证。 |
| DetailPage | 商品详情页，展示商品参数与库存，支持加购及立即结算。 |
| CreateOrderPage | 订单创建确认页，供用户确认收货地址与商品清单并生成订单。 |
| PayPage | 模拟支付页面，处理待支付订单的支付流。 |
| OrderListPage | 订单列表展示页，展示用户所有订单及其状态。 |
| OrderDetailPage | 订单详情展示页，用于展示单个订单的详细收货信息及物流状态。 |

## 3. 前台功能实现说明

| 功能模块 | 实现方式 |
|----------|----------|
| 商城主页面（搜索框/轮播图/热门商品） | 使用 antd 图标和原生输入框实现搜索，配合 setInterval 定时器实现轮播图切换，从 goodService 获取热门商品列表渲染。 |
| 商品详情页 | 通过 useParams 获取路由中的商品 id，读取商品信息；支持 InputNumber 调节数量（受库存上限约束），可跳转至购物车或直接跳转下单。 |
| 购物车 | 从 cartService 获取购物车项，使用 Checkbox 进行勾选或全选，使用 InputNumber 动态调节数量，Popconfirm 确认删除。 |
| 创建订单 | 从 sessionStorage 获取结算商品清单，填写表单并调用 orderService.createOrder 创建订单并清除已结算的购物车项。 |
| 支付页面 | 模拟在线支付，根据路由 id 获取订单，点击支付调用 orderService.payOrder 更新订单状态为已支付，记录支付时间。 |
| 订单列表 | 从 orderService 获取所有订单数据，使用 antd List/Card 渲染并展示各订单状态，支持从待支付状态去往支付。 |
| 订单详情 | 展示特定订单 of 收货信息、商品列表、订单状态与支付时间。 |
| 用户登录/注册 | 通过 authService 校验固定账号/密码，成功后将登录态写入 localStorage，并在敏感页面中进行路由拦截。 |

## 4. 后台管理端功能实现说明

| 功能模块 | 实现方式 |
|----------|----------|
| 后台登录 | 使用独立的后台登录页面，验证 admin 身份，调用 authService 写入独立的 admin 登录态。 |
| 权限管理 | 非 admin 角色无法访问后台商品管理路由，组件挂载时进行身份判定，不通过则重定向至 admin 登录页。 |
| 商品管理 / 分类管理 / 订单管理（选填） | 商品管理，使用 antd Table 表格展示商品 ID、名称、价格、库存等；支持 Modal 弹窗结合 Form 表单以新增/编辑商品，支持 Popconfirm 删除商品。 |

## 5. 路由设计

前台与后台路由规划：

```jsx
const router = createBrowserRouter([
  {
    path: "/",
    Component: App,
    children: [
      { index: true, Component: HomePage },
      { path: "category", Component: CategoryPage },
      { path: "cart", Component: CartPage },
      { path: "mine", Component: MinePage },
      { path: "login", Component: LoginPage },
      { path: "detail/:id", Component: DetailPage },
      { path: "order/create", Component: CreateOrderPage },
      { path: "pay/:orderId", Component: PayPage },
      { path: "orders", Component: OrderListPage },
      { path: "order/:orderId", Component: OrderDetailPage },
      { path: "admin/login", Component: AdminLoginPage },
      { path: "admin/products", Component: AdminProductPage },
    ],
  },
]);
```

## 6. 状态管理与数据存储

全局状态的管理方式与数据持久化方案：

- **全局状态管理方式：** `ServiceContext` 全局状态提供器（Context + Service 模式），跨页面共享数据获取和业务处理逻辑。
- **数据存储方式：** `localStorage` 用于持久化商品、购物车和订单数据，`sessionStorage` 用于存储临时结算单信息。
- **前后台数据联动方式：** 前后台共享同一个 `localStorage` 键值（如 `mall_goods`），后台增删改商品后前台界面自动加载最新状态。

## 7. 加分项完成情况

- [x] **数据持久化**：商品、购物车及订单数据存储在 localStorage 中，刷新页面状态不丢失。
- [x] **表单验证**：登录、后台商品新增/编辑表单使用 antd 规则进行完整性的表单校验。
- [x] **分页/无限滚动**：后台商品管理 Table 组件自带分页支持。
- [x] **支付模拟优化**：提供模拟成功支付的确认流，并在支付后更新支付时间与状态。

## 8. 遇到的问题与解决方案

| 问题 | 解决方案 |
|------|----------|
| 刷新页面时购物车或订单状态容易丢失。 | 封装 localStorage 读写辅助工具，在 Service 中统一进行数据的持久化存储，在组件挂载时通过 Service 读取。 |
| 前后台商品数据实时联动。 | 前台首页与后台商品管理均读取相同的 localStorage `mall_goods` 资源，实现新增、编辑商品后前后台无缝同步展示。 |
