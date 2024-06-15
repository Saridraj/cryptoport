import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { User } from 'src/entity/user.entity';
import { Portfolio } from 'src/entity/portfolio.entity';

export const typeOrmConfig: TypeOrmModuleOptions = {

    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'root',
    password: 'admin123456',
    database: 'kryptodian',
    entities: [
      __dirname + '/../**/*.entity.{js,ts}'
    ],
    synchronize: true,

};
