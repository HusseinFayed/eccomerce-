import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import mongoose, { connection, Connection, Types } from 'mongoose';
import { cart, category, product } from './data/product.testData';
import { CartService } from '../src/cart/cart.service';
import { Cart, CartSchema } from '../src/cart/cart.model';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from '../src/product/product.model';
let dbConnection: Connection;
let httpServer: any;


describe('ProductController E2E Test', () => {
  let app: INestApplication;
  jest.setTimeout(20000)
  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    httpServer = app.getHttpServer()
    await app.init();
  });

  afterAll(async () => {
    await connection.close();
    await app.close()
    await httpServer.close()
  });

  // describe('create product',()=>{
  //   it('create valid product ', () => {
  //     return request(app.getHttpServer())
  //       .post('/add-product')
  //       .send(product)
  //       .expect(200)
  //   });
  //   it('create invalid product ', () => {
  //     return request(app.getHttpServer())
  //       .post('/add-product')
  //       .send({...product, price: 0})
  //       .expect(400)
  //   });
  //   it('get product by name valid',()=>{
  //     return request(app.getHttpServer())
  //     .get(`/get-productByName_en/${product.name_en}`)
  //     .expect(200)
  //   })
  //   it('get product by name invalid',()=>{
  //     return request(app.getHttpServer())
  //     .get(`/get-productByName_en/xxxx`)
  //     .expect(400)
  //   })
  //   it('delete product valid',()=>{
  //     return request(app.getHttpServer())
  //     .delete(`/delete-productByName_en/${product.name_en}`)
  //     .expect(200)
  //   })
  //   it('delete product invalid',()=>{
  //     return request(app.getHttpServer())
  //     .delete("/delete-productByName_en/xxxx")
  //     .expect(400)
  //   })
  // }
  // )

  // describe('create category',()=>{
  //   it('create valid category', async() =>{
  //     return request(app.getHttpServer())
  //     .post('/add-category')
  //       .send(category)
  //       .expect(200)
  //   })
  //   it('create invalid category ', async() => {
  //     return request(app.getHttpServer())
  //       .post('/add-category')
  //       .send({name_ar:"افغاف",name_en:"" })
  //       .expect(400)
  //   });
  //   it('get category by name valid',()=>{
  //     return request(app.getHttpServer())
  //     .get(`/get-categoryByName_en/${category.name_en}`)
  //     .expect(200)
  //   })
  //   it('get category by name invalid',()=>{
  //     return request(app.getHttpServer())
  //     .get(`/get-categoryByName_en/xxxx`)
  //     .expect(400)
  //   })
  //   it('delete category valid',()=>{
  //     return request(app.getHttpServer())
  //     .delete(`/delete-categoryByName_en/${category.name_en}`)
  //     .expect(200)
  //   })
  //   it('delete category invalid',()=>{
  //     return request(app.getHttpServer())
  //     .delete("/delete-categoryByName_en/xxxx")
  //     .expect(400)
  //   })
  // })

  describe('Add to cart', ()=>{
    it('create a valid cart',async()=>{
      await mongoose.connect('mongodb://127.0.0.1:27017/eccomerce');
      mongoose.model("products", ProductSchema)
      const productss = await connection.model<Product>('products').findOne({where:{_id:cart.productId}})
      return request(app.getHttpServer())
      .post("/add-to-cart")
      .send( {...cart, price: productss.price, total_price: productss.price * cart.qty})
      .expect(200)
    })
  })
});
