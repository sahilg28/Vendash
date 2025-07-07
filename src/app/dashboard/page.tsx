'use client';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';

type Vendor = {
  _id: string;
  vendorName: string;
  bankAccountNo: number;
  bankName: string;
};

const PAGE_SIZE = 10;

const DashboardPage = () => {
  const { status } = useSession();
  const router = useRouter();
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  // Delete modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedVendorId, setSelectedVendorId] = useState<string | null>(null);
  const [deleteInput, setDeleteInput] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(false);
  const deleteInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (status === 'unauthenticated') router.replace('/');
  }, [status, router]);

  useEffect(() => {
    if (status === 'authenticated') fetchVendors();
  }, [page, status]);

  const fetchVendors = async () => {
    setLoading(true);
    const res = await fetch(`/api/vendors?page=${page}&limit=${PAGE_SIZE}`);
    const data = await res.json();
    setVendors(data.vendors);
    setTotal(data.total);
    setLoading(false);
  };

  const openDeleteModal = (id: string) => {
    setSelectedVendorId(id);
    setDeleteInput('');
    setShowDeleteModal(true);
    setTimeout(() => deleteInputRef.current?.focus(), 100);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setSelectedVendorId(null);
    setDeleteInput('');
    setDeleteLoading(false);
  };

  const handleDelete = async () => {
    if (!selectedVendorId) return;
    setDeleteLoading(true);
    await fetch(`/api/vendors/${selectedVendorId}`, { method: 'DELETE' });
    closeDeleteModal();
    fetchVendors();
  };

  // Trap focus in modal
  useEffect(() => {
    if (showDeleteModal) {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') closeDeleteModal();
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [showDeleteModal]);

  if (status !== 'authenticated') return null;

  return (
    <main className="p-0 w-full min-h-screen">
      {/* Header */}
      <header className="w-full flex justify-between items-center px-4 sm:px-8 py-4 bg-white shadow mb-6 rounded-b-xl">
        <span className="text-xl font-bold text-gray-800" tabIndex={0} aria-label="Vendash">Vendash</span>
        <div className="flex gap-2">
          <button
            onClick={() => router.push('/add-vendor')}
            className="px-4 py-2 bg-green-600 text-white rounded-full text-base font-semibold border-2 border-transparent hover:bg-white hover:text-green-600 hover:border-green-600 transition-colors duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-green-400 cursor-pointer"
            aria-label="Add Vendor"
            tabIndex={0}
          >
            Add Vendor
          </button>
          <button
            onClick={() => signOut()}
            className="px-4 py-2 bg-red-600 text-white rounded-full text-base font-semibold border-2 border-transparent hover:bg-white hover:text-red-600 hover:border-red-600 transition-colors duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-red-400 cursor-pointer"
            aria-label="Logout"
            tabIndex={0}
          >
            Logout
          </button>
        </div>
      </header>
      <div className="overflow-x-auto w-full px-2 sm:px-8">
        <table className="min-w-full bg-white rounded shadow">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left">S.No</th>
              <th className="px-4 py-2 text-left">Vendor Name</th>
              <th className="px-4 py-2 text-left">Account No</th>
              <th className="px-4 py-2 text-left">Bank Name</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} className="text-center py-4">Loading...</td></tr>
            ) : vendors.length === 0 ? (
              <tr><td colSpan={5} className="text-center py-4">No vendors found.</td></tr>
            ) : vendors.map((v, idx) => (
              <tr key={v._id} className="border-t">
                <td className="px-4 py-2">{(page - 1) * PAGE_SIZE + idx + 1}</td>
                <td className="px-4 py-2">{v.vendorName}</td>
                <td className="px-4 py-2">{v.bankAccountNo}</td>
                <td className="px-4 py-2">{v.bankName}</td>
                <td className="px-4 py-2 flex gap-2 justify-center">
                  <button
                    onClick={() => router.push(`/edit-vendor/${v._id}`)}
                    className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 cursor-pointer"
                    aria-label={`Edit ${v.vendorName}`}
                    tabIndex={0}
                  >Edit</button>
                  <button
                    onClick={() => openDeleteModal(v._id)}
                    className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 cursor-pointer"
                    aria-label={`Delete ${v.vendorName}`}
                    tabIndex={0}
                  >Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-between items-center mt-4 px-2 sm:px-8 w-full">
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50 cursor-pointer"
          aria-label="Previous Page"
          tabIndex={0}
        >Prev</button>
        <span>Page {page} of {Math.ceil(total / PAGE_SIZE) || 1}</span>
        <button
          onClick={() => setPage((p) => (p * PAGE_SIZE < total ? p + 1 : p))}
          disabled={page * PAGE_SIZE >= total}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50 cursor-pointer"
          aria-label="Next Page"
          tabIndex={0}
        >Next</button>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-sm flex flex-col items-center relative animate-fade-in">
            <h2 className="text-xl font-bold mb-2 text-black">Delete Vendor Details</h2>
            <p className="text-gray-700 mb-2 text-center">Are you sure you want to delete this data?<span className="font-semibold text-red-600"> This action cannot be undone.</span></p>
            <p className="text-gray-700 mb-2 text-center text-sm">Type <span className="font-mono font-bold">DELETE</span> below to confirm.</p>
            <input
              ref={deleteInputRef}
              value={deleteInput}
              onChange={e => setDeleteInput(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-red-200 text-center"
              aria-label="Type DELETE to confirm deletion"
              tabIndex={0}
              autoFocus
            />
            <div className="flex gap-2 w-full">
              <button
                onClick={closeDeleteModal}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-full border-2 border-transparent hover:bg-white hover:text-gray-900 hover:border-gray-400 transition-colors duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-gray-300 cursor-pointer"
                aria-label="Cancel"
                tabIndex={0}
                disabled={deleteLoading}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-full border-2 border-transparent hover:bg-white hover:text-red-600 hover:border-red-600 transition-colors duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-red-400 cursor-pointer disabled:opacity-50"
                aria-label="Confirm Delete"
                tabIndex={0}
                disabled={deleteInput !== 'DELETE' || deleteLoading}
              >
                {deleteLoading ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default DashboardPage; 