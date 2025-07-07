import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import authOptions from '../../auth/authOptions';
import { connectToDatabase } from '@/lib/mongodb';
import Vendor from '@/models/vendor';

function getIdFromRequest(req: NextRequest) {
  const segments = req.nextUrl.pathname.split('/');
  return segments[segments.length - 1];
}

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  await connectToDatabase();
  const id = getIdFromRequest(req);
  const vendor = await Vendor.findById(id).lean();
  if (!vendor) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(vendor);
}

export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  await connectToDatabase();
  const id = getIdFromRequest(req);
  const data = await req.json();
  const vendor = await Vendor.findByIdAndUpdate(id, data, { new: true });
  if (!vendor) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(vendor);
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  await connectToDatabase();
  const id = getIdFromRequest(req);
  const vendor = await Vendor.findByIdAndDelete(id);
  if (!vendor) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ success: true });
} 