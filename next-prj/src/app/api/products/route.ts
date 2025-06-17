import { NextResponse } from 'next/server';
import { products } from '@/data/mock';

let productList = [...products];

export async function GET() {
  return NextResponse.json(productList);
}

export async function DELETE(req: Request) {
  const { id } = await req.json();
  productList = productList.filter((p) => p.id !== id);
  return NextResponse.json({ success: true });
}