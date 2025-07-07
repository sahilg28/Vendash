'use client';
import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

const EditVendorPage = () => {
  const { status } = useSession();
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  const [form, setForm] = useState({
    vendorName: '',
    bankAccountNo: '',
    bankName: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    country: '',
    zipCode: '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') router.replace('/');
  }, [status, router]);

  useEffect(() => {
    if (status === 'authenticated' && id) fetchVendor();
  }, [id, status]);

  const fetchVendor = async () => {
    setLoading(true);
    const res = await fetch(`/api/vendors/${id}`);
    if (res.ok) {
      const data = await res.json();
      setForm({
        vendorName: data.vendorName || '',
        bankAccountNo: data.bankAccountNo?.toString() || '',
        bankName: data.bankName || '',
        addressLine1: data.addressLine1 || '',
        addressLine2: data.addressLine2 || '',
        city: data.city || '',
        country: data.country || '',
        zipCode: data.zipCode?.toString() || '',
      });
    }
    setLoading(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await fetch(`/api/vendors/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...form,
        bankAccountNo: Number(form.bankAccountNo),
        zipCode: Number(form.zipCode),
      }),
    });
    setLoading(false);
    router.push('/dashboard');
  };

  if (status !== 'authenticated') return null;

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 px-2">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white rounded-2xl shadow-xl flex flex-col items-center px-8 py-10"
        aria-label="Edit Vendor Form"
      >
        <button
          type="button"
          onClick={() => router.push('/dashboard')}
          className="mb-6 px-4 py-2 bg-gray-200 text-gray-700 rounded-full border-2 border-transparent hover:bg-white hover:text-gray-900 hover:border-gray-400 transition-colors duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-gray-300 cursor-pointer"
          aria-label="Back to Dashboard"
          tabIndex={0}
        >
          ← Back to Dashboard
        </button>
        <h1 className="text-2xl font-bold mb-6 text-gray-900">Edit Vendor</h1>
        <div className="w-full mb-4">
          <label className="block mb-1 font-medium text-gray-700" htmlFor="vendorName">Vendor Name*</label>
          <input
            id="vendorName"
            name="vendorName"
            type="text"
            required
            value={form.vendorName}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
            aria-label="Vendor Name"
            tabIndex={0}
          />
        </div>
        <div className="w-full mb-4">
          <label className="block mb-1 font-medium text-gray-700" htmlFor="bankAccountNo">Bank Account No*</label>
          <input
            id="bankAccountNo"
            name="bankAccountNo"
            type="number"
            required
            value={form.bankAccountNo}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
            aria-label="Bank Account No"
            tabIndex={0}
          />
        </div>
        <div className="w-full mb-4">
          <label className="block mb-1 font-medium text-gray-700" htmlFor="bankName">Bank Name*</label>
          <input
            id="bankName"
            name="bankName"
            type="text"
            required
            value={form.bankName}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
            aria-label="Bank Name"
            tabIndex={0}
          />
        </div>
        <div className="w-full mb-4">
          <label className="block mb-1 font-medium text-gray-700" htmlFor="addressLine1">Address Line 1*</label>
          <input
            id="addressLine1"
            name="addressLine1"
            type="text"
            required
            value={form.addressLine1}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
            aria-label="Address Line 1"
            tabIndex={0}
          />
        </div>
        <div className="w-full mb-4">
          <label className="block mb-1 font-medium text-gray-700" htmlFor="addressLine2">Address Line 2</label>
          <input
            id="addressLine2"
            name="addressLine2"
            type="text"
            value={form.addressLine2}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
            aria-label="Address Line 2"
            tabIndex={0}
          />
        </div>
        <div className="w-full mb-4">
          <label className="block mb-1 font-medium text-gray-700" htmlFor="city">City*</label>
          <input
            id="city"
            name="city"
            type="text"
            required
            value={form.city}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
            aria-label="City"
            tabIndex={0}
          />
        </div>
        <div className="w-full mb-4">
          <label className="block mb-1 font-medium text-gray-700" htmlFor="country">Country*</label>
          <input
            id="country"
            name="country"
            type="text"
            required
            value={form.country}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
            aria-label="Country"
            tabIndex={0}
          />
        </div>
        <div className="w-full mb-6">
          <label className="block mb-1 font-medium text-gray-700" htmlFor="zipCode">Zip Code*</label>
          <input
            id="zipCode"
            name="zipCode"
            type="number"
            required
            value={form.zipCode}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
            aria-label="Zip Code"
            tabIndex={0}
          />
        </div>
        <button
          type="submit"
          className="w-full py-3 bg-green-600 text-white rounded-full text-lg font-semibold border-2 border-transparent hover:bg-white hover:text-green-600 hover:border-green-600 transition-colors duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-green-400 cursor-pointer"
          aria-label="Save Vendor"
          tabIndex={0}
          disabled={loading}
        >
          {loading ? 'Saving...' : 'Save Vendor'}
        </button>
      </form>
    </main>
  );
};

export default EditVendorPage; 