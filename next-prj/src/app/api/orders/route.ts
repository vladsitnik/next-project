import { NextRequest, NextResponse } from 'next/server';
import { orders } from '@/data/mock';

let orderList = [...orders];

export async function GET() {
  return NextResponse.json(orderList);
}

export async function DELETE(req: NextRequest) {
  const body = await req.json();
  const { id } = body;

  if (!id) {
    return NextResponse.json({ error: 'Missing id' }, { status: 400 });
  }

  orderList = orderList.filter((order) => order.id !== id);

  return NextResponse.json({ message: `Order ${id} deleted.` });
}