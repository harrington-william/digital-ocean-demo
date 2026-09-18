#!/usr/bin/env -S node
import type { Contract as End } from '../../snapshots/9e53724ba899ca0c63cfcfa52bf60602e91936d3b4b944c99fba83413406e77a/contract';
import endContract from '../../snapshots/9e53724ba899ca0c63cfcfa52bf60602e91936d3b4b944c99fba83413406e77a/contract.json' with { type: 'json' };
import { Migration, MigrationCLI, col, fn, primaryKey } from '@prisma/orm-postgres/migration';

export default class M extends Migration<never, End> {
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.createSchema({ schema: 'public' }),
      this.createTable({
        schema: 'public',
        table: 'authors',
        columns: [
          col('biography', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('created_at', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
          col('id', 'BIGSERIAL', { notNull: true, codecRef: { codecId: 'pg/int8@1' } }),
          col('name', 'character varying(255)', {
            notNull: true,
            codecRef: { codecId: 'sql/varchar@1', typeParams: { length: 255 } },
          }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'books',
        columns: [
          col('author_id', 'int8', { notNull: true, codecRef: { codecId: 'pg/int8@1' } }),
          col('created_at', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
          col('id', 'BIGSERIAL', { notNull: true, codecRef: { codecId: 'pg/int8@1' } }),
          col('isbn', 'character varying(13)', {
            codecRef: { codecId: 'sql/varchar@1', typeParams: { length: 13 } },
          }),
          col('published_year', 'int2', { codecRef: { codecId: 'pg/int2@1' } }),
          col('title', 'character varying(255)', {
            notNull: true,
            codecRef: { codecId: 'sql/varchar@1', typeParams: { length: 255 } },
          }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.addUnique({
        schema: 'public',
        table: 'books',
        constraint: 'books_isbn_key',
        columns: ['isbn'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'books',
        index: 'idx_books_author_id_f3862461',
        columns: ['author_id'],
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'books',
        foreignKey: {
          name: 'books_author_id_fkey',
          columns: ['author_id'],
          references: { schema: 'public', table: 'authors', columns: ['id'] },
          onDelete: 'restrict',
        },
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
