
import React, { useState, useEffect } from 'react';
import { db, storage, deleteProduct } from '../firebase';
import { collection, onSnapshot, addDoc, updateDoc, doc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Product } from '../types';
import SEO from '../components/SEO';
import { PlusIcon, SearchIcon, XIcon, TrashIcon } from '../components/icons/Icons';

const AdminProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Partial<Product> | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    setLoading(true);
    
    if (!db) {
        // Manejo para modo "Demo" sin DB real
        setError(null); 
        setLoading(false);
        return;
    }

    try {
        const unsubscribe = onSnapshot(collection(db, 'products'), (snapshot) => {
            const productsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
            setProducts(productsData);
            setLoading(false);
        }, (err) => {
            console.error("Error fetching products:", err);
            setError("No se pudo cargar el inventario en tiempo real.");
            setLoading(false);
        });
        return () => unsubscribe();
    } catch (err) {
        console.error("Firebase Error:", err);
        setError("Error de conexión.");
        setLoading(false);
    }
  }, []);

  const openModal = (product: Partial<Product> | null = null) => {
    setCurrentProduct(product || { name: '', category: '', price: 0, stock: 0, description: '', inStock: true });
    setImageFile(null);
    setIsModalOpen(true);
  };

  const handleModalChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    if (currentProduct) {
      const { name, value, type } = e.target;
      // @ts-ignore
      if (type === 'checkbox' && e.target.checked !== undefined) {
        // @ts-ignore
        setCurrentProduct({ ...currentProduct, [name]: e.target.checked });
      } else {
        setCurrentProduct({ ...currentProduct, [name]: value });
      }
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleModalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentProduct) return;
    
    if (!db) {
        alert("Modo Demo: No se pueden guardar cambios en la base de datos real.");
        setIsModalOpen(false);
        return;
    }

    try {
        let imageUrl = currentProduct.imageUrl || '';
        if (imageFile && storage) {
            const storageRef = ref(storage, `products/${Date.now()}_${imageFile.name}`);
            const snapshot = await uploadBytes(storageRef, imageFile);
            imageUrl = await getDownloadURL(snapshot.ref);
        }

        const productData = {
            ...currentProduct,
            price: Number(currentProduct.price),
            stock: Number(currentProduct.stock),
            imageUrl,
        };

        if (currentProduct.id) {
            const productRef = doc(db, 'products', currentProduct.id);
            await updateDoc(productRef, productData);
        } else {
            await addDoc(collection(db, 'products'), productData);
        }

        setIsModalOpen(false);
        setCurrentProduct(null);
    } catch (err) {
        console.error("Error saving product:", err);
        alert("Error al guardar el producto.");
    }
  };
  
  const handleDeleteProduct = async (id: string) => {
      if (!db) {
          alert("Modo Demo: No se pueden eliminar productos.");
          return;
      }
      if (window.confirm('¿Estás seguro de que quieres eliminar este producto?')) {
          await deleteProduct(id);
      }
  };

  const filteredProducts = products.filter(p => 
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <SEO title="Inventario | Admin Panel" description="Gestión avanzada de productos." />
      <div className="space-y-8 max-w-7xl mx-auto">
        {/* Header & Actions */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
              <h1 className="text-3xl font-bold text-navy-dark tracking-tight">Inventario</h1>
              <p className="text-gray-500 mt-1">Gestiona tu catálogo de productos</p>
          </div>
          <div className="flex items-center space-x-3">
              <div className="relative hidden md:block">
                  <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input 
                    type="text" 
                    placeholder="Buscar producto..." 
                    className="pl-10 pr-4 py-2.5 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-electric/20 text-sm w-64"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
              </div>
              <button 
                onClick={() => openModal()} 
                className="flex items-center px-6 py-3 bg-blue-electric text-white font-semibold rounded-full shadow-lg shadow-blue-electric/30 hover:bg-navy-dark transform hover:-translate-y-0.5 transition-all duration-300"
              >
                <PlusIcon className="w-5 h-5 mr-2" />
                Nuevo Producto
              </button>
          </div>
          {/* Mobile Search */}
          <div className="relative md:hidden">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input 
                type="text" 
                placeholder="Buscar producto..." 
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-electric/20 text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
          </div>
        </div>

        {/* Alert if DB is missing */}
        {!db && (
             <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-xl">
                <div className="flex">
                    <div className="flex-shrink-0">⚠️</div>
                    <div className="ml-3">
                        <p className="text-sm text-yellow-700">
                            Modo Demostración: No hay conexión a Firebase. Los cambios no se guardarán.
                        </p>
                    </div>
                </div>
            </div>
        )}

        {/* Modern Product Table */}
        <div className="bg-white shadow-xl shadow-gray-100 rounded-[24px] overflow-hidden border border-gray-100">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50/50 border-b border-gray-100">
                <tr>
                  <th className="px-8 py-5 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Producto</th>
                  <th className="px-6 py-5 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Categoría</th>
                  <th className="px-6 py-5 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Precio</th>
                  <th className="px-6 py-5 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Stock</th>
                  <th className="px-6 py-5 text-right text-xs font-bold text-gray-400 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {loading ? (
                  <tr><td colSpan={5} className="text-center py-12 text-gray-400">Cargando inventario...</td></tr>
                ) : (
                  filteredProducts.length === 0 ? (
                      <tr><td colSpan={5} className="text-center py-12 text-gray-400">No se encontraron productos.</td></tr>
                  ) : (
                      filteredProducts.map(product => (
                      <tr key={product.id} className="group hover:bg-blue-50/30 transition-colors duration-200">
                          <td className="px-8 py-4">
                              <div className="flex items-center">
                                  <div className="h-14 w-14 flex-shrink-0 overflow-hidden rounded-xl border border-gray-100 bg-white">
                                      <img src={product.imageUrl} alt="" className="h-full w-full object-cover object-center" />
                                  </div>
                                  <div className="ml-4">
                                      <div className="font-semibold text-navy-dark">{product.name}</div>
                                      <div className="text-xs text-gray-400 line-clamp-1 max-w-[200px]">{product.description}</div>
                                  </div>
                              </div>
                          </td>
                          <td className="px-6 py-4">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                {product.category}
                              </span>
                          </td>
                          <td className="px-6 py-4 font-medium text-navy-dark">S/{product.price.toFixed(2)}</td>
                          <td className="px-6 py-4">
                              <div className="flex items-center">
                                <div className={`h-2.5 w-2.5 rounded-full mr-2 ${product.stock > 5 ? 'bg-green-500' : product.stock > 0 ? 'bg-yellow-500' : 'bg-red-500'}`}></div>
                                <span className="text-sm text-gray-600">{product.stock} uds.</span>
                              </div>
                          </td>
                          <td className="px-6 py-4 text-right space-x-2">
                            <button 
                                onClick={() => openModal(product)} 
                                className="text-gray-400 hover:text-blue-electric font-medium transition-colors p-2 hover:bg-blue-50 rounded-lg"
                            >
                                Editar
                            </button>
                            <button 
                                onClick={() => handleDeleteProduct(product.id)} 
                                className="text-gray-400 hover:text-red-500 transition-colors p-2 hover:bg-red-50 rounded-lg"
                                aria-label="Eliminar"
                            >
                                <TrashIcon className="w-5 h-5" />
                            </button>
                          </td>
                      </tr>
                      ))
                  )
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Sophisticated Modal */}
        {isModalOpen && currentProduct && (
          <div className="fixed inset-0 z-[100] overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                
                {/* Background overlay, show/hide based on modal state. */}
                <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity" aria-hidden="true" onClick={() => setIsModalOpen(false)}></div>

                {/* Modal panel */}
                <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                <div className="relative inline-block align-bottom bg-white rounded-3xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full">
                    <div className="absolute top-4 right-4">
                        <button onClick={() => setIsModalOpen(false)} className="bg-white rounded-full p-2 hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors">
                            <XIcon className="w-6 h-6" />
                        </button>
                    </div>
                    
                    <div className="bg-white px-8 py-8">
                        <h3 className="text-2xl font-bold text-navy-dark mb-1" id="modal-title">
                            {currentProduct.id ? 'Editar Producto' : 'Nuevo Producto'}
                        </h3>
                        <p className="text-sm text-gray-500 mb-8">Complete la información para actualizar el inventario.</p>
                        
                        <form onSubmit={handleModalSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Col 1 */}
                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Nombre del Producto</label>
                                        <input type="text" name="name" value={currentProduct.name} onChange={handleModalChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-electric focus:ring-2 focus:ring-blue-electric/20 transition-all outline-none" placeholder="Ej. Teclado Mecánico..." required/>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Precio (S/)</label>
                                            <input type="number" step="0.01" name="price" value={currentProduct.price} onChange={handleModalChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-electric focus:ring-2 focus:ring-blue-electric/20 transition-all outline-none" required/>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Stock</label>
                                            <input type="number" name="stock" value={currentProduct.stock} onChange={handleModalChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-electric focus:ring-2 focus:ring-blue-electric/20 transition-all outline-none" required/>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Categoría</label>
                                        <select name="category" value={currentProduct.category} onChange={handleModalChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-electric focus:ring-2 focus:ring-blue-electric/20 transition-all outline-none bg-white">
                                            <option value="">Seleccionar...</option>
                                            <option value="Teclados">Teclados</option>
                                            <option value="Mouses">Mouses</option>
                                            <option value="Monitores">Monitores</option>
                                            <option value="Componentes">Componentes</option>
                                            <option value="Audio">Audio</option>
                                            <option value="Sillas">Sillas</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Col 2 */}
                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Imagen</label>
                                        <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:bg-gray-50 transition-colors">
                                            <input type="file" onChange={handleImageChange} className="hidden" id="file-upload" />
                                            <label htmlFor="file-upload" className="cursor-pointer">
                                                <div className="mx-auto h-12 w-12 text-gray-400">
                                                    <SearchIcon className="w-12 h-12" />
                                                </div>
                                                <p className="mt-2 text-sm text-gray-600 font-medium">Click para subir imagen</p>
                                                <p className="text-xs text-gray-400">PNG, JPG hasta 5MB</p>
                                            </label>
                                            {imageFile && <p className="mt-2 text-sm text-blue-electric font-medium">{imageFile.name}</p>}
                                        </div>
                                        <div className="mt-4 text-center text-gray-400 text-sm">- O -</div>
                                        <input type="text" name="imageUrl" value={currentProduct.imageUrl || ''} onChange={handleModalChange} placeholder="Pegar URL de imagen" className="mt-2 w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-electric focus:ring-2 focus:ring-blue-electric/20 transition-all outline-none text-sm"/>
                                    </div>
                                    <div className="flex items-center p-4 bg-gray-50 rounded-xl">
                                        <input type="checkbox" name="inStock" id="inStock" checked={!!currentProduct.inStock} onChange={handleModalChange} className="h-5 w-5 text-blue-electric rounded border-gray-300 focus:ring-blue-electric cursor-pointer"/>
                                        <label htmlFor="inStock" className="ml-3 block text-sm font-medium text-navy-dark cursor-pointer">Producto Disponible para venta</label>
                                    </div>
                                </div>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Descripción</label>
                                <textarea name="description" value={currentProduct.description || ''} onChange={handleModalChange} rows={3} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-electric focus:ring-2 focus:ring-blue-electric/20 transition-all outline-none resize-none" placeholder="Detalles técnicos y características..."></textarea>
                            </div>

                            <div className="mt-8 flex justify-end gap-3 pt-6 border-t border-gray-100">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-3 bg-white text-gray-700 font-semibold rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors">
                                    Cancelar
                                </button>
                                <button type="submit" className="px-8 py-3 bg-blue-electric text-white font-bold rounded-xl shadow-lg shadow-blue-electric/30 hover:bg-navy-dark transform hover:-translate-y-0.5 transition-all">
                                    {currentProduct.id ? 'Guardar Cambios' : 'Crear Producto'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default AdminProductsPage;
