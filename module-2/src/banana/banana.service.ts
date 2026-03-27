import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BananaEntity } from 'src/mysql/schemas/banana.entity';
import { Repository } from 'typeorm';
import { Cache } from '@nestjs/cache-manager';
import { InjectModel } from '@nestjs/mongoose';
import { Cat, CatDocument } from 'src/mongodb/schemas/cat.schema';
import { Model } from 'mongoose';
@Injectable()
export class BananaService {
  constructor(
    @InjectRepository(BananaEntity)
    private readonly bananaRepository: Repository<BananaEntity>,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache, 
    @InjectModel(Cat.name) private catModel: Model<CatDocument>,
  ) {}
  async createBanana(): Promise<void> {
    const tenBanana = [
      "banana1",
      "banana2",
      "banana3",
      "banana4",
      "banana5",
      "banana6",
      "banana7",
      "banana8",
      "banana9",
    ];
    for (const name of tenBanana) {
      const banana = this.bananaRepository.create({
        name: name,
      });
      await this.bananaRepository.save(banana);
    }
  }

  async createCat() {
    const cat = new this.catModel({
      name: 'Whiskers',
      age: 3,
      breed: 'Siamese',
    });
    return cat.save();
  }

  async getBanana() {
    // caching có logic - check xem tồn tại trong cache hay chưa
    // nếu user nào call hàm này => đều phải tìm 11 trái chuối trong DB
    // cực kì tốn thời gian tại vì DB là disk - đọc từ disk là chậm
    // chúng ta phải cache lại kết quả tìm kiếm này
    // tìm xem 11 quả chuối nó đã lưu trong cache redis chưa với key = bananas
    // const cachedBananas = await this.cacheManager.get<BananaEntity[]>(
    //   'bananas'
    // );
    // console.log("result from cache: ", cachedBananas?.length);
    // if (cachedBananas) {
    //   return cachedBananas;
    // } else {
    //   const bananas = await this.bananaRepository.find();
    //   await this.cacheManager.set<BananaEntity[]>(
    //     'bananas',
    //     bananas,
    //     // 60000ms = 10s
    //     10000,
    //   );
    //   return bananas;
    // }
    // cache câu query này lại, nếu mà cache hết hạn thì query lại DB
    return await this.bananaRepository.find({
      cache: {
        id: 'bananas',
        milliseconds: 10000,
      }
    });
    
  }

  async getCat() {
    return await this.catModel.find();
  }
}