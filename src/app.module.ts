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

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "sqlite",
      database: "./db/sqlitedb.db",
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
