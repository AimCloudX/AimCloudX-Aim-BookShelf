import { PrismaClient } from '@prisma/client';

// TypeScript でグローバル変数を利用するための宣言
declare global {
  // すでに prisma というグローバル変数が存在するかチェックします
  // なければ undefined として扱います
  var prisma: PrismaClient | undefined;
}

// すでに global.prisma にインスタンスがあればそれを利用し、
// なければ新たに PrismaClient を生成します。
export const prisma =
  global.prisma ||
  new PrismaClient({
    log: ['query'], // ログを出力したい場合（任意）
  });

// 開発環境（production 以外）の場合のみ、グローバル変数に代入します
if (process.env.NODE_ENV !== 'production') global.prisma = prisma;