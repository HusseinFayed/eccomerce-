import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import mongoose, { connection, Connection, Types } from 'mongoose';
import { cart, category, product, user } from './data/product.testData';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from '../src/models/product.model';
import { JwtService } from '@nestjs/jwt';
import { DatabaseService } from '../src/database/databse.service';
let dbConnection: Connection;
let httpServer: any;
// let token;


describe('ProductController E2E Test', () => {
  let app: INestApplication;
  jest.setTimeout(20000)
  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    // dbConnection = moduleFixture.get<DatabaseService>(DatabaseService).getDbHandle();
    
    app = moduleFixture.createNestApplication();
    httpServer = app.getHttpServer()
    await app.init();
  });

  //   beforeAll(async () => {
  //     const jwtService = new JwtService()
  //     token = await jwtService.sign({
  //       name: user.username,
  //   })
  // });


  afterAll(async () => {
    await connection.close();
    await app.close()
    await httpServer.close()
  });

  describe('create product', () => {
    it('create valid product ', () => {
      return request(app.getHttpServer())
        .post('/add-product')
        .set({
          authorization: `Bearer ${user.token}`
        })
        .send(product)
        .expect(200)
    });
    it('create invalid product ', () => {
      return request(app.getHttpServer())
        .post('/add-product')
        .set({
          authorization: `Bearer ${user.token}`
        })
        .send({ ...product, price: 0 })
        .expect(400)
    });
    it('get product by name valid', () => {
      return request(app.getHttpServer())
        .get(`/get-productByName_en/${product.name_en}`)
        .expect(200)
    })
    it('get product by name invalid', () => {
      return request(app.getHttpServer())
        .get(`/get-productByName_en/xxxx`)
        .expect(400)
    })
    it('delete product valid', () => {
      return request(app.getHttpServer())
        .delete(`/delete-productByName_en/${product.name_en}`)
        .set({
          authorization: `Bearer ${user.token}`
        })
        .expect(200)
    })
    it('delete product invalid', () => {
      return request(app.getHttpServer())
        .delete("/delete-productByName_en/xxxx")
        .set({
          authorization: `Bearer ${user.token}`
        })
        .expect(400)
    })
  }
  )

  describe('create category', () => {
    it('create valid category', async () => {
      return request(app.getHttpServer())
        .post('/add-category')
        .set({
          authorization: `Bearer ${user.token}`
        })
        .send(category)
        .expect(200)
    })
    it('create invalid category ', async () => {
      return request(app.getHttpServer())
        .post('/add-category')
        .set({
          authorization: `Bearer ${user.token}`
        })
        .send({ name_ar: "افغاف", name_en: "" })
        .expect(400)
    });
    it('get category by name valid', () => {
      return request(app.getHttpServer())
        .get(`/get-categoryByName_en/${category.name_en}`)
        .expect(200)
    })
    it('get category by name invalid', () => {
      return request(app.getHttpServer())
        .get(`/get-categoryByName_en/xxxx`)
        .expect(400)
    })
    it('delete category valid', () => {
      return request(app.getHttpServer())
        .delete(`/delete-categoryByName_en/${category.name_en}`)
        .expect(200)
    })
    it('delete category invalid', () => {
      return request(app.getHttpServer())
        .delete("/delete-categoryByName_en/xxxx")
        .expect(400)
    })
  })

  describe('Add to cart', () => {
    it('create a valid cart', async () => {
      await mongoose.connect('mongodb://127.0.0.1:27017/eccomerce');
      mongoose.model("products", ProductSchema)
      const productss = await connection.model<Product>('products').findOne({ where: { _id: cart.productId } })
      return request(app.getHttpServer())
        .post("/add-to-cart")
        .set({
          authorization: `Bearer ${user.token}`
        })
        .send({ ...cart, price: productss.price, total_price: productss.price * cart.qty })
        .expect(200)
    })
  })

})