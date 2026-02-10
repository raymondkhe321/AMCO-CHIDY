import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import type { Product, BankDetails } from '../../types';
import { mockProducts, categoryStructure } from '../../mocks/products';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<'products' | 'settings'>('products');
  const [products, setProducts] = useState<Product[]>([]);
  const [bankDetails, setBankDetails] = useState<BankDetails>({
    bankName: 'First National Bank',
    accountNumber: '1234567890',
    accountHolder: 'Amco Chidy Electricals Ltd'
  });
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showProductForm, setShowProductForm] = useState(false);

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
      return;
    }

    const storedProducts = localStorage.getItem('amco_products');
    if (storedProducts) {
      setProducts(JSON.parse(storedProducts));
    } else {
      setProducts(mockProducts);
      localStorage.setItem('amco_products', JSON.stringify(mockProducts));
    }

    const storedBank = localStorage.getItem('amco_bank_details');
    if (storedBank) {
      setBankDetails(JSON.parse(storedBank));
    }
  }, [user, navigate]);

  const handleSaveProduct = (product: Product) => {
    let updatedProducts;
    if (editingProduct) {
      updatedProducts = products.map(p => p.id === product.id ? product : p);
    } else {
      updatedProducts = [...products, { ...product, id: `prod-${Date.now()}` }];
    }
    setProducts(updatedProducts);
    localStorage.setItem('amco_products', JSON.stringify(updatedProducts));
    setShowProductForm(false);
    setEditingProduct(null);
  };

  const handleDeleteProduct = (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      const updatedProducts = products.filter(p => p.id !== id);
      setProducts(updatedProducts);
      localStorage.setItem('amco_products', JSON.stringify(updatedProducts));
    }
  };

  const handleSaveBankDetails = () => {
    localStorage.setItem('amco_bank_details', JSON.stringify(bankDetails));
    alert('Bank details updated successfully!');
  };

  if (!user || user.role !== 'admin') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 sm:space-x-4">
              <img 
                src="https://static.readdy.ai/image/a4e157aaaac222b76662ac0a94f2add0/92f5c613d29f43e3fe672a20b23e905d.jpeg" 
                alt="Amco Chidy Electricals" 
                className="h-8 sm:h-10 lg:h-12 w-auto"
              />
              <h1 className="text-base sm:text-xl lg:text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <button
                onClick={() => navigate('/')}
                className="text-gray-600 hover:text-amber-600 transition-colors whitespace-nowrap text-sm sm:text-base"
              >
                <i className="ri-home-line mr-1 sm:mr-2"></i>
                <span className="hidden sm:inline">View Site</span>
              </button>
              <button
                onClick={logout}
                className="bg-red-600 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg hover:bg-red-700 transition-colors whitespace-nowrap text-sm sm:text-base"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Tabs */}
        <div className="flex space-x-2 sm:space-x-4 mb-6 sm:mb-8 border-b border-gray-200 overflow-x-auto">
          <button
            onClick={() => setActiveTab('products')}
            className={`px-4 sm:px-6 py-2 sm:py-3 font-medium transition-colors whitespace-nowrap text-sm sm:text-base ${
              activeTab === 'products'
                ? 'text-amber-600 border-b-2 border-amber-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <i className="ri-shopping-bag-line mr-1 sm:mr-2"></i>
            Products
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-4 sm:px-6 py-2 sm:py-3 font-medium transition-colors whitespace-nowrap text-sm sm:text-base ${
              activeTab === 'settings'
                ? 'text-amber-600 border-b-2 border-amber-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <i className="ri-settings-line mr-1 sm:mr-2"></i>
            Bank Settings
          </button>
        </div>

        {/* Products Tab */}
        {activeTab === 'products' && (
          <div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Product Management</h2>
              <button
                onClick={() => {
                  setEditingProduct(null);
                  setShowProductForm(true);
                }}
                className="bg-amber-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg hover:bg-amber-700 transition-colors whitespace-nowrap text-sm sm:text-base w-full sm:w-auto"
              >
                <i className="ri-add-line mr-1 sm:mr-2"></i>
                Add Product
              </button>
            </div>

            {showProductForm ? (
              <ProductForm
                product={editingProduct}
                onSave={handleSaveProduct}
                onCancel={() => {
                  setShowProductForm(false);
                  setEditingProduct(null);
                }}
              />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {products.map(product => (
                  <div key={product.id} className="bg-white rounded-xl shadow-md overflow-hidden">
                    <div className="relative w-full h-40 sm:h-48 bg-gray-100">
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                      {product.featured && (
                        <div className="absolute top-2 right-2 bg-amber-600 text-white px-2 py-1 rounded text-xs font-semibold">
                          Featured
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 mb-1 text-sm sm:text-base line-clamp-2">{product.name}</h3>
                      <p className="text-xs sm:text-sm text-gray-500 mb-2">{product.category}</p>
                      <p className="text-base sm:text-lg font-bold text-amber-600 mb-3">${product.price.toLocaleString()}</p>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => {
                            setEditingProduct(product);
                            setShowProductForm(true);
                          }}
                          className="flex-1 bg-blue-600 text-white px-2 sm:px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors text-xs sm:text-sm whitespace-nowrap"
                        >
                          <i className="ri-edit-line mr-1"></i>
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product.id)}
                          className="flex-1 bg-red-600 text-white px-2 sm:px-3 py-2 rounded-lg hover:bg-red-700 transition-colors text-xs sm:text-sm whitespace-nowrap"
                        >
                          <i className="ri-delete-bin-line mr-1"></i>
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="max-w-2xl">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Bank Transfer Settings</h2>
            <div className="bg-white rounded-xl shadow-md p-5 sm:p-6">
              <div className="space-y-4 sm:space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bank Name
                  </label>
                  <input
                    type="text"
                    value={bankDetails.bankName}
                    onChange={(e) => setBankDetails({ ...bankDetails, bankName: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Account Number
                  </label>
                  <input
                    type="text"
                    value={bankDetails.accountNumber}
                    onChange={(e) => setBankDetails({ ...bankDetails, accountNumber: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Account Holder Name
                  </label>
                  <input
                    type="text"
                    value={bankDetails.accountHolder}
                    onChange={(e) => setBankDetails({ ...bankDetails, accountHolder: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
                  />
                </div>

                <button
                  onClick={handleSaveBankDetails}
                  className="w-full bg-amber-600 text-white py-3 rounded-lg hover:bg-amber-700 transition-colors font-semibold whitespace-nowrap text-sm sm:text-base"
                >
                  Save Bank Details
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ProductForm({ 
  product, 
  onSave, 
  onCancel 
}: { 
  product: Product | null; 
  onSave: (product: Product) => void; 
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState<Product>(
    product || {
      id: '',
      name: '',
      price: 0,
      category: 'Industrial Electrical Materials',
      subCategory: '',
      description: '',
      specifications: '',
      images: [''],
      featured: false,
      available: true
    }
  );

  const [availableSubCategories, setAvailableSubCategories] = useState<string[]>([]);

  useEffect(() => {
    // Update available sub-categories when category changes
    if (formData.category && categoryStructure[formData.category as keyof typeof categoryStructure]) {
      setAvailableSubCategories(categoryStructure[formData.category as keyof typeof categoryStructure]);
      // Reset sub-category if it's not valid for the new category
      if (!categoryStructure[formData.category as keyof typeof categoryStructure].includes(formData.subCategory)) {
        setFormData(prev => ({ ...prev, subCategory: '' }));
      }
    }
  }, [formData.category]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.subCategory) {
      alert('Please select a sub-category');
      return;
    }
    onSave(formData);
  };

  const handleImageChange = (index: number, value: string) => {
    const newImages = [...formData.images];
    newImages[index] = value;
    setFormData({ ...formData, images: newImages });
  };

  const addImageField = () => {
    setFormData({ ...formData, images: [...formData.images, ''] });
  };

  const removeImageField = (index: number) => {
    const newImages = formData.images.filter((_, i) => i !== index);
    setFormData({ ...formData, images: newImages });
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-4 sm:p-6">
      <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6">
        {product ? 'Edit Product' : 'Add New Product'}
      </h3>
      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Price ($) *
            </label>
            <input
              type="number"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Parent Category *
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
              required
            >
              {Object.keys(categoryStructure).map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sub-Category *
            </label>
            <select
              value={formData.subCategory}
              onChange={(e) => setFormData({ ...formData, subCategory: e.target.value })}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
              required
            >
              <option value="">Select Sub-Category</option>
              {availableSubCategories.map(subCat => (
                <option key={subCat} value={subCat}>{subCat}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description *
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={4}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Specifications
          </label>
          <textarea
            value={formData.specifications}
            onChange={(e) => setFormData({ ...formData, specifications: e.target.value })}
            rows={3}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
          />
        </div>

        {/* Product Images */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Product Images *
          </label>
          {formData.images.map((image, index) => (
            <div key={index} className="flex items-center space-x-2 mb-2">
              <input
                type="url"
                value={image}
                onChange={(e) => handleImageChange(index, e.target.value)}
                className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
                placeholder="https://example.com/image.jpg"
                required
              />
              {formData.images.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeImageField(index)}
                  className="px-3 py-3 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors whitespace-nowrap"
                >
                  <i className="ri-delete-bin-line"></i>
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addImageField}
            className="mt-2 text-amber-600 hover:text-amber-700 text-sm font-medium whitespace-nowrap"
          >
            <i className="ri-add-line mr-1"></i>
            Add Another Image
          </button>
        </div>

        {/* Optional Product Variations */}
        {formData.category === 'Cables' && (
          <div className="border-t pt-4 sm:pt-6">
            <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Cable Specifications</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Available Sizes (comma-separated)
                </label>
                <input
                  type="text"
                  value={formData.sizes?.join(', ') || ''}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    sizes: e.target.value.split(',').map(s => s.trim()).filter(s => s) 
                  })}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
                  placeholder="e.g., 4x16mm², 4x25mm², 4x35mm²"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Voltage Rating
                </label>
                <input
                  type="text"
                  value={formData.voltageRating || ''}
                  onChange={(e) => setFormData({ ...formData, voltageRating: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
                  placeholder="e.g., 0.6/1kV"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Thickness
                </label>
                <input
                  type="text"
                  value={formData.thickness || ''}
                  onChange={(e) => setFormData({ ...formData, thickness: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Usage Type
                </label>
                <input
                  type="text"
                  value={formData.usageType || ''}
                  onChange={(e) => setFormData({ ...formData, usageType: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
                  placeholder="e.g., Underground/Industrial"
                />
              </div>
            </div>
          </div>
        )}

        {formData.category === 'Outdoor Lights' && (
          <div className="border-t pt-4 sm:pt-6">
            <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Outdoor Light Options</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Available Colors (comma-separated)
                </label>
                <input
                  type="text"
                  value={formData.colors?.join(', ') || ''}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    colors: e.target.value.split(',').map(s => s.trim()).filter(s => s) 
                  })}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
                  placeholder="e.g., Black, Bronze, Silver"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Lighting Temperatures (comma-separated)
                </label>
                <input
                  type="text"
                  value={formData.lightingTemperatures?.join(', ') || ''}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    lightingTemperatures: e.target.value.split(',').map(s => s.trim()).filter(s => s) 
                  })}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
                  placeholder="e.g., 3000K Warm White, 4000K Natural White"
                />
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={formData.featured}
              onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
              className="w-5 h-5 text-amber-600 rounded focus:ring-amber-500"
            />
            <span className="ml-2 text-sm font-medium text-gray-700">Featured Product</span>
          </label>

          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={formData.available}
              onChange={(e) => setFormData({ ...formData, available: e.target.checked })}
              className="w-5 h-5 text-amber-600 rounded focus:ring-amber-500"
            />
            <span className="ml-2 text-sm font-medium text-gray-700">Available</span>
          </label>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <button
            type="submit"
            className="flex-1 bg-amber-600 text-white py-3 rounded-lg hover:bg-amber-700 transition-colors font-semibold whitespace-nowrap text-sm sm:text-base"
          >
            {product ? 'Update Product' : 'Add Product'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 transition-colors font-semibold whitespace-nowrap text-sm sm:text-base"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
