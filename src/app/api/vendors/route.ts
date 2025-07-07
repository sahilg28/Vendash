import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import authOptions from '../auth/authOptions';
import { connectToDatabase } from '@/lib/mongodb';
import Vendor from '@/models/vendor';

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await connectToDatabase();
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '10', 10);
  const skip = (page - 1) * limit;

  const [vendors, total] = await Promise.all([
    Vendor.find().skip(skip).limit(limit).lean(),
    Vendor.countDocuments(),
  ]);

  return NextResponse.json({ vendors, total });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await connectToDatabase();
  const data = await req.json();
  const vendor = await Vendor.create(data);
  return NextResponse.json(vendor, { status: 201 });
} 