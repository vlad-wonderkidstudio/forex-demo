import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateAssetAndPointTables1728503749566 implements MigrationInterface {
    name = 'CreateAssetAndPointTables1728503749566'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "asset" ("id" SERIAL NOT NULL, "symbol" character varying NOT NULL, CONSTRAINT "PK_1209d107fe21482beaea51b745e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "point" ("id" SERIAL NOT NULL, "timestamp" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "value" double precision NOT NULL, "assetId" integer NOT NULL, CONSTRAINT "PK_391f59a9491a08961038a615371" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "point" ADD CONSTRAINT "FK_c42edf8d2cc48c20816adbae31c" FOREIGN KEY ("assetId") REFERENCES "asset"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);

        const seedSQL = `INSERT INTO "asset" (id, symbol) VALUES `
        + `(1, 'EURUSD'), `
        + `(2, 'USDJPY'), `
        + `(3, 'GBPUSD'), `
        + `(4, 'AUDUSD'), `
        + `(5, 'USDCAD') `;
        await queryRunner.query(seedSQL);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "point" DROP CONSTRAINT "FK_c42edf8d2cc48c20816adbae31c"`);
        await queryRunner.query(`DROP TABLE "point"`);
        await queryRunner.query(`DROP TABLE "asset"`);
    }

}
