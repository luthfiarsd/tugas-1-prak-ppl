const request = require("supertest");
const app = require("../src/app");
const { items } = require("../src/data/store");

beforeEach(() => {
  items.length = 0;
  items.push(
    {
      id: "test-id-1",
      name: "Item Test A",
      category: "Elektronik",
      quantity: 10,
      price: 500000,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "test-id-2",
      name: "Item Test B",
      category: "Furnitur",
      quantity: 5,
      price: 200000,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  );
});

describe("GET /health", () => {
  it("harus mengembalikan status 200 dan pesan sukses", async () => {
    const res = await request(app).get("/health");
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });
});

describe("GET /api/items", () => {
  it("harus mengembalikan semua item", async () => {
    const res = await request(app).get("/api/items");
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.total).toBe(2);
    expect(Array.isArray(res.body.data.items)).toBe(true);
  });

  it("harus bisa filter berdasarkan category", async () => {
    const res = await request(app).get("/api/items?category=Elektronik");
    expect(res.statusCode).toBe(200);
    expect(res.body.data.total).toBe(1);
  });

  it("harus bisa search berdasarkan nama", async () => {
    const res = await request(app).get("/api/items?search=Test A");
    expect(res.statusCode).toBe(200);
    expect(res.body.data.total).toBe(1);
  });
});

describe("GET /api/items/:id", () => {
  it("harus mengembalikan item yang ditemukan", async () => {
    const res = await request(app).get("/api/items/test-id-1");
    expect(res.statusCode).toBe(200);
    expect(res.body.data.id).toBe("test-id-1");
  });

  it("harus mengembalikan 404 jika item tidak ada", async () => {
    const res = await request(app).get("/api/items/tidak-ada");
    expect(res.statusCode).toBe(404);
    expect(res.body.success).toBe(false);
  });
});

describe("POST /api/items", () => {
  it("harus berhasil membuat item baru", async () => {
    const payload = {
      name: "Kursi Gaming",
      category: "Furnitur",
      quantity: 3,
      price: 1500000,
    };
    const res = await request(app).post("/api/items").send(payload);
    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.name).toBe("Kursi Gaming");
    expect(res.body.data.id).toBeDefined();
  });

  it("harus gagal jika body tidak lengkap", async () => {
    const res = await request(app)
      .post("/api/items")
      .send({ name: "Barang Tidak Lengkap" });
    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.errors).toBeDefined();
  });
});

describe("PUT /api/items/:id", () => {
  it("harus berhasil mengupdate item", async () => {
    const payload = {
      name: "Item Updated",
      category: "Elektronik",
      quantity: 20,
      price: 999000,
    };
    const res = await request(app).put("/api/items/test-id-1").send(payload);
    expect(res.statusCode).toBe(200);
    expect(res.body.data.name).toBe("Item Updated");
    expect(res.body.data.quantity).toBe(20);
  });

  it("harus mengembalikan 404 jika item tidak ada", async () => {
    const payload = { name: "X", category: "X", quantity: 1, price: 1 };
    const res = await request(app).put("/api/items/tidak-ada").send(payload);
    expect(res.statusCode).toBe(404);
  });
});

describe("DELETE /api/items/:id", () => {
  it("harus berhasil menghapus item", async () => {
    const res = await request(app).delete("/api/items/test-id-1");
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(items.length).toBe(1);
  });

  it("harus mengembalikan 404 jika item tidak ada", async () => {
    const res = await request(app).delete("/api/items/tidak-ada");
    expect(res.statusCode).toBe(404);
  });
});
