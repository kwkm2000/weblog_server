import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { ArticleEntity } from "./articles/article.entity";
import { TagEntity } from "./tags/tag.entity";
import { UserEntity } from "./users/user.entity";
import { ArticleModule } from "./articles/article.module";
import { TagModule } from "./tags/tag.module";
import { AuthModule } from "./auth/auth.module";
import { UsersModule } from "./users/users.module";
import { ConfigModule } from "@nestjs/config";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.ENV}`,
    }),
    TypeOrmModule.forRoot({
      type: "sqlite",
      database:
        process.env.ENV === "test"
          ? "./db/test-db.sqlite.db"
          : "./db/sqlitedb.db",
      entities: [ArticleEntity, TagEntity, UserEntity],
      synchronize: true,
    }),
    ArticleModule,
    TagModule,
    AuthModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
